import express, { Request, Response, Router } from 'express';
import 'dotenv/config';

import client from '../connection';
import { QueryResult } from 'pg';

export const router: Router = express.Router();

router.get('/friends', async (req: Request, res: Response) => {
  console.log('In Get /friends');

  const userId = (req as Request & { userId: number }).userId;

  const sql = `
  SELECT p.personId as id, CONCAT(p.personFirstname, ' ', p.personLastname) as fullName, p.personProfilePicture as profilePicture
  FROM PERSON p
  WHERE p.personId IN (SELECT friendId FROM GetFriends($1));
  `;

  try {
    const result: QueryResult = await client.query(sql, [userId]);
    console.log('users friends: ', result.rows);
    res.json({ success: true, friends: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});
