import { Box } from "@mui/material";
import React from "react";
import CustomTabs from "../../../components/tabs/index";
import Category from "../../category/view/index";
import Order from "../../orther/view/index";
import Product from "../../product/view/index";
import User from "../../user/view/index";

const tabs = [
  { label: "Đơn hàng", content: <Order /> },
  { label: "Sản phẩm", content: <Product /> },
  { label: "Danh mục", content: <Category /> },
  { label: "User", content: <User /> },
];

function App() {
  return (
    <Box sx={{ width: "100%" }}>
      <CustomTabs tabs={tabs} />
    </Box>
  );
}

export default App;
