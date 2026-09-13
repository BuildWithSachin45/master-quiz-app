/**
 * Master Quiz - Unified Application Logic
 * BuildwithSachin45
 */

const categoryData = {
  "Aptitude and Reasoning": [
    { label: "Analytical Reasoning", file: "data/Aptitude and Reasoning/analytical-reasoning.json" },
    { label: "Critical Thinking", file: "data/Aptitude and Reasoning/critical-thinking.json" },
    { label: "Logical Reasoning", file: "data/Aptitude and Reasoning/logical-reasoning.json" },
    { label: "Mathematical Reasoning", file: "data/Aptitude and Reasoning/mathematical-reasoning.json" },
    { label: "Quantitative Aptitude", file: "data/Aptitude and Reasoning/quantitativr-aptitude.json" }
  ],
  "Computer Science": [
    { label: "Computer Network", file: "data/Computer Science/computer-network.json" },
    { label: "Cyber Security", file: "data/Computer Science/cyber-security.json" },
    { label: "Database Management System", file: "data/Computer Science/database-management-system.json" },
    { label: "Operating System", file: "data/Computer Science/operating-system.json" },
    { label: "Software Engineer", file: "data/Computer Science/software-engineer.json" }
  ],
  "Emerging Technologies": [
    { label: "Artificial Intelligence", file: "data/Emerging Technologies/artificial-intelligence.json" },
    { label: "Blockchain", file: "data/Emerging Technologies/blockchain.json" },
    { label: "Cloud Computing", file: "data/Emerging Technologies/cloud-computing.json" },
    { label: "Internet of Things", file: "data/Emerging Technologies/internet-of-thing.json" },
    { label: "Machine Learning", file: "data/Emerging Technologies/machine-learning.json" }
  ],
  "Entertainment": [
    { label: "Bollywood", file: "data/Entertainment/bollywood.json" },
    { label: "Fictional Character", file: "data/Entertainment/fictionalcharacter.json" },
    { label: "Hollywood", file: "data/Entertainment/hollywood.json" },
    { label: "Marvel", file: "data/Entertainment/marvel.json" },
    { label: "Music", file: "data/Entertainment/music.json" }
  ],
  "General Knowledge": [
    { label: "Awards", file: "data/General Knowledge/awards.json" },
    { label: "Books", file: "data/General Knowledge/books.json" },
    { label: "Capitals", file: "data/General Knowledge/capitals.json" },
    { label: "Indian Constitution", file: "data/General Knowledge/indianconstitution.json" },
    { label: "World Records", file: "data/General Knowledge/worldrecords.json" }
  ],
  "Learning Basics": [
    { label: "Basic Maths", file: "data/Learning Basics/basicmaths.json" },
    { label: "Basic Science", file: "data/Learning Basics/basicscience.json" },
    { label: "Computer Basics", file: "data/Learning Basics/computerbasic.json" },
    { label: "General Knowledge", file: "data/Learning Basics/generalknowledge.json" },
    { label: "Grammar", file: "data/Learning Basics/grammer.json" }
  ],
  "Programming": [
    { label: "C & Java", file: "data/Programming/c-java.json" },
    { label: "Dev Tools", file: "data/Programming/dev-tools.json" },
    { label: "Programming Concepts", file: "data/Programming/programming-concept.json" },
    { label: "Python & JavaScript", file: "data/Programming/python-javascript.json" },
    { label: "Web Development", file: "data/Programming/web-dev.json" }
  ],
  "Science": [
    { label: "Astronomy", file: "data/Science/astronomy.json" },
    { label: "Biology", file: "data/Science/biology.json" },
    { label: "Chemistry", file: "data/Science/chemistry.json" },
    { label: "Physics", file: "data/Science/physics.json" },
    { label: "Scientists & Inventors", file: "data/Science/scientist-inventors.json" }
  ],
  "Social Science": [
    { label: "Culture", file: "data/Social Science/culture.json" },
    { label: "Environment", file: "data/Social Science/environment.json" },
    { label: "Geography", file: "data/Social Science/geography.json" },
    { label: "History", file: "data/Social Science/history.json" },
    { label: "Politics", file: "data/Social Science/politics.json" }
  ],
  "Sports": [
    { label: "All Sports", file: "data/Sports/allsports.json" },
    { label: "Cricket", file: "data/Sports/cricket.json" },
    { label: "Football", file: "data/Sports/football.json" },
    { label: "ICC Tournament", file: "data/Sports/icctournament.json" },
    { label: "Olympic", file: "data/Sports/olympic.json" }
  ]
};

