/* adaptive timing, ticks every 1/f timeframe,
 * skips partial frames
 */

var TICK = {};
TICK.tock = function (f, callee) {
	var T = 1000 / f;
	(function ___() {
		var u = T, t = Date.now();
		callee();
		t = Date.now() - t;
		for (; t > u; u += T);
		window.setTimeout(___, u - t);
	})();
}

var CUBE = function (q) {
	/* helper */
	function x__x (x, y, z) {
		var b = x + 16 * y, c = ((b << 16) & 0xff0000) | ((b << 8) & 0xff00) | (b & 0xff);
		var p = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: c/*, wireframe: 1*/ }));
		p.position = new THREE.Vector3(x, y, z);
		return p;
	}

	/* cubic */
	this.c = new THREE.Object3D();
	for (var o = 0; o < 256; ++o) {
		this.c.add(x__x(Math.floor(o / 16), o % 16,  0));
		this.c.add(x__x(Math.floor(o / 16), o % 16, 15));
		this.c.add(x__x( 0, Math.floor(o / 16), o % 16));
		this.c.add(x__x(15, Math.floor(o / 16), o % 16));
		this.c.add(x__x(Math.floor(o / 16),  0, o % 16));
		this.c.add(x__x(Math.floor(o / 16), 15, o % 16));
	}
	this.c.position = new THREE.Vector3(0, 2, 0);

	/* eyes */
	this.e = new THREE.PerspectiveCamera(45, q.width / q.height, 1.1, 300);
	this.e.lookAt(new THREE.Vector3(-15, -15, -15));
	this.e.position = new THREE.Vector3(30, 30, 30);

	/* scene */
	this.s = new THREE.Scene();
	this.s.add(this.e);
	this.s.add(this.c);

	/* webgl */
	this.w = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, clearColor: q.background, clearAlpha: 1.0 });
	this.w.setSize(q.width, q.height);

	q.wrapper.appendChild(this.w.domElement);

	/* helper */
	this.f = 1;
	this.___ = function () {
		this.w.render(this.s, this.e);
		this.c.rotation.y += this.f * q.speed;
		if (this.c.rotation.y > + Math.PI / 3) this.f = -1;
		if (this.c.rotation.y < - Math.PI / 3) this.f = +1;
	}

	TICK.tock(15, this.___.bind(this));

	/* snaphost api */
	this.snapshot = function() {
		return window.open(this.w.domElement.toDataURL());
	}
}
