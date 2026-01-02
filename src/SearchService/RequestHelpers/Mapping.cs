using AutoMapper;
using Contracts;
namespace SearchService;

//Class nay dung de anh xa du lieu Order(OrderService) duoc tao vao Product(SearchService)
public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<OrderCreated, Product>();
        CreateMap<AuctionCreated, Item>();
    }
}