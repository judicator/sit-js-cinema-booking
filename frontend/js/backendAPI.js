const apiURI = 'http://localhost:3000/api/cinema';

class BackendAPI {
	// Список жанров фильмов
	static async getGenresList() {
		const uri = `${apiURI}/genres`;
		const response = await fetch(uri);
		if (response.ok) {
			const genres = await response.json();
			return genres;
		}
		console.error(`Не удалось получить список жанров фильмов`);
		return [];
	}

	// Список кинозалов
	static async getHallsList() {
		const uri = `${apiURI}/halls`;
		const response = await fetch(uri);
		if (response.ok) {
			const halls = await response.json();
			return halls;
		}
		console.error(`Не удалось получить список кинозалов`);
		return [];
	}

	// Расписание кинотеатра
	static async getSchedule(date = null) {
		if (date === null) {
			const uri = apiURI;
			const response = await fetch(uri);
			if (response.ok) {
				const showsDates = await response.json();
				return showsDates;
			}
			return [];
		}
		else {
			const uri = `${apiURI}/${encodeURIComponent(date)}`;
			const response = await fetch(uri);
			if (response.ok) {
				const showsDate = await response.json();
				return showsDate;
			}
			return {};
		}
	}

	// Информация о фильме
	static async getMovieInfo(id) {
		const uri = `${apiURI}/movie/${encodeURIComponent(id)}`;
		const response = await fetch(uri);
		if (response.ok) {
			const movie = await response.json();
			return movie;
		}
		console.error(`Не удалось получить информацию о фильме с ID = ${id}`);
		return {};
	}

	// Информация о киносеансе
	static async getShowInfo(id, bookID = null) {
		let uri = `${apiURI}/show/${encodeURIComponent(id)}`;
		if (bookID) {
			uri += '?booking_id=' + encodeURIComponent(bookID);
		}
		const response = await fetch(uri);
		if (response.ok) {
			const show = await response.json();
			return show;
		}
		console.error(`Не удалось получить информацию о киносеансе с ID = ${id}`);
		return {};
	}

	// Создание бронирования
	static async createBooking(showID, booking) {
		const uri = `${apiURI}/booking/${encodeURIComponent(showID)}`;
		const response = await fetch(uri, {
			'method': 'POST',
			'body': JSON.stringify(booking)
		});
		if (response.status === 500) {
			console.error(`Не удалось создать бронь для киносеанса с ID = ${id}`);
			return {};
		}
		const showInfo = await response.json();
		return showInfo;
	}

	// Обновление бронирования
	static async updateBooking(bookID, booking) {
		const uri = `${apiURI}/booking/${encodeURIComponent(bookID)}`;
		const response = await fetch(uri, {
			'method': 'PATCH',
			'body': JSON.stringify(booking)
		});
		if (response.status === 500) {
			console.error(`Не удалось обновить бронь с ID = ${id}`);
			return {};
		}
		const showInfo = await response.json();
		return showInfo;
	}

	// Удаление бронирования
	static async deleteBooking(bookID) {
		const uri = `${apiURI}/booking/${encodeURIComponent(bookID)}`;
		const response = await fetch(uri, {
			'method': 'DELETE'
		});
		if (response.status === 500) {
			console.error(`Не удалось удалить бронь с ID = ${id}`);
			return {};
		}
		const showInfo = await response.json();
		return showInfo;
	}
}
