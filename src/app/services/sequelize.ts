import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: ".env.local"});

const sequelize = new Sequelize(
  'mydb',
  process.env.DB_USER as string,
  process.env.DB_USER_PASSWORD as string,
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  }
);

export default sequelize;