let currentQuestion = 1;
let score = 0;

async function loadQuestion(id) {
  try {
    const res = await fetch(`/api/questions/${id}`);
    const question = await res.json();

    if (!question || !question.id) {
      document.getElementById('quiz-container').innerHTML =
        `<h2>Quiz terminé ! Score final : ${score}</h2>`;
      return;
    }

    document.getElementById('question').innerText = question.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    question.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.innerText = opt.option_text;

      btn.onclick = async () => {
        const resCheck = await fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: question.id, answerId: opt.id })
        });
        const result = await resCheck.json();

        document.getElementById('feedback').innerText =
          result.correct ? 'Correct ✅' : 'Faux ❌';

        if (result.correct) score++;
        document.getElementById('score').innerText = `Score: ${score}`;
      };

      optionsDiv.appendChild(btn);
    });

  } catch (err) {
    console.error('Erreur:', err);
  }
}

document.getElementById('nextBtn').addEventListener('click', () => {
  currentQuestion++;
  loadQuestion(currentQuestion);
});

loadQuestion(currentQuestion);
