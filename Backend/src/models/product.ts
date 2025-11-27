import "reflect-metadata";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import Category from "./category";
import ProductImage from "./productImage";


@Table({
  tableName: "products",
  modelName: "Product",
})
export default class Product extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  price!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  stock!: number;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    field: "category_id",
  })
  categoryId!: string;

  @Column({
    type: DataType.STRING,
    field: "image_url",
  })
  imageUrl?: string;

  @Column({
    type: DataType.STRING,
    field: "cloudinary_public_id",
  })
  cloudinaryPublicId?: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: "is_active",
  })
  isActive!: boolean;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @BelongsTo(() => Category)
  category!: Category;

  @HasMany(() => ProductImage)
  productImages!: ProductImage[];
}