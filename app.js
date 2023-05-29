//express
const express = require('express');
const app = express();

//bodyparser
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));

//para aceitar arquivos estáticos
app.use('/public', express.static(__dirname + '/public'));

//handlebars
const { engine } = require('express-handlebars');
app.engine('handlebars', engine({
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true
  }
}));


app.set('view engine', 'handlebars');
app.set('views', './views');

//tabelas
const Funcionario = require('./models/Funcionario');
const Inventario = require('./models/Inventario');
const Termo = require('./models/Termo');
const Inventario_termo = require('./models/Inventario_termo');
const connection = require('./models/db');


//rotas funcionarios
app.get('/cad-funcionarios', async (req, res) => {
  const funcionario = await Funcionario.listarFuncionarios();
  res.render('cad-funcionarios', { funcionario: funcionario });
  console.log(funcionario);
});

app.post('/add-funcionario', async (req, res) => {
  try {
    await Funcionario.addFuncionario(req.body.cpf, req.body.nome, req.body.email, req.body.ramal, req.body.setor);
    res.redirect('/cad-funcionarios');
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    res.status(500).send('Funcionário já cadastrado');
  }
});

app.get('/lista-funcionarios', async (req, res) => {
  const funcionarios = await Funcionario.listarFuncionarios();
  res.render('lista-funcionarios', { funcionarios });
});

//rotas inventario

app.get('/cad-inventario', async (req, res) => {
  const inventario = await Inventario.listarInventario();
  res.render('cad-inventario', { itens: inventario });
  console.log(inventario);
});

app.post('/add-inventario', async (req, res) => {
  try {
    await Inventario.addInventario(req.body.patrimonio, req.body.tipo, req.body.modelo, req.body.localizacao, req.body.informacao, req.body.perifericos, res);
    res.redirect('/cad-inventario');
  } catch {
    console.log('Erro ao adicionar equipamento:', error);
    res.status(500).send('Equipamento já cadastrado');
  }
})

//rotas termo

app.get('/cad-termo', async (req, res) => {
  const termo = await Termo.listarTermos();
  res.render('cad-termo', { termo: termo });
  console.log(termo);
});

app.post('/add-termo', (req, res) => {
  Termo.addTermo(req.body.data_saida, req.body.data_devolucao, req.body.motivo, req.body.status_pendencia, req.body.quantidade_equipamento, req.body.setor, req.body.Funcionario_CPF, res);
  res.redirect('/cad-termo');
})

//rotas inventario_termo

app.get('/cad-inventario_termo', async (req, res) => {
  const inventario_termo = await Inventario_termo.listarInventarioTermo();
  res.render('cad-inventario_termo', { itens: inventario_termo });
  console.log(inventario_termo);
});

app.post('/add-inventario_termo', (req, res) => {
  Inventario_termo.addInventarioTermo(req.body.data_registro, req.body.status_disponibilidade, req.body.inventario_patrimonio, req.body.termo_id_termo, res);
  res.redirect('/cad-inventario_termo');
});

//rotas crud funcionario

app.get('/editar-funcionario/:cpf', async (req, res) => {
  const funcionario = await Funcionario.editarFuncionario(req.params.cpf);
  res.render('editar-funcionario', { funcionario });
});

app.post('/alterar-funcionario/:cpf', (req, res) => {
  Funcionario.alterarFuncionario(
    req.body.nome,
    req.body.email,
    req.body.ramal,
    req.body.setor,
    req.params.cpf
  );
  res.redirect('/lista-funcionarios');
});

app.get('/excluir-funcionario/:cpf', (req, res) => {
  Funcionario.excluirFuncionario(req.params.cpf);
  res.redirect('/cad-funcionarios');
});

//rotas crud equipameto
app.get('/editar-equipamento/:patrimonio', async (req, res) => {
  const equipamento = await Inventario.editarEquipamento(req.params.patrimonio);
  res.render('editar-equipamento', { equipamento });
});


app.post('/alterar-equipamento/:patrimonio', (req, res) => {
  Inventario.alterarEquipamento(
    req.body.tipo,
    req.body.modelo,
    req.body.localizacao,
    req.body.informacao,
    req.body.perifericos,
    req.params.patrimonio
  );
  res.redirect('/cad-inventario');
});

app.get('/excluir-equipamento/:patrimonio', (req, res) => {
  Inventario.excluirEquipamento(req.params.patrimonio);
  res.redirect('/cad-inventario');
});

//rotas crud termo

app.get('/editar-termo/:id_termo', async (req, res) => {
  const termo = await Termo.editarTermo(req.params.id_termo);
  res.render('editar-termo', { termo });
});


app.get('/editar-termo/:id_termo', async (req, res) => {
  const termo = await db.editarTermo(req.params.id_termo);
  res.render('editar-termo', { termo });
});


app.post('/excluir-termo/:id_termo', (req, res) => {
  Termo.excluirTermo(req.params.id_termo);
  res.redirect('/cad-termo');
});

//rotas crud inventario_termo

app.get('/editar-inventario-termo/:id', async (req, res) => {
  const inventario_termo = await Inventario_termo.buscarInventarioTermo(req.params.id);
  res.render('editar-inventario_termo', { inventario_termo });
});


app.post('/alterar-inventario-termo/:id', (req, res) => {
  Inventario_termo.atualizarInventarioTermo(
    req.body.data_registro,
    req.body.status_disponibilidade,
    req.body.inventario_patrimonio,
    req.body.termo_id_termo,
    req.params.id
  );
  res.redirect('/cad-inventario_termo');
});


app.get('/excluir-inventario-termo/:id', (req, res) => {
  Inventario_termo.excluirInventarioTermo(req.params.id);
  res.redirect('/cad-inventario_termo');
});

app.get('/lista-join', async (req, res) => {
  const [rows, fields] = await connection.promise().query('SELECT f.nome AS nome_funcionario, t.data_saida, t.data_devolucao, i.patrimonio, i.tipo, i.modelo, i.localizacao, i.informacao, i.perifericos, it.status_disponibilidade FROM funcionario AS f INNER JOIN termo AS t ON f.cpf = t.Funcionario_CPF INNER JOIN inventario_termo AS it ON t.id_termo = it.termo_id_termo INNER JOIN inventario AS i ON it.inventario_patrimonio = i.patrimonio');
  res.render('lista-join', { inventario: rows });
});



app.listen(3030, () => {
  console.log(`Servidor rodando na porta 3030`);
});


