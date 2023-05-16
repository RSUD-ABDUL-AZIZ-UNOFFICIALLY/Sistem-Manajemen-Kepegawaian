const express = require("express");
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable");

const app = express();
const port = 3000;

app.get("/pdf", (req, res) => {
  // const doc = new jsPDF();
  // doc.text("Hello world!", 10, 10);
  // doc.save("a4.pdf"); // will save the file in the current working directory

  // const jsPDF = require('jspdf')

  const doc = new jsPDF({
    orientation: "portrait",
    format: "a4",
  });

  // PDF building code goes here, e.g.
  doc.text(
    "LAPORAN PRODUKTIVITAS KERJA PEGAWAI   ",
    105,
    10,
    null,
    null,
    "center"
  );
  // buat seperti di bawah ini
  // NAMA		: EKO SUDARMONO, S.A.P.
  // NIP		: 198310092007011007
  // JABATAN (KELAS JABATAN)		: Analis Kepegawaian Ahli Pertama (8)
  // UNIT KERJA		: Bagian Umum dan Kepegawaian
  // PERIODE		: Mei 2023
  // CAPAIAN		: 100%
  // KATEGORI		: Sangat Baik
  // TPP		: Rp. 1.000.000,00
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  // doc.text("LAPORAN PRODUKTIVITAS KERJA PEGAWAI   ", 105, 10, null, null, "center");
  doc.text("NAMA", 10, 20);
  doc.text(":", 50, 20);
  doc.text("EKO SUDARMONO, S.A.P.", 55, 20);
  doc.text("NIP", 10, 25);
  doc.text(":", 50, 25);
  doc.text("198310092007011007", 55, 25);
  doc.text("JABATAN", 10, 30);
  doc.text(":", 50, 30);
  doc.text("Analis Kepegawaian Ahli Pertama (8)", 55, 30);
  doc.text("UNIT KERJA", 10, 35);
  doc.text(":", 50, 35);
  doc.text("Bagian Umum dan Kepegawaian", 55, 35);

  // Define table columns and rows
  const columns = [
    "NO",
    "HARI / TANGGAL",
    "RINCIAN AKTIVITAS KERJA/TUGAS",
    "VOLUME KEGIATAN",
    "SATUAN KEGIATAN",
    "WAKTU PENGERJAAN",
  ];
  const rows = [
    [1, "Minggu / 2023-05-12", "Libur", "0", "-", "0"],
    [2, "Senin / 2023-05-13", "Libur", "0", "-", "0"],
    [3, "Selasa / 2023-05-14", "Libur", "0", "-", "0"],
    [4, "Rabu / 2023-05-15", "Libur", "0", "-", "0"],
    [5, "Kamis / 2023-05-16", "Libur", "0", "-", "0"],
    [6, "Jumat / 2023-05-17", "Libur", "0", "-", "0"],
['Capaian Kinerja Bulan September 2022' ,'0', 'menit'],
['Kategori', '0'],
['Besaran TPP dari Produktivitas Kerja', '0%'],

  ];

  // Add table to the PDF
//   doc.autoTable({
//     head: [columns],
//     body: rows,
//     startY: 40,
//     theme: "grid",
//     styles: {
//       fontSize: 8,
//       cellPadding: 1,
//       overflow: "linebreak",
//       halign: "left",
//       valign: "middle",
//       columnWidth: "auto",
//       lineWidth: 0.1,
//     },
//     columnStyles: {
//       0: { columnWidth: 10 },
//       1: { columnWidth: 40 },
//       2: { columnWidth: 65 },
//       3: { columnWidth: 20 },
//       4: { columnWidth: 20 },
//       5: { columnWidth: 30 },
//     },
//     margin: { top: 10, right: 10, bottom: 10, left: 10 },
//     tableWidth: "auto",
//     showHead: "everyPage",
//     tableLineColor: 200,
//     tableLineWidth: 0,
//     addPageContent: function (data) {
//       // ukuran font 11 pt bold high 15pt
//       doc.setFontSize(11);
//       doc.setFont("helvetica", "bold");
//       // doc.text("LAPORAN PRODUKTIVITAS KERJA PEGAWAI   ", 105, 10, null, null, "center");
//       doc.text("NAMA", 10, 20);
//       doc.text(":", 50, 20);
//       doc.text("EKO SUDARMONO, S.A.P.", 55, 20);
//       doc.text("NIP", 10, 25);
//       doc.text(":", 50, 25);
//       doc.text("198310092007011007", 55, 25);
//       doc.text("JABATAN", 10, 30);
//       doc.text(":", 50, 30);
//       doc.text("Analis Kepegawaian Ahli Pertama (8)", 55, 30);
//       doc.text("UNIT KERJA", 10, 35);
//       doc.text(":", 50, 35);
//       doc.text("Bagian Umum dan Kepegawaian", 55, 35);
//     },
//   });
  var generateData = function(amount) {
    var result = [];
    var data = {
    "NO": "1",
    "HARI / TANGGAL": "Minggu / 2023-05-12",
    "RINCIAN AKTIVITAS KERJA/TUGAS": "Libur",
    "VOLUME KEGIATAN": "0",
    "SATUAN KEGIATAN": "-",
    "WAKTU PENGERJAAN": "0",
    };
    for (var i = 0; i < amount; i += 1) {
      data.id = (i + 1).toString();
      result.push(Object.assign({}, data));
    }
    return result;
  };
  function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 65,
        align: "left",
        padding: 0
      });
    }
    return result;
  }
  var headers = createHeaders([
    "NO",
    "HARI / TANGGAL",
    "RINCIAN AKTIVITAS KERJA/TUGAS",
    "VOLUME KEGIATAN",
    "SATUAN KEGIATAN",
    "WAKTU PENGERJAAN",
  ]);
  doc.table(10, 40, generateData(3), headers,{ autoSize: true, fontSize: 8,});
//   doc.table(10, 40, columns, headers, { autoSize: true });

  const myPDF = doc.output();

  res
    .status(200)
    .set({ "content-type": "application/pdf; charset=utf-8" })
    .send(myPDF);

  // Export the PDF
  //   res.setHeader('Content-Disposition', 'attachment; filename="table.pdf"');
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.send(doc.output('arraybuffer'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
