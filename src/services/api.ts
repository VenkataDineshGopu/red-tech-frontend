import axios from "axios";
import { Order } from "../types/order";

const API_KEY = "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4";
const API_URL = "https://red-candidate-web.azurewebsites.net/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    ApiKey: API_KEY,
  },
});

// Function to fetch orders
export const fetchOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Function to create an order
export const createOrder = async (order: {
  orderType: string;
  customerName: string;
  createdByUserName: string;
}) => {
  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Function to delete orders
export const deleteOrders = async (orderIds: string[]) => {
  try {
    console.log("API call to delete orders with IDs:", orderIds);
    const response = await api.post("/orders/delete", orderIds);
    return response.data;
  } catch (error) {
    console.error("Error deleting orders:", error);
    throw error;
  }
};

// Function to update an order
export const updateOrder = async (order: Order) => {
  try {
    console.log(`API call to update order with ID: ${order.orderId}`);
    const response = await api.put(`/orders`, order);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};
