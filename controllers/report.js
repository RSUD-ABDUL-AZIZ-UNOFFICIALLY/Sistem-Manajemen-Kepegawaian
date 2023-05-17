const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Lpkp, Atasan } = require("../models");
const { Op } = require("sequelize");
const { convertdate } = require("../helper");

module.exports = {
  person: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let query = req.query;
    // convert date to month name and year
    let dateString = new Date(query.date).toLocaleString("en-us", {
      month: "long",
      year: "numeric",
    });
    try {
      let user = await User.findOne({
        where: {
          nik: decoded.id,
        },
        include: [
          {
            model: Departemen,
            as: "departemen",
          },
         
        ],
      });
      console.log(user);
      let progress = await Lpkp.findAll({
        where: {
          nik: decoded.id,
          tgl: {
            [Op.startsWith]: query.date,
          },
        },
        order: [["tgl", "ASC"]],
      });
      for (var i = 0; i < progress.length; i++) {
        var tanggalFormat = convertdate(progress[i].tgl);
        progress[i].tanggal = tanggalFormat;
        progress[i].no = i + 1;
      }
  
      let data = {
        title: "Laporan Produktivitas Kerja Pegawai",
        user: user,
        periode: dateString,
        progress: progress,
        data: [
          { id: 1, name: "John", age: 30 },
          { id: 2, name: "Jane", age: 25 },
          { id: 3, name: "Bob", age: 40 },
          { id: 4, name: "Sarah", age: 35 },
        ],
      };
      return  res.render("report/person", data);
    } catch (error) {
      return res.redirect("/profile");
    }
   
    
  },
};
