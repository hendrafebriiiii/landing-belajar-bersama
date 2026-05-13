// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal(event) {
    if (event && event.target.id !== 'loginModal') return;
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
        document.body.style.overflow = 'auto';
    }, 300);
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal(event) {
    if (event && event.target.id !== 'registerModal') return;
    const modal = document.getElementById('registerModal');
    modal.classList.remove('active');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('closing');
        document.body.style.overflow = 'auto';
    }, 300);
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => {
        openLoginModal();
    }, 350);
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(() => {
        openRegisterModal();
    }, 350);
}

// Form Handlers
function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Admin login
    if (email === 'admin@gmail.com' && password === 'admin') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminName', 'Admin Belajar Bersama');
        console.log('Admin login successful');
        document.getElementById('loginForm').reset();
        closeLoginModal();
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 500);
        return;
    }
    
    // User login
    if (email === 'user@gmail.com' && password === 'user') {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUserEmail', email);
        console.log('User login successful');
        document.getElementById('loginForm').reset();
        closeLoginModal();
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 500);
        return;
    }
    
    // Invalid credentials
    alert('Email atau password salah!\n\nCredentials Demo:\nUser: user@gmail.com / user\nAdmin: admin@gmail.com / admin');
    console.log('Login attempt:', { email, password });
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Kata sandi tidak cocok!');
        return;
    }
    
    // Create user object
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        registeredDate: new Date().toISOString(),
        active: true,
        quizCompleted: false,
        quizScore: null,
        quizAttempts: []
    };
    
    // Save to localStorage
    let registeredUsers = localStorage.getItem('registeredUsers');
    let users = registeredUsers ? JSON.parse(registeredUsers) : [];
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    console.log('Register attempt:', { name, email, password });
    alert('Selamat! Akun Anda telah terdaftar.\n\nNama: ' + name + '\nEmail: ' + email);
    document.getElementById('registerForm').reset();
    closeRegisterModal();
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
        closeRegisterModal();
    }
});
