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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./users";

@Table({
  tableName: "api_logs",
  modelName: "ApiLog",
  timestamps: false,
})
export default class ApiLog extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(10),
  })
  method!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(500),
  })
  endpoint!: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  status_code!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INET,
  })
  ip_address!: string;

  @Default(DataType.NOW)
  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}
