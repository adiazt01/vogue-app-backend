import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  providers: [ProductsResolver, ProductsService],
  imports: [TagsModule, CategoriesModule],
})
export class ProductsModule {}
