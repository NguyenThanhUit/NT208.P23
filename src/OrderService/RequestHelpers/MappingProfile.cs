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
            CreateMap<OrderDto, OrderCreated>();
        }
    }
}