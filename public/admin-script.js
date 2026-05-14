// Admin Dashboard Script

let allUsers = [];
let filteredUsers = [];
let userToDelete = null;

// Questions Management
let allQuestions = [];
let questionToDelete = null;
let editingQuestionId = null;

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadQuestions();
    updateDashboardStats();
    setupSearchFilter();
    checkAdminLogin();
    initializeDefaultQuestions();
});

// Check if admin is logged in (simple verification)
function checkAdminLogin() {
    const adminStatus = localStorage.getItem('adminLoggedIn');
    if (!adminStatus) {
        // Auto-set admin as logged in for demo purposes
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminName', 'Admin Belajar Bersama');
    }
    
    const adminName = localStorage.getItem('adminName') || 'Admin';
    document.getElementById('adminName').textContent = adminName;
}

// Load users from localStorage
function loadUsers() {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
        allUsers = JSON.parse(savedUsers);
    } else {
        allUsers = [];
    }
    
    filteredUsers = [...allUsers];
    renderUserTable();
}

// Render users in table
function renderUserTable() {
    const tbody = document.getElementById('userTableBody');
    const emptyState = document.getElementById('emptyState');
    
    tbody.innerHTML = '';
    
    if (filteredUsers.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }
    
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        const registrationDate = new Date(user.registeredDate).toLocaleDateString('id-ID');
        const statusBadge = user.active ? 
            '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Aktif</span>' :
            '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Tidak Aktif</span>';
        
        const userBadge = user.userCompleted ?
            '<span class="text-green-600 font-semibold">✓ Selesai</span>' :
            '<span class="text-gray-400">Belum</span>';
        
        const scoreDisplay = user.userScore ? `${user.userScore}%` : '-';
        
        row.innerHTML = `
            <td class="px-6 py-4 text-gray-800">${index + 1}</td>
            <td class="px-6 py-4 font-semibold text-gray-800">${user.name}</td>
            <td class="px-6 py-4 text-gray-600">${user.email}</td>
            <td class="px-6 py-4 text-gray-600">${registrationDate}</td>
            <td class="px-6 py-4">${statusBadge}</td>
            <td class="px-6 py-4">${userBadge}</td>
            <td class="px-6 py-4 font-semibold text-blue-600">${scoreDisplay}</td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button onclick="viewUserDetail('${user.id}')" class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">
                        Lihat
                    </button>
                    <button onclick="deleteUser('${user.id}')" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">
                        Hapus
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// View User Detail
function viewUserDetail(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const registrationDate = new Date(user.registeredDate).toLocaleDateString('id-ID');
    const userAttempts = user.userAttempts ? user.userAttempts.length : 0;
    
    let detailHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
                <h4 class="font-semibold text-gray-600 mb-2">Nama Lengkap</h4>
                <p class="text-lg text-gray-800">${user.name}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-600 mb-2">Email</h4>
                <p class="text-gray-800">${user.email}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-600 mb-2">Status</h4>
                <p class="text-gray-800">${user.active ? 'Aktif' : 'Tidak Aktif'}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-600 mb-2">Tanggal Daftar</h4>
                <p class="text-gray-800">${registrationDate}</p>
            </div>
            <div>
                <h4 class="font-semibold text-gray-600 mb-2">User Diselesaikan</h4>
                <p class="text-lg font-bold text-blue-600">${user.userCompleted ? 'Ya ✓' : 'Belum'}</p>
            </div>
    `;
    
    if (user.userCompleted && user.userScore) {
        detailHTML += `
            <div>
                <h4 class="font-semibold text-gray-600 mb-2">Skor User</h4>
                <p class="text-lg font-bold text-green-600">${user.userScore}%</p>
            </div>
        `;
    }
    
    detailHTML += `
            <div class="col-span-2">
                <h4 class="font-semibold text-gray-600 mb-2">Percobaan User</h4>
                <p class="text-gray-800">${userAttempts} kali</p>
            </div>
        </div>
    `;
    
    if (user.userAttempts && user.userAttempts.length > 0) {
        detailHTML += `
            <div class="mt-6 pt-6 border-t border-gray-300">
                <h4 class="font-semibold text-gray-800 mb-4">Riwayat Percobaan User</h4>
                <div class="space-y-3">
        `;
        
        user.userAttempts.forEach((attempt, index) => {
            const attemptDate = new Date(attempt.date).toLocaleDateString('id-ID');
            detailHTML += `
                <div class="bg-gray-100 p-3 rounded-lg">
                    <p class="font-semibold text-gray-800">Percobaan ${index + 1}</p>
                    <p class="text-sm text-gray-600">Tanggal: ${attemptDate}</p>
                    <p class="text-sm text-gray-600">Skor: <span class="font-bold text-blue-600">${attempt.score}%</span></p>
                </div>
            `;
        });
        
        detailHTML += `
                </div>
            </div>
        `;
    }
    
    document.getElementById('userDetailContent').innerHTML = detailHTML;
    document.getElementById('userDetailModal').classList.add('active');
}

