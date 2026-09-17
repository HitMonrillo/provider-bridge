using AutoMapper;
using CareCoordinator.DTOs;
using CareCoordinator.Models;

namespace CareCoordinator.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Patient, PatientDto>().ReverseMap();
        CreateMap<CreatePatientDto, Patient>();

        CreateMap<ProviderContact, ProviderDto>().ReverseMap();
        CreateMap<CreateProviderDto, ProviderContact>();

        CreateMap<Request, RequestDto>()
            .ForMember(d => d.Patient, opt => opt.MapFrom(s => s.Patient))
            .ForMember(d => d.Provider, opt => opt.MapFrom(s => s.Provider))
            .ReverseMap();
        CreateMap<CreateRequestDto, Request>();

        CreateMap<OutreachAttempt, OutreachAttemptDto>().ReverseMap();
    }
}
