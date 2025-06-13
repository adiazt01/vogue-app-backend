import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './schemas/tag.schema';
import { Model } from 'mongoose';
import { PaginationTagsOptionsArgs } from './dto/pagination-tags-options.args';
import { paginate } from '@common/utils/pagination/paginate.util';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<Tag>,
  ) {}

  async create(createTagInput: CreateTagInput) {
    const { name } = createTagInput;

    const isTagExist = await this.findOneByName(name);

    if (isTagExist) {
      throw new BadRequestException('Tag already with the same name');
    }

    const tag = new this.tagModel(createTagInput);
    await tag.save();

    return tag;
  }

  async createOrFindTags(createTagInput: CreateTagInput[]) {
    const names = createTagInput.map((tag) => tag.name);

    const existingTags = await this.tagModel.find({ name: { $in: names } });
    const existingNames = existingTags.map((tag) => tag.name);

    const tagsToCreate = createTagInput.filter(
      (tag) => !existingNames.includes(tag.name),
    );

    let createdTags: Tag[] = [];

    if (tagsToCreate.length > 0) {
      createdTags = await this.tagModel.insertMany(tagsToCreate);
    }

    return [...existingTags, ...createdTags];
  }

  async findOneByName(name: string): Promise<Tag | null> {
    const tagFounded = await this.tagModel.findOne({ name });

    return tagFounded;
  }

  async findAll(paginationTagsOptionsArgs: PaginationTagsOptionsArgs) {
    const { name, page, take } = paginationTagsOptionsArgs;

    return await paginate(
      this.tagModel,
      {
        page: page,
        take: take,
      },
      {
        sort: { createdAt: -1 },
        name: name,
      },
    );
  }

  async findOne(id: number): Promise<Tag> {
    const tagFounded = await this.tagModel.findById(id);

    if (!tagFounded) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    return tagFounded;
  }

  async update(id: number, updateTagInput: UpdateTagInput) {
    const tagFounded = await this.findOne(id);

    if (!tagFounded) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    if (updateTagInput.name) {
      const isTagExist = await this.findOneByName(updateTagInput.name);

      if (isTagExist && isTagExist.id !== id) {
        throw new BadRequestException('Tag already with the same name');
      }
    }

    await this.tagModel.findByIdAndUpdate(id, updateTagInput);

    return tagFounded;
  }

  async remove(id: number) {
    const tagFounded = await this.findOne(id);

    if (!tagFounded) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    await this.tagModel.findByIdAndDelete(id);

    return tagFounded;
  }
}
