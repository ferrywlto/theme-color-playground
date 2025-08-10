const toHex = v => v.toString(16).padStart(2, "0");
const toValue = hex => parseInt(hex, 16);

function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length !== 6) throw new Error('Invalid hex color format');
  const r = toValue(hex.slice(0, 2));
  const g = toValue(hex.slice(2, 4));
  const b = toValue(hex.slice(4, 6));
  return { r, g, b };
}

/**
 * HSL to RGB, then to Hex (#RRGGBB)
 * @param {number} h - hue in degrees 0..360
 * @param {number} s - saturation % (0..100)
 * @param {number} l - lightness  % (0..100)
 * @returns {{r:number, g:number, b:number}}
 */
function hslToRgb(h, s, l) {
  // normalise S & L
  s /= 100; l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let [r1, g1, b1] = [0, 0, 0];
  if (h < 60)        [r1, g1, b1] = [c, x, 0];
  else if (h < 120)  [r1, g1, b1] = [x, c, 0];
  else if (h < 180)  [r1, g1, b1] = [0, c, x];
  else if (h < 240)  [r1, g1, b1] = [0, x, c];
  else if (h < 300)  [r1, g1, b1] = [x, 0, c];
  else               [r1, g1, b1] = [c, 0, x];

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  return { r, g, b };
}


/**
 * Convert sRGB (0-255) to HSL (H° 0-360, S%, L%).
 * @param {number} r - red   0..255
 * @param {number} g - green 0..255
 * @param {number} b - blue  0..255
 * @returns {{h:number, s:number, l:number}}
 */
function rgbToHsl(r, g, b) {
  // 1) normalise to 0–1
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // 2) lightness
  let l = (max + min) / 2;

  // 3) saturation
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  // 4) hue
  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case r: h = ((g - b) / delta) % 6; break;
      case g: h = (b - r) / delta + 2;   break;
      case b: h = (r - g) / delta + 4;   break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  // 5) scale S and L to %
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function companion(r, g, b) {
  const hsl = rgbToHsl(r, g, b); // [H, S, L] with H in deg
  let { h, s, l } = hsl;
  let colors = {};
  colors["analogous"] = hslToRgb((h + 30) % 360, s, l);
  colors["complementary"] = hslToRgb((h + 180) % 360, s * 0.6, Math.min(100, Math.max(0, l + 10)));
  colors["depth"] = hslToRgb(h, s, Math.max(0, l - 20));
  colors["golden"] = hslToRgb((h + 222.5) % 360, s, l);
  colors["lab-distance"] = companionByDeltaE(rgbToHex(r,g,b)); // brute-force search for ΔE ≈ 35
  
  return colors;
}

/* ---------- RGB ➜ Lab helpers (unchanged, ASCII only) ---------- */

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToXyz(r, g, b) {
  r = srgbToLinear(r); g = srgbToLinear(g); b = srgbToLinear(b);
  return {
    x: 0.4124564*r + 0.3575761*g + 0.1804375*b,
    y: 0.2126729*r + 0.7151522*g + 0.0721750*b,
    z: 0.0193339*r + 0.1191920*g + 0.9503041*b
  };
}

function xyzToLab({x, y, z}) {
  const white = { x: 0.95047, y: 1.0, z: 1.08883 }; // D65
  const f = t => (t > 0.008856) ? Math.cbrt(t) : (7.787 * t + 16/116);

  const fx = f(x / white.x);
  const fy = f(y / white.y);
  const fz = f(z / white.z);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

function hexToLab(hex) {
  const rgb = hex.match(/[0-9a-f]{2}/gi).map(h => parseInt(h, 16));
  return xyzToLab(rgbToXyz(...rgb));
}

/* ---------- CIEDE2000 (deltaE00) – pure ASCII ---------- */

function deltaE00(lab1, lab2) {
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;

  const kL = 1, kC = 1, kH = 1;

  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const C_avg = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(C_avg, 7) / (Math.pow(C_avg, 7) + Math.pow(25, 7))));

  const a1Prime = a1 * (1 + G);
  const a2Prime = a2 * (1 + G);
  const C1Prime = Math.hypot(a1Prime, b1);
  const C2Prime = Math.hypot(a2Prime, b2);
  const C_avg_prime = (C1Prime + C2Prime) / 2;

  const h1Prime = (Math.atan2(b1, a1Prime) * 180 / Math.PI + 360) % 360;
  const h2Prime = (Math.atan2(b2, a2Prime) * 180 / Math.PI + 360) % 360;

  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;

  let deltaHPrimeDeg = h2Prime - h1Prime;
  if (deltaHPrimeDeg > 180) deltaHPrimeDeg -= 360;
  if (deltaHPrimeDeg < -180) deltaHPrimeDeg += 360;
  const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) *
                      Math.sin((deltaHPrimeDeg / 2) * Math.PI / 180);

  const L_avg = (L1 + L2) / 2;
  const H_avg_prime = (Math.abs(h1Prime - h2Prime) > 180)
      ? (h1Prime + h2Prime + 360) / 2
      : (h1Prime + h2Prime) / 2;

  const T =
      1 - 0.17 * Math.cos((H_avg_prime - 30) * Math.PI / 180) +
          0.24 * Math.cos((2 * H_avg_prime) * Math.PI / 180) +
          0.32 * Math.cos((3 * H_avg_prime + 6) * Math.PI / 180) -
          0.20 * Math.cos((4 * H_avg_prime - 63) * Math.PI / 180);

  const S_L = 1 + (0.015 * Math.pow(L_avg - 50, 2)) /
                    Math.sqrt(20 + Math.pow(L_avg - 50, 2));
  const S_C = 1 + 0.045 * C_avg_prime;
  const S_H = 1 + 0.015 * C_avg_prime * T;

  const deltaTheta = 30 * Math.exp(-Math.pow((H_avg_prime - 275) / 25, 2));
  const R_C = 2 * Math.sqrt(Math.pow(C_avg_prime, 7) /
                            (Math.pow(C_avg_prime, 7) + Math.pow(25, 7)));
  const R_T = -R_C * Math.sin(2 * deltaTheta * Math.PI / 180);

  const deltaE = Math.sqrt(
    Math.pow(deltaLPrime / (kL * S_L), 2) +
    Math.pow(deltaCPrime / (kC * S_C), 2) +
    Math.pow(deltaHPrime / (kH * S_H), 2) +
    R_T * (deltaCPrime / (kC * S_C)) * (deltaHPrime / (kH * S_H))
  );

  return deltaE;
}

/* ---------- Random companion colour with deltaE window ---------- */

function randomHex() {
  return '#' + (Math.random() * 0xFFFFFF >>> 0).toString(16).padStart(6, '0');
}

function companionByDeltaE(baseHex, min = 30, max = 40) {
  const baseLab = hexToLab(baseHex);
  let candidate, tries = 0;

  do {
    candidate = randomHex();
    tries += 1;
  } while (
    deltaE00(baseLab, hexToLab(candidate)) < min ||
    deltaE00(baseLab, hexToLab(candidate)) > max
  );

  if (import.meta.env.DEV) {
    console.log(`Found after ${tries} attempts → ${candidate}`);
  }
  return candidate;
}

// Export the functions for use in modules
export { hexToRgb, rgbToHex, hslToRgb, rgbToHsl, hexToLab, deltaE00, randomHex, companion, companionByDeltaE };
