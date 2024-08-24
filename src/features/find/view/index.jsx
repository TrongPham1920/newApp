import React, { useState, useEffect } from "react";
import List from "../../../components/List/index.js";
import { find } from "../../../api/app.js";
import { TablePagination } from "@mui/material";

function HomePage() {
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [filterParams, setFilterParams] = useState({
    page: 0,
    limit: 16,
  });

  const currentUrl = window.location.href;

  const getList = async (filterParams) => {
    if (!filterParams.category) {
      console.log("Error: category is not defined");
      return;
    }
    try {
      const response = await find(filterParams);

      if (response?.code === 0) {
        setList(response?.data);
        setTotalCount(response.total);
      } else {
        console.log("Error: response code is not 0");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryID = urlParams.get("category");

    if (categoryID) {
      setFilterParams({
        ...filterParams,
        category: categoryID,
      });
    }
  }, [currentUrl]);

  useEffect(() => {
    getList(filterParams);
  }, [filterParams]);

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
      page: 0,
    }));
  };

  return (
    <>
      <List list={list} />
      <TablePagination
        rowsPerPageOptions={[16, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={filterParams.limit}
        page={filterParams.page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
}

export default HomePage;
