import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const SECRET: Secret = process.env.JWT_SECRET || "default";
const EXPIRY = (process.env.JWT_EXPIRY || '1d') as SignOptions['expiresIn'];

export function generateToken(payload: object){
    const options: SignOptions = { expiresIn: EXPIRY};
    return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string){
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}