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

const AddProductDialog: React.FC<AddProductDialogProps> = ({ open, onClose }) => {
  const { addProduct } = useProductStore();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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

  const handleChange = (field: keyof typeof newProduct) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let inputValue = event.target.value;

    // Validation for price (max 2 decimal places)
    if (field === 'price') {
      const decimalPattern = /^\d*(\.\d{0,2})?$/;
      if (!decimalPattern.test(inputValue)) return; // Reject invalid input
    }

    // Validation for stock (whole numbers only)
    if (field === 'stock') {
      const integerPattern = /^\d*$/;
      if (!integerPattern.test(inputValue)) return; // Reject invalid input
    }

    setNewProduct((prev) => ({ ...prev, [field]: inputValue }));
    setErrors((prev) => ({ ...prev, [field]: '' })); // Clear any previous errors
  };

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
    return Object.values(newErrors).every((error) => !error); // Return true if no errors
  };

  const handleAddProduct = async (product: { name: string; description: string; price: string; stock: string }) => {
    if (validate()) {
      const { name, description, price, stock } = product;
      
      try {
        const response = await axios.post(`${backendUrl}/products`, {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
        });

        const createdProduct = response.data;

        // Show success alert
        setSnackbarMessage(`${name} successfully added.`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        console.log("Add product response: ", response)
    
        // Add the new product to the global state
        addProduct(createdProduct);
      } catch (error) {
        console.error('Error adding product:', error);

        // Show error alert
        setSnackbarMessage(`Error adding ${name}. Please try again.`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      setNewProduct({ name: '', description: '', price: '', stock: '' }); // Reset form
      onClose();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          width: '400px',
          border: '2px solid',
          borderColor: (theme) => theme.palette.success.dark,
          borderRadius: '4px',
          boxShadow: 3,
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductDialog;
