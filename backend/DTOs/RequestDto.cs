namespace CareCoordinator.DTOs;

public class RequestDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int ProviderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? BilingSummaryEn { get; set; }
    public string? BilingSummaryPt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public PatientDto? Patient { get; set; }
    public ProviderDto? Provider { get; set; }
}

public class CreateRequestDto
{
    public int PatientId { get; set; }
    public int ProviderId { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class UpdateRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
}
