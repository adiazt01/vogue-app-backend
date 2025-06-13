import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { AuthModule } from '@auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
  ],
  providers: [TagsResolver, TagsService],
  exports: [TagsService, MongooseModule],
})
export class TagsModule {}
