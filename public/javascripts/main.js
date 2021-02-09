
const donitsi = document.getElementById('donitsi');


// Wrap every letter in a span
var textWrapper = document.querySelector('.otsikko .kirjaimet');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline()
.add({
    targets: '.otsikko',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  })
  .add({
    targets: '.otsikko',
    opacity: 1,
    duration: 100,
    easing: "easeOutExpo",
    delay: 100
  })
  .add({
    targets: '.otsikko .kirjaimet',
    scale: [0, 1],
    duration: 1500,
    elasticity: 600,
    delay: (el, i) => 45 * (i+1)
  });



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

