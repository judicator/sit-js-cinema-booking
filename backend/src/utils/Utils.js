module.exports = class Utils {

	// Метод возвращает случайное целое число
	// Если указан только один параметр minValue, будет возвращено число в диапазоне от 0 до minValue (обе границы включительно)
	// Если указаны оба параметра minValue и maxValue, будет возвращено число в диапазоне от minValue до maxValue (обе границы включительно)
	static getRandomInt(minValue, maxValue = null) {
		if (maxValue === null) {
			return Math.floor(Math.random() * (minValue + 1));
		}
		else {
			return minValue + Math.floor(Math.random() * (maxValue - minValue + 1));
		}
	}

	// Метод возвращает дату в виде строки формата ДД.ММ.ГГГГ ЧЧ:ММ, в локальном часовом поясе
	static formatDateTime(date) {
		let result = date.getDate() < 10 ? `0${date.getDate()}.` : `${date.getDate()}.`;
		result += date.getMonth() < 9 ? `0${date.getMonth() + 1}.${date.getFullYear()} ` : `${date.getMonth() + 1}.${date.getFullYear()} `;
		result += date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
		result += date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
		return result;
	}

	// Метод возвращает дату в виде строки формата ДД.ММ.ГГГГ, в локальном часовом поясе
	static formatDate(date) {
		let result = date.getDate() < 10 ? `0${date.getDate()}.` : `${date.getDate()}.`;
		result += date.getMonth() < 9 ? `0${date.getMonth() + 1}.${date.getFullYear()}` : `${date.getMonth() + 1}.${date.getFullYear()}`;
		return result;
	}

	// Метод возвращает дату в виде строки формата ГГГГ-ММ-ДД, в локальном часовом поясе
	static formatDateURL(date) {
		let result = `${date.getFullYear()}-` + (date.getMonth() < 9 ? `0${date.getMonth() + 1}-` : `${date.getMonth() + 1}-`);
		result += date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
		return result;
	}

	// Метод возвращает время в виде строки формата ЧЧ:ММ, в локальном часовом поясе
	static formatTime(date) {
		let result = date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
		result += date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
		return result;
	}

	// Метод возвращает строку MIME-type (для заголовка Content-Type) на основании расширения файла картинки
	static getImageMIMEType(imgExt) {
		switch (imgExt.toLowerCase()) {
			case '.apng':
				return 'image/apng';
			case '.avif':
				return 'image/avif';
			case '.gif':
				return 'image/gif';
			case '.jpg':
			case '.jpeg':
			case '.jfif':
			case '.pjpeg':
			case '.pjp':
				return 'image/jpeg';
			case '.png':
				return 'image/png';
			case '.svg':
				return 'image/svg+xml';
			case '.webp':
				return 'image/webp';
			default:
				return 'image/png';
		}
	}

	// Метод генерирует и возвращает новый случайный идентификатор (UUID)
	static getRandomID() {
		const uuid = require('uuid');
		return uuid.v4();
	}

	// 1 x d100
	static gotTheChance(percent) {
		return (Utils.getRandomInt(1, 100) <= percent);
	}

	// Метод возвращает случайный элемент переданного массива
	static getRandomValFromArr(array) {
		return array[Utils.getRandomInt(array.length - 1)];
	}

	// Метод возвращает массив из count случайных элементов массива array
 	// Если requireUniqueValues = true, все возвращённые элементы будут уникальными
	static getRandomValsFromArr(array, count, requireUniqueValues = true) {
		if (array.length <= count) {
			if (requireUniqueValues) {
				return Array.from(new Set(array));
			}
			else {
				return array;
			}
		}
		const result = [];
		const resultSet = new Set();
		for (let i = 0; i < count; i++) {
			let newValue = Utils.getRandomValFromArr(array);
			if (requireUniqueValues) {
				while (resultSet.has(newValue)) {
					newValue = Utils.getRandomValFromArr(array);
				}
			}
			result.push(newValue);
			if (requireUniqueValues) {
				resultSet.add(newValue);
			}
		}
		return result;
	}

	// Метод проверяет, является ли переданная строка допустимым именем файла картинки
	static valigImgFileName(fileName) {
		return /^[a-z0-9-]+\.[a-z]+$/.test(fileName);
	}

	// Метод возвращает строку длиной length из случайных символов, содержащихся в строке symbols
	static getRandomString(length, symbols) {
		let result = '';
		let i = 0;
		const symLen = symbols.length;
		while (i < length) {
			result += symbols.charAt(this.getRandomInt(symLen - 1));
			i++;
		}
		return result;
	}
}
