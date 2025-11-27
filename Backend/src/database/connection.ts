import { Sequelize } from 'sequelize-typescript';
import User from '../models/users';

const sequelize = new Sequelize({
  host: process.env.POSTGRES_HOST_NONCONTAINER,
  port: Number(process.env.POSTGRES_PORT_NONCONTAINER),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  dialect: 'postgres',
  models: [User],
  logging: false,
});

export default sequelize;


