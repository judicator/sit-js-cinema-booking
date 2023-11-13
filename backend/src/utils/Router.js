module.exports = class Router
{
	requestParams = []; // параметры запроса из URI

	constructor()
	{
		this.routes = AppComponents.getComponent('routes');
		this.apiURIPrefix = AppComponents.getComponent('config').apiURIPrefix;
		this.staticURIPrefix = AppComponents.getComponent('config').staticFilesURIPrefix;
		this.queryParams = {};
		this.matchedURI = '';
	}

	// Обработка запроса - возвращает имя класса контроллера, соотв. маршруту, или false, если URI/метод не соответствуют ни одному маршруту.
	handle(request) {
		this.queryParams = {};
		this.requestParams = [];
		this.matchedURI = '';
		if (!request.url.startsWith(this.apiURIPrefix)) {
			// URI запроса не начинается с apiURIPrefix
			if (request.url.startsWith(this.staticURIPrefix)) {
				// Зато начинается с staticURIPrefix - т.е. это запрос статического файла (картинки)
				[this.matchedURI, ] = request.url.split('?');
				this.requestParams.push(request.url.substr(this.staticURIPrefix.length + 1));
				return 'static/GetImg';
			}
			return false;
		}
		// Получим часть URI без префикса - именно она проверяется на соотв-ие path в маршрутах, также отбросим параметры (часть URI после ?)
		let [reqURI, query] = request.url.substr(this.apiURIPrefix.length).split('?');
		if (reqURI === '/') {
			reqURI = '';
		}
		// параметры могут отсутствовать вообще или иметь вид a=b&b=c
		// во втором случае наполняем объект queryParams { a: 'b', b: 'c' }
		if (query) {
		  for (const piece of query.split('&')) {
			 const [key, value] = piece.split('=');
			 this.queryParams[key] = value ? decodeURIComponent(value) : '';
		  }
		}
		// Проверим маршруты по списку
		for (const {path, method, controller} of this.routes) {
			if (this.checkRequestMethod(request.method, method)) {
				// Метод HTTP-запроса соответствует указанному в маршруте - проверим URI на соответствие path
				if (path instanceof RegExp) {
					// Проверка соответствия URI регулярному выражению
					try {
						if (path.test(reqURI)) {
							this.requestParams = reqURI.match(path);
							this.requestParams.shift();
							this.matchedURI = this.apiURIPrefix + reqURI;
							return controller;
						}
					}
					catch(err) {
						throw new Error(err);
					}
				}
				else if (reqURI === path) {
					// path соответствует URI запроса
					this.matchedURI = this.apiURIPrefix + reqURI;
					return controller;
				}
			}
		}
		// Не нашли подходящего маршрута
		return false;
	}

	checkRequestMethod(reqMethod, allowedMethod) {
		if (allowedMethod === 'any') {
			// Допустим любой метод запроса
			return true;
		}
		if (Array.isArray(allowedMethod)) {
			// Допустимо несколько методов запроса
			return allowedMethod.includes(reqMethod);
		}
		return reqMethod === allowedMethod;
	}
}
