const SibApiV3Sdk = require('sib-api-v3-sdk');

// configure Brevo client
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send email using Brevo template
 */
const sendTemplateMail = async ({ to, templateId, params }) => {
	try {
		const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
		sendSmtpEmail.to = [{ email: to }];
		sendSmtpEmail.templateId = templateId;
		sendSmtpEmail.params = params;
		sendSmtpEmail.sender = { email: process.env.MAIL_FROM };

		const response = await tranEmailApi.sendTransacEmail(sendSmtpEmail);
		return { success: true, response };
	} catch (err) {
		console.error('Brevo template error:', err);
		return { success: false, error: err.message };
	}
};

module.exports = { sendTemplateMail };
