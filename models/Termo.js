const connection = require('./db');

async function addTermo(data_saida, data_devolucao, motivo, status_pendencia, quantidade_equipamento, setor, Funcionario_CPF) {
  try {
    // Verifica se os valores estão definidos e atribui valores padrão caso contrário
    data_devolucao = data_devolucao || null;
    status_pendencia = status_pendencia !== undefined ? status_pendencia : 0;
    quantidade_equipamento = quantidade_equipamento !== undefined ? quantidade_equipamento : null;
    setor = setor || '';

    const [rows] = await connection.promise().query(`SELECT * FROM funcionario WHERE CPF = '${Funcionario_CPF}'`);

    if (rows.length === 0) {
      console.error(`Erro ao cadastrar termo: Funcionário com CPF ${Funcionario_CPF} não encontrado.`);
      return;
    }

    connection.query(`
        INSERT INTO Termo (
          data_saida,
          data_devolucao,
          motivo,
          status_pendencia,
          quantidade_equipamento,
          setor,
          Funcionario_CPF
        ) VALUES (
          '${data_saida}',
          ${data_devolucao ? `'${data_devolucao}'` : 'null'},
          '${motivo}',
          ${status_pendencia},
          ${quantidade_equipamento !== undefined ? quantidade_equipamento : 'null'},
          '${setor}',
          '${Funcionario_CPF}'
        )
      `);

    console.log('Cadastro efetuado com sucesso!!!');
  } catch (error) {
    console.error(`Erro ao cadastrar termo: ${error}`);
  }
}


async function listarTermos() {
  const [rows, fields] = await connection.promise().query('SELECT * FROM Termo');
  return rows;
}

async function editarTermo(id_termo) {
  const [rows, fields] = await connection.promise().query(`
    SELECT * FROM Termo
    WHERE id_termo = ${id_termo}
  `);
  return rows[0]; // retorna os dados do primeiro termo encontrado
}


function alterarTermo(data_saida, data_devolucao, motivo, status_pendencia, quantidade_equipamento, setor, Funcionario_CPF, id_termo) {
  connection.query(`
    UPDATE Termo SET
      data_saida = '${data_saida}',
      data_devolucao = '${data_devolucao}',
      motivo = '${motivo}',
      status_pendencia = ${status_pendencia},
      quantidade_equipamento = ${quantidade_equipamento},
      setor = '${setor}',
      Funcionario_CPF = '${Funcionario_CPF}'
    WHERE
      id_termo = ${id_termo}
  `);
}

function excluirTermo(id_termo) {
  connection.query(`
    DELETE FROM Termo 
    WHERE id_termo = ${id_termo}
  `);
}

module.exports = {
  addTermo: addTermo,
  listarTermos: listarTermos,
  editarTermo: editarTermo,
  alterarTermo: alterarTermo,
  excluirTermo: excluirTermo
};
