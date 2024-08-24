import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
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
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { changeUserStatus, user } from "../../../api/app";

function App() {
  const [list, setList] = useState([]);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState(true);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const getList = async () => {
    try {
      const response = await user();
      if (response?.data) {
        setList(response?.data);
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

  const getRoleText = (role) => {
    switch (role) {
      case 0:
        return "Admin";
      case 1:
        return "Khách";
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
      if (selectedOrderId !== null && newStatus !== null) {
        const statusUpdateData = {
          id: selectedOrderId,
          status: newStatus,
        };
        let res = await changeUserStatus(statusUpdateData);
        console.log(res);
        handleCloseStatusDialog();
        getList();
      }
    } catch (error) {
      console.log("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", p: "5px" }}>
      <Typography variant="h6" gutterBottom>
        Danh Sách Người Dùng
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Ngày Cập Nhật</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{getRoleText(user.role)}</TableCell>
                <TableCell>
                  {user.status ? "Hoạt Động" : "Ngừng Hoạt Động"}
                </TableCell>
                <TableCell>
                  {dayjs(user.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {dayjs(user.updatedAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenStatusDialog(user._id)}
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
        <DialogTitle>Thay Đổi Trạng Thái</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Trạng Thái Mới"
            value={newStatus ? "true" : "false"}
            onChange={(e) => setNewStatus(e.target.value === "true")}
            fullWidth
            margin="dense"
          >
            <MenuItem value="true">Hoạt Động</MenuItem>
            <MenuItem value="false">Ngừng Hoạt Động</MenuItem>
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
    </Box>
  );
}

export default App;
