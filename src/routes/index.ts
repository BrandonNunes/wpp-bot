import {Router} from "express";
import {sendMessage} from "../bot";
import {createSection, logout, getConnectionState} from "../bot";
import {atualClient} from "../bot";
const routes = Router()

routes.post('/enviarmensagem', (req, res) => {
    const {number, message} = req.body;
    sendMessage(number, message, res)
})

routes.get('/start', (req, res) => {
    const initial = () => {
        createSection().then((response) => {
            res.json({response})
        }).catch((erro) => {
            res.status(500).json(erro)
        })

    }
    initial()
})
routes.get('/logout', (req, res) => {
    const logoutWpp = () => {
        logout().then((response) => {
            res.json({response})
        }).catch((erro) => {
            res.status(500).json(erro)
        })

    }
    logoutWpp()
})
routes.get('/status', (req, res) => {
    if (!atualClient) {
        return res.status(500).json({data: 'não foi identificado uma conexão'})
    }
    const getStatus = () => {
        getConnectionState(res).then((response) => {
            res.json({response})
        }).catch((erro) => {
            res.status(500).json(erro)
        })

    }
    getStatus()
})

export default routes
