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
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  changeProductStatus,
  product,
  updateProduct,
  addProduct,
  category,
  addIMG,
} from "../../../api/app";

function App() {
  const [list, setList] = useState([]);
  const [listCate, setListCate] = useState([]);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    shortDescription: "",
    categories: "",
    images: [],
    keywords: [""],
    stock: "",
    description: "",
    dimensions: {
      width: "",
      height: "",
    },
    type: 0,
  });

  const [filterParams, setFilterParams] = useState({
    page: 0,
    limit: 10,
  });

  const getList = async (filterParams) => {
    try {
      const response = await product(filterParams);
      if (response?.data) {
        setList(response.data);
        setTotalCount(response.total);
      } else {
        console.log("Error: response code is not 0");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getListCate = async () => {
    try {
      const response = await category();
      if (response?.data) {
        setListCate(response.data);
      } else {
        console.log("Error: response code is not 0");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getList(filterParams);
    getListCate();
  }, [filterParams]);

  const handleChangeStatus = async (id) => {
    try {
      if (id !== null) {
        await changeProductStatus(id);
        getList(filterParams);
      }
    } catch (error) {
      console.log("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleOpenEditDialog = (product) => {
    setIsAdding(false);
    setProductToEdit(product);
    setFormData({
      name: product.name,
      price: product.price,
      shortDescription: product.shortDescription,
      categories: product.categories?._id || "",
      images: product.images || [""],
      keywords: product.keywords || [""],
      stock: product.stock,
      description: product.description,
      dimensions: {
        width: product.dimensions?.width || "",
        height: product.dimensions?.height || "",
      },
      type: product.type,
    });
    setOpenEditDialog(true);
  };

  const handleOpenAddDialog = () => {
    setIsAdding(true);
    setProductToEdit(null);
    setFormData({
      name: "",
      price: "",
      shortDescription: "",
      categories: "",
      images: [],
      keywords: [""],
      stock: "",
      description: "",
      dimensions: {
        width: "",
        height: "",
      },
      type: 0,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setProductToEdit(null);
    setFormData({
      name: "",
      price: "",
      shortDescription: "",
      categories: "",
      images: [],
      keywords: [""],
      stock: "",
      description: "",
      dimensions: {
        width: "",
        height: "",
      },
      type: 0,
    });
  };

  const handleUpdateProduct = async () => {
    try {
      if (isAdding) {
        await addProduct(formData);
      } else if (productToEdit) {
        await updateProduct(productToEdit._id, formData);
      }
      handleCloseEditDialog();
      getList(filterParams);
    } catch (error) {
      console.log("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      limit: parseInt(event.target.value, 10),
      page: 0, // Reset to the first page
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      categories: e.target.value,
    }));
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const file = files[0];

        const response = await addIMG(file);
        console.log(response);

        if (response) {
          setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, response.url],
          }));
        }
      } catch (error) {
        console.log("Lỗi khi upload ảnh:", error);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", p: "5px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Danh Sách Sản phẩm
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
        >
          Thêm Sản phẩm
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Sản Phẩm</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Danh Mục</TableCell>
              <TableCell>Tồn Kho</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  {product.status ? "Hoạt Động" : "Ngừng Hoạt Động"}
                </TableCell>
                <TableCell>{product.categories?.name || "Không Có"}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {dayjs(product.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenEditDialog(product)}
                    sx={{ ml: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleChangeStatus(product._id)}
                  >
                    Trạng Thái
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={filterParams.limit}
        page={filterParams.page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {/* Popup Dialog Thêm hoặc Sửa Sản Phẩm */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>{isAdding ? "Thêm Sản Phẩm" : "Sửa Sản Phẩm"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Sản Phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Giá"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Mô Tả Ngắn"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Danh Mục</InputLabel>
            <Select
              name="categories"
              value={formData.categories}
              onChange={handleSelectChange}
              fullWidth
              margin="dense"
            >
              {listCate.map((cate) => (
                <MenuItem key={cate._id} value={cate._id}>
                  {cate.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Số Lượng Tồn Kho"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Mô Tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Chiều Rộng"
            name="dimensions.width"
            value={formData.dimensions.width}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                dimensions: {
                  ...prevData.dimensions,
                  width: e.target.value,
                },
              }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Chiều Cao"
            name="dimensions.height"
            value={formData.dimensions.height}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                dimensions: {
                  ...prevData.dimensions,
                  height: e.target.value,
                },
              }))
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Loại"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Box mt={2}>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
            {formData.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`img-${index}`}
                style={{ width: 100, height: 100, margin: 5 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Hủy Bỏ
          </Button>
          <Button onClick={handleUpdateProduct} color="primary">
            {isAdding ? "Thêm" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
