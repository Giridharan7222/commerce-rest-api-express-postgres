import "reflect-metadata";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./users";

@Table({
  tableName: "admin_profiles",
  modelName: "AdminProfile",
})
export default class AdminProfile extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    unique: true,
  })
  user_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  full_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  phone!: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}
