import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const user = this.userRepository.create({
      ...rest,
      password: bcrypt.hashSync(password, 10),
    });
    try {
      await this.userRepository.save(user);
      delete user.password;
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException();
      }
    }
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: {
        posts: true,
        profile: true,
      },
    });
    if (!users.length) throw new NotFoundException();
    users.map((user) => delete user.password);
    return users;
  }

  async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
        relations: { posts: true, profile: true },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) throw new NotFoundException();
    const updateData = await this.userRepository.save(user);
    delete updateData.password;
    return updateData;
  }

  async deleteById(id: number) {
    const user = await this.findOneById(id);
    this.userRepository.remove(user);
    return 'Eliminado exitosamente';
  }

  async deleteAll() {
    const users = await this.findAll();
    this.userRepository.remove(users);
    return 'Eliminado todos los usuarios exitosamente';
  }
}
