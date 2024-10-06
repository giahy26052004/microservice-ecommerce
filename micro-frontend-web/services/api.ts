import axios, { AxiosResponse } from "axios";

export interface responsePayLoad {
  success: boolean;
  message: string;
  result: any;
}

const responseBody = (response: AxiosResponse) => {
  return response.data;
};
const request = {
  get: async (url: string) =>
    await axios
      .get(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url)
      .then((res) => {
        return responseBody(res);
      })
      .catch((error) => error?.response?.data || error),
  post: async (url: string, body: {}) =>
    await axios
      .post(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
      .then((res) => {
        return responseBody(res);
      })
      .catch((error) => error.response?.data || error),
  put: async (url: string, body: {}) =>
    await axios
      .put(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
      .then((res) => {
        return responseBody(res);
      })
      .catch((error) => error.response?.data || error),
  del: async (url: string) =>
    await axios
      .delete(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url)
      .then((res) => {
        return responseBody(res);
      })
      .catch((error) => error.response?.data || error),
  patch: async (url: string, body: {}) =>
    await axios
      .patch(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
      .then((res) => {
        return responseBody(res);
      })
      .catch((error) => error.response?.data || error),
};
const Api = {
  get: (url: string) => request.get(url),
  post: (url: string, body: {}) => request.post(url, body),
  put: (url: string, body: {}) => request.put(url, body),
  del: (url: string) => request.del(url),
  patch: (url: string, body: {}) => request.patch(url, body),
};
export { Api };
