import * as d3 from 'd3';

function basicTransform(d) {
  return {
    x: d.x,
    y: d.y
  };
}

function weirdTransform(d) {
  return {
    x: d.y + d.x * 2,
    y: d.y - d.x
  };
}

const phase = d3
  .scaleOrdinal()
  .range(d3.range(100).map(() => Math.random() * 5));

const freqScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0.01, 0.02]);

const freq = d3
  .scaleOrdinal()
  .range(d3.range(100).map(() => freqScale(Math.random())));

function noise(A, t, phase, f) {
  phase = phase || 0;
  f = f || 0.02;
  return A * Math.sin(f * t + phase);
}

export default class BaseDots {
  constructor() {
    this.custom = d3.select(document.createElement('custom'))
    this._jitter = false;
    this._undulate = false;
    this.transform = basicTransform;
  }

  selection() {
    return this.custom.selectAll('.dot');
  }

  setPoints(points, transform) {
    this.points = points;
    this.transform = basicTransform;
    return this.update();
  }

  setPointsRotated(points) {
    this.points = points;
    this.transform = weirdTransform;
    return this.update();
  }

  update() {
    var points = this.points;
    var transform = this.transform;
    var p = this.custom.selectAll(".dot").data(points);

    p.exit()
      .transition()
      .duration(800)
      .attr("x", 1000)
      .attr("y", 1000)
      .remove();

    return p.enter()
      .append("thing")
      .classed("dot", true)
      .attr("width", 4)
      .attr('height', 4)
      .merge(p)
      .transition()
      .delay((d, i) => i * 15)
      .duration(800)
      .attr("x", d => transform(d).x)
      .attr("y", d => transform(d).y)
      .attr("opacity", 1)
      .end();
  }

  jitter(on) {
    this._jitter = on;
  }

  undulate(on) {
    this._undulate = on;
  }

  draw(context, t) {
    const boxWidth = 4;
    context.save();
    var that = this;
    this.custom.selectAll(".dot").each(function(d, i) {
      var node = d3.select(this);
      var x = +node.attr("x");
      var y = +node.attr("y");
      var bump = that._jitter ? Math.random() * 2 : 0;
      var offsetY = that._undulate ? noise(phase(x), t, 0, freq(x)) : 0;
      context.beginPath();
      context.fillStyle = "#333";
      context.globalAlpha = +node.attr("opacity") || 1;
      context.rect(
        x - bump / 2,
        y - bump / 2 + offsetY,
        +node.attr("width") + bump,
        +node.attr("height") + bump
      );
      context.fill();
    });
    context.restore();
  }
}
