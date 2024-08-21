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

    // Calculate final depth errors
    const depthError1Mm = wrongDepth1Mm - testDepthMm;
    const depthError2Mm = wrongDepth2Mm - testDepthMm;

    // Display intermediate values
    document.getElementById("disparityPx").value = disparityPx.toFixed(2);
    document.getElementById("wrongDisparity1Px").value = wrongDisparity1Px.toFixed(2);
    document.getElementById("wrongDisparity2Px").value = wrongDisparity2Px.toFixed(2);
    document.getElementById("wrongDepth1Mm").value = wrongDepth1Mm.toFixed(2);
    document.getElementById("wrongDepth2Mm").value = wrongDepth2Mm.toFixed(2);

    // Display final depth errors
    document.getElementById("depthError1Mm").value = depthError1Mm.toFixed(2);
    document.getElementById("depthError2Mm").value = depthError2Mm.toFixed(2);
}
