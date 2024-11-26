using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using server.Extensions;


namespace server
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { 
            // Set table references
            Products = Set<Product>();
            Orders = Set<Order>(); 
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }

        // Configure relationship between Product and Order
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure many-to-many relationship using the join table
            modelBuilder.Entity<OrderProduct>()
                .HasKey(op => new { op.OrderId, op.ProductId });

            modelBuilder.Entity<OrderProduct>()
                .HasOne(op => op.Order)
                .WithMany(o => o.OrderProducts)
                .HasForeignKey(op => op.OrderId);

            modelBuilder.Entity<OrderProduct>()
                .HasOne(op => op.Product)
                .WithMany(p => p.OrderProducts)
                .HasForeignKey(op => op.ProductId);

            base.OnModelCreating(modelBuilder);
        }
    }

    // Products table
    public class Product
    {
        [Key]
        public Guid ProductId { get; set;}
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Description { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public required decimal Price { get; set; }
        [Required]
        [Integer(ErrorMessage = "The Stock value must be an integer.")]
        [Range(0, double.MaxValue, ErrorMessage = "Stock value must be 0 or greater.")]
        public required decimal Stock { get; set; }
        public ICollection<OrderProduct>? OrderProducts { get; set; }
    }

    // Orders table
    public class Order
    {
        [Key]
        public Guid OrderId { get; set; }
        [Required]
        public required DateTime OrderDate { get; set; }
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public required decimal TotalAmount { get; set; }
        [Required]
        public ICollection<OrderProduct>? OrderProducts { get; set; }
    }

    // Join table combining Orders and Products
    public class OrderProduct
    {
        [Required]
        public required Guid OrderId { get; set; }
        [Required]
        public required Order Order { get; set; }
        [Required]
        public required Guid ProductId { get; set; }
        [Required]
        public required Product Product { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public required int Quantity { get; set; }
    }

    // Request model for creating a new Product (POST /products) 
    public class ProductRequest
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public required decimal Price { get; set; }

        [Required]
        [Integer(ErrorMessage = "The Stock value must be an integer.")]
        [Range(0, double.MaxValue, ErrorMessage = "Stock value must be 0 or greater.")]
        public required decimal Stock { get; set; }
    }

    // Request model for updating an existing product (PATCH /products)
    public class UpdateProductRequest
    {
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal? Price { get; set; }
        [UpdateInteger(ErrorMessage = "The Stock value must be an integer.")]
        [Range(0, double.MaxValue, ErrorMessage = "Stock value must be 0 or greater.")]
        public decimal? Stock { get; set; }
    }

    // Request model for creating a new Order (POST /orders) 
    public class CreateOrderRequest
    {
        [Required]
        [MinLength(1, ErrorMessage = "The order must contain at least one product.")]
        public required List<OrderProductRequest> Products { get; set; }
    }

    // Request model for list of Products in a new Order (POST /orders)
    public class OrderProductRequest
    {
        public Guid ProductId { get; set; }
        public required int Quantity { get; set; }
    }

    // Response model for Product (GET/POST/PATCH)
    public class ProductResponse
    {
        public Guid ProductId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }
        public required decimal Stock { get; set; }
    }

    // Response model for Order (GET/POST)
    public class OrderResponse
    {
        public Guid OrderId { get; set; }
        public required DateTime OrderDate { get; set; }
        public required decimal TotalAmount { get; set; }
        public required List<OrderProductResponse> Products { get; set; }
    }

    // Response model for list of Products in an Order (GET /orders)
    public class OrderProductResponse
    {
        public Guid ProductId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }
        public required int Quantity { get; set; }
    }
}

