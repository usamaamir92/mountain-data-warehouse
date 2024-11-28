using Microsoft.EntityFrameworkCore;
using Xunit;
using server.Services;

namespace server.Tests
{
    public class ProductsServiceTests
    {
        private readonly ApplicationDbContext _context;
        private readonly ProductsService _service;

        public ProductsServiceTests()
        {
            // In-memory database to mock dbContext
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _service = new ProductsService(_context);

            // Seed the database
            _context.Products.AddRange(new List<Product>
            {
                new Product { ProductId = Guid.NewGuid(), Name = "Test Product 1", Description = "Description 1", Price = 10.0m, Stock = 100 },
                new Product { ProductId = Guid.NewGuid(), Name = "Test Product 2", Description = "Description 2", Price = 20.0m, Stock = 200 }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetAllProductsAsync_ShouldReturnAllProducts()
        {
            // Act
            var products = await _service.GetAllProductsAsync();

            // Assert
            Assert.Equal(2, products.Count);
            Assert.Contains(products, p => p.Name == "Test Product 1");
            Assert.Contains(products, p => p.Name == "Test Product 2");
        }

        [Fact]
        public async Task AddProductAsync_ShouldAddNewProduct()
        {
            // Arrange
            var newProduct = new ProductRequest
            {
                Name = "New Product",
                Description = "New Description",
                Price = 15.0m,
                Stock = 50
            };

            // Act
            var result = await _service.AddProductAsync(newProduct);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Product", result.Name);
            Assert.Equal(3, _context.Products.Count());
        }

        [Fact]
        public async Task UpdateProductAsync_ShouldUpdatePriceAndStock()
        {
            // Arrange
            var productToUpdate = _context.Products.First();
            var newPrice = 25.0m;
            var newStock = 300;

            // Act
            var updatedProduct = await _service.UpdateProductAsync(productToUpdate.ProductId, newPrice, newStock);

            // Assert
            Assert.NotNull(updatedProduct);
            Assert.Equal(newPrice, updatedProduct.Price);
            Assert.Equal(newStock, updatedProduct.Stock);
        }

        [Fact]
        public async Task UpdateProductAsync_WithInvalidId_ShouldThrowKeyNotFoundException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () =>
            {
                await _service.UpdateProductAsync(Guid.NewGuid(), 20.0m, 50);
            });
        }
    }
}
