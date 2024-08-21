function calculateResults() {
    // Read inputs
    const focalLengthPx = parseFloat(document.getElementById("focalLengthPx").value);
    const baselineMm = parseFloat(document.getElementById("baselineMm").value);
    const testDepthMm = parseFloat(document.getElementById("testDepthMm").value);
    const disparityErrorPx = parseFloat(document.getElementById("disparityErrorPx").value);

    // Calculate intermediate values
    const disparityPx = (focalLengthPx * baselineMm) / testDepthMm;
    const wrongDisparity1Px = disparityPx + disparityErrorPx;
    const wrongDisparity2Px = disparityPx - disparityErrorPx;
    const wrongDepth1Mm = (focalLengthPx * baselineMm) / wrongDisparity1Px;
    const wrongDepth2Mm = (focalLengthPx * baselineMm) / wrongDisparity2Px;

    // Calculate final depth error (the larger one)
    const depthErrorMm = wrongDepth2Mm - testDepthMm;

    // Display the final depth error
    document.getElementById("depthErrorMm").value = depthErrorMm.toFixed(2);
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
