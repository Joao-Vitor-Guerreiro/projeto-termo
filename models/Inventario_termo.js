const connection = require('./db');

function addInventarioTermo(data_registro, status_disponibilidade, inventario_patrimonio, termo_id_termo, res) {
    try {
        connection.query(`
        insert into Inventario_termo(
            data_registro,
            status_disponibilidade,
            inventario_patrimonio,
            termo_id_termo
        ) values(
            '${data_registro}',
            '${status_disponibilidade}',
            '${inventario_patrimonio}',
            '${termo_id_termo}'                   
        )
    `);
        console.log("Cadastro efetuado com sucesso!!!");
    } catch (erro) {
        res.send("Erro ao cadastrar registro no inventário-termo:" + erro);
    }
}

async function listarInventarioTermo() {
    const [rows, fields] = await connection.promise().query('select * from Inventario_termo');
    return rows;
}

async function buscarInventarioTermo(id) {
    const [rows, fields] = await connection.promise().query(`
      SELECT * FROM Inventario_termo WHERE id_inventario_termo = ${id}
    `);
    return rows[0];
}

function atualizarInventarioTermo(data_registro, status_disponibilidade, inventario_patrimonio, termo_id_termo, id) {
    connection.query(`
        update Inventario_termo
        set
        data_registro = '${data_registro}',
        status_disponibilidade = '${status_disponibilidade}',
        inventario_patrimonio = '${inventario_patrimonio}',
        termo_id_termo = '${termo_id_termo}'
        where id_inventario_termo = ${id}

    `);
    return rows[0];
}

function excluirInventarioTermo(id) {
    connection.query(`
        delete from Inventario_termo 
        where id_inventario_termo = ${id}
    `);
}

module.exports = {
    addInventarioTermo: addInventarioTermo,
    listarInventarioTermo: listarInventarioTermo,
    buscarInventarioTermo: buscarInventarioTermo,
    atualizarInventarioTermo: atualizarInventarioTermo,
    excluirInventarioTermo: excluirInventarioTermo
};

