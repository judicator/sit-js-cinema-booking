const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class MovieInfoController extends DefaultAPIController {
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const id = this.requestParams[0];
		const movie = AppComponents.getComponent('movieModel').getObject(id);
		if (movie) {
			response.write(JSON.stringify(movie));
		}
		else {
			// Фильм не найден
			response.statusCode = 404;
			response.write(JSON.stringify({ 'message': 'Not Found' }));
		}
	}
}
