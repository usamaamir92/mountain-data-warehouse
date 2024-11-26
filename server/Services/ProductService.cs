using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class ProductService(ApplicationDbContext context, ILogger<ProductService> logger)
    {
        // Inject database and logger dependencies
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<ProductService> _logger = logger;


        // Method to get all products
        public async Task<List<ProductResponse>> GetAllProductsAsync()
        {
            try 
            {
                // return await _context.Products.ToListAsync();

                // Fetch products and map to ProductResponse object
                return await _context.Products
                    .Select(product => new ProductResponse
                    {
                        ProductId = product.ProductId,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        Stock = product.Stock
                    }).ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

         // Method to add a product
        public async Task<ProductResponse> AddProductAsync(ProductRequest productRequest)
        {
            // Check if a product with the same name already exists
            bool productExists = await _context.Products
                .AnyAsync(p => p.Name.ToLower() == productRequest.Name.ToLower());

            if (productExists)
            {
                throw new ArgumentException("A product with the same name already exists.");
            }

            // Map request to ProductRequest object
            var product = new Product
            {
                ProductId = Guid.NewGuid(),
                Name = productRequest.Name,
                Description = productRequest.Description,
                Price = productRequest.Price,
                Stock = productRequest.Stock
            };
            
            // Add product if it doesn't already exist
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Map the created product to the ProductResponse object
                return new ProductResponse
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock
                };
                // return product;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // Method to update product price and/or stock
        public async Task<ProductResponse> UpdateProductAsync(Guid productId, decimal? newPrice, decimal? newStock)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

                // Check if product exists   
                if (product == null)
                {
                    throw new KeyNotFoundException("No product with the given ID exists.");
                }

                // Update property if new value is provided
                if (newPrice.HasValue)
                {
                    product.Price = newPrice.Value;
                }

                if (newStock.HasValue)
                {
                    product.Stock = newStock.Value;
                }

                await _context.SaveChangesAsync();
                // return product;

                // Map to ProductResponse entity
                return new ProductResponse
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        // Method to delete a product
        public async Task<bool> DeleteProductAsync(Guid productId)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

                // Check if product exists   
                if (product == null)
                {
                    throw new KeyNotFoundException("No product with the given ID exists.");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
