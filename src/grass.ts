class Grass {
  ctx: CanvasRenderingContext2D;
  canvasHeight: number;
  x: number;
  y: number;
  seg1: number;
  seg2: number;
  width: number;
  maxAngle: number;
  currentAngle: number;
  gradient: CanvasGradient;
  counter: number;
  delta: number;
  angle: number;
  diff: number;
  goal: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasHeight: number,
    x: number,
    y: number,
    seg1: number,
    seg2: number,
    maxAngle: number,
    width: number
  ) {
    this.ctx = ctx;
    this.canvasHeight = canvasHeight;
    this.x = x;
    this.y = y;
    this.seg1 = seg1;
    this.seg2 = seg2;
    this.width = width;
    this.maxAngle = maxAngle;

    this.currentAngle = 0;
    this.gradient = this.getGradient(Math.random() * 50 + 50, 100 * Math.random() + 170);
    this.counter = 0;
    this.delta = 0;
    this.angle = 0;
    this.diff = 0;
    this.goal = this.getAngle();

    this.newGoal();
  }

  getAngle() {
    return this.maxAngle * Math.random();
  }

  easeInOut(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  newGoal() {
    this.angle = this.goal;
    this.currentAngle = this.angle;
    this.goal = this.getAngle();
    this.diff = this.goal - this.angle;
    this.counter = 0;

    this.delta = (4 * Math.random() + 1) / 250;
  }

  getGradient(min: number, max: number) {
    let g = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    g.addColorStop(1, `rgb(0, ${Math.round(min)}, 0)`);
    g.addColorStop(0, `rgb(0, ${Math.round(max)}, 0)`);

    return g;
  }

  update() {
    this.counter += this.delta;

    if (this.counter > 1) {
      this.newGoal();
      return;
    }

    let t = this.easeInOut(this.counter);
    this.currentAngle = this.angle + t * this.diff;
  }
}

export function wavingGrass() {
  const canvas = document.getElementById("grass") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const grassCount = 250;

  // Create all the grass
  function makeGrass() {
    const grassWidth = 6;
    const grassHeight = canvasHeight * 0.8;
    const heightVariation = 0.3;

    // setup variables
    const finalHeight = grassHeight * heightVariation;
    const grass = [];

    // generate grass
    for (let i = 0; i < grassCount; i++) {
      const x = canvasWidth * Math.random();
      const y = grassHeight - finalHeight * Math.random();

      const seg1 = y / 3 + y * heightVariation * Math.random() * 0.1;
      const seg2 = (y / 3) * 2 + y * heightVariation * Math.random() * 0.1;

      const maxAngle = 15 * Math.random() + 50;

      grass.push(new Grass(ctx, canvasHeight, x, y, seg1, seg2, maxAngle, grassWidth));
    }

    return grass;
  }
  const grass = makeGrass();

  // render all the grass
  function renderGrass() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // loops through the grass object and renders current state
    for (const gr of grass) {
      const { x, y, width } = gr;

      ctx.beginPath();

      /// calculates the end-point based on length and angle
      /// Angle is limited [0, 60] which we add 225 deg. to get
      /// it upwards. Alter 225 to make grass lean more to a side.
      const pos = lineToAngle(x, canvasHeight, y, gr.currentAngle + 225);

      /// diff between end point and root point
      const diff = pos[0] - x;

      const pts = [];

      /// starts at bottom, goes to top middle and then back
      /// down with a slight offset to make the grass

      pts.push(x); /// first couple at bottom
      pts.push(canvasHeight);

      /// first segment 1/4 of the difference
      pts.push(x + diff / 4);
      pts.push(canvasHeight - gr.seg1);

      /// second segment 2/3 of the difference
      pts.push(x + (diff / 3) * 2);
      pts.push(canvasHeight - gr.seg2);

      pts.push(pos[0]); /// top point
      pts.push(pos[1]);

      /// re-use previous data, but go backward down to root again
      /// with a slight offset

      pts.push(x + (diff / 3) * 2 + width * 0.5);
      pts.push(canvasHeight - gr.seg2);

      pts.push(x + diff / 4 + width * 0.6);
      pts.push(canvasHeight - gr.seg1 + 10);

      pts.push(x + width); /// end couple at bottom
      pts.push(canvasHeight);

      /// smooth points (extended context function, see demo)
      // @ts-ignore
      ctx.curve(pts, 0.8, 5);

      ctx.closePath();

      /// fill grass with its gradient
      ctx.fillStyle = gr.gradient;
      ctx.fill();
    }
  }

  function animate() {
    /// update each grass objects
    for (const gr of grass) {
      gr.update();
    }

    // render them
    renderGrass();

    requestAnimationFrame(animate);
  }
  animate();
}

function lineToAngle(x1: number, y1: number, length: number, angle: number) {
  angle = (angle * Math.PI) / 180;

  const x2 = x1 + length * Math.cos(angle);
  const y2 = y1 + length * Math.sin(angle);

  return [x2, y2];
}

// @ts-ignore
CanvasRenderingContext2D.prototype.curve = function (pts: number[], ts: number, nos: number) {
  let _pts = [],
    res = [], // clone array
    t1x,
    t2x,
    t1y,
    t2y, // tension vectors
    c1,
    c2,
    c3,
    c4, // cardinal points
    st,
    st2,
    st3,
    st23,
    st32, // steps
    t,
    i,
    l = pts.length,
    pt1,
    pt2,
    pt3,
    pt4;

  _pts.push(pts[0]); //copy 1. point and insert at beginning
  _pts.push(pts[1]);

  _pts = _pts.concat(pts);

  _pts.push(pts[l - 2]); //copy last point and append
  _pts.push(pts[l - 1]);

  this.moveTo(pts[0], pts[1]);

  for (i = 2; i < l; i += 2) {
    pt1 = _pts[i];
    pt2 = _pts[i + 1];
    pt3 = _pts[i + 2];
    pt4 = _pts[i + 3];

    // calc tension vectors
    t1x = (pt3 - _pts[i - 2]) * ts;
    t2x = (_pts[i + 4] - pt1) * ts;

    t1y = (pt4 - _pts[i - 1]) * ts;
    t2y = (_pts[i + 5] - pt2) * ts;

    for (t = 0; t <= nos; t++) {
      // pre-calc steps
      st = t / nos;
      st2 = st * st;
      st3 = st2 * st;
      st23 = st3 * 2;
      st32 = st2 * 3;

      // calc cardinals
      c1 = st23 - st32 + 1;
      c2 = st32 - st23;
      c3 = st3 - 2 * st2 + st;
      c4 = st3 - st2;

      res.push(c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x);
      res.push(c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y);
    }
  }

  l = res.length;
  for (i = 0; i < l; i += 2) {
    this.lineTo(res[i], res[i + 1]);
  }
};
