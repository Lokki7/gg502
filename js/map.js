class MapCreator {

  constructor(image) {
    this.map = [];
    this.image = image;

    this.scale = 4;

    this.ignoreColors = [
      [13, 18, 33], // Фон
      [78, 160, 56], // Кусты
      [106, 195, 83],

      [255, 156, 0], // Прогресс стройки
      [255, 255, 255],
      [255, 242, 204],
      [255, 230, 191],
    ];

    this.createCanvas();
    // this.scanDocument();
  }

  createCanvas() {
    let canvas = document.createElement('canvas');
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);

    this.ctx = ctx;
  }

  isIgnoreColor(pixelData) {
    for (let b = 0; b < this.ignoreColors.length; b++) {
      if (pixelData[0] == this.ignoreColors[b][0] && pixelData[1] == this.ignoreColors[b][1] && pixelData[2] == this.ignoreColors[b][2]) {
        return true;
      }
    }

    return false;
  }

  scanDocument() {
    let maxX = Math.floor(window.innerWidth / this.scale);
    let maxY = Math.floor(window.innerHeight / this.scale);

    let [ix, iy, iw, ih] = [this.image.offsetLeft / this.scale, this.image.offsetTop / this.scale, this.image.offsetWidth / this.scale, this.image.offsetHeight / this.scale];

    for (let x = 0; x < maxX; x++) {
      if (!this.map[x]) this.map[x] = [];

      for (let y = 0; y < maxY; y++) {
        if (this.map[x][y] > 0) continue;
        
        if (x >= ix && y >= iy && x < ix + iw && y < iy + ih) {
          let pixelData = this.ctx.getImageData((x - ix) * this.scale, (y - iy) * this.scale, 1, 1).data;

          let busy = this.isIgnoreColor(pixelData) ? 0 : 1;

          if(busy) {
            this.map[x][y] = 1;

            const R = 4;

            for(let dy = -R; dy < R; dy++) {
              for (let dx = -R; dx < R; dx++) {
                if (dx * dx + dy * dy > R * R) continue;
                if (x + dx < 0 || y + dy < 0) continue;
                if (x + dx >= maxX || y + dy >= maxY) continue;

                if(!this.map[x + dx]) this.map[x + dx] = [];
                this.map[x + dx][y + dy] = 1;
              }
            }
          } else {
            this.map[x][y] = 0;
          }

        } else {
          this.map[x][y] = 0;
        }
      }
    }
  }
}

// let canvas = document.querySelector('#canvas');
// let map = new MapCreator(document.querySelector('img'));
// mapToCanvas(map.map, canvas);
//
// let grid = new PF.Grid(map.map);
//
// let start = {x: Math.round(window.innerWidth / 2) - 180, y: Math.round(window.innerHeight / 2) + 70};
//
// canvas.addEventListener('mousemove', e => {
//   let newGrid = grid.clone();
//   let finder = new PF.JumpPointFinder();
//   let path = finder.findPath(Math.floor(start.y / map.scale), Math.floor(start.x / map.scale), e.pageY, e.pageX, newGrid);
//   mapToCanvas(map.map, canvas);
//   drawPath(path, canvas);
// });
//
// function drawPath(path, canvas) {
//   let ctx = canvas.getContext("2d");
//   ctx.beginPath();
//   ctx.moveTo(path[1], path[0]);
//
//   path.shift();
//   path.forEach(dot => ctx.lineTo(dot[1], dot[0]));
//   ctx.strokeStyle="#00FF00";
//   ctx.lineWidth = 5;
//   ctx.stroke();
// }
//
// function mapToCanvas(map, canvas) {
//   let width = map.length;
//   let height = map[0].length;
//
//   canvas.width = width;
//   canvas.height = height;
//
//   let ctx = canvas.getContext("2d");
//
//   let h = ctx.canvas.height;
//   let w = ctx.canvas.width;
//
//   let imgData = ctx.getImageData(0, 0, w, h);
//   let data = imgData.data;
//
//   for (let i = 0; i < height; i++) {
//     for (let j = 0; j < width; j++) {
//       let s = 4 * i * w + 4 * j;
//       data[s] = map[j][i] ? 0 : 255;
//       data[s + 1] = 0;
//       data[s + 2] = 0;
//       data[s + 3] = 255;
//     }
//   }
//
//   ctx.putImageData(imgData, 0, 0);
// }
