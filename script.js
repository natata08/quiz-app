const quizQuestions = [];
const prefixes = ['A', 'B', 'C', 'D'];
let isQuestionListVisible = false;

const showQuestionListBtn = document.getElementById('show-list-btn');
const answerInputs = document.querySelectorAll('.answer');
const correctnessInputs = document.getElementsByName('correctAnswer');
const questionList = document.querySelector('.list-container');
const searchInput = document.getElementById('search-input');
const playerNameInputs = document.getElementsByName('player-name');
const playerCardsContainer = document.querySelector('.player-cards-container');
const gameIntroForm = document.getElementById('game-intro');

document.addEventListener('DOMContentLoaded', prepareQuestions);
document.getElementById('quiz-form').addEventListener('submit', submitForm);
correctnessInputs.forEach((correctnessInput) => {
  correctnessInput.addEventListener('change', handleRadioChange);
});
document
  .getElementById('randomize-btn')
  .addEventListener('click', randomizeAnswers);
showQuestionListBtn.addEventListener('click', showQuestionList);
document
  .getElementById('sort-select')
  .addEventListener('change', sortQuestions);
gameIntroForm.addEventListener('submit', startQuiz);

function createMessage(message) {
  const messageEl = document.createElement('p');
  messageEl.innerText = message;
  messageEl.classList.add('message');
  return messageEl;
}

function createButton(className, text, functionOnClick) {
  const button = document.createElement('button');
  button.classList.add('btn', className);
  button.innerText = text;
  button.onclick = functionOnClick;
  return button;
}

const areValuesUnique = (inputArray) => {
  const uniqueValues = new Set(inputArray);
  return uniqueValues.size === inputArray.length;
};

const filterQuestions = (questions, keyword) =>
  questions.filter((question) =>
    question.question.toLowerCase().includes(keyword.toLowerCase().trim())
  );

const displayTemporaryMessage = (parentEl, message) => {
  const messageEl = createMessage(message);
  parentEl.appendChild(messageEl);
  setTimeout(() => {
    messageEl.remove();
  }, '3000');
};

async function prepareQuestions() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/Natata08/Natata08.github.io/main/quiz-data/questions.json'
    );
    const data = await response.json();
    const storedQuestions =
      JSON.parse(localStorage.getItem('userQuestions')) || [];
    quizQuestions.push(...data, ...storedQuestions);
  } catch (error) {
    console.error(error);
  }
}

//submitting a question
function submitForm(event) {
  event.preventDefault();
  const questionInput = document.getElementById('question');
  const explanationInput = document.getElementById('explanation');
  const addQuestionSection = document.querySelector('.add-question-section');

  const answers = [...answerInputs].map((input) => input.value.trim());
  if (!areValuesUnique(answers)) {
    displayTemporaryMessage(
      addQuestionSection,
      'Please ensure all answers are unique.'
    );
    return;
  }
  const questionItem = {
    id: quizQuestions.length + 1,
    question: questionInput.value,
    answers: answers.map((answer, index) => ({
      text: answer,
      isCorrect: correctnessInputs[index].checked,
    })),
    explanation: explanationInput.value,
  };

  quizQuestions.push(questionItem);
  const storedQuestions =
    JSON.parse(localStorage.getItem('userQuestions')) || [];
  storedQuestions.push(questionItem);
  localStorage.setItem('userQuestions', JSON.stringify(storedQuestions));

  event.target.reset();
  for (const answerInput of answerInputs) {
    answerInput.classList.remove('wrong-answer', 'correct-answer');
  }

  if (isQuestionListVisible) {
    showQuestionList();
  }

  displayTemporaryMessage(
    addQuestionSection,
    'Question submitted successfully!'
  );
}

function handleRadioChange() {
  answerInputs.forEach((answerInput, index) => {
    const isCorrect = correctnessInputs[index].checked;
    answerInput.classList.toggle('correct-answer', isCorrect);
    answerInput.classList.toggle('wrong-answer', !isCorrect);
  });
}

