using AutoMapper;
using BuyingService.Models;
using Contracts;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, OrderDto>();
        CreateMap<Buying, BuyingDto>().ForMember(dest => dest.SellerId,
                       opt => opt.MapFrom(src => src.Items.FirstOrDefault() != null ? src.Items.First().Seller : string.Empty));


        CreateMap<Buying, BuyingPlaced>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ID))
            .ForMember(dest => dest.orderID, opt => opt.MapFrom(src => src.ID))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
            .ForMember(dest => dest.createdAt, opt => opt.MapFrom(src => src.CreatedAt))

            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src =>
                src.Items.Count > 0 ? src.Items[0].ProductName : null))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Items.Count > 0 ? src.Items[0].Quantity : 0));
        CreateMap<OrderCreated, Order>();
    }
}
