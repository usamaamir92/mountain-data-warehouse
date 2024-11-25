using System.ComponentModel.DataAnnotations;

namespace server.Extensions
{
    // Custom classes to validate inputs for Stock to ensure int values only
    public class IntegerAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value is decimal stockValue)
            {
                return stockValue % 1 == 0;
            }
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"The '{name}' value must be an integer.";
        }
    }

    public class UpdateIntegerAttribute : ValidationAttribute
    {
        public UpdateIntegerAttribute() 
            : base("The value must be an integer.") { }

        public override bool IsValid(object value)
        {
            // Allow null since Stock is not required in the patch route
            if (value == null) return true;
            
            // Check to see if value is an integer
            if (value is decimal decimalValue)
            {
                return decimalValue == Math.Floor(decimalValue);
            }

            return false;
        }
    }
}
