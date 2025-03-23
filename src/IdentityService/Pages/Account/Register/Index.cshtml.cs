using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;        // Quản lý người dùng (tạo tài khoản, lưu thông tin).
using System.Security.Claims;               // Lưu thông tin bổ sung của người dùng (như tên đầy đủ).
using IdentityModel;
using IdentityService.Models;

namespace IdentityService.Pages.Register 
{
    [SecurityHeaders]
    [AllowAnonymous]    // Cho phép bất kỳ ai cũng có thể truy cập

    // PageModel: lớp cơ sở của Razor Pages
    public class Index : PageModel
    {
        // userManager: tạo và quản lý user.
        private readonly UserManager<ApplicationUser> _userManager;

        // Constructor: khởi tạo _userManager từ đối tượng UserManager nhận vào
        // UserManager use ApplicationUser type
        public Index(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // Liên kết dữ liệu từ form HTML với các thuộc tính 
        // Display property (information) when user registered successfully
        [BindProperty]
        
        // Chứa thông tin người dùng nhập vào
        public RegisterViewModel Input {get; set;}

        [BindProperty] 
        public bool RegisterSuccess {get; set;}

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

        // OnPost: Được gọi khi người dùng gửi form đăng ký
        public async Task<IActionResult> OnPost()
        {
            // Nút Button: SignUp, SignIn
            if(Input.Button != "SignUp")
                // Chuyển hướng về trang chủ
                return Redirect("~/");

            // Kiểm tra định dạng của dữ liệu nhập vào có hợp lệ hay không
            // (tên, email, mật khẩu)
            if(ModelState.IsValid)
            {
                // Tạo một đối tượng ApplicationUser (đối tượng người dùng trong CSDL) với thông tin từ Input
                var user = new ApplicationUser
                {
                    FullName = Input.FullName,
                    UserName = Input.UserName,
                    Email = Input.Email,
                    Address = Input.Address,
                    PhoneNumber = Input.Telephone,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true
                };

                // _userManager.CreateAsync: Lưu thông tin người dùng và mật khẩu vào cơ sở dữ liệu.
                // await: Chờ quá trình hoàn tất vì đây là thao tác bất đồng bộ.       
                var result = await _userManager.CreateAsync(user, Input.PassWord);

                // Kiểm tra tình trạng đăng ký thành công hay không
                if(result.Succeeded)
                {
                    // Thêm tên đầy đủ (FullName) vào Claims.
                    // Claims giống như thẻ thông tin gắn vào tài khoản, có thể dùng sau này để hiển thị hoặc phân quyền.
                    await _userManager.AddClaimsAsync(user, new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name, Input.FullName)
                    });

                    // Cập nhật trạng thái: ĐK thành công
                    RegisterSuccess = true;
                }
            }
            else {

            }

            // Hiển thị lại trang đăng ký (thành công / thất bại)
            return Page();
        }
    }
}

