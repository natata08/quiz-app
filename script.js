const quizQuestions = [];
const prefixes = ['A', 'B', 'C', 'D'];
const endGamePoint = 10;

const showQuestionsListBtn = document.getElementById('show-list-btn');
const answerInputs = document.querySelectorAll('.answer');
const correctnessInputs = document.getElementsByName('correctAnswer');
const questionsList = document.querySelector('.list-container');
const searchInput = document.getElementById('search-input');
const startQuizBtn = document.getElementById('start-quiz-btn');
const playerNameInputs = document.getElementsByName('player-name');

document.addEventListener('DOMContentLoaded', fetchQuestions);

function fetchQuestions() {
  fetch(
    'https://raw.githubusercontent.com/Natata08/Natata08.github.io/main/quiz-data/questions.json'
  )
    .then((response) => response.json())
    .then((questions) => {
      quizQuestions.push(...questions);
    })
    .catch((err) => console.log(err));
}

document.getElementById('quiz-form').addEventListener('submit', submitForm);
correctnessInputs.forEach((correctnessInput) => {
  correctnessInput.addEventListener('change', handleRadioChange);
});
document
  .getElementById('randomize-btn')
  .addEventListener('click', randomizeAnswers);
showQuestionsListBtn.addEventListener('click', showQuestionsList);
startQuizBtn.addEventListener('click', startQuiz);

function createMessage(message) {
  const messageEl = document.createElement('p');
  messageEl.innerText = message;
  messageEl.classList.add('message');
  return messageEl;
}

function createQuestionsList(questions) {
  const ul = document.createElement('ul');
  ul.innerHTML = questions
    .map(
      ({
        id,
        question,
        answers,
        explanation,
      }) => `<li  class="item-answer${id}">
      <h3>Question #${id}. ${question}</h3>
      ${answers
        .map(
          (answer, index) =>
            `<p><span class="prefix">${prefixes[index]}</span> ${answer.text}</p>`
        )
        .join('')}
      <div class="toggle">
        <div class="triangle" id="explanation-triangle${id}"></div>
        <p>Show explanation</p>
      </div>
      <p class="explanation-text hidden" id="explanation-text${id}">${explanation}</p>
      <button type="button" class="btn show-correct-btn" data-id="${id}">Show answer</button>
    </li>`
    )
    .join('');
  return ul;
}

function displayQuestionsList(questions) {
  questionsList.innerHTML = '';
  if (questions.length === 0) {
    const message = createMessage('There are no questions.');
    questionsList.appendChild(message);
  } else {
    const ul = createQuestionsList(questions);
    questionsList.appendChild(ul);

    document.querySelectorAll('.show-correct-btn').forEach((button) => {
      button.addEventListener('click', showCorrectAnswer);
    });

    document.querySelectorAll('.toggle').forEach((toggle, index) => {
      toggle.addEventListener('click', () => {
        document
          .getElementById(`explanation-text${index + 1}`)
          .classList.toggle('hidden');
        document
          .getElementById(`explanation-triangle${index + 1}`)
          .classList.toggle('rotate-up');
      });
    });
  }
}

function filterQuestions(questions, keyword) {
  return questions.filter((question) =>
    question.question.toLowerCase().includes(keyword.toLowerCase().trim())
  );
}

function submitForm(event) {
  event.preventDefault();
  const questionInput = document.getElementById('question');
  const answerInputsArray = Array.from(answerInputs);
  const explanationInput = document.getElementById('explanation');

  const questionItem = {
    id: quizQuestions.length + 1,
    question: questionInput.value,
    answers: answerInputsArray.map((answer, index) => ({
      text: answer.value,
      isCorrect: correctnessInputs[index].checked,
    })),
    explanation: explanationInput.value,
  };
  quizQuestions.push(questionItem);

  event.target.reset();
  for (const answerInput of answerInputs) {
    answerInput.classList.remove('wrong-answer', 'correct-answer');
  }

  const message = createMessage('Question submitted successfully!');
  document.querySelector('.question-input').appendChild(message);
  setTimeout(() => {
    message.remove();
  }, '3000');
}

function handleRadioChange() {
  answerInputs.forEach((answerInput, index) => {
    if (correctnessInputs[index].checked) {
      answerInput.classList.add('correct-answer');
      answerInput.classList.remove('wrong-answer');
    } else {
      answerInput.classList.add('wrong-answer');
      answerInput.classList.remove('correct-answer');
    }
  });
}

function randomizeAnswers() {
  //getting an array: [['sth', false], ['sth', false], ['sth', true],['sth', false]]
  const answersAndCorrectness = Array.from(answerInputs).map(
    (answer, index) => [answer.value, correctnessInputs[index].checked]
  );
  //shuffle the elements of an array
  answersAndCorrectness.sort(() => Math.random() - 0.5);
  //assigning values to the corresponding inputs and radio buttons
  answerInputs.forEach((answerInput, index) => {
    answerInput.value = answersAndCorrectness[index][0];
    correctnessInputs[index].checked = answersAndCorrectness[index][1];
  });
  // change the colors only if randomizing after specifying the correctness
  if (answersAndCorrectness.filter((item) => item.includes(true)).length)
    handleRadioChange();
}

