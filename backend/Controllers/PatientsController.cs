using AutoMapper;
using CareCoordinator.Data;
using CareCoordinator.DTOs;
using CareCoordinator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareCoordinator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public PatientsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients()
    {
        var patients = await _context.Patients.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<PatientDto>>(patients));
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> CreatePatient(CreatePatientDto dto)
    {
        var patient = _mapper.Map<Patient>(dto);
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPatients), new { id = patient.Id }, _mapper.Map<PatientDto>(patient));
    }
}
