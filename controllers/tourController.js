const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// SAVING User photo in buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new AppError("You can only upload an image. Try again", 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);


exports.resizeTourPhotos = catchAsync(async (req, res, next) => {
    // console.log(req.files)
    // console.log('REQ.params.id', req.params.id)


    if (!req.files.imageCover || !req.files.images) return next();

    // Handling imageCover (which is an array)
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    // Handling images (which is an array)
    req.body.images = []

    await Promise.all(
        req.files.images.map(async (element, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
            await sharp(element.buffer)
                .resize(2000, 1300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );
    // console.log(req.body)

    next();
});


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


exports.getAllTours = factory.getAll(Tour);

// exports.getAllTours = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//     const tours = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours
//         }
//     });
// });

exports.getTour = factory.getOne(Tour);

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     // Tour.findOne({ _id: req.params.id })

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

exports.createTour = factory.createOne(Tour, { path: 'reviews' });

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });


exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});


exports.getToursWithin = catchAsync(async (req, res, next) => {
    //tours-within/233/center/40.786671, -73.980362/units/mi
    const { distance, Latlng, unit } = req.params;
    const [Lat, lng] = Latlng.split(",");

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
    console.log(radius)
    if (!Lat || !lng) {
        next(new AppError('Please provide a latitude and a longitude in the format lat,lng', 400))
    }
    // console.log(distance, Lat, lng, unit)
    const tours = await Tour.find({
        startLocation: {
            $geoWithin: { $centerSphere: [[lng, Lat], radius] }
        }
    })
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours
    })
});


// MY VERSION
// exports.getDistances = catchAsync(async (req, res, next) => {
//     const { Latlng, unit } = req.params;
//     const [Lat, lng] = Latlng.split(",");

//     console.log('Latlng', Latlng, typeof (unit));

//     if (!Lat || !lng) {
//         next(new AppError('Please provide a latitude and a longitude in the format lat,lng', 400))
//     }
//     let convertNumber = 1
//     if (unit === 'mi' || unit === 'miles') {
//         convertNumber = 0.62137 / 1000
//     } else {
//         convertNumber = 0.001
//     }
//     console.log('convertNumber', convertNumber)

//     const distances = await Tour.aggregate([
//         {
//             $geoNear: {
//                 near: { type: "Point", coordinates: [lng * 1, Lat * 1] },
//                 distanceField: "distance",
//                 distanceMultiplier: convertNumber
//             }
//         },
//         {
//             $sort: { distance: 1 }
//         },
//         {
//             $project: { 'name': 1, 'distance': 1 }
//         }
//     ]);
//     res.status(200).json({
//         status: 'success',
//         results: distances.length,
//         data: distances
//     })
// });

exports.getDistances = catchAsync(async (req, res, next) => {
    const { Latlng, unit } = req.params;
    const [Lat, lng] = Latlng.split(",");

    console.log('Latlng', Latlng, typeof (unit));

    const multiplier = unit === 'mi' ? 0.62137 / 1000 : 0.001

    if (!Lat || !lng) {
        next(new AppError('Please provide a latitude and a longitude in the format lat,lng', 400))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [lng * 1, Lat * 1] },
                distanceField: "distance",
                distanceMultiplier: multiplier
            }
        },
        {
            $project: { distance: 1, name: 1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: distances
    })
});
