const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');


exports.getAllReviews = factory.getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {}
//     console.log(filter)
//     if (req.params.tourId) filter = { tour: req.params.tourId }
//     console.log(filter)
//     const reviews = await Review.find(filter);
//     res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     })
// });

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//     // console.log(req)
//     // console.log(req.user)

//     // Allowing nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId
//     if (!req.body.user) req.body.user = req.user.id

//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);