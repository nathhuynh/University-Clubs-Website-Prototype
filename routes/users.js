/* eslint-disable linebreak-style */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('current user: ', req.session.user.userid);
  res.send('respond with a resource');
});

// set up email
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'raleigh79@ethereal.email', // all notifs come from system email address
      pass: 'QVHxRRXVguHcTpnSAm'
  }
});

// // display clubs, no need for user registration
// // client receives clubname, clubid
// router.get('/clubs', function(req,res,next){

//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /clubs");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `SELECT clubname, clubid FROM club;`;
//     connection.query(query, function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for get /clubs");
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);
//     });
//   });
// });

// *****WORKING******* //
// retrieve club name and club category for find-clubs page
// doesnt require input

router.get('/getclubs', function(req,res,next){
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /clubs");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT clubname, clubid FROM club;`;
    connection.query(query, function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /clubs");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// // display a club
// // client send clubid
// // client receives clubname, clubdescription
// router.get('/:clubid/thisclub/', function(req,res,next){

//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /thisclub");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `SELECT clubname, clubdescription FROM club WHERE clubid = ?;`;
//     connection.query(query,[req.params.clubid],function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for get /thisclub");
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);
//     });
//   });
// });


// client send clubid
// if user is NOT a member of club then only public posts; if member is a user then see all post
// client all of post info (check table) + poster's first name last name
// router.get('/:clubid/posts', function(req,res,next){

//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /posts");
//       res.sendStatus(500);
//       return;
//     }

//     // check if they are a club member
//     let userquery = `SELECT * FROM membership WHERE userid = ? AND clubid = ?;`;
//     connection.query(userquery,[req.session.user.userid, req.params.clubid],
//       function(qerr, rows, fields) {
//       // if they are not a member, only public post
//       if (rows.length <= 0) {
//         let postquery = `SELECT * FROM post
//                           INNER JOIN Users ON post.userid = Users.userid
//                           WHERE clubid = ? AND publicity = 'public';`;
//       }
//       // if they are a user, all posts
//       else {
//         let postquery = `SELECT * FROM post
//                           INNER JOIN Users ON post.userid = Users.userid
//                           WHERE clubid = ?;`;
//       }
//       connection.query(postquery,[req.params.clubid],function(qerr2, rows2, fields2) {
//         connection.release();
//         if (qerr2) {
//           console.log("qerr2 for get /posts");
//           res.sendStatus(500);
//           return;
//         }
//         res.json(rows);
//       });
//     });
//   });
// });


/////////////////////////////////////////////////
// check if current user is a registered user
router.use('/', function(req, res, next) {

  // // if if there's alr a userid is in req session
  // if (!('user' in req.session)){
  //   res.sendStatus(403);
  // }
  // else {
  //   next();
  // }

  // if (req.session.user.userid)

  // just in case idk check if userid is a user in the database
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr when checking if session user is a member");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM Users WHERE userid = ?;`;

    connection.query(query, [req.session.user.userid],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr wjen checking if session user is a member");
        res.sendStatus(500);
        return;
      }
      // if no session id
      if (rows <= 0){
        res.sendStatus(403);
        return;
      }
      next();
    });
  });

});

// send 1 if admin; 0 if not admin
// client send clubid
router.get('/admincheck', function(req, res, next) {
  console.log("check if admin");
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr when checking if session user is admin");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM Users WHERE userid = ? AND adminclearance = "yes";`;

    connection.query(query,[req.session.user.userid], function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr when checking if session user is admin");
        res.sendStatus(500);
        return;
      }
      // if they are not an admin
      if (rows.length <= 0){
        console.log('not an admin');
        res.send(false);
      }
      else {
        console.log('is an admin');
        res.send(true);
      }
    });
  });
});


