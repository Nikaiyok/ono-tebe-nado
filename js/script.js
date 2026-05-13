// БИБЛИОТЕКА КНИГ (20+ КНИГ)
const booksData = [
    { id: 1, title: "Преступление и наказание", author: "Фёдор Достоевский", year: 1866, genre: "Классика", rating: 4.8, ratingCount: 1240, description: "Роман о моральных терзаниях бедного студента Раскольникова, решившего убить старуху-процентщицу.", favorite: false },
    { id: 2, title: "1984", author: "Джордж Оруэлл", year: 1949, genre: "Антиутопия", rating: 4.9, ratingCount: 2150, description: "Тоталитарный режим, Большой Брат следит за каждым.", favorite: false },
    { id: 3, title: "Властелин Колец", author: "Дж. Р. Р. Толкин", year: 1954, genre: "Фэнтези", rating: 4.9, ratingCount: 3200, description: "Эпическое путешествие хоббита Фродо по уничтожению Кольца Всевластья.", favorite: false },
    { id: 4, title: "Гарри Поттер и философский камень", author: "Дж.К. Роулинг", year: 1997, genre: "Фэнтези", rating: 4.7, ratingCount: 4100, description: "Мальчик, который выжил, узнаёт о мире магии.", favorite: false },
    { id: 5, title: "451 градус по Фаренгейту", author: "Рэй Брэдбери", year: 1953, genre: "Антиутопия", rating: 4.6, ratingCount: 980, description: "Мир, где книги запрещены и сжигаются пожарными.", favorite: false },
    { id: 6, title: "Гордость и предубеждение", author: "Джейн Остин", year: 1813, genre: "Классика", rating: 4.8, ratingCount: 1450, description: "Романтическая история о любви и предрассудках.", favorite: false },
    { id: 7, title: "Автостопом по галактике", author: "Дуглас Адамс", year: 1979, genre: "Фантастика", rating: 4.5, ratingCount: 870, description: "Невероятные приключения Артура Дента.", favorite: false },
    { id: 8, title: "Дюна", author: "Фрэнк Герберт", year: 1965, genre: "Фантастика", rating: 4.9, ratingCount: 2100, description: "Политическая борьба за пустынную планету Арракис.", favorite: false },
    { id: 9, title: "Три товарища", author: "Эрих Мария Ремарк", year: 1936, genre: "Классика", rating: 4.7, ratingCount: 1100, description: "История дружбы и любви в послевоенной Германии.", favorite: false },
    { id: 10, title: "Мастер и Маргарита", author: "Михаил Булгаков", year: 1967, genre: "Классика", rating: 4.9, ratingCount: 1850, description: "Мистический роман о визите сатаны в Москву.", favorite: false },
    { id: 11, title: "О дивный новый мир", author: "Олдос Хаксли", year: 1932, genre: "Антиутопия", rating: 4.7, ratingCount: 1340, description: "Общество потребления и генная инженерия.", favorite: false },
    { id: 12, title: "Имя розы", author: "Умберто Эко", year: 1980, genre: "Детектив", rating: 4.6, ratingCount: 720, description: "Средневековый детектив в монастыре.", favorite: false },
    { id: 13, title: "Алхимик", author: "Пауло Коэльо", year: 1988, genre: "Философия", rating: 4.4, ratingCount: 2500, description: "Притча о поиске своего пути.", favorite: false },
    { id: 14, title: "Идиот", author: "Фёдор Достоевский", year: 1869, genre: "Классика", rating: 4.7, ratingCount: 890, description: "Трагическая история князя Мышкина.", favorite: false },
    { id: 15, title: "Тень ветра", author: "Карлос Руис Сафон", year: 2001, genre: "Детектив", rating: 4.8, ratingCount: 940, description: "Тайна забытой книги в Барселоне.", favorite: false },
    { id: 16, title: "Ночной цирк", author: "Эрин Моргенштерн", year: 2011, genre: "Фэнтези", rating: 4.5, ratingCount: 610, description: "Магическое состязание в невероятном цирке.", favorite: false },
    { id: 17, title: "Марсианин", author: "Энди Вейер", year: 2011, genre: "Фантастика", rating: 4.7, ratingCount: 1580, description: "Выживание астронавта на Марсе.", favorite: false },
    { id: 18, title: "Сто лет одиночества", author: "Габриэль Гарсиа Маркес", year: 1967, genre: "Классика", rating: 4.9, ratingCount: 1730, description: "Магический реализм и семья Буэндиа.", favorite: false },
    { id: 19, title: "Код да Винчи", author: "Дэн Браун", year: 2003, genre: "Детектив", rating: 4.3, ratingCount: 2100, description: "Триллер о тайнах христианства.", favorite: false },
    { id: 20, title: "Над пропастью во ржи", author: "Дж.Д. Сэлинджер", year: 1951, genre: "Классика", rating: 4.5, ratingCount: 980, description: "История бунтарского подростка Холдена.", favorite: false }
];

