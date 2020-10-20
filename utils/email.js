const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `safetours <${process.env.EMAIL_FROM}>`;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // // SendGrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });

            // mailgun
            // return nodemailer.createTransport({
            //     host: process.env.MAILGUN_HOST,
            //     port: process.env.MAILGUN_PORT,
            //     auth: {
            //         user: process.env.MAILGUN_USERNAME,
            //         pass: process.env.MAILGUN_PASSWORD
            //     }
            // });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    async send(template, subject) {
        // Sending the actual email
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })
        // 1) Rendering HTML from pug template

        // 2) Defining email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // 3) Creating a transport and send the email
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to safetours !');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Reset your password (token valid for only 10 minutes).');
    }
};