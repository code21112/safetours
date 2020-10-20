const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');

const AppError = require('./../utils/appError');

const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tours data from collection
    const tours = await Tour.find();
    // 2) Building template

    // 3) Render template using data
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    })
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Getting data from requested tour, including tour guides and reviews
    const slug = req.params.slug;
    const tour = await Tour.findOne({ slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    // 2) Handling !tour
    if (!tour) {
        return next(new AppError("That tour doesn't exist", 404));
    }
    // 3) Building template
    // 4) Render template
    res.status(200).render('tour', {
        title: `${tour.name}`,
        tour
    })
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
};

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign up'
    })
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'My account'
    })
};

// exports.updateUserData = catchAsync(async (req, res, next) => {
//     const userUpdated = await User.findByIdAndUpdate(req.user.id, {
//         name: req.body.name,
//         email: req.body.email
//     }, {
//         runValidators: true,
//         new: true
//     });
//     // console.log(user)
//     res.status(200).render('account', {
//         title: 'My account',
//         user: userUpdated
//     })
// });


exports.getMyBookings = catchAsync(async (req, res, next) => {

    // 1) Finding all bookings from currently logged in user ==> tours id
    const bookings = await Booking.find({ user: req.user.id })
    // console.log(bookings)

    // 2) Finding tours from their id
    const toursIds = bookings.map(element => element.tour.id)
    // console.log(toursIds)
    const tours = await Tour.find({ _id: { $in: toursIds } })
    console.log(tours)
    if (tours) {
        res.status(200).render('overview', {
            title: 'My bookings',
            tours
        })
    } else {
        res.status(200).render('overview', {
            title: 'My bookings',
            message: 'No tour booked'
        })
    }
});

