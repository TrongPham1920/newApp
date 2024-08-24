import api from ".";
import { API_PATH } from "./apiConfig";

//login
export const login = async (props) => {
  return await api.post(API_PATH.LOGIN, props);
};

export const register = async (props) => {
  return await api.post(API_PATH.REGISTER, props);
};

export const category = async () => {
  return await api.get(API_PATH.CATEGORY);
};

export const updateCategory = async (id, props) => {
  const url = API_PATH.UPDATECATEGORY(id);
  return await api.put(url, props);
};

export const changeCategoryStatus = async (id) => {
  const url = API_PATH.CATEGORYSTATUS(id);
  return await api.patch(url);
};

export const addCategory = async (props) => {
  return await api.post(API_PATH.ADDCATEGORY, props);
};

export const find = async ({ category, page, limit }) => {
  const queryParams = new URLSearchParams({
    category,
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const url = `${API_PATH.FINDPRODUCT}?${queryParams}`;

  return await api.get(url);
};

export const product = async ({ page, limit }) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const url = `${API_PATH.PRODUCT}?${queryParams}`;

  return await api.get(url);
};

export const addProduct = async (props) => {
  return await api.post(API_PATH.ADDPRODUCT, props);
};

export const updateProduct = async (id, props) => {
  const url = API_PATH.UPDATEPRODUCT(id);
  return await api.put(url, props);
};

export const detailProduct = async (id) => {
  const url = API_PATH.DETAILPRODUCT(id);
  return await api.get(url);
};

export const changeProductStatus = async (id) => {
  const url = API_PATH.PRODUCTSTATUS(id);
  return await api.patch(url);
};

export const user = async () => {
  return await api.get(API_PATH.USER);
};

export const changeUserStatus = async (props) => {
  return await api.patch(API_PATH.USERSTATUS, props);
};

export const fetchGraphQLData = async (query, variables) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_PATH.GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseBody = await response.json();
  if (responseBody.errors) {
    throw new Error("GraphQL error: " + JSON.stringify(responseBody.errors));
  }

  return responseBody.data;
};

export const orders = async () => {
  const query = `
    query GetAllOrders {
      orders {
        createdAt
        id
        products {
          price
          product
          quantity
        }
        shippingAddress
        totalAmount
        updatedAt
        user {
        Id
          phone
        }
        status
      }
    }
  `;

  return await fetchGraphQLData(query);
};

export const changeOrdersStatus = async (changeOrderStatusId, status) => {
  const query = `
    mutation ChangeOrderStatus($changeOrderStatusId: ID!, $status: Int!) {
      changeOrderStatus(id: $changeOrderStatusId, status: $status) {
        id
        status
        shippingAddress
      }
    }
  `;

  const variables = {
    changeOrderStatusId,
    status,
  };

  return await fetchGraphQLData(query, variables);
};

export const updateOrder = async (orderData) => {
  const query = `
    mutation UpdateOrder(
      $updateOrderId: ID!, 
      $updateOrderUserId2: ID, 
      $updateOrderProducts2: [ProductInput!], 
      $updateOrderShippingAddress2: String
    ) {
      updateOrder(
        id: $updateOrderId, 
        userId: $updateOrderUserId2, 
        products: $updateOrderProducts2, 
        shippingAddress: $updateOrderShippingAddress2
      ) {
        id
        user {
          phone
        }
        products {
          product
          quantity
          price
        }
        totalAmount
        status
        shippingAddress
        createdAt
        updatedAt
      }
    }
  `;

  const variables = {
    updateOrderId: orderData.id,
    updateOrderUserId2: orderData.user.id,
    updateOrderProducts2: orderData.products,
    updateOrderShippingAddress2: orderData.shippingAddress,
  };

  return await fetchGraphQLData(query, variables);
};

export const addOrder = async (orderData) => {
  const query = `
    mutation AddOrder(
      $userId: ID!, 
      $products: [ProductInput!]!, 
      $shippingAddress: String!
    ) {
      addOrder(
        userId: $userId, 
        products: $products, 
        shippingAddress: $shippingAddress
      ) {
        id
        user {
          phone
        }
        products {
          product
          quantity
          price
        }
        totalAmount
        status
        shippingAddress
        createdAt
        updatedAt
      }
    }
  `;

  const variables = {
    userId: orderData.userId,
    products: orderData.products,
    shippingAddress: orderData.shippingAddress,
  };

  return await fetchGraphQLData(query, variables);
};

export const addIMG = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await api.post(API_PATH.ADDIMG, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
