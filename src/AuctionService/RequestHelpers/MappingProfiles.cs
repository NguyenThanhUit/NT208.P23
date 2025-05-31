using AuctionService.DTOs;  // Import namespace chứa các DTO
using AuctionService.Entities; // Import namespace chứa các Entity (Auction, Item)
using AutoMapper;  // Import thư viện AutoMapper
using Contracts;
namespace AuctionService.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        // Constructor - cấu hình ánh xạ trong AutoMapper
        public MappingProfiles()
        {
            // Ánh xạ từ Auction sang AuctionDto
            // .IncludeMembers(x => x.Item) -> Lấy dữ liệu từ thuộc tính Item của Auction
            CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);

            // Ánh xạ từ Item sang AuctionDto
            // Điều này giúp AuctionDto lấy được các thuộc tính như Make, Model, Year từ Item
            CreateMap<Item, AuctionDto>();

            // Ánh xạ từ CreateAuctionDto sang Auction
            // Khi ánh xạ, dữ liệu từ CreateAuctionDto sẽ tự động được gán vào Item của Auction
            CreateMap<CreateAuctionDto, Auction>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src));

            // Ánh xạ từ CreateAuctionDto sang Item
            // Điều này giúp tạo một Item mới từ CreateAuctionDto khi khởi tạo Auction
            CreateMap<CreateAuctionDto, Item>();

            //Anh xa du lieu 
            CreateMap<AuctionDto, AuctionCreated>();
            //Anh xa du lieu cho viec Update
            CreateMap<Item, AuctionUpdated>();

        }
    }
}
