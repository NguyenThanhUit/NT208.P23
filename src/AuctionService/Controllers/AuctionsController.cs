using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AuctionService.DTOs;
using AuctionService.Data;
using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

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

        private string UserId => User.FindFirst("sub")?.Value;

        // GET: api/auctions
        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
        {
            var auctions = await _context.Auctions
                .Include(x => x.Item)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(_mapper.Map<List<AuctionDto>>(auctions));
        }

        // GET: api/auctions/{id}
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

        // POST: api/auctions
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] AuctionDto auctionDto)
        {
            var auction = _mapper.Map<Auction>(auctionDto);
            auction.ID = Guid.NewGuid();
            auction.CreatedAt = DateTime.UtcNow;
            auction.SellerID = UserId;

            if (auction.Item != null)
            {
                auction.Item.ID = Guid.NewGuid();
            }

            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<AuctionDto>(auction);

            return CreatedAtAction(nameof(GetAuctionById), new { id = auction.ID }, resultDto);
        }

        // PUT: api/auctions/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateAuction(Guid id, [FromBody] UpdateAuctionDto updateDto)
        {
            var auction = await _context.Auctions
                .Include(x => x.Item)
                .FirstOrDefaultAsync(x => x.ID == id);

            if (auction == null)
                return NotFound();

            if (auction.SellerID != UserId)
                return Forbid();

            if (updateDto.Name != null)
                auction.Item.Name = updateDto.Name;
            if (updateDto.Description != null)
                auction.Item.Description = updateDto.Description;
            if (updateDto.Category != null)
                auction.Item.Category = updateDto.Category;
            if (updateDto.Price.HasValue)
                auction.Item.Price = updateDto.Price.Value;

            _context.Auctions.Update(auction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/auctions/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions.FindAsync(id);

            if (auction == null)
                return NotFound();

            if (auction.SellerID != UserId)
                return Forbid();

            _context.Auctions.Remove(auction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/auctions/{id}/bid
        [HttpPost("{id}/bid")]
        [Authorize]
        public async Task<IActionResult> PlaceBid(Guid id, [FromBody] BidDto bidDto)
        {
            var auction = await _context.Auctions
                .FirstOrDefaultAsync(x => x.ID == id);

            if (auction == null)
                return NotFound();

            if (auction.EndAt < DateTime.UtcNow)
                return BadRequest("Auction has ended.");

            if (bidDto.Amount <= auction.CurrentHighBid)
                return BadRequest("Bid must be higher than current price.");

            var bid = new Bid
            {
                AuctionID = id,
                BidderID = UserId,
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