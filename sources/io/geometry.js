'use strict';

// window.innerWidth

let distance = (a, b) => Math.sqrt((e => e * e)(a.x - b.x) + (e => e * e)(a.x - b.y));

// Находит точку пересечения линий
let _intersect2d = function(p1a, p1b, p2a, p2b) { // A_start5[1, 1], A_end[1, 1], B_start[1, 1], B_end[1, 1]

	let epsilon = 1e-12;
	let subtract = (a, b) => [a[0] - b[0], a[1] - b[1]];
	let add      = (a, b) => [a[0] + b[0], a[1] + b[1]];
	let multiply = (a, b) => [a[0] * b   , a[1] * b   ];

	let o1 = p1a; // copy A_start
	let o2 = p2a; // copy B_start
	let d1 = subtract(o1, p1b);
	let d2 = subtract(o2, p2b);
	let det = d1[0] * d2[1] - d2[0] * d1[1];

	if (Math.abs(det) < epsilon) {
		return null;
	}

	let t = (d2[0] * o1[1] - d2[1] * o1[0] - d2[0] * o2[1] + d2[1] * o2[0]) / det;

	return add(multiply(d1, t), o1);
};

let intersect = (a1, a2, b1, b2) => _intersect2d([a1.x, a1.y], [b1.x, b1.y], [a2.x, a2.y], [b2.x, b2.y]);

export default {
	"distance"  : distance ,
	"intersect" : intersect
}