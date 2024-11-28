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

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  // onConfirm: (values: { price?: number; stock?: number }) => void;
  productId: string | null;
  productName: string | null;
  initialValues?: { price?: number; stock?: number };
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  open,
  onClose,
  // onConfirm,
  productId,
  productName,
  initialValues = {},
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [values, setValues] = useState<{ price?: number; stock?: number }>(initialValues);
  const [errors, setErrors] = useState<{ price?: string; stock?: string }>({});


  const handleChange = (field: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
  
    if (field === 'price') {
      // Allow only numbers with at most 2 decimal places
      const decimalPattern = /^\d+(\.\d{0,2})?$/;
      if (!decimalPattern.test(inputValue)) {
        return; // Ignore invalid input
      }
    }
  
    if (field === 'stock') {
      // Allow only whole numbers (no decimals) 
      const integerPattern = /^\d*$/; // Matches only whole numbers
      if (!integerPattern.test(inputValue)) {
        return; // Ignore invalid input
      }
    }
  
    let value: number | undefined;
    if (inputValue !== '') {
      value = field === 'price' ? parseFloat(inputValue) : parseInt(inputValue, 10);
    } else {
      value = undefined;
    }
  
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  
  useEffect(() => {
    console.log("changed values: ", values)
  },[values])

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

  const handleUpdateProduct = async (values: { price?: number; stock?: number }) => {
    if (validate()) {
      if (!productId) return;
    
      try {
        // Send the update to the backend
        await axios.patch(`${backendUrl}/products/${productId}`, values);
    
        // Update the global state when zustand set up
        // setProducts((prevProducts) =>
        //   prevProducts.map((product) =>
        //     product.productId === selectedProductId
        //       ? { ...product, ...values } // Merge updated values with the existing product
        //       : product
        //   )
        // );

        // Show success alert
        setSnackbarMessage(`${productName} successfully updated.`);
        setSnackbarSeverity('success');  
        console.log(`Updated product ${productId}:`, values);
      } catch (error) {
        console.error('Error updating product:', error);

        // Show error alert
        setSnackbarMessage(`Error updating ${productName}. Please try again.`);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      onClose();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close snackbar
  };

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

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

export default UpdateProductDialog;
