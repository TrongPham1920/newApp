import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { find } from "../../api/app";
import { useAuth } from "../../global/AuthenticationContext.js";

const ProductList = ({ list }) => {
  const { addToCart } = useAuth();
  const navigate = useNavigate();

  const handleDetail = (productId) => {
    navigate(`/detail?id=${productId}`);
  };

  const handleOrder = (productId) => {
    addToCart(productId);
  };

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={3}>
        {list.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <Card sx={{ maxWidth: 270 }}>
              <CardMedia
                component="img"
                height="300"
                image={product.images[0]}
                alt={product.name}
              />
              <CardContent sx={{ padding: 1 }}>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="h8" component="div">
                  {product.shortDescription}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.price.toLocaleString("vi-VN")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleDetail(product._id)}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleOrder(product)}
                  >
                    Đặt hàng
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
