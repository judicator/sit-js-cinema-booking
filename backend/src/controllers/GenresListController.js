const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class GenresListController extends DefaultAPIController {
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		const genresSet = new Set();
		const movies = AppComponents.getComponent('movieModel').getObjects();
		for (let i = 0; i < movies.length; i++) {
			for (let j = 0; j < movies[i].genres.length; j++) {
				genresSet.add(movies[i].genres[j]);
			}
		}
		response.write(JSON.stringify(Array.from(genresSet).sort()));
	}
}
