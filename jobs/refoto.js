const { User, Profile } = require("../models");

async function getProfile() {
    let user = await Profile.findAll();
    console.log(user.length);
    for (let i of user) {
        console.log(i.url)
        let x = i.url;
        let newX = x.replace("s100", "s1000");
        console.log(newX);    
     let up =   await Profile.update({
            url: newX
        }, {
            where: {
                id: i.id,
                nik: i.nik
            }
        })
        console.log(up)
  
    }
  
}
// getProfile();
async function replaceURL(oldURL, newURL) {
    let user = await Profile.findAll();
    console.log(user.length);
    for (let i of user) {
        console.log(i.url)
        let x = i.url;
        let newX = x.replace(oldURL, newURL);
        console.log(newX);
        let up = await Profile.update({
            url: newX
        }, {
            where: {
                id: i.id,
                nik: i.nik
            }
        })
        console.log(up)

    }
}
replaceURL("https://api.rsudaa.singkawangkota.go.id", "https://api.spairum.my.id");