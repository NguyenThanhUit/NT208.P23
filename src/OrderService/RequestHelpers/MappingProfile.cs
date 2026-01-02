using AutoMapper;
using OrderService.DTOs;
using OrderService.Entities;
using Contracts;
using static OrderService.Controllers.OrderController;
namespace OrderService.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {

            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .IncludeMembers(x => x.Product);
            CreateMap<UpdateOrderDto, Product>();
            CreateMap<OrderDto, OrderCreated>();


            CreateMap<Product, OrderDto>();
            CreateMap<CreateOrderDto, Order>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src));
            CreateMap<CreateOrderDto, Product>();
            CreateMap<OrderDto, OrderUpdated>()
      .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.Id))
      .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => Guid.Parse(src.ProductId)))
      .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.StockQuantity))
      .ForMember(dest => dest.Seller, opt => opt.MapFrom(src => src.Seller))
      .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
      .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
      .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
      .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
      .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
      .ForMember(dest => dest.Key, opt => opt.MapFrom(src => src.Key));


            CreateMap<OrderDto, CreateOrderDto>();
            CreateMap<BuyingPlaced, Product>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ProductName))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => 0));
        }
    }
}