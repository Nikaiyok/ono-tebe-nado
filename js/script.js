const booksDatabase = [
    { id: 1, title: "1984", author: "Джордж Оруэлл", year: 1949, genre: "Антиутопия", description: "Тоталитарное общество, где Большой Брат следит за каждым шагом граждан.", fullPlot: "Уинстон Смит живёт в супергосударстве Океания, где правительство контролирует всё — мысли, действия и историю.", rating: 4.8, ratingsCount: 1250, userRatings: [] },
    { id: 2, title: "Мастер и Маргарита", author: "Михаил Булгаков", year: 1967, genre: "Классика", description: "Мастер написал роман о Понтии Пилате. Сатана со свитой посещает Москву.", fullPlot: "Воланд со свитой приезжает в Москву и устраивает череду мистических событий.", rating: 4.9, ratingsCount: 1850, userRatings: [] },
    { id: 3, title: "Гарри Поттер и философский камень", author: "Дж.К. Роулинг", year: 1997, genre: "Фэнтези", description: "Мальчик-волшебник открывает для себя мир магии.", fullPlot: "Гарри Поттер живёт у жестоких родственников. В день рождения он узнаёт, что он волшебник.", rating: 4.9, ratingsCount: 2300, userRatings: [] },
    { id: 4, title: "Дюна", author: "Фрэнк Герберт", year: 1965, genre: "Фантастика", description: "Эпическая сага о пустынной планете, пряностях и борьбе за власть.", fullPlot: "Молодой Пол Атрейдес оказывается в центре борьбы за контроль над планетой Арракис.", rating: 4.7, ratingsCount: 1890, userRatings: [] },
    { id: 5, title: "Маленький принц", author: "Антуан де Сент-Экзюпери", year: 1943, genre: "Философия", description: "Маленький принц путешествует по планетам и открывает секрет самой важной истины.", fullPlot: "Лётчик терпит крушение в пустыне и встречает Маленького принца.", rating: 4.8, ratingsCount: 2100, userRatings: [] },
    { id: 6, title: "Преступление и наказание", author: "Фёдор Достоевский", year: 1866, genre: "Классика", description: "Раскольников убивает старуху-процентщицу, проверяя свою теорию.", fullPlot: "Бедный студент Раскольников разрабатывает теорию о делении людей.", rating: 4.8, ratingsCount: 1560, userRatings: [] },
    { id: 7, title: "451 градус по Фаренгейту", author: "Рэй Брэдбери", year: 1953, genre: "Антиутопия", description: "Пожарный сжигает книги, но одна встреча меняет его жизнь.", fullPlot: "В будущем книги запрещены, а пожарные сжигают их.", rating: 4.7, ratingsCount: 980, userRatings: [] },
    { id: 8, title: "Убить пересмешника", author: "Харпер Ли", year: 1960, genre: "Классика", description: "Адвокат защищает чернокожего мужчину в американском юге.", fullPlot: "Глазами маленькой девочки мы видим расовую несправедливость.", rating: 4.8, ratingsCount: 890, userRatings: [] },
    { id: 9, title: "Сияние", author: "Стивен Кинг", year: 1977, genre: "Детектив", description: "Писатель с семьёй становится смотрителем отеля.", fullPlot: "Джек Торранс устраивается смотрителем в отель 'Оверлук'.", rating: 4.6, ratingsCount: 730, userRatings: [] }
];

let books = JSON.parse(JSON.stringify(booksDatabase));
let favorites = [];
let currentPage = "catalog";
let currentGenre = "all";
let currentSearch = "";
let currentSort = "title";

function loadFavorites() {
    const saved = localStorage.getItem("bookClubFavorites");
    if (saved) favorites = JSON.parse(saved);
    updateFavoriteCount();
}

function saveFavorites() {
    localStorage.setItem("bookClubFavorites", JSON.stringify(favorites));
    updateFavoriteCount();
}

