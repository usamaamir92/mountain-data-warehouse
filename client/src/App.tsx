import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Divider, ListItemButton } from '@mui/material';
import ProductsPage from './Pages/ProductsPage';
import OrdersPage from './Pages/OrdersPage';

const drawerWidth = 240;

function App() {
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
