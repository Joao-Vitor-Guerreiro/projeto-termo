const connection = require('./db');

function addInventario(patrimonio, tipo, modelo, localizacao, informacao, perifericos, res) {
  try {
    connection.query(`
        insert into Inventario(
            patrimonio,
            tipo,
            modelo,
            localizacao,
            informacao,
            perifericos
        ) values(
            '${patrimonio}',
            '${tipo}',
            '${modelo}',       
            '${localizacao}',       
            '${informacao}',
            '${perifericos}'                   
        )
    `);
    console.log("Cadastro efetuado com sucesso!!!");
  } catch (erro) {
    res.send("Erro ao cadastrar equipamento:" + erro);
  }
}

async function listarInventario() {
  const [rows, fields] = await connection.promise().query('select * from Inventario');
  return rows;
}

async function editarEquipamento(patrimonio) {
  const [rows, fields] = await connection.promise().query(`
      SELECT * FROM Inventario WHERE patrimonio = '${patrimonio}'
    `);
  return rows[0]; // Retorna apenas o primeiro registro encontrado
}


function alterarEquipamento(tipo, modelo, localizacao, informacao, perifericos, patrimonio) {
  connection.query(`
        update Inventario
        set
        tipo = '${tipo}',
        modelo = '${modelo}',
        localizacao = '${localizacao}',
        informacao = '${informacao}',
        perifericos = '${perifericos}'
        where patrimonio = '${patrimonio}'

    `);
}

function excluirEquipamento(patrimonio) {
  connection.query(`
        delete from Inventario 
        where patrimonio = '${patrimonio}'
    `);
}

module.exports = {
  addInventario: addInventario,
  listarInventario: listarInventario,
  editarEquipamento: editarEquipamento,
  alterarEquipamento: alterarEquipamento,
  excluirEquipamento: excluirEquipamento
}
