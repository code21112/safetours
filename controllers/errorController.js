const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    // console.log('IN handleDuplicateFieldsDB err.errmsg', err.errmsg)
    const value = err.keyValue.name || err.keyValue.email
    let fields = []
    const key = Object.values(err).map(el => fields.push(el));
    // console.log('key', key)
    // console.log('Object.keys(fields[4])', Object.keys(fields[4]))
    const targetKey = Object.keys(fields[4])[0]
    // console.log('targetKey', targetKey)
    const message = `A traveler with the same ${targetKey} already exists. You cannot use '${value}'. Please specify another ${targetKey}.`
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    console.log('IN handleValidationErrorDB', err)
    const errors = Object.values(err.errors).map(element => element.message);
    console.log(errors)

    const message = `Invalid data: ${errors.join('. ')}`
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token, please log in again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired, please log in', 401)

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        })
    }
    console.error('ERROR', err)
    return res.status(err.statusCode).render('error', {
        title: 'Something wrent wrong...',
        message: err.message
    })
};

const sendErrorProd = (err, req, res) => {
    // console.log('IN sendErrorProd', err)
    // Case 1: FOR /api
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        console.error('ERROR', err)
        console.log('err.name', err.name)
        return res.status(500).json({
            status: 'Error',
            message: "Something went wrong..."
        })
    }
    // Case 2: FOR rendered website
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something wrent wrong...',
            message: err.message
        })
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something wrent wrong...',
        message: "Please, try again later."
    })
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        console.log('IN development mode')
        sendErrorDev(err, req, res)
    } else if (process.env.NODE_ENV === 'production') {
        console.log('IN production mode')
        let error = { ...err }
        error.message = err.message;
        console.log(err.name)
        console.log(error)
        if (err.name === "CastError") err = handleCastErrorDB(err)
        if (err.code === 11000) err = handleDuplicateFieldsDB(err)
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err)
        if (err.name === 'JsonWebTokenError') err = handleJWTError()
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()

        sendErrorProd(err, req, res)
    }
};



// HIS CODE
// const AppError = require('./../utils/appError');

// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = err => {
//     const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//     console.log(value);

//     const message = `Duplicate field value: ${value}. Please use another value!`;
//     return new AppError(message, 400);
// };

// const handleValidationErrorDB = err => {
//     const errors = Object.values(err.errors).map(el => el.message);

//     const message = `Invalid input data. ${errors.join('. ')}`;
//     return new AppError(message, 400);
// };

// const handleJWTError = () =>
//     new AppError('Invalid token. Please log in again!', 401);

// const handleJWTExpiredError = () =>
//     new AppError('Your token has expired! Please log in again.', 401);

// const sendErrorDev = (err, res) => {
//     res.status(err.statusCode).json({
//         status: err.status,
//         error: err,
//         message: err.message,
//         stack: err.stack
//     });
// };

// const sendErrorProd = (err, res) => {
//     // Operational, trusted error: send message to client
//     if (err.isOperational) {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//         });

//         // Programming or other unknown error: don't leak error details
//     } else {
//         // 1) Log error
//         console.error('ERROR 💥', err);

//         // 2) Send generic message
//         res.status(500).json({
//             status: 'error',
//             message: 'Something went very wrong!'
//         });
//     }
// };

// module.exports = (err, req, res, next) => {
//     // console.log(err.stack);

//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     if (process.env.NODE_ENV === 'development') {
//         sendErrorDev(err, res);
//     } else if (process.env.NODE_ENV === 'production') {
//         let error = { ...err };

//         if (error.name === 'CastError') error = handleCastErrorDB(error);
//         if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//         if (error.name === 'ValidationError')
//             error = handleValidationErrorDB(error);
//         if (error.name === 'JsonWebTokenError') error = handleJWTError();
//         if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

//         sendErrorProd(error, res);
//     }
// };