/* eslint-disable max-len */
/* eslint-disable linebreak-style */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');
// var bodyParser = require('body-parser');
var fs = require("fs");


var dbConnectionPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());

app.use(function (req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'super secret string',
  secure: false
}));

// // optional but good for keeping track
// app.use(function (req, res, next) {
//   console.log("The current user is: " + req.session.user.userid);
//   next();
// });

const setDefaultUserId = (req, res, next) => {
  if (!req.session.user) {
    req.session.user = {};
  }
  if (!req.session.user.userid) {
    req.session.user.userid = 0;
  }
  next();
};

app.use(setDefaultUserId);


app.use('/', indexRouter);
app.use('/users', usersRouter);

// ************ SAL'S ROUTES***************** //

// DISPLAY ALL CLUBS
// client receives clubname, clubid
app.get('/clubs', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("Error for getting clubs:", cerr);
      //res.status(500).send("cerr for get /clubs");
      return;
    }

    let query = `SELECT clubname, clubid FROM club;`;
    connection.query(query, function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("Error for getting clubs:", qerr);
        return;
      }
      res.json(rows);
    });
  });
});

//POST NEW EVENT INTO DATABASE
//****NEEDS USERID INPUT */
app.post('/new-post', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("newpost cerr error", cerr);
      res.sendStatus(500);
      return;
    }
    let postquery = `INSERT INTO post (
      userid,
      clubid,
      posttitle,
      content,
      dateandtime,
      publicity
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      CURRENT_TIMESTAMP,
      ?
    );`;

    // insert user input into queries
    // NOT DONE; MISSING CLUB ID
    connection.query(postquery, [req.session.user.userid,
      req.body.clubid,
      req.body.posttitle,
      req.body.postcontent,
      req.body.publicity], function (qerr, rows, fields) {
        connection.release();

        if (qerr) {
          console.log('postquery qerr', qerr);
          res.sendStatus(500);
          return;
        }
        res.end();
      });
  });
});

