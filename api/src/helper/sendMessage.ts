// sendMessage.ts
import twilio from 'twilio';
const client = twilio(process.env.ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export function sendMessage(messageBody: string, toPhoneNumber: string): void {
    client.messages
        .create({
            body: messageBody,
            from: process.env.TWILO_FROM, // Replace with your Twilio phone number
            to: toPhoneNumber,//+919691218798'
        })
        .then((message) => console.log(`Message sent. SID: ${message.sid}`))
        .catch((error) => console.error(`Error sending message: ${error.message}`))
        .finally(() => console.log('Message sending process completed.'));
}
