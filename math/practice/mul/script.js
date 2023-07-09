
const scoreElem = document.getElementById('score');
const formElem = document.querySelector("form");
const qElem = document.getElementById('question');
const resElem = document.getElementById('result');
const submitButton = document.getElementById('submit-btn');

let score = 0;

let curQuestion;

function getRandomInt(min, max) {
   return min + Math.floor(Math.random() * (max-min));
}

function shuffle(a) {
   let tmp;
   for (let i =a.length-1; i > 0; i--) {
      j = getRandomInt(0, i);
      tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
   }
}

class QBank {
   constructor(min, max) {
      this.min = min;
      this.max = max;
      this.numIdxAry = [];
      this.qIdx = 0;
      this.numTables = this.max - this.min + 1;

      this.tableMinEntry = 2; // x times 2 to x times 9
      this.tableMaxEntry = 9;

      this.tableSize = this.tableMaxEntry - this.tableMinEntry  + 1;
      this.numQuestions = this.numTables  * this.tableSize;
      //console.log(`min:${this.min}; max:${this.max}; qIdx:${this.qIdx}; numTables:${this.numTables}; tableSize:${this.tableSize}; numQuestions:${this.numQuestions}; `);

     
      for (let i=0; i < this.numQuestions; i++) {
         this.numIdxAry.push(i);
      }

      //let outp = '';
      //for (const e of this.numIdxAry)
           // outp += ` ${e}`;
      //console.log(outp);

      shuffle(this.numIdxAry);

      this.initAnswers();
      //outp = '';
      //for (const e of this.numIdxAry)
           // outp += ` ${e}`;
      //console.log(outp);

   }

   initAnswers() {
      this.answered = Array(this.numQuestions);
   }

   getA(idx) {
      return Math.floor(0 + this.min + (idx / this.tableSize));
   }

   getB(idx) {
      return Math.floor(this.tableMinEntry + (idx % this.tableSize));
   }

   getNextQuestion() {
      if (this.qIdx == this.numQuestions) {
         return null;
      } else {
         let numIdx = this.numIdxAry[this.qIdx];
         let a = this.getA(numIdx);
         let b = this.getB(numIdx);
	 //console.log(`dbg(getNextQuestion): numIdx:${numIdx}; a:${a}; b:${b};`);
         const curQuestion = {
            question: `${a} x ${b} = `,
            answer: a*b,

         }
         this.qIdx++;
         return curQuestion;
      }
      
   }

   lastQuestion() {
      return (this.qIdx == this.numQuestions);
   }


   markCorrect() {
      console.log(`markCorrect called`);
      this.answered[this.qIdx-1] = null;
   }

   markIncorrect(a) {
      console.log(`markIncorrect called with ${a}`);
      this.answered[this.qIdx-1] = a;
   }

   getIncorrectAnswers(a) {
      let rval = [];
      for (const i in this.answered) {
         let str = '';
         if ((this.answered[i] === "") || (this.answered[i] != null)) {
            let a = this.getA(this.numIdxAry[i]);
            let b = this.getB(this.numIdxAry[i]);
            str += `${a} x ${b} = ${a*b} ( `
            if (this.answered[i] === "" ) {
               str += 'Unanswered';
            } else {
               str += this.answered[i];
            }
            str += ' )  ';
            rval.push(str);
         }
      }
      this.answered[this.qIdx-1] = a;
      return rval;
   }

}


function dbgQB() {
   let tmp;
   tmp = qb.getNextQuestion();
   while (tmp != null) {
      console.log(`${tmp.question} ${tmp.answer}`);
      tmp = qb.getNextQuestion();
   }
   
}


function xgetNextQuestion() {
   let a = getRandomInt(2,10);
   let b = getRandomInt(2,10);
   curQuestion = {
      question: `${a} x ${b} = `,
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
   curQuestion = qb.getNextQuestion();
   //console.log(curQuestion);

   qElem.innerHTML = '';
   resElem.textContent = '';

   //const qLegend = document.createElement('legend');
   //qLegend.innerHTML = `${curQuestionIdx+1}. ${curQuestion.question}`;
   //qElem.appendChild(qLegend);
   const q = document.createElement('div');
   q.id = "question";
   q.innerHTML = `Q${qb.qIdx}. &nbsp; &nbsp; ${curQuestion.question}`;
   qElem.appendChild(q);

   const optType = getOptType(curQuestion);
   //console.log(`optType: ${optType}`);

   if (optType == 'text') {
   
      const inp = document.createElement('input');
      inp.type = optType;
      inp.name = 'answer';
      inp.id = 'text-answer-inp';

      inp.addEventListener("keypress", function(event) {
         // If the user presses the "Enter" key on the keyboard
         if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            submitButton.click();
         }
      });

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

   document.getElementById("text-answer-inp").focus();
}


function calculateScore() {
   //console.log("calculateScorecalled");


   const expAns = curQuestion.answer;

   const optType = getOptType(curQuestion);

   const data = new FormData(formElem);
   //console.log(data.get('answer')); return;

   // ----------------------------------------------------------------------
   // compute ansIsCorrect 
   ansIsCorrect = false;
   let ans;
   if ((optType == 'radio') || (optType == 'text')) {
      ans = data.get('answer');
      //console.log(`ans is ${ans}`);
      if (ans == expAns)
         ansIsCorrect = true;
      
   } else {
      ans = data.getAll('answer');
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

   if (ansIsCorrect) {
      score++;
      resElem.textContent = 'Correct!';
      qb.markCorrect();
   } else {
      if ((optType == 'radio') || (optType == 'text')) {
         //resElem.textContent = `Incorrect! Answer is ${expAns}`;
         qb.markIncorrect(ans);
      } else {
         //resElem.textContent = `Incorrect! Answer is ${expAns.join(', ')}`;
      }
   }

   //console.log(qb.answered);
   scoreElem.textContent = `You scored ${score} out of ${qb.numQuestions}.`;

   if (!qb.lastQuestion()) {
      showQuestion();
   } else {
      const doneElem = document.getElementById('done');
      let result = '';
      result += "<div>All Done</div>";
      let ans = qb.getIncorrectAnswers();
      for (const e of ans) {
         result += `<div>${e}</div>`;
         
      }
      doneElem.innerHTML = result;
   }
}

// ======================================================================

const queryString = window.location.search;
//console.log(queryString);

const urlParams = new URLSearchParams(queryString);

const typeParam = urlParams.get("type");
//console.log(typeParam);

var min = 2, max = 9;
const re = /^(\d+)_(\d+)$/;
const matchResult = typeParam.match(re);
if (matchResult) {
   min = Number(matchResult[1]);
   max = Number(matchResult[2]);
}
//console.log(`min=${min}; max=${max}`);


const qb = new QBank(min, max)

formElem.addEventListener(
   "submit",
   (event) => {
      calculateScore();
      event.preventDefault();
   },
  false
);

scoreElem.textContent = `You scored ${score} out of ${qb.numQuestions}.`;
showQuestion();
