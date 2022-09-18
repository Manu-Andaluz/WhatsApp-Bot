const fs = require('fs')
const { off } = require('process')
const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')
const SESSION_FILE_PATH = "./session.js"

const country_code = "54"
const number = '2612783677'
const msg = 'Hola Mundo'

let sessionData
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH)
}

const client = new Client({
    session: sessionData
})

client.initialize()

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
    console.log('EL cliente esta listo')

    let chatId = country_code + number + '@c.us'

    client.sendMessage(chatId, msg).then(response => {
        if (response.id.fromMe) {
            console.log('El mensaje fue enviado')
        }
    })
})

client.on('authenticated', session => {
    sessionData = session

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
        if (err) {
            console.error(err)
        }
    })
})

client.on('auth_failure', ms => {
    console.error('Hubo un fallo en la autenticación', msg)
})

client.on('message', msg => {
    if (msg.body === 'hola') {
        client.sendMessage(msg.from, 'Hola en que podemos ayudarla?')
    }
})