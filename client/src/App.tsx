import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  List, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography, 
  ListItemButton,
  Snackbar,
  Alert
} from '@mui/material';
import ProductsPage from './Pages/ProductsPage';
import OrdersPage from './Pages/OrdersPage';
import useProductStore from './Store/useProductStore';
import useOrderStore from './Store/useOrderStore';
import axios from 'axios';

const drawerWidth = 240;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  // Fetch products and orders at app level and save to global storage
  const { setProducts } = useProductStore();
  const { setOrders } = useOrderStore();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/products`);
        setProducts(response.data); // Store products globally
      } catch (error) {
        let errorMessage = 'An unexpected error occurred'

        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || 'Unknown Axios error';
        }
      
        // Show error alert
        setSnackbarMessage(`Error fetching Product list: ${errorMessage}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
  
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/orders`);
        setOrders(response.data); // Store orders globally
      } catch (error) {
        let errorMessage = 'An unexpected error occurred'

        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || 'Unknown Axios error';
        }
      
        // Show error alert
        setSnackbarMessage(`Error fetching Order list: ${errorMessage}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
  
    fetchProducts();
    fetchOrders();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
        }}
      >
        <CssBaseline />
        
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Mountain DataWarehouse
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Navbar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            position: 'fixed',
            top: 64,  // Position the Drawer below the AppBar
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            },
          }}
        >

        {/* Spacer */}
        <Toolbar />
        
        {/* Navbar Items */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton component={Link} to="/products">
              <ListItemText primary="Products" />
            </ListItemButton>
            <ListItemButton component={Link} to="/orders">
              <ListItemText primary="Orders" />
            </ListItemButton>
          </List>
        </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f5f5f5',
            p: 3,
            ml: `${drawerWidth}px`, // To make space for the drawer
            mt: '64px', // Adjust the top margin to avoid overlap with AppBar
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >

        {/* Snackbar to show success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
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

        {/* Set routes */}
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/" element={<Typography variant="h4">Home Page</Typography>} />
        </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
