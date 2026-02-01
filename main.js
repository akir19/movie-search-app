import { API_KEY, BASE_URL, IMG_URL } from './assets/config.js';

const moviesGrid = document.querySelector('#movies-grid');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const themeBtn = document.querySelector('#theme-toggle');
const langBtn = document.querySelector('#lang-toggle');
const burgerBtn = document.querySelector('#burger-btn');
const sideMenu = document.querySelector('#side-menu');
const genreBtns = document.querySelectorAll('.genre-btn');
const overlay = document.querySelector('#overlay');
const aboutBtn = document.querySelector('#about-btn');
const modal = document.querySelector('#movie-modal');
const modalDetails = document.querySelector('#modal-details');
const closeModal = document.querySelector('#close-modal');

let currentLang = 'ru';
let currentPage = 1;
let currentSearchTerm = '';
let currentGenre = '';

const i18n = {
    ru: {
        about: "О программе...",
        aboutAlert: "MellowMovies v1.0\nТвой гид по кино!",
        logo: "MellowMovies",
        placeholder: "Какой фильм ищем?",
        searchBtn: "Найти",
        lang: "EN",
        genres: ["Боевики", "Комедии", "Драмы", "Ужасы", "Все жанры"],
        
        rating: "Рейтинг",
        release: "Дата выхода",
        runtime: "Длительность",
        minutes: "мин.",

        aboutTitle: "О проекте",
        aboutText: "MellowMovies — это учебный проект, созданный с использованием TMDB API. Здесь можно искать фильмы, фильтровать их по жанрам и наслаждаться темной темой.",
        credits: "Разработано с ❤️ для портфолио",
        close: "Закрыть"
    },
    en: {
        about: "About app...",
        aboutAlert: "MellowMovies v1.0\nYour movie guide!",
        logo: "MellowMovies",
        placeholder: "Search for a movie...",
        searchBtn: "Search",
        lang: "RU",
        genres: ["Action", "Comedy", "Drama", "Horror", "All Genres"],
        
        rating: "Rating",
        release: "Release date",
        runtime: "Runtime",
        minutes: "min.",

        aboutTitle: "About Project",
        aboutText: "MellowMovies is a coding project built with TMDB API. You can search movies, filter by genres, and enjoy the dark mode experience.",
        credits: "Built with ❤️ for portfolio",
        close: "Close"
    }
};

function updateInterface() {
    document.querySelector('.logo').textContent = i18n[currentLang].logo;
    searchInput.placeholder = i18n[currentLang].placeholder;
    document.querySelector('.search-form button').textContent = i18n[currentLang].searchBtn;
    langBtn.textContent = i18n[currentLang].lang;
    aboutBtn.textContent = i18n[currentLang].about;

    genreBtns.forEach((btn, index) => {
        btn.textContent = i18n[currentLang].genres[index];
    });
}

function toggleMenu() {
    if (!sideMenu || !burgerBtn || !overlay) return;
    sideMenu.classList.toggle('open');
    burgerBtn.classList.toggle('active');
    overlay.classList.toggle('active');
}

async function getMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        showMovies(data.results);
        
        document.querySelector('#current-page-num').textContent = currentPage;
        document.querySelector('#total-pages-num').textContent = data.total_pages;
        document.querySelector('#prev-page').disabled = currentPage <= 1;
        document.querySelector('#next-page').disabled = currentPage >= data.total_pages;
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

async function getMovieDetails(id) {
    const langParam = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${langParam}`;
    
    try {
        const response = await fetch(url);
        const movie = await response.json();
        openModal(movie);
    } catch (error) {
        console.error("Ошибка при получении деталей:", error);
    }
}

function openModal(movie) {
    const { title, poster_path, overview, vote_average, release_date, tagline, runtime } = movie;
    const imageSrc = poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image';
    
    // Берем переводы из текущего языка
    const t = i18n[currentLang];

    modalDetails.innerHTML = `
        <img src="${imageSrc}" class="modal-poster" alt="${title}">
        <div class="modal-info">
            <h2>${title}</h2>
            ${tagline ? `<span class="tagline">"${tagline}"</span>` : ''}
            <p><strong>${t.rating}:</strong> ⭐ ${vote_average.toFixed(1)}</p>
            <p><strong>${t.release}:</strong> ${release_date}</p>
            <p><strong>${t.runtime}:</strong> ${runtime} ${t.minutes}</p>
            <p>${overview || "No description available."}</p>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Запрещаем скролл страницы под модалкой
}

function showMovies(movies) {
    moviesGrid.innerHTML = ''; 
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<h2 style="grid-column: 1/-1; text-align: center;">Ничего не найдено</h2>';
        return;
    }
    movies.forEach(movie => {
        const { title, poster_path, vote_average } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');
        const imageSrc = poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image';
        movieEl.innerHTML = `
            <img src="${imageSrc}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span style="padding: 10px; color: var(--accent-color)">⭐ ${vote_average}</span>
            </div>
        `;
        moviesGrid.appendChild(movieEl);
        movieEl.addEventListener('click', () => getMovieDetails(movie.id));
    });
}

function getApiUrl(type = 'popular', query = '') {
    const langParam = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    let base = '';
    if (type === 'search') {
        base = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
    } else if (currentGenre) {
        base = `${BASE_URL}/discover/movie?with_genres=${currentGenre}&sort_by=popularity.desc`;
    } else {
        base = `${BASE_URL}/discover/movie?sort_by=popularity.desc`;
    }
    return `${base}&api_key=${API_KEY}&language=${langParam}&page=${currentPage}`;
}

function showAbout() {
    const t = i18n[currentLang];
    
    modalDetails.innerHTML = `
        <div class="about-content" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
            <h2 style="color: var(--accent-color); font-size: 2.5rem; margin-bottom: 10px;">MellowMovies</h2>
            <p style="font-size: 1.1rem; line-height: 1.6;">${t.aboutText}</p>
            <hr class="menu-divider" style="margin: 20px 0;">
            <p style="opacity: 0.8;">${t.credits}</p>
            <button class="btn-page" id="modal-close-btn" style="margin-top: 20px; padding: 10px 30px;">${t.close}</button>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Вешаем событие на новую кнопку закрытия внутри контента
    document.querySelector('#modal-close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Слушатели событий
burgerBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

aboutBtn.addEventListener('click', () => {
    toggleMenu(); // Сначала закрываем боковое меню
    showAbout();  // Потом открываем модалку с инфой
});

genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentGenre = btn.dataset.id;
        currentSearchTerm = '';
        currentPage = 1;
        getMovies(getApiUrl());
        toggleMenu();
    });
});

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
});

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    currentPage = 1;
    updateInterface();
    getMovies(getApiUrl(currentSearchTerm ? 'search' : 'popular', currentSearchTerm));
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearchTerm = searchInput.value.trim();
    currentGenre = ''; // Сброс жанра при поиске
    currentPage = 1;
    getMovies(getApiUrl('search', currentSearchTerm));
});

document.querySelector('#next-page').addEventListener('click', () => {
    currentPage++;
    getMovies(getApiUrl(currentSearchTerm ? 'search' : 'popular', currentSearchTerm));
    window.scrollTo(0, 0); 
});

document.querySelector('#prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getMovies(getApiUrl(currentSearchTerm ? 'search' : 'popular', currentSearchTerm));
        window.scrollTo(0, 0);
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем скролл
});

// Закрытие по клику вне окна
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Запуск
updateInterface();
getMovies(getApiUrl());