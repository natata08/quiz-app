const quizQuestions = [
  {
    id: 1,
    question: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Earth', isCorrect: false },
      { text: 'Mars', isCorrect: true },
      { text: 'Jupiter', isCorrect: false },
      { text: 'Saturn', isCorrect: false },
    ],
    explanation:
      'Mars is called the Red Planet because of its reddish appearance.',
  },
  {
    id: 2,
    question: 'What is the largest ocean on Earth?',
    answers: [
      { text: 'Atlantic Ocean', isCorrect: false },
      { text: 'Indian Ocean', isCorrect: false },
      { text: 'Pacific Ocean', isCorrect: true },
      { text: 'Arctic Ocean', isCorrect: false },
    ],
    explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
  },
  {
    id: 3,
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: 'William Shakespeare', isCorrect: true },
      { text: 'Mark Twain', isCorrect: false },
      { text: 'Charles Dickens', isCorrect: false },
      { text: 'Jane Austen', isCorrect: false },
    ],
    explanation: "William Shakespeare wrote the tragedy 'Romeo and Juliet'.",
  },
  {
    id: 4,
    question: 'What is the hardest natural substance on Earth?',
    answers: [
      { text: 'Gold', isCorrect: false },
      { text: 'Iron', isCorrect: false },
      { text: 'Diamond', isCorrect: true },
      { text: 'Silver', isCorrect: false },
    ],
    explanation: 'Diamond is the hardest natural substance known to man.',
  },
  {
    id: 5,
    question: 'In which year did the Titanic sink?',
    answers: [
      { text: '1912', isCorrect: true },
      { text: '1905', isCorrect: false },
      { text: '1898', isCorrect: false },
      { text: '1923', isCorrect: false },
    ],
    explanation: 'The RMS Titanic sank in 1912 after hitting an iceberg.',
  },
  {
    id: 6,
    question: 'What is the smallest prime number?',
    answers: [
      { text: '1', isCorrect: false },
      { text: '2', isCorrect: true },
      { text: '3', isCorrect: false },
      { text: '5', isCorrect: false },
    ],
    explanation: 'The smallest prime number is 2.',
  },
  {
    id: 7,
    question: 'What is the chemical symbol for gold?',
    answers: [
      { text: 'Au', isCorrect: true },
      { text: 'Ag', isCorrect: false },
      { text: 'Fe', isCorrect: false },
      { text: 'Pb', isCorrect: false },
    ],
    explanation:
      "The chemical symbol for gold is Au, derived from its Latin name 'Aurum'.",
  },
  {
    id: 8,
    question: 'Who developed the theory of relativity?',
    answers: [
      { text: 'Isaac Newton', isCorrect: false },
      { text: 'Nikola Tesla', isCorrect: false },
      { text: 'Albert Einstein', isCorrect: true },
      { text: 'Galileo Galilei', isCorrect: false },
    ],
    explanation: 'Albert Einstein developed the theory of relativity.',
  },
  {
    id: 9,
    question: 'What is the main ingredient in traditional Japanese miso soup?',
    answers: [
      { text: 'Tofu', isCorrect: false },
      { text: 'Soybean paste', isCorrect: true },
      { text: 'Seaweed', isCorrect: false },
      { text: 'Fish', isCorrect: false },
    ],
    explanation: 'The main ingredient in miso soup is soybean paste.',
  },
  {
    id: 10,
    question: "Which element has the chemical symbol 'O'?",
    answers: [
      { text: 'Osmium', isCorrect: false },
      { text: 'Oxygen', isCorrect: true },
      { text: 'Oganesson', isCorrect: false },
      { text: 'Oxium', isCorrect: false },
    ],
    explanation: "The chemical symbol 'O' stands for Oxygen.",
  },
];

const formEl = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const showListBtn = document.getElementById('show-list-btn');
const searchBtn = document.getElementById('search-btn');
const questionInput = document.getElementById('question');
const answerInputs = document.querySelectorAll('.answer'); //get NodeList
const correctnessInputs = document.getElementsByName('correctAnswer'); //get NodeList
const explanationInput = document.getElementById('explanation');
const questionsList = document.querySelector('.list-container');

