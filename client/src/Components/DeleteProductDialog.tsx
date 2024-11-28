import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Snackbar, 
  Alert 
} from '@mui/material';
import axios from 'axios';
import useProductStore from '../Store/useProductStore';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface DeleteProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string | null;
}

const DeleteProductDialog = ({ open, onClose, productId, productName }: DeleteProductDialogProps) => {
  // Import global state management function
  const { deleteProduct } = useProductStore();
  
  // State variables to manage Snackbar visibility and content
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Function to submit request to backend
  const handleDeleteProduct = async () => {
    if (!productId) return;

    try {
      // Send DELETE request using axios
      await axios.delete(`${backendUrl}/products/${productId}`);

      // Show success snackbar message
      setSnackbarMessage('Product deleted successfully');
      setSnackbarSeverity('success');

      // Remove deleted product from global store
      deleteProduct(productId);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
    
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 'Unknown Axios error';
      }
    
      // Handle error and show error snackbar message
      setSnackbarMessage(`Error deleting product: ${errorMessage}`);
      setSnackbarSeverity('error');
    }

    // Show Snackbar
    setSnackbarOpen(true);

    // Close the dialog after deletion attempt
    onClose();
  };

  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to delete ${productName}? This action cannot be undone.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteProduct} color="error">
          Delete
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

export default DeleteProductDialog;