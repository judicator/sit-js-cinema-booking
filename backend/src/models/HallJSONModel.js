const JSONModel = require(APP_ROOT + 'models/JSONModel.js');

module.exports = class HallJSONModel extends JSONModel {
	constructor(fileName = 'halls') {
		super(fileName);
	}
}
