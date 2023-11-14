// Абсолютный путь каталога /src приложения
global.APP_ROOT = process.main ? process.main.paths[0].split('node_modules')[0] : process.mainModule.paths[0].split('node_modules')[0];

const Utils = require(APP_ROOT + 'utils/Utils.js');

// Менеджер компонентов приложения
global.AppComponents = require(APP_ROOT + 'utils/appComponents.js');

// Конфигурация приложения
AppComponents.registerComponent(
	'config',
	APP_ROOT + 'config'
);
// Модель фильма, использующая для хранения данных JSON-файл
AppComponents.registerComponent(
	'movieModel',
	APP_ROOT + 'models/MovieJSONModel.js'
);
// Приветствие сервера в консоли
AppComponents.registerComponent(
	'serverGreeting',
	APP_ROOT + 'utils/ServerGreeting.js'
);
const app = {
	'genres': [
		'комедия',
		'мультфильм',
		'триллер',
		'боевик',
		'драма',
		'фантастика',
		'фэнтези',
		'мелодрама',
		'дорама',
		'детектив',
		'эротика',
		'ужасы',
		'биография',
		'исторический'
	],

	'words1': [
		'Лошадка',
		'Травка',
		'Радуга',
		'Клоун',
		'Работа',
		'Омлет',
		'Камень',
		'Ножницы',
		'Бумага',
		'Замок',
		'Шест',
		'Зарплата',
		'Борода'
	],

	'words2': [
		'бегает',
		'курит',
		'нервно курит',
		'прыгает',
		'благоухает',
		'излучает',
		'сидит',
		'прячется',
		'выглядывает',
		'подглядывает',
		'отдыхает',
		'затаилось'
	],

	'countries': [
		'Россия',
		'США',
		'Индия',
		'Сингапур',
		'Республика Корея',
		'Китай',
		'Япония',
		'Франция',
		'Великобритания',
		'Испания',
		'Ирландия',
		'Норвегия',
		'Аргентина',
		'Италия',
		'Таиланд',
		'Австрия',
		'Германия'
	],

	start() {
		this.config = AppComponents.getComponent('config');
		this.greeting = AppComponents.getComponent('serverGreeting');
		console.log(`${this.greeting.getBanner()}
Генерация случайной базы фильмов...
`);
		return this;
	},

	async generateMoviesDB() {
		const moviesCount = this.config.randomMoviesCount;
		const movieModel = AppComponents.getComponent('movieModel');
		console.log(`Генерируем случайные фильмы: ${moviesCount}`);
		// Очищаем JSON-файл
		movieModel.clearDB();
		for (let i = 1; i <= moviesCount; i++) {
			const newMovie = {
				title: Utils.getRandomValFromArr(this.words1) + ' ' + Utils.getRandomValFromArr(this.words2),
				year: (Utils.gotTheChance(30) ? Utils.getRandomInt(1960, 2015) : 2023),
				duration: Utils.getRandomInt(this.config.randomMovieMinDuration, this.config.randomMovieMaxDuration),
				ageRating: '',
				imdbRating: (Utils.gotTheChance(50) ? Utils.getRandomInt(45, 85) / 10 : null),
				description: Utils.getRandomString(Utils.getRandomInt(50, 100), 'йцукенгшщзхъфывапролджэячсмитьбюё '),
				genres: [],
				countries: [],
				image: this.config.staticFilesURIPrefix + '/' + this.config.movieHasNoImageImg
			}
			if (Utils.gotTheChance(50)) {
				newMovie.genres = Utils.getRandomValsFromArr(this.genres, Utils.getRandomInt(2, 3));
			}
			else {
				newMovie.genres.push(Utils.getRandomValFromArr(this.genres));
			}
			if (Utils.gotTheChance(30)) {
				newMovie.countries = Utils.getRandomValsFromArr(this.countries, Utils.getRandomInt(2, 3));
			}
			else {
				newMovie.countries.push(Utils.getRandomValFromArr(this.countries));
			}
			if (newMovie.genres.includes('эротика')) {
				newMovie.ageRating = '18+';
			}
			else if (Utils.gotTheChance(50)) {
				newMovie.ageRating = Utils.getRandomValFromArr(['6+', '12+', '16+', '18+']);
			}
			console.log(`${newMovie.title} (${newMovie.countries.join(', ')}, ${newMovie.year}, ${newMovie.genres.join(', ').toLowerCase()}) - ${newMovie.duration} мин.`);
			movieModel.create(newMovie);
		}
	}
}

app.start().generateMoviesDB();
