using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace AuctionService.Controllers;

[ApiController]
[Route("api/Auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    private readonly IPublishEndpoint _publishEndpoint;
    public AuctionsController(AuctionDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }


    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string? date)
    {
        var query = _context.Auctions.OrderBy(x => x.Item.Name).AsQueryable();
        if (!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }
        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (auction == null)
            return NotFound();
        return _mapper.Map<AuctionDto>(auction);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("User is not authenticated");
        }
        auction.Seller = username;

        _context.Auctions.Add(auction);


        var result = await _context.SaveChangesAsync() > 0;

        var newAuction = _mapper.Map<AuctionDto>(auction);
        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        if (!result) return BadRequest("Could not save changes to the DB");

        return CreatedAtAction(nameof(GetAuctionById), new { id = auction.Id }, newAuction);
    }




    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _context.Auctions.Include(x => x.Item).FirstOrDefaultAsync(x => x.Id == id);
        if (auction == null) return NotFound();


        auction.Item.Name = updateAuctionDto.Name ?? auction.Item.Name;
        auction.Item.Description = updateAuctionDto.Description ?? auction.Item.Description;
        auction.Item.Category = updateAuctionDto.Category ?? auction.Item.Category;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
        auction.Item.Key = updateAuctionDto.Key ?? auction.Item.Key;

        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok();
        return BadRequest("Problem saving changes");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _context.Auctions.FindAsync(id);
        if (auction == null) return NotFound();
        _context.Auctions.Remove(auction);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Could not update DB");
        return Ok();
    }
    [Authorize]
    [HttpGet("my-wins")]
    public async Task<ActionResult<List<AuctionDto>>> GetAuctionsUserWon()
    {
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("User is not authenticated");
        }
        var auctionsWon = await _context.Auctions
            .Include(a => a.Item)
            .Where(a => a.Status == Status.Finish && a.Winner == username)
            .OrderByDescending(a => a.UpdatedAt)
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return auctionsWon;
    }
    [Authorize]
    [HttpPost("confirm-key/{id}")]
    public async Task<ActionResult> ConfirmKey(Guid id)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
            return Unauthorized("User is not authenticated");

        var auction = await _context.Auctions.FirstOrDefaultAsync(x => x.Id == id);
        if (auction == null)
            return NotFound("Auction not found");

        if (auction.Winner != username)
            return Forbid("Bạn không phải là người chiến thắng phiên đấu giá này");

        if (auction.IsKeyConfirmed == true)
            return BadRequest("Bạn đã xác nhận key này trước đó");

        auction.IsKeyConfirmed = true;

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Không thể lưu xác nhận vào cơ sở dữ liệu");

        await _publishEndpoint.Publish(new AuctionKeyConfirmed
        {
            AuctionID = auction.Id,
            Seller = auction.Seller,
            Amount = auction.SoldAmount ?? 0
        });

        return Ok("Đã xác nhận key hợp lệ và sẽ xử lý thanh toán cho người bán.");
    }





}