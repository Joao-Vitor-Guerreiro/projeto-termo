const connection = require('./db');

async function addFuncionario(cpf, nome, email, ramal, setor) {
  try {
    const [rows, fields] = await connection
      .promise()
      .query(`SELECT * FROM Funcionario WHERE CPF = '${cpf}'`);

    if (rows.length > 0) {
      throw new Error('Funcionário já cadastrado!');
    } else {
      await connection
        .promise()
        .query(`
          INSERT INTO Funcionario (CPF, nome, email, ramal, setor)
          VALUES ('${cpf}', '${nome}', '${email}', '${ramal}', '${setor}')
        `);
      
      console.log('Cadastro efetuado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error);
    throw error;
  }
}


async function listarFuncionarios() {
    const [rows, fields] = await connection.promise().query('select * from Funcionario');
    return rows;
  }
  
  async function editarFuncionario(cpf) {
    try {
      const [rows, fields] = await connection
        .promise()
        .query(`
          select * from Funcionario
          where CPF = '${cpf}'
      `);
      return rows[0]; // Retorna o primeiro funcionário encontrado
    } catch (error) {
      throw new Error('Erro ao buscar funcionário: ' + error);
    }
  }
  

  function alterarFuncionario(nome, email, ramal, setor, cpf) {
    try {
      connection.query(
        `
          update Funcionario
          set
          nome = '${nome}',
          email = '${email}',
          ramal = '${ramal}',
          setor = '${setor}'
          where CPF = '${cpf}'
        `
      );
    } catch (error) {
      throw new Error('Erro ao alterar funcionário: ' + error);
    }
  }
  

function excluirFuncionario(cpf){
    connection.query(`
        delete from Funcionario 
        where CPF = '${cpf}'
    `);
}


module.exports = {
    addFuncionario: addFuncionario,
    listarFuncionarios: listarFuncionarios,
    editarFuncionario: editarFuncionario,
    alterarFuncionario: alterarFuncionario,
    excluirFuncionario: excluirFuncionario
}