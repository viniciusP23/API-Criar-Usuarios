import express from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())


// Middleware de validação

function validarUsuario(req, res, next) {

    const {name, email} = req.body

    if(!email) {
        return res.status(400).json({message: "Email é obrigatório."})
    }

    if(name && name.length < 5) {
        return res.status(400).json({message: "Nome precisa ter 5 caracteres."})
    }

    next()
}

// Middleware pra validar ID

function validarId(req, res, next) {

    const {id} = req.params

    if(!id || id !== 24) {
        return res.status(400).json({message: "ID inválido."})
    }

    next()
}


// Listar Usuários
app.get("/usuarios", async (req, res) => {

    try {
        const listarUsuarios = await prisma.user.findMany()

        res.status(200).json(listarUsuarios)

    }catch(error) {

        res.status(500).json({message: "Usuários não encontrado."})
    }
})

// Lista Usuários por ID
app.get("/usuarios/:id", validarId,  async (req, res) => {

    try {
        const {id} = req.params
        const listarUsuarioID = await prisma.user.findUnique({
            where: {id}
        })

        if(!listarUsuarioID) {
            return res.status(404).json({message: "Usuário não encontrado."})
        }

        res.status(200).json(listarUsuarioID)

    }catch(error) {

        res.status(404).json({message: "Usuário não encontrado."})

    }
})

// Criar Usuário
app.post("/usuarios", validarUsuario, async (req, res) => {

    try {
        const {name, email, image} = req.body
        const criarUsuarios = await prisma.user.create({
            data: {
                name,
                email,
                image
            }
        })

        res.status(201).json(criarUsuarios)

    }catch(error) {

        res.status(500).json({message: "Erro ao criar Usuário."})
    }
})

// Atualizar Usuários
app.put("/usuarios/:id", validarId, validarUsuario, async (req, res) => {

    try {
        const {id} = req.params
        const {name, email, image} = req.body

        const atualizarUsuario = await prisma.user.update({
            where: {id},
            data: {
                name,
                email,
                image
            }
        })

        res.status(200).json(atualizarUsuario)

    }catch(error) {

        res.status(404).json({message: "Erro ao encontrar Usuário."})
    }
})

// Deletar Usuários
app.delete("/usuarios/:id", validarId, async (req, res) => {

    try {
        const deletarUsuarios = await prisma.user.delete({
            where: {id}
        })

        res.status(200).json(deletarUsuarios)

    }catch(error) {

        res.status(404).json({message: "Usuário não encontrado."})
    }
})


app.listen(3000, () => console.log("Servidor conectado..."))