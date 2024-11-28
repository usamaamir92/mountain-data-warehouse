using Microsoft.EntityFrameworkCore;
using Xunit;
using server.Services;

namespace server.Tests
{
    public class OrdersServiceTests
    {
        private readonly ApplicationDbContext _context;
        private readonly OrdersService _ordersService;

        public OrdersServiceTests()
        {
            // In-memory database to mock dbContext
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _ordersService = new OrdersService(_context);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldCreateOrderSuccessfully()
        {
            // Arrange
            var product = new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "Test Product",
                Description = "Test Description",
                Price = 10.0m,
                Stock = 100
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var orderRequest = new CreateOrderRequest
            {
                Products = new List<OrderProductRequest>
                {
                    new OrderProductRequest
                    {
                        ProductId = product.ProductId,
                        Quantity = 2
                    }
                }
            };

            // Act
            var result = await _ordersService.CreateOrderAsync(orderRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Products);
            Assert.Equal(20.0m, result.TotalAmount);
        }

        [Fact]
        public async Task CreateOrderAsync_ShouldThrowException_WhenProductNotFound()
        {
            // Arrange
            var orderRequest = new CreateOrderRequest
            {
                Products = new List<OrderProductRequest>
                {
                    new OrderProductRequest
                    {
                        ProductId = Guid.NewGuid(), // Non-existent product
                        Quantity = 1
                    }
                }
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(async () =>
                await _ordersService.CreateOrderAsync(orderRequest));  // Expect ArgumentException instead of KeyNotFoundException
        }

        [Fact]
        public async Task GetOrderByIdAsync_ShouldReturnOrder_WhenOrderExists()
        {
            // Arrange
            var product = new Product
            {
                ProductId = Guid.NewGuid(),
                Name = "Test Product",
                Description = "Test Description",
                Price = 10.0m,
                Stock = 100
            };

            var orderId = Guid.NewGuid();
            var totalAmount = 20.0M;
            var order = new Order
            {
                OrderId = orderId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                OrderProducts = new List<OrderProduct>
                {
                    new OrderProduct
                    {
                        OrderId = orderId,
                        ProductId = product.ProductId,
                        Product = product,
                        Quantity = 2,
                        PriceAtTimeOfSale = 10.0m,
                        Order = new Order
                        {
                            OrderId = orderId,
                            OrderDate = DateTime.UtcNow,
                            TotalAmount = totalAmount
                        }
                    }
                }
            };

            _context.Products.Add(product);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            var result = await _ordersService.GetOrderByIdAsync(order.OrderId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(order.OrderId, result.OrderId);
            Assert.Single(result.Products);
        }

        [Fact]
        public async Task GetOrderByIdAsync_ShouldThrowException_WhenOrderDoesNotExist()
        {
            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await _ordersService.GetOrderByIdAsync(Guid.NewGuid())); // Non-existent order ID
        }
    }
}
