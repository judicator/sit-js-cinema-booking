module.exports = class ServerGreeting
{
	constructor() {
		this.config = AppComponents.getComponent('config');
		this.banner = '';
		const fs = require('fs');
		if (fs.existsSync(APP_ROOT + 'banner.txt')) {
			this.banner = fs.readFileSync(APP_ROOT + 'banner.txt', { encoding: 'utf8' });
		}
	}

	getBanner() {
		return this.banner;
	}

	getServerInfo() {
		return `
Сервер запущен. Вы можете обращаться к нему по адресу http://localhost:${this.config.port}.
Нажмите CTRL+C, чтобы остановить сервер.
Доступные методы:
GET ${this.config.apiURIPrefix} - получить расписание киносеансов
GET ${this.config.apiURIPrefix}/{date} - получить расписание киносеансов на дату {date} (дата должна быть в формате ГГГГ-ММ-ДД)
GET ${this.config.apiURIPrefix}/movie/{id} - получить информацию о фильме с ID = {id}
GET ${this.config.apiURIPrefix}/show/{id} - получить информацию о киносеансе с ID = {id} (включая информацию о размере зала и бронированиях)
GET ${this.config.apiURIPrefix}/halls - получить информацию о всех кинозалах (кол-во рядов и кол-во мест в каждом ряду)
GET ${this.config.apiURIPrefix}/genres - получить отсортированный по алфавиту список жанров фильмов из БД кинотеатра (всех фильмов, не только тех, что присутствуют в расписании)
POST ${this.config.apiURIPrefix}/booking/{id} - создать новое бронирование для киносеанса с ID = {id}. В теле запроса должен быть передан массив:
	[ { "rowNum": number, "seatNum": number }, { "rowNum": number, "seatNum": number } ]
PATCH ${this.config.apiURIPrefix}/booking/{id} - обновить перечень мест для бронирования с ID = {id}. В теле запроса должен быть передан массив:
	[ { "rowNum": number, "seatNum": number }, { "rowNum": number, "seatNum": number } ]
DELETE ${this.config.apiURIPrefix}/booking/{id} - удалить бронирование с ID = {id}
`;
	}
}
