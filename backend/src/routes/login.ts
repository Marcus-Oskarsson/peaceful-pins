import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import client from '../connection';
import { QueryResult } from 'pg';

export const router: Router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

type NewUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type User = {
  personid: number;
  personfirstname: string;
  personlastname: string;
  personemail: string;
  personprofilepicture: string;
  personpassword: string;
};

router.post('/login', async (req: Request, res: Response) => {
  console.log('In Post /login');
  const { email, password }: NewUser = req.body.user;

  console.log('email: ', email, 'password: ', password);
  const sql = `
    SELECT personPassword, personFirstname, personLastname, personEmail, personProfilePicture FROM PERSON
    WHERE personEmail = $1`;

  try {
    const result: QueryResult<User> = await client.query(sql, [email]);

    if (result.rowCount === 0) {
      res
        .status(401)
        .json({ success: false, error: 'Username or password is incorrect' });
      return;
    }

    bcrypt.compare(
      password,
      result.rows[0].personpassword,
      function (err, isCorrect) {
        if (err) {
          res
            .status(500)
            .json({ success: false, error: 'Something went wrong' });
          return;
        }
        if (!isCorrect) {
          res.status(401).json({
            success: false,
            error: 'Username or password is incorrect',
          });
          return;
        }

        const user = result.rows[0];
        const token = jwt.sign(
          { id: user.personid, role: 'user' },
          jwtSecret!,
          {
            expiresIn: '24h',
          },
        );

        const newUser = {
          firstName: user.personfirstname,
          lastName: user.personlastname,
          email: user.personemail,
          profilePicture: user.personprofilepicture,
        };

        res
          .cookie('token', token, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
          })
          .status(200)
          .json({
            success: true,
            message: 'login successful',
            data: {
              user: newUser,
            },
          });
      },
    );
  } catch (error) {
    const err = error as Error & { code: string };
    if (err.code === '23505') {
      res.status(409).json({ success: false, error: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ success: false, error: 'Something went wrong' });
    }
  }
});
