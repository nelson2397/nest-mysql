import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firtsName: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  age: number;
}
