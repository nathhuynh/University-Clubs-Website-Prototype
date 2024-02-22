/* eslint-disable linebreak-style */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // res.render('index', { title: 'Title' });
  res.redirect('/home.html');
});


const CLIENT_ID = '971995295736-s7h51hv4qrlfl6nah23ltsl5dgdjon6q.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// Add Argon2 hashing + salting
const argon2 = require('argon2');

// LOAD THIS INTO HMTL PAGE
// <script src="https://accounts.google.com/gsi/client" async defer></script>

/*
// DYNAMIC/RESPOND TO CHANGE
<div id="g_id_onload"
     data-client_id="971995295736-s7h51hv4qrlfl6nah23ltsl5dgdjon6q.apps.googleusercontent.com"
     data-context="signin"
     data-ux_mode="popup"
     data-callback="do_google_login"
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="icon"
     data-shape="square"
     data-theme="outline"
     data-text="signin_with"
     data-size="large">
</div>


// ALTERNATIVELY, A REDIRECT-BASED APPORACH - CHOOSE THIS ONE!!!!!!!!!!!!
<div id="g_id_onload"
     data-client_id="971995295736-s7h51hv4qrlfl6nah23ltsl5dgdjon6q.apps.googleusercontent.com"
     data-context="signin"
     data-ux_mode="popup"
     data-login_uri="http://localhost:8080/google_login"
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="rectangular"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div>

*/

// LOAD THIS INTO AJAX PAGE (not necessary for redirect approach)
/*
function do_google_login(response){

    // Sends the login token provided by google to the server for verification using an AJAX request

    console.log(response);

    // Setup AJAX request
    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        // Handle response from our server
        if(req.readyState == 4 && req.status == 200){
            alert('Logged In with Google successfully');
        } else if(req.readyState == 4 && req.status == 401){
            alert('Login FAILED');
        }
    };

    // Open requst
    req.open('POST','/login');
    req.setRequestHeader('Content-Type','application/json');
    // Send the login token
    req.send(JSON.stringify(response));

}
*/

// get a whole list of users from table to exist in server!!!

// sign up
// client send email, firstname, lastname, password
// salt the password before storing it

router.post('/signup', function(req, res, next) {
  console.log('signup gets called');
  req.pool.getConnection(async function(cerr, connection) {
    if (cerr) {
      console.log('cerr signup');
      res.sendStatus(500);
      return;
    }

    // let query_checkuser = `SELECT * FROM Users WHERE email = ?;`;
    // connection.query(query_checkuser,[req.body.email], async function(qerr1, rows1, fields1) {
    //   // connection.release();
    //   if (rows1.length > 0){
    //     res.sendStatus(500);
    //     return;
    //   }

      const hash = await argon2.hash(req.body.password);
      let query_signup = `INSERT INTO Users (email, firstname, lastname, pass)
                    VALUES(?, ?, ?, ?);`;
      connection.query(query_signup, [req.body.email, req.body.firstname, req.body.lastname, hash],
        function(qerr, rows, fields) {
        connection.release();
        if (qerr) {
          console.log('qerr signup');
          res.sendStatus(401);
        }
        else {
          console.log('Successfully signed up');
        }
      });
      res.end();
    });
  });
// });


// need client to send JSON with email and password
// client receives info of the registered user
router.post('/login', function(req, res, next) {
  console.log("call login() in routers");
  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      console.log('cerr login:',cerr);
      res.sendStatus(500);
      return;
    }

    let query = `SELECT * FROM Users WHERE email = ?;`;

    connection.query(query, [req.body.email],async function(qerr, rows, fields) {
      connection.release();
      if (qerr) {
        console.log('qerr login');
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0){
        // There is a user with the provided username

        // Use the Argon2 verify method to see if the plaintext password
        // matches the Hash+Salt
        if (await argon2.verify(rows[0].pass, req.body.password)) {

          // The password has been verified as matching the Hash+Salt

          // Clear password field from user details before storing
          let [user_props] = rows;
          delete user_props.pass;

          // There is a user
          // store all user info except the password
          req.session.user = user_props;
          console.log('current user: ', req.session.user.userid);
          res.json(req.session.user);

        } else {

            // The user exists, but the password doesn't match
            console.log("wrong login password");
            res.sendStatus(401);

        }
      } else {

          // There is no user with this username
          console.log("login error: no such user exist");
          res.sendStatus(401);
      }
    });
  });
});

// EXAMPLE
/*
router.post('/login', async function(req,res,next){

  if ('client_id' in req.body && 'credential' in req.body){

    // GOOGLE
      const ticket = await client.verifyIdToken({
          idToken: req.body.credential,
          audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      //console.log(payload['sub']);
      // console.log(payload['email']);
      // If request specified a G Suite domain:
      // const domain = payload['hd'];

      req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
          return;
        }

        let query = "SELECT * FROM Users WHERE email = ?";

        connection.query(query, [payload['email']],function(qerr, rows, fields) {

          connection.release();

          if (qerr) {
            res.sendStatus(500);
            return;
          }

          // console.log(JSON.stringify(rows));

          if (rows.length > 0){
            // There is a user
            [req.session.user] = rows;

            res.json(req.session.user);

          } else {
            // No user
            res.sendStatus(401);
          }

        });

      });


  } else if ('username' in req.body && 'password' in req.body) {

    req.pool.getConnection(function(cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }

      let query = `SELECT * FROM Users WHERE email = ? AND pass = ?;`;

      connection.query(query, [req.body.username,req.body.password],function(qerr, rows, fields) {

        connection.release();

        if (qerr) {
          res.sendStatus(500);
          return;
        }

        // console.log(JSON.stringify(rows));

        if (rows.length > 0){
          // There is a user with the provided username

          // Use the Argon2 verify method to see if the plaintext password
          // matches the Hash+Salt
          if (await argon2.verify(rows[0].pass, req.body.password)) {

            // The password has been verified as matching the Hash+Salt

            // Clear password field from user details before storing
            let [user_props] = rows;
            delete user_props.pass;

            // There is a user
            // store all user info except the password
            req.session.user = user_props;

            res.json(req.session.user);

          } else {

              // The user exists, but the password doesn't match

              res.sendStatus(401);

          }
        } else {

            // There is no user with this username

            res.sendStatus(401);
        }

      });

    });

  } else {
    res.sendStatus(401);
  }

});
*/

router.post('/logout', function(req, res, next) {
  if ('user' in req.session){
    delete req.session.user;
    res.end();
    req.session.user.userid = 0;
  }
  else {
    res.sendStatus(403);
  }
});

// google login
router.post('/google_login', async function(req,res,next){

  const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  //console.log(payload['sub']);
  // console.log(payload['email']);
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  req.pool.getConnection(function(cerr, connection) {
    if (cerr) {
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM Users WHERE email = ?";

    connection.query(query, [payload['email']],function(qerr, rows, fields) {

      connection.release();

      if (qerr) {
        res.sendStatus(500);
        return;
      }

      // console.log(JSON.stringify(rows));

      if (rows.length > 0){
        // Clear password field from user details before storing
        let [user_props] = rows;
        delete user_props.pass;

        // There is a user
        req.session.user = user_props;

        res.redirect('/'); // better to redirect to profile


      } else {
        // No user
        res.sendStatus(401);
      }
    });
  });
});

module.exports = router;
