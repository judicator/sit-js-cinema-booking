const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class ShowsListController extends DefaultAPIController {
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const showsDate = AppComponents.getComponent('cinemaShowsDateModel');
		const forDate = this.requestParams[0];
		if (forDate) {
			// Расписание на конкретную дату
			const shows = showsDate.getShowsByDate(forDate);
			if (shows) {
				// Есть раписание на дату
				response.write(JSON.stringify(shows));
			}
			else {
				// Расписание на дату не найдено
				response.statusCode = 404;
				response.write(JSON.stringify({ 'message': 'Not Found' }));
			}
		}
		else {
			// Всё расписание полностью
			response.write(JSON.stringify(showsDate.getObjects()));
		}
	}
}
