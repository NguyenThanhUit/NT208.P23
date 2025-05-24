using Microsoft.AspNetCore.Mvc;
using AuctionService.DTOs;
using AuctionService.Data;
using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AuctionService.Controllers
{
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

        // List all auctions
        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
        {
            var auctions = await _context.Auctions
                .Include(x => x.Item)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(_mapper.Map<List<AuctionDto>>(auctions));
        }

        // Get details of a specific auction
        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
        {
            var auction = await _context.Auctions
                .Include(x => x.Item)
                .FirstOrDefaultAsync(x => x.ID == id);

            if (auction == null)
                return NotFound();

            return Ok(_mapper.Map<AuctionDto>(auction));
        }

        // Create a new auction
        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] AuctionDto auctionDto)
        {
            var auction = _mapper.Map<Auction>(auctionDto);
            auction.ID = Guid.NewGuid();
            auction.CreatedAt = DateTime.UtcNow;
            // TODO: Set SellerID from authenticated user
            auction.SellerID = "test";

            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<AuctionDto>(auction);

            return CreatedAtAction(nameof(GetAuctionById), new { id = auction.ID }, resultDto);
        }

        // Update an existing auction
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(Guid id, [FromBody] UpdateAuctionDto updateDto)
        {
            var auction = await _context.Auctions.Include(x => x.Item)
                .FirstOrDefaultAsync(x => x.ID == id);

            if (auction == null)
                return NotFound();

            // TODO: Check if the authenticated user is the seller

            // Update only provided fields
            auction.Item.Name = updateDto.Name ?? auction.Item.Name;
            auction.Item.Description = updateDto.Description ?? auction.Item.Description;
            auction.Item.Category = updateDto.Category ?? auction.Item.Category;
            auction.Item.Price = updateDto.Price ?? auction.Item.Price;

            _context.Auctions.Update(auction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete an auction
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions.FindAsync(id);

            if (auction == null)
                return NotFound();

            // TODO: Check if the authenticated user is the seller

            _context.Auctions.Remove(auction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Place a bid on an auction
        [HttpPost("{id}/bid")]
        public async Task<IActionResult> PlaceBid(Guid id, [FromBody] BidDto bidDto)
        {
            var auction = await _context.Auctions.FirstOrDefaultAsync(x => x.ID == id);

            if (auction == null)
                return NotFound();

            if (auction.EndAt < DateTime.UtcNow)
                return BadRequest("Auction has ended.");

            if (bidDto.Amount <= auction.CurrentHighBid)
                return BadRequest("Bid must be higher than current price.");

            // TODO: Set BidderID from authenticated user
            var bid = new Bid
            {
                AuctionID = id,
                BidderID = "test",
                Amount = bidDto.Amount,
                PlacedAt = DateTime.UtcNow
            };

            auction.CurrentHighBid = bidDto.Amount;
            auction.WinnerID = bid.BidderID;

            _context.Bids.Add(bid);
            _context.Auctions.Update(auction);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}