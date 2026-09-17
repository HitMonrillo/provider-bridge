namespace CareCoordinator.DTOs;

public class OutreachAttemptDto
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string? Message { get; set; }
    public DateTime SentAt { get; set; }
    public bool ResponseReceived { get; set; }
    public string? ResponseMessage { get; set; }
    public DateTime? ResponseReceivedAt { get; set; }
}
