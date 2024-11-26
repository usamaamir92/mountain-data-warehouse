using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class ProductsService(ApplicationDbContext context)
    {
        // Inject database dependency
        private readonly ApplicationDbContext _context = context;

        // Method to get all products
        public async Task<List<ProductResponse>> GetAllProductsAsync()
        {
            try 
            {
                // Fetch products list and map each product to the ProductResponse model and return
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
            // Check if a product with the same name already exists and throw error if so
            bool productExists = await _context.Products
                .AnyAsync(p => p.Name.ToLower() == productRequest.Name.ToLower());

            if (productExists)
            {
                throw new ArgumentException("A product with the same name already exists.");
            }

            // Map the request to the ProductRequest model
            var product = new Product
            {
                ProductId = Guid.NewGuid(),
                Name = productRequest.Name,
                Description = productRequest.Description,
                Price = productRequest.Price,
                Stock = productRequest.Stock
            };
            
            try
            {
                // Add the product to the Products table
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Map the created product to the ProductResponse model and return
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

        // Method to update product price and/or stock
        public async Task<ProductResponse> UpdateProductAsync(Guid productId, decimal? newPrice, int? newStock)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);

                // Check if a product with the given Product Id exists   
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

                // Map to updated product to the ProductResponse model and return
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

                // Check if a product with the given Product Id exists   
                if (product == null)
                {
                    throw new KeyNotFoundException("No product with the given ID exists.");
                }

                // Delete from Products table
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
