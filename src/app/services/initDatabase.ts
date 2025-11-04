import sequelize from "./sequelize";
import { User } from "../models/User";

export async function initDatabase(){
    try{
        User.initModel(sequelize);
        
        await sequelize.sync({alter: true});
        console.log("Database & tables created!");
    } catch(error){
        console.error("Error initializing database: ", error);
    }
}