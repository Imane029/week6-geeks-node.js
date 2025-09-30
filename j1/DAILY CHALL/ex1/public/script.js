const questionDiv = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreDiv = document.getElementById("score");

let currentAnswer = "";
let quizOver = false;

async function loadQuestion() {
  const res = await fetch("/quiz");
  const data = await res.json();
  showQuestion(data);
}

function showQuestion(data) {
  questionDiv.innerText = data.question;
  optionsDiv.innerHTML = "";
  data.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => currentAnswer = opt;
    optionsDiv.appendChild(btn);
  });
}

nextBtn.onclick = async () => {
  if (!currentAnswer) return alert("Sélectionnez une réponse");

  const res = await fetch("/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: currentAnswer })
  });
  const data = await res.json();

  if (data.message) { 
    questionDiv.innerText = "Quiz terminé !";
    optionsDiv.innerHTML = "";
    nextBtn.style.display = "none";
    scoreDiv.innerText = `Score final: ${data.score}`;
    quizOver = true;
  } else {
    showQuestion(data);
    currentAnswer = "";
    scoreDiv.innerText = `Score: ${data.score}`;
  }
};

loadQuestion();
