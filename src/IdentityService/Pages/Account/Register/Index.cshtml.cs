using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;        // Quản lý người dùng (tạo tài khoản, lưu thông tin).
using System.Security.Claims;               // Lưu thông tin bổ sung của người dùng (như tên đầy đủ).
using IdentityModel;
using IdentityService.Models;
using System.Text;

namespace IdentityService.Pages.Register
{
    [SecurityHeaders]
    [AllowAnonymous]    // Cho phép bất kỳ ai cũng có thể truy cập

    // PageModel: lớp cơ sở của Razor Pages
    public class Index : PageModel
    {
        // userManager: tạo và quản lý user.
        private readonly UserManager<ApplicationUser> _userManager;

        // Gửi email 
        private readonly IEmailSender _emailSender;

        // Gửi SMS
        private readonly ISMSSender _smsSender;

        // Constructor: khởi tạo _userManager từ đối tượng UserManager nhận vào
        // UserManager use ApplicationUser type
        public Index(UserManager<ApplicationUser> userManager, IEmailSender emailSender, ISMSSender smsSender)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
        }

        // Liên kết dữ liệu từ form HTML với các thuộc tính 
        // Display property (information) when user registered successfully
        [BindProperty]

        // Chứa thông tin người dùng nhập vào
        public RegisterViewModel Input { get; set; }

        [BindProperty]
        public bool RegisterSuccess { get; set; }

        // OnGet: Được gọi khi người dùng truy cập trang đăng ký (HTTP GET).
        // returnUrl: nơi người dùng sẽ được chuyển hướng sau khi đăng ký
        public IActionResult OnGet(string returnUrl)
        {
            // RegisterViewModel: Lớp lưu trữ dữ liệu từ form đăng ký mà người dùng nhập vào
            Input = new RegisterViewModel
            {
                ReturnUrl = returnUrl
            };

            // Trả về trang đăng ký để hiển thị form cho người dùng
            // Page(): thuộc lớp PageModel (lớp cơ sở mà lớp Index kế thừa)
            // Khi gọi Page(), nó yêu cầu hệ thống tạo ra nội dung HTML của Razor Page tương ứng (ở đây là file .cshtml) và gửi về trình duyệt.
            return Page();
        }

        private string GenerateOTP()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // OnPost: Được gọi khi người dùng gửi form đăng ký
        public async Task<IActionResult> OnPost()
        {
            if (ModelState.IsValid)
            {
                // Tạo OTP
                string OTP = GenerateOTP();

                // Tạo một đối tượng ApplicationUser (đối tượng người dùng trong CSDL) với thông tin từ Input
                var user = new ApplicationUser
                {
                    FullName = Input.FullName,
                    UserName = Input.UserName,
                    Email = Input.Email,
                    Address = Input.Address,
                    PhoneNumber = Input.Telephone,
                    EmailConfirmed = false,
                    PhoneNumberConfirmed = false,
                    OTPCode = OTP,
                    OTPExpiry = DateTime.UtcNow.AddMinutes(5)
                };

                // _userManager.CreateAsync: Tạo và lưu thông tin người dùng và mật khẩu vào cơ sở dữ liệu.
                // await: Chờ quá trình hoàn tất vì đây là thao tác bất đồng bộ.       
                var result = await _userManager.CreateAsync(user, Input.PassWord);

                // Kiểm tra tình trạng đăng ký thành công hay không
                if (result.Succeeded)
                {
                    // Thêm thông tin tên người dùng vào Claims.
                    // Claims giống như thẻ thông tin gắn vào tài khoản, có thể dùng sau này để hiển thị hoặc phân quyền.
                    await _userManager.AddClaimsAsync(user, new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name, Input.FullName),
                        new Claim(JwtClaimTypes.Email, Input.Email),
                        new Claim(JwtClaimTypes.PhoneNumber, Input.Telephone),
                    });

                    // Gửi email
                    if (Input.VerificationMethod == "Email")
                    {
                        await _emailSender.SendEmail(
                            user.Email,
                            "Xác thực tài khoản E-Shop",
                            $"Mã OTP của bạn là: {OTP}. Mã sẽ hết hạn sau 5 phút."
                        );
                    }
                    // Gửi SMS
                    else if (Input.VerificationMethod == "SMS")
                    {
                        await _smsSender.SendSMS(
                            user.PhoneNumber,
                            $"Xác thực tài khoản E-Shop. Mã OTP của bạn là: {OTP}. Mã sẽ hết hạn sau 5 phút."
                        );
                    }

                    // Cập nhật trạng thái: ĐK thành công
                    RegisterSuccess = true;

                    // Chuyển hướng đến trang xác thực OTP
                    return RedirectToPage("/Account/Verify/Index", new
                    {
                        returnUrl = Input.ReturnUrl,
                        username = Input.UserName,
                        verificationMethod = Input.VerificationMethod
                    });
                }

                foreach (var error in result.Errors)
                    ModelState.AddModelError(string.Empty, error.Description);
            }

            // Hiển thị lại trang đăng ký (thành công / thất bại)
            return Page();
        }

    }
}