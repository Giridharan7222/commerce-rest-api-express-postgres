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
import Product from "./product";


@Table({
  tableName: "product_images",
  modelName: "ProductImage",
})
export default class ProductImage extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "product_id",
  })
  productId!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: "image_url",
  })
  imageUrl!: string;

  @Column({
    type: DataType.STRING,
    field: "public_id",
  })
  publicId?: string;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => Product)
  product!: Product;
}