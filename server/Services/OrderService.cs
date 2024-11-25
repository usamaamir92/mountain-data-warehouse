using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class OrderService(ApplicationDbContext context, ILogger<OrderService> logger)
    {
        // Inject database and logger dependencies
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<OrderService> _logger = logger;

        // Method to get all orders with product details
        public async Task<List<OrderResponse>> GetAllOrdersAsync()
        {
            try
            {
                return await _context.Orders
                    .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                    .Select(o => new OrderResponse
                    {
                        OrderId = o.OrderId,
                        OrderDate = o.OrderDate,
                        TotalAmount = o.TotalAmount,
                        Products = o.OrderProducts.Select(op => new OrderProductDetails
                        {
                            ProductId = op.ProductId,
                            Quantity = op.Quantity
                        }).ToList()
                    }).ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        // Method to create a new order
        public async Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request)
        {
            try
            {
                // Checkkkkk
                // Validate products
                var products = await _context.Products
                    .Where(p => request.Products.Select(rp => rp.ProductId).Contains(p.ProductId))
                    .ToListAsync();

                if (products.Count != request.Products.Count)
                {
                    throw new ArgumentException("Some products in the order request are not valid.");
                }

                // Initialize a new Order instance
                var order = new Order
                {
                    OrderId = Guid.NewGuid(),
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = 0
                };

                // Calculate total amount and check stock for each product in the request
                decimal totalAmount = 0;
                var orderProducts = new List<OrderProduct>();

                foreach (var reqProduct in request.Products)
                {
                    var product = products.First(p => p.ProductId == reqProduct.ProductId);

                    if (product.Stock < reqProduct.Quantity)
                    {
                        throw new ArgumentException($"Insufficient stock for product: {product.Name}");
                    }

                    // Increment totalAmount by price x quantity
                    totalAmount += product.Price * reqProduct.Quantity;

                    // Deduct requested quantity from stock
                    product.Stock -= reqProduct.Quantity;


                    orderProducts.Add(new OrderProduct
                    {
                        OrderId = order.OrderId,
                        Order = order,
                        ProductId = product.ProductId,
                        Product = product,
                        Quantity = reqProduct.Quantity
                    });
                }

                // Update Order object with new totalAmount and complete list of products
                order.TotalAmount = totalAmount;
                order.OrderProducts = orderProducts;

                // Save Order to Orders table
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Return the created Order object
                return new OrderResponse
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Products = order.OrderProducts.Select(op => new OrderProductDetails
                    {
                        ProductId = op.ProductId,
                        Quantity = op.Quantity
                    }).ToList()
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        // Method to get a specific order by ID
        public async Task<OrderResponse> GetOrderByIdAsync(Guid orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null)
                {
                    throw new KeyNotFoundException("No order with the given ID exists.");
                }

                return new OrderResponse
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Products = order.OrderProducts.Select(op => new OrderProductDetails
                    {
                        ProductId = op.ProductId,
                        Quantity = op.Quantity
                    }).ToList()
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
