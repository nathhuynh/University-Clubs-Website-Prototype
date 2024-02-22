CREATE DATABASE mydatabase;
USE mydatabase;

CREATE TABLE Users(
userid INT AUTO_INCREMENT,
firstname VARCHAR(50),
lastname VARCHAR(50),
pass VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
adminclearance VARCHAR(3) DEFAULT 'no',
PRIMARY KEY (userid),
CHECK (adminclearance = 'yes' OR adminclearance = 'no')
);

-- INSERT INTO Users (email, firstname, lastname, pass, adminclearance) VALUES("", "admin", "testing", "admin123", );
-- INSERT INTO Users (email, firstname, lastname, pass, adminclearance) VALUES
-- ("admin@email.com", "Admin", "User", "password", 'yes'),
-- ("lebronjames@email.com", "Lebron", "James", "password", 'no'),
-- ("michaeljordan@email.com", "Michael", "Jordan", "password", 'no'),
-- ("kevindurant@email.com", "Kevin", "Durant", "password", 'no'),
-- ("larrybird@email.com", "Larry", "Bird", "password", 'no'),
-- ("magicjohnson@email.com", "Magic", "Johnson", "password", 'no');

CREATE TABLE club(
clubid INT AUTO_INCREMENT,
clubname VARCHAR(255) UNIQUE NOT NULL,
clubdescription LONGTEXT,
PRIMARY KEY (clubid)
);

-- INSERT INTO club (clubname, clubdescription) VALUES ("Book Club", "Welcoming all books enthusiasts! We have weekly reading sessions where we read and share our favorite books.");
-- INSERT INTO club (clubname, clubdescription) VALUES ("Public Speaking", "If you are striving to improve your public speaking skills,
-- then join us in our weekly workshops where we learn from experienced speakers and
-- practice public speaking with a welcoming audience.");
-- INSERT INTO club (clubname, clubdescription) VALUES ("Dance", "We welcome all those with a passion for dancing. Fire up your body with exciting choreographies!");

CREATE TABLE membership(
membershipid INT AUTO_INCREMENT,
userid INT NOT NULL,
clubid INT NOT NULL,
memberrole VARCHAR(10) DEFAULT 'member',
subscribe BOOLEAN DEFAULT 0,
FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE,
FOREIGN KEY (clubid) REFERENCES club(clubid) ON DELETE CASCADE,
PRIMARY KEY (membershipid),
CHECK (memberrole = 'manager' OR memberrole = 'member')
);

-- INSERT INTO membership (userid, clubid, memberrole)
-- VALUES
-- (10, 6, 'member'),
-- (11, 6, 'member'),
-- (12, 6, 'member'),
-- (13, 6, 'member'),
-- (14, 6, 'member');



CREATE TABLE post(
    postid INT AUTO_INCREMENT,
    userid INT,
    clubid INT,
    posttitle VARCHAR (30) DEFAULT NULL,
    content LONGTEXT,
    attachment VARCHAR(255) DEFAULT NULL,
    dateandtime DATETIME,
    eventdate DATETIME DEFAULT NULL,
    publicity VARCHAR(10),
    CHECK (publicity = 'private' OR publicity = 'public'),
    FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE SET NULL,
    FOREIGN KEY (clubid) REFERENCES club(clubid) ON DELETE CASCADE,
    PRIMARY KEY (postid)
);



CREATE TABLE memberapplication (
requestid INT AUTO_INCREMENT,
userid INT,
clubid INT,
currentstatus VARCHAR(10) DEFAULT 'pending',
FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE SET NULL,
FOREIGN KEY (clubid) REFERENCES club(clubid) ON DELETE SET NULL,
PRIMARY KEY (requestid),
CHECK (currentstatus = 'pending' OR currentstatus = 'approved' OR currentstatus = 'declined')
);

CREATE TABLE clubapplication (
clubreqid INT AUTO_INCREMENT,
userid INT,
clubname VARCHAR(255),
clubdescription LONGTEXT,
currentstatus VARCHAR(10) DEFAULT 'pending',
FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE SET NULL,
PRIMARY KEY (clubreqid),
CHECK (currentstatus = 'pending' OR currentstatus = 'approved' OR currentstatus = 'declined')
);

CREATE TABLE rsvp (
rsvpid INT,
userid INT,
postid INT,
FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE SET NULL,
PRIMARY KEY (rsvpid)
);

CREATE TABLE feedback (
userid INT,
feedbackid INT AUTO_INCREMENT,
content LONGTEXT NOT NULL,
PRIMARY KEY(feedbackid),
FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE SET NULL
);

CREATE TABLE events (
EventId INT AUTO_INCREMENT,
clubid INT,
userid INT,
EventName VARCHAR(30) DEFAULT NULL,
Content LONGTEXT,
EventLocation VARCHAR(40) DEFAULT NULL,
EventDate DATE DEFAULT NULL,
EventTime TIME DEFAULT NULL,
Publicity VARCHAR(10),
CHECK (Publicity = 'private' OR Publicity = 'public'),
FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE SET NULL,
FOREIGN KEY (clubid) REFERENCES club(clubid) ON DELETE CASCADE,
PRIMARY KEY (EventId)
);