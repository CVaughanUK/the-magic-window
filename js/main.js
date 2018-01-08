//P5 JS Code

//Universal Variables
var fftSize = 1024;
var fftSize2 = fftSize / 2;
var fftArray = [];

//Squares Variables
var lineMax = [];
var inc;
var b4 = fftSize2 / 4;
var rotateAmnt = 0;
var sqAmnt = 0;
var sqSize = 200;
var sqRotate = 0;

//Circle Variables
var radius = [];
var cAmnt = 0;
var cLinesAmnt = fftSize2;
var cLinesAngle = 360 / fftSize2;
var cRadius = 100;
var distortAmnt;
var circleDistort = 0;

//Stars Variables
var starsOn = 0;
var starsRandom = 0;
var starsSize = 1;
var heightRandom = [];
var widthRandom = [];
var ellipseSize = [];

function setup() {
    //Creates our canvas and runs the stars setup function
    createCanvas(screen.availWidth, screen.availHeight);
    starsFftSetup();
}

function draw() {
    //Sets the background to white + updates the FFT values
    background(255);
    fftUpdate();

    //This creates the background rectangle for the controls
    stroke(222);
    fill(222);
    rect(-10, -10, 235, 75);
    rect(-10, 68, 235, 75);
    rect(228, -10, 235, 75);
    rect(227, 68, 180, 75);

    //If the stars control variable is on, it runs the stars function
    if (starsOn == 1) {
        starsFftDraw(starsSize, starsRandom);
    }

    //This sets up the squares FFT values
    for (var i = 0; i <= sqAmnt; i++) {
        if (i != 0) {
            squaresFft(width / (sqAmnt + 1) * (i), height / 2, sqSize, sqRotate);
        }
    }

    //This sets up the circles FFT values
    for (var i = 0; i <= cAmnt; i++) {
        if (i != 0) {
            circlesFft(width / (cAmnt + 1) * i, height / 2, cRadius, circleDistort);
        }
    }
}

function fftUpdate() {
    for (var i = 0; i < fftSize2; i++) {
        fftArray[i] = fft.getMagnitude(i) * magMult; //This creates a general FFT array of values of the incoming audio signal
    }

    //Circles
    for (var i = 0; i < fftSize2; i++) {
        radius[i] = (cRadius * 2) + (fftArray[i] * cRadius/10);  //This creates a radius array combining the fft values and the radius
    }

    //Squares
    for (var i = 0; i < fftSize / 2; i++) {
        lineMax[i] = 1 + (fftArray[i] * sqSize/50); //This creates a line length array comining the fft values and the minimum line length
    }
}

//The Circles animation function
function circlesFft(x, y, cRadius, distort) {

    //Variables Declared
    var i = 0;
    distortAmnt = 0;

    //Sets the line to black and centers the image
    push();
    stroke(0);
    translate(x, y);
    //Creates a 360 degree loop
    for (var angle = 0; angle < 360; angle += cLinesAngle) {
        //Increases the length of each line as it goes around the circle
        distortAmnt += distort / 50;
        //Calculates the inner and outer points for the circle using the radius and the radius fft array
        var x1 = cos(radians(angle)) * (cRadius);
        var y1 = sin(radians(angle)) * (cRadius);
        var x2 = cos(radians(angle)) * (radius[i] + distortAmnt);
        var y2 = sin(radians(angle)) * (radius[i] + distortAmnt);
        line(x1, y1, x2, y2);
        i += 1;
    }
    pop();
}

//The Squares animation function
function squaresFft(x, y, squareSize, squareRotate) {
    //Variables Declared
    inc = squareSize / b4;

    //Updates the rotate amount, sets the line to black and centers the shape
    rotateAmnt += squareRotate / 1000;
    push();
    translate(x, y);
    stroke(0);
    //Creates a loop for drawing two sets of lines, one going outwards and one going inwards
    for (var h = -1; h <= 1; h += 2) {
        //Each of these rotates the line individually and draws a length of lines with their length controlled by the fft array
        rotate(rotateAmnt);
        for (var i = 0; i < b4; i++) {
            line(-squareSize / 2 + (inc * i), -squareSize / 2, -squareSize / 2 + (inc * i), -squareSize / 2 - (h * lineMax[i]));
        }
        rotate(rotateAmnt);
        for (var i = b4; i < b4 * 2; i++) {
            line(squareSize / 2, -squareSize / 2 + (inc * (i - b4)), squareSize / 2 + (h * lineMax[i]), -squareSize / 2 + (inc * (i - b4)));
        }
        rotate(rotateAmnt);
        for (var i = (b4) * 2; i < b4 * 3; i++) {
            line(squareSize / 2 - (inc * (i - b4 - b4)), squareSize / 2, squareSize / 2 - (inc * (i - b4 - b4)), squareSize / 2 + (h * lineMax[i]));
        }
        rotate(rotateAmnt);
        for (var i = (b4) * 3; i < fftSize2; i++) {
            line(-squareSize / 2, squareSize / 2 - (inc * (i - b4 - b4 - b4)), -squareSize / 2 - (h * lineMax[i]), squareSize / 2 - (inc * (i - b4 - b4 - b4)));
        }
    }
    pop();
}

//Creates the stars setup
function starsFftSetup() {
    for (var i = 0; i < fftSize2; i++) {
        //Sets values for the whole array
        widthRandom[i] = random(canvas.width);
        heightRandom[i] = (canvas.height / fftSize2) * (i + 1);
    }
}

//Stars animation function
function starsFftDraw(size, starsRandom) {
    //Updates the size of the stars with the fft array values
    for (var i = 0; i < fftSize / 2; i++) {
        ellipseSize[i] = size + fftArray[i];
    }

    //If the randomisation is selected the stars when not active from the fft change position
    if (starsRandom == 1) {
        for (var i = 0; i < fftSize2; i++) {
            //If the ellipse is active from the fft, a random colour is set
            if (ellipseSize[i] - size > 1) {
                fill(random(150));
            } else {
                stroke(0, 0, 0, random(100));
                widthRandom[i] = random(width);
            }
            //Draws the ellipse with the fft size
            ellipse(widthRandom[i], heightRandom[i], ellipseSize[i]);
        }
    }

    if (starsRandom == 0) {
        for (var i = 0; i < fftSize2; i++) {
            if (ellipseSize[i] - size > 1) {
                fill(random(150));
            } else {
                stroke(0, 0, 0, random(100));
            }
            ellipse(widthRandom[i], heightRandom[i], ellipseSize[i]);
        }
    }
}
