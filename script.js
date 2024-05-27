const quizQuestions = [];

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
for (const correctnessInput of correctnessInputs) {
  correctnessInput.addEventListener('change', handleRadioChange);
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
