import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  HttpCode,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/shared/middleware/role.decorator';
import { UserType } from 'src/shared/schema/users';
import { GetProductQueryDto } from './dto/get-product-query-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import config from 'config';
import { productSkuArrDto, ProductSkuDto } from './dto/product-sku-dto';
import { Request } from 'express';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @Roles(UserType.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  async update(
    @Body() updateProductDto: CreateProductDto,
    @Param('id') id: string,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Get()
  async findAll(@Query() query: GetProductQueryDto) {
    return await this.productsService.findAllProduct(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOneProduct(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }
  //DELETE PRODUCT
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }
  //uploadProductImage
  @Post(':id/image')
  @Roles(UserType.ADMIN)
  @UseInterceptors(
    FileInterceptor('productImage', {
      dest: config.get('fileStoragePath'),
      limits: { fileSize: 3145728 }, // 3MB
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: ParameterDecorator,
  ) {
    return await this.productsService.uploadProductImage(id, file);
  }
  //createProductSkus
  @Post('/:productId/skus')
  @Roles(UserType.ADMIN)
  async createProductSkus(
    @Param('productId') productId: string,
    @Body() updateProductSkuDto: productSkuArrDto,
  ) {
    return await this.productsService.updateProductSkus(
      productId,
      updateProductSkuDto,
    );
  }
  @Put('/:productId/skus/:skuId')
  @Roles(UserType.ADMIN)
  async updateProductSkus(
    @Param('productId') productId: string,
    @Param('skuId') skuId: string,
    @Body() updateProductSkuDto: ProductSkuDto,
  ) {
    return await this.productsService.updateProductSkusByID(
      productId,
      skuId,
      updateProductSkuDto,
    );
  }

  @Post('/:productId/skus/:skuId/licenses')
  @Roles(UserType.ADMIN)
  async addProductSkuLicense(
    @Param('productId') productId: string,
    @Param('skuId') skuId: string,
    @Body() data: any,
  ) {
    return await this.productsService.addProductSkuLicense(
      productId,
      skuId,
      data.licenseKey,
    );
  }
  @Delete('/:productId/skus/:skuId')
  @Roles(UserType.ADMIN)
  async deleteSkuById(
    @Param('productId') productId: string,
    @Param('skuId') skuId: string,
  ) {
    return await this.productsService.deleteProductSkuById(productId, skuId);
  }
  @Delete('/licenses/:licenseId')
  @Roles(UserType.ADMIN)
  async removeProductSkuLicense(@Param('licenseId') licenseId: string) {
    return await this.productsService.removeProductSkuLicense(licenseId);
  }

  @Get('/:productId/skus/:skuId/licenses')
  @Roles(UserType.ADMIN)
  async getProductSkuLicense(
    @Param('productId') productId: string,
    @Param('skuId') skuId: string,
  ) {
    return await this.productsService.getProductSkuLicense(productId, skuId);
  }

  @Put('/:productId/skus/:skuId/licenses/:licenseKeyId')
  @Roles(UserType.ADMIN)
  async updateProductSkuLicenseKey(
    @Param('productId') productId: string,
    @Param('skuId') skuId: string,
    @Param('licenseKeyId') licenseKeyId: string,
    @Body('licenseKey') licenseKey: string,
  ) {
    return await this.productsService.updateProductSkuLicense(
      productId,
      skuId,
      licenseKeyId,
      licenseKey,
    );
  }
  @Post('/:productId/reviews')
  @Roles(UserType.CUSTOMER)
  async createProductReview(
    @Param('productId') productId: string,
    @Body('review') review: string,
    @Body('rating') rating: number,
    @Req() req: Request,
  ) {
    return await this.productsService.addProductReview(
      productId,
      rating,
      review,
      req,
    );
  }
  @Delete('/:productId/reviews/:reviewId')
  @Roles(UserType.CUSTOMER)
  async deleteProductReview(
    @Param('productId') productId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.productsService.deleteProductReview(productId, reviewId);
  }
}
