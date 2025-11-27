import 'reflect-metadata';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { nanoid } from 'nanoid';

@Table({
  tableName: 'users',
  modelName: 'User',
})
export default class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.CHAR(21),
    defaultValue: () => nanoid(),
  })
  id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  password!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  first_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  last_name!: string;

  @Default('user')
  @AllowNull(false)
  @Column({
    type: DataType.ENUM('user', 'admin'),
  })
  role!: string;

  // ✅ Timestamps
  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updated_at!: Date;
}
