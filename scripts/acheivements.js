$(document).ready(function () {
    console.log("Fetching data from api/fetch_achievements.php...");
    $.ajax({
      url: "api/fetch_achievements.php",
      method: "GET",
      dataType: "json",
      beforeSend: function () {
        console.log("AJAX request initiated...");
      },
      success: function (response) {
        console.log("Raw response:", response);
        if (response && response.status === "success" && response.data) {
          console.log("Data processing started...");
          const data = response.data;
          const years = Object.keys(data).sort();
          const departments = [
            ...new Set(
              Object.values(data).flat().map((item) => item.department_name)
            ),
          ];
          const filteredYears = years.filter(year => parseInt(year) >= 2023); // Globally defined
          console.log("Years:", years);
          console.log("Filtered Years:", filteredYears);
          console.log("Departments:", departments);
          let totalPlacements2025 = 0;
          let totalAvgPackage2025 = 0;
          let totalAwards2025 = 0;
          let totalPlacements2024 = 0;
          if (data["2025"]) {
            data["2025"].forEach(dept => {
              totalPlacements2025 += parseInt(dept.placements) || 0;
              totalAvgPackage2025 += parseFloat(dept.avg_package) || 0;
              totalAwards2025 += parseInt(dept.awards_won) || 0;
            });
            totalAvgPackage2025 = (totalAvgPackage2025 / data["2025"].length) / 100000;
          }
          if (data["2024"]) {
            data["2024"].forEach(dept => {
              totalPlacements2024 += parseInt(dept.placements) || 0;
            });
          }
          const growthRate = totalPlacements2024 > 0 ? 
            ((totalPlacements2025 - totalPlacements2024) / totalPlacements2024 * 100).toFixed(1) : 
            "N/A";
          $("#total-placements").text(totalPlacements2025);
          $("#avg-package").text(totalAvgPackage2025.toFixed(2));
          $("#total-awards").text(totalAwards2025);
          $("#growth-rate").text(growthRate + "%");
          try {
            const placementsData = filteredYears.map((year) => ({
              label: year,
              data: departments.map((dept) => {
                const deptData = data[year].find((d) => d.department_name === dept);
                return deptData ? deptData.placements : 0;
              }),
              backgroundColor: year === "2023" ? "rgba(67, 97, 238, 0.7)" : 
                             year === "2024" ? "rgba(58, 12, 163, 0.7)" : 
                             "rgba(247, 37, 133, 0.7)",
              borderColor: year === "2023" ? "rgba(67, 97, 238, 1)" : 
                          year === "2024" ? "rgba(58, 12, 163, 1)" : 
                          "rgba(247, 37, 133, 1)",
              borderWidth: 2,
            }));
            const placementsCtx = document.getElementById("placementsChart").getContext("2d");
            new Chart(placementsCtx, {
              type: "bar",
              data: { labels: departments, datasets: placementsData },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12,
                        weight: 'bold'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 15,
                    cornerRadius: 8,
                    titleFont: {
                      size: 16,
                      weight: 'bold'
                    },
                    bodyFont: {
                      size: 14
                    },
                    displayColors: true,
                    usePointStyle: true
                  }
                },
                scales: {
                  y: { 
                    beginAtZero: true, 
                    grid: {
                      drawBorder: false,
                      color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                      font: {
                        size: 12
                      },
                      padding: 10
                    },
                    title: { 
                      display: true, 
                      text: "Placements",
                      font: {
                        size: 14,
                        weight: 'bold'
                      },
                      padding: {
                        top: 10,
                        bottom: 10
                      }
                    } 
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      font: {
                        size: 12
                      },
                      padding: 10
                    }
                  }
                }
              }
            });
            console.log("Placements chart rendered");
          } catch (e) {
            console.error("Error rendering placements chart:", e);
          }
          try {
            console.log("Rendering avg package chart with years:", filteredYears);            
            const avgPackageData = filteredYears.map((year) => {
              const dataForYear = departments.map((dept) => {
                const deptData = data[year].find((d) => d.department_name === dept);
                const value = deptData ? deptData.avg_package / 100000 : 0;
                console.log(`Year: ${year}, Dept: ${dept}, Avg Package: ${value}`);
                return value;
              });
              return {
                label: year,
                data: dataForYear,
                fill: year === "2025" ? 0.2 : false,
                borderColor: year === "2023" ? "#4361ee" : 
                            year === "2024" ? "#3a0ca3" : 
                            "#f72585",
                backgroundColor: year === "2023" ? "rgba(67, 97, 238, 0.1)" : 
                               year === "2024" ? "rgba(58, 12, 163, 0.1)" : 
                               "rgba(247, 37, 133, 0.1)",
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: year === "2023" ? "#4361ee" : 
                                   year === "2024" ? "#3a0ca3" : 
                                   "#f72585",
                pointBorderColor: "#fff",
                pointRadius: 6,
                pointHoverRadius: 8,
              };
            });
            console.log("Avg Package Data:", avgPackageData);
            const avgPackageCtx = document.getElementById("avgPackageChart").getContext("2d");
            if (!avgPackageCtx) {
              console.error("Canvas #avgPackageChart not found!");
            } else {
              new Chart(avgPackageCtx, {
                type: "line",
                data: { labels: departments, datasets: avgPackageData },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: "top",
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12,
                          weight: 'bold'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      padding: 15,
                      cornerRadius: 8,
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ₹${context.raw.toFixed(2)} Lakhs`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: { 
                      beginAtZero: true, 
                      grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                      },
                      ticks: {
                        font: {
                          size: 12
                        },
                        callback: function(value) {
                          return '₹' + value.toFixed(1);
                        }
                      },
                      title: { 
                        display: true, 
                        text: "Avg Package (₹ Lakhs)",
                        font: {
                          size: 14,
                          weight: 'bold'
                        },
                        padding: {
                          top: 10,
                          bottom: 10
                        }
                      } 
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }
              });
              console.log("Average package chart rendered");
            }
          } catch (e) {
            console.error("Error rendering avg package chart:", e);
          }
          try {
            const awardsData = departments.map((dept) => {
              const deptData = data["2025"].find((d) => d.department_name === dept);
              return deptData ? deptData.awards_won : 0;
            });
            const awardsCtx = document.getElementById("awardsChart").getContext("2d");
            new Chart(awardsCtx, {
              type: "doughnut",
              data: {
                labels: departments,
                datasets: [{
                  label: "Awards Won",
                  data: awardsData,
                  backgroundColor: [
                    "rgba(67, 97, 238, 0.8)",
                    "rgba(58, 12, 163, 0.8)",
                    "rgba(247, 37, 133, 0.8)",
                    "rgba(72, 202, 228, 0.8)",
                    "rgba(155, 89, 182, 0.8)"
                  ],
                  borderColor: [
                    "rgba(67, 97, 238, 1)",
                    "rgba(58, 12, 163, 1)",
                    "rgba(247, 37, 133, 1)",
                    "rgba(72, 202, 228, 1)",
                    "rgba(155, 89, 182, 1)"
                  ],
                  borderWidth: 2,
                  hoverOffset: 15
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                  legend: { 
                    position: "right",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 15,
                    cornerRadius: 8,
                    callbacks: {
                      label: function(context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `Awards: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }
            });
            console.log("Awards chart rendered");
          } catch (e) {
            console.error("Error rendering awards chart:", e);
          }
        } else {
          $("#error-container").text("No data available or invalid response.").show();
          console.error("Invalid response:", response);
        }
      },
      error: function (xhr, status, error) {
        $("#error-container").text("Failed to load data: " + error).show();
        console.error("AJAX Error:", status, error, xhr.responseText);
      }
    });
  });