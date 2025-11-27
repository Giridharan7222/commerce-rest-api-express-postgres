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
  Default,
} from "sequelize-typescript";
import User from "./users";
import { PaymentMethodBrand } from "../enums/payment";

@Table({
  tableName: "payment_methods",
  modelName: "PaymentMethod",
})
export default class PaymentMethod extends Model {
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    field: "stripe_payment_method_id",
  })
  stripe_payment_method_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    field: "stripe_customer_id",
  })
  stripe_customer_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  type!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethodBrand)),
  })
  brand?: PaymentMethodBrand;

  @Column({
    type: DataType.STRING(4),
  })
  last4?: string;

  @Column({
    type: DataType.INTEGER,
    field: "expiry_month",
  })
  expiry_month?: number;

  @Column({
    type: DataType.INTEGER,
    field: "expiry_year",
  })
  expiry_year?: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: "is_default",
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
