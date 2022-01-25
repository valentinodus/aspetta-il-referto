const fastify = require('fastify')({ logger: true })

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const PORT = 8080

fastify.get('/sendEmail', {
    schema: {
        querystring: {
            recipient: { type: 'string' }
        }
    }
}, async (request, reply) => {

    sendEmail(request.query.recipient)
    return { success: 'sent' }
  })

  function sendEmail(to) {
    const msg = {
        to: to,
        from: process.env.SENDER_EMAIL,
        subject: 'Il tuo referto è arrivato!',
        text: 'Il tuo referto è finalmente arrivato, controlla la pagina web!',
        html: '<strong>Il tuo referto è finalmente arrivato, controlla la pagina web!</strong>',
      }


    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
  }

  fastify.register(require('fastify-cors'), { 
    // put your options here
    origin: (origin, cb) => {
        if(/mdb.ulss.tv.it/.test(origin)){
          //  Request from localhost will pass
          cb(null, true)
          return
        }
        // Generate an error on other origins, disabling access
        cb(new Error("Not allowed"))
      }
  })

// Run the server!
const start = async () => {
    try {
      await fastify.listen(PORT)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()