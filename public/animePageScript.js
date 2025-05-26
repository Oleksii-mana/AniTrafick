document.addEventListener("DOMContentLoaded", () => {
    const id = window.location.pathname.split("/").pop();

    fetch(`/api/animes/${id}`)
        .then(res => res.json())
        .then(anime => {
            const container = document.getElementById("animeDetails");
            container.innerHTML = `
                <div style="background-color: #030303; border-radius: 5px;">
                <img src="data:${anime.imageType};base64,${anime.image}" alt="${anime.title}">
                <h1 style="color: white;">${anime.title}</h1>
                </div>
            `;
        })
        .catch(err => console.error("Помилка завантаження аніме:", err));


    const deleteButton = document.getElementById("deleteAnimeButton");
    if (deleteButton) {
        deleteButton.addEventListener("click", () => {
            if (confirm("Ви дійсно хочете видалити це аніме?")) {
                fetch(`/api/animes/${id}`, {
                    method: "DELETE",
                })
                .then(res => {
                    if (res.ok) {
                        alert("Аніме успішно видалено!");
                        window.location.href = "/animes";
                    } else {
                        alert("Помилка при видаленні.");
                    }
                })
                .catch(err => {
                    console.error("Помилка при видаленні аніме:", err);
                    alert("Виникла помилка.");
                });
            }
        });
    }



});
