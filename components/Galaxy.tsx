'use client';

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

export default function Galaxy({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!host.current) return;
    const ctn = host.current;

    // OPAQUE renderer so stars are always visible on black.
    const renderer = new Renderer({ alpha: false, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `precision highp float;
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

    varying vec2 vUv;

    #define NUM_LAYER 4.0
    #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
    float Hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float tri(float x){return abs(fract(x)*2.0-1.0);}
    float tris(float x){float t=fract(x);return 1.0-smoothstep(0.0,1.0,abs(2.0*t-1.0));}
    float trisn(float x){float t=fract(x);return 2.0*(1.0-smoothstep(0.0,1.0,abs(2.0*t-1.0)))-1.0;}
    vec3 hsv2rgb(vec3 c){vec4 K=vec4(1.0,2.0/3.0,1.0/3.0,3.0);vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),c.y);}

    float Star(vec2 uv,float flare){
      float d=length(uv);
      float m=(0.08)/d; // brighter than before
      float rays=smoothstep(0.0,1.0,1.0-abs(uv.x*uv.y*1000.0));
      m+=rays*flare*1.1;
      uv*=MAT45;
      rays=smoothstep(0.0,1.0,1.0-abs(uv.x*uv.y*1000.0));
      m+=rays*0.35*flare;
      m*=smoothstep(1.0,0.2,d);
      return m;
    }

    vec3 StarLayer(vec2 uv){
      vec3 col=vec3(0.0);
      vec2 gv=fract(uv)-0.5;
      vec2 id=floor(uv);
      for(int y=-1;y<=1;y++){
        for(int x=-1;x<=1;x++){
          vec2 si=id+vec2(float(x),float(y));
          float seed=Hash21(si);
          float size=fract(seed*345.32);
          float gloss=tri(uStarSpeed/(3.0*seed+1.0));
          float flare=smoothstep(0.9,1.0,size)*gloss;
          vec3 base=vec3(0.8,0.9,1.0);
          base=hsv2rgb(vec3(fract(seed+uHueShift/360.0), 0.8, 1.0));
          vec2 pad=vec2(tris(seed*34.0+uTime*uSpeed/10.0), tris(seed*38.0+uTime*uSpeed/30.0))-0.5;
          float star=Star(gv-vec2(float(x),float(y))-pad,flare);
          float tw=trisn(uTime*uSpeed+seed*6.2831)*0.5+1.0;
          star*=mix(1.0,tw,uTwinkleIntensity);
          col+=star*size*base;
        }
      }
      return col;
    }

    void main(){
      vec2 focalPx=uFocal*uResolution.xy;
      vec2 uv=(vUv*uResolution.xy-focalPx)/uResolution.y;
      // gentle rotation
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
      gl_FragColor=vec4(col,1.0); // opaque
    }`;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(1, 1, 1) },
        uFocal: { value: new Float32Array([0.5, 0.5]) },
        uRotation: { value: new Float32Array([1.0, 0.0]) },
        uStarSpeed: { value: 0.7 },
        uDensity: { value: 1.6 },
        uHueShift: { value: 220.0 },
        uSpeed: { value: 1.0 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: 1.0 },
        uSaturation: { value: 0.9 },
        uMouseRepulsion: { value: false },
        uTwinkleIntensity: { value: 0.45 },
        uRotationSpeed: { value: 0.06 },
        uRepulsionStrength: { value: 2.0 },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: 0.0 },
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Size canvas to the host every time.
    const resize = () => {
      renderer.setSize(ctn.clientWidth, ctn.clientHeight);
      program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
      // ensure CSS sizing too
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';
    };
    window.addEventListener('resize', resize);
    resize();

    ctn.appendChild(gl.canvas);

    let raf = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  // NOTE: inline Tailwind styles – no separate CSS import needed.
  return <div ref={host} className={`absolute inset-0 ${className}`} style={{ width: '100%', height: '100%' }} />;
}
