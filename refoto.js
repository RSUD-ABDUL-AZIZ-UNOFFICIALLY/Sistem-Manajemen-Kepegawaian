const { User, Profile } = require("./models");

async function getProfile() {
    let user = await Profile.findAll();
    console.log(user.length);
    for (let i of user) {
        console.log(i.url)
        let x = i.url;
        let newX = x.replace("s100", "s1000");
        console.log(newX);    
        // if (startIndex !== -1) {
        //     // Menyusun ulang URL dengan nilai "s" yang berubah
        //     let updatedUrl = x.substring(0, startIndex + 2) + "1000";

        //     console.log(updatedUrl);
        // } else {
        //     console.log("Parameter 's' tidak ditemukan dalam URL.");
        // }
    }
    
    let x = "https://lh3.googleusercontent.com/cm/AOLgnvuUu8AcRIgeXPzrSXnRozB-rdZcp0Iw3bByggpySLnbLnAAV5XjwdvWKKImx-mY";
  
}
getProfile();