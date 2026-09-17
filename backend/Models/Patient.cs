namespace CareCoordinator.Models;

public class Patient
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string PreferredLanguage { get; set; } = "en";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
