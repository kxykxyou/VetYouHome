const { db } = require('./mysql')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, ARGON2_SALT } = process.env

async function queryUserCellphone (cellphone) {
  const [dbCellphone] = await db.execute('SELECT cellphone FROM user WHERE cellphone = ?', [cellphone])
  return dbCellphone[0]
}

async function queryUserEmail (email) {
  const [dbEmail] = await db.execute('SELECT cellphone FROM user WHERE cellphone = ?', [email])
  return dbEmail[0]
}

async function signup (fullname, email, password, cellphone) {
  const dbConnection = await db.getConnection()
  await dbConnection.beginTransaction()
  try {
    const hashedPassword = await argon2.hash(password, ARGON2_SALT)
    const user = {
      fullname,
      email,
      cellphone
    }
    const accessToken = await jwt.sign(
      {
        fullname,
        email,
        cellphone
      },
      JWT_SECRET
    )
    user.access_token = accessToken
    const [result] = await dbConnection.execute('INSERT INTO user (hashed_password, fullname, cellphone, email) VALUES (?, ?, ?, ?)', [
      hashedPassword,
      fullname,
      cellphone,
      email
    ])
    user.id = result.insertId
    await dbConnection.commit()
    return user
  } catch (error) {
    console.log(error)
    await dbConnection.rollback()
  } finally {
    await dbConnection.release()
  }
}

async function signin (cellphone, password) {
  const [user] = await db.execute('SELECT * FROM user WHERE cellphone = ?', [cellphone])
  // 若手機號碼不存在或者是密碼不對則回傳401
  if (!user[0] || !(await argon2.verify(user[0].hashed_password, password))) {
    return { error: 'Incorrect cellphone or password', status_code: 401 }
  }
  delete user[0].hashed_password
  return { user: user[0] }
}

module.exports = {
  queryUserCellphone,
  queryUserEmail,
  signup,
  signin
}
