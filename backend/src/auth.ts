import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import 'dotenv/config';

type User = {
  userId: number;
  role: string;
  iat: number;
  exp: number;
};

type CustomRequest = (Request & User) | JwtPayload;

export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    const expiresIn = new Date((decoded as User).exp * 1000);

    if (new Date() > expiresIn) throw new Error('Token expired');

    req.userId = (decoded as CustomRequest).userId;

    next();
  } catch (e: unknown) {
    res.status(401).json({ success: false, error: (e as Error).message });
  }
}
