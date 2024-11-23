using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class ProductService(ApplicationDbContext context)
    {
        // Inject database dependency
        private readonly ApplicationDbContext _context = context;

        // Method to get all products
        public async Task<List<Product>> GetAllProductsAsync()
        {
            // try
            // {
                // Fetch all products from the database
                return await _context.Products.ToListAsync();
            // }
            // catch (InvalidOperationException ex)
            // {
            //     Console.WriteLine($"Query error: {ex.Message}");
            //     throw new Exception("An error occurred while querying the database.");
            // }
            // catch (Exception ex)
            // {
            //     Console.WriteLine($"Unexpected error: {ex.Message}");
            //     throw new Exception("An unexpected error occurred while processing your request.");
            // }
        }
    }
}
