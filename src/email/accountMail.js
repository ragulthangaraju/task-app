const sgMail = require('@sendgrid/mail')

const sendgridApiKey = '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'

sgMail.setApiKey(sendgridApiKey)

const welcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rthangaraju@concertcare.com',
        subject: 'hi ragul',
        text: 'Thanks for joining in',
        html: `Welcome ${name}, thank you showing interest`
      })
}

const cancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rthangaraju@concertcare.com',
        subject: 'hi ragul',
        text:'Sorry to see you go',
        html: `Good bye ${name}, hope you come back soon`
      })
}

module.exports = { cancellationEmail, welcomeEmail }
