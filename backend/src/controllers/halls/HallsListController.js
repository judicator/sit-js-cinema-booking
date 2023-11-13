const DefaultAPIController = require(APP_ROOT + 'controllers/DefaultAPIController.js');

module.exports = class HallsListController extends DefaultAPIController {
	constructor(requestParams) {
		super(requestParams);
	}

	run(response) {
		super.run(response);
		response.write(JSON.stringify(AppComponents.getComponent('hallModel').getObjects()));
	}
}