let books = [...booksData];
let favorites = JSON.parse(localStorage.getItem('bookFavorites')) || [];
let currentGenre = 'all';
let currentSearch = '';
let currentSort = 'title';

books.forEach(book => { book.favorite = favorites.includes(book.id); });

function saveFavorites() {
    favorites = books.filter(b => b.favorite).map(b => b.id);
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
    document.getElementById('favoriteCount').innerText = favorites.length;
}

function renderCatalog() {
    let filtered = books.filter(book => {
        const matchGenre = currentGenre === 'all' || book.genre === currentGenre;
        const matchSearch = book.title.toLowerCase().includes(currentSearch.toLowerCase()) || book.author.toLowerCase().includes(currentSearch.toLowerCase());
        return matchGenre && matchSearch;
    });
    
    if (currentSort === 'title') filtered.sort((a,b) => a.title.localeCompare(b.title));
    else if (currentSort === 'author') filtered.sort((a,b) => a.author.localeCompare(b.author));
    else if (currentSort === 'year') filtered.sort((a,b) => a.year - b.year);
    else if (currentSort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
    
    document.getElementById('booksCount').innerText = filtered.length;
    const grid = document.getElementById('catalogGrid');
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><span>📚</span><p>Ничего не найдено :(</p></div>`;
        return;
    }
    grid.innerHTML = filtered.map(book => `
        <div class="book-card" data-id="${book.id}">
            <div class="book-card__content">
                <div class="book-card__title">${book.title}</div>
                <div class="book-card__author">${book.author}</div>
                <div class="book-card__meta">${book.year} г. • <span class="book-card__genre">${book.genre}</span></div>
                <div class="book-card__rating">
                    <span class="stars">${'★'.repeat(Math.floor(book.rating))}${book.rating % 1 >= 0.5 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(book.rating))}</span>
                    <span class="rating-value">${book.rating}</span>
                    <span class="rating-count">(${book.ratingCount})</span>
                </div>
                <div class="book-card__description">${book.description.substring(0, 120)}${book.description.length > 120 ? '…' : ''}</div>
                <div class="book-card__buttons">
                    <button class="fav-btn ${book.favorite ? 'active' : ''}" data-id="${book.id}">${book.favorite ? '❤️ В избранном' : '🤍 В избранное'}</button>
                    <button class="rate-btn" data-id="${book.id}">⭐ Оценить</button>
                </div>
            </div>
        </div>
    `).join('');
    
    attachCardEvents();
}

function attachCardEvents() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const book = books.find(b => b.id === id);
            if (book) {
                book.favorite = !book.favorite;
                saveFavorites();
                renderCatalog();
                renderFavorites();
            }
        });
    });
    
    document.querySelectorAll('.rate-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            openRatingModal(id);
        });
    });
    
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('fav-btn') && !e.target.classList.contains('rate-btn')) {
                const id = parseInt(card.dataset.id);
                openBookModal(id);
            }
        });
    });
}

function renderFavorites() {
    const favBooks = books.filter(b => b.favorite);
    const grid = document.getElementById('favoritesGrid');
    if (favBooks.length === 0) {
        grid.innerHTML = `<div class="empty-state"><span>❤️</span><p>В избранном пока ничего нет</p></div>`;
        return;
    }
    grid.innerHTML = favBooks.map(book => `
        <div class="book-card" data-id="${book.id}">
            <div class="book-card__content">
                <div class="book-card__title">${book.title}</div>
                <div class="book-card__author">${book.author}</div>
                <div class="book-card__meta">${book.year} г. • ${book.genre}</div>
                <div class="book-card__rating"><span class="stars">${'★'.repeat(Math.floor(book.rating))}${book.rating % 1 >= 0.5 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(book.rating))}</span> ${book.rating}</div>
                <div class="book-card__description">${book.description.substring(0, 100)}…</div>
                <div class="book-card__buttons">
                    <button class="fav-btn active" data-id="${book.id}">❤️ В избранном</button>
                    <button class="rate-btn" data-id="${book.id}">⭐ Оценить</button>
                </div>
            </div>
        </div>
    `).join('');
    
    attachFavEvents();
}

function attachFavEvents() {
    document.querySelectorAll('#favoritesGrid .fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const book = books.find(b => b.id === id);
            if (book) { book.favorite = false; saveFavorites(); renderCatalog(); renderFavorites(); }
        });
    });
    document.querySelectorAll('#favoritesGrid .rate-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            openRatingModal(id);
        });
    });
    document.querySelectorAll('#favoritesGrid .book-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('fav-btn') && !e.target.classList.contains('rate-btn')) {
                const id = parseInt(card.dataset.id);
                openBookModal(id);
            }
        });
    });
}

function openBookModal(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-body">
            <h2>${book.title}</h2>
            <p><strong>Автор:</strong> ${book.author}</p>
            <p><strong>Год:</strong> ${book.year}</p>
            <p><strong>Жанр:</strong> ${book.genre}</p>
            <div class="modal-rating"><strong>Рейтинг:</strong> ${book.rating} ★ (${book.ratingCount} оценок)</div>
            <p><strong>Описание:</strong> ${book.description}</p>
            <p><small>Лот аукциона: «Книжная полка» — тот самый экземпляр, который никто не вернёт.</small></p>
        </div>
    `;
    document.getElementById('modal').style.display = 'flex';
}

