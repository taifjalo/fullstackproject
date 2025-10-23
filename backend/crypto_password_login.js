// طريقة تشفير رمز المستخدم عند تسجيل الدخول
const crypto = require("crypto")
 
// Generate 32 bytes of random data
const secretKeyBuffer = crypto.randomBytes(32)

// Convert the buffer to a hex string
const secretKeyHex = secretKeyBuffer.toString("hex")

console.log("Generate Secret Key: ", secretKeyHex)