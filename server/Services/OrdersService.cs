using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class OrdersService(ApplicationDbContext context)
    {
        // Inject database dependency
        private readonly ApplicationDbContext _context = context;

        // Method to get all orders with product details
        public async Task<List<OrderResponse>> GetAllOrdersAsync()
        {
            try
            {
                // Fetch orders list and map each order to the OrderResponse model and return
                return await _context.Orders
                    .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                    .Select(o => new OrderResponse
                    {
                        OrderId = o.OrderId,
                        OrderDate = o.OrderDate,
                        TotalAmount = o.TotalAmount,
                        Products = o.OrderProducts.Select(op => new OrderProductResponse
                        {
                            ProductId = op.ProductId,
                            Name = op.Product.Name,
                            Description = op.Product.Description,
                            Price = op.PriceAtTimeOfSale,
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
                // Validate existence of products in the request by comparing to a list from the Products table
                var products = await _context.Products
                    .Where(p => request.Products.Select(rp => rp.ProductId).Contains(p.ProductId))
                    .ToListAsync();

                if (products.Count != request.Products.Count)
                {
                    throw new ArgumentException("Some Product IDs in the order request are not valid.");
                }

                // Initialise a new Order instance
                var order = new Order
                {
                    OrderId = Guid.NewGuid(),
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = 0
                };

                // Calculate the total amount and check stock for each product in the request
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

                    // Map order and products relation to OrderProduct table
                    orderProducts.Add(new OrderProduct
                    {
                        OrderId = order.OrderId,
                        Order = order,
                        ProductId = product.ProductId,
                        Product = product,
                        Quantity = reqProduct.Quantity,
                        PriceAtTimeOfSale = product.Price // Price saved as PriceAtTimeOfSale to ensure correctness in case of future product price changes
                    });
                }

                // Update Order object with new totalAmount and complete list of products
                order.TotalAmount = totalAmount;
                order.OrderProducts = orderProducts;

                // Save Order to Orders table
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Map the created order to the OrderResponse object and return
                return new OrderResponse
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Products = order.OrderProducts.Select(op => new OrderProductResponse
                    {
                        ProductId = op.ProductId,
                        Name = op.Product.Name,
                        Description = op.Product.Description,
                        Price = op.PriceAtTimeOfSale,
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
                // Check if an order with the given Order Id exists
                var order = await _context.Orders
                    .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null)
                {
                    throw new KeyNotFoundException("No order with the given ID exists.");
                }

                // Map the order to the OrderResponse object and return
                return new OrderResponse
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Products = order.OrderProducts.Select(op => new OrderProductResponse
                    {
                        ProductId = op.ProductId,
                        Name = op.Product.Name,
                        Description = op.Product.Description,
                        Price = op.PriceAtTimeOfSale,
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
