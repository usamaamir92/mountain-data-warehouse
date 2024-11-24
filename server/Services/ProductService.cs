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
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while fetching the list of products.", ex);  
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
    }
}
