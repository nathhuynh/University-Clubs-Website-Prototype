

// Dark mode toggle
function switchColourMode(styleSheet) { // eslint-disable-line no-unused-vars
    document.querySelector('link[rel="stylesheet"]').href = styleSheet;
}

// Slideshow Banner
const IMAGES = [
    { name: 'Motorsport Club', url: 'https://static.wixstatic.com/media/758312_679d447b97034aeb88e806ac97275c22~mv2.jpg/v1/fill/w_1895,h_1530,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/758312_679d447b97034aeb88e806ac97275c22~mv2.jpg' },
    { name: 'Soccer Club', url: 'https://cdn.revolutionise.com.au/gallery/fgaxqqqo1pqtneu4.jpg' },
    { name: 'Badminton Club', url: 'https://cdn.revolutionise.com.au/gallery/7bftj6jshqxtfcaw.jpg' },
    { name: 'Judo Club', url: 'https://www.aujudo.com/wp-content/uploads/2019/01/AUJC-Club-photo-2017.jpg' }
];

const vueinst = new Vue({
    el: '#imageSlideshow',
    data: {
        i_arr: IMAGES,
        index: 0
    },
    methods: {
        previousImage() {
            this.index = (this.index - 1 + this.i_arr.length) % this.i_arr.length;
        },

        nextImage() {
            this.index = (this.index + 1) % this.i_arr.length;
        }
    }
});

const vueadmin = new Vue({
    el: '#manageusers',
    data: {
        isadmin: false
    },
    mounted(){
        console.log("calling manager users");
        this.manageUsers(); // will execute at pageload
    },
    methods: {
        manageUsers() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if(req.readyState === 4 && req.status === 200){
                    console.log("admin? : ", req.responseText);
                    this.isadmin = req.responseText;
                    // if (req.responseText === 1) {
                    //     this.isadmin = true;
                    // }
                    // else {
                    //     this.isadmin = false;
                    // }
                }
            };
            req.open('GET','/users/admincheck');
            req.send();
        }
    }
});

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
