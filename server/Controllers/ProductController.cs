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

        // GET: /products
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
                return StatusCode(500, new { Message = "Internal Server Error", Details = ex.Message });
            }
        }

        // POST: /products
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
        {
            try
            {
                var createdProduct = await _productService.AddProductAsync(product);
                return CreatedAtAction(nameof(GetProducts), new { id = createdProduct.ProductId }, createdProduct);
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

        // PATCH: /products/{id}
        [HttpPatch("{id:guid}")]
        public async Task<ActionResult<Product>> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
        {
            try
            {
                var updatedProduct = await _productService.UpdateProductAsync(id, request.Price, request.Stock);
                return Ok(updatedProduct);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
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

    }
}
