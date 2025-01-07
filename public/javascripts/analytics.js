document.addEventListener("DOMContentLoaded", function () {
  // Utility Function for Chart Initialization
  function createChart(ctx, type, data, options) {
    return new Chart(ctx, { type, data, options });
  }

  // 🥯 Current Usage Donut Chart
  createChart(document.getElementById("current-usage-donut").getContext("2d"), "doughnut", {
    labels: ["Energy Consumption"],
    datasets: [{
      data: [4.0, 10 - 4.0], // Updated with a representative example
      backgroundColor: ["#fbc02d", "#eeeeee"],
      borderWidth: 1,
    }],
  }, {
    cutout: "70%", // Smaller donut
    plugins: {
      tooltip: { enabled: false },
    },
  });

  // 📊 Appliances Bar Chart
  createChart(document.getElementById("appliances-bar").getContext("2d"), "bar", {
    labels: ["Phone Charger", "Washing Machine", "Television"],
    datasets: [{
      label: "kW",
      data: [0.2, 2.5, 1.5], // Updated data for three appliances
      backgroundColor: ["#673ab7", "#ff5722", "#03a9f4"],
    }],
  }, {
    responsive: true,
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } },
    },
  });

  // 📈 Past Usage Line Chart
  createChart(document.getElementById("past-usage-line").getContext("2d"), "line", {
    labels: ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
    datasets: [{
      label: "Energy Usage",
      data: [15, 18, 20, 25, 22, 26, 28], // Updated example usage data
      borderColor: "#03a9f4",
      backgroundColor: "rgba(3, 169, 244, 0.1)",
      fill: true,
    }],
  }, {
    responsive: true,
  });

  // 📆 Get Current Month Dynamically
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[new Date().getMonth()];

  // 📊 Daily Consumption Bar Chart
  createChart(document.getElementById("daily-consumption-bar").getContext("2d"), "bar", {
    labels: ["Phone Charger", "Washing Machine", "Television"],
    datasets: [
      {
        label: `Current Month (${currentMonthName})`,
        data: [5, 15, 10], // Example monthly data
        backgroundColor: "#03a9f4",
      },
      {
        label: "Monthly Average",
        data: [4, 14, 9], // Example average data
        backgroundColor: "#ff5722",
      },
    ],
  }, {
    responsive: true,
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } },
    },
  });

  // 📊 Monthly Comparison Bar Chart
  createChart(document.getElementById("month-vs-average-bar").getContext("2d"), "bar", {
    labels: ["Current Month", "Monthly Average"],
    datasets: [{
      label: "kWh",
      data: [120, 110], // Updated example monthly comparison data
      backgroundColor: ["#03a9f4", "#ff5722"],
    }],
  }, {
    responsive: true,
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } },
    },
  });
});
