async function fetchDataPegawai() {
    try {
        const response = await fetch('/api/pegawai/count');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data
        );
        document.getElementById('data_PNS').innerHTML = data.data.PNS;
        document.getElementById('data_PPPK').innerHTML = data.data.PPPK;
        document.getElementById('data_NASN').innerHTML = data.data["Non ASN"];
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchDataPegawai();

const fetchCountPegawai = async () => {
    try {
        const response = await fetch('/api/pegawai/countDep');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        data = data.data;
        console.log(data);
        console.log(data.firstFourth.map(item => item.bidang));
    
        var areaChartData = {
            labels: data.firstFourth.map(item => item.bidang),
            datasets: [
                {
                    label: 'PNS',
                    backgroundColor: 'rgba(2, 162, 255, 0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: data.firstFourth.map(item => item.PNS)
                },
                {
                    label: 'PPPK',
                    backgroundColor: 'rgb(18, 238, 54)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.firstFourth.map(item => item.PPPK)
                },
                {
                    label: 'Non ASN',
                    backgroundColor: 'rgb(231, 167, 28)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.firstFourth.map(item => item["Non ASN"])
                },
            ]
        }


        let barChartCanvas = $('#barChart_pegawai_firstFourth').get(0).getContext('2d')
        console.log(Chart);
        let barChartData = $.extend(true, {}, areaChartData)
        let temp0 = areaChartData.datasets[0]
        let temp1 = areaChartData.datasets[1]
        barChartData.datasets[0] = temp1
        barChartData.datasets[1] = temp0

        let barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false
        }

        new Chart(barChartCanvas, {
            type: 'bar',
            data: barChartData,
            options: barChartOptions
        })
        
        var areaChartData_secondFourth = {
            labels: data.secondFourth.map(item => item.bidang),
            datasets: [
                {
                    label: 'PNS',
                    backgroundColor: 'rgba(2, 162, 255, 0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: data.secondFourth.map(item => item.PNS)
                },
                {
                    label: 'PPPK',
                    backgroundColor: 'rgb(18, 238, 54)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.secondFourth.map(item => item.PPPK)
                },
                {
                    label: 'Non ASN',
                    backgroundColor: 'rgb(231, 167, 28)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.secondFourth.map(item => item["Non ASN"])
                },
            ]
        }


        let barChartCanvas_secondFourth = $('#barChart_pegawai_secondFourth').get(0).getContext('2d')
        console.log(Chart);
        let barChartData_secondFourth = $.extend(true, {}, areaChartData_secondFourth)
        let temp0_secondFourth = areaChartData_secondFourth.datasets[0]
        let temp1_secondFourth = areaChartData_secondFourth.datasets[1]
        barChartData_secondFourth.datasets[0] = temp1_secondFourth
        barChartData_secondFourth.datasets[1] = temp0_secondFourth

        let barChartOptions_secondFourth = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false
        }

        new Chart(barChartCanvas_secondFourth, {
            type: 'bar',
            data: barChartData_secondFourth,
            options: barChartOptions_secondFourth
        })
        var areaChartData_thirdFourth = {
            labels: data.thirdFourth.map(item => item.bidang),
            datasets: [
                {
                    label: 'PNS',
                    backgroundColor: 'rgba(2, 162, 255, 0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: data.thirdFourth.map(item => item.PNS)
                },
                {
                    label: 'PPPK',
                    backgroundColor: 'rgb(18, 238, 54)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.thirdFourth.map(item => item.PPPK)
                },
                {
                    label: 'Non ASN',
                    backgroundColor: 'rgb(231, 167, 28)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.thirdFourth.map(item => item["Non ASN"])
                },
            ]
        }


        let barChartCanvas_thirdFourth = $('#barChart_pegawai_thirdFourth').get(0).getContext('2d')
        console.log(Chart);
        let barChartData_thirdFourth = $.extend(true, {}, areaChartData_thirdFourth)
        let temp0_thirdFourth = areaChartData_thirdFourth.datasets[0]
        let temp1_thirdFourth = areaChartData_thirdFourth.datasets[1]
        barChartData_thirdFourth.datasets[0] = temp1_thirdFourth
        barChartData_thirdFourth.datasets[1] = temp0_thirdFourth

        let barChartOptions_thirdFourth = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false
        }

        new Chart(barChartCanvas_thirdFourth, {
            type: 'bar',
            data: barChartData_thirdFourth,
            options: barChartOptions_thirdFourth
        })
        var areaChartData_fourthFourth = {
            labels: data.fourthFourth.map(item => item.bidang),
            datasets: [
                {
                    label: 'PNS',
                    backgroundColor: 'rgba(2, 162, 255, 0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: data.fourthFourth.map(item => item.PNS)
                },
                {
                    label: 'PPPK',
                    backgroundColor: 'rgb(18, 238, 54)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.fourthFourth.map(item => item.PPPK)
                },
                {
                    label: 'Non ASN',
                    backgroundColor: 'rgb(231, 167, 28)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: data.fourthFourth.map(item => item["Non ASN"])
                },
            ]
        }


        let barChartCanvas_fourthFourth = $('#barChart_pegawai_fourthFourth').get(0).getContext('2d')
        console.log(Chart);
        let barChartData_fourthFourth = $.extend(true, {}, areaChartData_fourthFourth)
        let temp0_fourthFourth = areaChartData_fourthFourth.datasets[0]
        let temp1_fourthFourth = areaChartData_fourthFourth.datasets[1]
        barChartData_fourthFourth.datasets[0] = temp1_fourthFourth
        barChartData_fourthFourth.datasets[1] = temp0_fourthFourth

        let barChartOptions_fourthFourth = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false
        }

        new Chart(barChartCanvas_fourthFourth, {
            type: 'bar',
            data: barChartData_fourthFourth,
            options: barChartOptions_fourthFourth
        })

    } catch (error) {
        console.error('error:', error);
    }
}

fetchCountPegawai();