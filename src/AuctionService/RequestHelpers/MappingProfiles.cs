using AutoMapper;
using AuctionService.Entities;
using AuctionService.DTOs;
namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.item);
        CreateMap<Items, AuctionDto>();
        CreateMap<CreateAuctionDto, Auction>()
            .ForMember(d => d.item, o => o.MapFrom(s => s));
        CreateMap<CreateAuctionDto, Items >();
    }
}   