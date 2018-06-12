const environmentfile = require('./environmentfile.json');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const users = require('./api/routes/users.js');
const emails = require('./api/routes/emails.js');

const uri = environmentfile.MONGO_URL;
mongoose.connect(uri);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
	if (req.method === 'OPTIONS') {
		res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
		return res.status(200).json({});
	}
	next();
});

// Routes
app.use('/users', users);
app.use('/emails', emails);

app.use((req, res, next) => {
	const error = new Error('Not found!');
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	})
})


module.exports = app;



