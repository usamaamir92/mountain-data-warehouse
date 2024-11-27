import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl, 
    Snackbar, 
    Alert,
    Grid2,
    Typography,
    IconButton,
    Box,
    Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (order: { products: { productId: string, quantity: number }[] }) => void;
  availableProducts: { productId: string, name: string }[];
}

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ open, onClose, onAdd, availableProducts }) => {
    const [orderProducts, setOrderProducts] = useState<{ productId: string; name: string; quantity: number }[]>([{ productId: '', name: '', quantity: 1 }]);
    const [errors, setErrors] = useState<{ productId: string; quantity: string }[]>([{ productId: '', quantity: '' }]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        console.log("Updated order products: ", orderProducts);
      }, [orderProducts]); // This effect will run whenever orderProducts changes
      
  
    const handleAddProduct = () => {
      setOrderProducts([...orderProducts, { productId: '', name: '', quantity: 1 }]);
      setErrors([...errors, { productId: '', quantity: '' }]);
    };
  
    const handleRemoveProduct = (index: number) => {
      const newOrderProducts = [...orderProducts];
      newOrderProducts.splice(index, 1);
      setOrderProducts(newOrderProducts);
  
      const newErrors = [...errors];
      newErrors.splice(index, 1);
      setErrors(newErrors);
    };
  
    const handleChange = (index: number, field: keyof typeof orderProducts[0]) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const updatedProducts = [...orderProducts];
        const selectedProductId = event.target.value as string;
    
        // If the field being updated is productId, update the productId and reset quantity to 1, and also set the product name
        if (field === 'productId') {
            const selectedProduct = availableProducts.find((product) => product.productId === selectedProductId);
            updatedProducts[index] = {
              ...updatedProducts[index],
              productId: selectedProductId,
              name: selectedProduct ? selectedProduct.name : '',  // Add the product name
              quantity: 1, // Reset quantity to 1 or your desired default value
            };
        } else {
            // Otherwise, update the quantity field
            updatedProducts[index] = { ...updatedProducts[index], [field]: event.target.value };
        }
    
        // Set the state with the updated list of products
        setOrderProducts(updatedProducts);
    
        // Clear errors when the input changes
        const updatedErrors = [...errors];
        updatedErrors[index] = { productId: '', quantity: '' };
        setErrors(updatedErrors);
    };
    
  
    const validate = () => {
      let valid = true;
      const newErrors = orderProducts.map((product) => ({
        productId: product.productId ? '' : 'Product is required.',
        quantity: product.quantity <= 0 ? 'Quantity must be greater than 0.' : '',
      }));
  
      setErrors(newErrors);
  
      // Check if any errors exist
      valid = newErrors.every((error) => !error.productId && !error.quantity);
      return valid;
    };
  
    const handleSubmit = () => {
      if (validate()) {
        onAdd({ products: orderProducts });
        setSnackbarMessage('Order successfully added.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose();
      } else {
        setSnackbarMessage('Please fix the errors before submitting.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          {orderProducts.map((product, index) => (
            <div key={index}>
              <Box display="flex" alignItems="center" style={{ marginBottom: '16px' }}>
                {/* Product select dropdown */}
                <Box flex={9} style={{ marginRight: '8px' }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Product</InputLabel>
                    <Select
                    value={product.productId}
                    onChange={handleChange(index, 'productId')}
                    displayEmpty
                    renderValue={(selected) => {
                        const selectedProduct = availableProducts.find(p => p.productId === selected);
                        return selectedProduct ? selectedProduct.name : '';
                    }}
                    error={!!errors[index].productId}
                    >
                      {availableProducts
                        .filter((p) => !orderProducts.some((op) => op.productId === p.productId)) // Exclude already selected products
                        .map((product) => (
                          <MenuItem key={product.productId} value={product.productId}>
                            {product.name} {/* Show the product name in the menu */}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors[index].productId && <div style={{ color: 'red' }}>{errors[index].productId}</div>}
                  </FormControl>
                </Box>
  
                {/* Quantity input */}
                <Box flex={3}>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={product.quantity}
                    onChange={handleChange(index, 'quantity')}
                    error={!!errors[index].quantity}
                    helperText={errors[index].quantity}
                  />
                </Box>
  
                {/* Remove Product Button */}
                {orderProducts.length > 1 && (
                  <Tooltip title="Remove product" arrow>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveProduct(index)}
                      sx={{
                        width: '24px',
                        height: '24px',
                        padding: '0',
                        marginLeft: '8px',
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </div>
          ))}
  
          {/* Add Another Product Button */}
          <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              style={{ marginBottom: '16px', marginRight: '32px' }}
            >
              + Add Product
            </Button>
          </Box>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add Order
          </Button>
        </DialogActions>
  
        {/* Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Dialog>
    );
  };
  
  export default AddOrderDialog;
  