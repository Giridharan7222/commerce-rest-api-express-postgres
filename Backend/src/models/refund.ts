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
import Order from "./order";
import Invoice from "./invoice";
import PaymentTransaction from "./paymentTransaction";
import { RefundStatus } from "../enums/payment";

@Table({
  tableName: "refunds",
  modelName: "Refund",
})
export default class Refund extends Model {
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

  @ForeignKey(() => PaymentTransaction)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "payment_transaction_id",
  })
  payment_transaction_id!: string;

  @Column({
    type: DataType.STRING(255),
    field: "stripe_refund_id",
  })
  stripe_refund_id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: "refund_amount",
  })
  refund_amount!: number;

  @Default(RefundStatus.INITIATED)
  @Column({
    type: DataType.ENUM(...Object.values(RefundStatus)),
    field: "refund_status",
  })
  refund_status!: RefundStatus;

  @Column({
    type: DataType.TEXT,
  })
  reason?: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Invoice)
  invoice!: Invoice;

  @BelongsTo(() => PaymentTransaction)
  paymentTransaction!: PaymentTransaction;
}
