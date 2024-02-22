/* eslint-disable linebreak-style */
function login() {
    console.log("Call ajax login");

    let logindata = {
        email: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(req.readyState === 4 && req.status === 200){
            alert('Logged In successfully');
            window.location.href='home.html';
        } else if(req.readyState === 4 && req.status === 401){
            alert('Login FAILED');
        }
    };

    req.open('POST','/login');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(logindata));

  }

  function signup() {
    console.log('call ajax signup');

    let signupdata = {
        email: document.getElementById('Email').value,
        firstname: document.getElementById('FirstName').value,
        lastname: document.getElementById('LastName').value,
        password: document.getElementById('Password').value
    };

    if (document.getElementById('Password').value !== document.getElementById('confirmPass').value){
        alert("Passwords don't match");
        return;
    }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(req.readyState === 4 && req.status === 200){
            alert('Signed Up successfully');
            window.location.href = "log-in.html";
        } else if(req.readyState === 4 && req.status === 401){
            alert('Signed Up FAILED');
        }
    };

    req.open('POST','/signup');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(signupdata));

}