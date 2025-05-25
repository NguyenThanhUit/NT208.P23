using Microsoft.AspNetCore.Mvc;
using VNPAY.NET;
using VNPAY.NET.Enums;
using VNPAY.NET.Models;
using VNPAY.NET.Utilities;

namespace Backend_API_Testing.Controllers
{
    [ApiController]
    [Route("api/vnpay")]
    public class VnpayController : ControllerBase
    {
        private readonly IVnpay _vnpay;
        private readonly IConfiguration _configuration;

        public VnpayController(IVnpay vnPayservice, IConfiguration configuration)
        {
            _vnpay = vnPayservice;
            _configuration = configuration;

            _vnpay.Initialize(
                    _configuration["Vnpay:TmnCode"],
                    _configuration["Vnpay:HashSecret"],
                    _configuration["Vnpay:BaseUrl"],         // Đây là URL thanh toán (paymentUrl)
                    _configuration["Vnpay:CallbackUrl"]     // Đây là URL callback/return
);

        }

        /// <summary>
        /// Tạo url thanh toán
        /// </summary>
        /// <param name="money">Số tiền phải thanh toán</param>
        /// <param name="description">Mô tả giao dịch</param>
        /// <returns></returns>
        [HttpGet("CreatePaymentUrl")]
        public ActionResult<string> CreatePaymentUrl(double money, string description)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";


                Console.WriteLine($"[LOG] IP client thực hiện giao dịch: {ipAddress}");
                Console.WriteLine($"[VNPAY] Money: {money}, Description: {description}");

                var request = new PaymentRequest
                {
                    PaymentId = DateTime.Now.Ticks,
                    Money = money,
                    Description = description,
                    IpAddress = ipAddress,
                    BankCode = BankCode.ANY,
                    CreatedDate = DateTime.Now,
                    Currency = Currency.VND,
                    Language = DisplayLanguage.Vietnamese
                };

                Console.WriteLine($"[VNPAY] Request object: {System.Text.Json.JsonSerializer.Serialize(request)}");

                var paymentUrl = _vnpay.GetPaymentUrl(request);

                Console.WriteLine($"[VNPAY] Generated Payment URL: {paymentUrl}");

                return Created(paymentUrl, paymentUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[VNPAY] Error creating payment URL: {ex.Message}");
                Console.WriteLine($"[VNPAY] StackTrace: {ex.StackTrace}");
                return BadRequest(ex.Message);
            }
        }



        /// <summary>
        /// Thực hiện hành động sau khi thanh toán. URL này cần được khai báo với VNPAY để API này hoạt đồng (ví dụ: http://localhost:1234/api/Vnpay/IpnAction)
        /// </summary>
        /// <returns></returns>
        [HttpGet("IpnAction")]
        public IActionResult IpnAction()
        {
            if (Request.QueryString.HasValue)
            {
                try
                {
                    var paymentResult = _vnpay.GetPaymentResult(Request.Query);
                    if (paymentResult.IsSuccess)
                    {
                        // Thực hiện hành động nếu thanh toán thành công tại đây. Ví dụ: Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu.
                        return Ok();
                    }

                    // Thực hiện hành động nếu thanh toán thất bại tại đây. Ví dụ: Hủy đơn hàng.
                    return BadRequest("Thanh toán thất bại");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return NotFound("Không tìm thấy thông tin thanh toán.");
        }

        /// <summary>
        /// Trả kết quả thanh toán về cho người dùng
        /// </summary>
        /// <returns></returns>
        [HttpGet("Callback")]
        public ActionResult<PaymentResult> Callback()
        {
            if (Request.QueryString.HasValue)
            {
                try
                {
                    var paymentResult = _vnpay.GetPaymentResult(Request.Query);

                    if (paymentResult.IsSuccess)
                    {
                        return Ok(paymentResult);
                    }

                    return BadRequest(paymentResult);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return NotFound("Không tìm thấy thông tin thanh toán.");
        }
    }
}