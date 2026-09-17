using CareCoordinator.Models;
using Microsoft.EntityFrameworkCore;

namespace CareCoordinator.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Patient> Patients { get; set; }
    public DbSet<ProviderContact> Providers { get; set; }
    public DbSet<Request> Requests { get; set; }
    public DbSet<OutreachAttempt> OutreachAttempts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Patient
        modelBuilder.Entity<Patient>()
            .HasKey(p => p.Id);
        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Requests)
            .WithOne(r => r.Patient)
            .HasForeignKey(r => r.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // ProviderContact
        modelBuilder.Entity<ProviderContact>()
            .HasKey(p => p.Id);
        modelBuilder.Entity<ProviderContact>()
            .HasMany(p => p.Requests)
            .WithOne(r => r.Provider)
            .HasForeignKey(r => r.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Request
        modelBuilder.Entity<Request>()
            .HasKey(r => r.Id);
        modelBuilder.Entity<Request>()
            .HasMany(r => r.OutreachAttempts)
            .WithOne(o => o.Request)
            .HasForeignKey(o => o.RequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
