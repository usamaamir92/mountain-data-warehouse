using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductsController(ProductService productService) : ControllerBase
    {
        // Inject the ProductService into the controller
        private readonly ProductService _productService = productService;

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while processing your request.", details = ex.Message });
            }
        }
    }
}