// client receives userid, firstname, lastname, email
router.get('/userprofile', function(req,res,next){
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /userprofile");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT userid, firstname, lastname, email FROM Users WHERE userid = ?;`;
    connection.query(query,[req.session.user.userid],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /userprofile");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// edit profiles - MAYBE OMIT????
// client sends JSON with firstname, lastname, password,  email regardless of whether they were updated or not
// on client's side, make sure to ask user to double confirm before submit request
// optional: ask user to enter password before letting them change old password
// client receives updated profile
/*
router.post('/editprofile', function(req,res,next){
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr /editprofile");
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE Users SET firstname = ?, lastname = ?, password = ?, email = ? WHERE userid = ?;`;

    // insert user input into queries
    connection.query(query,[req.body.firstname, req.body.lastname, req.body.password,
      req.body.email,req.session.user.userid], function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log('qerr /editprofile');
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});
*/

// contact/feedback form to site admin
// client sends content
router.post('/feedback', function(req,res,next){
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr send feedback");
      res.sendStatus(500);
      return;
    }

    let query = `INSERT INTO feedback (userid, content) VALUES(?, ?)`;

    // insert user input into queries
    connection.query(query, [req.session.user.userid, req.body],function(qerr, rows, fields) {
      connection.release();

      if (qerr) {
        console.log('qerr send feedback');
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});


// // apply to be a club member
// // client send clubid
// router.post('/:clubid/membershipapplication', function(req,res,next){
//   // get body from req; req is a json array extracted from a form
//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr membershipapplication");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `INSERT INTO memberapplication (userid, clubid) VALUES(?, ?)`;

//     // insert user input into queries
//     // NOT DONE; MISSING CLUB ID
//     connection.query(query, [req.session.user.userid, req.params.clubid],function(qerr, rows, fields) {
//       connection.release();

//       if (qerr) {
//         console.log('qerr membershipapplication');
//         res.sendStatus(500);
//         return;
//       }
//       res.end();
//     });
//   });
// });

// apply for a new club to be created
// client send clubname, clubdescription
router.post('/newclubapplication', function(req,res,next){
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr newclubapplication");
      res.sendStatus(500);
      return;
    }

    let query = `INSERT INTO clubapplication (userid, clubname, clubdescription) VALUES(?, ?, ?)`;
    // insert user input into queries
    // NOT DONE; MISSING CLUB ID
    connection.query(query, [req.session.user.userid, req.body.clubname, req.body.clubdescription],
      function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log('qerr newclubapplication');
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

//////////////////////////////////////////////////////
// check membership table to see if user is a club member

router.use('/:clubid', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr when checking if session user is club member");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM membership WHERE userid = ? AND clubid = ?;`;

    connection.query(query,[req.session.user.userid, req.params.clubid],
      function(qerr, rows, fields){
      connection.release();
      if (qerr) {
        console.log("qerr when checking if session user is club member");
        res.sendStatus(500);
        return;
      }
      // if not a club member
      if (rows.length <= 0){
        console.log("not a club member");
        res.sendStatus(500);
      }
      else {
        next();
      }
    });
  });
});

// user sign up for events/rsvp
// client send clubid and postid
router.post('/:clubid/eventapplication', function(req,res,next){
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr /eventapplication");
      res.sendStatus(500);
      return;
    }

    let query = `INSERT INTO rsvp (userid, postid) VALUES(?, ?)`;
    // insert user input into queries
    // NOT DONE; MISSING CLUB ID
    connection.query(query, [req.session.user.userid, req.body],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log('qerr /eventapplication');
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

// cancel events (maybe if the client click on a button)
// client send clubid and postid
router.post('/:clubid/cancelevent', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /cancelevent");
      res.sendStatus(500);
      return;
    }

    let query = `DELETE FROM rsvp
                  INNER JOIN post
                  ON rsvp.postid = post.postid
                  WHERE postid = ?;`;

    connection.query(query,[req.body], function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /cancelevent");
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

// user see what events they're going to
// client send clubid
// optional: indicate/separate upcoming events (i.e. before "today") and past events (i.e. after "today")
// router.get('/:clubid/events', function(req,res,next){
//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /events");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `SELECT * FROM post INNER JOIN rsvp
//                   ON post.postid = rsvp.postid
//                   WHERE rsvp.userid = ?;`;

//     connection.query(query,[req.session.user.userid],function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for get /events");
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);

//     });
//   });
// });


// user can change the subscribe status
// user send clubid and either 0 (not subscribed) or 1 (subscribed)
router.post('/:clubid/subscribe', function(req,res,next){
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr /subscribe");
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE membership SET subscribe = ? WHERE userid = ? AND clubid = ?`;
    // insert user input into queries
    // NOT DONE; MISSING CLUB ID
    connection.query(query, [req.body, req.session.user.userid, req.params.clubid],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log('qerr /subscribe');
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});


// send 0 if not manager; 1 if manager
// client send clubid
router.get('/:clubid/managercheck', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr when checking if session user is admin");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT memberrole FROM membership
                  WHERE userid = ? AND clubid = ? AND memberrole = "manager";`;

    connection.query(query,[req.session.user.userid], function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr when checking if session user is club manager");
        res.sendStatus(500);
        return;
      }
      // if they are not an admin
      if (rows.length <= 0){
        res.send(0);
      }
      else {
        res.send(1);
      }
    });
  });
});

/////////////////////////////////////////////////////
// check membership table to see if user is a club leader

router.use('/:clubid', function(req, res, next) {
  // call w/ user in front
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr when checking if session user is club leader");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT memberrole FROM membership
                WHERE userid = ? AND clubid = ? AND memberrole = "manager";`;

    connection.query(query,[req.session.user.userid, req.params.clubid],
      function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr when checking if session user is club leader");
        res.sendStatus(500);
        return;
      }
      // if no session id
      if (rows.length <= 0){
        console.log("Not a club manager");
        res.sendStatus(403);
      }
      else {
        next();
      }
    });
  });
});


// post
// client send clubid, content, dateandtime, eventdate (null if it's not an event), publicity ("public" or "private")
router.post('/:clubid/newpost', function(req,res,next){
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("newpost cerr error");
      res.sendStatus(500);
      return;
    }

    let postquery = `INSERT INTO post (
                  userid,
                  clubid,
                  posttitle,
                  content,
                  dateandtime,
                  eventdate,
                  publicity
                )
                VALUES (
                  ?,
                  ?,
                  ?,
                  ?,
                  ?,
                  ?,
                  ?
                );`;

    // insert user input into queries
    // NOT DONE; MISSING CLUB ID
    connection.query(postquery,
      [req.session.user.userid,
      req.params.clubid,
      req.body.title,
      req.body.content,
      req.body.dateandtime,
      req.body.eventdate,
      req.body.publicity],function(qerr, rows, fields) {
      connection.release();

      if (qerr) {
        console.log('postquery qerr');
        res.sendStatus(500);
        return;
      }
      res.end();

      // send notifs when person create a new post
      // grab a list of people who subscribes = rows
      // PUT THIS IN /NEWPOST
    });
    let query = `SELECT email FROM Users
                            INNER JOIN membership ON Users.userid = membership.userid
                            INNER JOIN club ON membership.clubid = club.clubid
                            WHERE membership.subscriber <> 0 AND clubid = ?`;

    connection.query(query,[req.params.clubid],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log('newpost qerr email:', qerr);
        res.sendStatus(500);
      }
      for (let i = 0; i < rows.length; i++) {
        let info = transporter.sendMail({
          from: 'raleigh79@ethereal.email', // sender address
          to: rows[i], // list of receivers
          subject: req.body.subject, // Subject line
          text: req.body.text, // plain text body
          html: "<b>"+req.body.text+"</b>" // html body
        });
      }
    });
  });
});

// delete post
// client needs to send clubid and postid
router.post('/:clubid/deletepost', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /deletepost");
      res.sendStatus(500);
      return;
    }

    let query = `DELETE FROM post WHERE postid = ?;`;

    connection.query(query,[req.body], function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /deletepost");
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

// // return list of user in alphabetical order: firstname, lastname, email, role
// // need client to send clubid
// router.get('/:clubid/clubmembers', function(req,res,next){

//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /clubmembers");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `SELECT Users.firstname, Users.lastname, Users.email, membership.memberrole
//                   FROM membership INNER JOIN Users on userid
//                   WHERE clubid = ?
//                   ORDER BY firstname, lastname;`;

//     connection.query(query,[req.params.clubid],function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for get /clubmembers");
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);
//     });
//   });
// });

// return list of members who sign up for event/rsvp
// alphabetical order: Firstname, lastname, email from userid that rsvpd
// need client to send rsvpid

// router.get('/:clubid/rsvpdlist', function(req, res, next) {
//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for GET /rsvpd");
//       res.sendStatus(500);
//       return;
//     }
//     let query = `SELECT firstname, lastname, email FROM rsvp
//                   INNER JOIN Users ON rsvp.userid = Users.userid
//                   WHERE rsvpid = ?;`;

//     connection.query(query, [req.body], function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for GET /rsvpdlist");
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);
//     });
//   });
// });


// kick user from club
// client send userid (of person about to be kicked) and clubid
router.post('/:clubid/kickfromclub', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /kickfromclub");
      res.sendStatus(500);
      return;
    }

    let query = `DELETE FROM membership WHERE userid = ? AND clubid = ?;`;

    connection.query(query,[req.body.userid, req.params.clubid], function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /kickfromclub");
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

// client recieves firstname, lastname, status of pending members who apply to that club
// client send clubid (the club that the user manages/lead)
router.get('/:clubid/membershipapplication', function(req,res,next){

  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /membershipapplication");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT Users.firstname, Users.lastname, memberapplication.currentstatus FROM Users
                  INNER JOIN memberapplication ON Users.userid = membershipapplication.userid
                  WHERE memberapplication.clubid = ? AND memberapplication.currentstatus = "pending";`;

    connection.query(query,[req.params.clubid],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /membershipapplication");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// accept member application
// client send userid (prospective new member) and clubid
router.post('/:clubid/acceptmembershipapplication', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /acceptmembershipapplication");
      res.sendStatus(500);
      return;
    }

    // update application request to "accepted"
    let applicationquery = `UPDATE memberapplication SET status = "accepted" WHERE userid = ? AND clubid = ?;`;

    connection.query(applicationquery,[req.body, req.params.clubid],
      function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /acceptmembershipapplication");
        res.sendStatus(500);
      }
    });

    // add member into club in membership
    let membershipquery = `INSERT INTO membership (userid, clubid, memberrole) SET (?, ?, "member");`;

    connection.query(membershipquery,[req.body.userid, req.params.clubid], function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /acceptmembershipapplication");
        res.sendStatus(500);
      }
      res.end();
    });
  });
});

// decline member application
// client send userid and clubid
router.post('/:clubid/declinemembershipapplication', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /declinemembershipapplication");
      res.sendStatus(500);
      return;
    }

    let applicationquery = `UPDATE memberapplication SET status = "declined" WHERE userid = ? AND clubid = ?;`;

    connection.query(applicationquery,[req.body.userid, req.params.clubid], function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /declinemembershipapplication");
        res.sendStatus(500);
      }
    });
  });
});

// // edit clubname and clubdescription
// // client send clubid, clubname, clubdescription
// router.post('/:clubid/editclub', function(req, res, next) {
//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /editclub");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `UPDATE club SET clubname = ?, clubdescription = ? WHERE clubid = ?;`;
//     connection.query(query,[req.body.clubname, req.body.clubdescription, req.params.clubid], function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for /editclub");
//         res.sendStatus(500);
//         return;
//       }
//       res.end();
//     });
//   });
// });


///////////////////////////////////////////
// check if the user has adminclearance = yes
router.use('/', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr when checking if session user is admin");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM Users WHERE userid = ? AND adminclearance = "yes";`;

    connection.query(query,[req.session.user.userid], function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr when checking if session user is admin");
        res.sendStatus(500);
        return;
      }
      // if they are not an admin
      if (rows.length <= 0){
        res.sendStatus(403);
      }
      else {
        next();
      }
    });
  });
});


