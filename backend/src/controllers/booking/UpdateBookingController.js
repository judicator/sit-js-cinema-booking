const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class UpdateBookingController extends DefaultAPIController
{
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const bookingID = this.requestParams[0];
		const bookingModel = AppComponents.getComponent('bookingModel');
		// Попробуем обновить бронь
		const booking = bookingModel.updateBooking(bookingID, AppComponents.getComponent('app').requestBodyObj);
		if (booking.bookingID) {
			if (booking.errorMsg) {
				// Ошибки при обновлении брони
				response.statusCode = 422;
			}
			response.write(JSON.stringify(booking));
		}
		else if (booking.errorCode === 404) {
			response.statusCode = 404;
			response.write(JSON.stringify({ 'message': 'Not Found' }));
		}
		else {
			// Что-то пошло не так
			response.statusCode = 500;
			response.write(JSON.stringify({ 'message': 'Server Error' }));
		}
	}
}
