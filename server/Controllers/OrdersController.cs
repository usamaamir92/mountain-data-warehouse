using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController(OrderService orderService) : ControllerBase
    {
        // Inject the OrderService into the controller
        private readonly OrderService _orderService = orderService;

        // GET: /orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponse>>> GetOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error", Details = ex.Message });
            }
        }
        
        // POST: /orders
        [HttpPost]
        public async Task<ActionResult<OrderResponse>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                var createdOrder = await _orderService.CreateOrderAsync(request);
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.OrderId }, createdOrder);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error", Details = ex.Message });
            }
        }

        // GET: /orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponse>> GetOrderById(string id)
        {
            if (!Guid.TryParse(id, out Guid orderId))
            {
                return BadRequest(new { Message = "Invalid GUID format." });
            }

            try
            {
                var order = await _orderService.GetOrderByIdAsync(orderId);
                return Ok(order);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error", Details = ex.Message });
            }
        }
    }
}
