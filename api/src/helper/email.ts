import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';

async function sendMail(userEmail: string, groupName: string, groupId: any, name: string) {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL || '',
                pass: process.env.USER_PASS || '',
            },
        });

        // Read the email template
        const template = await fs.readFile('./src/templates/verification-template.ejs', 'utf-8');
        // Compile the template
        const compiledTemplate = ejs.compile(template);

        // Define email content
        const mailOptions = {
            from: 'param@gmail.com',
            to: userEmail,
            subject: 'Join tricout account',
            html: compiledTemplate({
                name: name, group: groupName, url: `${process.env.FRONTEND_URL}/${groupId}`
            }),
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error if needed
    }
}

export default sendMail;