formEl.addEventListener('submit', submitForm);
correctnessInputs.forEach((correctnessInput) => {
  correctnessInput.addEventListener('change', handleRadioChange);
});
randomizeBtn.addEventListener('click', randomizeAnswers);
showListBtn.addEventListener('click', showQuestionsList);
searchBtn.addEventListener('click', searchQuestions);

//helper function
function getMessage(message) {
  const messageEl = document.createElement('p');
  messageEl.innerText = message;
  messageEl.classList.add('message');
  return messageEl;
}

function createQuestionsList(questions) {
  const ul = document.createElement('ul');
  let output = '';
  questions.map((item) => {
    const { id, question, answers } = item;
    output += `<li  class="item-answer${id}">
      <h3>Question #${id}. ${question}</h3>
      <p><span class="prefix">A</span> ${answers[0].text}</p>
      <p><span class="prefix">B</span> ${answers[1].text}</p>
      <p><span class="prefix">C</span> ${answers[2].text}</p>
      <p><span class="prefix">D</span> ${answers[3].text}</p>
      <button type="button" class="btn show-correct-btn" data-id="${id}">Show answer</button>
    </li>`;
  });
  ul.innerHTML = output;
  return ul;
}

function filterQuestions(questions, keyword) {
  return questions.filter((question) =>
    question.question.toLowerCase().includes(keyword.toLowerCase().trim())
  );
}

//submitting a question
function submitForm(event) {
  event.preventDefault(); // Prevent form from submitting in default way
  const answerInputsArray = Array.from(answerInputs); //Array.from for applying .map

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

  // Clear the form (text and color)
  event.target.reset();
  for (const answerInput of answerInputs) {
    answerInput.classList.remove('wrong-answer', 'correct-answer');
  }

  //add message of submitting successfully
  const message = getMessage('Question submitted successfully!');
  document.querySelector('.question-input').appendChild(message);
  setTimeout(() => {
    message.remove();
  }, '3000');
}

// changing color for for the "correct" and ""wrong" answers
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

// randomizing the order of the 4 option inputs
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

//showing a list of all quiz questions added to the array
function showQuestionsList() {
  document.querySelector('.question-list').classList.toggle('hidden');
  if (questionsList.innerHTML === '') {
    if (quizQuestions.length === 0) {
      const message = getMessage('There are no questions.');
      questionsList.appendChild(message);
      setTimeout(() => {
        message.remove();
      }, '3000');
    } else {
      const ul = createQuestionsList(quizQuestions);
      questionsList.appendChild(ul);
      //adding event listeners to buttons Show answer
      const buttonsShowAnswer = document.querySelectorAll('.show-correct-btn');
      buttonsShowAnswer.forEach((button) => {
        button.addEventListener('click', showCorrectAnswer);
      });

      showListBtn.innerText = 'Hide questions';
    }
  } else {
    questionsList.innerHTML = '';
    showListBtn.innerText = 'Show questions';
  }
}

//showing correct answer
function showCorrectAnswer(event) {
  const clickedBtn = event.target;
  if (clickedBtn.innerText.toLowerCase() === 'show answer') {
    console.log('1', clickedBtn.innerText);
    clickedBtn.innerText = 'Hide answer';
  } else {
    console.log('2', clickedBtn.innerText);
    clickedBtn.innerText = 'Show answer';
  }
  console.log('3', clickedBtn.innerText);
  const targetQuestionId = parseInt(clickedBtn.dataset.id);
  const targetQuestion = quizQuestions.find(
    (question) => question.id === targetQuestionId
  );
  targetQuestion.answers.forEach((answer, index) => {
    if (answer.isCorrect) {
      const correctAnswer = document
        .querySelector(`.item-answer${targetQuestionId}`)
        .querySelectorAll('p')[index];
      correctAnswer.classList.toggle('pseudo-element');
    }
  });
}

// filtering the questions by searching the content of the question
function searchQuestions() {
  const keyword = document.getElementById('search-input').value;
  const filteredQuestions = filterQuestions(quizQuestions, keyword);

  const ul = createQuestionsList(filteredQuestions);
  questionsList.innerHTML = '';
  questionsList.appendChild(ul);
  const buttonsShowAnswer = document.querySelectorAll('.show-correct-btn');
  buttonsShowAnswer.forEach((button) => {
    button.addEventListener('click', showCorrectAnswer);
  });
}
