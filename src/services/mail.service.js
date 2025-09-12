const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
	auth: {
		api_key: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN,
	},
};

const transporter = nodemailer.createTransport(mg(auth));

const sendMail = async ({ to, subject, text, html }) => {
	try {
		const info = await transporter.sendMail({
			from: process.env.MAIL_FROM || `no-reply@${process.env.MAILGUN_DOMAIN}`,
			to,
			subject,
			text,
			html,
		});

		return { success: true, info };
	} catch (err) {
		console.error('Mailgun error:', err);
		return { success: false, error: err.message };
	}
};

module.exports = { sendMail };
