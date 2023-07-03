
const scoreElem = document.getElementById('score');
const formElem = document.querySelector("form");
const qElem = document.getElementById('question');
const resElem = document.getElementById('result');
const submitButton = document.getElementById('submit-btn');
const nextButton = document.getElementById('next-btn');

let score = 0;

let curQuestion;
let curQuestionIdx = -1;

let numQuestions = 20;

function getRandomInt(min, max) {
   return min + Math.floor(Math.random() * (max-min));
}

function getNextQuestion() {
   let a = getRandomInt(2,10);
   let b = getRandomInt(2,10);
   curQuestion = {
      question: `What is ${a} x ${b}`,
      answer: a*b,
   }
   curQuestionIdx++;
}

function getOptType(q) {
   //console.log(q);
   if (!Object.hasOwn(q, 'options')) {
      return 'text';
   } else if (typeof(q.answer) == "string") {
      return 'radio';
   } else {
      return 'checkbox';
   }
}

function showQuestion() {

   //console.log("showQuestion called");
   getNextQuestion();
   //console.log(curQuestion);

   qElem.innerHTML = '';
   resElem.textContent = '';

   const qLegend = document.createElement('legend');
   qLegend.innerHTML = `${curQuestionIdx+1}. ${curQuestion.question}`;
   qElem.appendChild(qLegend);

   const optType = getOptType(curQuestion);
   //console.log(`optType: ${optType}`);

   if (optType == 'text') {
   
      const inp = document.createElement('input');
      inp.type = optType;
      inp.name = 'answer';
      inp.id = 'text-answer-inp';

      qElem.appendChild(inp);
      
   } else {
      for (const i in curQuestion.options) {

	 const div = document.createElement('div');
	 div.id = 'options';
   
	 const inp = document.createElement('input');
	 inp.type = optType;
	 inp.name = 'answer';
	 inp.value = curQuestion.options[i];
	 inp.id = `option-${i}`;
	 div.appendChild(inp);

	 const label = document.createElement('label');
	 label.textContent = curQuestion.options[i];
	 label.htmlFor = `option-${i}`;
	 div.appendChild(label);

	 qElem.appendChild(div);
      }
   }
   nextButton.disabled = true;
   submitButton.disabled = false;
   qElem.disabled = false;
}


function calculateScore() {
   //console.log("calculateScorecalled");

   submitButton.disabled = true;

   const expAns = curQuestion.answer;

   const optType = getOptType(curQuestion);

   const data = new FormData(formElem);
   //console.log(data.get('answer')); return;

   // ----------------------------------------------------------------------
   // compute ansIsCorrect 
   ansIsCorrect = false;
   if ((optType == 'radio') || (optType == 'text')) {
      const ans = data.get('answer');
      //console.log(`ans is ${ans}`);
      if (ans == expAns)
	 ansIsCorrect = true;
      
   } else {
      const ans = data.getAll('answer');
      //console.log(`ans is ${ans}`);
      
      if (expAns.length == ans.length) {
	 ansIsCorrect = true;
	 for (e of ans) {
	    if (!expAns.includes(e)){
	       ansIsCorrect = false;
	       break;
	    }
	 }
      }
   }

   qElem.disabled = true;

   if (ansIsCorrect) {
      score++;
      resElem.textContent = 'Correct!';
   } else {
      if ((optType == 'radio') || (optType == 'text')) {
	 resElem.textContent = `Incorrect! Answer is ${expAns}`;
      } else {
	 resElem.textContent = `Incorrect! Answer is ${expAns.join(', ')}`;
      }
   }

   scoreElem.textContent = `You scored ${score} out of ${numQuestions}.`;

   if (curQuestionIdx < numQuestions-1) {
      nextButton.disabled = false;
   } else {
      nextButton.style.display = 'none';
      const doneElem = document.getElementById('done');
      doneElem.textContent = "All Done";
   }
}

// ======================================================================


formElem.addEventListener(
   "submit",
   (event) => {
      calculateScore();
      event.preventDefault();
   },
  false
);


nextButton.onclick = showQuestion;

scoreElem.textContent = `You scored ${score} out of ${numQuestions}.`;
showQuestion();
