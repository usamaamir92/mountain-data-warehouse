import { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Define a function to fetch the products
    const fetchProducts = async () => {
      try {
        // Make the GET request to the backend
        const response = await axios.get(`${backendUrl}/products`);
        
        // Log the response to the console
        console.log('Products:', response.data);

        // Optionally, set the products data to state
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Call the function to fetch products
    fetchProducts();
  }, []); // Empty dependency array means this runs once after the initial render

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {/* {products.length > 0 ? ( */}
          {/* products.map((product, index) => ( */}
            {/* <li key={index}>{product.name}</li> */}
          {/* )) */}
        {/* // ) : ( */}
          <li>No products found</li>
        {/* )} */}
      </ul>
    </div>
  );
};

export default ProductsPage;
