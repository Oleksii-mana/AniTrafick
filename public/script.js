const cells = document.querySelectorAll("td");

cells.forEach(cell => {
    cell.classList.add("zoom-effect");

    cell.addEventListener("click", () => {
        cell.classList.add("zoomed");

        setTimeout(() => {
                    cell.classList.remove("zoomed");
                }, 250);
    });
});
