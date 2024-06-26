import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import 'dotenv/config';

import client from '../connection';
import { QueryResult } from 'pg';
import { Post } from '../types';

type Coordinates = {
  x: number;
  y: number;
};

type CoordinatesWithAccuracy = {
  location: {
    latitude: number;
    longitude: number;
  };
  accuracy: number;
};

function saveImage(file: Express.Multer.File) {
  const image = fs.readFileSync(file.path);
  const destinationPath = `uploads/${file.originalname}`;
  fs.writeFileSync(destinationPath, image);
  fs.unlinkSync(file.path);
  return destinationPath;
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function inDistance(
  userPosition: CoordinatesWithAccuracy,
  postPosition: Coordinates,
) {
  const MAX_DISTANCE = 0.2; // 200m
  console.log('userPosition: ', userPosition);
  console.log('postPosition: ', postPosition);

  const earthRadiusKm = 6371;
  const dLat = toRadians(userPosition.location.latitude - postPosition.x);
  const dLon = toRadians(userPosition.location.longitude - postPosition.y);
  const lat1 = toRadians(userPosition.location.latitude);
  const lat2 = toRadians(postPosition.x);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance <= MAX_DISTANCE + userPosition.accuracy;
}

export const router: Router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post(
  '/posts',
  upload.single('image'),
  async (req: Request, res: Response) => {
    console.log('In Post /posts');
    // TODO should also save accuracy

    const userId = (req as Request & { userId: number }).userId;

    let destinationPath = '';
    if (req.file) {
      destinationPath = `api/posts/${saveImage(req.file)}`;
    }

    const coordinates = JSON.parse(req.body.position);

    const sql = `
      INSERT INTO POST (postAuthor, postTitle, postContent, postImgUrl, postLocation, postVisibility)
      VALUES ($1, $2, $3, $4, $5, $6)`;

    try {
      await client.query(sql, [
        userId,
        req.body.title,
        req.body.content,
        destinationPath,
        `( ${coordinates.latitude}, ${coordinates.longitude} )`,
        req.body.visibility,
      ]);

      res.status(200).json({ success: true, message: 'Post created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Something went wrong' });
    }
  },
);

router.get('/posts/public', async (req: Request, res: Response) => {
  console.log('In Get /posts/public');

  const userId = (req as Request & { userId: number }).userId;

  const sql = `
    SELECT 
      p.postId as id, 
      GetFullName(p.postAuthor) as author,
      p.postAuthor as authorId, 
      p.postTitle as title, 
      p.postContent as content, 
      p.postImgUrl as image, 
      p.postLocation as location,
      p.postCreatedAt as createdAt,
      IsUnlocked(p.postId, $1) as isUnlocked
    FROM POST p
    JOIN PERSON p1 ON p.postAuthor = p1.personId
    WHERE (
      p.postId IN (SELECT unlockedPostPostId FROM UNLOCKEDPOST WHERE unlockedPostPersonId = $1) 
      OR p.postAuthor = $1
      OR p.postVisibility = 'public'
      OR (
        p.postAuthor IN (SELECT friendId FROM GetFriends($1))
        AND p.postVisibility = 'friends'
      )
    )
    AND p.postExpiresAt > NOW();
    `;

  try {
    const result: QueryResult = await client.query(sql, [userId]);
    console.log('result.rows in public: ', result.rows);
    if (result.rows.length > 0) {
      const filteredPosts = result.rows.map((post: Post) => {
        if (post.isunlocked) {
          return post;
        }
        return {
          id: post.id,
          createdAt: post.createdat,
          author: post.author,
          authorId: post.authorid,
          title: post.title,
          location: post.location,
          isUnlocked: post.isunlocked,
        };
      });
      res.status(200).json({ success: true, posts: filteredPosts });
    } else {
      res.status(200).json({ success: true, posts: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.get('/posts/friends', async (req: Request, res: Response) => {
  console.log('In Get /posts/friends');

  const userId = (req as Request & { userId: number }).userId;

  const sql = `
  SELECT 
    p.postId as id, 
    GetFullName(p.postAuthor) as author,
    p.postAuthor as authorId, 
    p.postTitle as title, 
    p.postContent as content, 
    p.postImgUrl as image, 
    p.postLocation as location,
    p.postCreatedAt as createdAt,
    IsUnlocked(p.postId, $1) as isUnlocked
  FROM POST p
  JOIN PERSON p1 ON p.postAuthor = p1.personId
  WHERE (
    p.postId IN (SELECT unlockedPostPostId FROM UNLOCKEDPOST WHERE unlockedPostPersonId = $1) 
    OR p.postAuthor = $1
    OR (
      p.postAuthor IN (SELECT friendId FROM GetFriends($1))
      AND p.postVisibility = 'friends'
    )
    )
  AND p.postExpiresAt > NOW();
    `;

  try {
    const result: QueryResult = await client.query(sql, [userId]);
    console.log('result.rows in friends: ', result.rows);
    if (result.rows.length > 0) {
      const filteredPosts = result.rows.map((post: Post) => {
        if (post.isunlocked) {
          return post;
        }
        return {
          id: post.id,
          createdAt: post.createdat,
          author: post.author,
          authorId: post.authorid,
          title: post.title,
          location: post.location,
          isUnlocked: post.isunlocked,
        };
      });
      res.status(200).json({ success: true, posts: filteredPosts });
    } else {
      res.status(200).json({ success: true, posts: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.post('/posts/unlock/:id', async (req: Request, res: Response) => {
  console.log('In Post /posts/unlock/id');

  const userId = (req as Request & { userId: number }).userId;
  const postId = req.params.id;
  const position = req.body.position;

  const sqlSelect = `
    SELECT postLocation FROM POST WHERE postId = $1;
  `;
  try {
    const result: QueryResult = await client.query(sqlSelect, [postId]);
    const postLocation = result.rows[0].postlocation;
    const postInDistance = inDistance(position, postLocation);

    if (postInDistance) {
      const sqlInsert = `
        INSERT INTO UNLOCKEDPOST (unlockedPostPersonId, unlockedPostPostId)
        VALUES ($1, $2);
      `;
      try {
        await client.query(sqlInsert, [userId, postId]);
        res.status(200).json({ success: true, message: 'Post unlocked' });
        return;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Something went wrong' });
        return;
      }
    } else {
      res.status(200).json({ success: false, message: 'Post not unlocked' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.get('/posts/unlocked-posts', async (req: Request, res: Response) => {
  console.log('In Get /posts/unlocked-posts');

  // TODO Lägg till filtrering?
  // TODO Lägg till sortering

  const userId = (req as Request & { userId: number }).userId;

  const sql = `
    SELECT 
      p.postId as id, 
      GetFullName(p.postAuthor) as author,
      p.postAuthor as authorId, 
      p.postTitle as title, 
      p.postContent as content, 
      p.postImgUrl as image, 
      p.postLocation as location,
      p.postCreatedAt as createdAt,
      IsUnlocked(p.postId, $1) as isUnlocked
    FROM POST p
    JOIN PERSON p1 ON p.postAuthor = p1.personId
    WHERE p.postId IN (SELECT unlockedPostPostId FROM UNLOCKEDPOST WHERE unlockedPostPersonId = $1)
    `;

  try {
    const result: QueryResult = await client.query(sql, [userId]);
    res.status(200).json({ success: true, posts: result.rows });
    console.log('result.rows in unlocked: ', result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});
