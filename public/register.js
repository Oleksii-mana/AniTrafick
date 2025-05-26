document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById('password').value;

    const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert('Реєстрація успішна!');
        window.location.href = '/login';
    } else {
        alert("Помилка при реєстрації.");
    }
});
