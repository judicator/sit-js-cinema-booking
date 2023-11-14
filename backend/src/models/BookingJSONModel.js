const JSONModel = require(APP_ROOT + 'models/JSONModel.js');
const Utils = require(APP_ROOT + '/utils/Utils.js');

module.exports = class BookingJSONModel extends JSONModel {
	constructor(fileName = 'bookings') {
		super(fileName);
	}

	// Создать и сохранить пустой объект бронирований для указанного сеанса, взяв параметры зала из hall
	createEmpty(showID, hall) {
		this.create({
			showID,
			rows: hall.rows,
			seatsInRow: hall.seatsInRow,
			bookings: {}
		});
	}

	// Создать новую бронь для киносеанса с указанным showID и с указанным в массиве booking перечнем бронируемых мест
	// Метод возвращает объект бронирования
	// Если бронирование было совершено успешно, объект будет содержать свойство bookingID - ID брони
	// Если бронирование не удалось, в свойстве errorMsg будет сообщение об ошибке
	// Объект будет содержать свойство bookings в виде массива H x W, где H - кол-во рядов в зале, W - кол-во мест в ряду
	createBooking(showID, booking) {
		const bookObj = this.getByShowID(showID, '');
		if (Array.isArray(bookObj.bookings)) {
			let errorMsg = '';
			const bookArr = bookObj.bookings;
			const bookID = Utils.getRandomID();
			booking.every(b => {
				const rowNum = Number(b.rowNum);
				const seatNum = Number(b.seatNum);
				if (Number.isNaN(rowNum) || Number.isNaN(seatNum)) {
					errorMsg = 'Неверный номер ряда и/или места для данного кинозала!';
					return false;
				}
				else if (rowNum < 0 || rowNum >= bookObj.rows || seatNum < 0 || seatNum >= bookObj.seatsInRow) {
					errorMsg = 'Неверный номер ряда и/или места для данного кинозала!';
					return false;
				}
				else if (bookArr[rowNum][seatNum] !== null) {
					errorMsg = 'Как минимум одно из выбранных мест уже забронировано!';
					return false;
				}
				else {
					bookArr[rowNum][seatNum] = bookID;
				}
				return true;
			});
			if (errorMsg) {
				// Ошибка при проверке данных или бронировании
				bookObj.errorMsg = errorMsg;
			}
			else {
				// Бронирование успешно
				bookObj.bookingID = bookID;
				bookObj.bookings = bookArr;
				const allBookings = this.getObjects();
				const bookIndex = allBookings.findIndex(book => book.showID === showID);
				if (bookIndex === -1) {
					return {
						'errorMsg': 'Ошибка при записи данных бронирований в файл!'
					}
				}
				else {
					allBookings[bookIndex].bookings[bookID] = booking;
				}
				this.writeData(allBookings);
			}
			return bookObj;
		}
		else {
			return {
				'errorMsg': 'Неверный массив бронирований для указанного киносеанса!'
			}
		}
	}

	// Обновить данные брони с указанным bookingID указанным в массиве booking перечнем бронируемых мест
	// Места, не перечисленные в массиве booking, будут исключены из брони
	// Метод возвращает объект бронирования
	// Если обновления бронирования было совершено успешно, свойство errorMsg будет undefined
	// Если обновление бронирования не удалось, в свойстве errorMsg будет сообщение об ошибке
	// Объект будет содержать свойство bookings в виде массива H x W, где H - кол-во рядов в зале, W - кол-во мест в ряду
	updateBooking(bookingID, booking) {
		const bObj = this.getObjects().find(b => b.bookings.hasOwnProperty(bookingID));
		if (bObj) {
			const bookObj = this.getByShowID(bObj.showID, bookingID);
			if (Array.isArray(bookObj.bookings)) {
				let errorMsg = '';
				const bookArr = bookObj.bookings.map(arr => arr.slice());
				for (let i = 0; i < bookArr.length; i++) {
					for (let j = 0; j < bookArr[i].length; j++) {
						if (bookArr[i][j] === bookingID) {
							bookArr[i][j] = null;
						}
					}
				}
				booking.every(b => {
					const rowNum = Number(b.rowNum);
					const seatNum = Number(b.seatNum);
					if (Number.isNaN(rowNum) || Number.isNaN(seatNum)) {
						errorMsg = 'Неверный номер ряда и/или места для данного кинозала!';
						return false;
					}
					else if (rowNum < 0 || rowNum >= bookObj.rows || seatNum < 0 || seatNum >= bookObj.seatsInRow) {
						errorMsg = 'Неверный номер ряда и/или места для данного кинозала!';
						return false;
					}
					else if (bookArr[rowNum][seatNum] !== null && bookArr[rowNum][seatNum] !== bookingID) {
						errorMsg = 'Как минимум одно из выбранных мест уже забронировано!';
						return false;
					}
					else {
						bookArr[rowNum][seatNum] = bookingID;
					}
					return true;
				});
				if (errorMsg) {
					// Ошибка при проверке данных или бронировании
					bookObj.errorMsg = errorMsg;
					bookObj.bookingID = bookingID;
				}
				else {
					// Обновление брони успешно
					bookObj.bookingID = bookingID;
					bookObj.bookings = bookArr;
					const allBookings = this.getObjects();
					const bookIndex = allBookings.findIndex(book => book.showID === bObj.showID);
					if (bookIndex === -1) {
						return {
							'errorMsg': 'Ошибка при записи данных бронирований в файл!',
							'errorCode': 500
						}
					}
					else {
						allBookings[bookIndex].bookings[bookingID] = booking;
					}
					this.writeData(allBookings);
				}
				return bookObj;
			}
			else {
				return {
					'errorMsg': 'Неверный массив бронирований для указанного киносеанса!',
					'errorCode': 500
				}
			}
		}
		else {
			return {
				'errorMsg': 'Бронь с указанным ID не найдена!',
				'errorCode': 404
			}
		}
	}

	// Удалить бронь с указанным ID
	deleteBooking(bookingID) {
		const bList = this.getObjects();
		let showID = null;
		bList.forEach(b => {
			if (b.bookings.hasOwnProperty(bookingID)) {
				showID = b.showID;
				delete b.bookings[bookingID];
			}
		});
		if (showID) {
			this.writeData(bList);
		}
		return showID;
	}

	// Получить объект всех бронирований для киносеанса с указанным ID
	// Сами бронирования будут в свойстве bookings в виде массива H x W, где H - кол-во рядов в зале, W - кол-во мест в ряду
	// Если maskIDs = true, то ID всех бронирований, кроме переданного в параметре clientBookingID, будут заменены строкой "booked"
	// Для всех незабронированных мест вместо строки "booked" или ID бронирования будет null
	getByShowID(showID, clientBookingID, maskIDs = true) {
		const booking = this.getObjects().find(booking => booking.showID === showID);
		if (booking) {
			const bookingArray = [...Array(booking.rows)].map(e => Array(booking.seatsInRow).fill(null));
			for (const [bookID, bookInfo] of Object.entries(booking.bookings)) {
				if (maskIDs) {
					if (clientBookingID === bookID) {
						bookInfo.forEach(b => {
							bookingArray[b.rowNum][b.seatNum] = bookID;
						});
					}
					else {
						bookInfo.forEach(b => {
							bookingArray[b.rowNum][b.seatNum] = 'booked';
						});
					}
				}
				else {
					bookInfo.forEach(b => {
						bookingArray[b.rowNum][b.seatNum] = bookID;
					});
				}
			}
			booking.bookings = bookingArray;
		}
		return booking;
	}
}
