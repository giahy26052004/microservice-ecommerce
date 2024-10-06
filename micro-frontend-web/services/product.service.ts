import queryString from "query-string";
import { Api, responsePayLoad } from "./api";

// create product service
export const Products = {
  // get products for customer
  getProducts: async (
    filter: Record<string, any>,
    serverSide: boolean = false
  ): Promise<responsePayLoad> => {
    const url = queryString.stringifyUrl({
      url: serverSide ? "" : "/products",
      query: filter,
    });
    const getProductRes = await Api.get(url);
    return getProductRes;
  },
  // get product details
  getProduct: async (id: string): Promise<responsePayLoad> => {
    const getProductRes = await Api.get("/products/" + id);
    return getProductRes;
  },
  // save product details
  saveProduct: async (
    product: Record<string, any>
  ): Promise<responsePayLoad> => {
    const saveProductRes = await Api.post("/products", product);
    return saveProductRes;
  },
  // update product details
  updateProduct: async (
    id: string,
    product: Record<string, any>
  ): Promise<responsePayLoad> => {
    const updateProductRes = await Api.patch("/products/" + id, product);
    return updateProductRes;
  },

  // delete product details
  deleteProduct: async (id: string): Promise<responsePayLoad> => {
    const deleteProductRes = await Api.del("/products/" + id);
    return deleteProductRes;
  },

  // upload product image
  uploadProductImage: async (
    id: string,
    image: any
  ): Promise<responsePayLoad> => {
    const uploadProductImageRes = await Api.post(
      "/products/" + id + "/image",
      image
    );
    return uploadProductImageRes;
  },

  // add sku details for an product
  addSku: async (
    productId: string,
    sku: Record<string, any>
  ): Promise<responsePayLoad> => {
    const addSkuRes = await Api.post("/products/" + productId + "/skus", sku);
    return addSkuRes;
  },

  // update sku details for an product
  updateSku: async (
    productId: string,
    skuId: string,
    sku: Record<string, any>
  ): Promise<responsePayLoad> => {
    const updateSkuRes = await Api.put(
      "/products/" + productId + "/skus/" + skuId,
      sku
    );
    return updateSkuRes;
  },

  // delete sku details for an product
  deleteSku: async (
    productId: string,
    skuId: string
  ): Promise<responsePayLoad> => {
    const deleteSkuRes = await Api.del(
      "/products/" + productId + "/skus/" + skuId
    );
    return deleteSkuRes;
  },

  // get all licenses for a product SKU
  getLicenses: async (
    productId: string,
    skuId: string
  ): Promise<responsePayLoad> => {
    const getLicensesRes = await Api.get(
      "/products/" + productId + "/skus/" + skuId + "/licenses"
    );
    return getLicensesRes;
  },

  // add license for a product SKU
  addLicense: async (
    productId: string,
    skuId: string,
    license: Record<string, any>
  ): Promise<responsePayLoad> => {
    const addLicenseRes = await Api.post(
      "/products/" + productId + "/skus/" + skuId + "/licenses",
      license
    );
    return addLicenseRes;
  },

  // update license for a product SKU
  updateLicense: async (
    productId: string,
    skuId: string,
    licenseId: string,
    license: Record<string, any>
  ): Promise<responsePayLoad> => {
    const updateLicenseRes = await Api.put(
      "/products/" + productId + "/skus/" + skuId + "/licenses/" + licenseId,
      license
    );
    return updateLicenseRes;
  },

  // delete license for a product SKU
  deleteLicense: async (licenseId: string): Promise<responsePayLoad> => {
    const deleteLicenseRes = await Api.del("/products/licenses/" + licenseId);
    return deleteLicenseRes;
  },

  // add review for an product
  addReview: async (
    productId: string,
    review: Record<string, any>
  ): Promise<responsePayLoad> => {
    const addReviewRes = await Api.post(
      "/products/" + productId + "/reviews/",
      review
    );
    return addReviewRes;
  },

  // delete product review
  deleteReview: async (
    productId: string,
    reviewId: string
  ): Promise<responsePayLoad> => {
    const addLicenseRes = await Api.del(
      "/products/" + productId + "/reviews/" + reviewId
    );
    return addLicenseRes;
  },
};