let selectedSubcategories = new Map();
const clapSound = new Audio("assets/sounds/correct.mp3");
const faahSound = new Audio("assets/sounds/wrong.mp3");
let isAudioMuted = localStorage.getItem("quizAudioMuted") === "true";

function playAudio(sound) {
  if (isAudioMuted || !sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  if (currentPath.includes("setup.html")) {
    initSetupPage();
  } else if (currentPath.includes("quiz.html")) {
    initQuizPage();
  } else if (currentPath.includes("result.html")) {
    initResultPage();
  }
});

/* ==========================================================================
   1. SETUP PAGE LOGIC
   ========================================================================== */
function initSetupPage() {
  const accordionContainer = document.getElementById("category-accordion");
  const randomCheckbox = document.getElementById("random-topics");
  const numQuestionsSelect = document.getElementById("num-questions");
  const customQuestionsGroup = document.getElementById("custom-questions-group");
  const customQuestionsInput = document.getElementById("custom-questions");
  const setupForm = document.getElementById("quiz-setup-form");

  const modeRadios = document.querySelectorAll('input[name="gameMode"]');
  const player1Label = document.getElementById("player1-label");
  const player2Wrapper = document.getElementById("player2-wrapper");
  const player2Input = document.getElementById("username2");

  if (!accordionContainer || !setupForm) return;

  modeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "multi") {
        player1Label.innerHTML = `<i class="bi bi-person-fill text-primary me-1"></i> Player 1 Name`;
        player2Wrapper.classList.remove("d-none");
        player2Input.required = true;
      } else {
        player1Label.innerHTML = `<i class="bi bi-person-fill text-primary me-1"></i> Your Name`;
        player2Wrapper.classList.add("d-none");
        player2Input.required = false;
      }
    });
  });

  accordionContainer.innerHTML = "";
  Object.keys(categoryData).forEach((categoryName, idx) => {
    const collapseId = `collapse-cat-${idx}`;
    const headingId = `heading-cat-${idx}`;

    const accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item border-0 border-bottom";
    accordionItem.innerHTML = `
      <h2 class="accordion-header" id="${headingId}">
        <button class="accordion-button collapsed fw-semibold text-dark py-3" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false">
          ${categoryName}
        </button>
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}">
        <div class="accordion-body bg-light py-2">
          <div class="row g-2">
            ${categoryData[categoryName].map(sub => `
              <div class="col-sm-6">
                <div class="form-check">
                  <input class="form-check-input sub-checkbox" type="checkbox" value="${sub.file}" data-label="${sub.label}" id="check-${sub.file.replace(/[^a-zA-Z0-9]/g, '')}">
                  <label class="form-check-label small" for="check-${sub.file.replace(/[^a-zA-Z0-9]/g, '')}">
                    ${sub.label}
                  </label>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    accordionContainer.appendChild(accordionItem);
  });

  accordionContainer.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("sub-checkbox")) {
      const checkbox = e.target;
      if (checkbox.checked) {
        selectedSubcategories.set(checkbox.value, checkbox.dataset.label);
      } else {
        selectedSubcategories.delete(checkbox.value);
      }
      renderChips();
    }
  });

  if (randomCheckbox) {
    randomCheckbox.addEventListener("change", () => {
      const isRandom = randomCheckbox.checked;
      document.querySelectorAll(".sub-checkbox").forEach(cb => {
        cb.disabled = isRandom;
        if (isRandom) cb.checked = false;
      });
      if (isRandom) {
        selectedSubcategories.clear();
        renderChips();
      }
    });
  }

  if (numQuestionsSelect) {
    numQuestionsSelect.addEventListener("change", () => {
      if (numQuestionsSelect.value === "custom") {
        customQuestionsGroup.classList.remove("d-none");
        customQuestionsInput.required = true;
      } else {
        customQuestionsGroup.classList.add("d-none");
        customQuestionsInput.required = false;
      }
    });
  }

  setupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    const player1 = document.getElementById("username").value.trim() || "Player 1";
    const player2 = gameMode === "multi" ? (document.getElementById("username2").value.trim() || "Player 2") : null;
    const isRandom = randomCheckbox.checked;

    if (!isRandom && selectedSubcategories.size === 0) {
      alert("Please select at least one subcategory or enable random topics.");
      return;
    }

    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    let questionCount = parseInt(numQuestionsSelect.value, 10);
    if (numQuestionsSelect.value === "custom") {
      questionCount = parseInt(customQuestionsInput.value, 10);
    }

    let targetFiles = [];
    let selectedLabels = [];

    if (isRandom) {
      Object.keys(categoryData).forEach(cat => {
        categoryData[cat].forEach(sub => targetFiles.push(sub.file));
      });
      selectedLabels = ["Random Mix"];
    } else {
      targetFiles = Array.from(selectedSubcategories.keys());
      selectedLabels = Array.from(selectedSubcategories.values());
    }

    const quizConfig = {
      gameMode: gameMode,
      username: player1,
      player2: player2,
      isRandom: isRandom,
      difficulty: difficulty,
      questionCount: questionCount,
      files: targetFiles,
      labels: selectedLabels,
      timestamp: Date.now()
    };

    localStorage.setItem("quizConfig", JSON.stringify(quizConfig));
    window.location.href = "quiz.html";
  });
}

