const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class ShowInfoController extends DefaultAPIController {
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const showsDate = AppComponents.getComponent('cinemaShowsDateModel');
		const bookingModel = AppComponents.getComponent('bookingModel');
		const id = this.requestParams[0];
		const show = showsDate.getShow(id);
		if (show) {
			// Киносеанс найден - получим данные о бронированиях
			const queryParams = AppComponents.getComponent('router').queryParams;
			// ID резервирования, переданный клиентом
			const bookingID = queryParams['booking_id'] ? queryParams['booking_id'].trim().toLowerCase() : '';
			show.booking = bookingModel.getByShowID(show.id, bookingID);
			response.write(JSON.stringify(show));
		}
		else {
			// Киносеанс не найден
			response.statusCode = 404;
			response.write(JSON.stringify({ 'message': 'Not Found' }));
		}
	}
}
