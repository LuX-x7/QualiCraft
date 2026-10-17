/* QT's own perspective satellite sketch, adapted for the standalone workbench. */
(() => {
  let stop = () => {};
  const steps = [
    ['Import',180,.42,.6,32],['Coding',225,-.36,2.2,41],
    ['Analysis',275,.68,4,49],['Plotting',325,-.55,5.25,59],['Export',370,.2,3,72]
  ];
  function point(radius,angle,inclination,yaw=0,pitch=0) {
    const x=radius*Math.cos(angle),z=radius*Math.sin(angle)*Math.cos(inclination),y=radius*Math.sin(angle)*Math.sin(inclination);
    yaw-=.14;pitch+=.48;
    const u=x*Math.cos(yaw)+z*Math.sin(yaw),v=-x*Math.sin(yaw)+z*Math.cos(yaw),sy=y*Math.cos(pitch)+v*Math.sin(pitch),depth=v*Math.cos(pitch)-y*Math.sin(pitch),scale=1000/(1000-depth);
    return {x:500+u*scale,y:310+sy*scale*.64,depth,scale};
  }
  window.mountWelcomeOrbit = root => {
    stop();if(!root)return;
    const canvas=root.querySelector('canvas'),ctx=canvas?.getContext('2d');if(!ctx)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),pause=root.querySelector('button'),labels=[...root.querySelectorAll('[data-satellite]')];
    let frame=0,last=0,time=0,paused=reduced.matches,closed=false,width=0,height=0,dpr=1,yaw=0,pitch=0,requestDraw=()=>{};
    const resize=()=>{width=root.clientWidth;height=root.clientHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;requestDraw();};
    const observer=new ResizeObserver(resize);observer.observe(root);resize();
    const dot=(p,r,alpha)=>{ctx.fillStyle=`rgba(75,96,124,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,r*p.scale,0,Math.PI*2);ctx.fill();};
    const draw=now=>{
      frame=0;if(closed||!root.isConnected){stop();return;}
      if(last&&!paused&&!reduced.matches&&!document.hidden)time+=Math.min(now-last,50)/1000;last=now;
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.scale(width/1000,height/620);
      for(const [name,r,inc,phase,period] of steps){
        ctx.beginPath();for(let i=0;i<=96;i++){const p=point(r,i/96*Math.PI*2,inc,yaw,pitch);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.strokeStyle='rgba(75,96,124,.17)';ctx.lineWidth=1;ctx.stroke();
        const angle=phase+time*Math.PI*2/period;
        for(let lane=0;lane<3;lane++)for(let j=0;j<42;j++)dot(point(r+Math.sin(j*2.1+lane)*lane*2,angle-j*.03,inc,yaw,pitch),1.3-j/45,.04+.42*(1-j/42)**2);
        const p=point(r,angle,inc,yaw,pitch);ctx.fillStyle='#faf8f4';ctx.strokeStyle='#4b607c';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.x,p.y,11*p.scale,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.ellipse(p.x,p.y,5*p.scale,11*p.scale,.3,0,Math.PI*2);ctx.stroke();
        const label=labels.find(el=>el.dataset.satellite===name);if(label){label.style.left=p.x/10+'%';label.style.top=p.y/6.2+'%';}
      }
      for(let i=0;i<(width<600?180:420);i++)dot(point(85+(i*71)%300,i*2.41+time*.022,Math.sin(i*13)*.48,yaw,pitch),i%11===0?1.4:.8,i%7===0?.3:.12);
      if(!paused&&!reduced.matches)frame=requestAnimationFrame(draw);
    };
    const request=()=>{last=0;if(!frame)frame=requestAnimationFrame(draw);};
    requestDraw=request;
    const sync=()=>{pause.disabled=reduced.matches;pause.setAttribute('aria-pressed',String(paused));pause.textContent=reduced.matches?'Motion reduced':paused?'Play motion':'Pause motion';request();};
    const toggle=()=>{paused=!paused;sync();};
    const motion=()=>{paused=reduced.matches;sync();};
    const move=e=>{if(reduced.matches||e.pointerType==='touch')return;const r=root.getBoundingClientRect();yaw=((e.clientX-r.left)/r.width-.5)*.45;pitch=((e.clientY-r.top)/r.height-.5)*.2;request();};
    const leave=()=>{yaw=0;pitch=0;request();};
    pause.addEventListener('click',toggle);root.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);reduced.addEventListener('change',motion);
    stop=()=>{closed=true;cancelAnimationFrame(frame);observer.disconnect();pause.removeEventListener('click',toggle);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);reduced.removeEventListener('change',motion);};
    sync();
  };
})();
