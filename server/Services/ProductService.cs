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
                return product;
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
