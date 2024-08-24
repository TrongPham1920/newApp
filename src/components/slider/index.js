import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Box
        sx={{
          position: "relative",
          width: "90%",
          margin: "auto",
          overflow: "hidden",
        }}
      >
        <img
          src={images[currentImageIndex]}
          alt="slider"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            transition: "transform 0.5s ease",
          }}
        />
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <ArrowForward />
        </IconButton>
      </Box>

      <Typography variant="caption">
        {currentImageIndex + 1} / {images.length}
      </Typography>
    </Box>
  );
};

export default ImageSlider;
