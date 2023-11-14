class Utils {

	// HTML-экранирование "опасных" символов
	static escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/'/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	// Добавить/убрать элементу класс "is-invalid" (либо другой, указанный в параметре className)
	// Первым параметром можно передавать ID элемента или сам элемент
	static setElemInvalidState(element, isInvalid = true, className = 'is-invalid') {
		let elem = element;
		if (!(elem instanceof HTMLElement)) {
			elem = document.getElementById(element);
		}
		if (isInvalid) {
			elem.classList.add(className);
		}
		else {
			elem.classList.remove(className);
		}
	}

	// Установить/снять элементу атрибут disabled
	// Первым параметром можно передавать ID элемента или сам элемент
	static setElemDisabled(element, isDisabled = true) {
		let elem = element;
		if (!(elem instanceof HTMLElement)) {
			elem = document.getElementById(element);
		}
		if (isDisabled) {
			elem.setAttribute('disabled', '');
		}
		else {
			elem.removeAttribute('disabled');
		}
	}

	// Включить popper-тултипы с параметрами options всем элементам, найденным по query
	static setTooltips(query, options) {
		const elems = document.querySelectorAll(query);
		for (let i = 0; i < elems.length; i++) {
			new bootstrap.Tooltip(elems[i], options);
		}
	}

	// Сформировать читаемую дату/время на основании переданного timestamp
	static formatTimestamp(t) {
		const date = new Date(t);
		let result = date.getDate() < 10 ? `0${date.getDate()}.` : `${date.getDate()}.`;
		result += date.getMonth() < 9 ? `0${date.getMonth() + 1}.${date.getFullYear()} ` : `${date.getMonth() + 1}.${date.getFullYear()} `;
		result += `${date.getHours()}:` + (date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`);
		return result;
	}
}
