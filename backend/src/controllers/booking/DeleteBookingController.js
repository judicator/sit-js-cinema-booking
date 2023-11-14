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
		const showID = bookingModel.deleteBooking(bookingID);
		if (showID) {
			const showsDate = AppComponents.getComponent('cinemaShowsDateModel');
			const show = showsDate.getShow(showID);
			show.booking = bookingModel.getByShowID(show.id, bookingID);
			response.write(JSON.stringify(show));
		}
		else {
			response.statusCode = 404;
			response.write(JSON.stringify({ 'message': 'Not Found' }));
		}
	}
}
