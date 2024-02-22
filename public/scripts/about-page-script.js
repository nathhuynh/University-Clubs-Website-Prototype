

// Dark mode toggle
function switchColourMode(styleSheet) { // eslint-disable-line no-unused-vars
    document.querySelector('link[rel="stylesheet"]').href = styleSheet;
}

function logout() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(req.readyState === 4 && req.status === 200){
            alert('Logged Out successfully');
            window.location.href='log-in.html';
        }
    };

    req.open('POST','/logout', true);
    req.send();
}