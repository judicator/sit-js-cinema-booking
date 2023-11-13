const JSONModel = require(APP_ROOT + 'models/JSONModel.js');

module.exports = class CinemaShowsDateJSONModel extends JSONModel {
	constructor(fileName = 'shows') {
		super(fileName);
	}

	// Получить список сеансов на кокретную дату
	getShowsByDate(dateURL) {
		return this.getObjects().find(show => show.dateURL === dateURL);
	}

	// Получить информацию о киносеансе из расписания по ID киносеанса
	getShow(id) {
		let show = null;
		this.getObjects().every(showsDate => {
			const movie = showsDate.movies.find(movie => movie.shows.some(show => show.id === id));
			if (movie) {
				show = movie.shows.find(show => show.id === id);
				delete movie.shows;
				show.movie = movie;
			}
			return !show;
		});
		return show;
	}
}