function loadRatings() {
    const saved = localStorage.getItem("bookClubRatings");
    if (saved) {
        const ratings = JSON.parse(saved);
        books.forEach(book => {
            if (ratings[book.id]) {
                book.userRatings = ratings[book.id];
                if (book.userRatings.length > 0) {
                    const sum = book.userRatings.reduce((a,b) => a+b, 0);
                    book.rating = parseFloat((sum / book.userRatings.length).toFixed(1));
                    book.ratingsCount = book.userRatings.length;
                }
            }
        });
    }
}

function saveRatings() {
    const ratings = {};
    books.forEach(book => {
        if (book.userRatings?.length) ratings[book.id] = book.userRatings;
    });
    localStorage.setItem("bookClubRatings", JSON.stringify(ratings));
}

function toggleFavorite(bookId) {
    const index = favorites.indexOf(bookId);
    if (index === -1) favorites.push(bookId);
    else favorites.splice(index, 1);
    saveFavorites();
    renderCurrentPage();
}

function isFavorite(bookId) {
    return favorites.includes(bookId);
}

function updateFavoriteCount() {
    const countEl = document.getElementById("favoriteCount");
    if (countEl) countEl.textContent = favorites.length;
}

function rateBook(bookId, rating) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        if (!book.userRatings) book.userRatings = [];
        book.userRatings.push(rating);
        const sum = book.userRatings.reduce((a,b) => a+b, 0);
        book.rating = parseFloat((sum / book.userRatings.length).toFixed(1));
        book.ratingsCount = book.userRatings.length;
        saveRatings();
        renderCurrentPage();
    }
}

function getFilteredBooks() {
    let filtered = [...books];
    if (currentGenre !== "all") filtered = filtered.filter(b => b.genre === currentGenre);
    if (currentSearch) {
        const s = currentSearch.toLowerCase();
        filtered = filtered.filter(b => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s));
    }
    filtered.sort((a,b) => {
        if (currentSort === "title") return a.title.localeCompare(b.title);
        if (currentSort === "author") return a.author.localeCompare(b.author);
        if (currentSort === "year") return b.year - a.year;
        if (currentSort === "rating") return b.rating - a.rating;
        return 0;
    });
    return filtered;
}

function getFavoritesBooks() {
    return books.filter(b => favorites.includes(b.id));
}

function renderStars(rating) {
    const full = Math.floor(rating);
    let stars = "";
    for (let i = 0; i < 5; i++) stars += i < full ? "★" : "☆";
    return stars;
}

function renderBooksGrid(containerId, booksArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (booksArray.length === 0) {
        container.innerHTML = `<div class="empty-state"><span>📚</span><p>Книг не найдено</p></div>`;
        return;
    }
    
    container.innerHTML = booksArray.map(book => `
        <div class="book-card" data-id="${book.id}">
            <div class="book-card__image">
                <img src="./images/${book.id}.jpg" alt="${book.title}" onerror="this.src='./images/placeholder.jpg'; this.onerror=null;">
            </div>
            <div class="book-card__content">
                <h3 class="book-card__title">${book.title}</h3>
                <p class="book-card__author">${book.author}</p>
                <div class="book-card__meta"><span>📅 ${book.year}</span></div>
                <span class="book-card__genre">${book.genre}</span>
                <div class="book-card__rating">
                    <span class="stars">${renderStars(book.rating)}</span>
                    <span class="rating-value">${book.rating.toFixed(1)}</span>
                    <span class="rating-count">(${book.ratingsCount})</span>
                </div>
                <p class="book-card__description">${book.description}</p>
            </div>
            <div class="book-card__buttons">
                <button class="fav-btn ${isFavorite(book.id) ? 'active' : ''}" data-id="${book.id}">${isFavorite(book.id) ? '❤️ В избранном' : '🤍 В избранное'}</button>
                <button class="rate-btn" data-id="${book.id}">⭐ Оценить</button>
            </div>
        </div>
    `).join("");
    
    container.querySelectorAll(".book-card").forEach(card => {
        const id = parseInt(card.dataset.id);
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("fav-btn") || e.target.classList.contains("rate-btn")) return;
            openModal(id);
        });
    });
    
    container.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.dataset.id));
        });
    });
    
    container.querySelectorAll(".rate-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            openRatingModal(parseInt(btn.dataset.id));
        });
    });
}

