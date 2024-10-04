import database from '../repository/index.js';

//TESTAR
async function createUser(firstName, lastName, birthday, email, password) {
    const conn = await database.connect();

    const data = [firstName, lastName, birthday, email, password];
    const sql = "insert into users(user_first_name, user_last_name, user_birthday, user_email, user_password) values(?,?,?,?,?)";

    try {
        await conn.query(sql, data)
    } catch (error) {
        throw new Error(error);
    }
}

//TESTAR
async function login(email, password) {
    const conn = await database.connect();

    const data = [email, password];
    const sql = "select * from users WHERE email = ?";

    try {
        const users = await conn.query(sql, data);

        const user = users[0];

        if (user.length === 0) {
            conn.end();
            throw new Error("Usuário não encontrado.");
        }

        if (password != user.user_password) {
            conn.end();
            throw new Error("Senha incorreta.");
        }

    } catch (error) {
        throw new Error(error);
    }
}

export default { createUser, login }