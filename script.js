const quizQuestions = [];

const sectionEl = document.querySelector('.question-section');
const formEl = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const questionInput = document.getElementById('question');
const answerInputs = document.querySelectorAll('.answer'); //get NodeList
const correctnessInputs = document.getElementsByName('correctAnswer'); //get NodeList
const randomizeBtn = document.getElementById('randomize-btn');

formEl.addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault(); // Prevent form from submitting default way
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

// Listen for changes radio inputs to change color of answer inputs
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
