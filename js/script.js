// БАЗА ДАННЫХ КНИГ
const booksDatabase = [
    { id: 1, title: "1984", author: "Джордж Оруэлл", year: 1949, genre: "Антиутопия", description: "Тоталитарный режим, где Большой брат следит за каждым.", fullPlot: "Уинстон Смит живёт в Океании, пытаясь сохранить человечность. Он влюбляется в Джулию и пытается бороться с системой.", rating: 4.8, ratingsCount: 1250, userRatings: [] },
    { id: 2, title: "Мастер и Маргарита", author: "Михаил Булгаков", year: 1967, genre: "Классика", description: "Сатана со свитой в Москве 1930-х.", fullPlot: "Воланд со свитой приезжает в Москву и устраивает череду мистических событий. Мастер и Маргарита обретают покой.", rating: 4.9, ratingsCount: 1850, userRatings: [] },
    { id: 3, title: "Гарри Поттер и философский камень", author: "Дж.К. Роулинг", year: 1997, genre: "Фэнтези", description: "Мальчик-волшебник поступает в Хогвартс.", fullPlot: "Гарри Поттер живёт у жестоких родственников. В свой день рождения он узнаёт, что он волшебник и поступает в Хогвартс.", rating: 4.9, ratingsCount: 2300, userRatings: [] },
    { id: 4, title: "Дюна", author: "Фрэнк Герберт", year: 1965, genre: "Фантастика", description: "Битва за пустынную планету Арракис.", fullPlot: "Молодой Пол Атрейдес оказывается в центре борьбы за контроль над планетой Арракис, единственным источником ценной пряности.", rating: 4.7, ratingsCount: 1890, userRatings: [] },
    { id: 5, title: "Маленький принц", author: "Антуан де Сент-Экзюпери", year: 1943, genre: "Философия", description: "Притча о любви и дружбе.", fullPlot: "Лётчик терпит крушение в пустыне и встречает Маленького принца, который учит его смотреть сердцем.", rating: 4.8, ratingsCount: 2100, userRatings: [] },
    { id: 6, title: "Преступление и наказание", author: "Фёдор Достоевский", year: 1866, genre: "Классика", description: "Идейное преступление и муки совести.", fullPlot: "Бедный студент Раскольников разрабатывает теорию о разделении людей и совершает убийство старухи-процентщицы.", rating: 4.8, ratingsCount: 1560, userRatings: [] },
    { id: 7, title: "451° по Фаренгейту", author: "Рэй Брэдбери", year: 1953, genre: "Антиутопия", description: "Пожарные сжигают книги.", fullPlot: "В будущем книги запрещены, а пожарные их сжигают. Пожарный Монтэг встречает девушку, которая заставляет его усомниться.", rating: 4.7, ratingsCount: 980, userRatings: [] },
    { id: 8, title: "Убить пересмешника", author: "Харпер Ли", year: 1960, genre: "Классика", description: "Адвокат защищает чернокожего на Юге США.", fullPlot: "Глазами маленькой девочки мы видим расовую несправедливость и борьбу за справедливость её отца-адвоката.", rating: 4.8, ratingsCount: 890, userRatings: [] },
    { id: 9, title: "Сияние", author: "Стивен Кинг", year: 1977, genre: "Детектив", description: "Писатель в отеле-убийце.", fullPlot: "Джек Торренс становится смотрителем отеля 'Оверлук' на зиму. Сверхъестественные силы отеля сводят его с ума.", rating: 4.6, ratingsCount: 730, userRatings: [] }
];

let books = JSON.parse(JSON.stringify(booksDatabase));
let favorites = [];
let currentPage = "catalog";
let currentGenre = "all";
let currentSearch = "";
let currentSort = "title";

// ===== ЗАГРУЗКА/СОХРАНЕНИЕ =====
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
                    const sum = book.userRatings.reduce((a, b) => a + b, 0);
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

function updateFavoriteCount() {
    const countEl = document.getElementById("favoriteCountHeader");
    if (countEl) countEl.textContent = favorites.length;
}

