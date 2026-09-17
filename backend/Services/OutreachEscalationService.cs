using CareCoordinator.Data;
using CareCoordinator.Models;
using Microsoft.EntityFrameworkCore;

namespace CareCoordinator.Services;

public class OutreachEscalationService
{
    private readonly AppDbContext _context;
    private readonly ILogger<OutreachEscalationService> _logger;

    public OutreachEscalationService(AppDbContext context, ILogger<OutreachEscalationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task CheckAndEscalateOverdueRequestsAsync()
    {
        _logger.LogInformation("Checking for overdue requests...");

        var now = DateTime.UtcNow;
        var threshold = TimeSpan.FromHours(48);

        // Find requests that are still "sent" or "acknowledged" and have no response in last 48 hours
        var requests = await _context.Requests
            .Where(r => r.Status != "resolved" && r.Status != "overdue")
            .Include(r => r.OutreachAttempts)
            .Include(r => r.Provider)
            .ToListAsync();

        foreach (var request in requests)
        {
            var lastAttempt = request.OutreachAttempts
                .OrderByDescending(o => o.SentAt)
                .FirstOrDefault();

            if (lastAttempt == null)
                continue;

            // Check if last attempt was > 48 hours ago and no response
            if (!lastAttempt.ResponseReceived && (now - lastAttempt.SentAt) > threshold)
            {
                _logger.LogInformation($"Escalating request {request.Id} - overdue");

                // Mark as overdue
                request.Status = "overdue";

                // Auto-draft follow-up in alternate channel
                var alternateChannel = lastAttempt.Channel == "email" ? "whatsapp" : "email";
                var followUpMessage = GenerateFollowUpMessage(request, lastAttempt.Channel, alternateChannel);

                var escalationAttempt = new OutreachAttempt
                {
                    RequestId = request.Id,
                    Channel = alternateChannel,
                    Message = followUpMessage,
                    SentAt = now,
                    ResponseReceived = false
                };

                _context.OutreachAttempts.Add(escalationAttempt);
                _logger.LogInformation($"Auto-drafted follow-up in {alternateChannel} for request {request.Id}");
            }
        }

        await _context.SaveChangesAsync();
    }

    private string GenerateFollowUpMessage(Request request, string previousChannel, string newChannel)
    {
        return $"FOLLOW-UP: Previous {previousChannel} message to {request.Provider?.Name} went unanswered.\n\n" +
               $"Request for: {request.Patient?.Name}\n" +
               $"Original description: {request.Description}\n\n" +
               $"Sending via {newChannel} as follow-up.\n\n" +
               $"Please confirm receipt and provide estimated response time.";
    }
}