function renderChips() {
  const chipContainer = document.getElementById("selected-chips");
  if (!chipContainer) return;
  chipContainer.innerHTML = "";

  selectedSubcategories.forEach((label, filePath) => {
    const chip = document.createElement("span");
    chip.className = "badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-2 px-3 d-inline-flex align-items-center gap-2";
    chip.innerHTML = `
      <span>${label}</span>
      <i class="bi bi-x-circle-fill text-danger" style="cursor: pointer;" onclick="removeChip('${filePath}')"></i>
    `;
    chipContainer.appendChild(chip);
  });
}

window.removeChip = function(filePath) {
  selectedSubcategories.delete(filePath);
  const targetCheckbox = document.querySelector(`.sub-checkbox[value="${filePath}"]`);
  if (targetCheckbox) targetCheckbox.checked = false;
  renderChips();
};


/* ==========================================================================
   2. QUIZ PAGE LOGIC (PASS & PLAY + LIVE SCOREBOARD)
   ========================================================================== */
let currentQuiz = {
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  assignedPlayers: {},
  timerInterval: null,
  secondsElapsed: 0,
  config: null,
  streakCount: 0,
  questionRenderTime: 0,
  oddEvenSwitched: false,
  p1Stats: { correct: 0, wrong: 0 },
  p2Stats: { correct: 0, wrong: 0 }
};

