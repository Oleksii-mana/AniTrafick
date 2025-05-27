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
    const token = localStorage.getItem('token');

    if (token) {
        fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Не авторизований');
            return res.json();
        })
        .then(user => {
            if (user.isAdmin) {
                deleteButton.style.display = 'inline-block';

                deleteButton.addEventListener("click", () => {
                    if (confirm("Ви дійсно хочете видалити це аніме?")) {
                        fetch(`/api/animes/${id}`, {
                            method: "DELETE",
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
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
        })
        .catch(() => {
            deleteButton.style.display = 'none';
        });

        const favBtn = document.createElement("button");
        favBtn.style.margin = "20px";
        document.body.appendChild(favBtn);

        fetch('/api/favourites', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(favourites => {
            const isFavourite = favourites.some(fav => fav.id == id);
            renderFavButton(isFavourite);
        })
        .catch(err => {
            console.error("Помилка перевірки улюблених:", err);
            favBtn.textContent = "Помилка";
        });

        function renderFavButton(isFavourite) {
            favBtn.textContent = isFavourite ? "Видалити з улюблених" : "Додати до улюблених";
            favBtn.onclick = null;

            if (isFavourite) {
                favBtn.onclick = () => {
                    if (confirm("Ви впевнені, що хочете видалити з улюблених?")) {
                        fetch(`/api/favourites/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                        .then(res => {
                            if (res.ok) {
                                alert("Видалено з улюблених");
                                renderFavButton(false);
                            } else {
                                alert("Не вдалося видалити.");
                            }
                        });
                    }
                };
            } else {
                favBtn.onclick = () => {
                    fetch(`/api/favourites/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ animeId: id })
                    })
                    .then(res => {
                        if (res.ok) {
                            alert("Додано до улюблених!");
                            renderFavButton(true);
                        } else {
                            alert("Не вдалося додати.");
                        }
                    });
                };
            }
        }
    } else {
        deleteButton.style.display = 'none';
    }
});
