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
  Tooltip,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddOrderDialog from '../Components/AddOrderDIalog';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]); // Orders state

  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<{ productId: string, name: string }[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Load Orders on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/products`);
        setAvailableProducts(response.data);
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

  // Add Order button
  const handleOpenAddOrderDialog = () => setAddOrderDialogOpen(true);
  const handleCloseAddOrderDialog = () => setAddOrderDialogOpen(false);

  const handleAddOrder = async (order: { products: { productId: string, quantity: number }[] }) => {
    try {
      const response = await axios.post(`${backendUrl}/orders`, order);
      setOrders((prev) => [...prev, response.data]);
      handleCloseAddOrderDialog();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      <AddOrderDialog
        open={addOrderDialogOpen}
        onClose={handleCloseAddOrderDialog}
        onAdd={handleAddOrder}
        availableProducts={availableProducts}
      />

      {/* Add Order Button */}
      <Tooltip title="Add new order">
        <Fab color="primary" aria-label="add" onClick={handleOpenAddOrderDialog} style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <AddIcon />
        </Fab>
      </Tooltip>

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
      {orders.length > 0 ? (
        <TableContainer component={Paper} sx={{ marginBottom: '64px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Auto-sized columns */}
                <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}><strong>Order ID</strong></TableCell>
                <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}><strong>Order Date</strong></TableCell>
                <TableCell sx={{ width: '100%' }}><strong>Products</strong></TableCell>
                <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }} align="right"><strong>Total Amount (£)</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{order.orderId}</TableCell>
                  <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {new Date(order.orderDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ width: '100%', verticalAlign: 'top' }}>

                    {/* Nested table for products */}
                    <Table sx={{ padding: 0 }}>
                      <TableBody>
                        {order.products.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell sx={{ padding: "0 0 16px 0", borderBottom: "none"}}>
                              <Typography variant="body2" component="div"><strong>Name: </strong>{product.name}</Typography>
                              <Typography variant="body2" component="div"><strong>Description: </strong> {product.description}</Typography>
                              <Typography variant="body2" component="div"><strong>Price (per item, at time of order): </strong> £{product.price.toFixed(2)}</Typography>
                              <Typography variant="body2" component="div"><strong>Quantity: </strong> {product.quantity}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap', verticalAlign: 'top' }} align="right">
                    {order.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No orders found</Typography>
      )}
    </div>
  );
};

export default OrdersPage;
