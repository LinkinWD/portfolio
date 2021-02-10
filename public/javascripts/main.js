
const donitsi = document.getElementById('donitsi');





const chart = new Chart(donitsi, {
    type: 'doughnut',
    data: {
        labels: ['Front-end kehitys', 'Back-end kehitys', 'UI desing'],
        datasets: [{
            label: 'Points of interes',
            data: [50, 25 ,25],
           
            backgroundColor: [
                'rgb(3, 218, 198)',
                'rgb(244, 212, 124)',
                'rgb(188, 111, 241)'
                
            ],
            borderColor: [
                'rgb(3, 218, 198)',
                'rgb(244, 212, 124)',
                'rgb(188, 111, 241)'
                
            ],
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            position: 'right',
            labels: {
                fontColor: 'rgba(255, 255, 255, 0.6)',
                fontSize: 11, 
                padding: 20
                
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
		targets: '.taustapallo1, .taustapallo2, .taustapallo3, .taustapallo4',

		translateX: function() {
			return anime.random(-200, 200) + 'px';
		},
		translateY: function() {
			return anime.random(-200, 200) + 'px';
		},
		/* scale: function() {
			return anime.random(10, 30) / 10;
		}, */
		/* background: function() {
			let R = anime.random(0, 255);
			let G = anime.random(0, 255);
			let B = anime.random(0, 255);
			let vari = `rgb(${R},${G},${B})`;
			return vari;
		}, */
		easing: 'easeInOutQuad',
		duration: 750,
		complete: randomValues
	});
}

randomValues();

