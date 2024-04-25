const nameInput = document.getElementById('nameInput');
let subject = '';
let grades = [];

function speak(text) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = synth.getVoices().find(voice => voice.name === 'Google português do Brasil');
    synth.speak(utterThis);
}

function askForSubject() {
    speak(`${nameInput.value}, para qual matéria é essa média?`);
}

function askForGrade() {
    speak(`Qual foi a sua primeira nota em ${subject}?`);
}

function askForSecondGrade() {
    speak(`Qual foi a sua segunda nota em ${subject}?`);
}

function askForThirdGrade() {
    speak(`Qual foi a sua terceira nota em ${subject}?`);
}

function askForEletivePoints() {
    speak(`Você tem pontos de eletiva para ${subject}? Se sim, quantos pontos?`);
}

function calculateAverage() {
    const total = grades.reduce((acc, grade) => acc + grade, 0);
    const average = total / grades.length;
    return average.toFixed(1);
}

function classifyAverage(average) {
    if (average >= 6) {
        return 'acima da média';
    } else if (average >= 4) {
        return 'na média';
    } else {
        return 'abaixo da média';
    }
}

function main() {
    const name = nameInput.value;
    speak(`${name}, para qual matéria é essa média?`);
    
    const subjectInput = prompt('Para qual matéria é essa média?');
    if (subjectInput) {
        subject = subjectInput;
        askForGrade();
    }
}

function captureGrade() {
    const grade = parseFloat(prompt('Qual foi a sua nota?'));
    if (!isNaN(grade)) {
        grades.push(grade);

        if (grades.length === 1) {
            askForSecondGrade();
        } else if (grades.length === 2) {
            askForThirdGrade();
        } else if (grades.length === 3) {
            askForEletivePoints();
        } else {
            const average = calculateAverage();
            const classification = classifyAverage(average);
            const message = `${nameInput.value}, sua média em ${subject} foi ${average}, você está ${classification} da média.`;
            speak(message);
            resetValues();
        }
    } else {
        speak('Por favor, insira uma nota válida.');
        captureGrade();
    }
}

function resetValues() {
    grades = [];
    document.getElementById('nameInput').disabled = false;
}

window.captureGrade = captureGrade;