async function initQuizPage() {
  const storedConfig = localStorage.getItem("quizConfig");
  if (!storedConfig) {
    window.location.href = "setup.html";
    return;
  }

  currentQuiz.config = JSON.parse(storedConfig);

  const candidateNameElem = document.getElementById("quiz-candidate-name");
  const topicLabelElem = document.getElementById("quiz-topic-label");
  if (candidateNameElem) candidateNameElem.textContent = currentQuiz.config.gameMode === "multi" ? `${currentQuiz.config.username} vs ${currentQuiz.config.player2}` : currentQuiz.config.username;
  if (topicLabelElem) topicLabelElem.textContent = currentQuiz.config.labels[0];

  setupAudioToggle();
  showQuizLoading(true);

  if (currentQuiz.config.gameMode === "multi") {
    document.getElementById("multiplayer-scoreboard").classList.remove("d-none");
    document.getElementById("turn-badge").classList.remove("d-none");
    document.getElementById("p1-display-name").textContent = currentQuiz.config.username;
    document.getElementById("p2-display-name").textContent = currentQuiz.config.player2;
  }

  try {
    const loadedQuestions = await fetchAndBuildQuestionPool(currentQuiz.config);
    currentQuiz.questions = loadedQuestions;
    currentQuiz.currentIndex = 0;
    currentQuiz.userAnswers = {};
    currentQuiz.assignedPlayers = {};
    currentQuiz.oddEvenSwitched = false;
    currentQuiz.p1Stats = { correct: 0, wrong: 0 };
    currentQuiz.p2Stats = { correct: 0, wrong: 0 };

    showQuizLoading(false);
    startTimer();
    renderCurrentQuestion();
    setupQuizEventHandlers();
  } catch (err) {
    console.error(err);
    alert("Error loading questions. Ensure server is active.");
  }
}

function setupAudioToggle() {
  const soundBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-toggle-icon");
  if (!soundBtn || !soundIcon) return;

  const updateIcon = () => {
    if (isAudioMuted) {
      soundIcon.className = "bi bi-volume-mute-fill fs-6 text-danger";
    } else {
      soundIcon.className = "bi bi-volume-up-fill fs-6 text-white";
    }
  };

  updateIcon();
  soundBtn.addEventListener("click", () => {
    isAudioMuted = !isAudioMuted;
    localStorage.setItem("quizAudioMuted", isAudioMuted);
    updateIcon();
  });
}

async function fetchAndBuildQuestionPool(config) {
  let combinedPool = [];
  const fetchPromises = config.files.map(filePath =>
    fetch(filePath).then(res => res.json()).catch(() => [])
  );
  const responses = await Promise.all(fetchPromises);

  responses.forEach(data => {
    if (Array.isArray(data)) combinedPool.push(...data);
    else if (data && Array.isArray(data.questions)) combinedPool.push(...data.questions);
  });

  if (config.difficulty && config.difficulty !== "all") {
    combinedPool = combinedPool.filter(q => q.difficulty && q.difficulty.toLowerCase() === config.difficulty.toLowerCase());
  }

  shuffleArray(combinedPool);
  return combinedPool.slice(0, config.questionCount);
}

function getCurrentQuestionPlayer() {
  if (currentQuiz.config.gameMode !== "multi") return currentQuiz.config.username;
  
  if (currentQuiz.assignedPlayers[currentQuiz.currentIndex]) {
    return currentQuiz.assignedPlayers[currentQuiz.currentIndex];
  }

  const isEvenIndex = currentQuiz.currentIndex % 2 === 0;
  const designatedPlayer = (!currentQuiz.oddEvenSwitched)
    ? (isEvenIndex ? currentQuiz.config.username : currentQuiz.config.player2)
    : (isEvenIndex ? currentQuiz.config.player2 : currentQuiz.config.username);

  currentQuiz.assignedPlayers[currentQuiz.currentIndex] = designatedPlayer;
  return designatedPlayer;
}

