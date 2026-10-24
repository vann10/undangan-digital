import { transitionConfig as C } from '../transition.config';

// Deterministic, seekable sprite simulation. No vector or procedural illustration.
export class RasterParticles {
  private ctx: CanvasRenderingContext2D | null;
  private atlas = new Image();
  private count = C.particles.count;
  private samples: number[] = [];
  private last = 0;
  private width = 0;
  private height = 0;
  private sprites: { x: number; y: number; speed: number; drift: number; phase: number; size: number; cell: number }[];
  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
    this.atlas.src = '/transition/particle-atlas.webp';
    let seed = C.particles.seed;
    const random = () => { seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
    this.sprites = Array.from({length:C.particles.count}, (_,i) => ({x: random(), y: random()*.5, speed: 40+random()*90, drift: 15+random()*32, phase: random()*Math.PI*2, size: 9+random()*15, cell: i%10}));
    this.resize();
  }
  resize() {
    const {width,height} = this.canvas.getBoundingClientRect();
    this.width=width; this.height=height;
    const dpr=Math.min(devicePixelRatio||1,C.particles.maxDpr);
    this.canvas.width=Math.round(width*dpr); this.canvas.height=Math.round(height*dpr);
    this.ctx?.setTransform(dpr,0,0,dpr,0,0);
  }
  clear() { this.ctx?.clearRect(0,0,this.width,this.height); }
  draw(time: number, idle=false, measure=false) {
    const ctx=this.ctx; if(!ctx) return;
    this.clear();
    if(!this.atlas.complete || !this.atlas.naturalWidth) return;
    if(measure) {
      const now=performance.now();
      if(this.last && now-this.last<200) this.samples.push(now-this.last);
      this.last=now;
      if(this.samples.length===40) {
        if(1000/(this.samples.reduce((a,b)=>a+b,0)/40)<C.particles.fpsThreshold) this.count=C.particles.lowCount;
        this.samples=[];
      }
    } else this.last=0;
    const t=idle ? time*.3 : time-C.particles.start;
    if(!idle && (t<0 || time>=C.particles.end)) return;
    const idleProgress=Math.min(1,Math.max(0,time/C.duration.idleFade));
    const envelope=idle ? C.opacity.idleParticles*idleProgress*idleProgress*(3-2*idleProgress) : Math.min(1,t/.28,Math.max(0,(C.particles.end-time)/.5));
    const count=idle ? C.particles.idleCount : this.count;
    for(let i=0;i<count;i++) {
      const p=this.sprites[i];
      const x=p.x*this.width+Math.sin(t*1.3+p.phase)*p.drift;
      const y=idle ? (p.y*this.height+t*p.speed)%this.height : p.y*this.height+t*p.speed;
      ctx.save(); ctx.globalAlpha=envelope*C.opacity.particles;
      ctx.translate(x,y); ctx.rotate(p.phase+t*(i%2 ? -.7:.6));
      ctx.scale(Math.cos(t*2+p.phase)*.7+.3,1);
      ctx.drawImage(this.atlas,p.cell%4*128,Math.floor(p.cell/4)*128,128,128,-p.size/2,-p.size/2,p.size,p.size);
      ctx.restore();
    }
  }
}
