const quizQuestions = [];

const formEl = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');

formEl.addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault(); // Prevent form from submitting default way

  const questionInput = document.getElementById('question');
  const answerInputs = Array.from(document.querySelectorAll('.answer')); //get NodeList, Array.from for applying .map later
  const correctnessInputs = document.getElementsByName('correctAnswer'); //get NodeList

  const questionItem = {
    id: quizQuestions.length + 1,
    question: questionInput.value,
    answers: answerInputs.map((answer, index) => ({
      text: answer.value,
      isCorrect: correctnessInputs[index].checked,
    })),
  };
  quizQuestions.push(questionItem);

  event.target.reset(); // Clear the form

  console.log(quizQuestions);
}
