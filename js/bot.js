class Bot {

  constructor(selector) {
    this.elem = document.querySelector(selector);

    this.startPosition = {x: Math.round(window.innerWidth / 2) - 180, y: Math.round(window.innerHeight / 2) + 70};

    this.botPosition = {x: this.startPosition.x, y: this.startPosition.y};
    this.mousePosition = {x: this.startPosition.x, y: this.startPosition.y};

    this.speed = 1;

    this.bindMouse();
    this.placeInPosition();

    this.idleTimeout = 0;

    setTimeout(() => {
      this.move();
    }, 1000);
  }

  placeInPosition() {
    this.elem.style.top = this.botPosition.y + 'px';
    this.elem.style.left = this.botPosition.x + 'px';
  }

  bindMouse() {
    let func = throttle((e) => this.onMouseMove(e), 100);
    document.addEventListener('mousemove', func);
  }

  onMouseMove(event) {
    this.mousePosition = {x: event.pageX, y: event.pageY};
    this.rotate();
  }

  moveBack() {
    this.mousePosition = {x: this.startPosition.x, y: this.startPosition.y};
  }

  move() {
    requestAnimationFrame(() => this.move());

    let direction = this.getMouseDirection();

    if (!direction.length) {
      if (!this.idleTimeout) {
        this.idleTimeout = setTimeout(() => this.moveBack(), 5000);
      }
      return;
    }

    clearTimeout(this.idleTimeout);
    this.idleTimeout = false;

    if (direction.includes('up')) {
      this.botPosition.y -= this.speed;
    }
    if (direction.includes('down')) {
      this.botPosition.y += this.speed;
    }
    if (direction.includes('right')) {
      this.botPosition.x += this.speed;
    }
    if (direction.includes('left')) {
      this.botPosition.x -= this.speed;
    }

    this.placeInPosition();
    this.rotate();
  }

  rotate() {
    let direction = this.getMouseDirection();
    this.elem.className = 'bot ' + direction.join('-');
  }

  getMouseDirection() {
    let verticalDirection = this.mousePosition.y == this.botPosition.y ? '' : (this.mousePosition.y < this.botPosition.y ? 'up' : 'down');
    let horizontalDirection = this.mousePosition.x == this.botPosition.x ? '' : (this.mousePosition.x < this.botPosition.x ? 'left' : 'right');

    return [verticalDirection, horizontalDirection].filter(v => v);
  }

}