function renderCurrentQuestion() {
  const total = currentQuiz.questions.length;
  const current = currentQuiz.currentIndex + 1;
  const question = currentQuiz.questions[currentQuiz.currentIndex];
  const correctAnswer = question.answer || question.correct_answer || question.correctAnswer;
  const selectedAnswer = currentQuiz.userAnswers[currentQuiz.currentIndex] || null;
  const isAnswered = selectedAnswer !== null;
  const activePlayer = getCurrentQuestionPlayer();

  if (!isAnswered) {
    currentQuiz.questionRenderTime = Date.now();
  }

  // Update Turn Badge
  const turnBadge = document.getElementById("turn-player-name");
  if (turnBadge) turnBadge.textContent = activePlayer;

  // Question & Counter
  document.getElementById("current-question-num").textContent = current;
  document.getElementById("total-questions-num").textContent = total;
  document.getElementById("quiz-progress-bar").style.width = `${Math.round((current / total) * 100)}%`;
  document.getElementById("question-text").textContent = question.question || question.text;

  const difficultyBadge = document.getElementById("question-difficulty-badge");
  if (difficultyBadge && question.difficulty) {
    difficultyBadge.textContent = question.difficulty.toUpperCase();
    difficultyBadge.className = `badge ${getDifficultyBadgeClass(question.difficulty)}`;
  }

  // Pass Button Visibility
  const passBtn = document.getElementById("pass-question-btn");
  if (passBtn) {
    if (currentQuiz.config.gameMode === "multi" && !isAnswered) {
      passBtn.classList.remove("d-none");
    } else {
      passBtn.classList.add("d-none");
    }
  }

  // Options
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  (question.options || []).forEach((opt, idx) => {
    const optionLetter = String.fromCharCode(65 + idx);
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    let btnClasses = "btn w-100 text-start p-3 rounded-3 d-flex align-items-center gap-3 transition-all ";
    let badgeClasses = "badge rounded-circle px-2 py-1 ";
    let icon = "";

    if (!isAnswered) {
      btnClasses += "btn-outline-secondary";
      badgeClasses += "bg-light text-dark border";
    } else {
      optionBtn.disabled = true;
      if (opt === correctAnswer) {
        btnClasses += "btn-success text-white fw-bold shadow-sm";
        badgeClasses += "bg-white text-success";
        icon = `<i class="bi bi-check-circle-fill ms-auto fs-5 text-white"></i>`;
      } else if (opt === selectedAnswer) {
        btnClasses += "btn-danger text-white fw-bold shadow-sm";
        badgeClasses += "bg-white text-danger";
        icon = `<i class="bi bi-x-circle-fill ms-auto fs-5 text-white"></i>`;
      } else {
        btnClasses += "btn-outline-secondary opacity-50";
        badgeClasses += "bg-light text-dark border";
      }
    }

    optionBtn.className = btnClasses;
    optionBtn.innerHTML = `
      <span class="${badgeClasses}">${optionLetter}</span>
      <span class="flex-grow-1">${opt}</span>
      ${icon}
    `;

    if (!isAnswered) {
      optionBtn.addEventListener("click", () => {
        const timeTaken = (Date.now() - currentQuiz.questionRenderTime) / 1000;
        currentQuiz.userAnswers[currentQuiz.currentIndex] = opt;
        const isCorrect = opt === correctAnswer;

        if (currentQuiz.config.gameMode === "multi") {
          if (activePlayer === currentQuiz.config.username) {
            isCorrect ? currentQuiz.p1Stats.correct++ : currentQuiz.p1Stats.wrong++;
          } else {
            isCorrect ? currentQuiz.p2Stats.correct++ : currentQuiz.p2Stats.wrong++;
          }
          updateMultiplayerScoreboard();
        }

        if (isCorrect) {
          playAudio(clapSound);
          currentQuiz.streakCount++;
          triggerAppreciationBadges(timeTaken, currentQuiz.streakCount);
        } else {
          playAudio(faahSound);
          currentQuiz.streakCount = 0;
        }

        renderCurrentQuestion();
      });
    }
    optionsContainer.appendChild(optionBtn);
  });

  // Feedback Box
  const existingFeedback = document.getElementById("live-feedback-box");
  if (existingFeedback) existingFeedback.remove();

  if (isAnswered) {
    const isCorrect = selectedAnswer === correctAnswer;
    const feedbackDiv = document.createElement("div");
    feedbackDiv.id = "live-feedback-box";
    feedbackDiv.className = `alert mt-4 p-3 rounded-3 border ${isCorrect ? 'alert-success border-success' : 'alert-danger border-danger'}`;
    feedbackDiv.innerHTML = `
      <div class="fw-bold mb-1"><i class="bi ${isCorrect ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-1"></i> ${isCorrect ? 'Correct!' : 'Incorrect!'} (${activePlayer})</div>
      ${!isCorrect ? `<div class="small mb-1"><strong>Correct Answer:</strong> ${correctAnswer}</div>` : ''}
      ${question.explanation ? `<div class="small text-secondary mt-2 border-top pt-2">${question.explanation}</div>` : ''}
    `;
    optionsContainer.appendChild(feedbackDiv);
  }

  // Next / Submit Button state
  const prevBtn = document.getElementById("prev-question-btn");
  const nextBtn = document.getElementById("next-question-btn");
  const finishBtn = document.getElementById("finish-quiz-btn");

  if (prevBtn) prevBtn.disabled = currentQuiz.currentIndex === 0;
  if (nextBtn && finishBtn) {
    if (currentQuiz.currentIndex === total - 1) {
      nextBtn.classList.add("d-none");
      finishBtn.classList.remove("d-none");
    } else {
      nextBtn.classList.remove("d-none");
      finishBtn.classList.add("d-none");
    }
  }
}

