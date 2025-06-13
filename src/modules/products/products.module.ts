import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from '@auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { ProductSchema } from './schemas/product.schema';
import { TagsService } from './tags/tags.service';
import { CategoriesService } from './categories/categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    TagsModule,
    CategoriesModule,
    AuthModule,
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    TagsService,
    CategoriesService,
  ],
})
export class ProductsModule {}
