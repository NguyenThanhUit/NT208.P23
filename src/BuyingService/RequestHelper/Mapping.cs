using AutoMapper;
using BuyingService.Models;
using Contracts;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, OrderDto>();
        // Mapping for Buying to BuyingDto
        CreateMap<Buying, BuyingDto>();

        // Mapping for Buying to BuyingPlaced
        CreateMap<Buying, BuyingPlaced>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ID))
            .ForMember(dest => dest.orderID, opt => opt.MapFrom(src => src.ID)) // or src.OrderId if preferred
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
            .ForMember(dest => dest.createdAt, opt => opt.MapFrom(src => src.CreatedAt))
            // Ensure ProductName is correctly mapped from the first Order item in the Items list
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src =>
                src.Items.Count > 0 ? src.Items[0].ProductName : null))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Items.Count > 0 ? src.Items[0].Quantity : 0));

        // Mapping for OrderCreated to Order (if required)
        CreateMap<OrderCreated, Order>();
    }
}
