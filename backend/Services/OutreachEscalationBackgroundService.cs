namespace CareCoordinator.Services;

public class OutreachEscalationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OutreachEscalationBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);

    public OutreachEscalationBackgroundService(IServiceProvider serviceProvider, ILogger<OutreachEscalationBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Outreach Escalation Background Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var escalationService = scope.ServiceProvider.GetRequiredService<OutreachEscalationService>();
                    await escalationService.CheckAndEscalateOverdueRequestsAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in outreach escalation check");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        _logger.LogInformation("Outreach Escalation Background Service stopped");
    }
}
