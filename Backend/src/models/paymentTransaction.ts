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
import Order from "./order";
import Invoice from "./invoice";
import { TransactionStatus, PaymentMethodType } from "../enums/payment";

@Table({
  tableName: "payment_transactions",
  modelName: "PaymentTransaction",
})
export default class PaymentTransaction extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "order_id",
  })
  order_id!: string;

  @ForeignKey(() => Invoice)
  @Column({
    type: DataType.UUID,
    field: "invoice_id",
  })
  invoice_id?: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "user_id",
  })
  user_id!: string;

  @Column({
    type: DataType.STRING(255),
    field: "transaction_reference",
  })
  transaction_reference?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethodType)),
    field: "payment_method",
  })
  payment_method!: PaymentMethodType;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  amount!: number;

  @Default("INR")
  @Column({
    type: DataType.STRING(3),
  })
  currency!: string;

  @Default(TransactionStatus.INITIATED)
  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
  })
  status!: TransactionStatus;

  @Column({
    type: DataType.JSONB,
    field: "gateway_response",
  })
  gateway_response?: object;

  @Column({
    type: DataType.STRING(255),
    field: "payment_intent_id",
  })
  payment_intent_id?: string;

  @Column({
    type: DataType.STRING(255),
    field: "charge_id",
  })
  charge_id?: string;

  @Column({
    type: DataType.STRING(255),
    field: "stripe_customer_id",
  })
  stripe_customer_id?: string;

  @Column({
    type: DataType.STRING(255),
    field: "stripe_payment_method_id",
  })
  stripe_payment_method_id?: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "initiated_at",
  })
  initiated_at?: Date;

  @Column({
    type: DataType.DATE,
    field: "processed_at",
  })
  processed_at?: Date;

  @Column({
    type: DataType.DATE,
    field: "paid_at",
  })
  paid_at?: Date;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Invoice)
  invoice!: Invoice;
}
