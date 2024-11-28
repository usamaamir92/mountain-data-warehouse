import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import useProductStore from '../Store/useProductStore';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddProductDialog = ({ open, onClose }: AddProductDialogProps) => {
  // Import global state management function
  const { addProduct } = useProductStore();

  // State variables to manage Snackbar visibility and content
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // State variable to manage new product input details
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  // Function to handle changes in form values and set to state variables
  const handleChange = (field: keyof typeof newProduct) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let inputValue = event.target.value;

    // Validation for price (max 2 decimal places)
    if (field === 'price') {
      const decimalPattern = /^\d*(\.\d{0,2})?$/;
      if (!decimalPattern.test(inputValue)) return;
    }

    // Validation for stock (whole numbers only)
    if (field === 'stock') {
      const integerPattern = /^\d*$/;
      if (!integerPattern.test(inputValue)) return;
    }

    // Clear any previous errors and set new Product state
    setNewProduct((prev) => ({ ...prev, [field]: inputValue }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Form validation pre-submission to check for empty/disallowed inputs
  const validate = () => {
    const { name, description, price, stock } = newProduct;
    const newErrors: typeof errors = {
      name: '',
      description: '',
      price: '',
      stock: '',
    };

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Price must be greater than 0.';
    if (!stock || parseInt(stock, 10) < 0) newErrors.stock = 'Stock must be 0 or greater.';

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Function to submit request to backend
  const handleAddProduct = async (product: { name: string; description: string; price: string; stock: string }) => {
    if (validate()) {
      const { name, description, price, stock } = product;
      
      try {
        // Send POST request using axios
        const response = await axios.post(`${backendUrl}/products`, {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
        });

        // Show success confirmation in Snackbar
        const createdProduct = response.data;

        setSnackbarMessage(`${name} successfully added.`);
        setSnackbarSeverity('success');
    
        // Update global products state
        addProduct(createdProduct);
      } catch (error) {
        let errorMessage = 'An unexpected error occurred';
      
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || 'Unknown Axios error';
        }
      
        // Show error in Snackbar
        setSnackbarMessage(`Error adding ${name}: ${errorMessage}`);
        setSnackbarSeverity('error');
      }
      
      // Show Snackbar
      setSnackbarOpen(true);

      // Reset form and close dialog
      setNewProduct({ name: '', description: '', price: '', stock: '' });
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={newProduct.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.price}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{ step: 0.01 }}
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            margin="normal"
            value={newProduct.stock}
            onChange={handleChange('stock')}
            error={!!errors.stock}
            helperText={errors.stock}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => (handleAddProduct(newProduct))} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar to show success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          width: '400px',
          border: '2px solid',
          borderColor: (theme) => theme.palette.success.dark,
          borderRadius: '4px',
          boxShadow: 3,
        }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductDialog;