function updateMultiplayerScoreboard() {
  document.getElementById("p1-correct-count").textContent = currentQuiz.p1Stats.correct;
  document.getElementById("p1-wrong-count").textContent = currentQuiz.p1Stats.wrong;
  document.getElementById("p2-correct-count").textContent = currentQuiz.p2Stats.correct;
  document.getElementById("p2-wrong-count").textContent = currentQuiz.p2Stats.wrong;

  const leadBadge = document.getElementById("battle-lead-badge");
  if (currentQuiz.p1Stats.correct > currentQuiz.p2Stats.correct) {
    leadBadge.className = "badge bg-primary rounded-pill px-2 py-1 small";
    leadBadge.textContent = `${currentQuiz.config.username} Leads`;
  } else if (currentQuiz.p2Stats.correct > currentQuiz.p1Stats.correct) {
    leadBadge.className = "badge bg-warning text-dark rounded-pill px-2 py-1 small";
    leadBadge.textContent = `${currentQuiz.config.player2} Leads`;
  } else {
    leadBadge.className = "badge bg-secondary rounded-pill px-2 py-1 small";
    leadBadge.textContent = "Scores Tied";
  }
}

function setupQuizEventHandlers() {
  const prevBtn = document.getElementById("prev-question-btn");
  const nextBtn = document.getElementById("next-question-btn");
  const finishBtn = document.getElementById("finish-quiz-btn");
  const passBtn = document.getElementById("pass-question-btn");

  if (passBtn) {
    passBtn.addEventListener("click", () => {
      const currentAssigned = getCurrentQuestionPlayer();
      const otherPlayer = currentAssigned === currentQuiz.config.username ? currentQuiz.config.player2 : currentQuiz.config.username;
      
      // Transfer current question to other player
      currentQuiz.assignedPlayers[currentQuiz.currentIndex] = otherPlayer;
      // Invert subsequent default assignments
      currentQuiz.oddEvenSwitched = !currentQuiz.oddEvenSwitched;

      displayBadgeNotification({
        icon: "bi-arrow-left-right",
        color: "bg-info text-white",
        text: `Question passed to ${otherPlayer}!`
      });

      renderCurrentQuestion();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentQuiz.currentIndex > 0) {
        currentQuiz.currentIndex--;
        renderCurrentQuestion();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentQuiz.currentIndex < currentQuiz.questions.length - 1) {
        currentQuiz.currentIndex++;
        renderCurrentQuestion();
      }
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      finalizeQuizSession();
    });
  }
}

function triggerAppreciationBadges(timeTaken, streak) {
  let badges = [];
  if (timeTaken <= 6) {
    badges.push({ icon: "bi-lightning-charge-fill", color: "bg-warning text-dark", text: `Speed Demon! ${timeTaken.toFixed(1)}s!` });
  }
  if (streak >= 3 && streak % 3 === 0) {
    badges.push({ icon: "bi-fire", color: "bg-danger text-white", text: `Hot Streak! ${streak} In A Row!` });
  }
  badges.forEach(badge => displayBadgeNotification(badge));
}