function openRatingModal(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-body">
            <h3>Оцените книгу</h3>
            <p><strong>${book.title}</strong> — ${book.author}</p>
            <div class="modal-rating">
                <div>Ваша оценка:</div>
                <div id="starRatingModal">
                    ${[1,2,3,4,5].map(star => `<span class="rate-option" data-rate="${star}">${star}★</span>`).join('')}
                </div>
            </div>
            <p>Текущий рейтинг: ${book.rating} (${book.ratingCount} голосов)</p>
            <button id="closeRatingBtn" style="background:#8B5E3C; color:white; border:none; padding:8px 20px; border-radius:40px; cursor:pointer;">Закрыть</button>
        </div>
    `;
    document.getElementById('modal').style.display = 'flex';
    document.querySelectorAll('.rate-option').forEach(el => {
        el.addEventListener('click', (e) => {
            const newRatingVal = parseInt(e.target.dataset.rate);
            const newTotalRating = (book.rating * book.ratingCount + newRatingVal) / (book.ratingCount + 1);
            book.rating = parseFloat(newTotalRating.toFixed(1));
            book.ratingCount += 1;
            saveFavorites();
            renderCatalog();
            renderFavorites();
            document.getElementById('modal').style.display = 'none';
            alert(`Спасибо за оценку! Новый рейтинг: ${book.rating} ★`);
        });
    });
    document.getElementById('closeRatingBtn')?.addEventListener('click', () => { document.getElementById('modal').style.display = 'none'; });
}

// НАВИГАЦИЯ
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        const page = link.dataset.page;
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');
        if (page === 'favorites') renderFavorites();
        else renderCatalog();
    });
});

document.getElementById('goToCatalogBtn').addEventListener('click', () => {
    document.getElementById('header').classList.add('visible');
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.main-content').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    renderCatalog();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGenre = btn.dataset.genre;
        renderCatalog();
    });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderCatalog();
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
});

document.querySelector('.modal-close').addEventListener('click', () => { document.getElementById('modal').style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === document.getElementById('modal')) document.getElementById('modal').style.display = 'none'; });

window.addEventListener('load', () => {
    saveFavorites();
    renderCatalog();
});

document.querySelector('.main-content').style.display = 'none';
document.querySelector('.footer').style.display = 'none';