const app = {
	// Подготовка модальных окон приложения и привязка событий
	initialize() {
		// Модальное окно со спиннером
		this.modalSpinner = bootstrap.Modal.getOrCreateInstance('#modal-spinner');
		// Модальное окно с ошибкой
		this.modalError = bootstrap.Modal.getOrCreateInstance('#modal-error');
	},

	// Показать модальное окно со спиннером (процесс загрузки списка клиентов)
	showSpinner() {
		this.modalSpinner.show();
	},

	// Скрыть модальное окно со спиннером
	hideSpinner() {
		this.modalSpinner.hide();
	},

	// Показать модальное окно с указанным текстом ошибки
	showError(errorMsg, htmlEnabled = false) {
		this.hideSpinner();
		if (htmlEnabled) {
			document.getElementById('modal-error-msg').innerHTML = errorMsg;
		}
		else {
			document.getElementById('modal-error-msg').textContent = Utils.escapeHtml(errorMsg);
		}
		this.modalError.show();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	app.initialize();
});

console.log(BackendAPI.getGenresList());
console.log(BackendAPI.getHallsList());
console.log(BackendAPI.getSchedule('2023-11-20'));
