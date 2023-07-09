import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createProfile(id: number, profile: CreateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    delete user.password;

    const newProfile = this.profileRepository.create(profile);

    try {
      const saveProfile = await this.profileRepository.save(newProfile);
      user.profile = saveProfile;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
