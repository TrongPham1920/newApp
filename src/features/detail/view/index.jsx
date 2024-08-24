import React, { useState, useEffect } from "react";
import { detailProduct } from "../../../api/app.js";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import HomeList from "../../../components/HomeList/index.js";
import { useAuth } from "../../../global/AuthenticationContext.js";

function HomePage() {
  const [product, setProduct] = useState(null);
  const currentUrl = window.location.href;
  const { addToCart } = useAuth();

  const getProductDetails = async (id) => {
    if (!id) {
      console.log("Error: category is not defined");
      return;
    }
    try {
      const response = await detailProduct(id);

      if (response?.code === 0) {
        setProduct(response?.data);
      } else {
        console.log("Error: response code is not 0");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      getProductDetails(id);
    }
  }, [currentUrl]);

  if (!product) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: "100%", height: "auto" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Giá: {product.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Mô tả ngắn: {product.shortDescription}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Danh mục: {product.categories?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Tồn kho: {product.stock}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Kích thước: {product.dimensions.width} -{" "}
              {product.dimensions.height}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addToCart(product)}
            >
              Mua ngay
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Mô tả chi tiết: {product.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <HomeList title={product.categories?.name} id={product.categories?._id} />
    </Box>
  );
}

export default HomePage;
