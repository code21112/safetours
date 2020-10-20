const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../../models/tourModel');
const User = require('./../../../models/userModel');
const Review = require('./../../../models/reviewModel');

dotenv.config({ path: `${__dirname}/../../../config.env` })
// console.log(process.env);

// console.log(process.env.DATABASE)
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// console.log('DB', DB)

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected and waiting'));

// READING JSON FILES
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// console.log(tours)
// console.log(typeof (tours))

// const parsedTours = JSON.parse(tours)
// console.log(typeof (parsedTours))
// console.log(parsedTours)
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));


// IMPORTING TO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Tours created OK')
        await User.create(users, { validateBeforeSave: false })
        console.log('Users created OK')
        await Review.create(reviews)
        console.log('Reviews created OK')
    } catch (err) {
        console.log(err)
    }
    process.exit();
};

//  DELETING DATABASE
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data erased OK')
    } catch (err) {
        console.log(err)
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
console.log(process.argv)
