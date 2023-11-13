module.exports = [
	{
		'path': /(.*)/,
		'method': 'OPTIONS',
		'controller': 'DefaultAPI'
	},
	{
		'path': '',
		'method': 'GET',
		'controller': 'shows/ShowsList'
	},
	{
		'path': /^\/([0-9]{4}-[0-9]{2}-[0-9]{2})$/,
		'method': 'GET',
		'controller': 'shows/ShowsList'
	},
	{
		'path': '/halls',
		'method': 'GET',
		'controller': 'halls/HallsList'
	},
	{
		'path': '/genres',
		'method': 'GET',
		'controller': 'GenresList'
	},
	{
		'path': /^\/show\/([a-z0-9-]+)$/,
		'method': 'GET',
		'controller': 'shows/ShowInfo'
	},
	{
		'path': /^\/movie\/([a-z0-9-]+)$/,
		'method': 'GET',
		'controller': 'movies/MovieInfo'
	},
	{
		'path': /^\booking\/([a-z0-9-]+)$/,
		'method': 'POST',
		'controller': 'booking/CreateBooking'
	},
	{
		'path': /^\booking\/([a-z0-9-]+)$/,
		'method': 'PATCH',
		'controller': 'booking/UpdateBooking'
	},
	{
		'path': /^\booking\/([a-z0-9-]+)$/,
		'method': 'DELETE',
		'controller': 'booking/DeleteBooking'
	}
];
