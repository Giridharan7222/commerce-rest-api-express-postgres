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
  tableName: "customer_profiles",
  modelName: "CustomerProfile",
})
export default class CustomerProfile extends Model {
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

  @Column({
    type: DataType.STRING,
  })
  full_name?: string;

  @Column({
    type: DataType.STRING(20),
  })
  phone?: string;

  @Column({
    type: DataType.DATEONLY,
  })
  dob?: Date;

  @Column({
    type: DataType.STRING(20),
  })
  gender?: string;

  @Column({
    type: DataType.TEXT,
  })
  profile_image_url?: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}
