const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbye2sC56mNqIyRXT4aWQhLN3C2Y4sMXOuxk5xJqAohqywxurXHoy_hyXkzG6yC5jzH3/exec"; // replace with your Apps Script Web App URL

// Load 10 random questions from your Google Sheet via Apps Script
async function loadQuestions() {
  try {
    const response = await fetch(`${WEB_APP_URL}?origin=https://learntospark.blogspot.com`);
    if (!response.ok) throw new Error("Network error");
    const allQuestions = await response.json();
    const questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    displayQuiz(questions);
  } catch (err) {
    document.getElementById("quiz").innerHTML = `<p style='color:red;'>Unable to load questions: ${err.message}</p>`;
  }
}

// Safely render quiz questions & options
function displayQuiz(questions) {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";

  questions.forEach((q, i) => {
    const questionBlock = document.createElement("div");
    questionBlock.style.marginBottom = "20px";
    questionBlock.style.padding = "10px";
    questionBlock.style.borderBottom = "1px solid #eee";

    const qText = document.createElement("p");
    qText.innerHTML = `<b>Q${i + 1}. ${q.question}</b>`;
    questionBlock.appendChild(qText);

    // Add each option
    q.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.cursor = "pointer";
      label.style.margin = "4px 0";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = String.fromCharCode(65 + idx);

      label.appendChild(input);
      label.insertAdjacentText("beforeend", ` ${String.fromCharCode(65 + idx)}. ${opt}`);
      questionBlock.appendChild(label);
    });

    const exp = document.createElement("p");
    exp.id = `exp${i}`;
    exp.style.display = "none";
    exp.style.color = "#555";
    exp.style.marginTop = "5px";
    exp.style.fontStyle = "italic";
    questionBlock.appendChild(exp);

    quizDiv.appendChild(questionBlock);
  });

  // Control buttons
  const submitBtn = document.getElementById("submit-btn");
  const retryBtn = document.getElementById("retry-btn");
  const resultDiv = document.getElementById("result");

  submitBtn.style.display = "inline-block";
  retryBtn.style.display = "none";
  resultDiv.innerHTML = "";

  submitBtn.onclick = () => checkAnswers(questions);
  retryBtn.onclick = loadQuestions;
}

// Evaluate answers and show explanations
function checkAnswers(questions) {
  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const exp = document.getElementById(`exp${i}`);

    if (selected) {
      if (selected.value === q.answer) score++;
      exp.innerHTML =
        selected.value === q.answer
          ? `✅ Correct! ${q.explanation}`
          : `❌ Correct: ${q.answer}. ${q.explanation}`;
    } else {
      exp.innerHTML = `⚠️ No answer selected. Correct: ${q.answer}. ${q.explanation}`;
    }
    exp.style.display = "block";
  });

  document.getElementById("result").innerHTML = `<h3>Your Score: ${score}/${questions.length}</h3>`;
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("retry-btn").style.display = "inline-block";
}

// Initialize quiz on page load
document.addEventListener("DOMContentLoaded", loadQuestions);
