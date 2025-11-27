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
import Invoice from "./invoice";
import Product from "./product";

@Table({
  tableName: "invoice_line_items",
  modelName: "InvoiceLineItem",
})
export default class InvoiceLineItem extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Invoice)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "invoice_id",
  })
  invoice_id!: string;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "product_id",
  })
  product_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    field: "product_name",
  })
  product_name!: string;

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
    type: DataType.DECIMAL(10, 2),
  })
  price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: "total_price",
  })
  total_price!: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
    field: "tax_rate",
  })
  tax_rate!: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: "tax_amount",
  })
  tax_amount!: number;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => Invoice)
  invoice!: Invoice;

  @BelongsTo(() => Product)
  productInfo!: Product;
}