//POST NEW EVENT INTO DATABASE
app.post('/new-event', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("new-event cerr error", cerr);
      res.sendStatus(500);
      return;
    }

    let eventquery = `INSERT INTO events (
      clubid,
      userid,
      EventName,
      Content,
      EventLocation,
      EventDate,
      EventTime,
      Publicity
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    );`;

    connection.query(eventquery, [
      req.body.clubid,
      req.session.user.userid,
      req.body.eventname,
      req.body.content,
      req.body.eventlocation,
      req.body.eventdate,
      req.body.eventtime,
      req.body.publicity
    ], function (qerr, rows, fields) {
      connection.release();

      if (qerr) {
        console.log('eventQuery qerr', qerr);
        res.sendStatus(500);
        return;
      }

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="eng">

      <head>
          <!--CSS LINK-->
          <link rel="stylesheet" type="text/css" href="stylesheets/event-page.css">

          <script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>

          <!--JS LINK-->
          <!-- <script src="scripts/event-page.js" defer></script> -->

          <!--Symbols library-->
          <script src="https://kit.fontawesome.com/979fc57cca.js" crossorigin="anonymous"></script>

          <meta charset="UTF-8">
          <title>Web Project - Event Page</title>
      </head>

      <body>

          <header>
              <div class="page-title">
                  <div class="login-div">
                      <div class="login-symbol"><button class="login-button" type="button"
                              onclick="window.location.href='log-in.html'">
                              <i class="fa fa-sign-in" aria-hidden="true"></i>
                          </button>
                          <p id="login-text">LOGIN</p>
                      </div>
                  </div>
                  <br>
                  <h1>Adelaide University Clubs</h1>

              </div>

              <!---Tab with links to connecting pages-->
              <nav class="nav-tab">
                  <ul>
                      <li><a href="home.html">HOME</a></li>
                      <li><a href="about.html" onclick>ABOUT</a></li>
                      <li><a href="find-clubs.html">CLUBS</a></li>
                      <li><a href="club-feed.html">YOUR CLUBS</a></li>
                      <li><a href="profile.html">PROFILE</a></li>
                  </ul>
              </nav>

          </header>

          <main>

            <div class="event-info">
              <h3 id="event-title" class="event-title">EVENT TITLE</h3>
              <h4>Event Details</h4>
              <p>
                Time: <span id="time"></span><br>
                Date: <span id="date"></span><br>
                Location: <span id="location"></span><br>
                Additional Info: <span id="additional-info"></span>
              </p>
            </div>



          </main>


          <button id ="rsvpButton" class="RSVP-button" type="button">RSVP</button>

          // <div  id="rsvp-list" class="members-list-container">
          //     <h4>RSVP'D MEMBERS:</h4>
          //     <hr>
          //     <ul>
          //       <li v-for="member in members" :key="member.userid"> {{ member.firstname }} {{ member.lastname }}</li>
          //     </ul>
          //   </div>
          <br><br><br><br><br><br><br><br>


          <!---Footer -->
          <footer>
              <!----Dark mode toggle-->
              <div class="dark-mode">
                  <button type="button" onclick="switchColourMode('stylesheets/club-feed-light.css')">Light mode</button>
                  <button type="button" onclick="switchColourMode('stylesheets/club-feed-dark.css')">Dark mode</button>
              </div>

              <div class="address">
                  <div id="north">
                      <p class="campus">North Terrace Campus</p>
                      <p>Level 4 Hub Central, University of Adelaide</p>
                      <p>08 8313 5401</p>
                  </div>

                  <div id="waite">
                      <p class="campus">Waite Campus</p>
                      <p>The Hub, McLeod Building</p>
                      <p>08 8313 5401</p>
                  </div>

                  <div id="roseworthy">
                      <p class="campus">Roseworthy Campus</p>
                      <p>Room GO1, College Hall</p>
                      <p>08 8313 5401</p>
                  </div>
              </div>

              <div class="footer-links">
                  <a href="/contact-us">Contact Us</a>
                  <a href="/terms-conditions">Terms and Conditions</a>
              </div>
              <div class="social-links">
                  <a href="#"><i class="fab fa-facebook-f"></i></a>
                  <a href="#"><i class="fab fa-twitter"></i></a>
                  <a href="#"><i class="fab fa-instagram"></i></a>
              </div>


          </footer>
          <script>

        // Function to Eventid
      // get the club id
      function getEventId() {

        var filename = window.location.pathname.split("/").pop();
        var eventName = filename.replace(/-/g, ' ').replace(/.html$/, '');
        console.log(eventName);


                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                  if (this.readyState === 4) {
                    if (this.status === 200) {
                      var response = JSON.parse(this.responseText);
                      globalEventId = response.EventId;

                      // call functions that need club id
                      getEventDetails();

                    } else {
                      console.log("Error getting clubid: " + this.status);
                    }
                  }
                };


                var url = "/get-eventid?EventName=" + eventName;
                xhttp.open("GET", url, true);
                xhttp.send();
              }

              getEventId();

              var globalEventId = null;
        // Make an AJAX request to retrieve event details
        function getEventDetails() {
          var eventId = globalEventId // Dynamically change this
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
              var eventData = JSON.parse(this.responseText)[0]; // Assuming only one event is returned

              function formatDate(date) {
               return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            }
              // Update the HTML content with event details
              document.getElementById("event-title").textContent = eventData.EventName;
              document.getElementById("time").textContent = eventData.EventTime;
              document.getElementById("date").textContent = formatDate(eventData.EventDate);
              document.getElementById("location").textContent =  eventData.EventLocation;
              document.getElementById("additional-info").textContent =  eventData.Content;
            }
          };

          function sendRSVP() {
          var postId = eventId;

          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
              if (this.status === 200) {
                // RSVP successful
                console.log('RSVP successful');
              } else {
                // Error handling
                console.log('Error RSVPing: ' + this.status);
              }
            }
          };

          var url = '/rsvp?postid=' + postId;
          xhttp.open('POST', url, true);
          xhttp.setRequestHeader('Content-type', 'application/json');
          var data = JSON.stringify({ postid: postId });
          xhttp.send(data);
        }

        // Attach a click event listener to the RSVP button
        var rsvpButton = document.getElementById('rsvpButton');
        rsvpButton.addEventListener('click', sendRSVP);


          function getMembers() {
              var xhttp = new XMLHttpRequest();

              xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    var members = JSON.parse(this.responseText);
                    updateRSVPMembers(members);
                  } else {
                    console.log("Error fetching member data: " + this.status);
                  }
                }
              };

              var postId = eventId; // Replace 1 with the actual postid value
              var url = "/rsvpdlist?postid=" + postId;
              xhttp.open("GET", url, true);
              xhttp.send();
            }

            // Function to update the RSVP'd members
            function updateRSVPMembers(members) {
              var rsvpList = new Vue({
                el: '#rsvp-list',
                data: {
                  members: members,
                },
              });
            }

            getMembers();



          xhttp.open("GET", "/geteventdetail?EventId=" + eventId, true);
          xhttp.send();
        }

          // Call the function to load event details when the page is loaded
          window.onload = getEventDetails;

        // Function to get data of club members with AJAX

          </script>



      </body>

      </html>`;

      // Generate the file path and name
      const filename = req.body.eventname.toLowerCase().replace(/ /g, '-');

      const filePath = `public/${filename}.html`;

      // Write the HTML content to the file
      fs.writeFile(filePath, htmlContent, function (err) {
        if (err) {
          console.log("Error creating event HTML file:", err);
          res.sendStatus(500);
          return;
        }

        console.log(`Club HTML file "${req.body.eventname}.html" created successfully.`);

        res.sendStatus(200);
      });
    });
  });

});


app.post('/rsvp', function(req,res,next){
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log("rsvp cerr error",cerr);
      res.sendStatus(500);
      return;
    }
    let postquery = `INSERT IGNORE INTO rsvp (userid, postid) VALUES (?, ?);`;

connection.query(postquery,[req.session.user.userid, req.body.postid],function(qerr, rows, fields) {
connection.release();

      if (qerr) {
        console.log('postquery qerr',qerr);
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

//DISPLAY RSVP LIST BASED ON RSVP DATA
// return list of members who sign up for event/rsvp
// alphabetical order: Firstname, lastname, email from userid that rsvpd
// need client to send postid

app.get('/rsvpdlist', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("cerr for GET /rsvpd");
      res.sendStatus(500);
      return;
    }
    let query = `SELECT firstname, lastname, email FROM rsvp
                  INNER JOIN Users ON rsvp.userid = Users.userid
                  WHERE postid = ?;`;

    connection.query(query, [req.query.postid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for GET /rsvpdlist");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});



app.get('/geteventdetail', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("cerr for GET /geteventdetails");
      res.sendStatus(500);
      return;
    }
    let query = `SELECT * FROM events WHERE EventId=?;`;

    connection.query(query, [req.query.EventId], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for GET /eventdetails");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


//GET ALL POSTS FOR A CLUB
// client send clubid
// if user is NOT a member of club then only public posts; if member is a user then see all post
// client all of post info (check table) + poster's first name last name
app.get('/posts', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("cerr for get /posts");
      res.sendStatus(500);
      return;
    }

    // check if they are a club member
    let userquery = `SELECT * FROM membership WHERE userid = ? AND clubid = ?;`; // user is a manager, //
    connection.query(userquery, [req.session.user.userid, req.query.clubid], function (qerr, rows, fields) {
      if (qerr) {
        console.log("qerr for get /posts", qerr);
        res.sendStatus(500);
        return;
      }

      let postquery = ''; // Declare the postquery variable

      // if they are not a member, only public posts
      if (rows.length <= 0) {
        postquery = `SELECT * FROM post
                      INNER JOIN Users ON post.userid = Users.userid
                      WHERE clubid = ? AND publicity = 'public';`;
      }
      // if they are a member, fetch all posts
      else {
        postquery = `SELECT * FROM post
        INNER JOIN Users ON post.userid = Users.userid
        WHERE clubid = ?;`;
      }

      connection.query(postquery, [req.query.clubid], function (qerr2, rows2, fields2) {
        connection.release();
        if (qerr2) {
          console.log("qerr2 for get /posts", qerr2);
          res.sendStatus(500);
          return;
        }
        res.json(rows2);
      });
    });
  });
});


//GET ALL EVENTS OF A CLUB
app.get('/events', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("cerr for get /events");
      res.sendStatus(500);
      return;
    }

    // check if they are a club member
    let userquery = `SELECT * FROM membership WHERE userid = ? AND clubid = ?;`; // user is a manager, //
    connection.query(userquery, [req.session.user.userid, req.query.clubid], function (qerr, rows, fields) {
      if (qerr) {
        console.log("qerr for get /events", qerr);
        res.sendStatus(500);
        return;
      }

      let postquery = ''; // Declare the postquery variable

      // if they are not a member, only public posts
      if (rows.length <= 0) {
        postquery = `SELECT * FROM events
                      INNER JOIN Users ON events.userid = Users.userid
                      WHERE clubid = ? AND publicity = 'public';`;
      }
      // if they are a member, fetch all posts
      else {
        postquery = `SELECT * FROM events
        INNER JOIN Users ON events.userid = Users.userid
        WHERE clubid = ?;`;
      }

      connection.query(postquery, [req.query.clubid], function (qerr2, rows2, fields2) {
        connection.release();
        if (qerr2) {
          console.log("qerr2 for get /event", qerr2);
          res.sendStatus(500);
          return;
        }
        res.json(rows2);
      });
    });
  });
});

// get members events from database
app.get('/members-events', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("cerr for GET /members-events", cerr);
      res.sendStatus(500);
      return;
    }
    let query = `SELECT e.*, c.clubname
                  FROM events e
                  JOIN membership m ON e.clubid = m.clubid
                  JOIN club c ON e.clubid = c.clubid
                  WHERE m.userid = ?;`; // Replaced req.query.postid with 1

    connection.query(query, [req.session.user.userid],function (qerr, rows, fields) { // Removed [req.query.postid] parameter
      connection.release();
      if (qerr) {
        console.log("qerr for GET /members-events", qerr);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// get members posts from database
app.get('/members-feeds', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("cerr for GET /members-feeds", cerr);
      res.sendStatus(500);
      return;
    }
    let query = `SELECT p.*, c.clubname
                  FROM post p
                  JOIN membership m ON p.clubid = m.clubid
                  JOIN club c ON p.clubid = c.clubid
                  WHERE m.userid = ?;`; // Replaced req.query.postid with 1

    connection.query(query, [req.session.user.userid], function (qerr, rows, fields) { // Removed [req.query.postid] parameter
      connection.release();
      if (qerr) {
        console.log("qerr for GET /members-feeds", qerr);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// ----------------------- NATHAN'S ROUTES ----------------------//
// some duplicates ... will clean this up

// get the userid of the current session
app.get('/get-userid', function (req, res) {
  var { userid } = req.session.user;
  res.json({ userid: userid });
});

// Route to check if current_userid has adminclearance
app.get('/admin-check', function (req, res) {
  var { userid } = req.session.user;

  // check adminclearance with session's userid
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("CError checking adminclearance:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `SELECT adminclearance FROM Users WHERE userid = ?`;

    connection.query(query, [userid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("QError checking adminclearance:", qerr);
        res.sendStatus(500);
        return;
      }

      // if user has adminclearance send true, else false
      if (rows.length > 0 && rows[0].adminclearance === 'yes') {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  });
});


// return list of user in alphabetical order: firstname, lastname, email, role
// need client to send clubid
app.get('/clubmembers', function (req, res, next) {
  console.log("Trying to access club members");

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error establishing database connection:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `SELECT firstname, lastname, email, memberrole AS role FROM membership
                 JOIN Users ON membership.userid = Users.userid
                 WHERE membership.clubid = ?
                 ORDER BY firstname, lastname;`;

    // changed from req.body
    connection.query(query, [req.query.clubid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /clubmembers");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// admin client receives firstname, lastname, email,
// adminclearance from all registered users in alphabetical order
app.get('/siteusers', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error establishing database connection:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `SELECT firstname, lastname, email, adminclearance FROM Users ORDER BY firstname, lastname;`;

    connection.query(query, [req.body], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("qerr for get /siteusers");
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// users deleted by admins in the manage-users.html page will be reflected in the database
app.post("/deleteuser", function (req, res) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error establishing database connection:", cerr);
      res.sendStatus(500);
      return;
    }

    var query = "DELETE FROM Users WHERE email = ?";
    connection.query(query, [req.body.email], function (derr, result) {
      connection.release();
      if (derr) {
        console.error("Error deleting user:", derr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// user information changed by admins in manage-users.html will be reflected in the database
app.post("/updateuser", function (req, res) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error establishing database connection:", cerr);
      res.sendStatus(500);
      return;
    }

    var query = "UPDATE Users SET firstname = ?, lastname = ?, email = ? WHERE email = ?";
    // eslint-disable-next-line max-len
    connection.query(query, [req.body.newFirstName, req.body.newLastName, req.body.newEmail, req.body.email], function (qerr, result) {
      connection.release();
      if (qerr) {
        console.error("Error updating user details:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});


// apply to be a club member
// client send clubid
app.post('/membershipapplication', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error membershipapplication:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `INSERT INTO membership (userid, clubid) VALUES(?, ?)`;

    // insert user input into queries
    // eslint-disable-next-line max-len
    connection.query(query, [req.session.user.userid, req.query.clubid], function (qerr, rows, fields) {
      connection.release();

      if (qerr) {
        console.error("Error membershipapplication:", qerr);
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});


// join us button saves to 'joined' after refresh
// check if the user is a member of the club they are viewing
app.get('/checkmembership', function (req, res, next) {
  var query = `SELECT * FROM membership WHERE userid = ? AND clubid = ?`;

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error checking membership status:", cerr);
      res.sendStatus(500);
      return;
    }

    // eslint-disable-next-line max-len
    connection.query(query, [req.session.user.userid, req.query.clubid], function (qerr, rows, fields) {
      connection.release();

      if (qerr) {
        console.error("Error checking membership status:", qerr);
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        console.log("JOINED");
        res.json("JOINED");
      } else {
        console.log("NOT_JOINED");
        res.json("NOT_JOINED");
      }
    });
  });
});

// display a club
// client send clubid
// client receives clubname, clubdescription for public posts
app.get('/thisclub', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("Error getting club information:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `SELECT clubname, clubdescription FROM club WHERE clubid = ?;`;
    connection.query(query, [req.query.clubid], function (qerr, rows, fields) {
      console.log("Clubid:", req.query.clubid);
      connection.release();
      if (qerr) {
        console.log("Error getting club information:", qerr);
        res.sendStatus(500);
        return;
      }
      res.json(rows[0]);
    });
  });
});


// system admin edit the clubname and description
app.post('/editclub', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error editing club info:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE club SET clubname = ?, clubdescription = ? WHERE clubid = ?;`;

    // insert user input into queries
    connection.query(query, [req.body.clubname, req.body.clubdescription, req.body.clubid], function (qerr, rows, fields) {
      connection.release();

      if (qerr) {
        console.error("Error editing club info:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// system admin delete a club from the database
app.delete('/deleteclub/:clubid', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error deleting club:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `DELETE FROM club WHERE clubid = ?;`;

    connection.query(query, [req.params.clubid], function (qerr, result) {
      connection.release();

      if (qerr) {
        console.error("Error deleting club:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// system admin upgrade another user to admin status
app.post('/giveAdminStatus', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error upgrading user:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE Users SET adminclearance = 'yes' WHERE email = ?;`;

    // insert user input into queries
    connection.query(query, [req.body.email], function (qerr, rows, fields) {
      console.log(req.body.email);
      connection.release();

      if (qerr) {
        console.error("Error upgrading user:", qerr);
        res.sendStatus(500);
        return;
      }
      console.log("Rows affected:", rows.affectedRows); // Check the number of affected rows
      res.sendStatus(200);
    });
  });
});


// Club manager/system admin kick member from a club
app.post('/kickMember', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error kicking user:", cerr);
      res.sendStatus(500);
      return;
    }

    // get the userid from the users table with the name
    var userIdQuery = `SELECT userid FROM Users WHERE firstname = ? AND lastname = ?;`;
    // eslint-disable-next-line max-len
    req.pool.query(userIdQuery, [req.body.firstname, req.body.lastname], function (qerr, rows, result) {
      if (qerr) {
        console.error("Error getting userid:", qerr);
        res.sendStatus(500);
        return;
      }

      var userId = rows[0].userid;

      // delete the entry in the membership table according to clubid and userid
      var deleteQuery = `DELETE FROM membership WHERE clubid = ? AND userid = ?;`;
      req.pool.query(deleteQuery, [req.body.clubId, userId], function (derr) {
        connection.release();

        if (derr) {
          console.error("Error deleting member from membership table:", derr);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});

// Club manager/System admin: function to promote a member to a manager role
app.post('/giveManager', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.error("Error promoting member:", cerr);
      res.sendStatus(500);
      return;
    }

    // get the userid from the users table with the name
    var userIdQuery = `SELECT userid FROM Users WHERE firstname = ? AND lastname = ?;`;
    // eslint-disable-next-line max-len
    req.pool.query(userIdQuery, [req.body.firstname, req.body.lastname], function (qerr, rows, result) {
      if (qerr) {
        console.error("Error getting userid:", qerr);
        res.sendStatus(500);
        return;
      }

      var userId = rows[0].userid;

      // delete the entry in the membership table according to clubid and userid
      var deleteQuery = `UPDATE membership SET memberrole = 'manager' WHERE clubid = ? AND userid = ?;`;
      req.pool.query(deleteQuery, [req.body.clubId, userId], function (uerr) {
        connection.release();

        if (uerr) {
          console.error("Error promoting member in membership table:", uerr);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});



// System admin: create a new club
// client sends clubname, clubdescription
app.post('/create-club', function (req, res, next) {
  // res.render('index', { title: 'Create club page' });

  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("CError creating new club:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `INSERT INTO club (clubname, clubdescription) VALUES(?, ?)`;
    // insert user input into queries
    // eslint-disable-next-line max-len
    connection.query(query, [req.body.clubname, req.body.clubdescription], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("QError creating new club:", qerr);
        res.sendStatus(500);
        return;
      }

      // Generate the HTML content for the club page
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <title>${req.body.clubname}</title>
        <link rel="stylesheet" href="stylesheets/standard-club-visitor-DARK.css">
        <script src="https://kit.fontawesome.com/186d59e9ab.js" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script>
        var globalUserId;

        // function to get the user id of the current session
        function getUserId(){
          var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var response = JSON.parse(this.responseText);
                        globalUserId = response.userid;

                        console.log("Current userid:", globalUserId);
                    } else {
                        console.log("Error getting userid: " + this.status);
                    }
                }
            };

            xhttp.open("GET", '/get-userid', true);
            xhttp.send();
        }
        getUserId();

        var isAdmin;

        // admin check
        function adminCheck() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        isAdmin = JSON.parse(this.responseText);

                        // // testing w/o the details of the current session
                        isAdmin = true;


                        if (isAdmin === true) {
                            console.log("The current user is an admin");
                            document.getElementById("adminElements").style.display = "block";
                        } else {
                            console.log("The current user is NOT an admin");
                            document.getElementById("adminElements").style.display = "none";
                        }
                    } else {
                        console.log("Error checking admin status: " + this.status);
                    }
                }
            };
            xhttp.open("GET", "/admin-check", true);
            xhttp.send();
        }

        adminCheck();
        </script>
      </head>

      <body>
        <header>
          <!---Tab with links to connecting pages-->
          <nav class="nav-tab">
            <ul>
              <li><a href="home.html">HOME</a></li>
              <li><a href="about.html" onclick>ABOUT</a></li>
              <li><a class="selected-page" href="find-clubs.html">CLUBS</a></li>
              <li><a href="club-feed.html">YOUR CLUBS</a></li>
              <li><a href="profile.html">PROFILE</a></li>
            </ul>
          </nav>
        </header>
        <br>
        <br>
        <div class="club-container">
          <img
            src="https://youx.org.au/asset/Organisation/8456/chess%20club.jpg?thumbnail_width=375&thumbnail_height=375&resize_type=CropToFit"
            alt="Chessclublogo">
          <h1 id="clubTitle">${req.body.clubname}</h1>
        </div>

        <div id="information">
          <div id="adminElements" class="admin-actions">
            <!-- <button type="button" class="edit-button" onclick="editToggle('clubTitle')"> -->
            <button type="button" class="edit-button" onclick="editInfo()">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="delete-button" onclick="deleteClub()">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
          <h3>About us</h3>
          <p id="clubDescription">${req.body.clubdescription}</p>
          <br>
        </div>
        <div class="actions">
          <button type="button" id="joinButton" class="join-button" onclick="joinClub(1)">Join Us!</button>
          <button type="button" class="contact-button" onclick="location.href='contact-us.html'">Contact Club</button>
          <button type="button" id="notification-button" class="notification-button" onclick="enableEmails()">Enable
            Emails</button>
        </div>

        <!-- Latest Updates -->
        <br>
        <h3 id="updates-title">Latest Updates</h3>

        <!---Require this whole div for display update to work-->
        <div class="updates-container">
          <div class="update">
            <h4 id="post-title">Title</h4>
            <p class="timestamp">Posted on <span id="timestamp"></span></p>
            <p class="Post-content">...</p>
            <hr>
          </div>
        </div>
        <!--------------------------------------------------------->

        <!---Require this whole div for display event to work-->
        <h3 id="events-title">Upcoming events</h3>
        <div class="events-container">
          <div class="event">
            <h4 id="event-name">Event Title 1</h4>
            <p class="eventtime">Time and date: <span id="time"></span>, <span id="date"></span></p>
            <p class="location">Location: <span id="eventlocation"></span></p>
            <p class="Event-detail">Event information goes here...</p>
            <hr>
          </div>
        </div>

        <div class="members">
          <h3 id="members-title">List of club members</h3>
          <ul id="memberList"></ul>
        </div>

        <script>


        var globalClubId;





          // Function to update events and display in container
          function displayEvents(events) {
            var container = $('.events-container');
            container.empty(); // Clear existing events

            var latestevents = events.slice(-6);
          latestevents.reverse();
          //format time
          function formatDate(date) {
             return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
          }

            latestevents.forEach(function(event) {
              var eventElement = $('<div class="event"></div>'); // Create event div
              eventElement.append('<h4 id="event-name">' + event.EventName + '</h4>'); // Update event name
              eventElement.append('<p class="eventtime">Time and date: <span id="time">' + event.EventTime + '</span>, <span id="date">' + formatDate(event.EventDate) + '</span></p>');
              eventElement.append('<p class="location">Location: <span id="eventlocation">' + event.EventLocation + '</span></p>'); // Update location
              eventElement.append('<p class="Event-detail">' + event.Content + '</p>'); // Update event detail
              eventElement.append('<hr>');
              container.append(eventElement);
            });
          }

        // Function to update events and display in container
        function displayEvents(events) {
            var container = $('.events-container');
            container.empty(); // Clear existing events

            var latestevents = events.slice(-6);
          latestevents.reverse();
          //format time
          function formatDate(date) {
             return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
          }

            latestevents.forEach(function(event) {
              var eventElement = $('<div class="event"></div>'); // Create event div
              eventElement.append('<h4 id="event-name">' + event.EventName + '</h4>'); // Update event name
              eventElement.append('<p class="eventtime">Time and date: <span id="time">' + event.EventTime + '</span>, <span id="date">' + formatDate(event.EventDate) + '</span></p>');
              eventElement.append('<p class="location">Location: <span id="eventlocation">' + event.EventLocation + '</span></p>'); // Update location
              eventElement.append('<p class="Event-detail">' + event.Content + '</p>'); // Update event detail
              eventElement.append('<hr>');
              container.append(eventElement);
            });
          }

        // managerCheck();

        $(document).ready(function () {
      //using ajax and
      function GETPosts(clubid) {
        $.ajax({
          url: "/posts?clubid=" + clubid,
          type: 'GET',
          success: function (response) {
            console.log('Posts retrieved successfully');
            displayPosts(response);
          },
          error: function (xhr, status, error) {
            console.log('Error retrieving posts:', error);
          }
        });
      }

      //FUNCTION TO UPDATE POSTS AND DISPLAY IN CONTAINER
      function displayPosts(posts) {
        var container = $('.updates-container');
        container.empty(); // Clear existing posts

        //get latest 4 posts
        var latestposts = posts.slice(-6);
        latestposts.reverse();

        latestposts.forEach(function (post) {
          var updateElement = $('<div class="update"></div>'); //for each update div
          updateElement.append('<h4 id="post-title">' + post.posttitle + '</h4>'); //Update post title
          updateElement.append('<p class="timestamp">Posted on <span id="timestamp">' +
            new Date(post.dateandtime).toLocaleString() +
            '</span></p>'); //Update timestamp
          updateElement.append('<p class="Post-content">' + post.content + '</p>'); //Update post content
          updateElement.append('<hr>');
          container.append(updateElement);
        });
      }

      // get the club id
    function getClubId() {
      var clubName = document.getElementById("clubTitle").innerText;

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            var response = JSON.parse(this.responseText);
            globalClubId = response.clubid;
            console.log("INSIDE GETCLUB:", globalClubId);
            GETPosts(globalClubId);

            // call functions that need club id
            getClubDetails();
            getMembers();
            // managerCheck(globalClubId);
            checkMembership();
          } else {
            console.log("Error getting clubid: " + this.status);
          }
        }
      };
      var url = "/get-clubid?clubname=" + clubName;
      xhttp.open("GET", url, true);
      xhttp.send();
    }
    getClubId();
    });

    $(document).ready(function() {
      // Using AJAX to retrieve events
      function getEvents(clubid) {
        $.ajax({
          url: '/events?clubid=' + clubid,
          type: 'GET',
          success: function(response) {
            console.log('Events retrieved successfully');
            displayEvents(response);
          },
          error: function(xhr, status, error) {
            console.log('Error retrieving events:', error);
          }
        });
      }

      // Function to update events and display in container
      function displayEvents(events) {
        var container = $('.events-container');
        container.empty(); // Clear existing events

        var latestevents = events.slice(-6);
      latestevents.reverse();
      //format time
      function formatDate(date) {
         return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      }

        latestevents.forEach(function(event) {
          var eventElement = $('<div class="event"></div>'); // Create event div
          eventElement.append('<h4 id="event-name">' + event.EventName + '</h4>'); // Update event name
          eventElement.append('<p class="eventtime">Time and date: <span id="time">' + event.EventTime + '</span>, <span id="date">' + formatDate(event.EventDate) + '</span></p>');
          eventElement.append('<p class="location">Location: <span id="eventlocation">' + event.EventLocation + '</span></p>'); // Update location
          eventElement.append('<p class="Event-detail">' + event.Content + '</p>'); // Update event detail
          eventElement.append('<hr>');
          container.append(eventElement);
        });
      }

       // get the club id
    function getClubId() {
      var clubName = document.getElementById("clubTitle").innerText;

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            var response = JSON.parse(this.responseText);
            globalClubId = response.clubid;
            console.log("INSIDE EVENTS GETCLUB:", globalClubId);
            getEvents(globalClubId);
          } else {
            console.log("Error getting clubid: " + this.status);
          }
        }
      };
      var url = "/get-clubid?clubname=" + clubName;
      xhttp.open("GET", url, true);
      xhttp.send();
    }
    getClubId();

    });
          var clubTitle = "";
          var clubDescription = "";

          // function to get the data of the club's info (name, description)
          function getClubDetails() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                    var response = JSON.parse(this.responseText);
                    clubTitle = response.clubname;
                    clubDescription = response.clubdescription;
                    updateDetails(); // call function to display the details on the page
                } else {
                  console.log("Error fetching club data: " + this.status);
                }
              }
            };
            var clubId = globalClubId;
            var url = "/thisclub?clubid=" + clubId;
            xhttp.open("GET", url, true);
            xhttp.send();
          }

          // function to update club name and description
          function updateDetails() {
            var newTitle = document.getElementById("clubTitle");
            var newDescription = document.getElementById("clubDescription");

            newTitle.textContent = clubTitle;
            newDescription.textContent = clubDescription;
          }

          // function to edit info locally
          function editInfo() {
            var titleElement = document.getElementById("clubTitle");
            var descriptionElement = document.getElementById("clubDescription");

            // make the elements editable
            descriptionElement.contentEditable = true;

            // add editable class
            descriptionElement.classList.add("editable");
            titleElement.focus();

            // remove editable highlight once the changes are saved
            descriptionElement.addEventListener('blur', function() {
              descriptionElement.contentEditable = false;
              descriptionElement.classList.remove("editable");
            });

            // event listeners to handle saving changes
            titleElement.addEventListener("blur", function () {
              saveChanges();
            });
            descriptionElement.addEventListener("blur", function () {
              saveChanges();
            });
          }

          // send the edited information to the database
          function saveChanges() {
            var titleElement = document.getElementById("clubTitle");
            var descriptionElement = document.getElementById("clubDescription");
            var clubname = titleElement.textContent;
            var clubdescription = descriptionElement.textContent;
            var clubid = globalClubId;

            // struct to hold the new data
            var data = {
              clubname: clubname,
              clubdescription: clubdescription,
              clubid: clubid
            };

            // send the data to the database using AJAX
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  console.log("Club information updated successfully");
                } else {
                  console.error("Error updating club information: " + this.status);
                }
              }
            };

            xhttp.open("POST", "/editclub", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
          }

          // function to edit info of club (name, description)
          function editClubInfo() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  console.log("Edited Club Info!");
                  editInfo();
                  updateDetails(); // call function to display the details on the page
                } else {
                  console.log("Error editing club info: " + this.status);
                }
              }
            };

            var clubId = globalClubId;
            var url = "/editclub?clubid=" + clubId;
            xhttp.open("POST", url, true);
            xhttp.send();
          }


          // function to get data of club members with AJAX
          function getMembers() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  var members = JSON.parse(this.responseText);
                  generateMemberList(members);
                } else {
                  console.log("Error fetching member data: " + this.status);
                }
              }
            };

            var clubId = globalClubId;
            var url = "/clubmembers?clubid=" + clubId;
            xhttp.open("GET", url, true);
            xhttp.send();
          }

          // function to generate the list of members
          function generateMemberList(members) {
            var listContainer = document.getElementById("memberList");
            listContainer.innerHTML = ""; // Clear existing list

            members.forEach(function (member) {
              var fullName = member.firstname + " " + member.lastname;
              var item = document.createElement("li");

              // manager tag
              if (member.memberrole === 'manager') {
                fullName += " (manager)";
              }

              item.textContent = fullName;

              // promote to manager button
              var promoteButton = document.createElement("button");
              promoteButton.classList.add("promote-button");
              promoteButton.textContent = "Promote";
              promoteButton.addEventListener("click", function () {
                giveManager(member.firstname, member.lastname);
              });

              // kick button
              var kickButton = document.createElement("button");
              kickButton.classList.add("kick-button");
              kickButton.textContent = "Kick";
              kickButton.addEventListener("click", function () {
                kickMember(member.firstname, member.lastname);
              });

              item.appendChild(promoteButton);
              item.appendChild(kickButton);
              listContainer.appendChild(item);
            });
          }

          // Club manager/System admin: function to kick a member from members list
          function kickMember(firstname, lastname) {
            var clubId = globalClubId;
            var data = {
              clubId: clubId,
              firstname: firstname,
              lastname: lastname
            };

            // send the data (clubid and name of member) using AJAX
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  console.log("Member kicked successfully");
                  // update members list
                  getMembers();
                } else {
                  console.error("Error kicking member: " + this.status);
                }
              }
            };

            xhttp.open("POST", "/kickMember", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
          }

          // Club manager/System admin: function to promote a member to a manager role
          function giveManager(firstname, lastname) {
            var clubId = globalClubId;
            var data = {
              clubId: clubId,
              firstname: firstname,
              lastname: lastname
            };

            // send the data (clubid and name of member) using AJAX
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  console.log("Promoted to manager successfully");
                  // update members list
                  getMembers();
                } else {
                  console.error("Error promoting member: " + this.status);
                }
              }
            };

            xhttp.open("POST", "/giveManager", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
          }

          getMembers();


          // function to join the club with AJAX
          function joinClub(clubid) {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  if(globalUserId === 0){
                    console.log("User is not logged in");
                    window.location.href = "/log-in.html";
                  }else{
                    console.log("Joined club successfully!");
                    getMembers();
                    joinedButton();
                  }
                } else {
                  console.log("Error joining club: " + this.status);
                }
              }
            };

            var clubId = globalClubId;
            var url = "/membershipapplication?clubid=" + clubId;
            xhttp.open("POST", url, true);
            xhttp.send();
          }

          function joinedButton() {
            var newButton = document.getElementById("joinButton");
            newButton.textContent = "Joined";
          }


          // function to check the membership status and update the button text
          function checkMembership() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  var membershipStatus = JSON.parse(this.responseText);
                  if (membershipStatus === "JOINED") {
                    joinedButton();
                  }
                } else {
                  console.log("Error checking membership status: " + this.status);
                }
              }
            };

            var clubId = globalClubId;
            var url = "/checkmembership?clubid=" + clubId;
            xhttp.open("GET", url, true);
            xhttp.send();
          }

          // function to opt into email notifications for the club
          function enableEmails() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState === 4) {
                if (this.status === 200) {
                  console.log("User opted in for email notifications");
                } else {
                  console.log("Error opting in for email notifications: " + this.status);
                }
              }
            };
            var clubId = globalClubId;
            var url = "/enable-emails?clubid=" + clubId;
            xhttp.open("GET", url, true);
            xhttp.send();
          }

          // function for system admins to delete club from database
          function deleteClub() {
            var clubId = globalClubId;

            // confirmation
            var confirmation = confirm("WARNING: Deletion of club is irreversible!");

            if (confirmation) {
              var xhttp = new XMLHttpRequest();
              xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    console.log("Club deleted");
                    // redirect to club list page
                    window.location.href = "/find-clubs.html";
                  } else {
                    console.error("Error deleting club: " + this.status);
                  }
                }
              };

              var url = "/deleteclub/" + clubId;
              xhttp.open("DELETE", url, true);
              xhttp.send();
            }
          }

        </script>

        <br><br><br>
  <!---Footer -->
  <footer>

    <div class="address">
      <div id="north">
        <p class="campus">North Terrace Campus</p>
        <p>Level 4 Hub Central, University of Adelaide</p>
        <p>08 8313 5401</p>
      </div>

      <div id="waite">
        <p class="campus">Waite Campus</p>
        <p>The Hub, McLeod Building</p>
        <p>08 8313 5401</p>
      </div>

      <div id="roseworthy">
        <p class="campus">Roseworthy Campus</p>
        <p>Room GO1, College Hall</p>
        <p>08 8313 5401</p>
      </div>
    </div>

    <div class="footer-links">
      <a href="/contact-us">Contact Us</a>
      <a href="/terms-conditions">Terms and Conditions</a>
    </div>
    <div class="social-links">
      <a href="https://www.facebook.com/uniofadelaide/"><i class="fab fa-facebook-f"></i></a>
      <a href="https://twitter.com/UniofAdelaide?s=20"><i class="fab fa-twitter"></i></a>
    </div>


  </footer>
      </body>



      </html>
`;

      // Generate the file path and name
      const filename = req.body.clubname.toLowerCase().replace(/ /g, '-') + '-club';
      const filePath = `public/${filename}.html`;

      // Write the HTML content to the file
      fs.writeFile(filePath, htmlContent, function (err) {
        if (err) {
          console.log("Error creating club HTML file:", err);
          res.sendStatus(500);
          return;
        }

        console.log(`Club HTML file "${req.body.clubname}.html" created successfully.`);

        res.sendStatus(200);
      });
    });

  });
});


// get the club id of the current page with the clubname
app.get('/get-clubid', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("CError retrieving clubid:", cerr);
      res.sendStatus(500);
      return;
    }

    const query = `SELECT clubid FROM club WHERE clubname = ?`;
    connection.query(query, [req.query.clubname], function (qerr, rows, fields) {
      console.log("Clubname:", req.query.clubname);
      connection.release();
      if (qerr) {
        console.log("QError retrieving clubid:", qerr);
        res.sendStatus(500);
        return;
      }

      if (rows.length === 0) {
        res.sendStatus(404); // Club not found
        return;
      }

      const { clubid } = rows[0];
      console.log("CLUBID:", clubid);
      res.json({ clubid: clubid });
    });
  });
});

