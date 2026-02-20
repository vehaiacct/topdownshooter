const inputState = { up:false, down:false, left:false, right:false, shooting:false, angle:0 };
const canvas = document.getElementById("gameCanvas");

// Joystick
const joystickBase=document.getElementById("joystickBase");
const joystickKnob=document.getElementById("joystickKnob");
let joystickActive=false, startX=0,startY=0;

joystickBase.addEventListener("touchstart", e=>{ joystickActive=true; const t=e.touches[0]; startX=t.clientX; startY=t.clientY; });
joystickBase.addEventListener("touchmove", e=>{
  if(!joystickActive) return;
  const t=e.touches[0]; const dx=t.clientX-startX, dy=t.clientY-startY;
  const dist=Math.min(Math.sqrt(dx*dx+dy*dy),50), angle=Math.atan2(dy,dx);
  joystickKnob.style.transform=`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`;
  inputState.up=dy<-10; inputState.down=dy>10; inputState.left=dx<-10; inputState.right=dx>10; inputState.angle=angle;
});
joystickBase.addEventListener("touchend", e=>{ joystickActive=false; joystickKnob.style.transform="translate(0,0)"; inputState.up=inputState.down=inputState.left=inputState.right=false; });

// Fire button
const fireBtn=document.getElementById("fireBtn");
fireBtn.addEventListener("touchstart", e=>{ inputState.shooting=true; });
fireBtn.addEventListener("touchend", e=>{ inputState.shooting=false; });

// Send to server
setInterval(()=>{ if(socket) socket.emit("input", inputState); },1000/30);
