// Get the drawing canvas and its context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Initialize drawing variables
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;

// Track drawn strokes
let strokes = [];
let currentStroke = [];

// Get the eraser size range input
const eraserSizeRange = document.getElementById('eraserSizeRange');
let eraserSize = parseInt(eraserSizeRange.value);

// Event listeners for mouse input
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawOrErase);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Event listeners for touch input
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', drawOrErase);
canvas.addEventListener('touchend', stopDrawing);

// Toggle between drawing and erasing modes
const drawButton = document.getElementById('drawButton');
const eraseButton = document.getElementById('eraseButton');

drawButton.addEventListener('click', () => {
    isErasing = false;
    drawButton.classList.add('active');
    eraseButton.classList.remove('active');
});

eraseButton.addEventListener('click', () => {
    isErasing = true;
    drawButton.classList.remove('active');
    eraseButton.classList.add('active');
});

// Event listener for the clear button
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);

// Event listener for eraser size range input
eraserSizeRange.addEventListener('input', updateEraserSize);

// Event listener for save button
function btnclickhndlr(){
    alert('Drawing saved successfully!');
}

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveDrawing);
saveButton.addEventListener('click',btnclickhndlr);

// Function to start drawing or erasing
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
    currentStroke = [];
    strokes.push(currentStroke);
}

// Function to draw or erase lines
function drawOrErase(e) {
    if (!isDrawing) return;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const [x, y] = getCoordinates(e);

    if (isErasing) {
        // Erase by drawing with the background color
        ctx.globalCompositeOperation = 'destination-out'; // Set eraser mode
        ctx.fillStyle = '#fff'; // Background color
        ctx.beginPath();
        ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.globalCompositeOperation = 'source-over'; // Set normal drawing mode
        ctx.strokeStyle = '#000'; // Line color
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Store points for the current stroke
    currentStroke.push({ x, y });

    [lastX, lastY] = [x, y];
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
}

// Helper function to get coordinates from mouse or touch event
function getCoordinates(event) {
    let x, y;
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX - canvas.getBoundingClientRect().left;
        y = event.touches[0].clientY - canvas.getBoundingClientRect().top;
    } else {
        x = event.clientX - canvas.getBoundingClientRect().left;
        y = event.clientY - canvas.getBoundingClientRect().top;
    }
    return [x, y];
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = [];
}

// Function to update the eraser size
function updateEraserSize() {
    eraserSize = parseInt(eraserSizeRange.value);
}

// Function to save the drawing as an image
function saveDrawing() {
    const image = canvas.toDataURL('image/png');
    localStorage.setItem('savedDrawing', image);
}

// Load saved drawing on page load
const savedDrawing = localStorage.getItem('savedDrawing');
if (savedDrawing) {
    const img = new Image();
    img.src = savedDrawing;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
}

const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', downloadCanvas);

// Function to download the canvas as a PNG image with a white background
function downloadCanvas() {
    // Create a new canvas with a white background
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext('2d');
    newCtx.fillStyle = '#fff'; // Set white background
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw the existing drawing on the new canvas
    newCtx.drawImage(canvas, 0, 0);

    // Convert the new canvas to a data URL (PNG)
    const canvasDataUrl = newCanvas.toDataURL('image/png');

    // Create a download link
    const a = document.createElement('a');
    a.href = canvasDataUrl;
    a.download = 'drawing.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function myFunction() {
    saveDrawing()
  }
setInterval(myFunction, 1000);