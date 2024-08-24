// Main.js
import React from "react";
import { Container, Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

function Main({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container component="main" sx={{ flexGrow: 1, my: 2 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}

export default Main;