// Close User Detail Modal
function closeUserDetailModal(event) {
    if (event && event.target.id !== 'userDetailModal') return;
    const modal = document.getElementById('userDetailModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
    }, 300);
}

// Delete User
function deleteUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    userToDelete = userId;
    document.getElementById('deleteUserName').textContent = user.name;
    document.getElementById('deleteModal').classList.add('active');
}

// Confirm Delete
function confirmDelete() {
    if (!userToDelete) return;
    
    allUsers = allUsers.filter(u => u.id !== userToDelete);
    filteredUsers = allUsers;
    localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
    
    closeDeleteModal();
    renderUserTable();
    updateDashboardStats();
}

// Close Delete Modal
function closeDeleteModal(event) {
    if (event && event.target.id !== 'deleteModal') return;
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
    }, 300);
    userToDelete = null;
}

// Setup Search Filter
function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        renderUserTable();
    });
}

// Update Dashboard Statistics
function updateDashboardStats() {
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.active).length;
    const quizCompleted = allUsers.filter(u => u.userCompleted).length;
    
    let totalScore = 0;
    let scoreCount = 0;
    allUsers.forEach(user => {
        if (user.userScore) {
            totalScore += user.userScore;
            scoreCount++;
        }
    });
    
    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('userCompleted').textContent = quizCompleted;
    document.getElementById('averageScore').textContent = averageScore + '%';
}

