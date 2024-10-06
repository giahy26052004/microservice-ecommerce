import queryString from "query-string";
import { Api, responsePayLoad } from "./api";

interface OrderData {
  orderId: string;
  user: string; // ID người dùng
  cartItems: Array<any>; // Dữ liệu sản phẩm trong giỏ hàng
  customerPhoneNumber: string;
  name: string; // Tên người đặt hàng
  email: string; // Email người đặt hàng
  city: string; // Thành phố
  streetAddress: string; // Địa chỉ
  orderStatus: string; // Trạng thái đơn hàng
}

// Định nghĩa interface cho phản hồi đơn hàng
interface OrderResponse {
  success: boolean;
  message: string;
  result?: any; // Dữ liệu kết quả, nếu có
}

// Create order service
export const Orders = {
  // Checkout session for order
  checkout: async (orderData: OrderData): Promise<OrderResponse> => {
    try {
      const response = await Api.post("/orders/checkout", orderData);
      return response.data; // Đảm bảo trả về dữ liệu từ phản hồi
    } catch (error: any) {
      // Xử lý lỗi một cách thích hợp
      console.error("Error during checkout:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to complete checkout. Please try again."
      );
    }
  },

  // Find orders
  getAllOrders: async (status?: string): Promise<responsePayLoad> => {
    const query = status ? `?status=${status}` : "";
    const findOrderRes = await Api.get(`/orders${query}`);
    return findOrderRes;
  },

  // Get a specific order
  getOrder: async (orderId: string): Promise<responsePayLoad> => {
    const getOrderRes = await Api.get(`/orders/${orderId}`);
    return getOrderRes;
  },
};
