import express, { Request, Response, Router } from 'express';
// import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import 'dotenv/config';

// import client from '../connection';
// import { QueryResult } from 'pg';

export const router: Router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post(
  '/posts',
  upload.single('image'),
  async (req: Request, res: Response) => {
    console.log('In Post /posts');

    const userId = (req as Request & { userId: number }).userId;
    console.log(userId);

    // Save image
    // const file = req.file;
    let destinationPath;
    console.log('req.file: ', req.file);
    if (req.file) {
      const img = fs.readFileSync(req.file.path);

      // Define the destination path
      destinationPath = `uploads/${req.file.originalname}`;
      // const image = await Jimp.read(req.file.path);
      // await image.resize(300, 300).write(destinationPath);

      console.log('destinationPath: ', destinationPath);
      // console.log('bild2: ', image);

      // Move the file to the destination folder
      fs.writeFileSync(destinationPath, img);
      destinationPath = `/api/posts/${destinationPath}`;

      // Remove the file from the temporary location
      fs.unlinkSync(req.file.path);
    }

    // console.log('email: ', email, 'password: ', password);
    res.json('Hello World');
    // const sql = `
    //   SELECT personPassword, personFirstname, personLastname, personEmail, personProfilePicture FROM PERSON
    //   WHERE personEmail = $1`;

    // try {
    //   const result: QueryResult<User> = await client.query(sql, [email]);

    //   if (result.rowCount === 0) {
    //     res
    //       .status(401)
    //       .json({ success: false, error: 'Username or password is incorrect' });
    //     return;
    //   }

    //   bcrypt.compare(
    //     password,
    //     result.rows[0].personpassword,
    //     function (err, isCorrect) {
    //       if (err) {
    //         res
    //           .status(500)
    //           .json({ success: false, error: 'Something went wrong' });
    //         return;
    //       }
    //       if (!isCorrect) {
    //         res.status(401).json({
    //           success: false,
    //           error: 'Username or password is incorrect',
    //         });
    //         return;
    //       }

    //       const user = result.rows[0];
    //       const token = jwt.sign(
    //         { id: user.personid, role: 'user' },
    //         jwtSecret!,
    //         {
    //           expiresIn: '24h',
    //         },
    //       );

    //       const newUser = {
    //         firstName: user.personfirstname,
    //         lastName: user.personlastname,
    //         email: user.personemail,
    //         profilePicture: user.personprofilepicture,
    //       };

    //       res
    //         .cookie('token', token, {
    //           httpOnly: false,
    //           maxAge: 1000 * 60 * 60 * 24, // 1 day
    //         })
    //         .status(200)
    //         .json({
    //           success: true,
    //           message: 'login successful',
    //           data: {
    //             user: newUser,
    //           },
    //         });
    //     },
    //   );
    // } catch (error) {
    //   const err = error as Error & { code: string };
    //   if (err.code === '23505') {
    //     res.status(409).json({ success: false, error: 'Email already exists' });
    //   } else {
    //     console.error(err);
    //     res.status(500).json({ success: false, error: 'Something went wrong' });
    //   }
    // }
  },
);
