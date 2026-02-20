document.getElementById("loginBtn").onclick=async ()=>{
  const username=document.getElementById("username").value;
  const password=document.getElementById("password").value;
  const res=await fetch("/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
  const data=await res.json();
  if(data.token){
    document.getElementById("loginScreen").style.display="none";
    document.getElementById("gameScreen").style.display="block";
    connectSocket(data.token);
    fetchLeaderboard();
  }
};
document.getElementById("registerBtn").onclick=async ()=>{
  const username=document.getElementById("username").value;
  const password=document.getElementById("password").value;
  const res=await fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
  const data=await res.json();
  if(data.token){
    document.getElementById("loginScreen").style.display="none";
    document.getElementById("gameScreen").style.display="block";
    connectSocket(data.token);
    fetchLeaderboard();
  }
};

async function fetchLeaderboard(){
  const res=await fetch("/leaderboard"); const data=await res.json();
  document.getElementById("leaderboard").innerHTML="<h3>Weekly Leaderboard</h3>"+data.map(u=>`${u.username} : ${u.weeklyKills}`).join("<br>");
}
