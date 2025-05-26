document.addEventListener("DOMContentLoaded", () => {
    const authSection = document.getElementById("authSection");
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const payload = decodeJwtPayload(token);
            const username = payload.username;

            authSection.innerHTML = `
                <h2>Вітаємо, <span style="color: green;">${username}</span>!</h2>
                <button id="logoutBtn">Вийти</button>
            `;

            document.getElementById("logoutBtn").addEventListener("click", () => {
                localStorage.removeItem("token");
                location.reload();
            });
        } 
        catch (e) {
            console.error("Помилка декодування токена", e);
            localStorage.removeItem("token");
            renderAuthOptions();
        }
    } 
    else {
         renderAuthOptions();
    }



    function renderAuthOptions() {
        authSection.innerHTML = `
            <h2>Ви не увійшли в акаунт</h2>
            <button onclick="window.location.href = '/login'">Увійти в акаунт</button>
            <button onclick="window.location.href = '/register'">Зареєструватися</button>
        `;
    }

    function decodeJwtPayload(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return JSON.parse(decoded);
}
});
