import database from '../repository/index.js';

async function createUser(firstName, lastName, birthday, email, password) {
    const conn = await database.connectMySQL();

    const data = [firstName, lastName, birthday, email, password];
    const sql = "insert into users(user_first_name, user_last_name, user_birthday, user_email, user_password) values(?,?,?,?,?)";

    try {
        await conn.query(sql, data)
    } catch (error) {
        throw new Error(error);
    }
}

async function login(email, password) {
    const conn = await database.connectMySQL();

    const sql = "select * from users WHERE user_email = ?";

    try {
        const users = await conn.query(sql, email);


        if (users.length === 0) {
            conn.end();
            throw new Error("Usuário não encontrado.");
        }

        const user = users[0];

        if (password != user[0].user_password) {
            conn.end();
            throw new Error("Senha incorreta.");
        }

    } catch (error) {
        throw new Error(error);
    }
}

export default { createUser, login }