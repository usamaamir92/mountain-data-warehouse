import React, { useState } from 'react';
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

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ open, onClose, productId, productName }) => {
  const { deleteProduct } = useProductStore();
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Function to delete product from the server
  const handleDeleteProduct = async () => {
    if (!productId) return;

    try {
      await axios.delete(`${backendUrl}/products/${productId}`);

      // Show success snackbar message
      setSnackbarMessage('Product deleted successfully');
      setSnackbarSeverity('success');

      // Remove deleted product from global store
      deleteProduct(productId);
    } catch (error) {
      // Handle error and show error snackbar message
      setSnackbarMessage('Error deleting product');
      setSnackbarSeverity('error');
    }

    // Open Snackbar
    setSnackbarOpen(true);
    onClose(); // Close the dialog after deletion attempt
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close snackbar
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

export default DeleteProductDialog;


// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

// interface DeleteProductDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   title?: string;
//   description?: string;
//   confirmText?: string;
//   cancelText?: string;
// }

// const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
//   open,
//   onClose,
//   onConfirm,
//   title = "Confirm Action",
//   description = "Are you sure you want to proceed?",
//   confirmText = "Confirm",
//   cancelText = "Cancel",
// }) => {
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       aria-labelledby="confirm-dialog-title"
//       aria-describedby="confirm-dialog-description"
//     >
//       <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="confirm-dialog-description">
//           {description}
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           {cancelText}
//         </Button>
//         <Button onClick={onConfirm} color="error" autoFocus>
//           {confirmText}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DeleteProductDialog;
