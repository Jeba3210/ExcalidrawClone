const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

const actionButtons = document.querySelectorAll("#actionbuttons > .btn");

const form = document.querySelector(".form");

const formState = {
    strokewidth: 3,
    strokestyle: "black"
}

const actions = {
    freehand: false,
    rectangle: false,
    eraser: false,
    circle: false,
    line: false,
}

function toggleMenu() {
    form.classList.toggle("hide");
}

function onInput(element) {
    const newValue = element.value;
    if (element.name === "strokewidth")
        formState[element.name] = parseInt(newValue);
    else
        formState[element.name] = newValue;

    console.log(formState);
}


function onActionClick(element) {
    const actionName = element.id;
    actionButtons.forEach(btn => {
        if (btn.classList.contains("active") && btn.id !== actionName) {
            btn.classList.remove("active");
        }
    })
    element.classList.toggle("active");

    actionButtons.forEach(btn => {
        const isActive = btn.classList.contains("active")
        actions[btn.id] = isActive;
    })
    console.log(actions);
}


let intialPosition = null;

const history = [];
let historyIndex = -1;

function onMouseDown(e) {
    if (!(actions.circle || actions.rectangle || actions.eraser || actions.freehand || actions.line)) {
        return;
    }
    console.log("inside");
    intialPosition = { x: e.clientX, y: e.clientY };
    startIndex = history.length - 1;
    c.strokeStyle = formState.strokestyle;
    c.lineWidth = formState.strokewidth;

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e) {
    const currentPosition = { x: e.clientX, y: e.clientY };
    if (actions.freehand) {
        drawFreeHand(currentPosition);
    }
    else if (actions.eraser) {
        handleErase(currentPosition);
    }
    else if (actions.circle) {
        resetToOriginalImage();
        drawCircle(currentPosition);
    }
    else if (actions.rectangle) {
        resetToOriginalImage();
        drawRectangle(currentPosition);
    }
    else if (actions.line) {
        resetToOriginalImage();
        drawLine(currentPosition);
    }
}

function onMouseUp() {
    history.push(c.getImageData(0, 0, canvas.width, canvas.height));
    historyIndex++;
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
}

canvas.addEventListener("mousedown", onMouseDown);

function resetToOriginalImage() {
    if (startIndex !== -1) {
        c.putImageData(history[startIndex], 0, 0);
    }
    else {
        c.clearRect(0, 0, canvas.width, canvas.height);
    }
}

//Frrehand
function drawFreeHand(currentPosition) {
    c.beginPath();
    c.moveTo(intialPosition.x, intialPosition.y);
    c.lineTo(currentPosition.x, currentPosition.y);
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();
    c.closePath();
    intialPosition = currentPosition;
}

//Eraser
function handleErase(currentPosition) {
    c.clearRect(currentPosition.x, currentPosition.y, 10, 10);
}

//Circle
function drawCircle(currentPosition) {
    c.beginPath();
    const radius = Math.sqrt(
        (currentPosition.x - intialPosition.x) ** 2 +
        (currentPosition.y - intialPosition.y) ** 2
    );

    c.arc(intialPosition.x, intialPosition.y, radius, 0, 2 * Math.PI, true);
    c.stroke();
}

 // Rectangle
function drawRectangle(currentPosition) {
    c.beginPath();
    let width = currentPosition.x - intialPosition.x;
    let height = currentPosition.y - intialPosition.y;
    c.strokeRect(intialPosition.x, intialPosition.y, width, height);
}

//Line
function drawLine(currentPosition) {
    c.beginPath();
    c.moveTo(intialPosition.x, intialPosition.y);
    c.lineTo(currentPosition.x, currentPosition.y);
    c.stroke();
}



