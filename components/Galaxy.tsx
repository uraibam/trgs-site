'use client';

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Galaxy.css';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
varying vec2 vUv;
#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0
float Hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float tri(float x){return abs(fract(x)*2.0-1.0);}
float tris(float x){float t=fract(x);return 1.0-smoothstep(0.0,1.0,abs(2.0*t-1.0));}
float trisn(float x){float t=fract(x);return 2.0*(1.0-smoothstep(0.0,1.0,abs(2.0*t-1.0)))-1.0;}
vec3 hsv2rgb(vec3 c){vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),c.y);}
float Star(vec2 uv,float flare){float d=length(uv);float m=(0.07*uGlowIntensity)/d;float rays=smoothstep(0.0,1.0,1.0-abs(uv.x*uv.y*1000.0));m+=rays*flare*uGlowIntensity;uv*=MAT45;rays=smoothstep(0.0,1.0,1.0-abs(uv.x*uv.y*1000.0));m+=rays*0.35*flare*uGlowIntensity;m*=smoothstep(1.0,0.2,d);return m;}
vec3 StarLayer(vec2 uv){vec3 col=vec3(0.0);vec2 gv=fract(uv)-0.5;vec2 id=floor(uv);
for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){vec2 si=id+vec2(float(x),float(y));float seed=Hash21(si);
float size=fract(seed*345.32);float gloss=tri(uStarSpeed/(PERIOD*seed+1.0));float flareSize=smoothstep(0.9,1.0,size)*gloss;
float red=smoothstep(STAR_COLOR_CUTOFF,1.0,Hash21(si+1.0))+STAR_COLOR_CUTOFF;
float blu=smoothstep(STAR_COLOR_CUTOFF,1.0,Hash21(si+3.0))+STAR_COLOR_CUTOFF;
float grn=min(red,blu)*seed;vec3 base=vec3(red,grn,blu);
float hue=atan(base.g-base.r,base.b-base.r)/(2.0*3.14159)+0.5;hue=fract(hue+uHueShift/360.0);
float sat=length(base-vec3(dot(base,vec3(0.299,0.587,0.114))))*uSaturation;float val=max(max(base.r,base.g),base.b);
base=hsv2rgb(vec3(hue,sat,val));
vec2 pad=vec2(tris(seed*34.0+uTime*uSpeed/10.0),tris(seed*38.0+uTime*uSpeed/30.0))-0.5;
float star=Star(gv-vec2(float(x),float(y))-pad,flareSize);
float tw=trisn(uTime*uSpeed+seed*6.2831)*0.5+1.0;tw=mix(1.0,tw,uTwinkleIntensity);star*=tw;
col+=star*size*base;}}
return col;}
void main(){
  vec2 focalPx=uFocal*uResolution.xy;
  vec2 uv=(vUv*uResolution.xy-focalPx)/uResolution.y;
  vec2 mouseNorm=uMouse-vec2(0.5);

  if(uAutoCenterRepulsion>0.0){
    vec2 centerUV=vec2(0.0,0.0);float d=length(uv-centerUV);
    uv+=normalize(uv-centerUV)*(uAutoCenterRepulsion/(d+0.1))*0.05;
  }else if(uMouseRepulsion){
    vec2 m=(uMouse*uResolution.xy-focalPx)/uResolution.y;float d=length(uv-m);
    uv+=normalize(uv-m)*(uRepulsionStrength/(d+0.1))*0.05*uMouseActiveFactor;
  }else{
    uv+=mouseNorm*0.1*uMouseActiveFactor;
  }

  float a=uTime*uRotationSpeed;
  uv=mat2(cos(a),-sin(a),sin(a),cos(a))*uv;
  uv=mat2(uRotation.x,-uRotation.y,uRotation.y,uRotation.x)*uv;

  vec3 col=vec3(0.0);
  for(float i=0.0;i<1.0;i+=1.0/NUM_LAYER){
    float depth=fract(i+uStarSpeed*uSpeed);
    float scale=mix(18.0*uDensity,0.6*uDensity,depth);
    float fade=depth*smoothstep(1.0,0.9,depth);
    col+=StarLayer(uv*scale+i*453.32)*fade;
  }

  // OPAQUE background so stars are always visible.
  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  className?: string;
};

export default function Galaxy({ className }: Props) {
  const host = useRef<HTMLDivElement | null>(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const targetActive = useRef(0);
  const smoothActive = useRef(0);

  useEffect(() => {
    if (!host.current) return;
    const ctn = host.current;

    const renderer = new Renderer({ alpha: false }); // opaque
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    let program: Program;

    const resize = () => {
      renderer.setSize(ctn.clientWidth, ctn.clientHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uFocal: { value: new Float32Array([0.5, 0.5]) },
        uRotation: { value: new Float32Array([1.0, 0.0]) },
        uStarSpeed: { value: 0.7 },
        uDensity: { value: 1.5 },
        uHueShift: { value: 220.0 },
        uSpeed: { value: 1.0 },
        uMouse: { value: new Float32Array([smoothMouse.current.x, smoothMouse.current.y]) },
        uGlowIntensity: { value: 0.9 },
        uSaturation: { value: 0.9 },
        uMouseRepulsion: { value: true },
        uTwinkleIntensity: { value: 0.45 },
        uRotationSpeed: { value: 0.08 },
        uRepulsionStrength: { value: 2.0 },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: 0.0 },
        uTransparent: { value: false }, // opaque
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let raf = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      program.uniforms.uTime.value = t * 0.001;

      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * 0.06;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * 0.06;
      smoothActive.current  += (targetActive.current - smoothActive.current) * 0.06;

      program.uniforms.uMouse.value[0] = smoothMouse.current.x;
      program.uniforms.uMouse.value[1] = smoothMouse.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothActive.current;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(tick);

    ctn.appendChild(gl.canvas);

    const onMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      targetMouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
      targetActive.current = 1;
    };
    const onLeave = () => (targetActive.current = 0);

    ctn.addEventListener('mousemove', onMove);
    ctn.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctn.removeEventListener('mousemove', onMove);
      ctn.removeEventListener('mouseleave', onLeave);
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={host} className={`galaxy-root ${className ?? ''}`} />;
}
