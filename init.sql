DROP TABLE IF EXISTS REACTION;
DROP TABLE IF EXISTS UNLOCKEDPOST;
DROP TABLE IF EXISTS POST;
DROP TABLE IF EXISTS FRIENDSHIP;
DROP TABLE IF EXISTS PERSON;

-- CREATE EXTENSION IF NOT EXISTS postgis;

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
  postAuthor INT NOT NULL,
  postVisibility visibility NOT NULL,
  postLocation POINT NOT NULL,
  postExpiresAt TIMESTAMP DEFAULT NOW() + INTERVAL '1 DAY',
  postCreatedAt TIMESTAMP DEFAULT NOW(),
  postUpdatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (postAuthor) REFERENCES PERSON (personId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UNLOCKEDPOST (
  unlockedPostId SERIAL PRIMARY KEY,
  unlockedPostPersonId INT NOT NULL,
  unlockedPostPostId INT NOT NULL,
  unlockedPostCreatedAt TIMESTAMP DEFAULT NOW(),
  unlockedPostUpdatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (unlockedPostPersonId) REFERENCES PERSON (personId) ON DELETE CASCADE,
  FOREIGN KEY (unlockedPostPostId) REFERENCES POST (postId) ON DELETE CASCADE
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
        ('Test', 'Testsson', 'already.exist@mail.com', '$2b$08$ZmTFFf05dpb8VD6VjVvuJ.7r4iyG8Slu1o1lgSftNIBLAEW9iLAgq');

INSERT INTO FRIENDSHIP (friendshipPersonIdOne, friendshipPersonIdTwo, friendshipStatus)
VALUES (1, 2, 'accepted');
      -- ,(1, 4, 'accepted');

INSERT INTO POST (postTitle, postContent, postImgUrl, postAuthor, postVisibility, postLocation, postExpiresAt)
VALUES ('En titel', 'Ett meddelande', 'bild', 1, 'public', '(57.765819, 12.052471)', NOW() + INTERVAL '1 DAY'),
      ('for friends', 'text content', 'bild', 1, 'friends', '(57.765818, 12.052471)', NOW() + INTERVAL '1 DAY');

INSERT INTO UNLOCKEDPOST (unlockedPostPersonId, unlockedPostPostId)
VALUES (2, 1);

CREATE FUNCTION GetFullName(inputPersonId INT) RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT CONCAT(personFirstName, ' ', personLastName) FROM PERSON
    WHERE personId = inputPersonId
  );
END; $$
LANGUAGE plpgsql;

CREATE FUNCTION GetFriends(personId INT) RETURNS TABLE(friendId INT) AS $$
BEGIN
  RETURN QUERY (
    SELECT friendshipPersonIdOne AS friendId FROM FRIENDSHIP
    WHERE friendshipPersonIdTwo = personId AND friendshipStatus = 'accepted'
    UNION
    SELECT friendshipPersonIdTwo AS friendId FROM FRIENDSHIP
    WHERE friendshipPersonIdOne = personId AND friendshipStatus = 'accepted'
  );
END; $$
LANGUAGE plpgsql;

CREATE FUNCTION IsUnlocked(postId INT, personId INT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM UNLOCKEDPOST
    WHERE unlockedPostPostId = postId AND unlockedPostPersonId = personId
  );
END; $$
LANGUAGE plpgsql;

SELECT 
  p.postId as id, 
  GetFullName(p.postAuthor) as author,
  p.postAuthor as authorId, 
  p.postTitle as title, 
  p.postContent as content, 
  p.postImgUrl as image, 
  p.postLocation as location,
  IsUnlocked(p.postId, 4) as isUnlocked
FROM POST p
JOIN PERSON p1 ON p.postAuthor = p1.personId
WHERE (
  p.postId IN (SELECT unlockedPostPostId FROM UNLOCKEDPOST WHERE unlockedPostPersonId = 4) 
  OR p.postAuthor = 4
  OR p.postVisibility = 'public'
  OR (
    p.postAuthor IN (SELECT friendId FROM GetFriends(4))
    AND p.postVisibility = 'friends'
  )
)
AND p.postExpiresAt > NOW();


SELECT 
  p.postId as id, 
  GetFullName(p.postAuthor) as author,
  p.postAuthor as authorId, 
  p.postTitle as title, 
  p.postContent as content, 
  p.postImgUrl as image, 
  p.postLocation as location,
  p.postCreatedAt as createdAt,
  IsUnlocked(p.postId, 4) as isUnlocked
FROM POST p
JOIN PERSON p1 ON p.postAuthor = p1.personId
WHERE (
  p.postId IN (SELECT unlockedPostPostId FROM UNLOCKEDPOST WHERE unlockedPostPersonId = 4) 
  OR p.postAuthor = 4
  OR (
    p.postAuthor IN (SELECT friendId FROM GetFriends(3))
    AND p.postVisibility = 'friends'
  )
  )
AND p.postExpiresAt > NOW();