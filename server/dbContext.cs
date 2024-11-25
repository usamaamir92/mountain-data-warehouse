using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using server.Extensions;


namespace server
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { 
            // Initialise table references
            Products = Set<Product>();
            // Orders = Set<Order>(); 
        }

        public DbSet<Product> Products { get; set; }
        // public DbSet<Order> Orders { get; set; }
    }


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
    }


    // public class Order
    // {
    //     public int OrderId { get; set; }
    //     public DateTime OrderDate { get; set; }
    //     public int TotalAmount { get; set; }
    //     public Product[] Products { get; set; }
    // }

    public class UpdateProductRequest
    {
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal? Price { get; set; }
        [UpdateInteger(ErrorMessage = "The Stock value must be an integer.")]
        [Range(0, double.MaxValue, ErrorMessage = "Stock value must be 0 or greater.")]
        public decimal? Stock { get; set; }
    }

}

