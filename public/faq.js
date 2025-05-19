document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('FAQForm');
    const message = document.getElementById('message');
    const FAQheader = document.getElementById('FAQheader');
    const FAQh1 = document.getElementById('FAQh1');
    const FAQh2 = document.getElementById('FAQh2');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Дякуємо за ваш відгук');

        const msg = message.value;

        if (msg === "Сайт відстій") {
            alert('Сам ти відстій');
            message.value = "";
        } else if (msg === "Заголовок") {
            FAQh1.innerHTML = "Пасхалочка";
            message.value = "";
        } else if (msg === "Дискотека") {
            message.value = "";
            startDisco();
        }
    });

    function startDisco() {
        let t = 0;
        let count = 0;
        const maxCount = 20;

        const interval = setInterval(() => {
            if (t === 0) {
                FAQheader.className = "header2";
                FAQh1.className = "h11";
                FAQh2.className = "h21";
                t = 1;
            } else if (t === 1) {
                FAQheader.className = "header3";
                FAQh1.className = "h12";
                FAQh2.className = "h22";
                t = 2;
            } else {
                FAQheader.className = "header4";
                FAQh1.className = "h13";
                FAQh2.className = "h23";
                t = 0;
            }

            count++;
            if (count >= maxCount) {
                clearInterval(interval);
            }
        }, 500);
    }
});
