const debug = window.location.hash == '#debug';

let img = document.querySelector('#bgimg');

img.addEventListener('load', async (e) => {

  let mapCreator = new MapCreator(img);
  mapCreator.scale = 5;
  mapCreator.scanDocument();

  let canvas = document.querySelector('#canvas');
  if(debug) mapToCanvas(mapCreator.map, canvas);

  let startPosition;
  let walkable = false;
  startPosition = {x: Math.round(window.innerWidth / 2) - 180, y: Math.round(window.innerHeight / 2) + 70};

  while(!walkable) {
    startPosition.y--;
    walkable = mapCreator.map[Math.floor(startPosition.x / mapCreator.scale)][Math.floor(startPosition.y / mapCreator.scale)] == 0;
    console.log(startPosition.y, walkable);
  }

  let bot = new Bot('#bot1', startPosition);
  bot.display();

  let grid = new PF.Grid(mapCreator.map);

  let path = [];

  let mouseMove = e => {
    let newGrid = grid.clone();
    let finder = new PF.AStarFinder({allowDiagonal: true, heuristic: PF.Heuristic.euclidean});

    let newPath = finder.findPath(
      Math.floor(bot.botPosition.y / mapCreator.scale),
      Math.floor(bot.botPosition.x / mapCreator.scale),
      Math.floor(e.pageY / mapCreator.scale),
      Math.floor(e.pageX / mapCreator.scale),
      newGrid);

    if(newPath.length) {
      path = PF.Util.smoothenPath(newGrid, newPath);
      bot.abort();

      if(debug) {
        mapToCanvas(mapCreator.map, canvas);
        drawPath(path, canvas);
      }
    }
  };

  let func = throttle((e) => mouseMove(e), 100);
  document.addEventListener('mousemove', func);

  // for (let x = 0; x < path.length; x++) {
  //   if(x % 2) continue;
  //   let point = path[x];
  //   await bot.goTo(point[1] * mapCreator.scale, point[0] * mapCreator.scale);
  // }

  let loop = async () => {
    let point = path.shift();
    if (point) await bot.goTo(point[1] * mapCreator.scale, point[0] * mapCreator.scale);
    requestAnimationFrame(loop);
  };

  loop();

});

function mapToCanvas(map, canvas) {
  let width = map.length;
  let height = map[0].length;

  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext("2d");

  let h = ctx.canvas.height;
  let w = ctx.canvas.width;

  let imgData = ctx.getImageData(0, 0, w, h);
  let data = imgData.data;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let s = 4 * i * w + 4 * j;
      data[s] = map[j][i] ? 0 : 255;
      data[s + 1] = 0;
      data[s + 2] = 0;
      data[s + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}


function drawPath(path, canvas) {
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(path[1], path[0]);

  path.shift();
  path.forEach(dot => ctx.lineTo(dot[1], dot[0]));
  ctx.strokeStyle="#00FF00";
  ctx.lineWidth = 1;
  ctx.stroke();
}
