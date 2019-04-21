import * as d3 from 'd3';

import BaseDots from "./basedots";
import Spectral from "./spectral";

var baseDots = new BaseDots();

export function viewFactory(state) {
  switch (state) {
    case "view1":
      return new View1(baseDots);
    case "view2":
      return new View2(baseDots);
    case "view3":
      return new View3(baseDots);
    case "view4":
      return new View4(baseDots);
    default:
      return new View1(baseDots);
  }
}

function squareLayout() {
  var points = [];
  var offsetX = 10;
  var offsetY = 10;
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      points.push({ x: i * 10 + offsetX, y: j * 10 + offsetY });
    }
  }
  return points;
}

export class View1 {
  constructor(baseDots) {
    this.baseDots = baseDots;
    // make a box layout
    this.points = squareLayout();
  }

  enter() {
    return new Promise((res, rej) => {
      this.baseDots.setPoints(this.points).then(() => {
        this.baseDots.jitter(true);
        res();
      });
    });
  }

  exit(cb) {
    return new Promise((res, rej) => {
      this.baseDots.jitter(false);
      res();
    });
  }

  draw(context, t) {
    this.baseDots.draw(context, t);
  }
}

export class View2 {
  constructor(baseDots) {
    this.baseDots = baseDots;

    this.points = d3.shuffle(
      d3.range(49).map(d => {
        return {
          x: d * 10,
          y: 20
        };
      })
    );

    this.spectral = new Spectral(this.baseDots.selection());
  }

  enter() {
    return new Promise((res, rej) => {
      this.baseDots.setPoints(this.points).then(() => {
        this.spectral.fadeIn(res);
      });
    });
  }

  exit() {
    return new Promise((res, rej) => {
      this.spectral.fadeOut(res);
    });
  }

  draw(context, t) {
    this.baseDots.draw(context, t);
    this.spectral.draw(context, t);
  }
}

export class View3 {
  constructor(baseDots) {
    this.baseDots = baseDots;
    this.points = squareLayout();
  }

  enter() {
    return new Promise((res, rej) => {
      this.baseDots.setPointsRotated(this.points).then(() => {
        this.baseDots.undulate(true);
        res();
      });
    });
  }

  exit() {
    return new Promise((res, rej) => {
      this.baseDots.undulate(false);
      res();
    });
  }

  draw(context, t) {
    this.baseDots.draw(context, t);
  }
}

export class View4 {
  constructor(baseDots) {
    this.baseDots = baseDots;

    this.points = d3.shuffle(
      d3.range(49).map(d => {
        return {
          x: 20,
          y: d * 10
        };
      })
    );

    this.spectral = new Spectral(this.baseDots.selection(), 'right');
  }

  enter() {
    return new Promise((res, rej) => {
      this.baseDots.setPoints(this.points).then(() => {
        this.spectral.fadeIn(res);
      });
    });
  }

  exit() {
    return new Promise((res, rej) => {
      this.spectral.fadeOut(res);
    });
  }

  draw(context, t) {
    this.baseDots.draw(context, t);
    this.spectral.draw(context, t);
  }
}
