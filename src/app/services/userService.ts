import { User } from '../models/User';
import sequelize from './sequelize';

export async function createUser(data: Omit<User, 'id'>){
    await sequelize.authenticate();
    User.initModel(sequelize);

    const user = await User.create(data as any);
    return user;
}

export async function getAllUsers(){
    await sequelize.authenticate();
    User.initModel(sequelize);
    return await User.findAll({
        attributes: {exclude: ['password']},
    });
}

export async function getUserById(id: number){
    await sequelize.authenticate();
    User.initModel(sequelize);
    return await User.findByPk(id, {
        attributes: {exclude: ['password']},
    });
}

export async function updateUser(id: number, updates: Partial<User>){
    await sequelize.authenticate();
    User.initModel(sequelize);
    const user = await User.findByPk(id);
    if(user){
        return await user.update(updates);
    }
    return user;
}

export async function deleteUser(id: number){
    await sequelize.authenticate();
    User.initModel(sequelize);
    const user = await User.findByPk(id);
    if(user){
        await user.destroy();
        return true;
    }
    return false;
}