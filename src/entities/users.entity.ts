import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 12 })
  phone: string;

  @Column({ length: 128 })
  password: string;

  @Column()
  updated_at: number;

  @Column()
  joined_at: number;
}
