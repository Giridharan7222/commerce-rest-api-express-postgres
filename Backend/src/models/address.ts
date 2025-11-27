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
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./users";

@Table({
  tableName: "addresses",
  modelName: "Address",
})
export default class Address extends Model {
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  address_line1!: string;

  @Column({
    type: DataType.STRING,
  })
  address_line2?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  city!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  state!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  pincode!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  country!: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_default!: boolean;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}
