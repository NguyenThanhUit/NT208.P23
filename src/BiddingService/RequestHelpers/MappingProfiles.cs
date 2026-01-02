using AutoMapper;
using Contracts;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Bid, BidDto>();
        CreateMap<Bid, BidPlaced>();
    }
}