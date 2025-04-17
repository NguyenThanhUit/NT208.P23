// Models/OrderStatus.cs
namespace BuyingService.Models
{
    public enum BuyingStatus
    {
        Pending,     // Đang chờ
        Paid,        // Đã thanh toán
        Completed,   // Đã hoàn thành
        Cancelled    // Đã hủy
    }
}