function randomizeAnswers() {
  const answersAndCorrectness = [...answerInputs].map((answer, index) => ({
    value: answer.value,
    correct: correctnessInputs[index].checked,
  }));
  const sortedAnswersAndCorrectness = [...answersAndCorrectness].sort(
    () => Math.random() - 0.5
  );
  answerInputs.forEach((answerInput, index) => {
    const { value, correct } = sortedAnswersAndCorrectness[index];
    answerInput.value = value;
    correctnessInputs[index].checked = correct;
  });

  if (answersAndCorrectness.some((item) => item.correct)) {
    handleRadioChange();
  }
}

//question list
function createQuestionList(questions) {
  const ul = document.createElement('ul');
  ul.innerHTML = questions
    .map(
      (
        { id, question, answers, explanation },
        index
      ) => `<li  class="item-answer${id}">
      <h3>#${index + 1}. ${question}</h3>
      ${answers
        .map(
          (answer, index) =>
            `<p><span class="prefix">${prefixes[index]}</span> ${answer.text}</p>`
        )
        .join('')}
      <div class="toggle" id="toggle" onclick="handleToggleShowExplanation(${id})">
        <div class="triangle" id="explanation-triangle${id}"></div>
        <p>Explanation</p>
      </div>
      <p class="explanation-text hidden" id="explanation-text${id}">${explanation}</p>
      <button type="button" class="btn show-correct-btn" data-id="${id}">Show answer</button>
    </li>`
    )
    .join('');
  return ul;
}

function displayQuestionList(questions) {
  questionList.innerHTML = '';
  if (questions.length === 0) {
    const message = createMessage('There are no questions.');
    questionList.appendChild(message);
  } else {
    const ul = createQuestionList(questions);
    questionList.appendChild(ul);

    document.querySelectorAll('.show-correct-btn').forEach((button) => {
      button.addEventListener('click', showCorrectAnswer);
    });
  }
}

function handleToggleShowExplanation(id) {
  document.getElementById(`explanation-text${id}`).classList.toggle('hidden');
  document
    .getElementById(`explanation-triangle${id}`)
    .classList.toggle('rotate-up');
}

function showQuestionList() {
  isQuestionListVisible = !isQuestionListVisible;
  document.querySelector('.question-list-section').classList.toggle('hidden');
  if (isQuestionListVisible) {
    displayQuestionList(quizQuestions);
  } else {
    questionList.innerHTML = '';
  }
  showQuestionListBtn.innerText = isQuestionListVisible
    ? 'Hide questions'
    : 'Show questions';
}

function showCorrectAnswer(event) {
  const clickedBtn = event.target;
  const currentInnerText = clickedBtn.innerText.toLowerCase();
  clickedBtn.innerText =
    currentInnerText === 'show answer' ? 'Hide answer' : 'Show answer';

  const targetQuestionId = +clickedBtn.dataset.id;
  const targetQuestion = quizQuestions.find(
    (question) => question.id === targetQuestionId
  );

  targetQuestion.answers.forEach((answer, index) => {
    if (answer.isCorrect) {
      const correctAnswer = document
        .querySelector(`.item-answer${targetQuestionId}`)
        .querySelectorAll('p')[index];
      correctAnswer.classList.toggle('correct-checkmark');
    }
  });
}

//search
const debounce = (fn, delay = 1000) => {
  let timerId = null;
  return () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(), delay);
  };
};

const onInput = debounce(searchQuestions, 1000);

searchInput.addEventListener('input', () => {
  onInput();
});

function searchQuestions() {
  const keyword = searchInput.value;
  const filteredQuestions = filterQuestions(quizQuestions, keyword);
  displayQuestionList(filteredQuestions);
}

//sorting
const sortAlphabetically = (questions) => {
  return [...questions].sort((a, b) => {
    const questionA = a.question.toLowerCase();
    const questionB = b.question.toLowerCase();

    if (questionA < questionB) {
      return -1;
    }
    if (questionA > questionB) {
      return 1;
    }
    return 0;
  });
};

const sortRandomly = (questions) =>
  [...questions].sort(() => Math.random() - 0.5);

function sortQuestions() {
  const sortType = document.getElementById('sort-select').value;
  const sortedQuestions =
    sortType === 'alphabetical'
      ? sortAlphabetically(quizQuestions)
      : sortRandomly(quizQuestions);
  displayQuestionList(sortedQuestions);
}

