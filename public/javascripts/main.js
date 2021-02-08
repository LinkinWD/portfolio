
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

function randomValues() {
	anime({
		targets: '.pallo1, .pallo2',

		translateX: function() {
			return anime.random(-30, 30) + 'vw';
		},
		translateY: function() {
			return anime.random(-30, 30) + 'vh';
		},
		scale: function() {
			return anime.random(10, 30) / 10;
		},
		background: function() {
			let R = anime.random(0, 255);
			let G = anime.random(0, 255);
			let B = anime.random(0, 255);
			let vari = `rgb(${R},${G},${B})`;
			return vari;
		},
		easing: 'easeInOutQuad',
		duration: 750,
		complete: randomValues
	});
}

randomValues();

