using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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
    [Precision(9,2)]
    public required decimal Price { get; set; }
    [Required]
    [Precision(9,0)]
    public required int Stock { get; set; }
}


// public class Order
// {
//     public int OrderId { get; set; }
//     public DateTime OrderDate { get; set; }
//     public int TotalAmount { get; set; }
//     public Product[] Products { get; set; }
// }


