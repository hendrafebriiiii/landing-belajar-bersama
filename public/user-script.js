// ========================
// DATA SIMULASI CAT IPS
// ========================

let answerKey = {};
let questions = {};
let answerOptions = {};
let totalQuestions = 10;

// Load questions from localStorage
function loadQuestionsFromStorage() {
    const savedQuestions = localStorage.getItem('catQuestions');
    if (savedQuestions) {
        const questionsObj = JSON.parse(savedQuestions);
        const questionsArray = Object.values(questionsObj).sort((a, b) => a.number - b.number);
        
        totalQuestions = questionsArray.length;
        answerKey = {};
        questions = {};
        answerOptions = {};
        
        questionsArray.forEach(q => {
            const key = `q${q.number}`;
            answerKey[key] = q.answer;
            questions[key] = q.text;
            answerOptions[key] = q.options;
        });
    } else {
        // Default fallback data
        answerKey = {
            q1: 'b', q2: 'c', q3: 'a', q4: 'a', q5: 'b',
            q6: 'b', q7: 'a', q8: 'a', q9: 'c', q10: 'b'
        };
        questions = {
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
        answerOptions = {
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
        totalQuestions = 10;
    }
}

// ========================
// STATE MANAGEMENT
// ========================

let currentQuestion = 1;
let userAnswers = {};
let timerInterval = null;
let timeLeft = 600; // 10 menit dalam detik
let examFinished = false;

// ========================
// INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', function() {
    loadQuestionsFromStorage();
    initializeExam();
    renderQuestions();
    initializeNavigator();
    startTimer();
    setupFormListeners();
});

function initializeExam() {
    // Initialize user answers object
    for (let i = 1; i <= totalQuestions; i++) {
        userAnswers[`q${i}`] = null;
    }
}

// ========================
// RENDER QUESTIONS
// ========================

function renderQuestions() {
    const form = document.getElementById('userForm');
    let html = '';

    for (let i = 1; i <= totalQuestions; i++) {
        const questionKey = `q${i}`;
        const isHidden = i !== currentQuestion ? 'hidden' : '';
        
        html += `
            <div class="question-container ${isHidden}" id="question-${i}" data-question="${i}">
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-bold text-gray-800">Soal ${i} dari ${totalQuestions}</h3>
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            ${i === 1 ? '▶ MULAI' : i === totalQuestions ? '🏁 AKHIR' : ''}
                        </span>
                    </div>
                    
                    <p class="text-lg text-gray-800 mb-8 font-semibold">${i}. ${questions[questionKey]}</p>
                    
                    <div class="space-y-3">
        `;

        for (let j = 0; j < 4; j++) {
            const optionKey = String.fromCharCode(97 + j); // a, b, c, d
            const optionText = answerOptions[questionKey][optionKey];
            const isChecked = userAnswers[questionKey] === optionKey ? 'checked' : '';

            html += `
                <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition option-label" data-option="${optionKey}">
                    <input type="radio" name="${questionKey}" value="${optionKey}" class="w-5 h-5 text-blue-600" ${isChecked}>
                    <span class="ml-3 text-gray-700 font-medium">${String.fromCharCode(65 + j)}. ${optionText}</span>
                </label>
            `;
        }

        html += `
                    </div>
                </div>
            </div>
        `;
    }

    form.innerHTML = html;
}

// ========================
// QUESTION NAVIGATION
// ========================

function goToNextQuestion() {
    if (currentQuestion < totalQuestions) {
        saveCurrentAnswer();
        currentQuestion++;
        renderQuestions();
        updateNavigator();
        window.scrollTo(0, 0);
    }
}

function goToPreviousQuestion() {
    if (currentQuestion > 1) {
        saveCurrentAnswer();
        currentQuestion--;
        renderQuestions();
        updateNavigator();
        window.scrollTo(0, 0);
    }
}

function goToQuestion(questionNumber) {
    saveCurrentAnswer();
    currentQuestion = questionNumber;
    renderQuestions();
    updateNavigator();
    window.scrollTo(0, 0);
}

