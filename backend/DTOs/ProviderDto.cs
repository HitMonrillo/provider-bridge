namespace CareCoordinator.DTOs;

public class ProviderDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string Timezone { get; set; } = "UTC";
    public DateTime CreatedAt { get; set; }
}

public class CreateProviderDto
{
    public string Name { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string Timezone { get; set; } = "UTC";
}
