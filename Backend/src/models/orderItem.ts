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
} from "sequelize-typescript";
import Order from "./order";
import Product from "./product";

@Table({
  tableName: "order_items",
  modelName: "OrderItem",
})
export default class OrderItem extends Model {
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

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "product_id",
  })
  product_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
    },
  })
  quantity!: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
    field: "price_at_order_time",
  })
  price_at_order_time!: number;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => Product)
  product!: Product;
}
