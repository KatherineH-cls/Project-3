
// Poll JS
const pollData = [
  {
    option: "Cillian Murphy",
    votes: 0,
    color: "rgb(255, 99, 132)"
  },
  {
    option: "Tom Hardy",
    votes: 0,
    color: "rgb(54, 162, 235)"
  },
  {
    option: "Clive standen",
    votes: 0,
    color: "rgb(36, 36, 36)"
  },
  {
    option: "Henry Cavill",
    votes: 0,
    color: "rgb(255, 159, 64)"
  },
  {
    option: "Regé-Jean Page",
    votes: 0,
    color: "rgb(75, 192, 192)"
  },
  {
    option: "James Norton",
    votes: 0,
    color: "rgb(255, 206, 86)"
  },
  {
    option: "Idris Elba",
    votes: 0,
    color: "rgb(153, 102, 255)"
  }
];

const pollForm = document.querySelector("#pollForm");

pollForm.addEventListener("submit", pollFormSubmit);

function pollFormSubmit(event) {
  event.preventDefault();
  const pollOptionInput = pollForm.querySelector("input[name='pollOptions']:checked");
  if(pollOptionInput) {
    const pollOptionValue = pollOptionInput.value;
    pollData.find(pollOption => pollOption.option === pollOptionValue).votes++;
    pollChart.data.datasets[0].data = pollData.map(pollOption => pollOption.votes);
    pollChart.update();
    pollForm.reset();
  }
}

function rgbToRgba(rgb, alpha=1) {
  return `rgba(${rgb.substring(rgb.indexOf('(')+1, rgb.length-1).split(',').join()}, ${alpha})`;
}

Chart.defaults.global.defaultFontFamily = '"Comic Sans MS", cursive, sans-serif';

const ctx = document.getElementById('chart').getContext('2d');
const pollChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: pollData.map(pollOption => pollOption.option),
    datasets: [{
      label: '# of Votes',
      data: pollData.map(pollOption => pollOption.votes),
      backgroundColor: pollData.map(pollOption => rgbToRgba(pollOption.color, 0.75)),
      borderWidth: 3
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    title: {
      display: true,
      text: 'Future James Bond',
      fontColor: "#333",
      fontSize: 20,
      padding: 20
    },
    legend: {
      display: false,
    }
  }
});