import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import 'dotenv/config';

import client from '../connection';
import { QueryResult } from 'pg';

function saveImage(file) {
  const image = fs.readFileSync(file.path);
  const destinationPath = `uploads/${file.originalname}`;
  fs.writeFileSync(destinationPath, image);
  fs.unlinkSync(file.path);
  return destinationPath;
}

export const router: Router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post(
  '/posts',
  upload.single('image'),
  async (req: Request, res: Response) => {
    console.log('In Post /posts');

    const userId = (req as Request & { userId: number }).userId;

    let destinationPath = "";
    if (req.file) {
      destinationPath = `api/posts/${saveImage(req.file)}`;
    }

    const coordinates = JSON.parse(req.body.coordinates);

    const sql = `
      INSERT INTO POST (postPersonId, postTitle, postContent, postImgUrl, postLocation, postVisibility)
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

/* Returns all posts as locked */
router.get('/posts', async (req: Request, res: Response) => {
  console.log('In Get /posts');

  const userId = (req as Request & { userId: number }).userId;

  const sql = `
  SELECT p.postId as id, CONCAT(p1.personFirstName, ' ', p1.personLastName) as author, p.postAuthor as authorId, p.postTitle as title, p.postLocation as location 
  FROM POST p
  JOIN PERSON p1 ON p.postAuthor = p1.personId
  WHERE (p.postAuthor IN (
      SELECT friendshipPersonIdOne FROM FRIENDSHIP
      WHERE friendshipPersonIdTwo = $1 AND friendshipStatus = 'accepted'
      UNION
      SELECT friendshipPersonIdTwo FROM FRIENDSHIP
      WHERE friendshipPersonIdOne = $1 AND friendshipStatus = 'accepted'
  ) AND p.postVisibility = 'friends' AND p.postExpiresAt > NOW())
  OR
  (p.postVisibility = 'public' AND p.postExpiresAt > NOW())
  OR
  p.postAuthor = $1 AND p.postExpiresAt > NOW();
  `;
    
  try {
    const result: QueryResult = await client.query(sql, [userId]);
    res.status(200).json({ success: true, posts: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Returns all unlocked posts with all post content */
router.get('/posts/unlocked', async (req: Request, res: Response) => {
  console.log('In Get /posts/unlocked');

  const userId = (req as Request & { userId: number }).userId;

  const sql = `SELECT p.postId as id, CONCAT(p1.personFirstName, ' ', p1.personLastName) as author, p.postAuthor as authorId, p.postTitle as title, p.postContent as content, p.postImgUrl as image, p.postLocation as location
  FROM POST p
  JOIN PERSON p1 ON p.postAuthor = p1.personId
  WHERE (p.postId IN (
      SELECT unlockedPostPostId FROM UNLOCKEDPOST
      WHERE unlockedPostPersonId = $1
  ) OR p.postAuthor = $1)
  AND p.postExpiresAt > NOW();  
  `;

  try {
    const result: QueryResult = await client.query(sql, [userId]);
    res.status(200).json({ success: true, posts: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }

});



    // // Save image
    // // const file = req.file;
    // let destinationPath;
    // console.log('req.file: ', req.file);
    // if (req.file) {
    //   const img = fs.readFileSync(req.file.path);

    //   // Define the destination path
    //   destinationPath = `uploads/${req.file.originalname}`;
    //   // const image = await Jimp.read(req.file.path);
    //   // await image.resize(300, 300).write(destinationPath);

    //   console.log('destinationPath: ', destinationPath);
    //   // console.log('bild2: ', image);

    //   // Move the file to the destination folder
    //   fs.writeFileSync(destinationPath, img);
    //   destinationPath = `/api/posts/${destinationPath}`;

    //   // Remove the file from the temporary location
    //   fs.unlinkSync(req.file.path);
    // }