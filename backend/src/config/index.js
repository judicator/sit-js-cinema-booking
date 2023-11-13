require('dotenv').config();
const path =  require('path');

module.exports = Object.freeze({
	'port': Number(process.env.PORT) || 3000,
	'apiURIPrefix': process.env.API_URI_PREFIX || '/api/clients',
	'staticFilesURIPrefix': process.env.STATIC_FILES_URI_PREFIX || '/static/img/movies',
	'showResponsesInTerminal': (process.env.SHOW_RESPONSES_IN_TERMINAL === 'true') || false,
	'JSONDirPath': path.normalize(APP_ROOT + '../storage/'),
	'staticMoviesImgPath': path.normalize(APP_ROOT + '../resources/static/img/movies/'),
	'randomMoviesCount': Number(process.env.RANDOM_MOVIES_COUNT) || 50,
	'randomMovieMinDuration': Number(process.env.RANDOM_MOVIE_MIN_DURATION) || 60,
	'randomMovieMaxDuration': Number(process.env.RANDOM_MOVIE_MAX_DURATION) || 180,
	'minHallsCount': Number(process.env.MIN_HALLS_COUNT) || 3,
	'maxHallsCount': Number(process.env.MAX_HALLS_COUNT) || 5,
	'minHallSeatsInRows': Number(process.env.MIN_HALL_SEATS_IN_ROWS) || 8,
	'maxHallSeatsInRows': Number(process.env.MAX_HALL_SEATS_IN_ROWS) || 12,
	'minHallRows': Number(process.env.MIN_HALL_ROWS) || 10,
	'maxHallRows': Number(process.env.MAX_HALL_ROWS) || 15,
	'cinemaOpensAt': Number(process.env.CINEMA_OPENS_AT) || 9,
	'cinemaClosesAt': Number(process.env.CINEMA_CLOSES_AT) || 26,
	'gapBetweenShows': Number(process.env.GAP_BETWEEN_SHOWS) || 15,
	'showsScheduleFor': Number(process.env.SHOWS_SCHEDULE_FOR) || 7,
	'movieHasNoImageImg': process.env.MOVIE_HAS_NO_IMAGE_IMG || 'no-image.png',
	'moviesPerDay': Number(process.env.MOVIES_PER_DAY) || 8
});
