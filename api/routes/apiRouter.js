const express = require ('express')
//código para o registro de novos usuários
const bcrypt = require('bcryptjs')
apiRouter.post (endpoint + 'seguranca/register', (req, res) => {
    knex ('usuario')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8),
            email: req.body.email
        }, ['id'])
    .then((result) => {
            let usuario = result[0]
            res.status(200).json({"id": usuario.id })
            return
})
    .catch(err => {
    res.status(500).json({
        message: 'Erro ao registrar usuario - ' + err.message })
})
})


//módulo Knex para realizar a conexão com o banco de dados
const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
    });

const jwt = require('jsonwebtoken')
apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    knex
        .select('*').from('usuario').where( { login: req.body.login })
        .then( usuarios => {
            if(usuarios.length){
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync (req.body.senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY, {
                            expiresIn: 3600
                        })
                        res.status(200).json ({
                            id: usuario.id,
                            login: usuario.login,
                            nome: usuario.nome,
                            roles: usuario.roles,
                            token: tokenJWT
                        })
                        return
                    }
                }
                res.status(200).json({ message: 'Login ou senha incorretos' })
            })
            .catch (err => {
                res.status(500).json({
                    message: 'Erro ao verificar login - ' + err.message })
            })
})            



/*
let apiRouter = express.Router()
const endpoint = '/'
const lista_produtos = {
    produtos: [
        { id: 1, descricao: "Produto 1", valor: 5.00, marca: "marca " },
        { id: 2, descricao: "Produto 2", valor: 5.00, marca: "marca " },
        { id: 3, descricao: "Produto 3", valor: 5.00, marca: "marca " },
    ]
}
*/

//equisições de GET /api/produtos
apiRouter.get(endpoint + 'produtos', (req, res) => {
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
})


// CRUD
/*
apiRouter.get(endpoint + 'produtos/:id', (req, res) => { 
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
})
apiRouter.post(endpoint + 'produtos', (req, res) => {
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
 })
apiRouter.put(endpoint + 'produtos/:id', (req, res) => {
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
})
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { 
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
 })
*/
module.exports = apiRouter;