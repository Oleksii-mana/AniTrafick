document.addEventListener("DOMContentLoaded", () => {
    const animeId = window.location.pathname.split("/").pop();
    const token = localStorage.getItem('token');

    fetchAnimeDetails(animeId);
    setupDeleteButton(animeId, token);
    setupFavouriteButton(animeId, token);
    setupRatingSystem(animeId, token);
});

function fetchAnimeDetails(id) {
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
}

function setupDeleteButton(id, token) {
    const deleteButton = document.getElementById("deleteAnimeButton");

    if (!token) return;

    fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
        if (user.isAdmin) {
            deleteButton.style.display = 'inline-block';
            deleteButton.addEventListener("click", () => {
                if (confirm("Ви дійсно хочете видалити це аніме?")) {
                    fetch(`/api/animes/${id}`, {
                        method: "DELETE",
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    .then(res => {
                        if (res.ok) {
                            alert("Аніме успішно видалено!");
                            window.location.href = "/animes";
                        } else {
                            alert("Помилка при видаленні.");
                        }
                    });
                }
            });
        }
    })
    .catch(() => {
        deleteButton.style.display = 'none';
    });
}

function setupFavouriteButton(id, token) {
    if (!token) return;

    const favBtn = document.createElement("button");
    favBtn.style.margin = "20px";
    document.getElementById("favouriteButtonContainer").appendChild(favBtn);

    fetch('/api/favourites', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(favourites => {
        const isFavourite = favourites.some(fav => fav.id == id);
        renderFavButton(isFavourite, id, favBtn, token);
    })
    .catch(err => {
        console.error("Помилка перевірки улюблених:", err);
        favBtn.textContent = "Помилка";
    });
}

function renderFavButton(isFavourite, id, favBtn, token) {
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
                        renderFavButton(false, id, favBtn, token);
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
                    renderFavButton(true, id, favBtn, token);
                } else {
                    alert("Не вдалося додати.");
                }
            });
        };
    }
}

function setupRatingSystem(animeId, token) {
    const rateContainer = document.querySelector('.rate-container');
    if (!rateContainer) return;

    fetch(`/api/ratings/${animeId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    .then(res => res.json())
    .then(({ adminRating, averageUserRating, userRating, isAdmin }) => {
        renderRatingSection(rateContainer, {
            animeId,
            isAdmin,
            adminRating,
            averageUserRating,
            userRating,
            token
        });
    })
    .catch(err => console.error("Помилка завантаження оцінок:", err));
}

function renderRatingSection(container, { animeId, isAdmin, adminRating, averageUserRating, userRating, token }) {
    container.innerHTML = '';

    const adminDiv = document.createElement('div');
    const adminText = document.createElement('span');
    adminText.textContent = isAdmin ? "Ваша оцінка:" : "Оцінка адміна:";
    adminDiv.appendChild(adminText);

    const adminStars = createStarRow(10, adminRating, "#c62828", isAdmin, (score) => {
        sendRating(animeId, score, true, token);
    });
    adminDiv.appendChild(adminStars);

    const adminScore = document.createElement('span');
    adminScore.textContent = ` ${adminRating ?? '—'}`;
    adminDiv.appendChild(adminScore);

    const userDiv = document.createElement('div');
    const userText = document.createElement('span');
    userText.textContent = "Оцінка користувачів:";
    userDiv.appendChild(userText);

    const userStars = createStarRow(10, userRating, "#fdd835", true, (score) => {
        sendRating(animeId, score, false, token);
    }, averageUserRating);
    userDiv.appendChild(userStars);

    const userScore = document.createElement('span');
    userScore.textContent = ` ${averageUserRating?.toFixed(2) ?? '—'}`;
    userDiv.appendChild(userScore);

    container.appendChild(adminDiv);
    container.appendChild(userDiv);
}

function createStarRow(count, highlightScore, highlightColor, clickable, onClick, avg = null) {
    const row = document.createElement('div');

    row.classList.add('star-rating');

    for (let i = 1; i <= count; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.textContent = '★';
        star.dataset.value = i;

        if (highlightScore && i <= highlightScore) {
        
            star.style.color = highlightColor;
        }

        if (!highlightScore && avg && i <= Math.floor(avg)) {
            star.style.color = "#999";
        }

        if (clickable && onClick) {
            star.addEventListener("click", () => onClick(i));

            star.addEventListener("mouseenter", () => {
                const children = row.querySelectorAll('.star');
                children.forEach((s, index) => {
                    if (index < i) {
                      
                         s.style.color = highlightColor;
                    } else {
                      
                        s.style.color = '';
                    }
                });
            });

            star.addEventListener("mouseleave", () => {
                const children = row.querySelectorAll('.star');
                children.forEach((s, index) => {
                     s.style.color = '';
                   
                    if (highlightScore && index < highlightScore) {
                      
                        s.style.color = highlightColor;
                    }

                     if (!highlightScore && avg && index < Math.floor(avg)) {
                        s.style.color = "#999";
                    }
                });
            });
        }

        row.appendChild(star);
    }

    return row;
}

function sendRating(animeId, score, isAdmin, token) {
    fetch(`/api/ratings/${animeId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ score, isAdmin })
    })
    .then(res => {
        if (res.ok) {
            alert("Оцінку збережено!");
           setupRatingSystem(animeId, token);
        } else {
            alert("Не вдалося зберегти оцінку.");
        }
    })
    .catch(() => alert("Помилка відправки оцінки."));
}
