import { Sequelize } from "@sequelize/core";
import {PostgresDialect} from "@sequelize/postgres";
import dotenv from 'dotenv';

dotenv.config({path: ".env.local"});

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: 'mydb',
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    host: 'localhost',
    port: 5432,
});

export default sequelize;