function displayBadgeNotification(badge) {
  let badgeContainer = document.getElementById("quiz-appreciation-container");
  if (!badgeContainer) {
    badgeContainer = document.createElement("div");
    badgeContainer.id = "quiz-appreciation-container";
    badgeContainer.className = "position-fixed top-0 start-50 translate-middle-x mt-5 d-flex flex-column gap-2";
    badgeContainer.style.zIndex = "9999";
    document.body.appendChild(badgeContainer);
  }

  const badgeElem = document.createElement("div");
  badgeElem.className = `badge ${badge.color} px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2 fs-6`;
  badgeElem.innerHTML = `<i class="bi ${badge.icon} fs-5"></i> <strong>${badge.text}</strong>`;
  badgeContainer.appendChild(badgeElem);

  setTimeout(() => {
    badgeElem.style.transition = "opacity 0.5s ease";
    badgeElem.style.opacity = "0";
    setTimeout(() => badgeElem.remove(), 500);
  }, 3000);
}

function startTimer() {
  clearInterval(currentQuiz.timerInterval);
  currentQuiz.secondsElapsed = 0;
  currentQuiz.timerInterval = setInterval(() => {
    currentQuiz.secondsElapsed++;
    const mins = Math.floor(currentQuiz.secondsElapsed / 60);
    const secs = currentQuiz.secondsElapsed % 60;
    document.getElementById("quiz-timer-display").textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function finalizeQuizSession() {
  clearInterval(currentQuiz.timerInterval);

  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const evaluation = currentQuiz.questions.map((q, idx) => {
    const selected = currentQuiz.userAnswers[idx] || null;
    const correct = q.answer || q.correct_answer || q.correctAnswer;
    const isCorrect = selected === correct;
    const assignedTo = currentQuiz.assignedPlayers[idx] || currentQuiz.config.username;

    if (!selected) skippedCount++;
    else if (isCorrect) correctCount++;
    else wrongCount++;

    return {
      question: q.question || q.text,
      selectedAnswer: selected,
      correctAnswer: correct,
      isCorrect: isCorrect,
      explanation: q.explanation || "",
      assignedTo: assignedTo
    };
  });

  const quizResult = {
    gameMode: currentQuiz.config.gameMode,
    username: currentQuiz.config.username,
    player2: currentQuiz.config.player2,
    p1Stats: currentQuiz.p1Stats,
    p2Stats: currentQuiz.p2Stats,
    totalQuestions: currentQuiz.questions.length,
    correctCount: correctCount,
    wrongCount: wrongCount,
    skippedCount: skippedCount,
    accuracy: Math.round((correctCount / currentQuiz.questions.length) * 100),
    timeSpentSeconds: currentQuiz.secondsElapsed,
    details: evaluation
  };

  localStorage.setItem("quizResult", JSON.stringify(quizResult));
  window.location.href = "result.html";
}

function showQuizLoading(isLoading) {
  const loader = document.getElementById("quiz-loading-overlay");
  const card = document.getElementById("quiz-main-card");
  if (loader && card) {
    if (isLoading) {
      loader.classList.remove("d-none");
      card.classList.add("d-none");
    } else {
      loader.classList.add("d-none");
      card.classList.remove("d-none");
    }
  }
}

function getDifficultyBadgeClass(diff) {
  switch ((diff || "").toLowerCase()) {
    case "easy": return "bg-success-subtle text-success border border-success-subtle";
    case "medium": return "bg-warning-subtle text-warning border border-warning-subtle";
    case "hard": return "bg-danger-subtle text-danger border border-danger-subtle";
    default: return "bg-secondary-subtle text-secondary";
  }
}


/* ==========================================================================
   3. RESULT PAGE LOGIC
   ========================================================================== */
function initResultPage() {
  const resultData = localStorage.getItem("quizResult");
  if (!resultData) {
    window.location.href = "setup.html";
    return;
  }

  const result = JSON.parse(resultData);

  if (result.gameMode === "multi") {
    document.getElementById("single-player-card").classList.add("d-none");
    document.getElementById("multiplayer-results-grid").classList.remove("d-none");
    document.getElementById("multiplayer-winner-banner").classList.remove("d-none");

    document.getElementById("p1-res-name").textContent = result.username;
    document.getElementById("p1-res-score").textContent = result.p1Stats.correct;
    document.getElementById("p1-res-correct").textContent = result.p1Stats.correct;
    document.getElementById("p1-res-wrong").textContent = result.p1Stats.wrong;

    document.getElementById("p2-res-name").textContent = result.player2;
    document.getElementById("p2-res-score").textContent = result.p2Stats.correct;
    document.getElementById("p2-res-correct").textContent = result.p2Stats.correct;
    document.getElementById("p2-res-wrong").textContent = result.p2Stats.wrong;

    const headline = document.getElementById("winner-headline");
    const subtext = document.getElementById("winner-subtext");

    if (result.p1Stats.correct > result.p2Stats.correct) {
      headline.textContent = `🏆 ${result.username} Wins the Match!`;
      subtext.textContent = `${result.username} secured ${result.p1Stats.correct} correct answers compared to ${result.player2}'s ${result.p2Stats.correct}.`;
    } else if (result.p2Stats.correct > result.p1Stats.correct) {
      headline.textContent = `🏆 ${result.player2} Wins the Match!`;
      subtext.textContent = `${result.player2} secured ${result.p2Stats.correct} correct answers compared to ${result.username}'s ${result.p1Stats.correct}.`;
    } else {
      headline.textContent = "🤝 It's a Tie Match!";
      subtext.textContent = `Both players tied with ${result.p1Stats.correct} points each.`;
    }
  } else {
    document.getElementById("result-username").textContent = result.username;
    document.getElementById("result-score").textContent = result.correctCount;
    document.getElementById("result-total").textContent = result.totalQuestions;
    document.getElementById("result-percentage").textContent = `${result.accuracy}%`;
    document.getElementById("result-correct").textContent = result.correctCount;
    document.getElementById("result-wrong").textContent = result.wrongCount;
    document.getElementById("result-skipped").textContent = result.skippedCount;

    const mins = Math.floor(result.timeSpentSeconds / 60);
    const secs = result.timeSpentSeconds % 60;
    document.getElementById("result-time").textContent = `${mins}m ${secs}s`;
  }

  // Question review list
  const reviewContainer = document.getElementById("result-review-list");
  if (reviewContainer && Array.isArray(result.details)) {
    reviewContainer.innerHTML = "";
    result.details.forEach((item, index) => {
      const reviewItem = document.createElement("div");
      reviewItem.className = `card mb-3 border ${item.isCorrect ? 'border-success-subtle' : 'border-danger-subtle'} rounded-3 shadow-sm`;
      reviewItem.innerHTML = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold text-dark">Q${index + 1}. <span class="badge bg-light text-dark border ms-1">${item.assignedTo}</span></span>
            <span class="badge ${item.isCorrect ? 'bg-success' : 'bg-danger'}">${item.isCorrect ? 'Correct' : 'Incorrect'}</span>
          </div>
          <p class="fw-semibold text-dark mb-2">${item.question}</p>
          <div class="small mb-1"><span class="text-muted">Selected:</span> <strong class="${item.isCorrect ? 'text-success' : 'text-danger'}">${item.selectedAnswer || 'Skipped'}</strong></div>
          ${!item.isCorrect ? `<div class="small"><span class="text-muted">Correct:</span> <strong class="text-success">${item.correctAnswer}</strong></div>` : ''}
        </div>
      `;
      reviewContainer.appendChild(reviewItem);
    });
  }

  document.getElementById("retake-quiz-btn")?.addEventListener("click", () => {
    window.location.href = "quiz.html";
  });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}