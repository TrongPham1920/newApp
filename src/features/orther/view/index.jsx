import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { orders, changeOrdersStatus, updateOrder } from "../../../api/app";
import dayjs from "dayjs";

function App() {
  const [list, setList] = useState([]);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState(0);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const getList = async () => {
    try {
      const response = await orders();
      if (response?.orders) {
        setList(response?.orders);
      } else {
        console.log("Error: response code is not 0");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đang Xử Lý";
      case 1:
        return "Hoàn Thành";
      case 2:
        return "Hủy";
      default:
        return "Không Xác Định";
    }
  };

  const handleOpenStatusDialog = (id) => {
    setSelectedOrderId(id);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedOrderId(null);
  };

  const handleOpenEditDialog = (order) => {
    setOrderToEdit(order);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setOrderToEdit(null);
  };

  const handleChangeStatus = async () => {
    try {
      let res = await changeOrdersStatus(selectedOrderId, newStatus);
      console.log(res);
      handleCloseStatusDialog();
      getList();
    } catch (error) {
      console.log("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleEditOrder = async () => {
    try {
      if (orderToEdit) {
        const orderData = {
          id: orderToEdit.id,
          user: orderToEdit.user,
          products: orderToEdit.products,
          shippingAddress: orderToEdit.shippingAddress,
        };

        await updateOrder(orderData);
        handleCloseEditDialog();
        getList();
      }
    } catch (error) {
      console.log("Lỗi khi sửa đơn hàng:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", p: "5px" }}>
      <Typography variant="h6" gutterBottom>
        Danh Sách Đơn Hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Sản Phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số Lượng</TableCell>
              <TableCell>Người Đặt</TableCell>
              <TableCell>Địa Chỉ</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {dayjs(order.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {order.products.map((product, index) => (
                    <div key={index}>{product.product}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.price.toLocaleString("vi-VN")}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {order.products.map((product, index) => (
                    <div key={index}>{product.quantity}</div>
                  ))}
                </TableCell>
                <TableCell>{order.user.phone}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>
                  {order.totalAmount.toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>{getStatusText(order.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenEditDialog(order)}
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenStatusDialog(order.id)}
                  >
                    Đổi
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Dialog Thay Đổi Trạng Thái */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Thay Đổi Trạng Thái Đơn Hàng</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Trạng Thái Mới"
            value={newStatus}
            onChange={(e) => setNewStatus(parseInt(e.target.value))}
            fullWidth
          >
            <MenuItem value={0}>Đang Xử Lý</MenuItem>
            <MenuItem value={1}>Hoàn Thành</MenuItem>
            <MenuItem value={2}>Hủy</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleChangeStatus} color="secondary">
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Dialog Sửa Đơn Hàng */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Sửa Đơn Hàng</DialogTitle>
        <DialogContent>
          <TextField
            label="Địa Chỉ Giao Hàng"
            value={orderToEdit?.shippingAddress || ""}
            onChange={(e) =>
              setOrderToEdit({
                ...orderToEdit,
                shippingAddress: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />

          {orderToEdit?.products.map((product, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Sản Phẩm: {product.product}
              </Typography>
              <TextField
                label="Số Lượng"
                type="number"
                value={product.quantity}
                onChange={(e) => {
                  const updatedProducts = [...orderToEdit.products];
                  updatedProducts[index] = {
                    ...updatedProducts[index],
                    quantity: parseInt(e.target.value),
                  };
                  setOrderToEdit({ ...orderToEdit, products: updatedProducts });
                }}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Giá"
                type="number"
                value={product.price}
                onChange={(e) => {
                  const updatedProducts = [...orderToEdit.products];
                  updatedProducts[index] = {
                    ...updatedProducts[index],
                    price: parseFloat(e.target.value),
                  };
                  setOrderToEdit({ ...orderToEdit, products: updatedProducts });
                }}
                fullWidth
                margin="dense"
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleEditOrder} color="secondary">
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
