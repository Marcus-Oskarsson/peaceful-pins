import express, { Request, Response, Router } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import 'dotenv/config';

type User = {
  userId: number;
  role: string;
  iat: number;
  exp: number;
};

export const router: Router = express.Router();

router.get('/auth_check', async (req: Request, res: Response) => {
  console.log('In GET /auth_check');

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    const expiresIn = new Date((decoded as User).exp * 1000);

    if (new Date() > expiresIn) throw new Error('Token expired');
    res.status(200).json({ success: true });
  } catch (e: unknown) {
    res.status(401).json({ success: false, error: (e as Error).message });
  }
});
