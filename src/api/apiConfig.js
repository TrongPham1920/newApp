export const API_PATH = {
  LOGIN: getPath("auth/login"),
  REGISTER: getPath("auth/register"),
  CATEGORY: getPath("category"),
  ADDCATEGORY: getPath("category/create"),
  UPDATECATEGORY: (id) => getPath(`category/update/${id}`),
  CATEGORYSTATUS: (id) => getPath(`category/changeStatus/${id}`),
  FINDPRODUCT: getPath("product/find"),
  PRODUCT: getPath("product"),
  ADDPRODUCT: getPath("product/create"),
  UPDATEPRODUCT: (id) => getPath(`product/${id}`),
  PRODUCTSTATUS: (id) => getPath(`product/status/${id}`),
  DETAILPRODUCT: (id) => getPath(`product/${id}`),
  GRAPHQL: getPath("graphql"),
  USER: getPath("user"),
  USERSTATUS: getPath("user/status"),
  ADDIMG: getPath("img/upload"),
};

function getPath(path) {
  return `https://assignment-of4r.onrender.com/${path}`;
}

export default API_PATH;
