const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const profileDiv = document.getElementById("profile");

registerBtn.addEventListener("click", async () => {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
});

loginBtn.addEventListener("click", async () => {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    alert(data.message);
    showProfile();
  } else {
    alert(data.error);
  }
});

async function showProfile() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("/api/profile", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
  profileDiv.innerHTML = `Connecté en tant que : ${data.username}`;
}