function isFavorite(bookId) {
    return favorites.includes(bookId);
}

function toggleFavorite(bookId) {
    const index = favorites.indexOf(bookId);
    if (index === -1) favorites.push(bookId);
    else favorites.splice(index, 1);
    saveFavorites();
    renderCurrentPage();
}

function rateBook(bookId, rating) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        if (!book.userRatings) book.userRatings = [];
        book.userRatings.push(rating);
        const sum = book.userRatings.reduce((a, b) => a + b, 0);
        book.rating = parseFloat((sum / book.userRatings.length).toFixed(1));
        book.ratingsCount = book.userRatings.length;
        saveRatings();
        renderCurrentPage();
    }
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function renderStars(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += i < Math.floor(rating) ? "★" : "☆";
    }
    return stars;
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getFilteredBooks() {
    let filtered = [...books];
    if (currentGenre !== "all") {
        filtered = filtered.filter(b => b.genre === currentGenre);
    }
    if (currentSearch.trim()) {
        const q = currentSearch.toLowerCase();
        filtered = filtered.filter(b => 
            b.title.toLowerCase().includes(q) || 
            b.author.toLowerCase().includes(q)
        );
    }
    if (currentSort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (currentSort === "author") filtered.sort((a, b) => a.author.localeCompare(b.author));
    if (currentSort === "year") filtered.sort((a, b) => b.year - a.year);
    if (currentSort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
}

function getFavoritesBooks() {
    return books.filter(b => favorites.includes(b.id));
}

// ===== ОТРИСОВКА =====
function renderBooksGrid(containerId, booksArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (booksArray.length === 0) {
        container.innerHTML = `<div class="empty-state"><span>📚</span><p>Книг не найдено</p></div>`;
        return;
    }
    
    container.innerHTML = booksArray.map(book => `
        <div class="book-card" data-id="${book.id}">
            <div>
                <h3 class="book-card__title">${escapeHtml(book.title)}</h3>
                <p class="book-card__author">${escapeHtml(book.author)}</p>
                <div class="book-card__meta">
                    <span>📅 ${book.year}</span>
                    <span class="book-card__genre">🏷️ ${escapeHtml(book.genre)}</span>
                </div>
                <div class="book-card__rating">
                    <span class="stars">${renderStars(book.rating)}</span>
                    <span class="rating-value">${book.rating.toFixed(1)}</span>
                    <span class="rating-count">(${book.ratingsCount})</span>
                </div>
                <p class="book-card__description">${escapeHtml(book.description)}</p>
            </div>
            <div class="book-card__buttons">
                <button class="fav-btn ${isFavorite(book.id) ? 'active' : ''}" data-id="${book.id}">${isFavorite(book.id) ? '❤️ В избранном' : '🤍 В избранное'}</button>
                <button class="rate-btn" data-id="${book.id}">⭐ Оценить</button>
            </div>
        </div>
    `).join("");
    
    // Обработчики карточек
    document.querySelectorAll(".book-card").forEach(card => {
        const id = parseInt(card.dataset.id);
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("fav-btn") || e.target.classList.contains("rate-btn")) return;
            openModal(id);
        });
    });
    
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.dataset.id));
        });
    });
    
    document.querySelectorAll(".rate-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            openRatingModal(parseInt(btn.dataset.id));
        });
    });
}

