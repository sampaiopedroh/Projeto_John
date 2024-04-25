const nameInput = document.getElementById('nameInput');
const questionDiv = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const resultDiv = document.getElementById('result');
let subject = '';
let grades = [];
let step = 0;

function speak(text) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = synth.getVoices().find(voice => voice.name === 'Google português do Brasil');
    synth.speak(utterThis);
}

function askQuestion(text) {
    speak(text);
    questionDiv.innerHTML = text;
}

function captureGrade() {
    const answer = answerInput.value.trim();
    
    if (step === 0) {
        subject = answer;
        askQuestion(`${nameInput.value}, qual foi a sua primeira nota em ${subject}?`);
    } else if (step === 1 || step === 2 || step === 3) {
        const grade = parseFloat(answer);
        if (!isNaN(grade)) {
            grades.push(grade);
            
            if (step === 1) {
                askQuestion(`${nameInput.value}, qual foi a sua segunda nota em ${subject}?`);
            } else if (step === 2) {
                askQuestion(`${nameInput.value}, qual foi a sua terceira nota em ${subject}?`);
            } else if (step === 3) {
                askQuestion(`${nameInput.value}, você tem pontos de eletiva para ${subject}? (Responda com Y ou N)`);
            }
        } else {
            speak('Por favor, insira uma nota válida.');
        }
    } else if (step === 4) {
        if (answer.toUpperCase() === 'Y' || answer.toUpperCase() === 'N') {
            if (answer.toUpperCase() === 'Y') {
                askQuestion(`${nameInput.value}, quantos pontos de eletiva você tem para ${subject}?`);
            } else {
                grades.push(0);
                calculateAndShowResult();
            }
        } else {
            speak('Por favor, responda com Y ou N.');
        }
    } else if (step === 5) {
        const grade = parseFloat(answer);
        if (!isNaN(grade)) {
            grades.push(grade);
            calculateAndShowResult();
        } else {
            speak('Por favor, insira uma nota válida.');
        }
    }
    
    step++;
}

function calculateAndShowResult() {
    const average = calculateAverage();
    const classification = classifyAverage(average);
    const message = `${nameInput.value}, sua média em ${subject} foi ${average}, você está ${classification}.`;
    
    speak(message);
    resultDiv.innerHTML = message;
    resetValues();
}

function calculateAverage() {
    const total = grades.reduce((acc, grade) => acc + grade, 0);
    const average = total / grades.length;
    return average.toFixed(1);
}

function classifyAverage(average) {
    if (average > 6) {
        return 'acima da média';
    } else if (average == 6) {
        return 'na média';
    } else {
        return 'abaixo da média';
    }
}

function resetValues() {
    grades = [];
    document.getElementById('nameInput').disabled = false;
    answerInput.value = '';
    step = 0;
}

window.captureGrade = captureGrade;
