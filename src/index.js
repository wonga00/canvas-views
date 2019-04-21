import React from "react";
import ReactDOM from "react-dom";
import * as d3 from 'd3';
import { viewFactory } from "./views";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      view: "view1"
    };
  }

  render() {
    const { view } = this.state;

    return (
      <div className="section">
        <div className="container">
          <h1 className="title">Canvas Views</h1>
          <div className="buttons">
            {["view1", "view2", "view3", "view4"].map(v => (
              <a
                key={v}
                className={"button" + ((view == v ) ? " is-active" : "")}
                onClick={() => this.setState({ view: v })}
              >
                {v}
              </a>
            ))}
          </div>
        </div>
        <div className="section">
          <div className="container">
            <CanvasView view={view} />
          </div>
        </div>
      </div>
    );
  }
}

class CanvasView extends React.Component {
  constructor() {
    super();
    this.currentView;
    this.width = 1000;
    this.height = 800;
  }

  componentDidMount() {
    const { view } = this.props;
    this.currentView = viewFactory(view);
    this.currentView.enter();
    d3.timer((elapsed) => this.draw(elapsed));
  }

  componentDidUpdate(prevProps, prevState) {
    const { view } = this.props;
    if (view != prevProps.view) {
      this.currentView.exit().then(() => {
        var v = viewFactory(view);
        v.enter();
        this.currentView = v;
      });
    }
  }

  draw(t) {
    var ctx = this.refs.canvas.getContext("2d");

    ctx.clearRect(0, 0, this.width, this.height);
    this.currentView.draw(ctx, t);
  }

  render() {
    return <canvas ref="canvas" width={this.width} height={this.height} />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
