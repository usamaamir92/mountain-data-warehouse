import { useState } from 'react';
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
} from '@mui/material';
import UpdateProductDialog from '../Components/UpdateProductDialog';
import DeleteProductDialog from '../Components/DeleteProductDialog';
import AddProductDialog from '../Components/AddProductDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useProductStore from '../Store/useProductStore';


const ProductsPage = () => {
  // Zustand store for global state management
  const { products } = useProductStore();

  // Declare state variables related to add/update/delete product modals
  const [updateProductDialogOpen, setUpdateProductDialogOpen] = useState(false);  
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
  
  // Variables to pass product name and id to add/update/delete modals
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Functions to open and close add product modal
  const handleOpenAddProductDialog = () => setAddProductDialogOpen(true);
  const handleCloseAddProductDialog = () => setAddProductDialogOpen(false);
  
  // Functions to open and close update product modal
  const handleOpenUpdateProductDialog = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setUpdateProductDialogOpen(true);
  };
  
  const handleCloseUpdateProductDialog = () => {
    setUpdateProductDialogOpen(false);

    setTimeout(() => {
      setSelectedProductId(null);
      setSelectedProductName(null);    
    }, 300);
  };
  
  // Functions to open and close delete product modal
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
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

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
      />

      {/* Update Product Dialog */}
      <UpdateProductDialog
        open={updateProductDialogOpen}
        onClose={handleCloseUpdateProductDialog}
        productId={selectedProductId}
        productName={selectedProductName}
        initialValues={{
          price: products.find((p) => p.productId === selectedProductId)?.price,
          stock: products.find((p) => p.productId === selectedProductId)?.stock,
        }}
      />

      {/* Delete Product Dialog */}
      <DeleteProductDialog
      open={deleteProductDialogOpen}
      onClose={handleCloseDeleteProductDialog}
      productId={selectedProductId}
      productName={selectedProductName}
      />

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
