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
import { useAuth } from "../../global/AuthenticationContext";

const ProductList = ({ title, id }) => {
  const { addToCart } = useAuth();

  const [list, setList] = useState([]);
  const [filterParams, setFilterParams] = useState({
    page: 0,
    limit: 8,
    category: id,
  });

  const navigate = useNavigate();

  const getList = async (filterParams) => {
    if (!filterParams.category) {
      console.log("Error: category is not defined");
      return;
    }

    try {
      const response = await find(filterParams);

      if (response?.code === 0) {
        setList(response?.data?.slice(0, 8));
      } else {
        console.log("Error: response code is not 0");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      category: id,
    }));
  }, [id]);

  useEffect(() => {
    if (filterParams.category) {
      getList(filterParams);
    } else {
      console.log("Error: filterParams.category is null or undefined");
    }
  }, [filterParams]);

  const handleViewMore = () => {
    navigate(`/find?category=${id}`);
  };

  const handleDetail = (productId) => {
    navigate(`/detail?id=${productId}`);
  };

  const handleOrder = (productId) => {
    addToCart(productId);
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
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
      <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
        <Button variant="contained" onClick={handleViewMore}>
          Xem thêm
        </Button>
      </Box>
    </Box>
  );
};

export default ProductList;
