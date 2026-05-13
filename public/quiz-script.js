// Answer Key untuk Quiz IPS
const answerKey = {
    q1: 'b',  // Jakarta
    q2: 'c',  // 34 Provinsi
    q3: 'a',  // Soekarno dan Mohammad Hatta
    q4: 'a',  // 17 Agustus 1945
    q5: 'b',  // UUD 1945
    q6: 'b',  // 5 Butir
    q7: 'a',  // Soekarno
    q8: 'a',  // Association of Southeast Asian Nations
    q9: 'c',  // 1950
    q10: 'b'  // Pemerintahan oleh rakyat
};

// Quiz Questions untuk review
const questions = {
    q1: 'Apa ibu kota Indonesia?',
    q2: 'Berapa jumlah provinsi di Indonesia?',
    q3: 'Siapa proklamator Indonesia?',
    q4: 'Tanggal berapa Indonesia memproklamasikan kemerdekaannya?',
    q5: 'Apa nama UUD yang digunakan saat ini?',
    q6: 'Berapa banyak butir dalam Pancasila?',
    q7: 'Siapa presiden Indonesia pertama?',
    q8: 'Apa singkatan ASEAN?',
    q9: 'Kapan Indonesia menjadi anggota PBB?',
    q10: 'Apa arti demokrasi?'
};

// Answer options untuk review
const answerOptions = {
    q1: { a: 'Surabaya', b: 'Jakarta', c: 'Bandung', d: 'Medan' },
    q2: { a: '32 Provinsi', b: '33 Provinsi', c: '34 Provinsi', d: '35 Provinsi' },
    q3: { a: 'Soekarno dan Mohammad Hatta', b: 'Diponegoro dan Imam Bonjol', c: 'Bung Tomo dan Sudirman', d: 'Gajah Mada dan Ken Arok' },
    q4: { a: '17 Agustus 1945', b: '1 Juni 1945', c: '18 Agustus 1945', d: '20 Mei 1945' },
    q5: { a: 'UUD 1950', b: 'UUD 1945', c: 'UUD 1959', d: 'UUD 1948' },
    q6: { a: '4 Butir', b: '5 Butir', c: '6 Butir', d: '7 Butir' },
    q7: { a: 'Soekarno', b: 'Mohammad Hatta', c: 'Suharto', d: 'B.J. Habibie' },
    q8: { a: 'Association of Southeast Asian Nations', b: 'Asian Economic Collaboration Nations', c: 'Alliance of Southeast Asian Nations', d: 'Asiatic Southeast Agreement Nations' },
    q9: { a: '1945', b: '1948', c: '1950', d: '1955' },
    q10: { a: 'Pemerintahan oleh satu orang', b: 'Pemerintahan oleh rakyat', c: 'Pemerintahan oleh militer', d: 'Pemerintahan oleh agama' }
};

// Timer function
function startTimer() {
    let timeLeft = 600; // 10 menit
    const timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Waktu habis! Quiz akan diserahkan otomatis.');
            submitQuiz();
        }

        // Berubah warna saat sisa waktu kurang dari 1 menit
        if (timeLeft <= 60) {
            document.getElementById('timer').classList.add('text-red-600');
        }
    }, 1000);
}

// Handle Quiz Submission
function submitQuiz() {
    const form = document.getElementById('quizForm');
    const formData = new FormData(form);
    
    let score = 0;
    let answers = {};

    // Hitung skor
    for (let i = 1; i <= 10; i++) {
        const questionKey = `q${i}`;
        const userAnswer = formData.get(questionKey);
        answers[questionKey] = userAnswer;

        if (userAnswer === answerKey[questionKey]) {
            score++;
        }
    }

    // Tampilkan hasil
    displayResults(score, answers);
}

// Display Quiz Results
function displayResults(score, answers) {
    const percentage = (score / 10) * 100;
    let message = '';
    let resultColor = '';

    if (score >= 8) {
        message = 'Luar Biasa! 🎉';
        resultColor = 'text-green-600';
    } else if (score >= 6) {
        message = 'Bagus! Terus Belajar 📚';
        resultColor = 'text-blue-600';
    } else if (score >= 4) {
        message = 'Cukup, Tingkatkan Lagi! 💪';
        resultColor = 'text-yellow-600';
    } else {
        message = 'Perlu Lebih Giat Belajar 😊';
        resultColor = 'text-red-600';
    }

    document.getElementById('finalScore').textContent = `${score}/10`;
    document.getElementById('resultMessage').textContent = message;
    document.getElementById('resultPercentage').textContent = `Persentase: ${percentage.toFixed(2)}%`;

    // Save quiz result to localStorage
    saveQuizResult(percentage.toFixed(2));

    // Build answer review
    let reviewHTML = '<h4 class="font-bold text-gray-800 mb-4">Ulasan Jawaban:</h4><div class="space-y-3">';
    for (let i = 1; i <= 10; i++) {
        const questionKey = `q${i}`;
        const userAnswer = answers[questionKey];
        const correctAnswer = answerKey[questionKey];
        const isCorrect = userAnswer === correctAnswer;

        const questionText = questions[questionKey];
        const userAnswerText = userAnswer ? answerOptions[questionKey][userAnswer] : 'Tidak dijawab';
        const correctAnswerText = answerOptions[questionKey][correctAnswer];

        reviewHTML += `
            <div class="p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}">
                <p class="font-semibold text-gray-800">Soal ${i}: ${questionText}</p>
                <p class="text-sm text-gray-700 mt-1">
                    Jawaban Anda: <span class="${isCorrect ? 'text-green-600' : 'text-red-600'} font-semibold">${userAnswerText}</span>
                </p>
                ${!isCorrect ? `<p class="text-sm text-green-600 mt-1">Jawaban Benar: <span class="font-semibold">${correctAnswerText}</span></p>` : ''}
            </div>
        `;
    }
    reviewHTML += '</div>';

    document.getElementById('answerReview').innerHTML = reviewHTML;
    document.getElementById('resultModal').classList.add('active');
}

// Close Result Modal
function closeResultModal(event) {
    if (event && event.target.id !== 'resultModal') return;
    const modal = document.getElementById('resultModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
    }, 300);
}

// Reset Quiz
function resetQuiz() {
    closeResultModal();
    document.getElementById('quizForm').reset();
    location.reload();
}

// Save Quiz Result to localStorage
function saveQuizResult(score) {
    let registeredUsers = localStorage.getItem('registeredUsers');
    if (!registeredUsers) return;
    
    let users = JSON.parse(registeredUsers);
    
    // For demo purposes, update the last user's quiz score
    // In a real app, you would identify the current user
    if (users.length > 0) {
        const lastUser = users[users.length - 1];
        lastUser.quizCompleted = true;
        lastUser.quizScore = parseFloat(score);
        
        if (!lastUser.quizAttempts) {
            lastUser.quizAttempts = [];
        }
        
        lastUser.quizAttempts.push({
            date: new Date().toISOString(),
            score: parseFloat(score)
        });
        
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
}

// Form submission
document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Check if all questions are answered
    let allAnswered = true;
    for (let i = 1; i <= 10; i++) {
        const questionKey = `q${i}`;
        const userAnswer = document.querySelector(`input[name="${questionKey}"]:checked`);
        if (!userAnswer) {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        alert('Harap jawab semua pertanyaan sebelum submit!');
        return;
    }

    submitQuiz();
});

// Start timer ketika halaman dimuat
window.addEventListener('load', function() {
    startTimer();
});
