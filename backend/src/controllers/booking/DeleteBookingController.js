const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class DeleteBookingController extends DefaultAPIController
{
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const bookingID = this.requestParams[0];
		const bookingModel = AppComponents.getComponent('bookingModel');
		if (!bookingModel.deleteBooking(bookingID)) {
			response.statusCode = 404;
			response.write(JSON.stringify({ 'message': 'Not Found' }));
		}
	}
}
