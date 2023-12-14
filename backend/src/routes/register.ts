import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import client from '../connection';
import { QueryResult } from 'pg';

export const router: Router = express.Router();

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = 8;

type NewUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type User = {
  personId: number;
  personFirstname: string;
  personLastname: string;
  personEmail: string;
  personProfilePicture: string;
};

router.post('/register', (req: Request, res: Response) => {
  console.log('In Post /register');
  const { firstname, lastname, email, password }: NewUser = req.body.user;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPassword = password.length >= 12;

  if (!validEmail) {
    return res.status(400).json({ success: false, error: 'Invalid email' });
  }

  if (!validPassword) {
    return res
      .status(400)
      .json({ success: false, error: 'Passwords has to be at least 12 characters long' });
  }

  const sql = `
    INSERT INTO PERSON (personFirstname, personLastname, personEmail, personPassword)
    VALUES ($1, $2, $3, $4) RETURNING personId, personFirstname, personLastname, personEmail, personProfilePicture;`;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    try {
      const result: QueryResult<User> = await client.query(sql, [
        firstname,
        lastname,
        email,
        hash,
      ]);

      const user = result.rows[0];
      const token = jwt.sign({ id: user.personId, role: 'user' }, jwtSecret!, {
        expiresIn: '24h',
      });

      const newUser = {
        firstName: user.personFirstname,
        lastName: user.personLastname,
        email: user.personEmail,
        profilePicture: user.personProfilePicture,
      };

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      })
      .status(201)
      .json({
        success: true,
        message: 'User created',
        data: {
          user: newUser,
        },
      });

    } catch (error) {
      const err = error as Error & { code: string };
      if (err.code === '23505') {
        console.log("MITT ERROR: ", err);
        res.status(409).json({ success: false, error: 'Email already exists' });
      } else {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
      }
    }
  });
});
