using AutoMapper;
using OrderService.DTOs;
using OrderService.Entities;
using Contracts;
namespace OrderService.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //Anh xa Order sang OrderDto va lay thuoc tinh Product
            CreateMap<Order, OrderDto>().IncludeMembers(x => x.Product);
            //Anh xa tu Product sang OrderDto, giup cho OrderDto lay duoc cai thuoc tinh cua Product
            CreateMap<Product, OrderDto>();
            //Anh xa tu CreateOrderDto sang Order
            //Khi anh xa du lieu cua CreateOrderDto se duoc tu dong gan vao Product cua Order
            CreateMap<CreateOrderDto, Order>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src));

            //Anh xa tu createOrderDto sang Product
            //Cho phep mot item moi duoc tao tu Create OrderDto khi khoi tao Order
            CreateMap<CreateOrderDto, Product>();
            //Anh xa du lieu 
            CreateMap<OrderDto, OrderCreated>()
    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => (int)src.Id.GetHashCode()));

            CreateMap<OrderDto, CreateOrderDto>();
            CreateMap<BuyingPlaced, Product>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ProductName))  // Map ProductName từ BuyingPlaced
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.TotalAmount))  // Tổng giá trị từ BuyingPlaced
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => 0));  // Sử dụng một giá trị mặc định cho StockQuantity nếu cần
        }
    }
}