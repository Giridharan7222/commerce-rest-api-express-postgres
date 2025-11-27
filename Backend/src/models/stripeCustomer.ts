import "reflect-metadata";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Unique,
} from "sequelize-typescript";
import User from "./users";

@Table({
  tableName: "stripe_customers",
  modelName: "StripeCustomer",
})
export default class StripeCustomer extends Model {
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
    field: "user_id",
  })
  user_id!: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    field: "stripe_customer_id",
  })
  stripe_customer_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
  })
  phone?: string;

  @Column({
    type: DataType.UUID,
    field: "default_payment_method_id",
  })
  default_payment_method_id?: string;

  @Column({
    type: DataType.JSONB,
  })
  metadata?: object;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}
