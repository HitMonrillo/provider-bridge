namespace CareCoordinator.Models;

public class Request
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int ProviderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "sent"; // sent, acknowledged, overdue, resolved
    public string? BilingSummaryEn { get; set; }
    public string? BilingSummaryPt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    public Patient? Patient { get; set; }
    public ProviderContact? Provider { get; set; }
    public ICollection<OutreachAttempt> OutreachAttempts { get; set; } = new List<OutreachAttempt>();
}
