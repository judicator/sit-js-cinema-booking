const fs = require('fs');
const path = require('path');
const Utils = require(APP_ROOT + '/utils/Utils.js');

module.exports = class GetImgController {
	constructor(requestParams) {
		this.requestParams = requestParams;
	}

	run(response) {
		const imgFile = this.requestParams[0];
		if (Utils.valigImgFileName(imgFile)) {
			const config = AppComponents.getComponent('config');
			const filePath = path.normalize(config.staticMoviesImgPath + imgFile);
			if (fs.existsSync(filePath)) {
				// Файл существует
				try {
					const contents = fs.readFileSync(filePath);
					response.setHeader('Content-Type', Utils.getImageMIMEType(path.extname(filePath)));
					response.setHeader('Content-Length', Buffer.byteLength(contents));
					response.setHeader('Access-Control-Allow-Origin', '*');
					response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
					response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
					response.setHeader('Cache-Control', 'max-age=604800'); // кэшировать картинки на неделю
					response.write(contents, 'binary');
				}
				catch (e) {
					this.notFound(response);
				}
			}
			else {
				// Файл не найден
				this.notFound(response);
			}
		}
		else {
			// Недопустимое имя файла - вернём ошибку 404
			this.notFound(response);
		}
	}

	notFound(response) {
		response.statusCode = 404;
		response.setHeader('Content-Type', 'application/json');
		response.setHeader('Content-Length', '0');
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
		response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	}
}
