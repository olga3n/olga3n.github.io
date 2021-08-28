var canvas = document.createElement('canvas');

document.body.style.margin = 0;
document.body.style.padding = 0;

document.body.style.overflow = "hidden";

document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

window.addEventListener('resize', resize);

function resize() {

    var buf_canvas = document.createElement('canvas');
    var buf_ctx = buf_canvas.getContext('2d');

    buf_ctx.canvas.width = ctx.canvas.width;
    buf_ctx.canvas.height = ctx.canvas.height;

    buf_ctx.drawImage(canvas, 0, 0);

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    if (buf_canvas.width > canvas.width) {
        sx = Math.floor((buf_ctx.canvas.width - ctx.canvas.width) / 2);
        dx = 0;
        w = ctx.canvas.width;
    } else {
        sx = 0;
        dx = Math.floor((ctx.canvas.width - buf_ctx.canvas.width) / 2);
        w = buf_ctx.canvas.width;
    }

    if (buf_ctx.canvas.height > ctx.canvas.height) {
        sy = Math.floor((buf_ctx.canvas.height - ctx.canvas.height) / 2);
        dy = 0;
        h = ctx.canvas.height;
    } else {
        sy = 0;
        dy = Math.floor((ctx.canvas.height - buf_ctx.canvas.height) / 2);
        h = buf_ctx.canvas.height;
    }

    buf_ctx.filter = "grayscale(5%) opacity(98%)";
    ctx.drawImage(buf_canvas, sx, sy, w, h, dx, dy, w, h);
    newLinesLoop();
}

function randint(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function drawLine(p1, p2, c1, c2, w) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = w;

    var gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);

    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);

    ctx.strokeStyle = gradient;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function centerCoord(p) {
    return {
        x: p.x - Math.floor(ctx.canvas.width / 2),
        y: ctx.canvas.height - p.y - Math.floor(ctx.canvas.height / 2)
    }
}

function nativeCoord(p) {
    return {
        x: Math.round(
            p.x + Math.floor(ctx.canvas.width / 2)),
        y: Math.round(
            ctx.canvas.height - p.y - Math.floor(ctx.canvas.height / 2))
    }
}

function polarCoord(p, distortion) {
    return {
        r: Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2)),
        phi: Math.atan2(p.y, p.x) + distortion
    }
}

function cartesianCoord(p) {
    return {
        x: p.r * Math.cos(p.phi),
        y: p.r * Math.sin(p.phi)
    }
}

function mirrorCoord(p) {
    return {
        r: p.r,
        phi: 2 * Math.PI - p.phi
    }
}

function drawRepLine(
    p1, p2, c1, c2, w, distortion1, distortion2, mirrorType, rep) {

    var polar1 = polarCoord(centerCoord(p1), distortion1);
    var polar2 = polarCoord(centerCoord(p2), distortion2);

    for (var i = 0; i < rep; ++i) {
        drawLine(
            nativeCoord(cartesianCoord(polar1)),
            nativeCoord(cartesianCoord(polar2)),
            c1, c2, w
        );

        polar1.phi += Math.PI / 180 * (360 / rep);
        polar2.phi += Math.PI / 180 * (360 / rep);
    }

    polar1 = polarCoord(centerCoord(p1), mirrorType * distortion1);
    polar2 = polarCoord(centerCoord(p2), mirrorType * distortion2);

    for (var i = 0; i < rep; ++i) {
        drawLine(
            nativeCoord(cartesianCoord(mirrorCoord(polar1))),
            nativeCoord(cartesianCoord(mirrorCoord(polar2))),
            c1, c2, w
        );

        polar1.phi += Math.PI / 180 * (360 / rep);
        polar2.phi += Math.PI / 180 * (360 / rep);
    }
}

function randomPoint() {
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;

    var size = Math.min(w, h);
    var margin = size / 3.5;

    return {
        x: (w - size) / 2 + margin + randint(0, size - 2 * margin),
        y: (h - size) / 2 + margin + randint(0, size - 2 * margin)
    }
}

function mix(v1, v2, weight) {
    return v1 * (1 - weight) + v2 * weight;
}

function mixPoint(start, end, weight) {
    return {
        x: mix(start.x, end.x, weight),
        y: mix(start.y, end.y, weight)
    }
}

function mixColor(start, end, weight) {
    var startH = start.h;
    var endH = end.h;

    if (endH < startH) {
        endH += 360;
    }

    if (endH >= startH && endH - startH > 180) {
        start.h += 360;
    }

    return {
        h: Math.round(mix(startH, endH, weight)) % 360,
        s: Math.round(mix(start.s, end.s, weight)),
        l: Math.round(mix(start.l, end.l, weight))
    }
}

function distance(p1, p2) {
    return Math.sqrt(
        (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)
    );
}

