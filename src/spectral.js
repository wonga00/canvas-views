import * as d3 from 'd3';

const phase = d3
  .scaleOrdinal()
  .range(d3.range(100).map(() => Math.random() * 1000));

function noise(A, t, phase) {
  const f = 0.02;
  return A * Math.sin(f * t + phase);
}

function ease(easing, duration, fn, cb) {
  var timer = d3.timer(elapsed => {
    const t = Math.min(1, easing(elapsed / duration));
    fn(t);
    if (t === 1) {
      timer.stop();
      if (cb) {
        cb();
      }
    }
  });
  return timer;
}

export default class Spectral {
  constructor(selection, direction) {
    this.selection = selection;
    this.on = false;
    this.direction = direction || 'down'; // or 'right'
  }

  fadeIn(cb) {
    this.on = true;
    ease(
      d3.easeLinear,
      1000,
      t => {
        this.spectralAlpha = t;
      },
      cb
    );
  }

  fadeOut(cb) {
    this.on = true;
    ease(
      d3.easeLinear,
      1000,
      t => {
        this.spectralAlpha = 1 - t;
      },
      () => {
        this.on = false;
        cb();
      }
    );
  }

  draw(context, t) {
    if (!this.on) {
      return;
    }
    const toRight = this.direction == 'right';

    context.save();
    var alpha = this.spectralAlpha;
    this.selection.each(function(d, i) {
      var node = d3.select(this);
      var x = +node.attr("x");
      var y = +node.attr("y");
      context.globalAlpha = alpha;
      context.fillStyle = "red";
      context.fillRect(
        x + (toRight ? 10 : 2),
        y + (toRight ? 2 : 10),
        toRight ? (y / 10) * alpha + noise(y / 140, t, phase(i)) : 1,
        toRight ? 1: (x / 10) * alpha + noise(x / 140, t, phase(i))
      );
    });
    context.restore();
  }
}
