using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using AutoMapper;
using MassTransit;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using OrderService.DTOs;
using OrderService.Entities;
using Contracts;
using Microsoft.AspNetCore.Authorization;

namespace OrderService.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly OrderDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<OrderController> _logger;

    public OrderController(OrderDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint, ILogger<OrderController> logger)
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }


    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAllOrders()
    {
        var query = _context.Orders
            .Include(x => x.Product)
            .OrderBy(x => x.Product != null ? x.Product.Name : "")
            .AsQueryable();


        var result = await query.ProjectTo<OrderDto>(_mapper.ConfigurationProvider).ToListAsync();
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(Guid id)

    {

        var order = await _context.Orders.Include(x => x.Product).FirstOrDefaultAsync(x => x.Id == id);
        if (order == null) return NotFound();

        return _mapper.Map<OrderDto>(order);
    }


    [Authorize]
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto orderDto)
    {

        var order = _mapper.Map<Order>(orderDto);


        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("User is not authenticated");
        }
        order.Seller = username;
        // order.Seller = "Test";


        _context.Orders.Add(order);


        var result = await _context.SaveChangesAsync() > 0;


        var newOrder = _mapper.Map<OrderDto>(order);



        await _publishEndpoint.Publish(_mapper.Map<OrderCreated>(newOrder));


        if (!result) return BadRequest("Could not save to DB");


        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, newOrder);
    }
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto>> UpdateOrder(Guid id, [FromBody] UpdateOrderDto orderDto)
    {
        var order = await _context.Orders
            .Include(o => o.Product)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        if (order.Seller != User.Identity?.Name)
        {
            return Forbid();
        }


        if (order.Product.Id != order.ProductId)
        {
            return Problem(
                statusCode: 400
            );
        }
        var product = order.Product;
        product.Name = orderDto.Name;
        product.ImageUrl = orderDto.ImageUrl;
        product.Price = orderDto.Price;
        product.Description = orderDto.Description;
        product.Category = orderDto.Category;
        product.Key = orderDto.Key;
        var result = await _context.SaveChangesAsync() > 0;
        var updatedOrder = _mapper.Map<OrderDto>(order);
        await _publishEndpoint.Publish(_mapper.Map<OrderUpdated>(updatedOrder));
        return Ok(updatedOrder);
    }


    [HttpGet("by-seller/{sellerName}")]
    public async Task<ActionResult<List<OrderDto>>> GetOrdersBySeller(string sellerName)
    {
        var orders = await _context.Orders
            .Include(o => o.Product)
            .Where(o => o.Seller == sellerName)
            .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        if (orders == null || !orders.Any())
        {
            return NotFound($"No orders found for seller: {sellerName}");
        }

        return Ok(orders);
    }



    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteOrder(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order.Seller != User.Identity?.Name) return Forbid();
        if (order == null) return NotFound();
        _context.Orders.Remove(order);
        await _publishEndpoint.Publish<ProductDeleted>(new { Id = order.Id.ToString() });
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest();
        return Ok();
    }
    public class UpdateOrderDto
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Key { get; set; }
    }

}