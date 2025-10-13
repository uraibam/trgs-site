// components/Galaxy.tsx
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3  uResolution;
uniform vec2  uMouse;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uMouseActiveFactor;
uniform float uDrift;
uniform float uExposure;   // NEW: simple tone-map/exposure

varying vec2  vUv;

#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define NUM_LAYER 6.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1., 2./3., 1./3., 3.);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
}

float Star(vec2 uv, float flare, float glow) {
  float d = length(uv);
  float m = (0.05 * glow) / max(d, 1e-4);
  float rays = smoothstep(0., 1., 1. - abs(uv.x * uv.y * 900.));
  m += rays * flare * glow;
  uv *= MAT45;
  rays = smoothstep(0., 1., 1. - abs(uv.x * uv.y * 900.));
  m += rays * 0.28 * flare * glow;
  m *= smoothstep(1., 0.25, d);
  return m;
}

vec3 StarLayer(vec2 uv, float depth, float time, float hueShift, float glowIntensity, float saturation, float twinkleIntensity) {
  vec3 col = vec3(0.);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y=-1; y<=1; y++) {
    for (int x=-1; x<=1; x++) {
      vec2 cell = vec2(float(x), float(y));
      vec2 si = id + cell;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float flare = smoothstep(0.92, 1., size);

      // Base hue around hueShift with variance
      float hueVar = hueShift + mix(-40., 60., seed);
      float sat    = saturation * (0.6 + 0.4 * seed);
      float val    = mix(0.55, 1.05, size);
      vec3 base    = hsv2rgb(vec3(hueVar / 360.0, sat, val));

      // Rare accent pops (orange/purple)
      if (seed > 0.975) base = hsv2rgb(vec3(0.08, sat * 0.9, val * 1.1));   // warm orange
      else if (seed < 0.025) base = hsv2rgb(vec3(0.75, sat * 0.85, val));   // royal purple

      // Small organic jitter + twinkle
      vec2 jitter = vec2(
        sin(time * 0.5 + seed * 12.34),
        cos(time * 0.7 + seed * 45.67)
      ) * 0.2;

      float star = Star(gv - cell - jitter, flare, glowIntensity);
      float tw   = mix(1.0, abs(sin(time * 0.8 + seed * 12.5)), twinkleIntensity);

      col += star * base * tw;
    }
  }
  return col;
}

void main() {
  // Centered UV with aspect fix
  vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  // Camera sway (mouse)
  uv += (uMouse - 0.5) * 0.10 * uMouseActiveFactor;

  float time = uTime * uSpeed;
  vec3 color = vec3(0.0);

  // Multi-depth flow toward viewer
  for (float i=0.0; i<NUM_LAYER; i++) {
    float depth = i / NUM_LAYER;
    float layerSpeed   = mix(1.8, 0.4, depth);
    float layerDensity = mix(1.05, 0.7, depth);
    float zMove = uDrift * layerSpeed * time * 0.05;

    vec2 layerUV = uv * (16.0 * uDensity * layerDensity) + vec2(0.0, -zMove);
    color += StarLayer(layerUV, depth, time, 225.0 + depth * 15.0, uGlowIntensity, uSaturation, uTwinkleIntensity);
  }

  // Exposure tonemapping for clearer stars (brighter but smooth)
  color = vec3(1.0) - exp(-color * uExposure);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function Galaxy({
  density = 1.0,           // ↑ more stars
  hueShift = 225,
  speed = 0.7,
  glowIntensity = 0.28,    // ↑ visibility
  saturation = 0.18,
  twinkleIntensity = 0.20, // ↑ gentle twinkle
  rotationSpeed = 0.018,
  drift = 0.9,             // forward travel
  exposure = 1.35,         // NEW
  mouseInteraction = true,
  disableAnimation = false,
  className = "",
}: {
  density?: number;
  hueShift?: number;
  speed?: number;
  glowIntensity?: number;
  saturation?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  drift?: number;
  exposure?: number;
  mouseInteraction?: boolean;
  disableAnimation?: boolean;
  className?: string;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const targetActive = useRef(0.0);
  const smoothActive = useRef(0.0);

  useEffect(() => {
    if (!container.current) return;
    const ctn = container.current;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    (renderer as any).dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uMouseActiveFactor: { value: 0.0 },
        uDrift: { value: drift },
        uExposure: { value: exposure },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    renderer.setSize(ctn.clientWidth, ctn.clientHeight);
    ctn.appendChild(gl.canvas);

    const resize = new ResizeObserver(() => renderer.setSize(ctn.clientWidth, ctn.clientHeight));
    resize.observe(ctn);

    let raf = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      if (!disableAnimation) program.uniforms.uTime.value = t * 0.001;

      const k = 0.06;
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * k;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * k;
      smoothActive.current += (targetActive.current - smoothActive.current) * k;

      program.uniforms.uMouse.value[0] = smoothMouse.current.x;
      program.uniforms.uMouse.value[1] = smoothMouse.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothActive.current;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);

    const onMove = (e: MouseEvent) => {
      const r = ctn.getBoundingClientRect();
      targetMouse.current = {
        x: (e.clientX - r.left) / r.width,
        y: 1.0 - (e.clientY - r.top) / r.height,
      };
      targetActive.current = 1.0;
    };
    const onLeave = () => (targetActive.current = 0.0);

    if (mouseInteraction) {
      ctn.addEventListener("mousemove", onMove);
      ctn.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      if (mouseInteraction) {
        ctn.removeEventListener("mousemove", onMove);
        ctn.removeEventListener("mouseleave", onLeave);
      }
      try { ctn.removeChild(gl.canvas); } catch {}
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    density, hueShift, speed, glowIntensity, saturation, twinkleIntensity,
    rotationSpeed, drift, exposure, mouseInteraction, disableAnimation
  ]);

  return <div ref={container} className={className} style={{ position: "absolute", inset: 0 }} />;
}
