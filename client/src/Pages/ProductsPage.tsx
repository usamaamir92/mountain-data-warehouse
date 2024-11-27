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
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../Components/ConfirmationDialog';
import EditIcon from '@mui/icons-material/Edit';
import EditDialog from '../Components/EditDialog';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentProductName, setCurrentProductName] = useState<string | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

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

  const handleOpenDialog = (productId: string) => {
    setSelectedProductId(productId);
    setOpen(true);
  };
  
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProductId(null);
  };
  
  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      await handleDelete(selectedProductId); // Call your delete function
    }
    handleCloseDialog();
  };

  const handleOpenEditDialog = (productName: string, productId: string) => {
    setCurrentProductId(productId);
    setCurrentProductName(productName);
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);

    setTimeout(() => {
      setCurrentProductId(null);
      setCurrentProductName(null);    
    }, 300);
  };
  
  const handleUpdate = async (values: { price?: number; stock?: number }) => {
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
  
      console.log(`Updated product ${currentProductId}:`, values);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/products/${productId}`);
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <ConfirmationDialog
      open={open}
      onClose={handleCloseDialog}
      onConfirm={handleConfirmDelete}
      title="Confirm Deletion"
      description="Are you sure you want to delete this product? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
    />

    {/* Edit Dialog */}
    <EditDialog
      open={editDialogOpen}
      onClose={handleCloseEditDialog}
      onConfirm={(values) => handleUpdate(values)}
      title={`Update ${currentProductName}`}
      initialValues={{
        price: products.find((p) => p.productId === currentProductId)?.price,
        stock: products.find((p) => p.productId === currentProductId)?.stock,
      }}
    />

      {products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
              <TableRow>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="left"><strong>Price (£)</strong></TableCell>
                {/* <TableCell align="center"></TableCell> */}
                <TableCell align="left"><strong>Stock</strong></TableCell>
                <TableCell align="center"></TableCell> {/* Empty header for edit stock */}
                <TableCell align="center"></TableCell> {/* Empty header for delete button */}
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>

                  <TableCell>
                    {product.price}
                  </TableCell>

                  <TableCell>
                    {product.stock}
                  </TableCell>

                  <TableCell align="center" sx={{ width: '56px' }}>
                    <Tooltip title="Update Price/Stock">
                      <IconButton
                        aria-label="edit-stock"
                        color="primary"
                        onClick={() => handleOpenEditDialog(product.name, product.productId)}
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
                        onClick={() => handleOpenDialog(product.productId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

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
