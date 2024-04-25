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
    answerInput.value = ''; // Limpar o campo de input
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
        const eletivaPoints = parseFloat(answer);
        if (!isNaN(eletivaPoints)) {
            grades.push(eletivaPoints);
            calculateAndShowResult(true, eletivaPoints);
        } else {
            speak('Por favor, insira uma quantidade válida de pontos de eletiva.');
        }
    }
    
    step++;
}

function calculateAndShowResult(hasEletiva = false, eletivaPoints = 0) {
    const average = calculateAverage(hasEletiva, eletivaPoints);
    const classification = classifyAverage(average);
    const message = `${nameInput.value}, sua média em ${subject} foi ${average}, você está ${classification}.`;
    
    speak(message);
    resultDiv.innerHTML = message;
    resetValues();
}

function calculateAverage(hasEletiva, eletivaPoints) {
    let total = 0;
    
    total += (grades[0] + grades[1]) * 0.25;
    total += grades[2] * 0.5;

    if (hasEletiva && total < 10) {
        total += eletivaPoints;
    }
    
    const average = total.toFixed(1);
    return average;
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
    answerInput.value = ''; // Limpar o campo de input
    step = 0;
}

window.captureGrade = captureGrade;
