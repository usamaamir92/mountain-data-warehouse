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
    IconButton,
    Box,
    Tooltip,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import useOrderStore from '../Store/useOrderStore';
import useProductStore from '../Store/useProductStore';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AddOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddOrderDialog = ({ open, onClose }: AddOrderDialogProps) => {
    // Import global state management variable and functions
    const { addOrder } = useOrderStore();
    const { products } = useProductStore();

    // State variables for add order form
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);
    const [orderProducts, setOrderProducts] = useState<{ productId: string; name: string; quantity: number }[]>([{ productId: '', name: '', quantity: 1 }]);
    const [errors, setErrors] = useState<{ productId: string; quantity: string }[]>([{ productId: '', quantity: '' }]);
    
    // State variables to manage Snackbar visibility and content
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // useEffect hook to reload products list if it changes to maintain up-to-date product list
    useEffect(() => {
      setAvailableProducts(products);
    }, [products]);

    // Functions to add/remove additional products from 
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

    // Functions to handle changes in form values and set as state variables
    const handleProductChange = (index: number) => (event: SelectChangeEvent<string>) => {
      const updatedProducts = [...orderProducts];
      const selectedProductId = event.target.value;
    
      const selectedProduct = availableProducts.find((product) => product.productId === selectedProductId);
      updatedProducts[index] = {
        ...updatedProducts[index],
        productId: selectedProductId,
        name: selectedProduct ? selectedProduct.name : ''
      };
  
      // Set the state with the updated list of products
      setOrderProducts(updatedProducts);
  
      // Clear errors when the input changes
      const updatedErrors = [...errors];
      updatedErrors[index] = { productId: '', quantity: '' };
      setErrors(updatedErrors);
    };
  
      const handleQuantityChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
          const updatedProducts = [...orderProducts];
          updatedProducts[index] = {
            ...updatedProducts[index],
            quantity: parseInt(event.target.value, 10),
          };
      
          // Set the state with the updated quantity
          setOrderProducts(updatedProducts);
      
          // Clear the quantity error
          const updatedErrors = [...errors];
          updatedErrors[index] = { productId: '', quantity: '' };
          setErrors(updatedErrors);
      };
  
    
    // Form validation pre-submission to check for empty/disallowed inputs
    const validate = () => {
      let valid = true;
      const newErrors = orderProducts.map((product) => ({
        productId: product.productId ? '' : 'Product is required.',
        quantity: product.quantity <= 0 ? 'Quantity must be greater than 0.' : '',
      }));
  
      setErrors(newErrors);
  
      // Check if any errors are present
      valid = newErrors.every((error) => !error.productId && !error.quantity);
      return valid;
    };
  
    // Function to submit request to backend
    const handleSubmit = async () => {
        if (validate()) {
          // Prepare the data for the POST request (only productId and quantity to be sent in request)
          const requestData = {
            products: orderProducts.map(product => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          };
  
          try {
            // Send POST request using axios
            const response = await axios.post(`${backendUrl}/orders`, requestData);

            // Show success confirmation in Snackbar
            const createdOrder = response.data;
  
            setSnackbarMessage('Order successfully created.');
            setSnackbarSeverity('success');

            // Update global orders state
            addOrder(createdOrder);
          } catch (error) {
            let errorMessage = 'An unexpected error occurred';
          
            if (axios.isAxiosError(error)) {
              errorMessage = error.response?.data?.message || 'Unknown Axios error';
            }
          
            // Show error in Snackbar
            setSnackbarMessage(`Error creating order: ${errorMessage}`);
            setSnackbarSeverity('error');
          }

          // Show Snackbar
          setSnackbarOpen(true);

          // Close the dialog after request
          onClose();
        }
    };
  
    return (
        <>
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
                    onChange={handleProductChange(index)}
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
                    onChange={handleQuantityChange(index)}
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
                style={{
                marginBottom: '16px',
                }}
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
      </Dialog>

        {/* Snackbar */}
        <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={5000} 
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
            </Alert>
        </Snackbar>
        </>
    );
  };
  
  export default AddOrderDialog;
  