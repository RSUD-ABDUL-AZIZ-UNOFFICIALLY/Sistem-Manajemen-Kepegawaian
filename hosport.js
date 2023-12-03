const { User, Hotspot } = require("./models");

function getHotspot() {
    return Hotspot.findAll({
        attributes: ['user', 'password']
    })
}
async function setHotspot() {
    let pegawi = await User.findAll({
        attributes: ['nik', 'nama', 'dep'],
        where: {
            dep: '3'
        }
    })
    for (let i of pegawi) {
        console.log(i.nama)
        let nickname = generateNickname(i.nama)
        console.log(nickname)
    }

}
setHotspot()

const usedNicknames = new Set();

function generateNickname(fullName) {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map(part => part[0]);
    const nickname = initials.join('').toLowerCase();
    // return nickname;
    // Validasi agar tidak ada nickname yang sama
    if (usedNicknames.has(nickname)) {
        console.log('Nickname sudah digunakan. Membuat nickname baru...');
        return generateUniqueNickname(fullName);
    } else {
        usedNicknames.add(nickname);
        return nickname;
    }
}

function generateUniqueNickname(fullName) {
    const randomNumber = Math.floor(Math.random() * 100); // Menambahkan angka acak untuk membuatnya unik
    return generateNickname(fullName) + randomNumber;
}