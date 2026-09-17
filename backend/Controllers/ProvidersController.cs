using AutoMapper;
using CareCoordinator.Data;
using CareCoordinator.DTOs;
using CareCoordinator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareCoordinator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvidersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ProvidersController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProviderDto>>> GetProviders()
    {
        var providers = await _context.Providers.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<ProviderDto>>(providers));
    }

    [HttpPost]
    public async Task<ActionResult<ProviderDto>> CreateProvider(CreateProviderDto dto)
    {
        var provider = _mapper.Map<ProviderContact>(dto);
        _context.Providers.Add(provider);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProviders), new { id = provider.Id }, _mapper.Map<ProviderDto>(provider));
    }
}