// Export Data to CSV
function exportData() {
    if (allUsers.length === 0) {
        alert('Tidak ada data user untuk di-export');
        return;
    }
    
    let csv = 'No,Nama,Email,Tanggal Daftar,Status,User Selesai,Skor\n';
    
    allUsers.forEach((user, index) => {
        const registrationDate = new Date(user.registeredDate).toLocaleDateString('id-ID');
        const status = user.active ? 'Aktif' : 'Tidak Aktif';
        const quizStatus = user.userCompleted ? 'Ya' : 'Tidak';
        const score = user.userScore || '-';
        
        csv += `${index + 1},"${user.name}","${user.email}","${registrationDate}","${status}","${quizStatus}","${score}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'data-users-' + new Date().toLocaleDateString() + '.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add Sample Data for Testing
function addSampleData() {
    const sampleUsers = [
        {
            id: 'user_' + Date.now() + '_1',
            name: 'Budi Santoso',
            email: 'budi.santoso@email.com',
            registeredDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            userCompleted: true,
            userScore: 85,
            userAttempts: [
                { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 75 },
                { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 85 }
            ]
        },
        {
            id: 'user_' + Date.now() + '_2',
            name: 'Siti Nurhaliza',
            email: 'siti.nurhaliza@email.com',
            registeredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            userCompleted: true,
            userScore: 92,
            userAttempts: [
                { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 92 }
            ]
        },
        {
            id: 'user_' + Date.now() + '_3',
            name: 'Ahmad Wijaya',
            email: 'ahmad.wijaya@email.com',
            registeredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            userCompleted: false,
            userScore: null,
            userAttempts: []
        },
        {
            id: 'user_' + Date.now() + '_4',
            name: 'Rina Dewi',
            email: 'rina.dewi@email.com',
            registeredDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            userCompleted: true,
            userScore: 78,
            userAttempts: [
                { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 78 }
            ]
        },
        {
            id: 'user_' + Date.now() + '_5',
            name: 'Joko Pratama',
            email: 'joko.pratama@email.com',
            registeredDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            userCompleted: true,
            userScore: 88,
            userAttempts: [
                { date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), score: 88 }
            ]
        }
    ];
    
    allUsers = [...allUsers, ...sampleUsers];
    filteredUsers = [...allUsers];
    localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
    
    renderUserTable();
    updateDashboardStats();
    alert('✓ 5 data sample berhasil ditambahkan!');
}

// ========================
// QUESTIONS MANAGEMENT
// ========================

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'border-b-4', 'border-blue-600');
        btn.classList.add('text-gray-700');
    });
    
    // Set active button based on tabName
    const activeBtn = Array.from(buttons).find(btn => 
        (tabName === 'users' && btn.textContent.includes('Manajemen User')) ||
        (tabName === 'questions' && btn.textContent.includes('Manajemen Soal'))
    );
    
    if (activeBtn) {
        activeBtn.classList.add('active', 'border-b-4', 'border-blue-600');
        activeBtn.classList.remove('text-gray-700');
    }

    // Hide/Show sections
    const statsSection = document.getElementById('statsSection');
    const usersSection = document.getElementById('usersSection');
    const questionsSection = document.getElementById('questionsSection');
    
    if (tabName === 'users') {
        statsSection.style.display = 'grid';
        usersSection.style.display = 'block';
        questionsSection.style.display = 'none';
        questionsSection.classList.add('hidden');
    } else {
        statsSection.style.display = 'none';
        usersSection.style.display = 'none';
        questionsSection.style.display = 'block';
        questionsSection.classList.remove('hidden');
    }
}

// Initialize default questions if localStorage is empty
function initializeDefaultQuestions() {
    const savedQuestions = localStorage.getItem('catQuestions');
    if (!savedQuestions) {
        const defaultQuestions = {
            q1: {
                id: 'q1',
                number: 1,
                text: 'Apa ibu kota Indonesia?',
                options: { a: 'Surabaya', b: 'Jakarta', c: 'Bandung', d: 'Medan' },
                answer: 'b'
            },
            q2: {
                id: 'q2',
                number: 2,
                text: 'Berapa jumlah provinsi di Indonesia?',
                options: { a: '32 Provinsi', b: '33 Provinsi', c: '34 Provinsi', d: '35 Provinsi' },
                answer: 'c'
            },
            q3: {
                id: 'q3',
                number: 3,
                text: 'Siapa proklamator Indonesia?',
                options: { a: 'Soekarno dan Mohammad Hatta', b: 'Diponegoro dan Imam Bonjol', c: 'Bung Tomo dan Sudirman', d: 'Gajah Mada dan Ken Arok' },
                answer: 'a'
            },
            q4: {
                id: 'q4',
                number: 4,
                text: 'Tanggal berapa Indonesia memproklamasikan kemerdekaannya?',
                options: { a: '17 Agustus 1945', b: '1 Juni 1945', c: '18 Agustus 1945', d: '20 Mei 1945' },
                answer: 'a'
            },
            q5: {
                id: 'q5',
                number: 5,
                text: 'Apa nama UUD yang digunakan saat ini?',
                options: { a: 'UUD 1950', b: 'UUD 1945', c: 'UUD 1959', d: 'UUD 1948' },
                answer: 'b'
            },
            q6: {
                id: 'q6',
                number: 6,
                text: 'Berapa banyak butir dalam Pancasila?',
                options: { a: '4 Butir', b: '5 Butir', c: '6 Butir', d: '7 Butir' },
                answer: 'b'
            },
            q7: {
                id: 'q7',
                number: 7,
                text: 'Siapa presiden Indonesia pertama?',
                options: { a: 'Soekarno', b: 'Mohammad Hatta', c: 'Suharto', d: 'B.J. Habibie' },
                answer: 'a'
            },
            q8: {
                id: 'q8',
                number: 8,
                text: 'Apa singkatan ASEAN?',
                options: { a: 'Association of Southeast Asian Nations', b: 'Asian Economic Collaboration Nations', c: 'Alliance of Southeast Asian Nations', d: 'Asiatic Southeast Agreement Nations' },
                answer: 'a'
            },
            q9: {
                id: 'q9',
                number: 9,
                text: 'Kapan Indonesia menjadi anggota PBB?',
                options: { a: '1945', b: '1948', c: '1950', d: '1955' },
                answer: 'c'
            },
            q10: {
                id: 'q10',
                number: 10,
                text: 'Apa arti demokrasi?',
                options: { a: 'Pemerintahan oleh satu orang', b: 'Pemerintahan oleh rakyat', c: 'Pemerintahan oleh militer', d: 'Pemerintahan oleh agama' },
                answer: 'b'
            }
        };
        localStorage.setItem('catQuestions', JSON.stringify(defaultQuestions));
    }
}

// Load questions from localStorage
function loadQuestions() {
    const savedQuestions = localStorage.getItem('catQuestions');
    if (savedQuestions) {
        const questionsObj = JSON.parse(savedQuestions);
        allQuestions = Object.values(questionsObj).sort((a, b) => a.number - b.number);
    } else {
        allQuestions = [];
    }
    renderQuestionsTable();
}

// Render questions table
function renderQuestionsTable() {
    const tbody = document.getElementById('questionsTableBody');
    const emptyState = document.getElementById('emptyQuestionsState');
    const totalQuestionsSpan = document.getElementById('totalQuestions');

    tbody.innerHTML = '';

    if (allQuestions.length === 0) {
        emptyState.style.display = 'block';
        totalQuestionsSpan.textContent = 'Total: 0';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    totalQuestionsSpan.textContent = `Total: ${allQuestions.length}`;

    allQuestions.forEach((question, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition';
        
        const shortQuestion = question.text.substring(0, 50) + (question.text.length > 50 ? '...' : '');
        const answerLabel = question.answer.toUpperCase();
        
        row.innerHTML = `
            <td class="px-4 py-3 font-semibold text-gray-800">${question.number}</td>
            <td class="px-4 py-3 text-gray-700">${shortQuestion}</td>
            <td class="px-4 py-3 text-center font-bold text-blue-600">${answerLabel}</td>
            <td class="px-4 py-3 text-center">
                <div class="flex gap-2 justify-center">
                    <button onclick="editQuestion('${question.id}')" class="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition">
                        ✏️ Edit
                    </button>
                    <button onclick="deleteQuestion('${question.id}')" class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">
                        🗑️ Hapus
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Save Question (Create or Update)
function saveQuestion(event) {
    event.preventDefault();

    const questionId = document.getElementById('questionId').value;
    const number = parseInt(document.getElementById('questionNumber').value);
    const text = document.getElementById('questionText').value;
    const optionA = document.getElementById('optionA').value;
    const optionB = document.getElementById('optionB').value;
    const optionC = document.getElementById('optionC').value;
    const optionD = document.getElementById('optionD').value;
    const correctAnswer = document.getElementById('correctAnswer').value;

    // Validate
    if (!text || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
        alert('Semua field harus diisi!');
        return;
    }

    // Load questions from localStorage
    const savedQuestions = localStorage.getItem('catQuestions');
    let questionsObj = savedQuestions ? JSON.parse(savedQuestions) : {};

    if (questionId) {
        // Update existing question
        const key = Object.keys(questionsObj).find(k => questionsObj[k].id === questionId);
        if (key) {
            questionsObj[key] = {
                id: questionId,
                number: number,
                text: text,
                options: { a: optionA, b: optionB, c: optionC, d: optionD },
                answer: correctAnswer
            };
        }
    } else {
        // Create new question
        const newId = 'q' + (Object.keys(questionsObj).length + 1);
        questionsObj[newId] = {
            id: newId,
            number: number,
            text: text,
            options: { a: optionA, b: optionB, c: optionC, d: optionD },
            answer: correctAnswer
        };
    }

    // Save to localStorage
    localStorage.setItem('catQuestions', JSON.stringify(questionsObj));
    
    // Refresh table
    loadQuestions();
    resetQuestionForm();
    alert(questionId ? '✓ Soal berhasil diperbarui!' : '✓ Soal baru berhasil ditambahkan!');
}

// Edit Question
function editQuestion(questionId) {
    const question = allQuestions.find(q => q.id === questionId);
    if (!question) return;

    editingQuestionId = questionId;
    document.getElementById('questionId').value = question.id;
    document.getElementById('questionNumber').value = question.number;
    document.getElementById('questionText').value = question.text;
    document.getElementById('optionA').value = question.options.a;
    document.getElementById('optionB').value = question.options.b;
    document.getElementById('optionC').value = question.options.c;
    document.getElementById('optionD').value = question.options.d;
    document.getElementById('correctAnswer').value = question.answer;

    document.getElementById('formTitle').textContent = `✏️ Edit Soal ${question.number}`;
    
    // Scroll to form
    document.querySelector('#questionsSection form').scrollIntoView({ behavior: 'smooth' });
}

// Delete Question
function deleteQuestion(questionId) {
    const question = allQuestions.find(q => q.id === questionId);
    if (!question) return;

    questionToDelete = questionId;
    document.getElementById('deleteQuestionName').textContent = `Soal ${question.number}: ${question.text.substring(0, 40)}...`;
    document.getElementById('deleteQuestionModal').classList.add('active');
}

// Confirm Delete Question
function confirmDeleteQuestion() {
    if (!questionToDelete) return;

    // Load questions from localStorage
    const savedQuestions = localStorage.getItem('catQuestions');
    let questionsObj = savedQuestions ? JSON.parse(savedQuestions) : {};

    // Find and delete the question
    const key = Object.keys(questionsObj).find(k => questionsObj[k].id === questionToDelete);
    if (key) {
        delete questionsObj[key];
        localStorage.setItem('catQuestions', JSON.stringify(questionsObj));
    }

    closeDeleteQuestionModal();
    loadQuestions();
    alert('✓ Soal berhasil dihapus!');
}

// Close Delete Question Modal
function closeDeleteQuestionModal(event) {
    if (event && event.target.id !== 'deleteQuestionModal') return;
    const modal = document.getElementById('deleteQuestionModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
    }, 300);
    questionToDelete = null;
}

// Reset Question Form
function resetQuestionForm() {
    document.getElementById('questionForm').reset();
    document.getElementById('questionId').value = '';
    document.getElementById('formTitle').textContent = '➕ Tambah Soal Baru';
    editingQuestionId = null;
}
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminName');
        window.location.href = 'index.html';
    }
}

// Escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeUserDetailModal();
        closeDeleteModal();
        closeDeleteQuestionModal();
    }
});
