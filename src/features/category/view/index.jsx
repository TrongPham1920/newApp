import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import {
  changeCategoryStatus,
  category,
  updateCategory,
  addCategory, // Assuming you have an API call for adding a category
} from "../../../api/app";

function App() {
  const [list, setList] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false); // New state to differentiate between add and edit

  const getList = async () => {
    try {
      const response = await category();
      if (response?.data) {
        setList(response.data);
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

  const handleChangeStatus = async (id) => {
    try {
      if (id !== null) {
        await changeCategoryStatus(id);
        getList();
      }
    } catch (error) {
      console.log("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleOpenEditDialog = (category) => {
    setIsAdding(false);
    setOrderToEdit(category);
    setNewName(category.name);
    setOpenEditDialog(true);
  };

  const handleOpenAddDialog = () => {
    setIsAdding(true);
    setOrderToEdit(null);
    setNewName("");
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setOrderToEdit(null);
    setNewName("");
  };

  const handleUpdateCategory = async () => {
    try {
      if (isAdding) {
        const newCategory = {
          name: newName,
        };
        await addCategory(newCategory);
      } else if (orderToEdit && newName) {
        const updateData = {
          name: newName,
        };
        await updateCategory(orderToEdit._id, updateData);
      }
      handleCloseEditDialog();
      getList();
    } catch (error) {
      console.log("Lỗi khi cập nhật danh mục:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", p: "5px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Danh Sách Danh mục
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
        >
          Thêm Danh Mục
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Danh Mục</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Ngày Cập Nhật</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.status ? "Hoạt Động" : "Ngừng Hoạt Động"}
                </TableCell>
                <TableCell>
                  {dayjs(category.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {dayjs(category.updatedAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenEditDialog(category)}
                    sx={{ ml: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleChangeStatus(category._id)}
                  >
                    trạng thái
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Dialog Thêm hoặc Sửa Danh Mục */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>
          {isAdding ? "Thêm Danh Mục" : "Sửa Tên Danh Mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Mới"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleUpdateCategory} color="secondary">
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
