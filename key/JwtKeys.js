const fs = require('fs')

const JwtKeys = module.exports = {
    PrivateKey: async function(){
        return new Promise((resolve, reject) => {
            var privateKey = fs.readFileSync(__dirname+`/private.key`, 'utf-8');
            resolve(privateKey);
        });
    },
    PublicKey: async function(){
        return new Promise((resolve, reject) => {
            var privateKey = fs.readFileSync(__dirname+`/public.key`, 'utf-8');
            resolve(privateKey);
        });
    },
    SignOptions: async function(){
        return {
            issuer: "SALESAPP-ARD",
            subject: "SERVICES",
            audience: "ALL",
            expiresIn: "730d",
            algorithm: "RS256"
        }
    },
}