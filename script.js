let questions; // Variable to store questions
let userAnswers = {}; // Object to store user's answers
let numQuestionsAnswered = 0; // Variable to track the number of questions answered

// Load questions from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        // Store questions in the variable
        questions = data;
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

    

// Function to start the exam
function startExam() {
    // Show exam container
    document.getElementById('examContainer').classList.remove('hidden');
    // Call function to display questions
    displayQuestions();
}

// Function to display questions
function displayQuestions() {
    // Retrieve 20 random questions from the question bank
    let selectedQuestions = getRandomQuestions(20);
    // Clear previous questions
    document.getElementById('questionContainer').innerHTML = '';
    // Loop through selected questions and create HTML elements
    selectedQuestions.forEach((question, index) => {
        let questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p>Question ${index + 1}: ${question.question}</p>
            <ul>
                ${question.options.map(option => `<li><input type="radio" name="question${index}" value="${option}">${option}</li>`).join('')}
            </ul>
        `;
        document.getElementById('questionContainer').appendChild(questionElement);
    });
}

// Function to get random questions from the question bank
function getRandomQuestions(numQuestions) {
    // Get a copy of all questions
    let allQuestions = [...questions];
    // Shuffle questions
    allQuestions.sort(() => Math.random() - 0.5);
    // Select the first 'numQuestions' questions
    return allQuestions.slice(0, numQuestions);
}

// Function to submit exam and calculate result
function submitExam() {
    // Get user's answers
    let inputs = document.querySelectorAll('input[type="radio"]:checked');
    inputs.forEach(input => {
        let questionIndex = parseInt(input.name.replace('question', ''));
        userAnswers[questionIndex] = input.value;
    });
    // Calculate score
    let score = calculateScore();
    // Display result
    document.getElementById('resultContainer').classList.remove('hidden');
    document.getElementById('examContainer').classList.add('hidden');
    document.getElementById('score').innerText = `Your Score: ${score}/20`;
}

// Function to calculate score
function calculateScore() {
    let score = 0;
    for (let questionIndex in userAnswers) {
        let correctAnswer = questions[questionIndex].correctAnswer;
        if (userAnswers[questionIndex] === correctAnswer) {
            score++;
        }
    }
    return score;
}

// Function to handle retake exam button click
function retakeExam() {
    // Hide result container and show home container
    document.getElementById('resultContainer').classList.add('hidden');
    document.getElementById('homeContainer').classList.remove('hidden');
    // Reset userAnswers object and numQuestionsAnswered
    userAnswers = {};
    numQuestionsAnswered = 0;
}

// Function to handle login button click
document.getElementById('loginButton').addEventListener('click', function() {
    // Get username and password from form
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Check if username and password are correct
    if (username === 'nembe_student' && password === 'ngchs2024') {
        // If correct, hide home container and show exam container
        document.getElementById('homeContainer').classList.add('hidden');
        document.getElementById('examContainer').classList.remove('hidden');
        // Display questions
        displayQuestions();
    } else {
        // If incorrect, display error message
        alert('Incorrect username or password. Please try again.');
    }
});

// Event listener for submit button
document.getElementById('submitButton').addEventListener('click', function() {
    // Increment numQuestionsAnswered
    numQuestionsAnswered++;
    // If all questions are answered, show submit button
    if (numQuestionsAnswered === 20) {
        document.getElementById('submitButton').classList.remove('hidden');
    }
    submitExam();
});

// Event listener for retake button
document.getElementById('retakeButton').addEventListener('click', retakeExam);
