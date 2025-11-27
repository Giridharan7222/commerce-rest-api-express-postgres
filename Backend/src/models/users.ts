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
  HasOne,
  HasMany,
} from "sequelize-typescript";
import CustomerProfile from "./customerProfile";
import AdminProfile from "./adminProfile";
import Address from "./address";

@Table({
  tableName: "users",
  modelName: "User",
})
export default class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  password!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("admin", "customer"),
  })
  role!: "admin" | "customer";

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_active!: boolean;

  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at", type: DataType.DATE })
  updated_at!: Date;

  @HasOne(() => CustomerProfile)
  customerProfile!: CustomerProfile;

  @HasOne(() => AdminProfile)
  adminProfile!: AdminProfile;

  @HasMany(() => Address)
  addresses!: Address[];
}