function saveCurrentAnswer() {
    const form = document.getElementById('userForm');
    const questionKey = `q${currentQuestion}`;
    const selectedAnswer = document.querySelector(`input[name="${questionKey}"]:checked`);
    
    if (selectedAnswer) {
        userAnswers[questionKey] = selectedAnswer.value;
    }
}

// ========================
// QUESTION NAVIGATOR
// ========================

function initializeNavigator() {
    updateNavigator();
}

function updateNavigator() {
    const navigator = document.getElementById('questionNavigator');
    let html = '';

    for (let i = 1; i <= totalQuestions; i++) {
        const questionKey = `q${i}`;
        const isAnswered = userAnswers[questionKey] !== null;
        const isCurrent = i === currentQuestion;

        let buttonClass = 'w-8 h-8 rounded font-bold text-sm transition ';
        
        if (isCurrent) {
            buttonClass += 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg';
        } else if (isAnswered) {
            buttonClass += 'bg-green-500 text-white border-2 border-green-600 hover:bg-green-600';
        } else {
            buttonClass += 'bg-gray-300 text-gray-700 border-2 border-gray-400 hover:bg-gray-400';
        }

        html += `
            <button type="button" class="${buttonClass}" onclick="goToQuestion(${i})" title="${isAnswered ? 'Sudah dijawab' : 'Belum dijawab'}">
                ${i}
            </button>
        `;
    }

    navigator.innerHTML = html;
}

// ========================
// TIMER MANAGEMENT
// ========================

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!examFinished) {
                examFinished = true;
                alert('⏰ Waktu telah habis! Ujian akan dikumpulkan otomatis.');
                submitUser();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timerDisplay');
    if (timerElement) {
        timerElement.textContent = display;
        
        // Change color based on time left
        if (timeLeft <= 60) {
            timerElement.style.color = '#dc2626'; // Red
        } else if (timeLeft <= 300) {
            timerElement.style.color = '#f59e0b'; // Orange
        }
    }
}

// ========================
// FORM LISTENERS
// ========================

function setupFormListeners() {
    const form = document.getElementById('userForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveCurrentAnswer();
        
        // Validasi semua soal dijawab
        let allAnswered = true;
        for (let i = 1; i <= totalQuestions; i++) {
            if (userAnswers[`q${i}`] === null) {
                allAnswered = false;
                break;
            }
        }

        if (!allAnswered) {
            const unansweredCount = Object.values(userAnswers).filter(v => v === null).length;
            if (confirm(`⚠️ Anda belum menjawab ${unansweredCount} soal. Yakin ingin mengumpulkan sekarang?`)) {
                submitUser();
            }
            return;
        }

        submitUser();
    });

    // Listen for answer changes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            updateAnswerCount();
        }
    });
}

// ========================
// ANSWER SUBMISSION
// ========================

function submitUser() {
    clearInterval(timerInterval);
    examFinished = true;
    
    let score = 0;
    let answers = {};

    // Calculate score
    for (let i = 1; i <= totalQuestions; i++) {
        const questionKey = `q${i}`;
        const userAnswer = userAnswers[questionKey];
        answers[questionKey] = userAnswer;

        if (userAnswer === answerKey[questionKey]) {
            score++;
        }
    }

    // Display results
    displayResults(score, answers);
}

// ========================
// RESULTS DISPLAY
// ========================

