import { API_KEY, BASE_URL, IMG_URL } from './assets/config.js';

const moviesGrid = document.querySelector('#movies-grid'); // Убедись, что ID совпадает с HTML
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const themeBtn = document.querySelector('#theme-toggle'); // переключатель цветовой темы
let currentLang = 'ru';

const i18n = {
    ru: {
        logo: "MellowMovies",
        placeholder: "Какой фильм ищем?",
        searchBtn: "Найти",
        lang: "EN"
    },
    en: {
        logo: "MellowMovies",
        placeholder: "Search for a movie...",
        searchBtn: "Search",
        lang: "RU"
    }
};

// Функция для смены текста на странице
function updateInterface() {
    document.querySelector('.logo').textContent = i18n[currentLang].logo;
    document.querySelector('#search-input').placeholder = i18n[currentLang].placeholder;
    document.querySelector('.search-form button').textContent = i18n[currentLang].searchBtn;
    document.querySelector('#lang-toggle').textContent = i18n[currentLang].lang;
}

// 1. Главная функция для работы с API
async function getMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            showMovies(data.results);
        } else {
            moviesGrid.innerHTML = '<h2 class="no-results">Ничего не найдено</h2>';
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// 2. Функция отрисовки
function showMovies(movies) {
    moviesGrid.innerHTML = ''; 

    movies.forEach(movie => {
        // Деструктуризация: вытаскиваем нужные поля из объекта фильма
        const { title, poster_path, vote_average } = movie;
        
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

        // Проверка: если у фильма нет постера, ставим заглушку
        const imageSrc = poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image';

        movieEl.innerHTML = `
            <img src="${imageSrc}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="rating">${vote_average}</span>
            </div>
        `;
        moviesGrid.appendChild(movieEl);
    });
}

// Переключатель темы
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Переключатель языка
const langBtn = document.querySelector('#lang-toggle');
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    updateInterface();
    getMovies(getApiUrl('popular')); // Перезагружаем фильмы на новом языке
    searchInput.value = ''; // Опционально: очистить поле после поиска
});

// превращает бургер в крестик принажатии
document.getElementById('burger-btn').addEventListener('click', function() {
  this.classList.toggle('active');
});

// Универсальная функция для получения нужного URL
function getApiUrl(type = 'popular', query = '') {
    const langParam = currentLang === 'ru' ? 'ru-RU' : 'en-US';
    
    if (type === 'search') {
        return `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=${langParam}`;
    }
    
    // По умолчанию возвращаем популярные
    return `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=${langParam}`;
}

// Поиск фильмов
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;

    if (searchTerm) {
        getMovies(getApiUrl('search', searchTerm));
        // searchInput.value = ''; // Опционально: очистить поле после поиска
    } else {
        // Если нажали "Найти" при пустом поле — возвращаем популярные
        getMovies(getApiUrl('popular'));
    }
});

// 3. Первоначальный запрос популярных фильмов
getMovies(getApiUrl('popular'));