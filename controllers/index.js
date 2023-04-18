module.exports ={
    login: (req, res) => {
        let data = {
            title: "login | LKP"
        }
        res.render('login', data)
    },
    dashboard: (req, res) => {
        let data = {
            title: "Dasboard | LKP",
            page: "Dashboard",
            username: "Fakry"
        }
        res.render('dashboard', data)
    },
    daily: (req, res) => {
        let data = {
            title: "Dasboard | LKP",
            page: "Daily Progress",
            username: "Fakry"
        }
        res.render('daily', data)
    },
    monthly: (req, res) => {
        let data = {
            title: "Dasboard | LKP",
            page: "Monthly Progress",
            username: "Fakry"
        }
        res.render('monthly', data)
    },
    report: (req, res) => {
        let data = {
            title: "Dasboard | LKP",
            page: "Monthly Progress",
            username: "Fakry"
        }
        res.render('report', data)
    }
}