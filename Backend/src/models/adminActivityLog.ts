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
  tableName: "admin_activity_logs",
  modelName: "AdminActivityLog",
  timestamps: false,
})
export default class AdminActivityLog extends Model {
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
  })
  admin_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  action!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  target_table!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  target_id!: string;

  @Column({
    type: DataType.JSONB,
  })
  before_data!: object;

  @Column({
    type: DataType.JSONB,
  })
  after_data!: object;

  @Default(DataType.NOW)
  @CreatedAt
  @Column({ field: "created_at", type: DataType.DATE })
  created_at!: Date;

  @BelongsTo(() => User)
  admin!: User;
}
