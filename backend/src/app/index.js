const Utils = require(APP_ROOT + '/utils/Utils.js');

module.exports = class App {
	constructor(fallbackControllerClass) {
		this.fallbackControllerClass = fallbackControllerClass;
		this.config = AppComponents.getComponent('config');
		this.router = AppComponents.getComponent('router');
		this.greeting = AppComponents.getComponent('serverGreeting');
		this.requestBodyObj = null;
	}

	// Вывести в консоль баннер
	showBanner() {
		console.log(this.greeting.getBanner());
		return this;
	}

	// Создание объекта http.Server и его запуск
	start() {
		this.httpServer = require('http').createServer(this.listener.bind(this));
		this.httpServer
			.on('listening', () => console.log(`${this.greeting.getServerInfo()}`))
			.listen(this.config.port);
	}

	// Основная функция приложения - callback для http.Server.requestListener
	async listener(request, response) {
		const controllerClassName = (this.router.handle(request) || this.fallbackControllerClass) + 'Controller';
		let reqBody = '';
		request.on('data', (chunk) => {
			reqBody += chunk
		});
		request.on('end', () => {
			try {
				this.requestBodyObj = JSON.parse(reqBody);
			}
			catch (err) {
				this.requestBodyObj = {};
			}
			this.runController(controllerClassName, response);
			response.end();
			if (this.config.showResponsesInTerminal) {
				const now = new Date();
				console.log(`${now.toISOString()} ${request.method} ${request.url} - ${response.statusCode} (${response.statusMessage}) [${controllerClassName}]`);
			}
		});
		return;
	}

	// Создать экземляр указанного класса контроллера и запустить его.
	// Если контроллер создать не удалось, вернуть ошибку 500
	async runController(className, response) {
		try {
			const controller = AppComponents.getObject(APP_ROOT + 'controllers/' + className + '.js', this.router.requestParams);
			await controller.run(response);
		}
		catch (err) {
			response.statusCode = 500;
			response.write(JSON.stringify({ 'message': 'Server Error' }));
			console.error(err);
		}
	}

	// Генерация кинозалов
	generateHalls() {
		const hallsCount = Utils.getRandomInt(this.config.minHallsCount, this.config.maxHallsCount);
		console.log(`Кол-во кинозалов: ${hallsCount}`);
		const hallModel = AppComponents.getComponent('hallModel');
		// Очистим массив кинозалов
		hallModel.clearDB();
		for (let i = 0; i < hallsCount; i++) {
			const rows = Utils.getRandomInt(this.config.minHallRows, this.config.maxHallRows);;
			const seatsInRow = Utils.getRandomInt(this.config.minHallSeatsInRows, this.config.maxHallSeatsInRows);;
			console.log(`Кинозал № ${i + 1}: ${rows} x ${seatsInRow} (мест: ${rows * seatsInRow})`);
			const newHall = { rows, seatsInRow };
			hallModel.create(newHall);
		}
		return this;
	}

	// Генерация киносеансов
	generateShows() {
		const now = new Date();
		const scheduleDate = new Date();
		const movieModel = AppComponents.getComponent('movieModel');
		const bookingModel = AppComponents.getComponent('bookingModel');
		const cinemaShowsDateModel = AppComponents.getComponent('cinemaShowsDateModel');
		const halls = AppComponents.getComponent('hallModel').getObjects();
		const hallsCount = halls.length;
		// Очистим расписание
		cinemaShowsDateModel.clearDB();
		// Очистим бронирования
		bookingModel.clearDB();
		// Начинаем создание расписания со следующего дня после текущего
		scheduleDate.setDate(now.getDate() + 1);
		let daysLeft = this.config.showsScheduleFor;
		console.log('');
		console.log('Расписание сеансов:');
		console.log('');
		do {
			// Массив фильмов, из которых будет формироваться расписание на день
			const moviesForDate = Utils.getRandomValsFromArr(movieModel.getObjects(), this.config.moviesPerDay);
			const showsDateStartsAt = new Date(
				scheduleDate.getFullYear(),
				scheduleDate.getMonth(),
				scheduleDate.getDate(),
				this.config.cinemaOpensAt
			);
			const showsDate = {
				startsAt: showsDateStartsAt,
				date: Utils.formatDate(showsDateStartsAt),
				dateURL: Utils.formatDateURL(showsDateStartsAt),
				movies: []
			}
			const moviesSet = new Set();
			const movies = {};
			for (let i = 0; i < hallsCount; i++) {
				let startDate = scheduleDate.getDate();
				let startHour = this.config.cinemaOpensAt;
				let startMin = 0;
				let tilHour = 0;
				do {
					const movie = Utils.getRandomValFromArr(moviesForDate);
					const startsAt = new Date(
						scheduleDate.getFullYear(),
						scheduleDate.getMonth(),
						startDate,
						startHour,
						startMin
					);
					const endsAt = new Date(startsAt);
					endsAt.setMinutes(endsAt.getMinutes() + movie.duration);
					// До которого часа (с округлением вверх и переносом +24 на следующий день) будет идти текущий фильм
					tilHour = (endsAt.getDate() !== scheduleDate.getDate() ? 24 : 0) + endsAt.getHours() + (endsAt.getMinutes() ? 1 : 0);
					if (tilHour < this.config.cinemaClosesAt) {
						// Создаём новый сеанс
						if (!moviesSet.has(movie.id)) {
							moviesSet.add(movie.id);
							movies[movie.id] = movie;
							movies[movie.id].shows = [];
						}
						// Добавляем киносеанс в массив
						const showID = Utils.getRandomID();
						movies[movie.id].shows.push({
							startsAt,
							endsAt,
							startsAtTimestamp: Math.floor(startsAt.getTime() / 1000),
							hallIndex: i,
							id: showID
						});
						// Создаём объект бронирований для киносеанса с пустым массивом бронирований
						bookingModel.createEmpty(showID, halls[i]);
						// Определим время начала следующего сеанса, с учётом того, что между сеансами должен быть промежуток минимум в
						// this.config.gapBetweenShows минут и время начала сеансов (в минутах) должно быть выровнено по этому же промежутку
						startDate = endsAt.getDate();
						startHour = endsAt.getHours();
						startMin = endsAt.getMinutes() + (this.config.gapBetweenShows * 2) - ((endsAt.getMinutes() % this.config.gapBetweenShows) ? endsAt.getMinutes() % this.config.gapBetweenShows : this.config.gapBetweenShows);
					}
				} while (tilHour < this.config.cinemaClosesAt);
			}
			// Массив фильмов
			showsDate.movies = Object.values(movies);
			// Сортируем массив киносеансов по времени начала
			showsDate.movies.forEach(movie => movie.shows.sort((a, b) => a.startsAtTimestamp - b.startsAtTimestamp));
			// Создаём и сохраняем модель cinemaShowsDate
			cinemaShowsDateModel.create(showsDate);
			// Расписание фильмов на день
			console.log(`${Utils.formatDate(scheduleDate)}`);
			console.log('=======================');
			console.log('');
			showsDate.movies.forEach(movie => {
				console.log(`${movie.title} (${movie.countries.join(', ')}, ${movie.year}, ${movie.genres.join(', ')}, ${movie.duration} мин.)`);
				console.log('-----------------------');
				movie.shows.forEach(show => {
					console.log(`	${Utils.formatTime(show.startsAt)} (кинозал № ${show.hallIndex + 1})`);
				});
				console.log('');
			});
			// Следующая дата
			scheduleDate.setDate(scheduleDate.getDate() + 1);
			daysLeft--;
		} while (daysLeft > 0);
		return this;
	}
}