// // remove user from database
// // client needs to send userid (of person to be removed) to server
// router.post('/deleteuser', function(req, res, next) {
//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /deleteuser");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `DELETE FROM Users WHERE userid = ?;`;

//     connection.query(query,[req.body], function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for /deleteuser");
//         res.sendStatus(500);
//         return;
//       }
//       res.end();
//     });
//   });
// });

// change admin clearance status of user
// client send JSON object containting clearance (either "yes" or "no") and userid
router.post('/updateclearance', function(req,res,next){
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /updateclearance");
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE Users SET adminclearance = ? WHERE userid = ?;`;

    connection.query(query,[req.body.clearance, req.body.userid],function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /updateclearance");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
      // maybe add another query to display change in admin clearance
    });
  });
});

// // admin client receives firstname, lastname, email, adminclearance from all registered users in alphabetical order
// router.get('/siteusers', function(req,res,next){

//   req.pool.getConnection(function(cerr, connection) {
//     if (cerr) {
//       console.log("cerr for get /siteusers");
//       res.sendStatus(500);
//       return;
//     }

//     let query = `SELECT firstname, lastname, email, adminclearance FROM Users ORDER BY firstname, lastname;`;

//     connection.query(query,[req.body],function(qerr, rows, fields) {
//       connection.release();
//       if (qerr) {
//         console.log("qerr for get /siteusers");
//         res.sendStatus(500);
//         return;
//       }
//       res.json(rows);
//     });
//   });
// });

// see current pending club applications
// client receives clubreqid, clubname, clubdescription, currentstatus
router.get('/newclubrequest', function(req,res,next){

  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /newclubrequest");
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM clubapplication WHERE currentstatus = "pending";`;

    connection.query(query,function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /newclubrequest");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// accept club request
// client send clubreqid
router.post('/acceptclubrequest', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /acceptclubrequest");
      res.sendStatus(500);
      return;
    }

    let applicationquery = `UPDATE clubapplication SET status = "approved" WHERE clubreqid = ?;`;

    connection.query(applicationquery,[req.body], function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /acceptclubrequest");
        res.sendStatus(500);
        return;
      }
      let newclubname = rows.clubname;
      let newclubdescription = rows.clubdescription;
      let newclubid = rows.clubid;

      let clubquery = `INSERT INTO club (clubname, clubdescription) VALUES (?, ?);`;

      connection.query(clubquery,[newclubname, newclubdescription],
        function(qerr2, rows2, fields2) {
        connection.release();

        if (qerr2) {
          console.log("qerr2 for /acceptmembershipapplication");
          res.sendStatus(500);
        }
      });
      let membershipquery = `INSERT INTO membership (userid, clubid, memberrole) VALUES (?, ?, ?);`;
        connection.query(membershipquery,[req.session.user.userid, newclubid,"manager"],
          function(qerr3, rows3, fields3) {
          connection.release();

          if (qerr3) {
            console.log("qerr for /acceptmembershipapplication");
            res.sendStatus(500);
          }
        });
      res.end();
    });
  });
});

