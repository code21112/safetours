const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// SAVING User photo on the disk
// const multerStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'public/img/users');
//     },
//     filename: (req, file, callback) => {
//         // objective: user-userId-timestamp.file-extension
//         // Extracting the file name
//         // const originalName = file.originalname.split('.')[0];
//         const extension = file.mimetype.split('/')[1];
//         callback(null, `user-${req.user.id}-${Date.now()}.${extension}`)
//     }
// });

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getAllUsers = factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find();

//     // SEND RESPONSE
//     res.status(200).json({
//         status: 'success',
//         results: users.length,
//         data: {
//             users
//         }
//     });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log('REQ.FILE', req.file);

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = factory.getOne(User);

// exports.getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// };

// exports.createUser = factory.createOne(User);

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined. Please sign up.'
    });
};

// Updating password must NOT be proceed through that function
exports.updateUser = factory.updateOne(User);

// exports.updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// };

exports.deleteUser = factory.deleteOne(User);

// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// };