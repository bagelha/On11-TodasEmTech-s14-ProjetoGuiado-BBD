const mongoose = require('mongoose')
const Titulo = require('../models/titulo')

const criaTitulo = async(req, res) => {
    const titulo = new Titulo({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        genero:req.body.genero,
        descricao:req.body.descricao,
        estudio:req.body.estudio
    })

    //regra que nao permite criar um titulo que ja existe
    const tituloJaExiste = await Titulo.findOne({nome: req.body.nome})
    if(tituloJaExiste) {
        return res.status(409).json({error: "Titulo já cadastrado!"})
    }
    
    try {
        const novoTitulo = await titulo.save()
        return res.status(201).json(novoTitulo)
    }catch (err) {
        return res.status(400).json({message: error.message})
    }
}

const mostraTitulos = async (req, res)=> {
    const titulos = await Titulo.find().populate('estudio')
    return res.status(200).json(titulos)
}

const mostraTitulosMarvel = async (req, res) => {
    const titulos = await Titulo.find().populate('estudio')
    const titulosFiltrado = titulos.filter(titulo => titulo.estudio.nome == "marvel")

    return res.status(200).json(titulosFiltrado)
}

//regra que filtra todos os títulos Ghibli
const mostraTitulosGhibli = async (req, res) => {
    const titulos = await Titulo.find().populate('estudio')
    const titulosFiltrado = titulos.filter(titulo => titulo.estudio.nome == "ghibli")

    return res.status(200).json(titulosFiltrado)
}

// mostrar titulo de todos os filmes da Pixar
const mostraTituloPixar = async(req,res)=>{
    const titulos = await Titulo.find().populate('estudio')
    const titulosFiltrado = titulos.filter(titulo => titulo.estudio.nome == "pixar")

    res.status(200).json(titulosFiltrado)
}

// atualiza titulo a partir do id
const atualizaTitulo = async(req,res)=>{
    const encontraTitulo = await Titulo.findById(req.params.id)

    if(encontraTitulo == null){
        res.status(404).json({"message":"titulo não encontrado"})
    }

    if(req.body.nome != null){
        encontraTitulo.nome = req.boy.nome
    }

    if(req.body.genero != null){
        encontraTitulo.genero = req.body.genero
    }

    if(req.body.descricao != null){
        encontraTitulo.descricao = req.body.descricao
    }

    if(req.body.estudio != null){
        encontraTitulo.estudio = req.body.estudio
    }

    // agora vamos cuidar do banco de dados
    try{
        // salvar no banco de dados 
        const tituloAtualizado = await encontraTitulo.save()
        // mandar resposta alterada
    res.status(200).json(tituloAtualizado)
    }catch(err){
        res.status(500).json({ message: err.message})
}

}

// deleta titulo
const deletaTitulo = async (req, res) => {
    const encontraTitulo = await Titulo.findById(req.params.id)
    if(encontraTitulo == null){
        res.status(404).json({"message": "titulo nao encontrado"})
    }

    try{
        await encontraTitulo.remove()
        res.status(200).json({"message":"titulo removido com sucesso"})
    }catch(err){
        res.status(500).json({message:err})
    }
}




module.exports = { 
    criaTitulo,
    mostraTitulos,
    mostraTitulosMarvel,
    mostraTitulosGhibli,
    mostraTituloPixar,
    atualizaTitulo,
    deletaTitulo
}