function displayResults(score, answers) {
    const percentage = (score / totalQuestions) * 100;
    
    // Determine rating and emoji
    let message = '';
    let emoji = '';
    
    if (score >= 9) {
        message = 'Sempurna! Luar Biasa Sekali! 🏆';
        emoji = '🏆';
    } else if (score >= 8) {
        message = 'Sangat Bagus! Terus Pertahankan! 🌟';
        emoji = '⭐';
    } else if (score >= 7) {
        message = 'Bagus! Masih Ada Ruang Improvement 📈';
        emoji = '📈';
    } else if (score >= 6) {
        message = 'Cukup. Perbanyak Latihan! 📚';
        emoji = '📚';
    } else if (score >= 5) {
        message = 'Perlu Peningkatan. Jangan Menyerah! 💪';
        emoji = '💪';
    } else {
        message = 'Masih Jauh. Mari Belajar Lebih Giat! 🎯';
        emoji = '🎯';
    }

    // Update score card
    document.getElementById('finalScore').textContent = score;
    document.getElementById('resultMessage').textContent = message;
    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultPercentage').textContent = `${percentage.toFixed(1)}%`;
    document.getElementById('accuracyPercent').textContent = percentage.toFixed(0);
    document.getElementById('accuracyBar').style.width = percentage + '%';

    // Build answer review
    let reviewHTML = '';
    let correctTopics = [];
    let wrongTopics = [];
    
    for (let i = 1; i <= totalQuestions; i++) {
        const questionKey = `q${i}`;
        const userAnswer = answers[questionKey];
        const correctAnswer = answerKey[questionKey];
        const isCorrect = userAnswer === correctAnswer;

        const questionText = questions[questionKey];
        const userAnswerText = userAnswer ? answerOptions[questionKey][userAnswer] : '❌ Tidak dijawab';
        const correctAnswerText = answerOptions[questionKey][correctAnswer];

        const statusIcon = isCorrect ? '✓' : '✗';
        const statusClass = isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300';
        const statusColorText = isCorrect ? 'text-green-600' : 'text-red-600';

        reviewHTML += `
            <div class="border-2 ${statusClass} rounded-lg p-4">
                <div class="flex items-start gap-3 mb-3">
                    <span class="text-2xl ${statusColorText}">${statusIcon}</span>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800 mb-1">Soal ${i}</p>
                        <p class="text-gray-700">${questionText}</p>
                    </div>
                </div>
                <div class="ml-11 space-y-2 text-sm">
                    <p class="text-gray-700">
                        <strong>Jawaban Anda:</strong> <span class="${statusColorText} font-semibold">${userAnswerText}</span>
                    </p>
                    ${!isCorrect ? `<p class="text-green-600"><strong>Jawaban Benar:</strong> <span class="font-semibold">${correctAnswerText}</span></p>` : ''}
                </div>
            </div>
        `;

        if (isCorrect) {
            correctTopics.push(questionText);
        } else {
            wrongTopics.push(questionText);
        }
    }

    document.getElementById('answerReview').innerHTML = reviewHTML;

    // Generate improvement tips
    let tipsHTML = '';
    
    if (percentage === 100) {
        tipsHTML = `
            <li>🎉 Anda telah menguasai semua materi! Pertahankan performa ini.</li>
            <li>💡 Bantu teman-teman Anda yang masih belajar.</li>
            <li>🚀 Siap untuk ujian resmi!</li>
        `;
    } else if (wrongTopics.length > 0) {
        tipsHTML = `
            <li>📖 Fokus belajar topik yang masih lemah: ${wrongTopics.slice(0, 2).map(t => t.substring(0, 30) + '...').join(', ')}</li>
            <li>🔄 Lakukan latihan berulang untuk topik-topik yang salah.</li>
            <li>⏱️ Kelola waktu lebih baik saat mengerjakan soal.</li>
            <li>✏️ Baca soal dengan teliti sebelum memilih jawaban.</li>
        `;
    }

    document.getElementById('improvementTips').innerHTML = tipsHTML;

    // Save result and show modal
    saveUserResult(percentage.toFixed(2), score);
    document.getElementById('resultModal').classList.add('active');
}

// ========================
// UTILITIES
// ========================

function updateAnswerCount() {
    const answered = Object.values(userAnswers).filter(v => v !== null).length;
    document.getElementById('answeredCount').textContent = answered;
}

function closeResultModal(event) {
    if (event && event.target.id !== 'resultModal') return;
    const modal = document.getElementById('resultModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
    }, 300);
}

function resetUser() {
    closeResultModal();
    location.reload();
}

function saveUserResult(score, correctCount) {
    let registeredUsers = localStorage.getItem('registeredUsers');
    if (!registeredUsers) return;
    
    let users = JSON.parse(registeredUsers);
    
    if (users.length > 0) {
        const lastUser = users[users.length - 1];
        lastUser.userCompleted = true;
        lastUser.userScore = parseFloat(score);
        
        if (!lastUser.userAttempts) {
            lastUser.userAttempts = [];
        }
        
        lastUser.userAttempts.push({
            date: new Date().toISOString(),
            score: parseFloat(score),
            correctCount: correctCount
        });
        
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
}
