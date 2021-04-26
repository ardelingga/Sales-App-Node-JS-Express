const jwt = require('jsonwebtoken');
const JwtKeys = require('../key/JwtKeys');
const JsonResponse = require('./JsonResponse');

async function verifyToken(req, res, next) {
    var token = req.headers['x-api-key'];
    
    if(token){
        var publicKey = await JwtKeys.PublicKey(); 
        var signOptions = await JwtKeys.SignOptions();

        jwt.verify(token, publicKey, signOptions, function(error, decoded){
            if(error){
                return res.status(401).send(JsonResponse.Failed(error.message, res))
            }else{
                req.auth = decoded;
                next();
            }
        });
    }else{
        return res.status(402).send(JsonResponse.Failed('Token tidak tersedia!', res));
        // return res.status(400).send({meta:{code:400, message:'Token tidak tersedia'}});
    }

}

module.exports = verifyToken;