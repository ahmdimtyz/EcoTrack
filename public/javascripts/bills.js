// Data Endpoints (Adjust as needed)
const monthDataUrl = '/api/bills/month';
const dayDataUrl = '/api/bills/day';

// Chart instance (Global to allow updates)
let billsChart;

// Fetch and Update Chart Data
async function fetchAndRenderData(viewType) {
  const url = viewType === 'month' ? '/api/bills/month' : '/api/bills/day';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch bills data.');

    const data = await response.json();
    updateChart(data); // Assume this function updates your chart
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching data. Please try again.');
  }
}

// Update the Chart
function updateChart(billsData) {
  const labels = billsData.map((bill) => bill.label); // e.g., Month/Day names
  const data = billsData.map((bill) => bill.amount);

  if (billsChart) {
    // Update existing chart
    billsChart.data.labels = labels;
    billsChart.data.datasets[0].data = data;
    billsChart.update();
  } else {
    // Create a new chart
    const ctx = document.getElementById('bills-chart').getContext('2d');
    billsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Bill Amount (RM)',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

// Handle View Switching
document.getElementById('month-view').addEventListener('click', () => {
  fetchAndRenderData('month');
  toggleActiveButton('month-view');
});

document.getElementById('day-view').addEventListener('click', () => {
  fetchAndRenderData('day');
  toggleActiveButton('day-view');
});

// Toggle Active Button
function toggleActiveButton(activeButtonId) {
  document.querySelectorAll('.switch button').forEach((button) => {
    button.classList.remove('active');
  });
  document.getElementById(activeButtonId).classList.add('active');
}

// Fetch initial data for Month view
document.addEventListener('DOMContentLoaded', () => fetchAndRenderData('month'));
