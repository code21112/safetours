const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csp = require('express-csp');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

// app.use(
//     cors({
//         origin: 'http://127.0.0.1:3000',
//         credentials: true,
//     })
// );

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
// app.use(helmet());

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'", 'data:', 'blob:'],
//             baseUri: ["'self'"],
//             fontSrc: ["'self'", 'https:', 'data:'],
//             scriptSrc: ["'self'", 'https://*.cloudflare.com'],
//             scriptSrc: ["'self'", 'https://*.stripe.com'],
//             scriptSrc: ["'self'", 'https://*.mapbox.com'],
//             frameSrc: ["'self'", 'https://*.stripe.com'],
//             objectSrc: ["'none'"],
//             styleSrc: ["'self'", 'https:', 'unsafe-inline'],
//             workerSrc: ["'self'", 'data:', 'blob:'],
//             childSrc: ["'self'", 'blob:'],
//             imgSrc: ["'self'", 'data:', 'blob:'],
//             connectSrc: [
//                 "'self'",
//                 'blob:',
//                 'https://*.mapbox.com',
//             ],
//             upgradeInsecureRequests: [],
//         },
//     })
// );

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'http:', 'data:'],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
            imgSrc: ["'self'", 'data:', 'blob:'],
        },
    })
);

// csp.extend(app, {
//     policy: {
//         directives: {
//             'default-src': ['self'],
//             'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
//             'font-src': ['self', 'https://fonts.gstatic.com'],
//             'script-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data',
//                 'blob',
//                 'https://js.stripe.com',
//                 'https://api.mapbox.com',
//             ],
//             'worker-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://js.stripe.com',
//                 'https://api.mapbox.com',
//             ],
//             'frame-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://js.stripe.com',
//                 'https://api.mapbox.com',
//             ],
//             'img-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://js.stripe.com',
//                 'https://api.mapbox.com',
//             ],
//             'connect-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://api.mapbox.com',
//                 'https://events.mapbox.com',
//             ],
//         },
//     },
// });

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);
// Compression package
app.use(compression());


// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log('REQ.COOKIES', req.cookies);
    next();
});


// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;