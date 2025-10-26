const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbye2sC56mNqIyRXT4aWQhLN3C2Y4sMXOuxk5xJqAohqywxurXHoy_hyXkzG6yC5jzH3/exec"; // replace with Apps Script URL

async function loadQuestions() {
  try {
    const response = await fetch(`${WEB_APP_URL}?origin=https://learntospark.blogspot.com`);
    if (!response.ok) throw new Error("Network error");
    const questions = await response.json();
    displayQuiz(questions);
  } catch (err) {
    document.getElementById("quiz").innerHTML = `<p style='color:red;'>Unable to load questions: ${err.message}</p>`;
  }
}

function displayQuiz(questions) {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";
  questions.forEach((q, i) => {
    quizDiv.innerHTML += `
      <div style="margin-bottom:20px;padding:10px;border-bottom:1px solid #eee;">
        <p><b>Q${i + 1}. ${q.question}</b></p>
        <p><b>Q${i + 1}. ${q.options}</b></p>
        ${q.options.map((opt, idx) => `
          <label style="display:block;cursor:pointer;margin:4px 0;">
            <input type="radio" name="q${i}" value="${String.fromCharCode(65 + idx)}">
            ${String.fromCharCode(65 + idx)}. ${opt}
          </label>
        `).join('')}
        <p id="exp${i}" style="display:none;color:#555;margin-top:5px;font-style:italic;"></p>
      </div>
    `;
  });

  document.getElementById("submit-btn").style.display = "inline-block";
  document.getElementById("retry-btn").style.display = "none";
  document.getElementById("result").innerHTML = "";

  document.getElementById("submit-btn").addEventListener("click", () => checkAnswers(questions));
  document.getElementById("retry-btn").addEventListener("click", loadQuestions);
}

function checkAnswers(questions) {
  let score = 0;
  questions.forEach((q,i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const exp = document.getElementById(`exp${i}`);
    if (selected) {
      if (selected.value === q.answer) score++;
      exp.innerHTML = selected.value === q.answer ? `✅ Correct! ${q.explanation}` : `❌ Correct: ${q.answer}. ${q.explanation}`;
    } else {
      exp.innerHTML = `⚠️ No answer selected. Correct: ${q.answer}. ${q.explanation}`;
    }
    exp.style.display = "block";
  });
  document.getElementById("result").innerHTML = `<h3>Your Score: ${score}/${questions.length}</h3>`;
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("retry-btn").style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", loadQuestions);
