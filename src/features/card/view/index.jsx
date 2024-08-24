import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { addOrder } from "../../../api/app.js";
import { useAuth } from "../../../global/AuthenticationContext.js";

function HomePage() {
  const { cart, removeFromCart, clearCart, updateCartQuantity, profile } =
    useAuth();

  const [cartData, setCartData] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [isEmpty, setIsEmpty] = useState(true);
  const [open, setOpen] = useState(false);

  const bank = {
    bankName: "MBBANK",
    bankNumber: "0915374450",
  };

  useEffect(() => {
    if (cart && cart.length > 0) {
      setCartData(cart);
      setIsEmpty(false);
      // Calculate total price
      const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setCartData([]);
      setIsEmpty(true);
    }
  }, [cart]);

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value, 10) || 1);
    updateCartQuantity(id, quantity);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePlaceOrder = async () => {
    const modifiedCartData = cartData.map(({ _id, price, quantity }) => ({
      product: _id,
      price,
      quantity,
    }));

    try {
      const data = {
        userId: profile._id,
        products: modifiedCartData,
        shippingAddress: shippingAddress,
      };
      let res = await addOrder(data);
      if (res?.addOrder) {
        setSnackbarMessage(`Đặt hàng thành công`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        clearCart();
        handleClose();
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {isEmpty ? (
        <Typography variant="h6" color="textSecondary">
          Giỏ hàng rỗng
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} container justifyContent="space-between">
              <Typography variant="h6" color="textSecondary">
                Giỏ hàng
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => clearCart()}
              >
                Xóa giỏ hàng
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Xóa</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartData.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item._id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                            inputProps={{ min: 1 }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ mt: 2 }}
          >
            Thanh toán
          </Button>
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Thanh toán</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" color="textSecondary">
                    Địa chỉ giao hàng
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" color="textSecondary">
                    Các sản phẩm
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartData.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item._id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.price.toLocaleString()}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                    Thành tiền: {totalPrice.toLocaleString()} VND
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <img
                    width="100%"
                    src={`https://img.vietqr.io/image/${bank?.bankName || ""}-${
                      bank?.bankNumber
                    }-compact.jpg?addInfo=${totalPrice}`}
                    alt="QR Code"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button onClick={handlePlaceOrder} color="primary">
                Đặt hàng
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HomePage;
