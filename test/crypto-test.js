import crypto from 'crypto'
const hashPassword = password => {
    return crypto.createHash('sha256').update(password).digest('hex')
}
const password = hashPassword('secret')
console.log(password)

const compareHashPassword = (password, hashedPassword) => {
    if (hashPassword(password) === hashedPassword) {
        return { success: true, message: 'Password matched' }
    }
    return { success: false, message: 'Password not matched' }
}

const result = compareHashPassword('secret', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b')
console.log(result)

// Output
// { success: true, message: 'Password matched' }