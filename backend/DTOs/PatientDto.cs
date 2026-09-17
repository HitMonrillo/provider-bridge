namespace CareCoordinator.DTOs;

public class PatientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string PreferredLanguage { get; set; } = "en";
    public DateTime CreatedAt { get; set; }
}

public class CreatePatientDto
{
    public string Name { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string PreferredLanguage { get; set; } = "en";
}
