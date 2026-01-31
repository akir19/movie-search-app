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

let currentLang = 'ru';

// Функция для смены текста на странице
function updateInterface() {
    document.querySelector('.logo').textContent = i18n[currentLang].logo;
    document.querySelector('#search-input').placeholder = i18n[currentLang].placeholder;
    document.querySelector('.search-form button').textContent = i18n[currentLang].searchBtn;
    document.querySelector('#lang-toggle').textContent = i18n[currentLang].lang;
}

const themeBtn = document.querySelector('#theme-toggle');
const moviesGrid = document.querySelector('#movies-grid');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');

// 1. Тестовые данные (пока нет API)
const testMovies = [
    { title: "Интерстеллар", poster: "https://image.tmdb.org/t/p/w500/gEU2QvYvT6fd0px0o7Np3ssinternal.jpg", rating: 8.7 },
    { title: "Начало", poster: "https://image.tmdb.org/t/p/w500/edv3bs1vYvS8izYpA9vSTQ9v9vA.jpg", rating: 8.8 },
    { title: "Матрица", poster: "https://image.tmdb.org/t/p/w500/dXNAPwY7Vrq7oWsnDE0EXH088id.jpg", rating: 8.7 }
];

// 2. Функция отрисовки
function displayMovies(movies) {
    moviesGrid.innerHTML = ''; // Очищаем сетку
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        moviesGrid.appendChild(card);
    });
}

// 3. Переключатель темы
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// 4. Логика поиска (пока просто в консоль)
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Ищем:", searchInput.value);
});

// Запускаем отрисовку при загрузке
displayMovies(testMovies);