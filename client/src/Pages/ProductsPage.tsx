import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import UpdateProductDialog from '../Components/UpdateProductDialog';
import DeleteProductDialog from '../Components/DeleteProductDialog';
import AddProductDialog from '../Components/AddProductDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
  const [updateProductDialogOpen, setUpdateProductDialogOpen] = useState(false);  
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const [currentProductName, setCurrentProductName] = useState<string | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  // Load Products on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Function to close snackbar alerts
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Update product functions and modal
  const handleOpenUpdateProductDialog = (productId: string, productName: string) => {
    setCurrentProductId(productId);
    setCurrentProductName(productName);
    setUpdateProductDialogOpen(true);
  };
  
  const handleCloseUpdateProductDialog = () => {
    setUpdateProductDialogOpen(false);

    setTimeout(() => {
      setCurrentProductId(null);
      setCurrentProductName(null);    
    }, 300);
  };
  
  const handleUpdateProduct = async (values: { price?: number; stock?: number }) => {
    if (!currentProductId) return;
  
    try {
      // Send the update to the backend
      await axios.patch(`${backendUrl}/products/${currentProductId}`, values);
  
      // Update the local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === currentProductId
            ? { ...product, ...values } // Merge updated values with the existing product
            : product
        )
      );

      // Show success alert
      setSnackbarMessage(`${currentProductName} successfully updated.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      console.log(`Updated product ${currentProductId}:`, values);
    } catch (error) {
      console.error('Error updating product:', error);

      // Show error alert
      setSnackbarMessage(`Error updating ${currentProductName}. Please try again.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  
  // Delete product functions and modal
  const handleOpenDeleteProductDialog = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setDeleteProductDialogOpen(true);
  };
  
  const handleCloseDeleteProductDialog = () => {
    setDeleteProductDialogOpen(false);

    setTimeout(() => {
      setSelectedProductId(null);
      setSelectedProductName(null);  
    }, 300);
  };

  const handleConfirmDeleteProduct = async () => {
    if (selectedProductId) {
      await handleDeleteProduct(selectedProductId); // Call your delete function
    }
    handleCloseDeleteProductDialog();
  };
  
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/products/${productId}`);
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );

      // Show success alert
      setSnackbarMessage(`${currentProductName} deleted successfully.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting product:', error);

      // Show error alert
      setSnackbarMessage(`Error deleting ${currentProductName}. Please try again.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };


  // Add Product functions and modal
  const handleOpenAddProductDialog = () => setAddProductDialogOpen(true);
  const handleCloseAddProductDialog = () => setAddProductDialogOpen(false);

  const handleAddProduct = async (product: { name: string; description: string; price: string; stock: string }) => {
    const { name, description, price, stock } = product;
  
    // Here, we no longer need to do manual validation as it's handled by the AddProductDialog
    try {
      const response = await axios.post(`${backendUrl}/products`, {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      });

      // Show success alert
      setSnackbarMessage(`${name} successfully added.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Add the new product to the state
      setProducts((prev) => [...prev, response.data]);
  
      // Close the dialog after adding the product
      handleCloseAddProductDialog();
    } catch (error) {
      console.error('Error adding product:', error);

      // Show error alert
      setSnackbarMessage(`Error adding ${name}. Please try again.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Edit Product Dialog */}
      <UpdateProductDialog
        open={updateProductDialogOpen}
        onClose={handleCloseUpdateProductDialog}
        onConfirm={(values) => handleUpdateProduct(values)}
        title={`Update ${currentProductName}`}
        initialValues={{
          price: products.find((p) => p.productId === currentProductId)?.price,
          stock: products.find((p) => p.productId === currentProductId)?.stock,
        }}
      />

      {/* Delete Product Dialog */}
      <DeleteProductDialog
      open={deleteProductDialogOpen}
      onClose={handleCloseDeleteProductDialog}
      onConfirm={handleConfirmDeleteProduct}
      title="Confirm Deletion"
      description={`Are you sure you want to delete ${selectedProductName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      />

      {/* Add Product Button */}
      <Tooltip title="Add new product">
        <Fab color="primary" aria-label="add" onClick={handleOpenAddProductDialog} style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={addProductDialogOpen}
        onClose={handleCloseAddProductDialog}
        onAdd={handleAddProduct}
      />

      {/* Snackbar alert component */}
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

      {/* Page contents */}
      {products.length > 0 ? (
        <TableContainer component={Paper} sx={{ marginBottom: '64px' }}>
          <Table>
          <TableHead>
              <TableRow>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="right"><strong>Price (£)</strong></TableCell>
                {/* <TableCell align="center"></TableCell> */}
                <TableCell align="right" sx={{ paddingRight: '64px' }}><strong>Stock</strong></TableCell>
                <TableCell align="center"></TableCell> {/* Empty header for edit stock */}
                <TableCell align="center"></TableCell> {/* Empty header for delete button */}
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>

                  <TableCell align="right">
                    {product.price.toFixed(2)}
                  </TableCell>

                  <TableCell align="right" sx={{ paddingRight: '64px' }}>
                    {product.stock}
                  </TableCell>

                  <TableCell align="center" sx={{ width: '56px', padding: '0' }}>
                    <Tooltip title="Update Price/Stock">
                      <IconButton
                        aria-label="edit-stock"
                        color="primary"
                        onClick={() => handleOpenUpdateProductDialog(product.productId, product.name)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center" sx={{ padding: '0' }}>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleOpenDeleteProductDialog(product.productId, product.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  {/* <TableCell align="center" sx={{ width: '56px' }}>
                    <Tooltip title="Update Price/Stock">
                      <IconButton
                        aria-label="edit-stock"
                        color="primary"
                        onClick={() => handleOpenUpdateProductDialog(product.name, product.productId)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleOpenDeleteProductDialog(product.productId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell> */}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No products found</Typography>
      )}
    </div>
  );
};

export default ProductsPage;
