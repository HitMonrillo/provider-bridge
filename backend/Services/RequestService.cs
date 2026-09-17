using CareCoordinator.Data;
using CareCoordinator.Models;

namespace CareCoordinator.Services;

public class RequestService
{
    private readonly AppDbContext _context;

    public RequestService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Request> CreateRequestAsync(int patientId, int providerId, string description)
    {
        var patient = await _context.Patients.FindAsync(patientId);
        var provider = await _context.Providers.FindAsync(providerId);

        if (patient == null || provider == null)
            throw new InvalidOperationException("Patient or Provider not found");

        var request = new Request
        {
            PatientId = patientId,
            ProviderId = providerId,
            Description = description,
            Status = "sent",
            BilingSummaryEn = GenerateBilingSummaryEn(patient, description),
            BilingSummaryPt = GenerateBilingSummaryPt(patient, description),
            CreatedAt = DateTime.UtcNow
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        // Log initial outreach attempt
        var outreachAttempt = new OutreachAttempt
        {
            RequestId = request.Id,
            Channel = "email",
            Message = request.BilingSummaryEn,
            SentAt = DateTime.UtcNow,
            ResponseReceived = false
        };

        _context.OutreachAttempts.Add(outreachAttempt);
        await _context.SaveChangesAsync();

        return request;
    }

    private string GenerateBilingSummaryEn(Patient patient, string description)
    {
        return $"Request for {patient.Name} (DOB: {patient.DateOfBirth:yyyy-MM-dd})\n\n" +
               $"What's needed: {description}\n\n" +
               $"Please respond within 48 hours if possible.";
    }

    private string GenerateBilingSummaryPt(Patient patient, string description)
    {
        return $"Solicitação para {patient.Name} (Data de nascimento: {patient.DateOfBirth:yyyy-MM-dd})\n\n" +
               $"O que é necessário: {description}\n\n" +
               $"Por favor, responda dentro de 48 horas se possível.";
    }
}
