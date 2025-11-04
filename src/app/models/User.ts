import {Sequelize, DataTypes, Model, CreationOptional} from '@sequelize/core';

interface UserAttributes {
    id: CreationOptional<number>;
    name: string;
    phone: string;
    email: string;
    address: string;
    password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    declare id: CreationOptional<number>;   
    declare name: string;
    declare phone: string;
    declare email: string;
    declare address: string;
    declare password: string;

    static initModel(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                phone: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'users',
                modelName: 'User',
            }
        );
    }
}
