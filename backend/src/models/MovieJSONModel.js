const JSONModel = require(APP_ROOT + 'models/JSONModel.js');
const Utils = require(APP_ROOT + 'utils/Utils.js');

module.exports = class MovieJSONModel extends JSONModel {
	constructor(fileName = 'movies') {
		super(fileName, true);
	}
}
