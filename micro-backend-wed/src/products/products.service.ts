import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { Products } from 'src/shared/schema/products';
import qs2m from 'qs-to-mongo';
import cloudinary from 'cloudinary';
import config from 'config';
import { unlinkSync } from 'fs';
import { productSkuArrDto, ProductSkuDto } from './dto/product-sku-dto';
import { OrderRepository } from 'src/shared/repositories/order.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepository) private readonly productDB: ProductRepository,
    @Inject(OrderRepository) private readonly orderDB: OrderRepository,
  ) {
    {
      cloudinary.v2.config({
        cloud_name: config.get('cloudinary.cloud_name'),
        api_key: config.get('cloudinary.api_key'),
        api_secret: config.get('cloudinary.api_secret'),
      });
    }
  }
  async createProduct(createProductDto: CreateProductDto): Promise<{
    success: boolean;
    message: string;
    result?: Products;
  }> {
    try {
      if (createProductDto) {
        const createdProductInDB =
          await this.productDB.create(createProductDto);
        return {
          success: true,
          message: 'Product created successfully',
          result: createdProductInDB,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllProduct(query: any) {
    try {
      let callForHomePage = false;
      if (query.homepage) {
        callForHomePage = true;
      }
      delete query.homepage;
      const { criteria, options, links } = qs2m(query);
      if (callForHomePage) {
        const products = await this.productDB.findProductWithGroupBy();
        return {
          success: true,
          message:
            products.length > 0
              ? 'Product fetched successfully'
              : 'No Products found',
          result: products,
        };
      }
      const { totalProductCount, products } = await this.productDB.find(
        criteria,
        options,
      );
      return {
        success: true,
        message:
          products.length > 0
            ? 'Product fetched successfully'
            : 'No Products found',
        result: {
          metadata: {
            skip: options.skip || 0,
            limit: options.limit || 10,
            total: totalProductCount,
            pages: options.limit
              ? Math.ceil(totalProductCount / options.limit)
              : 1,
            links: links('/', totalProductCount),
          },
          products,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneProduct(id: string): Promise<{
    success: boolean;
    message: string;
    result?: { product: Products; relatedProduct: Products[] };
  }> {
    try {
      const product: Products = await this.productDB.findOne({ _id: id });
      if (!product) {
        throw new Error('Product not found');
      }
      const relatedProduct: Products[] =
        await this.productDB.findRelatedProducts({
          category: product.category,
          _id: { $ne: id },
        });
      return {
        success: true,
        message: 'Product fetched successfully',
        result: { product, relatedProduct },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: CreateProductDto,
  ): Promise<{
    success: boolean;
    message: string;
    result?: Products;
  }> {
    try {
      const product = await this.productDB.findOne({ _id: id });
      if (!product) {
        throw new Error('Product not found');
      }
      const updateProduct = await this.productDB.findOneAndUpdate(
        { _id: id },
        updateProductDto,
      );
      return {
        success: true,
        message: 'Product updated successfully',
        result: updateProduct,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(id: string): Promise<{
    success: boolean;
    message: string;
    result: null;
  }> {
    try {
      await this.productDB.deleteAllLicences(id, '');
      const productExists = await this.productDB.findOne({ _id: id });
      if (!productExists) throw new Error('Product not found');
      await this.productDB.deleteOneProduct({ _id: id });

      return {
        success: true,
        message: 'Product deleted successfully',
        result: null,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async uploadProductImage(
    id: string,
    file: any,
  ): Promise<{ success: boolean; message: string; result?: string }> {
    try {
      const product = await this.productDB.findOne({ _id: id });
      if (!product) throw new Error('Product not found');
      if (product.imageDetails?.public_id) {
        await cloudinary.v2.uploader.destroy(product.imageDetails?.public_id, {
          invalidate: true,
        });
      }
      const resofCloudinary = await cloudinary.v2.uploader.upload(file.path, {
        public_id: `${config.get('cloudinary.publicId_prefix')}_${Date.now()}`,
        transformation: [
          {
            width: config.get('cloudinary.bigSize').toString().split('X')[0],
            height: config.get('cloudinary.bigSize').toString().split('X')[1],
            crop: 'fill',
          },
          { quality: 'auto' },
        ],
      });
      unlinkSync(file.path);
      await this.productDB.findOneAndUpdate(
        { _id: id },
        { imageDetails: resofCloudinary, image: resofCloudinary.secure_url },
      );

      return {
        success: true,
        message: 'Product image uploaded successfully',
        result: resofCloudinary.secure_url,
      };
    } catch (error) {
      throw error;
    }
  }
  //THIS IS FOR CREATE ONE OR MULTIPLE SKU FOR AN PRODUCT
  async updateProductSkus(productId, data: productSkuArrDto) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product does not exists');
      }
      const skuCode = Math.random().toString(36).substring(2, 15) + Date.now();
      for (let i = 0; i < data.skuDetails.length; i++) {
        data.skuDetails[i].skuCode = skuCode;
      }
      const result = await this.productDB.findOneAndUpdate(
        { _id: productId },
        { $push: { skuDetails: data.skuDetails } },
      );

      return {
        success: true,
        result: result,
        message: 'Product Skus updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  async updateProductSkusByID(
    productId: string,
    skuId: string,
    data: ProductSkuDto,
  ) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product not found');
      }
      const sku = product.skuDetails.find((sku) => sku.id === skuId);
      if (!sku) {
        throw new Error('SKU not found');
      }
      const dataUpdate = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          dataUpdate[`skuDetails.$.${key}`] = data[key];
        }
      }
      const result = await this.productDB.findOneAndUpdate(
        {
          _id: productId,
          'skuDetails._id': skuId,
        },
        {
          $set: dataUpdate,
        },
      );
      return {
        success: true,
        message: 'Product SKU updated successfully',
        result,
      };
    } catch (error) {
      throw error;
    }
  }
  async addProductSkuLicense(
    productId: string,
    skuId: string,
    licenseKey: string,
  ) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product not found');
      }
      const sku = product.skuDetails.find((sku) => sku.id === skuId);
      if (!sku) {
        throw new Error('SKU not found');
      }
      const result = await this.productDB.createLicense(
        productId,
        skuId,
        licenseKey,
      );

      return {
        success: true,
        message: 'Product SKU license updated successfully',
        result,
      };
    } catch (error) {
      throw error;
    }
  }
  async removeProductSkuLicense(licenseId) {
    try {
      await this.productDB.removeLicense({ _id: licenseId });
      return {
        success: true,
        message: 'All product SKU licenses deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  async getProductSkuLicense(productId: string, skuId: string) {
    try {
      const license = await this.productDB.findLicense({
        product: productId,
        productSku: skuId,
      });
      return {
        success: true,
        message: 'Product SKU license fetched successfully',
        result: license,
      };
    } catch (error) {
      throw error;
    }
  }
  async updateProductSkuLicense(
    productId: string,
    skuId: string,
    licenseKeyId: string,
    licenseKey: string,
  ) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) throw new Error('Product not found');
      const sku = product.skuDetails.find((sku) => sku.id === skuId);
      if (!sku) throw new Error('SkuDetails not found');
      const result = await this.productDB.updateLicense(
        { _id: licenseKeyId },
        {
          licenseKey: licenseKey,
        },
      );
      return {
        success: true,
        message: 'Product SKU license updated successfully',
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }
  async addProductReview(
    productId: string,
    rating: number,
    review: string,
    req: any,
  ) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) throw new Error('Product not found');

      if (
        product.feedbackDetails.find(
          (value: { customerId: string }) =>
            value.customerId === req.user._id.toString(),
        )
      ) {
        throw new Error('You have already submitted a review for this product');
      }
      const order = await this.orderDB.findOne({ user: req.user._id });
      if (!order) {
        throw new Error('You have already placed an order for this product');
      }
      const ratings: any[] = [];
      product.feedbackDetails.forEach((comment: { rating: any }) =>
        ratings.push(comment.rating),
      );

      let avgRating = String(rating);
      if (ratings.length > 0) {
        avgRating = (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(
          2,
        );
      }
      const reviewDetails = {
        rating: rating,
        feedbackMsg: review,
        customerId: req.user._id,
        customerName: req.user.name,
      };
      const result = await this.productDB.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          $set: { avgRating: avgRating },
          $push: { feedbackDetails: reviewDetails },
        },
      );
      return {
        success: true,
        message: 'Product review added successfully',
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }
  async deleteProductSkuById(id: string, skuId: string) {
    try {
      // delete the sku details from product
      await this.productDB.deleteSku(id, skuId);
      // delete all the licences from db for that sku
      await this.productDB.deleteAllLicences(undefined, skuId);

      return {
        message: 'Product sku details deleted successfully',
        success: true,
        result: {
          id,
          skuId,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async deleteProductReview(productId: string, reviewId: string) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product does not exist');
      }

      const review = product.feedbackDetails.find(
        (review) => review._id == reviewId,
      );
      if (!review) {
        throw new Error('Review does not exist');
      }

      const ratings: any[] = [];
      product.feedbackDetails.forEach((comment) => {
        if (comment._id.toString() !== reviewId) {
          ratings.push(comment.rating);
        }
      });

      let avgRating = '0';
      if (ratings.length > 0) {
        avgRating = (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(
          2,
        );
      }

      const result = await this.productDB.findOneAndUpdate(
        { _id: productId },
        { $set: { avgRating }, $pull: { feedbackDetails: { _id: reviewId } } },
      );

      return {
        message: 'Product review removed successfully',
        success: true,
        result,
      };
    } catch (error) {
      throw error;
    }
  }
}
