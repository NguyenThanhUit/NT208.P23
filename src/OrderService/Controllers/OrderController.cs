using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using AutoMapper;
using MassTransit;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using OrderService.DTOs;
using OrderService.Entities;
using Contracts;

namespace OrderService.Controllers;

[ApiController]
[Route("api/orders")] // Định nghĩa route API: tất cả endpoint sẽ có tiền tố /api/Orders
public class OrderController : ControllerBase
{
    private readonly OrderDbContext _context;  // Đối tượng truy xuất dữ liệu
    private readonly IMapper _mapper;  // Công cụ ánh xạ dữ liệu giữa DTO và Entity
    private readonly IPublishEndpoint _publishEndpoint;  // MassTransit publish event khi có đơn hàng mới

    public OrderController(OrderDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    /// <summary>
    /// API lấy danh sách tất cả đơn hàng
    /// </summary>
    /// <returns>Danh sách đơn hàng dưới dạng OrderDto</returns>
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAllOrders()
    {
        var query = _context.Orders
            .Include(x => x.Product)  // Load thông tin sản phẩm kèm theo đơn hàng để tránh lỗi NullReferenceException
            .OrderBy(x => x.Product != null ? x.Product.Name : "") // Sắp xếp theo tên sản phẩm (nếu có)
            .AsQueryable();  // Chuyển đổi thành truy vấn Linq

        // Chuyển đổi kết quả từ Order -> OrderDto trước khi trả về
        var result = await query.ProjectTo<OrderDto>(_mapper.ConfigurationProvider).ToListAsync();
        return Ok(result); // Trả về danh sách đơn hàng
    }

    /// <summary>
    /// API lấy thông tin đơn hàng theo ID
    /// </summary>
    /// <param name="id">ID của đơn hàng</param>
    /// <returns>Chi tiết đơn hàng dưới dạng OrderDto</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(Guid id)

    {
        // Tìm đơn hàng theo ID, bao gồm cả thông tin sản phẩm liên quan
        var order = await _context.Orders.Include(x => x.Product).FirstOrDefaultAsync(x => x.Id == id);
        if (order == null) return NotFound(); // Nếu không tìm thấy, trả về lỗi 404

        return _mapper.Map<OrderDto>(order); // Chuyển đổi sang DTO và trả về kết quả
    }

    /// <summary>
    /// API tạo đơn hàng mới
    /// </summary>
    /// <param name="orderDto">Dữ liệu đơn hàng gửi lên</param>
    /// <returns>Đơn hàng đã tạo</returns>
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto orderDto)
    {
        // Chuyển đổi từ DTO sang Entity để lưu vào database
        var order = _mapper.Map<Order>(orderDto);

        // Tạm thời đặt Seller là "Test", có thể thay thế bằng user từ authentication
        order.Seller = "Test";

        // Thêm đơn hàng vào context
        _context.Orders.Add(order);

        // Lưu thay đổi vào database
        var result = await _context.SaveChangesAsync() > 0;

        // Chuyển đổi lại sang OrderDto để trả về client
        var newOrder = _mapper.Map<OrderDto>(order);


        // Gửi sự kiện qua MassTransit để xử lý async (ví dụ: thông báo hoặc cập nhật tồn kho)
        await _publishEndpoint.Publish(_mapper.Map<OrderCreated>(newOrder));

        // Nếu lưu thất bại, trả về lỗi 400
        if (!result) return BadRequest("Could not save to DB");

        // Trả về HTTP 201 Created với đường dẫn API của đơn hàng vừa tạo
        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, newOrder);
    }
    /// <summary>
    /// API cập nhật thông tin đơn hàng theo ID
    /// </summary>
    /// <param name="id">ID của đơn hàng cần cập nhật</param>
    /// <param name="orderDto">Dữ liệu đơn hàng cập nhật gửi lên</param>
    /// <returns>Thông tin đơn hàng đã cập nhật</returns>
    [HttpPost("{id}/update")]
    public async Task<ActionResult<OrderDto>> UpdateOrder(Guid id, [FromBody] UpdateOrderDto orderDto)
    {
        // Tìm đơn hàng theo ID
        var order = await _context.Orders.FirstOrDefaultAsync(x => x.Id == id);
        if (order == null) return NotFound(); // Nếu không tìm thấy, trả về lỗi 404

        // Cập nhật thông tin đơn hàng
        _mapper.Map(orderDto, order); // Ánh xạ từ UpdateOrderDto sang Order entity

        // Lưu lại thay đổi vào database
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not update the order.");

        // Chuyển đổi Order entity sang DTO để trả về client
        var updatedOrder = _mapper.Map<OrderDto>(order);

        // Gửi sự kiện qua MassTransit để xử lý async (ví dụ: thông báo hoặc cập nhật tồn kho)
        await _publishEndpoint.Publish(_mapper.Map<OrderUpdated>(updatedOrder));

        return Ok(updatedOrder); // Trả về thông tin đơn hàng đã cập nhật
    }
    public class UpdateOrderDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public string Seller { get; set; }
        // Thêm các thuộc tính khác nếu cần
    }

}
