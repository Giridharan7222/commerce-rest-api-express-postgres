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
  HasMany,
  Default,
  Unique,
} from "sequelize-typescript";
import User from "./users";
import Order from "./order";
import InvoiceLineItem from "./invoiceLineItem";

export enum InvoiceStatus {
  GENERATED = "generated",
  PAID = "paid",
  CANCELLED = "cancelled",
}

@Table({
  tableName: "invoices",
  modelName: "Invoice",
})
export default class Invoice extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    field: "invoice_number",
  })
  invoice_number!: string;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "order_id",
  })
  order_id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "user_id",
  })
  user_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: "sub_total",
  })
  sub_total!: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: "tax_amount",
  })
  tax_amount!: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: "discount_amount",
  })
  discount_amount!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: "total_amount",
  })
  total_amount!: number;

  @Default("INR")
  @Column({
    type: DataType.STRING(3),
  })
  currency!: string;

  @Default(InvoiceStatus.GENERATED)
  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatus)),
  })
  status!: InvoiceStatus;

  @Column({
    type: DataType.STRING(255),
    field: "stripe_invoice_id",
  })
  stripe_invoice_id?: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "issued_at",
  })
  issued_at!: Date;

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

  @HasMany(() => InvoiceLineItem)
  lineItems!: InvoiceLineItem[];
}