// Get EventID
// get the club id of the current page with the clubname
app.get('/get-eventid', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("CError retrieving event:", cerr);
      res.sendStatus(500);
      return;
    }

    const query = `SELECT EventId FROM events WHERE EventName = ?`;
    connection.query(query, [req.query.EventName], function (qerr, rows, fields) {
      console.log("Event Name:", req.query.EventName);
      connection.release();
      if (qerr) {
        console.log("QError retrieving eventid:", qerr);
        res.sendStatus(500);
        return;
      }

      if (rows.length === 0) {
        res.sendStatus(404); // Club not found
        return;
      }

      const { EventId } = rows[0];
      console.log("EVENT ID:", EventId);
      res.json({ EventId: EventId });
    });
  });
});

// All users: change email
app.post('/change-email', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("Error changing email:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE Users set email = ? WHERE userid = ?`;
    // insert user input into queries
    // eslint-disable-next-line max-len
    connection.query(query, [req.body.email, req.session.user.userid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("Error changing email:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});


// All users: change password
app.post('/change-password', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("Error changing password:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE Users set pass = ? WHERE userid = ?`;
    // insert user input into queries
    // eslint-disable-next-line max-len
    connection.query(query, [req.body.pass, req.session.user.userid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("Error changing pass:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// All users: change name
app.post('/change-name', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("Error changing name:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE Users set firstname = ?, lastname = ? WHERE userid = ?`;
    // insert user input into queries
    // eslint-disable-next-line max-len
    connection.query(query, [req.body.firstname, req.body.lastname, req.session.user.userid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("Error changing pass:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});


// enable emails notifications for a club
app.post('/enable-emails', function (req, res, next) {
  // get body from req; req is a json array extracted from a form
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log("Error opting into email notifications:", cerr);
      res.sendStatus(500);
      return;
    }

    let query = `UPDATE membership set subscribe = 1 WHERE clubid = ? AND userid = ?`;
    // eslint-disable-next-line max-len
    connection.query(query, [req.body.clubId, req.session.user.userid], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log("Error opting into email notifications:", qerr);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;