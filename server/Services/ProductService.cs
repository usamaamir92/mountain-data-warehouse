// File: Services/ProductService.cs

using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

// namespace MountainDataWarehouse.Services
// {
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        // Injecting ApplicationDbContext
        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Method to get all products
        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }
    }
// }
