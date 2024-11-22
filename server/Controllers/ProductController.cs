// File: Controllers/ProductsController.cs

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MountainDataWarehouse.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        // Injecting ProductService into the controller
        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            // Fetching products from the service
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }
    }
}
