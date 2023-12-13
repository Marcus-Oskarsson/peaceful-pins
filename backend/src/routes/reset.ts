import express, { Request, Response } from 'express';

import client from '../connection';

export const router = express.Router();

router.post('/reset', async (req: Request, res: Response) => {
  console.log('resetting database');

  const sql = `DROP TABLE IF EXISTS REACTION;
  DROP TABLE IF EXISTS POST;
  DROP TABLE IF EXISTS FRIENDSHIP;
  DROP TABLE IF EXISTS PERSON;
  
  CREATE EXTENSION IF NOT EXISTS postgis;
  
  DO $$ BEGIN
    CREATE TYPE friendRequestStatus AS ENUM ('pending', 'accepted', 'rejected');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE visibility AS ENUM ('public', 'friends');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  CREATE TABLE IF NOT EXISTS PERSON (
    personId SERIAL PRIMARY KEY,
    personFirstname VARCHAR(50) NOT NULL,
    personLastname VARCHAR(50) NOT NULL,
    personEmail VARCHAR(100) UNIQUE NOT NULL,
    personProfilePicture TEXT DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    personPassword TEXT NOT NULL,
    personCreatedAt TIMESTAMP DEFAULT NOW(),
    personUpdatedAt TIMESTAMP DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS FRIENDSHIP (
    friendshipId SERIAL PRIMARY KEY,
    friendshipPersonIdOne INT NOT NULL,
    friendshipPersonIdTwo INT NOT NULL,
    friendshipStatus friendRequestStatus NOT NULL,
    friendshipCreatedAt TIMESTAMP DEFAULT NOW(),
    friendshipUpdatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (friendshipPersonIdOne) REFERENCES PERSON (personId) ON DELETE CASCADE,
    FOREIGN KEY (friendshipPersonIdTwo) REFERENCES PERSON (personId) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS POST (
    postId SERIAL PRIMARY KEY,
    postTitle VARCHAR(200) NOT NULL,
    postContent TEXT NOT NULL,
    postImgUrl TEXT,
    postPersonId INT NOT NULL,
    postVisibility visibility NOT NULL,
    -- postLocation POINT NOT NULL,
    postLocation GEOGRAPHY(POINT, 4326),
    postExpiresAt TIMESTAMP DEFAULT NOW() + INTERVAL '1 DAY',
    postCreatedAt TIMESTAMP DEFAULT NOW(),
    postUpdatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (postPersonId) REFERENCES PERSON (personId) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS REACTION (
    reactionId SERIAL PRIMARY KEY,
    reactionType VARCHAR(50) NOT NULL,
    reactionPersonId INT NOT NULL,
    reactionPostId INT NOT NULL,
    reactionCreatedAt TIMESTAMP DEFAULT NOW(),
    reactionUpdatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (reactionPersonId) REFERENCES PERSON (personId) ON DELETE CASCADE,
    FOREIGN KEY (reactionPostId) REFERENCES POST (postId) ON DELETE CASCADE
  );
  
  INSERT INTO PERSON (personFirstname, personLastname, personEmail, personPassword)
  VALUES ('Marcus', 'Aurelius', 'm.a@mail.com', '123456'),
          ('Seneca', 'the Younger', 's.y@mail.com', '123456'),
          ('Epictetus', 'of Hierapolis', 'e.h@mail.com', '123456'),
          ('Test', 'Testsson', 'already.exist@mail.com', 'testtesttest');
  
  INSERT INTO FRIENDSHIP (friendshipPersonIdOne, friendshipPersonIdTwo, friendshipStatus)
  VALUES (1, 2, 'accepted');
  
  INSERT INTO POST (postTitle, postContent, postImgUrl, postPersonId, postVisibility, postLocation, postExpiresAt)
  VALUES ('Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vit', 'https://picsum.photos/200/300', 1, 'public', ST_SetSRID(ST_MakePoint(12.052471, 57.765819), 4326), NOW() + INTERVAL '1 DAY');`
  try {
    await client.query(sql);

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error });
  }
});

export default router;
