import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import useProductStore from '../Store/useProductStore';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string | null;
  initialValues?: { price?: number; stock?: number };
}

const UpdateProductDialog = ({ open, onClose, productId, productName, initialValues = {} }: UpdateProductDialogProps) => {
  // Import global state management function
  const { updateProduct } = useProductStore();

  // State variables to manage Snackbar visibility and content
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // State variables to manage updated product input details
  const [values, setValues] = useState<{ price?: number; stock?: number }>(initialValues);
  const [errors, setErrors] = useState<{ price?: string; stock?: string }>({});

  // useEffect hook to re-render pre-set values on change
  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Function to handle changes in form values and set to state variables
  const handleChange = (field: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
  
    if (field === 'price') {
    // Validation for price (max 2 decimal places)
      const decimalPattern = /^\d+(\.\d{0,2})?$/;
      if (!decimalPattern.test(inputValue)) {
        return;
      }
    }
  
    // Validation for stock (whole numbers only)
    if (field === 'stock') {
      const integerPattern = /^\d*$/;
      if (!integerPattern.test(inputValue)) {
        return;
      }
    }

    // Parse input into correct format
    let value: number | undefined;
    if (inputValue !== '') {
      value = field === 'price' ? parseFloat(inputValue) : parseInt(inputValue, 10);
    } else {
      value = undefined;
    }

    // Clear any previous errors and set new Product state
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Form validation pre-submission to check for empty/disallowed inputs
  const validate = () => {
    const newErrors: { price?: string; stock?: string } = {};

    // Validation for price
    if (values.price !== undefined) {
      if (values.price <= 0) {
        newErrors.price = 'Price must be greater than 0.';
      } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.toString())) {
        newErrors.price = 'Price must have at most 2 decimal places.';
      }
    }

    // Validation for stock
    if (values.stock !== undefined) {
      if (values.stock < 0) {
        newErrors.stock = 'Stock must be 0 or greater.';
      } else if (!Number.isInteger(values.stock)) {
        newErrors.stock = 'Stock must be an integer.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Function to submit request to backend
  const handleUpdateProduct = async (values: { price?: number; stock?: number }) => {
    if (validate()) {
      if (!productId) return;
    
      try {
        // Send PATCH request using axios
        const response = await axios.patch(`${backendUrl}/products/${productId}`, values);

        // Show success confirmation in Snackbar
        const updatedProduct = response.data;

        // Show success alert
        setSnackbarMessage(`${productName} successfully updated.`);
        setSnackbarSeverity('success');  
    
        // Update the global state
        updateProduct(updatedProduct);
      } catch (error) {
        let errorMessage = 'An unexpected error occurred';
      
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || 'Unknown Axios error';
        }

        // Show error in Snackbar
        setSnackbarMessage(`Error updating ${productName}: ${errorMessage}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      
      // Show Snackbar
      setSnackbarOpen(true);

      // Close the dialog after update request
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{`Update ${productName}`}</DialogTitle>
        <DialogContent>
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={values.price ?? ''}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            margin="normal"
            value={values.stock ?? ''}
            onChange={handleChange('stock')}
            error={!!errors.stock}
            helperText={errors.stock}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => (handleUpdateProduct(values))} color="primary">
            Confirm
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

export default UpdateProductDialog;
