document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addAnimeBtn");
    const form = document.getElementById("addAnimeForm");
    const submitBtn = document.getElementById("submitAnime");
    const animeList = document.getElementById("animeList");

  /*   console.log("anime.image:", anime.image); */

    function createAnimeCard(anime) {
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <h3>${anime.title}</h3>
        `;

        animeCard.addEventListener("click", () => {
            window.location.href = `/anime/${anime.id}`;
        });

        animeList.appendChild(animeCard);
    }
    
    fetch('/api/animes')
        .then(res => res.json())
        .then(data => {
            data.forEach(anime => createAnimeCard(anime));
        })
        .catch(err => console.error('Помилка при завантаженні аніме:', err));

    addBtn.addEventListener("click", () => {
        form.style.display = form.style.display === "none" ? "block" : "none";
    });

    submitBtn.addEventListener("click", () => {
        const title = document.getElementById("animeTitle").value;
        const imageFile = document.getElementById("animeImage").files[0];
    
        if (!title || !imageFile) {
            alert("Заповніть всі поля");
            return;
        }
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', imageFile);
    
        fetch('/api/animes', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert('Аніме додано');
            location.reload();
        })
        .catch(err => console.error('Помилка:', err));
    });
});
    

   