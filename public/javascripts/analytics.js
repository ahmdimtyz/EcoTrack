document.addEventListener("DOMContentLoaded", function () {
    // Current Usage Donut Chart
    const currentUsageCtx = document.getElementById("current-usage-donut").getContext("2d");
    new Chart(currentUsageCtx, {
      type: "doughnut",
      data: {
        labels: ["Energy Consumption"],
        datasets: [{
          data: [6.5, 10 - 6.5],
          backgroundColor: ["#fbc02d", "#eeeeee"],
          borderWidth: 1,
        }],
      },
      options: {
        cutout: "70%", // Smaller donut
        plugins: {
          tooltip: { enabled: false },
        },
      },
    });
  
    // Appliances Bar Chart
    const appliancesCtx = document.getElementById("appliances-bar").getContext("2d");
    new Chart(appliancesCtx, {
      type: "bar",
      data: {
        labels: ["Television", "Computer", "Fridge", "Lights"],
        datasets: [{
          label: "kW",
          data: [1.5, 2.0, 2.8, 0.5],
          backgroundColor: ["#673ab7", "#ff5722", "#03a9f4", "#4caf50"],
        }],
      },
      options: { responsive: true, scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } } },
    });
  
    // Past Usage Line Chart
    const pastUsageCtx = document.getElementById("past-usage-line").getContext("2d");
    new Chart(pastUsageCtx, {
      type: "line",
      data: {
        labels: ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        datasets: [{
          label: "Energy Usage",
          data: [20, 22, 25, 28, 30, 32, 35],
          borderColor: "#03a9f4",
          backgroundColor: "rgba(3, 169, 244, 0.1)",
          fill: true,
        }],
      },
      options: { responsive: true },
    });
  
    // Get the current month dynamically
const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const currentMonthName = monthNames[new Date().getMonth()];

// Daily Consumption Bar Chart
const dailyConsumptionCtx = document.getElementById("daily-consumption-bar").getContext("2d");
new Chart(dailyConsumptionCtx, {
  type: "bar",
  data: {
    labels: ["Television", "Computer", "Fridge", "Lights"],
    datasets: [
      {
        label: `Current Month (${currentMonthName})`, // Use dynamic month here
        data: [15, 20, 28, 11],
        backgroundColor: "#03a9f4",
      },
      {
        label: "Monthly Average",
        data: [12, 18, 25, 10],
        backgroundColor: "#ff5722",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { 
        ticks: { font: { size: 10 } } 
      },
      y: { 
        ticks: { font: { size: 10 } } 
      }
    },
  },
});

  
    // Monthly Comparison Bar Chart
    const monthVsAverageCtx = document.getElementById("month-vs-average-bar").getContext("2d");
    new Chart(monthVsAverageCtx, {
      type: "bar",
      data: {
        labels: ["Current Month", "Monthly Average"],
        datasets: [{
          label: "kWh",
          data: [150, 140],
          backgroundColor: ["#03a9f4", "#ff5722"],
        }],
      },
      options: { responsive: true, scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } } },
    });
  });
  