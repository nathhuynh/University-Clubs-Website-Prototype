

// Dark mode toggle
function switchColourMode(styleSheet) { // eslint-disable-line no-unused-vars
    document.querySelector('link[rel="stylesheet"]').href = styleSheet;
}

function logout() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(req.readyState === 4 && req.status === 200){
            alert('Logged Out');
            window.location.href='log-in.html';
        } else if(req.readyState === 4 && req.status === 403){
            alert('Not logged in');
        }
    };

    req.open('POST','/logout');
    req.send();

}