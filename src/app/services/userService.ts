import { User } from '../models/User';
import { initDatabase } from './db';
import bcrypt from 'bcryptjs';

export async function createUser(data: Omit<User, 'id'>){
    await initDatabase();

    if(!data.password)
        throw new Error("Password is required!");
    
    const hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({...data, password: hash} as any);
    return user;
}

export async function getAllUsers(){
    await initDatabase();
    return await User.findAll({
        attributes: ['id', 'name', 'phone', 'email', 'address'],
        raw: true,
        nest: false
    });
}

export async function getUserById(id: number){
    await initDatabase();
    return await User.findByPk(id, {
        attributes: {exclude: ['password']},
    });
}

export async function updateUser(id: number, updates: Partial<User>){
    await initDatabase();
    const user = await User.findByPk(id);
    if(user){
        if(updates.password){
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        return await user.update(updates);
    }
    return user;
}

export async function deleteUser(id: number){
    await initDatabase();
    const user = await User.findByPk(id);
    if(user){
        await user.destroy();
        return true;
    }
    return false;
}