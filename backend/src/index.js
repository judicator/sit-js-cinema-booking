// Абсолютный путь каталога /src приложения
global.APP_ROOT = process.main ? process.main.paths[0].split('node_modules')[0] : process.mainModule.paths[0].split('node_modules')[0];

// Менеджер компонентов приложения
global.AppComponents = require(APP_ROOT + 'utils/AppComponents.js');

// Маршруты
AppComponents.registerComponent(
	'routes',
	APP_ROOT + 'routes'
);
// Конфигурация приложения
AppComponents.registerComponent(
	'config',
	APP_ROOT + 'config'
);
// Маршрутизатор
AppComponents.registerComponent(
	'router',
	APP_ROOT + 'utils/Router.js'
);
// Модель фильма, использующая для хранения данных JSON-файл
AppComponents.registerComponent(
	'movieModel',
	APP_ROOT + 'models/MovieJSONModel.js'
);
// Модель сеанса, использующая для хранения данных JSON-файл
AppComponents.registerComponent(
	'cinemaShowsDateModel',
	APP_ROOT + 'models/CinemaShowsDateJSONModel.js'
);
// Модель кинозала, использующая для хранения данных JSON-файл
AppComponents.registerComponent(
	'hallModel',
	APP_ROOT + 'models/HallJSONModel.js'
);
// Модель бронирования, использующая для хранения данных JSON-файл
AppComponents.registerComponent(
	'bookingModel',
	APP_ROOT + 'models/BookingJSONModel.js'
);
// Приветствие сервера в консоли
AppComponents.registerComponent(
	'serverGreeting',
	APP_ROOT + 'utils/ServerGreeting.js'
);
// Создаём приложение как экземпляр класса App
// За обработку всех URI, для которых не найден подходящий маршрут, будет отвечать контроллер FallbackController
AppComponents.registerComponent(
	'app',
	APP_ROOT + 'app',
	'Fallback'
);

const app = AppComponents.getComponent('app');
app.showBanner().generateHalls().generateShows().start();
