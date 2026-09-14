import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as useThree, c as Color, f as require_jsx_runtime, i as useFrame, l as TorusGeometry, n as OrbitControls, o as BufferAttribute, r as Canvas, s as BufferGeometry, t as ContactShadows } from "../_libs/@react-three/drei+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C6PQFUVp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium transition-opacity duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 min-h-11 px-4 text-sm", {
	variants: { variant: {
		primary: "bg-accent text-accent-fg hover:opacity-90",
		ghost: "bg-transparent text-fg border border-border hover:bg-elevated",
		quiet: "bg-elevated text-fg border border-border hover:opacity-90"
	} },
	defaultVariants: { variant: "quiet" }
});
function Button({ className, variant, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({ variant }), className),
		...props
	});
}
/**
* Spec spring { tension: 170, friction: 26, mass: 1 }.
* Interpreted as a damped harmonic oscillator:
*   acc = (tension * (target - x) - friction * v) / mass
*/
var spring = {
	standard: {
		tension: 170,
		friction: 26,
		mass: 1
	},
	snap: {
		tension: 170,
		friction: 20,
		mass: 1
	}
};
/**
* Spec inertia: velocity *= 0.92 per frame at 60fps.
* k = -60 * ln(0.92) ≈ 4.997 s^-1
*/
var inertia = {
	dampingPerSecond: 4.997,
	dragGain: .005
};
/**
* Spec morph/slider lerp 0.1 per frame at 60fps
* => time constant τ ≈ 158ms.
*/
var follow = {
	morphTau: .158,
	scaleTau: .102,
	fadeTau: .158,
	hoverTau: .04
};
var budgets = {
	canvasFps: 60,
	overlayFps: 30,
	frameMs: 16.67,
	ackMs: 16,
	feedbackMs: 100,
	transitionMs: 300,
	landingMs: 500,
	hoverGpuMs: 16,
	morphMs: {
		min: 200,
		max: 400
	}
};
var reducedMotion = {
	maxDurationMs: 80,
	disableInertia: true,
	disableElasticOvershoot: true,
	disableHoverLift: true
};
/** Exponential follow. Replaces spec `x += (t-x)*0.1`. Interruptible: only target changes. */
function follow1(current, target, dt, tau = follow.morphTau) {
	if (tau <= 0) return target;
	const a = 1 - Math.exp(-dt / tau);
	return current + (target - current) * a;
}
/** Semi-implicit Euler spring. Spec spring token. */
function stepSpring(x, v, target, dt, cfg = spring.standard) {
	const nv = v + (cfg.tension * (target - x) - cfg.friction * v) / cfg.mass * dt;
	return {
		x: x + nv * dt,
		v: nv
	};
}
/** Spec inertia with real time: v *= exp(-k dt). */
function stepInertia(position, velocity, dt, k = inertia.dampingPerSecond) {
	const v = velocity * Math.exp(-k * dt);
	return {
		position: position + v * dt,
		velocity: Math.abs(v) < 1e-5 ? 0 : v
	};
}
function clamp(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function ParamSlider({ label, unit, value, min, max, step = .1, onTarget }) {
	const decimals = step >= 1 ? 0 : step >= .1 ? 1 : step >= .01 ? 2 : 3;
	const shown = Number(value.toFixed(decimals));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 font-mono text-xs tabular-nums text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min,
					max,
					step,
					value: shown,
					onChange: (e) => {
						const n = Number(e.target.value);
						if (!Number.isFinite(n)) return;
						onTarget(clamp(n, min, max));
					},
					"aria-label": `${label} numeric`,
					className: "h-8 w-20 rounded-[var(--radius-sm)] border border-border bg-elevated px-2 text-right text-fg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "not-italic text-subtle",
					children: unit ?? ""
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onInput: (e) => onTarget(Number(e.target.value)),
			className: "h-11 w-full accent-accent",
			"aria-valuemin": min,
			"aria-valuemax": max,
			"aria-valuenow": value,
			"aria-label": label
		})]
	});
}
var TABLE = {
	idle: { ENTER_WORKSPACE: {
		to: "editing",
		motion: "landing"
	} },
	editing: {
		POINTER_DOWN_MESH: {
			to: "manipulating",
			motion: "none"
		},
		PARAM_CHANGE: {
			to: "editing",
			motion: "none"
		},
		RUN_SIM: {
			to: "simulating",
			motion: "mode"
		},
		OPEN_EXPORT: {
			to: "exporting",
			motion: "sheet"
		}
	},
	manipulating: {
		POINTER_UP: {
			to: "editing",
			motion: "none"
		},
		CANCEL: {
			to: "editing",
			motion: "kill"
		}
	},
	simulating: {
		EXIT_SIM: {
			to: "editing",
			motion: "mode"
		},
		CANCEL: {
			to: "editing",
			motion: "kill"
		},
		OPEN_EXPORT: {
			to: "exporting",
			motion: "sheet"
		}
	},
	exporting: {
		CLOSE_EXPORT: {
			to: "editing",
			motion: "sheet"
		},
		CANCEL: {
			to: "editing",
			motion: "kill"
		}
	}
};
function reduceState(state, event) {
	const edge = TABLE[state][event.type];
	if (!edge) return null;
	return {
		from: state,
		to: edge.to,
		event: event.type,
		motion: edge.motion
	};
}
var BRACKET_DEFAULTS = {
	width: 80,
	height: 50,
	thickness: 6,
	fillet: 4,
	holeCount: 2,
	holeRadius: 3.5
};
var BRACKET_LIMITS = {
	width: {
		min: 40,
		max: 160
	},
	height: {
		min: 30,
		max: 90
	},
	thickness: {
		min: 3,
		max: 16
	},
	fillet: {
		min: 0,
		max: 12
	},
	holeCount: {
		min: 1,
		max: 4
	},
	holeRadius: {
		min: 1.5,
		max: 6
	}
};
function holeRadiusAt(params, index) {
	return index < Math.round(params.holeCount) ? params.holeRadius : 0;
}
function holeCenters(params) {
	const inset = 12;
	const w = params.width;
	const h = params.height;
	return [
		[-w / 2 + inset, h / 2 - inset],
		[w / 2 - inset, h / 2 - inset],
		[-w / 2 + inset, -h / 2 + inset],
		[w / 2 - inset, -h / 2 + inset]
	];
}
/** Rough volume used as a continuity check, not a CAD kernel. */
function estimateVolumeMm3(p) {
	const plate = p.width * p.height * p.thickness;
	let holes = 0;
	for (let i = 0; i < 4; i++) {
		const r = holeRadiusAt(p, i);
		holes += Math.PI * r * r * p.thickness;
	}
	return Math.max(0, plate - holes);
}
var useBracketStore = create((set, get) => ({
	ui: "editing",
	targets: {
		...BRACKET_DEFAULTS,
		emissive: 0,
		pathProgress: 0,
		orbitImpulse: 0
	},
	display: {
		...BRACKET_DEFAULTS,
		emissive: 0,
		pathProgress: 0,
		orbit: 0
	},
	setParam(k, n) {
		const lim = BRACKET_LIMITS[k];
		const v = clamp(n, lim.min, lim.max);
		set((s) => ({ targets: {
			...s.targets,
			[k]: v,
			emissive: 1
		} }));
		get().dispatch({ type: "PARAM_CHANGE" });
	},
	dispatch(e) {
		const t = reduceState(get().ui, e);
		if (!t) return;
		set((s) => {
			const next = {
				...s,
				ui: t.to
			};
			if (e.type === "RUN_SIM") next.targets = {
				...s.targets,
				pathProgress: 1
			};
			if (e.type === "EXIT_SIM" || e.type === "CANCEL") next.targets = {
				...s.targets,
				pathProgress: 0
			};
			return next;
		});
	},
	setDisplay(d) {
		set({ display: d });
	}
}));
var LAMP_DEFAULTS = {
	height: 420,
	shadeRadius: 160,
	neckBend: 12,
	temperature: 2700
};
var LAMP_LIMITS = {
	height: {
		min: 280,
		max: 620
	},
	shadeRadius: {
		min: 90,
		max: 240
	},
	neckBend: {
		min: -28,
		max: 36
	},
	temperature: {
		min: 2200,
		max: 5e3
	}
};
var useLampStore = create((set) => ({
	targets: { ...LAMP_DEFAULTS },
	display: { ...LAMP_DEFAULTS },
	setParam(k, n) {
		const lim = LAMP_LIMITS[k];
		set((s) => ({ targets: {
			...s.targets,
			[k]: clamp(n, lim.min, lim.max)
		} }));
	},
	setDisplay(d) {
		set({ display: d });
	}
}));
var RING_DEFAULTS = {
	innerRadius: 8.1,
	shankWidth: 4,
	shankThickness: 1.8,
	twist: 0,
	metalHue: .12,
	polish: .72
};
var RING_LIMITS = {
	innerRadius: {
		min: 7.2,
		max: 10.2
	},
	shankWidth: {
		min: 2,
		max: 8
	},
	shankThickness: {
		min: 1,
		max: 3.2
	},
	twist: {
		min: -35,
		max: 35
	},
	metalHue: {
		min: .05,
		max: .18
	},
	polish: {
		min: .15,
		max: 1
	}
};
/** Circumference estimate — not a mandrel table. */
function usSizeFromBore(innerRadiusMm) {
	return (2 * Math.PI * innerRadiusMm - 36.5) / 2.547;
}
var useRingStore = create((set) => ({
	targets: { ...RING_DEFAULTS },
	display: { ...RING_DEFAULTS },
	setParam(k, n) {
		const lim = RING_LIMITS[k];
		set((s) => ({ targets: {
			...s.targets,
			[k]: clamp(n, lim.min, lim.max)
		} }));
	},
	setDisplay(d) {
		set({ display: d });
	}
}));
function insideRoundRect(x, y, w, h, f) {
	const ax = Math.abs(x);
	const ay = Math.abs(y);
	const hw = w / 2;
	const hh = h / 2;
	const fil = Math.max(0, Math.min(f, hw - .1, hh - .1));
	if (ax > hw || ay > hh) return false;
	if (ax <= hw - fil || ay <= hh - fil) return true;
	const dx = ax - (hw - fil);
	const dy = ay - (hh - fil);
	return dx * dx + dy * dy <= fil * fil;
}
function inHole(x, y, holes) {
	for (const h of holes) {
		if (h.r < .05) continue;
		const dx = x - h.x;
		const dy = y - h.y;
		if (dx * dx + dy * dy <= h.r * h.r) return true;
	}
	return false;
}
function tessellatePlate(spec) {
	const pitch = spec.pitch ?? Math.max(1.2, Math.min(spec.width, spec.height) / 48);
	const nx = Math.max(8, Math.ceil(spec.width / pitch));
	const ny = Math.max(8, Math.ceil(spec.height / pitch));
	const solid = [];
	const xs = [];
	const ys = [];
	for (let i = 0; i <= nx; i++) xs.push(-spec.width / 2 + i / nx * spec.width);
	for (let j = 0; j <= ny; j++) ys.push(-spec.height / 2 + j / ny * spec.height);
	for (let i = 0; i <= nx; i++) {
		solid[i] = [];
		for (let j = 0; j <= ny; j++) solid[i][j] = insideRoundRect(xs[i], ys[j], spec.width, spec.height, spec.fillet) && !inHole(xs[i], ys[j], spec.holes);
	}
	const pos = [];
	const idx = [];
	const z0 = 0;
	const z1 = spec.thickness;
	const pushQuad = (ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) => {
		const b = pos.length / 3;
		pos.push(ax, az, ay, bx, bz, by, cx, cz, cy, dx, dz, dy);
		idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
	};
	for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
		const a = solid[i][j];
		const b = solid[i + 1][j];
		const c = solid[i + 1][j + 1];
		const d = solid[i][j + 1];
		if (a && b && c && d) {
			pushQuad(xs[i], ys[j], z1, xs[i + 1], ys[j], z1, xs[i + 1], ys[j + 1], z1, xs[i], ys[j + 1], z1);
			pushQuad(xs[i], ys[j], z0, xs[i], ys[j + 1], z0, xs[i + 1], ys[j + 1], z0, xs[i + 1], ys[j], z0);
		}
		if (a && d && !(b && c)) pushQuad(xs[i + 1], ys[j], z0, xs[i + 1], ys[j + 1], z0, xs[i + 1], ys[j + 1], z1, xs[i + 1], ys[j], z1);
		if (b && c && !(a && d)) pushQuad(xs[i], ys[j], z0, xs[i], ys[j], z1, xs[i], ys[j + 1], z1, xs[i], ys[j + 1], z0);
		if (a && b && !(d && c)) pushQuad(xs[i], ys[j + 1], z0, xs[i], ys[j + 1], z1, xs[i + 1], ys[j + 1], z1, xs[i + 1], ys[j + 1], z0);
		if (d && c && !(a && b)) pushQuad(xs[i], ys[j], z0, xs[i + 1], ys[j], z0, xs[i + 1], ys[j], z1, xs[i], ys[j], z1);
	}
	return {
		positions: new Float32Array(pos),
		indices: new Uint32Array(idx)
	};
}
function meshToAsciiStl(mesh, name = "part") {
	const { positions: p, indices: ix } = mesh;
	const lines = [`solid ${name}`];
	for (let t = 0; t < ix.length; t += 3) {
		const ia = ix[t] * 3;
		const ib = ix[t + 1] * 3;
		const ic = ix[t + 2] * 3;
		const ax = p[ia], ay = p[ia + 1], az = p[ia + 2];
		const bx = p[ib], by = p[ib + 1], bz = p[ib + 2];
		const cx = p[ic], cy = p[ic + 1], cz = p[ic + 2];
		const ux = bx - ax, uy = by - ay, uz = bz - az;
		const vx = cx - ax, vy = cy - ay, vz = cz - az;
		let nx = uy * vz - uz * vy;
		let ny = uz * vx - ux * vz;
		let nz = ux * vy - uy * vx;
		const len = Math.hypot(nx, ny, nz) || 1;
		nx /= len;
		ny /= len;
		nz /= len;
		lines.push(`  facet normal ${nx} ${ny} ${nz}`);
		lines.push("    outer loop");
		lines.push(`      vertex ${ax} ${ay} ${az}`);
		lines.push(`      vertex ${bx} ${by} ${bz}`);
		lines.push(`      vertex ${cx} ${cy} ${cz}`);
		lines.push("    endloop");
		lines.push("  endfacet");
	}
	lines.push(`endsolid ${name}`);
	return lines.join("\n");
}
async function exportPlateStl(spec, name = "part") {
	const t0 = performance.now();
	const mesh = tessellatePlate(spec);
	return {
		stl: meshToAsciiStl(mesh, name),
		triangles: mesh.indices.length / 3,
		ms: performance.now() - t0,
		via: "main"
	};
}
function downloadText(filename, text) {
	const mime = filename.endsWith(".nc") || filename.endsWith(".gcode") ? "text/plain" : "model/stl";
	const blob = new Blob([text], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function fmt(n) {
	return n.toFixed(3);
}
function postBracketGcode(params, opt = {}) {
	const safeZ = opt.safeZ ?? params.thickness + 5;
	const zCut = 0;
	const feedCut = opt.feedCut ?? 400;
	const feedPlunge = opt.feedPlunge ?? 120;
	const lines = [
		"; fabricate-motion bracket post",
		"; GRBL-ish / G21 mm / G90 abs / G17 XY — preview, not a mill warranty",
		"G21 G90 G17",
		"G0 Z" + fmt(safeZ),
		`M3 S${opt.spindle ?? 8e3}`
	];
	const w = params.width;
	const h = params.height;
	const ring = [
		[-w / 2, -h / 2],
		[w / 2, -h / 2],
		[w / 2, h / 2],
		[-w / 2, h / 2],
		[-w / 2, -h / 2]
	];
	lines.push(`G0 X${fmt(ring[0][0])} Y${fmt(ring[0][1])}`);
	lines.push(`G1 Z${fmt(zCut)} F${feedPlunge}`);
	for (let i = 1; i < ring.length; i++) lines.push(`G1 X${fmt(ring[i][0])} Y${fmt(ring[i][1])} F${feedCut}`);
	lines.push(`G0 Z${fmt(safeZ)}`);
	for (let i = 0; i < 4; i++) {
		const r = holeRadiusAt(params, i);
		if (r <= .1) continue;
		const [cx, cy] = holeCenters(params)[i];
		lines.push(`G0 X${fmt(cx + r)} Y${fmt(cy)}`);
		lines.push(`G1 Z${fmt(zCut)} F${feedPlunge}`);
		lines.push(`G2 X${fmt(cx + r)} Y${fmt(cy)} I${fmt(-r)} J0 F${feedCut}`);
		lines.push(`G0 Z${fmt(safeZ)}`);
	}
	lines.push("M5", "M2");
	return lines.join("\n") + "\n";
}
function parseGcode(src, sample = 2) {
	const pts = [];
	let x = 0, y = 0, z = 0;
	let last = null;
	for (const raw of src.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, "").trim();
		if (!line || line.startsWith("(")) continue;
		const words = line.toUpperCase().split(/\s+/);
		const isArc = words.some((w) => w === "G2" || w === "G02" || w === "G3" || w === "G03");
		if (!(isArc || words.some((w) => w === "G0" || w === "G00" || w === "G1" || w === "G01")) && !words.some((w) => /^[XYZ]/.test(w))) continue;
		let nx = x, ny = y, nz = z;
		let iOff = 0, jOff = 0;
		for (const w of words) {
			if (w.startsWith("X")) nx = parseFloat(w.slice(1));
			if (w.startsWith("Y")) ny = parseFloat(w.slice(1));
			if (w.startsWith("Z")) nz = parseFloat(w.slice(1));
			if (w.startsWith("I")) iOff = parseFloat(w.slice(1));
			if (w.startsWith("J")) jOff = parseFloat(w.slice(1));
		}
		if (Number.isNaN(nx) || Number.isNaN(ny) || Number.isNaN(nz)) continue;
		if (isArc && last) {
			const ccx = last.x + iOff;
			const ccy = last.y + jOff;
			const a0 = Math.atan2(last.y - ccy, last.x - ccx);
			let a1 = Math.atan2(ny - ccy, nx - ccx);
			const cw = words.some((w) => w === "G2" || w === "G02");
			if (cw && a1 >= a0) a1 -= Math.PI * 2;
			if (!cw && a1 <= a0) a1 += Math.PI * 2;
			const rad = Math.hypot(iOff, jOff) || Math.hypot(last.x - ccx, last.y - ccy);
			const arcLen = Math.abs(a1 - a0) * rad;
			const steps = Math.max(8, Math.ceil(arcLen / sample));
			for (let s = 1; s <= steps; s++) {
				const a = a0 + (a1 - a0) * (s / steps);
				pts.push({
					x: ccx + Math.cos(a) * rad,
					y: ccy + Math.sin(a) * rad,
					z: nz
				});
			}
			x = nx;
			y = ny;
			z = nz;
			last = {
				x,
				y,
				z
			};
			continue;
		}
		if (last) {
			const dist = Math.hypot(nx - last.x, ny - last.y, nz - last.z);
			const steps = Math.max(1, Math.ceil(dist / sample));
			for (let s = 1; s <= steps; s++) {
				const t = s / steps;
				pts.push({
					x: last.x + (nx - last.x) * t,
					y: last.y + (ny - last.y) * t,
					z: last.z + (nz - last.z) * t
				});
			}
		} else pts.push({
			x: nx,
			y: ny,
			z: nz
		});
		x = nx;
		y = ny;
		z = nz;
		last = {
			x,
			y,
			z
		};
	}
	return pts;
}
function gcodeToolpath(params) {
	return parseGcode(postBracketGcode(params));
}
var MAX_DT = 1 / 20;
function createClock() {
	let last = 0;
	let paused = false;
	let time = 0;
	return {
		pause(p) {
			paused = p;
			if (!p) last = 0;
		},
		tick(nowMs) {
			if (paused) return {
				time,
				dt: 0,
				paused: true
			};
			const now = nowMs / 1e3;
			const raw = last === 0 ? 1 / 60 : now - last;
			last = now;
			const dt = Math.min(Math.max(raw, 0), MAX_DT);
			time += dt;
			return {
				time,
				dt,
				paused: false
			};
		}
	};
}
function prefersReducedMotion() {
	if (typeof window === "undefined" || !window.matchMedia) return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function hasWebGL() {
	if (typeof document === "undefined") return false;
	try {
		const c = document.createElement("canvas");
		return !!(c.getContext("webgl2") || c.getContext("webgl"));
	} catch {
		return false;
	}
}
function MotionCanvas({ children, step, className, orbitEnabled = true, camera = {
	position: [
		72,
		52,
		108
	],
	target: [
		0,
		3,
		0
	],
	fov: 32
}, shadowScale = 160 }) {
	const [ok, setOk] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setOk(hasWebGL());
	}, []);
	if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full min-h-64 items-center justify-center bg-surface px-6 text-center text-sm text-muted",
		role: "img",
		"aria-label": "3D preview unavailable",
		children: "WebGL is not available. Sliders still write targets; the object is not gone."
	});
	const target = camera.target ?? [
		0,
		0,
		0
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: className ?? "h-full w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			dpr: [1, 1.75],
			gl: {
				antialias: true,
				powerPreference: "high-performance",
				alpha: false,
				preserveDrawingBuffer: true
			},
			camera: {
				position: camera.position,
				fov: camera.fov ?? 32,
				near: .1,
				far: 2e3
			},
			style: {
				width: "100%",
				height: "100%",
				display: "block"
			},
			onCreated: ({ camera: cam }) => {
				cam.lookAt(target[0], target[1], target[2]);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#0a0b0d"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
					"#e4e8ee",
					"#1a1e24",
					.85
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						40,
						80,
						50
					],
					intensity: 1.35
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						-50,
						20,
						-30
					],
					intensity: .4
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {
					position: camera.position,
					target
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockBridge, { step }),
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
					position: [
						0,
						0,
						0
					],
					opacity: .38,
					scale: shadowScale,
					blur: 2.4,
					far: 50,
					color: "#000000"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
					enableDamping: true,
					dampingFactor: .08,
					enabled: orbitEnabled,
					target,
					makeDefault: true
				})
			]
		})
	});
}
function CameraRig({ position, target }) {
	const { camera } = useThree();
	(0, import_react.useLayoutEffect)(() => {
		camera.position.set(position[0], position[1], position[2]);
		camera.lookAt(target[0], target[1], target[2]);
		camera.updateProjectionMatrix();
	}, [
		camera,
		position,
		target
	]);
	return null;
}
function ClockBridge({ step }) {
	const clock = (0, import_react.useRef)(createClock());
	(0, import_react.useEffect)(() => {
		const onVis = () => clock.current.pause(document.hidden);
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, []);
	useFrame(() => {
		const frame = clock.current.tick(performance.now());
		if (prefersReducedMotion()) {
			step({
				...frame,
				dt: Math.min(frame.dt, 1 / 30)
			});
			return;
		}
		step(frame);
	});
	return null;
}
function visibleCount(points, progress01) {
	return Math.floor(Math.min(1, Math.max(0, progress01)) * points.length);
}
function dragVelocity(prev, next) {
	if (!prev) return 0;
	const dt = Math.max(.001, next.t - prev.t);
	return (next.x - prev.x) / dt * inertia.dragGain;
}
var touchMap = {
	pinch: "scale",
	swipe: "rotate",
	tap: "highlight"
};
function isTouchFine() {
	return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}
function createGestureSession(handlers) {
	let prev = null;
	let lastPinch = 0;
	return {
		pointerDown(x, y) {
			prev = {
				x,
				y,
				t: performance.now() / 1e3
			};
		},
		pointerMove(x, y) {
			const next = {
				x,
				y,
				t: performance.now() / 1e3
			};
			const dv = dragVelocity(prev, next);
			if (dv) handlers.rotate(dv);
			prev = next;
		},
		pointerUp() {
			prev = null;
		},
		tap() {
			handlers.highlight();
		},
		pinch(distance) {
			if (lastPinch && lastPinch > 0) handlers.scale(distance / lastPinch);
			lastPinch = distance;
		},
		pinchEnd() {
			lastPinch = 0;
		},
		touchMap
	};
}
function makeChannel(id, value = 0, kind = "follow") {
	return {
		id,
		kind,
		value,
		target: value,
		velocity: 0,
		tau: follow.morphTau,
		spring: spring.standard,
		restEps: .001
	};
}
function setTarget(ch, target) {
	ch.target = target;
}
function impulse(ch, dv) {
	ch.kind = "inertia";
	ch.velocity += dv;
}
function stepChannel(ch, dt) {
	if (dt <= 0) return ch;
	switch (ch.kind) {
		case "hold":
			ch.value = ch.target;
			ch.velocity = 0;
			break;
		case "follow":
			ch.value = follow1(ch.value, ch.target, dt, ch.tau);
			ch.velocity = 0;
			break;
		case "spring": {
			const s = stepSpring(ch.value, ch.velocity, ch.target, dt, ch.spring);
			ch.value = s.x;
			ch.velocity = s.v;
			break;
		}
		case "inertia": {
			const s = stepInertia(ch.value, ch.velocity, dt);
			ch.value = s.position;
			ch.velocity = s.velocity;
			if (s.velocity === 0) ch.kind = "follow";
			break;
		}
	}
	return ch;
}
var ChannelTable = class {
	channels = /* @__PURE__ */ new Map();
	reducedApplied = false;
	constructor(defs) {
		for (const d of defs) {
			const ch = makeChannel(d.id, d.initial ?? 0, d.kind ?? "follow");
			if (d.tau != null) ch.tau = d.tau;
			if (d.spring) ch.spring = d.spring;
			if (d.restEps != null) ch.restEps = d.restEps;
			this.channels.set(d.id, ch);
		}
	}
	get(id) {
		const ch = this.channels.get(id);
		if (!ch) throw new Error(`unknown channel ${id}`);
		return ch;
	}
	setTargets(targets) {
		for (const [k, v] of Object.entries(targets)) {
			const ch = this.channels.get(k);
			if (ch) setTarget(ch, v);
		}
	}
	impulse(id, dv) {
		impulse(this.get(id), dv);
	}
	step(dt) {
		const out = {};
		for (const [id, ch] of this.channels) {
			stepChannel(ch, dt);
			out[id] = ch.value;
		}
		return out;
	}
	lastPublish = 0;
	publish(nowMs, hz = 10) {
		const min = 1e3 / hz;
		if (nowMs - this.lastPublish < min) return null;
		this.lastPublish = nowMs;
		return this.values();
	}
	values() {
		const out = {};
		for (const [id, ch] of this.channels) out[id] = ch.value;
		return out;
	}
};
var defaultFollow = (id, initial, tau = follow.morphTau) => ({
	id,
	kind: "follow",
	tau,
	initial
});
var defaultSpring = (id, initial, cfg = spring.standard) => ({
	id,
	kind: "spring",
	spring: cfg,
	initial
});
var defaultInertia = (id, initial = 0) => ({
	id,
	kind: "inertia",
	initial
});
var originals = /* @__PURE__ */ new WeakMap();
function applyReducedMotion(table) {
	if (table.reducedApplied) return;
	const snap = /* @__PURE__ */ new Map();
	const tau = reducedMotion.maxDurationMs / 1e3;
	for (const [id, ch] of table.channels) {
		snap.set(id, {
			kind: ch.kind,
			tau: ch.tau
		});
		ch.tau = Math.min(ch.tau, tau);
		if (reducedMotion.disableInertia && ch.kind === "inertia") {
			ch.kind = "follow";
			ch.velocity = 0;
		}
		if (reducedMotion.disableElasticOvershoot && ch.kind === "spring") {
			ch.kind = "follow";
			ch.velocity = 0;
			ch.tau = Math.min(ch.tau, tau);
		}
	}
	originals.set(table, snap);
	table.reducedApplied = true;
}
function restoreMotion(table) {
	const snap = originals.get(table);
	if (!snap || !table.reducedApplied) return;
	for (const [id, s] of snap) {
		const ch = table.channels.get(id);
		if (!ch) continue;
		ch.kind = s.kind;
		ch.tau = s.tau;
	}
	table.reducedApplied = false;
}
function syncReducedMotion(table, reduced) {
	if (reduced) applyReducedMotion(table);
	else restoreMotion(table);
}
var bracketTable = new ChannelTable([
	defaultFollow("width", BRACKET_DEFAULTS.width),
	defaultFollow("height", BRACKET_DEFAULTS.height),
	defaultFollow("thickness", BRACKET_DEFAULTS.thickness),
	defaultFollow("fillet", BRACKET_DEFAULTS.fillet),
	defaultFollow("holeCount", BRACKET_DEFAULTS.holeCount),
	defaultFollow("holeRadius", BRACKET_DEFAULTS.holeRadius),
	defaultInertia("orbit", 0),
	{
		id: "emissive",
		kind: "follow",
		tau: .08,
		initial: 0
	},
	{
		id: "pathProgress",
		kind: "follow",
		tau: 1.8,
		initial: 0
	}
]);
function stepBracket(clock) {
	const { targets } = useBracketStore.getState();
	syncReducedMotion(bracketTable, prefersReducedMotion());
	bracketTable.setTargets({
		width: targets.width,
		height: targets.height,
		thickness: targets.thickness,
		fillet: targets.fillet,
		holeCount: targets.holeCount,
		holeRadius: targets.holeRadius,
		emissive: targets.emissive,
		pathProgress: targets.pathProgress
	});
	if (targets.orbitImpulse) {
		bracketTable.impulse("orbit", targets.orbitImpulse);
		useBracketStore.setState((s) => ({ targets: {
			...s.targets,
			orbitImpulse: 0
		} }));
	}
	const display = bracketTable.step(clock.dt);
	if (targets.emissive > .01 && display.emissive > .6) useBracketStore.setState((s) => ({ targets: {
		...s.targets,
		emissive: 0
	} }));
	const sampled = bracketTable.publish(performance.now(), 10);
	if (sampled) useBracketStore.getState().setDisplay({
		width: sampled.width,
		height: sampled.height,
		thickness: sampled.thickness,
		fillet: sampled.fillet,
		holeCount: sampled.holeCount,
		holeRadius: sampled.holeRadius,
		emissive: sampled.emissive,
		pathProgress: sampled.pathProgress,
		orbit: sampled.orbit
	});
}
var EMISSIVE = new Color("#7a9b8a");
var HOVER_LIFT = 2.4;
function holesFrom(d) {
	return Array.from({ length: 4 }, (_, i) => {
		const [x, y] = holeCenters(d)[i];
		return {
			x,
			y,
			r: holeRadiusAt(d, i)
		};
	});
}
function applyMesh(geom, spec) {
	const tri = tessellatePlate(spec);
	geom.setAttribute("position", new BufferAttribute(tri.positions, 3));
	geom.setIndex(new BufferAttribute(tri.indices, 1));
	geom.computeVertexNormals();
	geom.computeBoundingSphere();
	geom.computeBoundingBox();
}
function BracketMesh() {
	const mesh = (0, import_react.useRef)(null);
	const mat = (0, import_react.useRef)(null);
	const geom = (0, import_react.useMemo)(() => {
		const d = useBracketStore.getState().display;
		const g = new BufferGeometry();
		applyMesh(g, {
			width: d.width,
			height: d.height,
			thickness: d.thickness,
			fillet: d.fillet,
			holes: holesFrom(d),
			pitch: 2.6
		});
		return g;
	}, []);
	const pathGeom = (0, import_react.useMemo)(() => new BufferGeometry(), []);
	const lastKey = (0, import_react.useRef)("");
	const pathPts = (0, import_react.useRef)([]);
	const hoverT = (0, import_react.useRef)(0);
	const hoverV = (0, import_react.useRef)(0);
	const gest = (0, import_react.useRef)(createGestureSession({
		rotate: (dv) => useBracketStore.setState((s) => ({ targets: {
			...s.targets,
			orbitImpulse: (s.targets.orbitImpulse ?? 0) + dv
		} })),
		scale: (f) => {
			const w = useBracketStore.getState().targets.width;
			useBracketStore.getState().setParam("width", w * f);
		},
		highlight: () => useBracketStore.setState((s) => ({ targets: {
			...s.targets,
			emissive: 1
		} }))
	}));
	useFrame((_, dt) => {
		const d = bracketTable.values();
		hoverV.current = follow1(hoverV.current, hoverT.current, dt, follow.hoverTau);
		const liftOff = prefersReducedMotion() || reducedMotion.disableHoverLift || !isTouchFine();
		if (mesh.current) {
			mesh.current.rotation.y = d.orbit ?? 0;
			mesh.current.position.y = liftOff ? 0 : hoverV.current * HOVER_LIFT;
		}
		if (mat.current) {
			mat.current.emissive.copy(EMISSIVE);
			mat.current.emissiveIntensity = d.emissive ?? 0;
		}
		const key = `${d.width}|${d.height}|${d.thickness}|${d.fillet}|${d.holeCount}|${d.holeRadius}`;
		if (key !== lastKey.current) {
			lastKey.current = key;
			pathPts.current = gcodeToolpath(d);
			applyMesh(geom, {
				width: d.width,
				height: d.height,
				thickness: d.thickness,
				fillet: d.fillet ?? 0,
				holes: holesFrom({
					width: d.width,
					height: d.height,
					holeCount: d.holeCount,
					holeRadius: d.holeRadius
				}),
				pitch: 2.6
			});
		}
		if ((d.pathProgress ?? 0) > .002) {
			const pts = pathPts.current;
			const n = visibleCount(pts, d.pathProgress ?? 0);
			const lift = (d.thickness ?? 6) + .45;
			const arr = new Float32Array(Math.max(n, 1) * 3);
			for (let i = 0; i < n; i++) {
				arr[i * 3] = pts[i].x;
				arr[i * 3 + 1] = pts[i].z + lift;
				arr[i * 3 + 2] = pts[i].y;
			}
			pathGeom.setAttribute("position", new BufferAttribute(arr, 3));
			pathGeom.setDrawRange(0, n);
			pathGeom.computeBoundingSphere();
		} else pathGeom.setDrawRange(0, 0);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		ref: mesh,
		geometry: geom,
		onPointerDown: (e) => {
			e.stopPropagation();
			useBracketStore.getState().dispatch({ type: "POINTER_DOWN_MESH" });
			gest.current.pointerDown(e.clientX, e.clientY);
		},
		onPointerMove: (e) => {
			if (e.buttons) gest.current.pointerMove(e.clientX, e.clientY);
			else hoverT.current = 1;
		},
		onPointerOut: () => {
			hoverT.current = 0;
		},
		onPointerUp: () => {
			useBracketStore.getState().dispatch({ type: "POINTER_UP" });
			gest.current.pointerUp();
		},
		onClick: () => gest.current.tap(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			ref: mat,
			color: "#8a9098",
			metalness: .38,
			roughness: .38,
			side: 2
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("line", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
		object: pathGeom,
		attach: "geometry"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", { color: "#7a9b8a" })] })] });
}
var lampTable = new ChannelTable([
	defaultFollow("height", LAMP_DEFAULTS.height),
	defaultFollow("shadeRadius", LAMP_DEFAULTS.shadeRadius),
	defaultSpring("neckBend", LAMP_DEFAULTS.neckBend),
	defaultFollow("temperature", LAMP_DEFAULTS.temperature)
]);
function stepLamp(clock) {
	syncReducedMotion(lampTable, prefersReducedMotion());
	lampTable.setTargets(useLampStore.getState().targets);
	lampTable.step(clock.dt);
	const sampled = lampTable.publish(performance.now(), 10);
	if (sampled) useLampStore.getState().setDisplay({
		height: sampled.height,
		shadeRadius: sampled.shadeRadius,
		neckBend: sampled.neckBend,
		temperature: sampled.temperature
	});
}
var COL$1 = new Color();
var SCALE = .075;
function kelvinToColor(k, out) {
	const t = (k - 2200) / 2800;
	return out.setHSL(.09 + t * .07, .42, .62);
}
function LampMesh() {
	const stem = (0, import_react.useRef)(null);
	const shade = (0, import_react.useRef)(null);
	const bulb = (0, import_react.useRef)(null);
	const bulbMat = (0, import_react.useRef)(null);
	const head = (0, import_react.useRef)(null);
	const light = (0, import_react.useRef)(null);
	useFrame(() => {
		const d = lampTable.values();
		const h = d.height * SCALE;
		const r = d.shadeRadius * SCALE;
		const bend = (d.neckBend ?? 0) * Math.PI / 180;
		if (stem.current) {
			stem.current.scale.set(1, h, 1);
			stem.current.position.y = 1.1 + h / 2;
		}
		if (head.current) {
			head.current.position.y = 1.1 + h;
			head.current.rotation.z = bend;
		}
		if (shade.current) {
			shade.current.scale.set(r, r * .55, r);
			shade.current.position.set(0, r * .12, 0);
		}
		if (bulb.current) {
			bulb.current.position.set(0, -r * .08, 0);
			bulb.current.scale.setScalar(Math.max(1.2, r * .16));
		}
		if (light.current) {
			light.current.position.set(0, -r * .15, 0);
			light.current.intensity = 4.5;
		}
		if (bulbMat.current) {
			kelvinToColor(d.temperature ?? 2700, COL$1);
			bulbMat.current.emissive.copy(COL$1);
			bulbMat.current.color.copy(COL$1);
			bulbMat.current.emissiveIntensity = 1.15;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.55,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				4.4,
				4.8,
				1.1,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8e949c",
				metalness: .62,
				roughness: .32
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: stem,
			position: [
				0,
				8,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.72,
				.88,
				1,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#9aa0a8",
				metalness: .58,
				roughness: .34
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: head,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1.05,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#8e949c",
					metalness: .7,
					roughness: .28
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					ref: shade,
					rotation: [
						0,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						1,
						1,
						32,
						1,
						true
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#d6d2c8",
						side: 2,
						roughness: .82,
						metalness: .08
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					ref: bulb,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						1.15,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						ref: bulbMat,
						color: "#f2e6c9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					ref: light,
					color: "#f2e0b8",
					distance: 48,
					decay: 2
				})
			]
		})
	] });
}
var ringTable = new ChannelTable([
	defaultFollow("innerRadius", RING_DEFAULTS.innerRadius),
	defaultFollow("shankWidth", RING_DEFAULTS.shankWidth),
	defaultFollow("shankThickness", RING_DEFAULTS.shankThickness),
	defaultSpring("twist", RING_DEFAULTS.twist, spring.snap),
	defaultFollow("metalHue", RING_DEFAULTS.metalHue),
	defaultFollow("polish", RING_DEFAULTS.polish)
]);
function stepRing(clock) {
	syncReducedMotion(ringTable, prefersReducedMotion());
	ringTable.setTargets(useRingStore.getState().targets);
	ringTable.step(clock.dt);
	const sampled = ringTable.publish(performance.now(), 10);
	if (sampled) useRingStore.getState().setDisplay({
		innerRadius: sampled.innerRadius,
		shankWidth: sampled.shankWidth,
		shankThickness: sampled.shankThickness,
		twist: sampled.twist,
		metalHue: sampled.metalHue,
		polish: sampled.polish
	});
}
var COL = new Color();
function RingMesh() {
	const mesh = (0, import_react.useRef)(null);
	const mat = (0, import_react.useRef)(null);
	const last = (0, import_react.useRef)({
		r: 0,
		tube: 0
	});
	useFrame(() => {
		const d = ringTable.values();
		const bore = d.innerRadius;
		const tube = d.shankThickness;
		const radius = bore + tube;
		if (mesh.current) {
			mesh.current.scale.set(1, Math.max(.45, d.shankWidth / 4), 1);
			mesh.current.rotation.z = (d.twist ?? 0) * Math.PI / 180;
			if (Math.abs(last.current.r - radius) > .04 || Math.abs(last.current.tube - tube) > .03) {
				mesh.current.geometry.dispose();
				mesh.current.geometry = new TorusGeometry(radius, tube, 24, 80);
				last.current = {
					r: radius,
					tube
				};
			}
		}
		if (mat.current) {
			COL.setHSL(d.metalHue ?? .12, .38, .58);
			mat.current.color.copy(COL);
			mat.current.metalness = .88;
			mat.current.roughness = 1 - (d.polish ?? .7);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: mesh,
		rotation: [
			Math.PI / 2,
			0,
			0
		],
		position: [
			0,
			1.8,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
			9.9,
			1.8,
			24,
			80
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			ref: mat,
			color: "#c4b49a",
			metalness: .88,
			roughness: .28
		})]
	});
}
var CAMERAS = {
	bracket: {
		position: [
			72,
			52,
			108
		],
		target: [
			0,
			3,
			0
		],
		fov: 32
	},
	lamp: {
		position: [
			34,
			18,
			64
		],
		target: [
			0,
			13,
			0
		],
		fov: 34
	},
	ring: {
		position: [
			12,
			9,
			22
		],
		target: [
			0,
			0,
			0
		],
		fov: 30
	}
};
var SHADOWS = {
	bracket: 200,
	lamp: 70,
	ring: 36
};
var GRIDS = {
	bracket: 220,
	lamp: 80,
	ring: 40
};
function SceneStage({ cell, orbitEnabled = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative h-[min(58dvh,36rem)] w-full overflow-hidden border-b border-border bg-surface touch-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionCanvas, {
			step: cell === "bracket" ? stepBracket : cell === "lamp" ? stepLamp : stepRing,
			orbitEnabled,
			camera: CAMERAS[cell],
			shadowScale: SHADOWS[cell],
			className: "absolute inset-0 h-full w-full",
			children: [
				cell === "bracket" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", { args: [
					GRIDS[cell],
					22,
					"#24303a",
					"#151a20"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					"rotation-x": -Math.PI / 2,
					position: [
						0,
						-.02,
						0
					],
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [GRIDS[cell] * 1.6, GRIDS[cell] * 1.6] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#101318",
						roughness: 1,
						metalness: 0
					})]
				}),
				cell === "bracket" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMesh, {}),
				cell === "lamp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LampMesh, {}),
				cell === "ring" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RingMesh, {})
			]
		})
	});
}
var CELLS = [
	{
		id: "bracket",
		label: "Plate cell",
		hint: "Fixed topology. Four hole slots. Holes collapse, they do not remesh."
	},
	{
		id: "lamp",
		label: "Lamp",
		hint: "The neck is a spring. Height is not another model."
	},
	{
		id: "ring",
		label: "Shank",
		hint: "US size is circumference / π. Not a mandrel."
	}
];
function Studio() {
	const [cell, setCell] = (0, import_react.useState)("bracket");
	const ui = useBracketStore((s) => s.ui);
	const dispatch = useBracketStore((s) => s.dispatch);
	const hint = CELLS.find((c) => c.id === cell)?.hint ?? "";
	(0, import_react.useEffect)(() => {
		dispatch({ type: "ENTER_WORKSPACE" });
	}, [dispatch]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-4 md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-micro tracking-label text-subtle uppercase",
					children: "Melodicbloom"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-medium tracking-tight text-balance",
					children: "Fabricate"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-pretty text-muted",
					children: hint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-wrap items-center gap-1 border-b border-border px-4 py-2 md:px-6",
				"aria-label": "Cells",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-[var(--radius-md)] bg-elevated p-1",
					children: CELLS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCell(c.id),
						className: `min-h-11 rounded-[var(--radius-sm)] px-4 text-sm ${cell === c.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`,
						children: c.label
					}, c.id))
				}), cell === "bracket" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto self-center font-mono text-micro text-subtle",
					children: ui
				})]
			}),
			cell === "bracket" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketCell, {}),
			cell === "lamp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LampCell, {}),
			cell === "ring" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RingCell, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border px-4 py-4 text-micro text-subtle md:px-6",
				children: "Jennipher Troup · melodicbloom · one clock · preview, not a mill"
			})
		]
	});
}
function BracketCell() {
	const ui = useBracketStore((s) => s.ui);
	const targets = useBracketStore((s) => s.targets);
	const display = useBracketStore((s) => s.display);
	const setParam = useBracketStore((s) => s.setParam);
	const dispatch = useBracketStore((s) => s.dispatch);
	const [meta, setMeta] = (0, import_react.useState)("");
	const vol = estimateVolumeMm3(display);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1fr_20rem]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneStage, {
					cell: "bracket",
					orbitEnabled: ui !== "manipulating"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pointer-events-none absolute bottom-3 left-4 font-mono text-micro tabular-nums text-subtle",
					children: [
						display.width.toFixed(1),
						" × ",
						display.height.toFixed(1),
						" × ",
						display.thickness.toFixed(1),
						" mm"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-5 border-t border-border p-4 lg:border-t-0 lg:border-l",
				children: [
					[
						["width", "mm"],
						["height", "mm"],
						["thickness", "mm"],
						["fillet", "mm"],
						["holeCount", ""],
						["holeRadius", "mm"]
					].map(([k, unit]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
						label: k,
						unit,
						value: targets[k],
						...BRACKET_LIMITS[k],
						step: k === "holeCount" ? 1 : .1,
						onTarget: (n) => setParam(k, n)
					}, k)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-micro text-subtle",
						children: [
							"est. ",
							vol.toFixed(0),
							" mm³ · four hole slots · ack ≤ ",
							budgets.ackMs,
							" ms"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => dispatch({ type: ui === "simulating" ? "EXIT_SIM" : "RUN_SIM" }),
							children: ui === "simulating" ? "Exit path" : "Simulate path"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => dispatch({ type: "OPEN_EXPORT" }),
							children: "Export draft"
						})]
					})
				]
			}),
			ui === "exporting" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-20 flex items-end justify-center bg-bg/70 p-3 md:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium",
							children: "Draft files"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-pretty text-muted",
							children: "Same tessellator as the viewport. NC is a GRBL-ish preview post, not a mill warranty."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-micro text-subtle",
							children: meta || "Ready."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "primary",
									onClick: async () => {
										const d = useBracketStore.getState().display;
										const holes = Array.from({ length: 4 }, (_, i) => {
											const [x, y] = holeCenters(d)[i];
											return {
												x,
												y,
												r: holeRadiusAt(d, i)
											};
										});
										setMeta("tessellating…");
										try {
											const res = await exportPlateStl({
												width: d.width,
												height: d.height,
												thickness: d.thickness,
												fillet: d.fillet,
												holes
											}, "bracket");
											downloadText("bracket.stl", res.stl);
											setMeta(`${res.triangles} tris · ${res.ms.toFixed(0)}ms · ${res.via}`);
										} catch (e) {
											setMeta(String(e));
										}
									},
									children: "Download STL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "quiet",
									onClick: () => {
										const d = useBracketStore.getState().display;
										const nc = postBracketGcode(d);
										downloadText("bracket.nc", nc);
										setMeta(`G-code ${nc.split("\n").length} lines · preview post`);
									},
									children: "Download G-code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => dispatch({ type: "CLOSE_EXPORT" }),
									children: "Done"
								})
							]
						})
					]
				})
			})
		]
	});
}
function LampCell() {
	const targets = useLampStore((s) => s.targets);
	const display = useLampStore((s) => s.display);
	const setParam = useLampStore((s) => s.setParam);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1fr_20rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneStage, { cell: "lamp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pointer-events-none absolute bottom-3 left-4 font-mono text-micro tabular-nums text-subtle",
				children: [
					display.height.toFixed(0),
					" mm · ",
					display.temperature.toFixed(0),
					" K"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex flex-col gap-5 border-t border-border p-4 lg:border-t-0 lg:border-l",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "height",
					unit: "mm",
					value: targets.height,
					...LAMP_LIMITS.height,
					onTarget: (n) => setParam("height", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "shade",
					unit: "mm",
					value: targets.shadeRadius,
					...LAMP_LIMITS.shadeRadius,
					onTarget: (n) => setParam("shadeRadius", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "neck bend",
					unit: "°",
					value: targets.neckBend,
					...LAMP_LIMITS.neckBend,
					onTarget: (n) => setParam("neckBend", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "temperature",
					unit: "K",
					value: targets.temperature,
					...LAMP_LIMITS.temperature,
					step: 50,
					onTarget: (n) => setParam("temperature", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Neck is a spring. Height is not another model."
				})
			]
		})]
	});
}
function RingCell() {
	const targets = useRingStore((s) => s.targets);
	const display = useRingStore((s) => s.display);
	const setParam = useRingStore((s) => s.setParam);
	const size = usSizeFromBore(display.innerRadius);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1fr_20rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneStage, { cell: "ring" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "pointer-events-none absolute bottom-3 left-4 font-mono text-micro tabular-nums text-subtle",
				children: ["US size ≈ ", size.toFixed(1)]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex flex-col gap-5 border-t border-border p-4 lg:border-t-0 lg:border-l",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "bore",
					unit: "mm",
					value: targets.innerRadius,
					...RING_LIMITS.innerRadius,
					step: .05,
					onTarget: (n) => setParam("innerRadius", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "width",
					unit: "mm",
					value: targets.shankWidth,
					...RING_LIMITS.shankWidth,
					onTarget: (n) => setParam("shankWidth", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "wall",
					unit: "mm",
					value: targets.shankThickness,
					...RING_LIMITS.shankThickness,
					step: .05,
					onTarget: (n) => setParam("shankThickness", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "twist",
					unit: "°",
					value: targets.twist,
					...RING_LIMITS.twist,
					onTarget: (n) => setParam("twist", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "hue",
					value: targets.metalHue,
					...RING_LIMITS.metalHue,
					step: .005,
					onTarget: (n) => setParam("metalHue", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
					label: "polish",
					value: targets.polish,
					...RING_LIMITS.polish,
					step: .01,
					onTarget: (n) => setParam("polish", n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-micro text-subtle",
					children: "Circumference estimate, not a mandrel"
				})
			]
		})]
	});
}
//#endregion
export { Studio as component };
