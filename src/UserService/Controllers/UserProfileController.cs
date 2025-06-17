using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

public interface IUserProfileContext
{
    IMongoCollection<UserProfile> UserProfiles { get; }
}

[ApiController]
[Route("api/profile")]
public class UserProfileController : ControllerBase
{
    private readonly IUserProfileContext _context;
    private readonly ILogger<UserProfileController> _logger;

    public UserProfileController(IUserProfileContext context, ILogger<UserProfileController> logger)
    {
        _context = context;
        _logger = logger;
    }
    [Authorize]
    [HttpPost("register")]
    public async Task<IActionResult> RegisterProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("Không tìm thấy userId trong token.");
        }

        var existing = await _context.UserProfiles.Find(p => p.UserId == userId).FirstOrDefaultAsync();
        if (existing != null)
        {
            return Ok(new { message = "Thông tin người dùng đã tồn tại." });
        }

        var address = User.FindFirst("address")?.Value;
        var name = User.FindFirst("name")?.Value ?? User.FindFirst("preferred_username")?.Value ?? "Unknown";
        var username = User.FindFirst("username")?.Value;
        string role = username?.ToLower() == "admin" ? "admin" : "user";

        var createdAtClaim = User.FindFirst("createdAt")?.Value;
        DateTime createdAt;
        if (!DateTime.TryParse(createdAtClaim, out createdAt))
        {
            createdAt = DateTime.UtcNow;
        }

        var profile = new UserProfile
        {
            UserId = userId,
            UserName = username,
            Address = address,
            FullName = name,
            CreatedAt = createdAt,
            VerificationStatus = "none",
            IsSeller = false,
            Role = role
        };

        await _context.UserProfiles.InsertOneAsync(profile);

        return Ok(new { message = "Đã tạo hồ sơ người dùng thành công." });
    }



    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var profile = await _context.UserProfiles.Find(p => p.UserId == userId).FirstOrDefaultAsync();
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    [Authorize]
    [HttpPost("seller-request")]
    public async Task<IActionResult> SubmitSellerRequest([FromBody] SellerRequestDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var existing = await _context.UserProfiles.Find(p => p.UserId == userId).FirstOrDefaultAsync();

        if (existing == null)
        {
            var profile = new UserProfile
            {
                IdCardNumber = dto.IdCardNumber,
                IdCardImageUrl = dto.IdCardImageUrl,
                BankAccount = dto.BankAccount,
                VerificationStatus = "pending"
            };
            await _context.UserProfiles.InsertOneAsync(profile);
        }
        else
        {
            var update = Builders<UserProfile>.Update
                .Set(p => p.IdCardNumber, dto.IdCardNumber)
                .Set(p => p.IdCardImageUrl, dto.IdCardImageUrl)
                .Set(p => p.BankAccount, dto.BankAccount)
                .Set(p => p.VerificationStatus, "pending")
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _context.UserProfiles.UpdateOneAsync(p => p.UserId == userId, update);
        }

        return Ok(new { message = "Đã gửi yêu cầu xác minh trở thành người bán." });
    }

    [Authorize]
    [HttpPut("approve/{userId}")]
    public async Task<IActionResult> ApproveSeller(string userId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _context.UserProfiles.Find(p => p.UserId == currentUserId).FirstOrDefaultAsync();
        if (currentUser == null || currentUser.Role != "admin")
            return Forbid();
        var update = Builders<UserProfile>.Update
            .Set(p => p.VerificationStatus, "approved")
            .Set(p => p.IsSeller, true)
            .Set(p => p.RejectionReason, null)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        var result = await _context.UserProfiles.UpdateOneAsync(p => p.UserId == userId, update);
        if (result.ModifiedCount == 0) return NotFound();
        return Ok(new { message = "Đã phê duyệt người bán." });
    }

    [Authorize]
    [HttpPut("reject/{userId}")]
    public async Task<IActionResult> RejectSeller(string userId, [FromBody] string reason)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _context.UserProfiles.Find(p => p.UserId == currentUserId).FirstOrDefaultAsync();
        if (currentUser == null || currentUser.Role != "admin")
            return Forbid();
        var update = Builders<UserProfile>.Update
            .Set(p => p.VerificationStatus, "rejected")
            .Set(p => p.IsSeller, false)
            .Set(p => p.RejectionReason, reason)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        var result = await _context.UserProfiles.UpdateOneAsync(p => p.UserId == userId, update);
        if (result.ModifiedCount == 0) return NotFound();
        return Ok(new { message = "Đã từ chối người bán." });
    }
    [Authorize]
    [HttpGet("pending-sellers")]
    public async Task<IActionResult> GetPendingSellers()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var user = await _context.UserProfiles.Find(p => p.UserId == userId).FirstOrDefaultAsync();

        if (user == null || user.Role != "admin")
            return Forbid();

        var pendingSellers = await _context.UserProfiles
            .Find(p => p.VerificationStatus == "pending")
            .ToListAsync();

        return Ok(pendingSellers);
    }
    [Authorize]
    [HttpGet("pending-sellers/{userId}")]
    public async Task<IActionResult> GetPendingSellerById(string userId)
    {

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUser = await _context.UserProfiles.Find(p => p.UserId == currentUserId).FirstOrDefaultAsync();
        if (currentUser == null || currentUser.Role != "admin")
            return Forbid();

        var seller = await _context.UserProfiles.Find(p =>
            p.UserId == userId &&
            (p.VerificationStatus == "pending" || p.VerificationStatus == "approved" || p.VerificationStatus == "rejected"))
            .FirstOrDefaultAsync();

        if (seller == null)
        {
            return NotFound(new { message = "Không tìm thấy người bán hoặc người bán không trong trạng thái hợp lệ." });
        }

        return Ok(seller);
    }
    [AllowAnonymous]
    [HttpGet("seller/{username}")]
    public async Task<IActionResult> GetSellerInfo(string username)
    {
        var seller = await _context.UserProfiles.Find(p =>
            p.UserName == username &&
            p.IsSeller == true &&
            p.VerificationStatus == "approved").FirstOrDefaultAsync();

        if (seller == null)
        {
            return NotFound(new { message = "Không tìm thấy người bán hợp lệ." });
        }
        var response = new
        {
            seller.FullName,
            seller.Address,
            seller.CreatedAt
        };
        return Ok(response);
    }
    [Authorize]
    [HttpPost("rate-seller/{username}")]
    public async Task<IActionResult> RateSeller([FromRoute] string username, [FromBody] SellerRatingDto dto)
    {
        var buyerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (dto.Stars < 1 || dto.Stars > 5)
            return BadRequest("Số sao đánh giá phải từ 1 đến 5.");

        var currentUsername = User.FindFirst("username")?.Value;
        if (currentUsername == username)
            return BadRequest("Không thể tự đánh giá bản thân.");

        var seller = await _context.UserProfiles
            .Find(p => p.UserName == username && p.IsSeller && p.VerificationStatus == "approved")
            .FirstOrDefaultAsync();

        if (seller == null)
            return NotFound(new { message = "Không tìm thấy người bán hợp lệ để đánh giá." });

        var newRating = new Rating
        {
            ReviewerId = buyerId,
            Stars = dto.Stars,
            Comment = dto.Comment,
            RatedAt = DateTime.UtcNow
        };

        seller.Ratings.Add(newRating);
        seller.AverageRating = seller.Ratings.Average(r => r.Stars);

        var update = Builders<UserProfile>.Update
            .Set(p => p.Ratings, seller.Ratings)
            .Set(p => p.AverageRating, seller.AverageRating)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        await _context.UserProfiles.UpdateOneAsync(p => p.UserId == seller.UserId, update);

        return Ok(new { message = "Đã đánh giá người bán thành công." });
    }

    [AllowAnonymous]
    [HttpGet("seller/rate/{username}")]
    public async Task<IActionResult> GetSellerInfoRating(string username)
    {
        var seller = await _context.UserProfiles.Find(p =>
            p.UserName == username &&
            p.IsSeller == true &&
            p.VerificationStatus == "approved").FirstOrDefaultAsync();

        if (seller == null)
        {
            return NotFound(new { message = "Không tìm thấy người bán hợp lệ." });
        }

        var response = new
        {
            seller.FullName,
            seller.Address,
            seller.CreatedAt,
            seller.AverageRating,
            Ratings = seller.Ratings.Select(r => new
            {
                r.Stars,
                r.Comment,
                r.RatedAt
            }).OrderByDescending(r => r.RatedAt)
        };

        return Ok(response);
    }
    [AllowAnonymous]
    [HttpGet("ranked-sellers")]
    public async Task<IActionResult> GetRankedSellers([FromQuery] string? q = null)
    {
        var builder = Builders<UserProfile>.Filter;

        var filter = builder.Eq(p => p.IsSeller, true) &
                     builder.Eq(p => p.VerificationStatus, "approved");

        if (!string.IsNullOrEmpty(q))
        {
            var keyword = q.ToLower();
            var regexFilter = builder.Or(
                builder.Regex(p => p.UserName, new BsonRegularExpression(keyword, "i")),
                builder.Regex(p => p.FullName, new BsonRegularExpression(keyword, "i")),
                builder.Regex(p => p.Address, new BsonRegularExpression(keyword, "i"))
            );

            filter &= regexFilter;
        }

        var sellers = await _context.UserProfiles
            .Find(filter)
            .ToListAsync();

        var result = sellers.Select(p => new
        {
            p.UserName,
            p.FullName,
            AverageRating = Math.Round(p.AverageRating, 2),
            TotalRatings = p.Ratings?.Count ?? 0,
            p.Address,
            p.CreatedAt
        });

        return Ok(result);
    }




}
