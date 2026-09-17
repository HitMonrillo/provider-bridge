using AutoMapper;
using CareCoordinator.Data;
using CareCoordinator.DTOs;
using CareCoordinator.Models;
using CareCoordinator.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareCoordinator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly RequestService _requestService;
    private readonly OutreachEscalationService _escalationService;

    public RequestsController(
        AppDbContext context,
        IMapper mapper,
        RequestService requestService,
        OutreachEscalationService escalationService)
    {
        _context = context;
        _mapper = mapper;
        _requestService = requestService;
        _escalationService = escalationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequests()
    {
        var requests = await _context.Requests
            .Include(r => r.Patient)
            .Include(r => r.Provider)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<RequestDto>>(requests));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RequestDto>> GetRequest(int id)
    {
        var request = await _context.Requests
            .Include(r => r.Patient)
            .Include(r => r.Provider)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
            return NotFound();

        return Ok(_mapper.Map<RequestDto>(request));
    }

    [HttpPost]
    public async Task<ActionResult<RequestDto>> CreateRequest(CreateRequestDto dto)
    {
        var request = await _requestService.CreateRequestAsync(dto.PatientId, dto.ProviderId, dto.Description);
        var requestDto = _mapper.Map<RequestDto>(request);

        return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, requestDto);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<RequestDto>> UpdateRequestStatus(int id, UpdateRequestStatusDto dto)
    {
        var request = await _context.Requests
            .Include(r => r.Patient)
            .Include(r => r.Provider)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
            return NotFound();

        request.Status = dto.Status;
        if (dto.Status == "resolved")
            request.ResolvedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<RequestDto>(request));
    }

    [HttpGet("{id}/outreach-attempts")]
    public async Task<ActionResult<IEnumerable<OutreachAttemptDto>>> GetOutreachAttempts(int id)
    {
        var attempts = await _context.OutreachAttempts
            .Where(o => o.RequestId == id)
            .OrderByDescending(o => o.SentAt)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<OutreachAttemptDto>>(attempts));
    }

    [HttpPost("check-overdue")]
    public async Task<ActionResult<object>> CheckOverdue()
    {
        await _escalationService.CheckAndEscalateOverdueRequestsAsync();
        return Ok(new { message = "Overdue check completed" });
    }
}