function renderCurrentPage() {
    if (currentPage === "catalog") {
        document.getElementById("catalogGrid").style.display = "grid";
        document.getElementById("favoritesPage").classList.add("page-hidden");
        document.getElementById("favoritesPage").classList.remove("page-active");
        document.getElementById("aboutSection").style.display = "flex";
        
        const filtered = getFilteredBooks();
        renderBooksGrid("catalogGrid", filtered);
    } else if (currentPage === "favorites") {
        document.getElementById("catalogGrid").style.display = "none";
        document.getElementById("favoritesPage").classList.remove("page-hidden");
        document.getElementById("favoritesPage").classList.add("page-active");
        document.getElementById("aboutSection").style.display = "flex";
        
        renderBooksGrid("favoritesGrid", getFavoritesBooks());
    } else if (currentPage === "about") {
        document.getElementById("catalogGrid").style.display = "none";
        document.getElementById("favoritesPage").classList.add("page-hidden");
        document.getElementById("aboutSection").style.display = "flex";
        
        document.getElementById("aboutSection").scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function openModal(bookId) {
    const book = books.find(b => b.id === bookId);
    const modal = document.getElementById("bookModal");
    const modalContent = document.getElementById("modalContent");
    
    modalContent.innerHTML = `
        <h2 style="font-size:28px; margin-bottom:12px;">${escapeHtml(book.title)}</h2>
        <p><strong>Автор:</strong> ${escapeHtml(book.author)}</p>
        <p><strong>Год:</strong> ${book.year}</p>
        <p><strong>Жанр:</strong> ${escapeHtml(book.genre)}</p>
        <div style="background:#e9ddcd; padding:12px; border-radius:20px; margin:16px 0; text-align:center;">
            <span style="font-weight:bold; margin-right:8px;">⭐ ${book.rating.toFixed(1)} (${book.ratingsCount})</span>
            <span style="font-size:18px;">${renderStars(book.rating)}</span>
        </div>
        <p style="line-height:1.4; margin-bottom:20px;"><strong>📖 Сюжет:</strong> ${escapeHtml(book.fullPlot)}</p>
        <button id="modalRateBtn" class="modal-rate-btn">⭐ Поставить оценку</button>
    `;
    
    modal.style.display = "flex";
    
    document.getElementById("modalRateBtn")?.addEventListener("click", () => {
        modal.style.display = "none";
        openRatingModal(bookId);
    });
}

function openRatingModal(bookId) {
    const book = books.find(b => b.id === bookId);
    const modal = document.getElementById("bookModal");
    const modalContent = document.getElementById("modalContent");
    
    modalContent.innerHTML = `
        <h2>Оцените книгу</h2>
        <p><strong>${escapeHtml(book.title)}</strong> — ${escapeHtml(book.author)}</p>
        <div class="rating-options">
            ${[1, 2, 3, 4, 5].map(r => `<span class="rating-star" data-rating="${r}">${r}★</span>`).join("")}
        </div>
        <button id="closeRateBtn" style="background:#e9dbca; width:100%; padding:10px; border-radius:40px; cursor:pointer;">Закрыть</button>
    `;
    
    modal.style.display = "flex";
    
    document.querySelectorAll(".rating-star").forEach(el => {
        el.addEventListener("click", (e) => {
            rateBook(bookId, parseInt(e.target.dataset.rating));
            modal.style.display = "none";
        });
    });
    
    document.getElementById("closeRateBtn")?.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// ===== НАВИГАЦИЯ =====
function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item, .footer-nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const page = item.dataset.page;
            if (!page) return;
            currentPage = page;
            
            // Активный класс для навигации
            document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
            if (item.classList.contains("nav-item")) item.classList.add("active");
            
            renderCurrentPage();
        });
    });
}

function setupFilters() {
    document.querySelectorAll(".genre-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".genre-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentGenre = btn.dataset.genre;
            renderCurrentPage();
        });
    });
    
    document.getElementById("searchBookInput")?.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderCurrentPage();
    });
    
    document.getElementById("sortSelect")?.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderCurrentPage();
    });
}

function setupModal() {
    const modal = document.getElementById("bookModal");
    const closeBtn = document.getElementById("closeModalBtn");
    
    closeBtn?.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

function setupHero() {
    const heroBtn = document.getElementById("heroBtn");
    heroBtn?.addEventListener("click", () => {
        currentPage = "catalog";
        renderCurrentPage();
        document.querySelector(".catalog-grid").scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function closeModalOnEsc() {
    document.addEventListener("keydown", (e) => {
        const modal = document.getElementById("bookModal");
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    loadFavorites();
    loadRatings();
    setupNavigation();
    setupFilters();
    setupModal();
    setupHero();
    closeModalOnEsc();
    renderCurrentPage();
}

init();