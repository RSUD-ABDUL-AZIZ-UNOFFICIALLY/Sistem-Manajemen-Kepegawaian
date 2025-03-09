let getPatch = window.location.pathname;
let url = getPatch.split("/");
let page = url[2];
fetch('/api/pegawai/gologan/' + page)
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        //   $('#dataPegawi').DataTable({
        //   data: data.data,
        //   columns: [
        //     { title: "Column 1", data: "field1" },
        //     { title: "Column 2", data: "field2" },
        //     // Add more columns as needed
        //   ]
        // });
        //   let table = new Tabulator("#dataPegawi", {
        //       data: tabledata, //assign data to table
        //       autoColumns: true, //create columns from data field names
        //   });
        let table = new Tabulator("#tableDataPegawi", {
            data: data.data,
            columns: [
                { title: "NO", field: "no" },
                { title: "NIP", field: "nip", editor: "number" },
                { title: "Nama", field: "nama", editor: "input" },
                {
                    title: "Golongan", field: "pangkat",
                    editor: "list",
                    editorParams: {
                        values: ['IVe', 'IVd', 'IVc', 'IVb', 'IVa', 'IIId', 'IIIc', 'IIIb', 'IIIa', 'IId', 'IIc', 'IIb', 'IIa', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', '-']
                    }
                },
                { title: "TMT Pangkat", field: "tmt_pangkat", editor: "date" },
                { title: "Jabatan", field: "jab", editor: "input" },
                { title: "TMT Jabatan", field: "tmt_kerja", editor: "date" },
                { title: "Bidang", field: "bidang" },
                {
                    title: "ACTION",
                    field: "action",
                    formatter: function (cell, formatterParams, onRendered) {
                        // Create an edit button
                        //   return `<button class="btn btn-primary btn-sm" onclick="editRecord('${cell.getRow().getData().nik},${cell.getRow()}')">Edit</button>`;
                        return `<button class="edit-btn">Edit</button>`;
                    },
                    cellClick: function (e, cell) {
                        let row = cell.getRow();
                        let button = e.target;
                        console.log(row.getData().nama);

                        fetch('/api/pegawai/data', {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                nik: row.getData().nik,
                                nama: row.getData().nama,
                                nip: row.getData().nip,
                                jab: row.getData().jab,
                                pangkat: row.getData().pangkat,
                                tmt_pangkat: row.getData().tmt_pangkat, tmt_kerja: row.getData().tmt_kerja
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                Swal.fire({
                                    title: 'Edit Record',
                                    text: 'Data berhasil diubah atas nama ' + row.getData().nama,
                                    icon: 'success',
                                    confirmButtonText: 'OK'
                                });
                            })
                            .catch(error => {
                                console.error("Error:", error);
                                Swal.fire({
                                    title: 'Edit Record',
                                    text: 'Data gagal diubah atas nama ' + row.getData().nama,
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                });
                            });
                    }
                },
            ]
        });
        document.getElementById("download-xlsx").addEventListener("click", function () {
            table.download("xlsx", "data_pegawai.xlsx", { sheetName: "Data Pegawai" });
        });
    })
    .catch(error => console.error('Error fetching data:', error));



async function editRecord(nik, cell) {
    // console.log(cell);
    cell.getRow().getElement().classList.add("editing");
    cell.getRow().getCells().forEach(function (cell) {
        let input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.value = cell.getValue();
        cell.getElement().innerHTML = "";
        cell.getElement().appendChild(input);
    });
}
