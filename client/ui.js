const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("gameScreen");
const errorMsg = document.getElementById("errorMsg");

document.getElementById("loginBtn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.token) {
      startGame(data);
    } else {
      showError(data.error || "Login failed");
    }
  } catch (err) {
    showError("Connection error");
  }
};

document.getElementById("registerBtn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showError("Please enter username and password");
    return;
  }

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.token) {
      startGame(data);
    } else {
      showError(data.error || "Registration failed");
    }
  } catch (err) {
    showError("Connection error");
  }
};

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
  setTimeout(() => errorMsg.style.display = "none", 3000);
}

function startGame(data) {
  loginScreen.style.display = "none";
  gameScreen.style.display = "block";
  connectSocket(data.token);
  fetchLeaderboard();
  setInterval(fetchLeaderboard, 30000);
}

async function fetchLeaderboard() {
  try {
    const res = await fetch("/leaderboard");
    const data = await res.json();
    const lb = document.getElementById("leaderboard");
    if (lb) {
      lb.innerHTML = "<h4>🏆 Top Players</h4>" +
        data.slice(0, 10).map((u, i) =>
          `${i + 1}. ${u.username}: ${u.weeklyKills} kills`
        ).join("<br>");
    }
  } catch (err) {
    console.error("Failed to load leaderboard");
  }
}