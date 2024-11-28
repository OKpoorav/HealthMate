// Analytics Chart (Chart.js)
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Data',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Reminder slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function nextSlide() {
    slides[currentSlide].style.transform = `translateX(-100%)`;
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.transform = `translateX(0)`;
}

setInterval(nextSlide, 2000); // Slide every 2 seconds
