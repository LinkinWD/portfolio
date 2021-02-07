
const donitsi = document.getElementById('donitsi');

const chart = new Chart(donitsi, {
    type: 'doughnut',
    data: {
        labels: ['Front-end kehitys', 'Back-end kehitys', 'UI desing'],
        datasets: [{
            label: 'Points of interes',
            data: [50, 25 ,25],
           
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
                
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
                
            ],
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            position: 'right',
            labels: {
                fontColor: 'black',
                fontSize: 20, 
                padding: 30
            }
         },
         rotation: (-0.5 * Math.PI) - (25/180 * Math.PI),
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    display: false
             }
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    display: false
             }   
            }]
         
        }
    }
});
