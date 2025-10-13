// components/Galaxy.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}
`;

// Starfield shader tuned for premium cinematic look.
// Key tweaks:
// - Palette blends between orange (~0.08 hue) and purple (~0.61 hue).
// - Subtle twinkle + stronger glow falloff for brighter “points”.
// - Mouse parallax + auto rotation for forward-drift feel.
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3  uResolution;
uniform vec2  uFocal;
uniform vec2  uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2  uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool  uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool  uTransparent;

varying vec2  vUv;

#define NUM_LAYER 4.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x){ return abs(fract(x) * 2.0 - 1.0); }
float tris(float x){ float t = fract(x); return 1.0 - smoothstep(0.0, 1.0, abs(2.0*t - 1.0)); }
float trisn(float x){ float t = fract(x); return 2.0*(1.0 - smoothstep(0.0,1.0,abs(2.0*t - 1.0))) - 1.0; }

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float starGlow(vec2 uv, float flare, float glowBoost){
  float d = max(0.0005, length(uv));
  float m = (0.06 * glowBoost) / d;               // slightly brighter than before
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 900.0));
  m += rays * flare * glowBoost;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 900.0));
  m += rays * 0.28 * flare * glowBoost;
  m *= smoothstep(1.0, 0.18, d);
  return m;
}

vec3 layer(vec2 uv, float hueShift, float saturation, float twinkle, float glowBoost){
  vec3 col = vec3(0.);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for(int y=-1; y<=1; y++){
    for(int x=-1; x<=1; x++){
      vec2 cell = id + vec2(float(x), float(y));
      float seed = hash21(cell);
      float size = fract(seed * 345.32);

      // Palette: smoothly blend orange (~0.08) <-> purple (~0.61)
      float tone = fract(seed*1.732 + hueShift/360.0);
      float hue  = mix(0.08, 0.61, tone);                 // 0.08≈29° orange, 0.61≈220° purple
      vec3  base = hsv2rgb(vec3(hue, saturation, 1.0));

      float gloss = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flare = smoothstep(0.88, 1.0, size) * gloss;

      vec2 pad = vec2(
        tris(seed*34.0 + uTime*uSpeed/10.0),
        tris(seed*38.0 + uTime*uSpeed/30.0)
      ) - 0.5;

      float s = starGlow(gv - vec2(float(x),float(y)) - pad, flare, glowBoost);

      float tw = mix(1.0, (trisn(uTime*uSpeed + seed*6.2831)*0.5 + 1.0), twinkle);
      col += s * size * base * tw;
    }
  }
  return col;
}

void main(){
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if(uAutoCenterRepulsion > 0.0){
    vec2 center = vec2(0.0);
    float d = length(uv - center);
    vec2 rep = normalize(uv - center) * (uAutoCenterRepulsion/(d+0.1));
    uv += rep * 0.05;
  }else if(uMouseRepulsion){
    vec2 m = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float d = length(uv - m);
    vec2 rep = normalize(uv - m) * (uRepulsionStrength/(d+0.1));
    uv += rep * 0.05 * uMouseActiveFactor;
  }else{
    uv += mouseNorm * 0.1 * uMouseActiveFactor; // parallax
  }

  // Continuous camera drift/rotation
  float autoRot = uTime * uRotationSpeed;
  mat2 R = mat2(cos(autoRot), -sin(autoRot), sin(autoRot), cos(autoRot));
  uv = R * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for(float i=0.0; i<1.0; i+=1.0/NUM_LAYER){
    float depth = fract(i + uStarSpeed*uSpeed);
    float scale = mix(20.0*uDensity, 0.5*uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += layer(uv * scale + i*453.32, uHueShift, uSaturation, uTwinkleIntensity, uGlowIntensity) * fade;
  }

  gl_FragColor = uTransparent ? vec4(col, clamp(length(col), 0.0, 1.0)) : vec4(col, 1.0);
}
`;

type Props = {
  className?: string;
  // exposed controls (we’ll set cinematic defaults from Hero)
  focal?: [number, number];
  rotation?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  disableAnimation?: boolean;
  blurPx?: number;    // optional CSS blur (for dust layer)
  opacity?: number;   // optional CSS opacity (for dust layer)
};

export default function Galaxy({
  className = '',
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.22,
  density = 1.15,
  hueShift = 220,
  speed = 0.85,
  mouseInteraction = true,
  glowIntensity = 0.45,
  saturation = 0.75,
  mouseRepulsion = false,
  repulsionStrength = 2,
  twinkleIntensity = 0.22,
  rotationSpeed = 0.03,
  autoCenterRepulsion = 0.0,
  transparent = true,
  disableAnimation = false,
  blurPx,
  opacity,
}: Props) {
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
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    // cap DPR for perf + clarity
    (renderer as any).dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let program: Program | null = null;

    const setSize = () => {
      renderer.setSize(ctn.clientWidth, ctn.clientHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height
        );
      }
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(ctn);
    setSize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: new Float32Array([smoothMouse.current.x, smoothMouse.current.y]) },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uTransparent: { value: transparent },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let raf = 0;

    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      if (!disableAnimation && program) {
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0;
      }

      const k = 0.05;
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * k;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * k;
      smoothActive.current += (targetActive.current - smoothActive.current) * k;

      if (program) {
        program.uniforms.uMouse.value[0] = smoothMouse.current.x;
        program.uniforms.uMouse.value[1] = smoothMouse.current.y;
        program.uniforms.uMouseActiveFactor.value = smoothActive.current;
      }
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

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
      ctn.addEventListener('mousemove', onMove);
      ctn.addEventListener('mouseleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteraction) {
        ctn.removeEventListener('mousemove', onMove);
        ctn.removeEventListener('mouseleave', onLeave);
      }
      try { ctn.removeChild(gl.canvas); } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    focal, rotation, starSpeed, density, hueShift, speed, mouseInteraction, glowIntensity,
    saturation, mouseRepulsion, twinkleIntensity, rotationSpeed, repulsionStrength,
    autoCenterRepulsion, transparent, disableAnimation
  ]);

  return (
    <div
      ref={container}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        filter: blurPx ? `blur(${blurPx}px)` : undefined,
        opacity: opacity ?? 1,
      }}
    />
  );
}
