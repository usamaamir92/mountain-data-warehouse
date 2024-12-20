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
  Tooltip,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddOrderDialog from '../Components/AddOrderDialog';
import useOrderStore from '../Store/useOrderStore';


const OrdersPage = () => {
  const { orders } = useOrderStore();
  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);

  // Functions to open and close add order modal
  const handleOpenAddOrderDialog = () => setAddOrderDialogOpen(true);
  const handleCloseAddOrderDialog = () => setAddOrderDialogOpen(false);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {/* Add Order Button */}
      <Tooltip title="Add new order">
        <Fab color="primary" aria-label="add" onClick={handleOpenAddOrderDialog} style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Add Order Dialog */}
      <AddOrderDialog
        open={addOrderDialogOpen}
        onClose={handleCloseAddOrderDialog}
      />

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
