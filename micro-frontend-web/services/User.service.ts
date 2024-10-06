import { Api, responsePayLoad } from "./api";
export const User = {
  getUser: async (): Promise<responsePayLoad> => await Api.get("/users"),
  createUser: async (user: Record<string, any>): Promise<responsePayLoad> =>
    await Api.post("/users", user),
  updateUser: async (
    id: string,
    user: Record<string, any>
  ): Promise<responsePayLoad> => await Api.patch("/users/" + id, user),
  loginUser: async (user: Record<string, any>): Promise<responsePayLoad> =>
    await Api.post("/users/login", user),
  logoutUser: async (): Promise<responsePayLoad> =>
    await Api.put("/users/logout", {}),
  forgotPassword: async (email: string): Promise<responsePayLoad> =>
    await Api.put("/users/forgot-password/" + email, {}),
  confirmForgot: async (data: Record<string, any>): Promise<responsePayLoad> =>
    await Api.put("/users/confirmForgot", data),
  veryfyUser: async (email: string, otp: string): Promise<responsePayLoad> =>
    await Api.get("/users/verify-email/" + otp + "/" + email),
};