function renderCurrentPage() {
    if (currentPage === "catalog") {
        const filtered = getFilteredBooks();
        renderBooksGrid("catalogGrid", filtered);
        const countEl = document.getElementById("booksCount");
        if (countEl) countEl.textContent = filtered.length;
    } else if (currentPage === "favorites") {
        renderBooksGrid("favoritesGrid", getFavoritesBooks());
    }
}

function openModal(bookId) {
    const book = books.find(b => b.id === bookId);
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
        <div class="modal-body">
            <h2>${book.title}</h2>
            <p><strong>Автор:</strong> ${book.author}</p>
            <p><strong>Год:</strong> ${book.year}</p>
            <p><strong>Жанр:</strong> ${book.genre}</p>
            <div class="modal-rating">
                <h3>⭐ Рейтинг: ${book.rating.toFixed(1)} (${book.ratingsCount} оценок)</h3>
                <p>${renderStars(book.rating)}</p>
            </div>
            <h3>📖 О чём книга</h3>
            <p>${book.fullPlot}</p>
            <button id="modalRateBtn" style="width:100%; margin-top:20px; background:#8B5E3C; border:none; padding:12px; border-radius:40px; color:white; font-weight:600; cursor:pointer;">⭐ Поставить оценку</button>
        </div>
    `;
    modal.style.display = "flex";
    document.getElementById("modalRateBtn")?.addEventListener("click", () => {
        modal.style.display = "none";
        openRatingModal(bookId);
    });
}

function openRatingModal(bookId) {
    const book = books.find(b => b.id === bookId);
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
        <div class="modal-body">
            <h2>Оцените книгу</h2>
            <p><strong>${book.title}</strong> — ${book.author}</p>
            <div class="modal-rating" style="text-align:center;">
                <div id="ratingOptions">
                    ${[1,2,3,4,5].map(r => `<span class="rate-option" data-rating="${r}">${r}★</span>`).join("")}
                </div>
            </div>
            <button id="closeRatingBtn" style="width:100%; margin-top:16px; background:#F0E8DC; border:1px solid #E8DCC8; padding:12px; border-radius:40px; color:#6B5B4F; cursor:pointer;">Закрыть</button>
        </div>
    `;
    modal.style.display = "flex";
    document.querySelectorAll(".rate-option").forEach(opt => {
        opt.addEventListener("click", (e) => {
            rateBook(bookId, parseInt(e.target.dataset.rating));
            modal.style.display = "none";
        });
    });
    document.getElementById("closeRatingBtn")?.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

function setupNavigation() {
    document.querySelectorAll(".nav__link").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            if (!page) return;
            currentPage = page;
            document.querySelectorAll(".nav__link").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            document.getElementById(`${page}Page`).classList.add("active");
            if (page === "catalog" || page === "favorites") renderCurrentPage();
        });
    });
}

function setupFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentGenre = btn.dataset.genre;
            renderCurrentPage();
        });
    });
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderCurrentPage();
    });
    document.getElementById("sortSelect")?.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderCurrentPage();
    });
}

function setupModal() {
    const modal = document.getElementById("modal");
    document.querySelector(".modal-close")?.addEventListener("click", () => modal.style.display = "none");
    modal?.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
}

function setupHero() {
    const heroBtn = document.getElementById("goToCatalogBtn");
    const header = document.getElementById("header");
    const catalogPage = document.getElementById("catalogPage");
    
    heroBtn?.addEventListener("click", () => {
        catalogPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        header.style.display = "flex";
        setTimeout(() => header.classList.add("visible"), 50);
    });
}

function init() {
    loadFavorites();
    loadRatings();
    setupNavigation();
    setupFilters();
    setupModal();
    setupHero();
    
    const header = document.getElementById("header");
    header.style.display = "none";
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100 && header.style.display === "none") {
            header.style.display = "flex";
            setTimeout(() => header.classList.add("visible"), 50);
        }
    });
    
    renderCurrentPage();
}

init();