// decline member application
// client send clubreqid
router.post('/declinenewclubreq', function(req, res, next) {
    req.pool.getConnection(function(cerr, connection) {
      if (cerr) {
        console.log("cerr for get /declinenewclubreq");
        res.sendStatus(500);
        return;
      }

      let applicationquery = `UPDATE clubapplication SET currentstatus = "declined" WHERE clubreqid = ?;`;

      connection.query(applicationquery,[req.body], function(qerr, rows, fields) {

        connection.release();

        if (qerr) {
          console.log("qerr for /declinenewclubreq");
          res.sendStatus(500);
          return;
        }
        res.end();
      });
    });
});

// admin view feedback
router.get('/feedbacks', function(req, res, next) {
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("cerr for get /getfeedbacks");
      res.sendStatus(500);
      return;
    }

    let applicationquery = `SELECT * FROM feedback;`;

    connection.query(applicationquery, function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        console.log("qerr for /getfeedback");
        res.sendStatus(500);
      }
      res.send(rows);
    });
  });
});

module.exports = router;

/*
IMPORTANT GUIDELINES

If a router function specified that "client send clubid", send it as a query parameter
  let clubid = ....; // have a local variable called clubid

  req.open('GET',`/${clubid}/thisclub` ); // attach that local var clubid into req.open like this
  req.setRequestHeader('Content-Type','application/json');
  req.send(JSON.stringify(logindata));

If specified that client need to res.send variables other than clubid
  If client has to send multiple variables, send the variables as a json object with the exact names specified
  If there's only 1 variable (outside of clubid), res.send(var) normally no need to res.json it
*/
