import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: ".env.local"});

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;