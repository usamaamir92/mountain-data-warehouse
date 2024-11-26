using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductsController(ProductsService productService) : ControllerBase
    {
        // Inject the ProductService into the controller
        private readonly ProductsService _productService = productService;

        // GET: /products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts()
        {
            try
            {
                // Get list of products from the Products table
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
        public async Task<ActionResult<ProductResponse>> CreateProduct([FromBody] ProductRequest productRequest)
        {
            try
            {
                // Create product and add to Products table
                var createdProduct = await _productService.AddProductAsync(productRequest);
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
        [HttpPatch("{id}")]
        public async Task<ActionResult<ProductResponse>> UpdateProduct(string id, [FromBody] UpdateProductRequest request)
        {
            // Check if product ID provided is a valid Guid
            if (!Guid.TryParse(id, out Guid productId))
            {
                return BadRequest(new { Message = "Invalid GUID format." });
            }

            // Check that at least one of updated price or stock is provided in the request
            if (!request.Price.HasValue && !request.Stock.HasValue)
            {
                return BadRequest(new { Message = "At least one of Price or Stock must be provided." });
            }

            try
            {
                // Update product and return updated product
                var updatedProduct = await _productService.UpdateProductAsync(productId, request.Price, request.Stock);
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

        // DELETE /products/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(string id)
        {
            // Check if ID provided is a valid Guid
            if (!Guid.TryParse(id, out Guid productId))
            {
                return BadRequest(new { Message = "Invalid GUID format." });
            }

            try
            {
                // Delete product
                var wasDeleted = await _productService.DeleteProductAsync(productId);
                return NoContent();
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
