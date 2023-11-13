const fs = require('fs');
const Utils = require(APP_ROOT + '/utils/Utils.js');

module.exports = class JSONModel {
	constructor(fileName, hasID = false) {
		this.config = AppComponents.getComponent('config');
		this.filePath = this.config.JSONDirPath + fileName + '.json';
		this.hasID = hasID;
		const dbDir = require('path').normalize(APP_ROOT + '../storage');
		if (!fs.existsSync(dbDir)) {
			// Создадим каталог для JSON-файла БД, если его нет
			fs.mkdirSync(dbDir);
		}
		if (!fs.existsSync(this.filePath)) {
			// Создадим пустой JSON-файл, если его еще нет
			this.writeData([]);
		}
	}

	// Метод возвращает объект с указанным ID, или false, если такой объект не найден
	getObject(id) {
		if (this.hasID) {
			const object = this.getObjects().filter((object) => object.id === id);
			return (object.length) ? object[0] : false;
		}
		return false;
	}

	// Метод возвращает объект с указанным индексом из массива объектов
	getObjectByIndex(idx) {
		return this.getObjects()[idx];
	}

	// Метод создаёт новый объекта и заполняет его данными из объекта newObj. Возвращает новый объект
	create(newObj) {
		if (this.hasID) {
			newObj.id = Utils.getRandomID();
		}
		const objects = [...this.getObjects(), newObj];
		this.writeData(objects);
		return newObj;
	}

	// Метод возвращает массив всех объектов
	getObjects() {
		return JSON.parse(fs.readFileSync(this.filePath) || '[]');
	}

	// Метод возвращает общее кол-во объектов в базе данных
	getObjectsCount() {
		return this.getObjects().length;
	}

	// Метод очищает БД
	clearDB() {
		this.writeData([]);
	}

	// Метод сохраняет переданный массив объектов в файл
	writeData(objects) {
		fs.writeFileSync(this.filePath, JSON.stringify(objects), { encoding: 'utf8' });
	}
}
