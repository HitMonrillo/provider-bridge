namespace CareCoordinator.Models;

public class OutreachAttempt
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public string Channel { get; set; } = string.Empty; // email, whatsapp, fax
    public string? Message { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool ResponseReceived { get; set; } = false;
    public string? ResponseMessage { get; set; }
    public DateTime? ResponseReceivedAt { get; set; }

    public Request? Request { get; set; }
}
