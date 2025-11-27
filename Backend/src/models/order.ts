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
  HasOne,
  Default,
} from "sequelize-typescript";
import User from "./users";
import OrderItem from "./orderItem";
import Invoice from "./invoice";

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

@Table({
  tableName: "orders",
  modelName: "Order",
})
export default class Order extends Model {
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
    type: DataType.FLOAT,
    field: "total_amount",
  })
  total_amount!: number;

  @Default(OrderStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
  })
  status!: OrderStatus;

  @Default(PaymentStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    field: "payment_status",
  })
  payment_status!: PaymentStatus;

  @Column({
    type: DataType.STRING(100),
    field: "payment_method",
  })
  payment_method?: string;

  @AllowNull(false)
  @Column({
    type: DataType.JSONB,
    field: "shipping_address",
  })
  shipping_address!: object;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => OrderItem)
  items!: OrderItem[];

  @HasOne(() => Invoice)
  invoice!: Invoice;
}
