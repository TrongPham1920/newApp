import React, { useState, useEffect } from "react";
import HomeList from "../../../components/HomeList/index.js";
import ImageSlider from "../../../components/slider/index.js";
import { category } from "../../../api/app.js";

const images = [
  "https://bizweb.dktcdn.net/100/426/984/themes/900482/assets/slider_1.jpg?1717042818050",
  "https://cmsv2.yame.vn/uploads/36a8c4b4-b796-4b88-a572-d2ff11662d01/quan_ao_thoi_trang_gia_tot.jpg?quality=80&w=0&h=0",
];

function HomePage() {
  const [listCategory, setListCategory] = useState([]);

  const getCategory = async () => {
    try {
      const response = await category();

      if (response?.code === 0) {
        setListCategory(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <ImageSlider images={images} />
      {listCategory.map((category) => (
        <div key={category._id}>
          <HomeList title={category.name} id={category._id} />
        </div>
      ))}
    </>
  );
}

export default HomePage;
