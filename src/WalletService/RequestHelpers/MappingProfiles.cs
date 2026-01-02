using AutoMapper;
using Contracts;
using WalletService.Models;

namespace WalletService
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<BuyingPlaced, Wallet>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Buyer))
                .ForMember(dest => dest.Balance, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.ID, opt => opt.Ignore());
        }
    }
}
