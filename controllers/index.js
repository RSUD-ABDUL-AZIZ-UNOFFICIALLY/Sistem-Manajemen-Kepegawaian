module.exports ={
    login: (req, res) => {
        let data = {
            title: "login | LKP"
        }
        res.render('login', data)
    },
}