var prevBackTimestamp = 0;
var prevBackCoeffTimestamp = 0;

var backHue = randint(0, 360);
var backCoeff = 1;

var prevLineTimestamp = 0;
var prevFullLineTimestamp = 0;

var lineStatus;
var rep = 6;

var p1, p2, p3;
var c1, c2, c3;

var currPoint, currColor;

var delta;
var lineWidth;
var lineLength;

var currDistortion, distortionCoeff;
var distortionMirrorType;

function newLinesLoop() {
    lineStatus = 0;

    p1 = randomPoint();
    p2 = randomPoint();
    p3 = randomPoint();
    
    c1 = {h: randint(0, 360), s: 50, l: 70};
    c2 = {h: randint(0, 360), s: 70, l: 50};
    c3 = {h: 0, s: 70, l: 0};

    currPoint = p1;
    currColor = c1;

    delta = 8;
    lineWidth = randint(8, 12);
    lineLength = 0;

    currDistortion = 0;
    distortionCoeff = (Math.random() - 0.5) / 3;
    distortionMirrorType = (Math.random() < 0.5)? 1: -1;
}

function copyCanvasWithFilter(canvasFilter) {
    var buf_canvas = document.createElement('canvas');
    var buf_ctx = buf_canvas.getContext('2d');

    buf_ctx.canvas.width = ctx.canvas.width;
    buf_ctx.canvas.height = ctx.canvas.height;

    buf_ctx.filter = canvasFilter;
    buf_ctx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(buf_canvas, 0, 0);
}

document.body.style.backgroundImage = "radial-gradient(circle, " +
    `hsl(${backHue}, 40%, 90%), ` +
    `hsl(${backHue}, 70%, 15%))`;

newLinesLoop();

canvas.addEventListener('click', canvasClick);

function canvasClick() {
    var hueRotate = 42;

    copyCanvasWithFilter(`hue-rotate(${hueRotate}deg)`);

    c1.h = (c1.h + hueRotate) % 360;
    c2.h = (c2.h + hueRotate) % 360;
    c3.h = (c3.h + hueRotate) % 360;
}

function animate(timestamp) {

    if (timestamp - prevBackTimestamp > 200) {
        prevBackTimestamp = timestamp;
        backHue = (backHue + 3 * backCoeff) % 360;
        document.body.style.backgroundImage = "radial-gradient(circle, " +
            `hsl(${backHue}, 40%, 90%), ` +
            `hsl(${backHue}, 70%, 15%))`;
    }

    if (timestamp - prevBackCoeffTimestamp > 1000) {
        backCoeff *= (Math.random() > 0.5)? 1: -1;
        prevBackCoeffTimestamp = timestamp;
    }

    if (timestamp - prevLineTimestamp > 100) {

        if (lineStatus == 0) {

            startPoint = p1;
            endPoint = p2;

            startColor = c1;
            endColor = c2;

        } else if (lineStatus == 1) {

            startPoint = p2;
            endPoint = p3;

            startColor = c2;
            endColor = c3;

        } else if (lineStatus == 2) {

            startPoint = p3;
            endPoint = p1;

            startColor = c3;
            endColor = c1;

        }

        lineLength += delta;

        var fullLineLength = distance(startPoint, endPoint);

        var weight = Math.min(1, lineLength / fullLineLength);

        var nextDistortion;
        var distortionLimit = distortionCoeff * fullLineLength / 50;

        if (weight < 0.5) {
            nextDistortion = mix(0, distortionLimit, weight);
            delta = mix(8, 3, weight);
        } else {
            nextDistortion = mix(distortionLimit, 0, weight);
            delta = mix(3, 8, weight);
        }

        var nextPoint = mixPoint(startPoint, endPoint, weight);
        var nextColor = mixColor(startColor, endColor, weight);

        var color1 = `hsl(${currColor.h}, ${currColor.s}%, ${currColor.l}%)`;
        var color2 = `hsl(${nextColor.h}, ${nextColor.s}%, ${nextColor.l}%)`;

        if (lineStatus < 3) {
            drawRepLine(
                currPoint, nextPoint, color1, color2,
                lineWidth, currDistortion, nextDistortion,
                distortionMirrorType, rep);
        }

        currPoint = nextPoint;
        currColor = nextColor;

        currDistortion = nextDistortion;

        if (currPoint.x == endPoint.x && currPoint.y == endPoint.y) {
            if (lineStatus < 3) {
                lineStatus += 1;
                prevFullLineTimestamp = timestamp;
            }
            lineLength = 0;
        }

        if (lineStatus == 3 && timestamp - prevFullLineTimestamp > 1000) {
            newLinesLoop();
            copyCanvasWithFilter("grayscale(5%) opacity(98%)");
        }

        prevLineTimestamp = timestamp;
    }

    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
