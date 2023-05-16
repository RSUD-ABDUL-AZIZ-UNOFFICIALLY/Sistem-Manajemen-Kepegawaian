const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Atasan } = require("../models");
const { Op } = require("sequelize");
const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');

module.exports = {
    person: (req, res) => {
    let data = {
      title: "login | LKP",
      data: [
        {id: 1, name: 'John', age: 30},
        {id: 2, name: 'Jane', age: 25},
        {id: 3, name: 'Bob', age: 40},
        {id: 4, name: 'Sarah', age: 35},
      ]
      
    };


    res.render("report/person", data);
    // const filePath = path.join(__dirname, '../views/report/person.ejs');

    // // render file HTML dengan data
    // ejs.renderFile(filePath, data , (err, html) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
  
    //   // konfigurasi untuk pembuatan PDF
    //   const options = {
    //     format: 'Letter',// allowed units: A3, A4, A5, Legal, Letter, Tabloid
    //     zoomFactor: 'fit',
    //     orientation: 'portrait', // portrait or landscape
    //     border: { 
    //       top: '0.5in', // allowed units: mm, cm, in, px
    //     //   right: '0.5in',
    //       bottom: '0.5in',
    //       left: '0.5in'
    //     },
    //     // header: {
    //     //   height: '20mm',
    //     //   contents: '<div style="text-align: center;">LAPORAN PRODUKTIVITAS KERJA PEGAWAI</div>'
    //     // },
    //     footer: {
    //       height: '20mm'
    //     }
    //   };
  
    //   // buat PDF dari HTML yang sudah dirender
    //   pdf.create(html, options).toStream((err, stream) => {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }
  
    //     // atur header untuk menampilkan attachment PDF
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
  
    //     // kirim respon berupa stream PDF
    //     stream.pipe(res);
    //   });
    // });
  },
};