const quizQuestions = [
  {
    id: 1,
    question: 'Which planet is known as the Red Planet?',
    options: [
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
    options: [
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
    options: [
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
    options: [
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
    options: [
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
    options: [
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
    options: [
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
    options: [
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
    options: [
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
    options: [
      { text: 'Osmium', isCorrect: false },
      { text: 'Oxygen', isCorrect: true },
      { text: 'Oganesson', isCorrect: false },
      { text: 'Oxium', isCorrect: false },
    ],
    explanation: "The chemical symbol 'O' stands for Oxygen.",
  },
];

const sectionEl = document.querySelector('.question-section');
const formEl = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const questionInput = document.getElementById('question');
const answerInputs = document.querySelectorAll('.answer'); //get NodeList
const correctnessInputs = document.getElementsByName('correctAnswer'); //get NodeList
const explanationInput = document.getElementById('explanation');

//submitting a question
formEl.addEventListener('submit', submitForm);

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
  const messageEl = document.createElement('p');
  messageEl.innerText = 'Question submitted successfully!';
  messageEl.classList.add('message');
  sectionEl.appendChild(messageEl);
  setTimeout(() => {
    messageEl.remove();
  }, '4000');
}

// changing color for for the "correct" and ""wrong" answers
//add addEventListener for each radio button
correctnessInputs.forEach((correctnessInput) => {
  correctnessInput.addEventListener('change', handleRadioChange);
});

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
randomizeBtn.addEventListener('click', randomizeAnswers);

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