function showQuestionsList() {
  document.querySelector('.question-list').classList.toggle('hidden');
  if (questionsList.innerHTML === '') {
    displayQuestionsList(quizQuestions);
    showQuestionsListBtn.innerText = 'Hide questions';
  } else {
    questionsList.innerHTML = '';
    showQuestionsListBtn.innerText = 'Show questions';
  }
}

function showCorrectAnswer(event) {
  const clickedBtn = event.target;

  if (clickedBtn.innerText.toLowerCase() === 'show answer') {
    clickedBtn.innerText = 'Hide answer';
  } else {
    clickedBtn.innerText = 'Show answer';
  }

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

const debounce = (fn, delay = 1000) => {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

const onInput = debounce(searchQuestions, 1000);

searchInput.addEventListener('input', () => {
  onInput();
});

function searchQuestions() {
  const keyword = searchInput.value;
  const filteredQuestions = filterQuestions(quizQuestions, keyword);
  displayQuestionsList(filteredQuestions);
}

function checkInputs() {
  const values = Array.from(playerNameInputs).map((input) =>
    input.value.trim()
  );
  const isInputsFilled = values.every((value) => value !== '');
  const isNameUnique = new Set(values).size === values.length;
  startQuizBtn.disabled = !(isInputsFilled && isNameUnique);
}

playerNameInputs.forEach((input) =>
  input.addEventListener('input', checkInputs)
);

let playersData = [];

function startQuiz(event) {
  event.preventDefault();
  startQuizBtn.disabled = true;
  playersData = Array.from(playerNameInputs).map((input) => ({
    playerName: input.value,
    points: 0,
  }));

  const ul = createPlayerCards(playersData);
  document.querySelector('.player-cards-container').appendChild(ul);

  document.querySelectorAll('.correct-btn').forEach((correctBtn) => {
    correctBtn.addEventListener('click', (event) => {
      handlePointsBtn(event, true);
    });
  });
  document.querySelectorAll('.wrong-btn').forEach((wrongBtn) => {
    wrongBtn.addEventListener('click', (event) => {
      handlePointsBtn(event, false);
    });
  });

  document.querySelectorAll('.player-points').forEach((pointInput) => {
    pointInput.addEventListener('keydown', (event) => {
      event.preventDefault();
    });
    pointInput.addEventListener('input', handleInputSpinner);
  });
}

const isWinning = () =>
  playersData.some(({ points }) => points === endGamePoint);

function handleInputSpinner() {
  document.querySelectorAll('.player-points').forEach((pointInput, index) => {
    playersData[index].points = +pointInput.value;
  });
  if (isWinning()) {
    document.getElementById('win-sound').play();
    endGame();
  }
}

function createPlayerCards(playersData) {
  const ul = document.createElement('ul');
  ul.classList.add('player-cards');
  const playerCards = playersData
    .map((playerData, index) => {
      const { playerName, points } = playerData;
      return `<li class="player-card">
            <h3 class="player-name">${playerName}</h3>
            <label>Points: <input type="number" class="player-points" value="${points}" min="0" name="player-points"></label>
            <div>
              <button class="correct-btn btn" data-number="${index}">Correct</button>
              <button class="wrong-btn btn" data-number="${index}">Wrong</button>
            </div>
          </li>`;
    })
    .join('');
  ul.innerHTML = playerCards;
  return ul;
}

function handlePointsBtn(event, isCorrect) {
  const targetPlayerNumber = +event.target.dataset.number;
  if (isCorrect) {
    playersData[targetPlayerNumber].points += 1;
  } else {
    playersData.forEach((playerData, index) => {
      if (targetPlayerNumber !== index) {
        playerData.points += 1;
      }
    });
  }
  document.querySelectorAll('.player-points').forEach((pointInput, index) => {
    pointInput.value = playersData[index].points;
  });
  if (isWinning()) {
    document.getElementById('win-sound').play();
    endGame();
  }
}

function endGame() {
  const winningPlayersData = playersData.find(
    ({ points }) => points === endGamePoint
  );
  const message = document.createElement('p');
  message.classList.add('win-message');
  message.innerHTML = `${winningPlayersData.playerName} wins!`;

  document
    .querySelector('.player-cards-container')
    .insertBefore(message, document.querySelector('.player-cards'));

  const playAgainBtn = document.createElement('button');
  playAgainBtn.classList.add('btn', 'reset-btn');
  playAgainBtn.innerText = 'Play again';
  document.querySelector('.player-cards-container').appendChild(playAgainBtn);
  document.querySelector('.reset-btn').addEventListener('click', resetGame);

  document.querySelectorAll('.player-cards .btn').forEach((btn) => {
    btn.disabled = true;
  });
  document.querySelectorAll('.player-points').forEach((pointInput) => {
    pointInput.disabled = true;
  });
}

function resetGame() {
  playersData = [];
  playerNameInputs.forEach((input) => {
    input.value = '';
  });
  document.querySelector('.player-cards-container').innerHTML = '';
}
