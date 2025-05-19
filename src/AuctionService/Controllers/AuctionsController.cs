using Microsoft.AspNetCore.Mvc;
using AuctionService.DTOs;
using AuctionService.Data;
using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;
    public AuctionsController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
    {
        var auctions = await _context.Auctions
            .Include(x => x.item)
            .OrderBy(x => x.item.name)
            .ToListAsync();
        return _mapper.Map<List<AuctionDto>>(auctions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionByID(Guid id)
    {
        var auction = await _context.Auctions
            .Include(x => x.item)
            .FirstOrDefaultAsync(x => x.ID == id);

        if (auction == null) return NotFound();

        return _mapper.Map<AuctionDto>(auction);
    }
    
    //Create updata and delete auction
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(AuctionDto auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        auction.sellerID = "test"; //TODO: get the user id from the token
        _context.Auctions.Add(auction);

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Couldn't create auction");
        return CreatedAtAction(nameof(GetAuctionByID), new { auction.ID }, _mapper.Map<AuctionDto>(auction));
    }
    [HttpPut("{id}")]
    public async Task<ActionResult<AuctionDto>> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _context.Auctions.Include(x => x.item)
            .FirstOrDefaultAsync(x => x.ID == id);
        if (auction == null) return NotFound();

        //TODO: check seller == username
        auction.item.name = updateAuctionDto.name ?? auction.item.name;
        auction.item.des = updateAuctionDto.des ?? auction.item.des;
        auction.item.category = updateAuctionDto.category ?? auction.item.category;
        auction.item.price = updateAuctionDto.price ?? auction.item.price;

        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok();
        return BadRequest("Problems in saving changes");
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _context.Auctions.FindAsync(id);

        if (auction == null) return NotFound();

        //TODO: check seller == username
        _context.Auctions.Remove(auction);
        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Couldn't delete auction");
        return Ok();

    }
    
}