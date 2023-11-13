const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class CreateBookingController extends DefaultAPIController
{
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const showID = this.requestParams[0];
		const bookingModel = AppComponents.getComponent('bookingModel');
		const cinemaShowsDateModel = AppComponents.getComponent('cinemaShowsDateModel');
		if (cinemaShowsDateModel.getShow(showID)) {
			// Попробуем создать бронь для указанного киносеанса
			const booking = bookingModel.createBooking(showID, AppComponents.getComponent('app').requestBodyObj);
			if (booking.bookingID) {
				// Бронирование успешно завершено	
				response.statusCode = 201;
			}
			else {
				if (booking.bookings) {
					// Ошибки при бронировании
					response.statusCode = 422;
				}
				else {
					// Что-то пошло не так
					response.statusCode = 500;
					response.write(JSON.stringify({ 'message': 'Server Error' }));
				}
			}
			response.write(JSON.stringify(booking));
		}
		else {
			// Такого киносеанса не существует
			response.statusCode = 404;
			response.write(JSON.stringify({ 'message': 'Not Found' }));
		}
	}
}
