const express = require('express');
const utils = require('applay-utils');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // let checklists = await Checklist.find({});
    let checklists = await utils.findAsync(req.db, 'checklists', {ativo: true});
    res.status(200).render('checklists/index', { checklists: checklists})
  } catch (error) {
    res.status(200).render('pages/error', {error: 'Erro ao exibir as Listas'});
  }
})

router.get('/new', async(req, res) => {
  try {
    // let checklist = new Checklist();
    let checklist = {
      name: '', 
      tasks: [],
      ativo: true
    };
    res.status(200).render('checklists/new', { checklist: checklist });
  } catch (error) {
    res.status(500).render('pages/error', { errors: 'Erro ao carregar o formulário' })
  }
})

router.get('/:id/edit', async(req, res) =>{
  try {
    let checklist = await utils.findOneAsync(req.db, 'checklists', {_id: utils.mdb.ObjectID(req.params.id)})
    res.status(200).render('checklists/edit', { checklist: checklist })
  } catch (error) {
    res.status(500).render('pages/error', {error: 'Erro ao exibir a edição Listas de tarefas'});
  }
})

router.post('/', async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = {
    name, 
    tasks: [],
    ativo: true
  };
  try {
    await utils.insertOne(req.db, 'checklists', checklist);
    res.redirect('/checklists');
  } catch (error) {
    res.status(422).render('checklists/new', { checklist: { ...checklist, error}})
  }
})

router.get('/:id', async (req, res) => {
  try {
    let checklist = await utils.findOneAsync(req.db, 'checklists', {_id: utils.mdb.ObjectID(req.params.id)})
    res.status(200).render('checklists/show', { checklist: checklist})
  } catch (error) {
    res.status(500).render('pages/error', {error: 'Erro ao exibir as Listas de tarefas'});
  }
})

router.put('/:id', async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = await utils.findOneAsync(req.db, 'checklists', {_id: utils.mdb.ObjectID(req.params.id)})
  checklist.name=name;
  
  try {
    await utils.updateAsync(req.db, 'checklists', checklist);
    res.redirect('/checklists');
  } catch (error) {
    let errors = error.errors;
    res.status(422).render('checklists/edit', {checklist: {...checklist, errors}});
  }
})

router.delete('/:id', async (req, res) => {
  let checklist = await utils.findOneAsync(req.db, 'checklists', {_id: utils.mdb.ObjectID(req.params.id)})
  checklist.ativo=false
  try {
    // await utils.deleteMany(req.db, 'checklists', {_id: utils.mdb.ObjectID(req.params.id)})
    await utils.updateAsync(req.db, 'checklists', checklist);
    res.redirect('/checklists');
  } catch (error) {
    res.status(500).render('pages/error', {error: 'Erro ao delete a Lista de tarefas'});
  }
})


module.exports = router;