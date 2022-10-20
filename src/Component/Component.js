import React from 'react';

class AppBase extends React.Component {
  arr = [];

  componentDidMount() {
    const canvasEle = document.getElementById('canvas');
    const button = document.getElementById('button');
    const context = canvasEle.getContext('2d');
    let startPosition = { x: 0, y: 0 };
    let lineCoordinates = { x: 0, y: 0 };
    let isDrawStart = false;

    const resizeLine = () => {
      let resultArr = [];
      this.arr.forEach(([startX, startY, endX, endY]) => {
        let rab = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        if (rab > 4) {
          let k = 2 / rab;
          let xA = startX + (endX - startX) * k;
          let yA = startY + (endY - startY) * k;

          let xb = endX + (startX - endX) * k;
          let yb = endY + (startY - endY) * k;

          resultArr.push([xA, yA, xb, yb]);
        }
      });

      this.arr = resultArr;
      return this.arr;
    };

    button.addEventListener('click', () => {
      let animate = setInterval(() => {
        if (resizeLine().length > 0) {
          clearCanvas();
          drawPrevLines();
        } else {
          clearInterval(animate);
          clearCanvas();
        }
      }, 30);
    });

    const intersection = (p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) => {
      let d1x = p1x - p0x,
        d1y = p1y - p0y,
        d2x = p3x - p2x,
        d2y = p3y - p2y,
        d = d1x * d2y - d2x * d1y,
        px,
        py,
        s,
        t;

      if (d) {
        px = p0x - p2x;
        py = p0y - p2y;
        s = (d1x * py - d1y * px) / d;
        if (s >= 0 && s <= 1) {
          t = (d2x * py - d2y * px) / d;
          if (t >= 0 && t <= 1) {
            return { x: p0x + t * d1x, y: p0y + t * d1y };
          }
        }
      }
      return null;
    };

    const drawPoints = ([curStartX, curStartY, curEndX, curEndY]) => {
      this.arr.forEach(([startX, startY, endX, endY]) => {
        if (
          startX !== curStartX &&
          startY !== curStartY &&
          endX !== curEndX &&
          endY !== curEndY
        ) {
          let dot = intersection(
            curStartX,
            curStartY,
            curEndX,
            curEndY,
            startX,
            startY,
            endX,
            endY
          );
          if (dot) {
            context.beginPath();
            context.arc(dot.x, dot.y, 7, 0, 2 * Math.PI);
            context.strokeStyle = '#000000';
            context.fillStyle = '#f00';
            context.fill();
            context.stroke();
          }
        }
      });
    };

    const drawPrevLines = () => {
      this.arr.forEach(([startX, startY, endX, endY]) => {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
        drawPoints([startX, startY, endX, endY]);
      });
    };

    const drawLine = () => {
      context.beginPath();
      context.moveTo(startPosition.x, startPosition.y);
      context.lineTo(lineCoordinates.x, lineCoordinates.y);
      context.stroke();
    };

    const clearCanvas = () => {
      context.clearRect(0, 0, canvasEle.width, canvasEle.height);
    };

    const mouseDownListener = (e) => {
      isDrawStart = true;
      const { pageX, pageY } = e;
      startPosition.x = pageX - canvasEle.offsetLeft;
      startPosition.y = pageY - canvasEle.offsetTop;
      context.fillRect(startPosition.x, startPosition.y, 1, 1);
    };

    const mouseMoveListener = (e) => {
      if (isDrawStart) {
        clearCanvas();
        drawPrevLines();
        context.fillRect(startPosition.x, startPosition.y, 1, 1);
        const { pageX, pageY } = e;
        lineCoordinates.x = pageX - canvasEle.offsetLeft;
        lineCoordinates.y = pageY - canvasEle.offsetTop;
        drawLine();
        drawPoints([
          startPosition.x,
          startPosition.y,
          lineCoordinates.x,
          lineCoordinates.y,
        ]);
      }
    };

    const mouseUpListener = (e) => {
      isDrawStart = false;
      const { pageX, pageY } = e;
      const x = pageX - canvasEle.offsetLeft;
      const y = pageY - canvasEle.offsetTop;
      context.fillRect(x, y, 1, 1);

      this.arr.push([
        startPosition.x,
        startPosition.y,
        lineCoordinates.x,
        lineCoordinates.y,
      ]);
    };

    canvasEle.addEventListener('mousedown', mouseDownListener);
    canvasEle.addEventListener('mousemove', mouseMoveListener);
    canvasEle.addEventListener('mouseup', mouseUpListener);
  }

  componentDidUpdate() {}

  render() {
    console.log(1);
    return (
      <div className="container">
        <canvas id="canvas" height="500px" width="700px"></canvas>
        <button id="button">Collapse lines</button>
      </div>
    );
  }
}

export default AppBase;
