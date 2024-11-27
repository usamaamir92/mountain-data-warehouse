import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Divider } from '@mui/material';
import ProductsPage from './Pages/ProductsPage';
import OrdersPage from './Pages/OrdersPage';

const drawerWidth = 240;

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          width: '100vw', // Full width of the viewport
          height: '100vh', // Full height of the viewport
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

        {/* Drawer - Clipped under AppBar */}
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
        {/* Spacer for the AppBar's height */}
        <Toolbar />
        
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/products">
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button component={Link} to="/orders">
              <ListItemText primary="Orders" />
            </ListItem>
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
            height: '100vh',
            overflow: 'auto',
          }}
        >
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
