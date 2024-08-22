let accuracyChart; // Declare a variable to hold the chart instance



// Function to calculate the depth error based on user inputs
function calculateDepthError(focalLengthPx, baselineMm, testDepthMm, disparityErrorPx) {
    const disparityPx = (focalLengthPx * baselineMm) / testDepthMm;
    const wrongDisparity1Px = disparityPx + disparityErrorPx;
    const wrongDisparity2Px = disparityPx - disparityErrorPx;
    const wrongDepth1Mm = (focalLengthPx * baselineMm) / wrongDisparity1Px;
    const wrongDepth2Mm = (focalLengthPx * baselineMm) / wrongDisparity2Px;

    // Return both upper and lower depth errors
    const depthErrorMmLower = wrongDepth1Mm - testDepthMm;
    const depthErrorMmUpper = wrongDepth2Mm - testDepthMm;
    return { depthErrorMmUpper, depthErrorMmLower };
}

function calculateResults() {
    // Read inputs
    const focalLengthPx = parseFloat(document.getElementById("focalLengthPx").value);
    const baselineMm = parseFloat(document.getElementById("baselineMm").value);
    const testDepthMm = parseFloat(document.getElementById("testDepthMm").value);
    const disparityErrorPx = parseFloat(document.getElementById("disparityErrorPx").value);


    // Calculate final depth errors (upper and lower bounds)
    const { depthErrorMmUpper, depthErrorMmLower } = calculateDepthError(focalLengthPx, baselineMm, testDepthMm, disparityErrorPx);

    // Display the final depth error (you can display either the upper or lower, or an average)
    document.getElementById("depthErrorMm").value = depthErrorMmUpper.toFixed(2);

    // Generate chart data
    // Get chart range inputs
    const startDistance = 0.0;
    const endDistance = testDepthMm * 1.5;
    const numItems = 10;

    const { distances, accuraciesUpper, accuraciesLower } = generateChartData(focalLengthPx, baselineMm, disparityErrorPx, startDistance, endDistance, numItems);
    // Plot the chart
    let chart = createChart(distances);
    plotUpperBound(chart, accuraciesUpper);
    //plotLowerBound(chart, accuraciesLower);
    plotTestDepth(chart, testDepthMm, depthErrorMmUpper, depthErrorMmLower);
    accuracyChart.update();
}

// Function to generate chart data based on the calculated results and given range
function generateChartData(focalLengthPx, baselineMm, disparityErrorPx, startDistance, endDistance, numItems) {
    const distances = [];
    const accuraciesUpper = [];
    const accuraciesLower = [];
    const step = (endDistance - startDistance) / (numItems - 1);

    for (let i = 0; i < numItems; i++) {
        const distance = startDistance + i * step;
        const { depthErrorMmUpper, depthErrorMmLower } = calculateDepthError(focalLengthPx, baselineMm, distance, disparityErrorPx);
        distances.push(distance);
        accuraciesUpper.push(depthErrorMmUpper);
        accuraciesLower.push(depthErrorMmLower);
    }

    return { distances, accuraciesUpper, accuraciesLower };
}


function createChart(distances) {
    const ctx = document.getElementById('accuracyChart').getContext('2d');
    if (accuracyChart) {
        // Clear existing datasets
        accuracyChart.destroy();
    }

    accuracyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: distances,
            datasets: []
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Distance (mm)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Depth Error (mm)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false  // Hide the legend completely
                }
            }
        }
    });

    return accuracyChart;
}

function plotTestDepth(chart, testDistance, upperAccuracy, lowerAccuracy) {
    // Plot the test depth using the provided accuracy values
    chart.data.datasets.push({
        //label: 'Test Depth',
        data: [
            { x: testDistance, y: upperAccuracy },
            // { x: testDistance, y: lowerAccuracy }
        ],
        borderColor: 'rgba(255, 255, 0, 1)',
        backgroundColor: 'rgba(255, 255, 0, 0.2)',
        pointRadius: 10,
        fill: false,
        tension: 0.4,
        showLine: false
    });

}

function plotUpperBound(chart, accuraciesUpper) {
    chart.data.datasets.push({
        //label: 'Upper Bound (Depth Error in mm)',
        data: accuraciesUpper,  // Pass as an array of y-values
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.4
    });
}

function plotLowerBound(chart, accuraciesLower) {
    chart.data.datasets.push({
        //label: 'Lower Bound (Depth Error in mm)',
        data: accuraciesLower,  // Pass as an array of y-values
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.4
    });
}







// Initialize tooltips
document.addEventListener('DOMContentLoaded', function () {
    calculateResults();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
