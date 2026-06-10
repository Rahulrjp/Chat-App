import bcrypt from "bcryptjs";

const encrypt = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

console.log(await encrypt("123456"));