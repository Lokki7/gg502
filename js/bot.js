class Bot {

  constructor(selector, startPosition) {
    this.elem = document.querySelector(selector);

    this.startPosition = startPosition;

    this.botPosition = {...this.startPosition};
    this.targetPosition = {...this.startPosition};

    this.speed = 1;

    this.placeInPosition();
    this.arrivedCallback = () => {};

    // this.idleTimeout = 0;

    this.move();
  }

  display() {
    this.elem.style.display = 'block';
  }

  goTo(x ,y) {
    this.targetPosition = {x, y};
    return new Promise(resolve => this.arrivedCallback = resolve);
  }

  abort() {
    this.targetPosition = {...this.botPosition};
  }

  placeInPosition() {
    this.elem.style.top = this.botPosition.y + 'px';
    this.elem.style.left = this.botPosition.x + 'px';
  }

  // bindMouse() {
  //   let func = throttle((e) => this.onMouseMove(e), 100);
  //   document.addEventListener('mousemove', func);
  // }

  // onMouseMove(event) {
  //   this.mousePosition = {x: event.pageX, y: event.pageY};
  //   this.rotate();
  // }

  // moveBack() {
  //   this.mousePosition = {x: this.startPosition.x, y: this.startPosition.y};
  // }

  move() {
    setTimeout(() => this.move(), 7);

    let direction = this.getMouseDirection();

    if (!direction.length) {
      this.arrivedCallback();

      // if (!this.idleTimeout) {
      //   this.idleTimeout = setTimeout(() => this.moveBack(), 5000);
      // }
      return;
    }

    let hasDir = side => direction.includes(side);

    clearTimeout(this.idleTimeout);
    this.idleTimeout = false;

    let yModifier = !hasDir('left') && !hasDir('right') ? 1 : 0.5;

    if (hasDir('up')) {
      this.botPosition.y -= this.speed * yModifier;
    }
    if (hasDir('down')) {
      this.botPosition.y += this.speed * yModifier;
    }
    if (hasDir('right')) {
      this.botPosition.x += this.speed;
    }
    if (hasDir('left')) {
      this.botPosition.x -= this.speed;
    }

    this.placeInPosition();
    this.rotate(direction);
  }


  rotate(direction) {
    this.elem.className = 'bot ' + direction.join('-');
  }

  getMouseDirection() {
    let verticalDiff = Math.floor(this.targetPosition.y - this.botPosition.y);
    let horizontalDiff = Math.floor(this.targetPosition.x - this.botPosition.x);

    let verticalDirection = verticalDiff == 0 ? '' : (verticalDiff < 0 ? 'up' : 'down');
    let horizontalDirection = horizontalDiff == 0 ? '' : (horizontalDiff < 0 ? 'left' : 'right');

    return [verticalDirection, horizontalDirection].filter(v => v);
  }

}