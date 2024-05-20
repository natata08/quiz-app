const quizQuestions = [];

const sectionEl = document.querySelector('.question-section');
const formEl = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const questionInput = document.getElementById('question');
const answerInputs = document.querySelectorAll('.answer'); //get NodeList
const correctnessInputs = document.getElementsByName('correctAnswer'); //get NodeList
const randomizeBtn = document.getElementById('randomize-btn');

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
}

// changing color for for the "correct" and ""wrong" answers
//add addEventListener for each radio button
for (const correctnessInput of correctnessInputs) {
  correctnessInput.addEventListener('change', handleRadioChange);
}

function handleRadioChange() {
  for (let i = 0; i < answerInputs.length; i++) {
    const answerInput = answerInputs[i];
    if (correctnessInputs[i].checked) {
      answerInput.classList.add('correct-answer');
      answerInput.classList.remove('wrong-answer');
    } else {
      answerInput.classList.add('wrong-answer');
      answerInput.classList.remove('correct-answer');
    }
  }
}

// randomizing the order of the 4 option inputs
randomizeBtn.addEventListener('click', randomizeAnswers);

function randomizeAnswers() {
  const answerInputsArray = Array.from(answerInputs);
  const values = answerInputsArray.map((answer) => answer.value); //['Berlin', 'Copenhagen', 'Madrid', 'Rome']
  //Fisher-Yates Sorting Algorithm
  for (let i = values.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [values[i], values[randomIndex]] = [values[randomIndex], values[i]]; //array destructuring assignment
  }
  //assigning values to answer inputs
  for (let i = 0; i < answerInputsArray.length; i++) {
    answerInputsArray[i].value = values[i];
  }
}
