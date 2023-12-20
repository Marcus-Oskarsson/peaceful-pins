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

// interface CustomRequest extends Request { token: User | JwtPayload }

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
    req.userId = (decoded as CustomRequest).userId;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, error: 'Please authenticate' });
  }

  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split(' ')[1]

  // console.log("authHeader: ", authHeader)

  // if (token == null) return res.status(401).json({ success: false, error: 'No token provided' })

  // jwt.verify(token, process.env.JWT_SECRET as string, (err: unknown, user: ) => {
  //   console.log("USER IS HERE: ", user)
  //   if (err) return res.status(403).json({ success: false, error: 'Invalid token' })

  //   req.userId = user.userId;

  //   next()
  // })
}
