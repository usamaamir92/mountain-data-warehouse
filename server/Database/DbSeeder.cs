using System;
using System.Linq;

namespace server.Database
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext dbContext)
        {
            Console.WriteLine("Seeding database...");

            // Seed Products table
            if (!dbContext.Products.Any())
            {
                var products = new List<Product>
                {
                new() { ProductId = Guid.NewGuid(), Name = "Hiking Boots", Description = "Durable boots for mountain hiking.", Price = 129.99M, Stock = 25 },
                new() { ProductId = Guid.NewGuid(), Name = "Mountain Bike", Description = "A sturdy mountain bike for rugged trails.", Price = 499.99M, Stock = 10 },
                new() { ProductId = Guid.NewGuid(), Name = "Laptop", Description = "15-inch, 16GB RAM", Price = 1200.00M, Stock = 10 },
                new() { ProductId = Guid.NewGuid(), Name = "Headphones", Description = "Noise-cancelling", Price = 200.00M, Stock = 50 },
                new() { ProductId = Guid.NewGuid(), Name = "Mouse", Description = "Wireless, ergonomic", Price = 25.00M, Stock = 200 },
                new() { ProductId = Guid.NewGuid(), Name = "Keyboard", Description = "Mechanical, backlit", Price = 45.00M, Stock = 150 },
                new() { ProductId = Guid.NewGuid(), Name = "Tent", Description = "4-person camping tent, waterproof.", Price = 250.00M, Stock = 15 },
                new() { ProductId = Guid.NewGuid(), Name = "Sleeping Bag", Description = "Insulated sleeping bag for winter camping.", Price = 75.00M, Stock = 30 },
                new() { ProductId = Guid.NewGuid(), Name = "Camping Stove", Description = "Portable stove for outdoor cooking.", Price = 60.00M, Stock = 50 },
                new() { ProductId = Guid.NewGuid(), Name = "Smartphone", Description = "Latest model with 128GB storage.", Price = 800.00M, Stock = 20 }
                };

                dbContext.Products.AddRange(products);
                dbContext.SaveChanges();
            };

            // Seed Orders table
            if (!dbContext.Orders.Any())
            {
                var order = new Order
                {
                    OrderId = Guid.NewGuid(),
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = 129.99M,
                };

                dbContext.Orders.Add(order);
                dbContext.SaveChanges(); 

                // Create Order/Product relationship entry
                var orderProduct = new OrderProduct
                {
                    OrderId = order.OrderId,
                    Order = order,
                    ProductId = dbContext.Products.First(p => p.Name == "Hiking Boots").ProductId,
                    Product = dbContext.Products.First(p => p.Name == "Hiking Boots"),
                    Quantity = 1,
                    PriceAtTimeOfSale = 129.99M
                };

                order.OrderProducts = new List<OrderProduct> { orderProduct };

                // Save changes
                dbContext.SaveChanges();
            };
        }
    }
}
