const form = document.getElementById("greetForm");
const greetingDiv = document.getElementById("greeting");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const emoji = document.getElementById("emoji").value;

  greetingDiv.innerHTML = `<h2>Bonjour, ${name}! ${emoji}</h2>`;
});
