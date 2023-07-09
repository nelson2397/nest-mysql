import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    await this.usersService.findOneById(createPostDto.authorId);
    const newPost = this.postsRepository.create(createPostDto);
    try {
      return await this.postsRepository.save(newPost);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getPosts() {
    const posts = await this.postsRepository.find({
      relations: {
        author: true,
      },
    });
    posts.map((post) => delete post.author.password);
    if (!posts.length) throw new NotFoundException();

    return posts;
  }
}
