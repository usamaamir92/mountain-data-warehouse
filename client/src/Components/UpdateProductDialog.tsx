import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: { price?: number; stock?: number }) => void;
  title: string;
  initialValues?: { price?: number; stock?: number };
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  initialValues = {},
}) => {
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

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(values);
      onClose();
    }
  };

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
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
        <Button onClick={handleSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProductDialog;