//game
const gameState = { playersData: [], isGameActive: false };
const endGamePoint = 10;

function createPlayerCards(playersData) {
  const ul = document.createElement('ul');
  ul.classList.add('player-cards');
  const playerCards = playersData
    .map((playerData, index) => {
      const { playerName, points } = playerData;
      return `<li class="player-card">
            <h4 class="player-name">${playerName}</h4>
            <label for="player-points${index}" class="hidden">Points: </label><input type="number" class="player-points" id="player-points${index}" value="${points}" min="0" name="player-points">
            <div>
              <button class="correct-btn btn" onclick="handlePointsBtn(${index}, true)"><span class="hidden">Correct</span><i class="fa-regular fa-circle-check"></i></button>
              <button class="wrong-btn btn" onclick="handlePointsBtn(${index}, false)"><span class="hidden">Wrong</span><i class="fa-regular fa-circle-xmark"></i></button>
            </div>
          </li>`;
    })
    .join('');
  ul.innerHTML = playerCards;
  return ul;
}

const isWinning = () =>
  gameState.playersData.some(({ points }) => points === endGamePoint);

function startQuiz(event) {
  event.preventDefault();
  playerCardsContainer.innerHTML = '';
  const playerNames = [...playerNameInputs].map((input) => input.value.trim());
  if (!areValuesUnique(playerNames)) {
    const message = createMessage(
      "You've entered the same name twice. Please enter different names."
    );
    playerCardsContainer.appendChild(message);
    return;
  }
  event.target.reset();
  gameState.isGameActive = true;
  playerNames.forEach((playerName) => {
    const player = { playerName, points: 0 };
    gameState.playersData.push(player);
  });

  const heading = document.createElement('h3');
  heading.textContent = 'Game Scoreboard';
  playerCardsContainer.appendChild(heading);

  gameIntroForm.classList.add('hidden');
  const ul = createPlayerCards(gameState.playersData);
  playerCardsContainer.appendChild(ul);

  const quitBtn = createButton('quit-btn', 'Quit game', resetGame);
  playerCardsContainer.appendChild(quitBtn);

  document.querySelectorAll('.player-points').forEach((pointInput) => {
    pointInput.addEventListener('keydown', (event) => {
      event.preventDefault();
    });
    pointInput.addEventListener('input', handleInputSpinner);
  });
}

function handleInputSpinner() {
  document.querySelectorAll('.player-points').forEach((pointInput, index) => {
    gameState.playersData[index].points = +pointInput.value;
  });
  if (isWinning()) {
    document.getElementById('win-sound').play();
    endGame();
  }
}

function handlePointsBtn(id, isCorrect) {
  if (isCorrect) {
    gameState.playersData[id].points += 1;
  } else {
    gameState.playersData.forEach((playerData, index) => {
      if (id !== index) {
        playerData.points += 1;
      }
    });
  }
  document.querySelectorAll('.player-points').forEach((pointInput, index) => {
    pointInput.value = gameState.playersData[index].points;
  });
  if (isWinning()) {
    document.getElementById('win-sound').play();
    endGame();
  }
}

function endGame() {
  const winningPlayersData = gameState.playersData.find(
    ({ points }) => points === endGamePoint
  );
  const message = document.createElement('p');
  message.classList.add('win-message');
  message.innerHTML = `${winningPlayersData.playerName} wins!`;

  playerCardsContainer.insertBefore(
    message,
    document.querySelector('.player-cards')
  );

  document.querySelector('.quit-btn').classList.add('hidden');
  const playAgainBtn = createButton('reset-btn', 'Play again', resetGame);
  playerCardsContainer.appendChild(playAgainBtn);

  document.querySelectorAll('.player-cards .btn').forEach((btn) => {
    btn.disabled = true;
  });
  document.querySelectorAll('.player-points').forEach((pointInput) => {
    pointInput.disabled = true;
  });
}

function resetGame() {
  gameState.playersData.splice(0, gameState.playersData.length);
  gameState.isGameActive = false;
  playerNameInputs.forEach((input) => {
    input.value = '';
  });
  playerCardsContainer.innerHTML = '';
  gameIntroForm.classList.remove('hidden');
}
