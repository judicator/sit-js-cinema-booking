const JSONModel = require(APP_ROOT + 'models/JSONModel.js');

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
						bookingArray[b.row][b.seat] = bookID;
					});
				}
			}
			booking.bookings = bookingArray;
		}
		return booking;
	}
}
