import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  authorId: number;
  @ManyToOne(() => User, (user) => user.posts, {
    cascade: true,
    eager: true,
  })
  author: User;
}
