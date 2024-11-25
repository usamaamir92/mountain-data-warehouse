using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class ProductService(ApplicationDbContext context, ILogger<ProductService> logger)
    {
        // Inject database and logger dependencies
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<ProductService> _logger = logger;


        // Method to get all products
        public async Task<List<Product>> GetAllProductsAsync()
        {
            try 
            {
                return await _context.Products.ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

         // Method to add a product
        public async Task<Product> AddProductAsync(Product product)
        {
            // Check if a product with the same name already exists
            bool productExists = await _context.Products
                .AnyAsync(p => p.Name.ToLower() == product.Name.ToLower());

            if (productExists)
            {
                throw new ArgumentException("A product with the same name already exists.");
            }
            
            // Add product if it doesn't already exist
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return product;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // Method to update product price and/or stock
        public async Task<Product> UpdateProductAsync(Guid productId, decimal? newPrice, decimal? newStock)
        {
            if (!newPrice.HasValue && !newStock.HasValue)
            {
                throw new ArgumentException("At least one of updated Price or updated Stock must be provided.");
            }

            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);
                
                if (product == null)
                {
                    throw new KeyNotFoundException("Product not found.");
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
                return product;
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
