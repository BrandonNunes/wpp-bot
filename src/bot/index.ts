import { create, Whatsapp } from '@wppconnect-team/wppconnect';
import {io} from "../../server";
import {BehaviorSubject} from "rxjs";
import {Response} from "express";

export let qrCodeBase64 = new BehaviorSubject("");
export let sessionStatus = new BehaviorSubject("");
export let sessionName= new BehaviorSubject("");
export let atualClient: Whatsapp;

export const data = {
    qrcode: qrCodeBase64.value,
    status: sessionStatus.value,
    session: sessionName.value
};

export const createSection = async () => {
    try {
        const client = await create({session: 'dige',
            catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
                if (base64Qrimg){
                    qrCodeBase64.next(base64Qrimg)
                    io.emit('qrcode', qrCodeBase64.value)
                    //  console.log(this.qrCodeBase64.value)
                }
                console.log('Number of attempts to read the qrcode: ', attempts);
                console.log('Terminal qrcode: ', asciiQR);
                //  console.log('base64 image string qrcode: ', base64Qrimg);
                // console.log('urlCode (data-ref): ', urlCode);
            },
            statusFind: (statusSession, session) => {
                console.log('Status Session: ', statusSession);
                if (statusSession) {
                    sessionStatus.next(statusSession)
                    io.emit('status', sessionStatus.value)
                    console.log(sessionStatus)
                }
                //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
                //Create session wss return "serverClose" case server for close
                console.log('Session name: ', session);
                if (session) {
                    sessionName.next(session)
                    io.emit('session', sessionName.value)
                }
            },
            onLoadingScreen: (percent, message) => {
                console.log('LOADING_SCREEN', percent+'%', message);
                io.emit('loading', `LOADING_SCREEN ${percent}% ${message}`)
            },
            autoClose: 300000,
            disableWelcome: true,
        })
        if (client) {
            atualClient = client
            start(client)
        }

    }catch (e) {
        console.log(e)
        return e;
    }
}

const start = (client: Whatsapp) => {
    atualClient = client
    client.onMessage((message) => {
        if (message.body === 'Hello') {
            client
                .sendText(message.from, 'Hello, how I may help you?')
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        }
    });
}
export const logout = () => {
    return atualClient.logout()
}
export const getConnectionState = (res: Response) => {
    return atualClient.getConnectionState()
}
export const sendMessage = async (number: string, message: string, res: Response ) => {
    if (!atualClient) {
        return res.status(500).json({mensagem: 'Não ha uma conexão disponível'})
    }
    if (number.length === 13 ) {
        let newNumber = number.split('')
        newNumber.splice(4, 1)
        number = newNumber.join('')
    }
    console.log(number)
    try {
        if (atualClient instanceof Whatsapp) {
            const result = await atualClient.sendText(`${number}@c.us`, message)
            console.log('Result: ', result);
            return res.json({message: 'mensagem enviada!'})
        }
    }catch (erro) {
        console.log(erro)
        return res.status(500).json({mensagem: 'falha ao enciar mensagem', erro})
    }
}
