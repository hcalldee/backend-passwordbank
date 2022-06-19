import express from "express" ;
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

import CryptoJS from 'crypto-js';
var keySize = 32;
var ivSize = 128;
var iterations = 100;

function encrypt (msg, pass) {
    var salt = CryptoJS.lib.WordArray.random(128/8);
    
    var key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize/32,
        iterations: iterations
      });
  
    var iv = CryptoJS.lib.WordArray.random(128/8);
    
    var encrypted = CryptoJS.AES.encrypt(msg, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
      
    });
    
    var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
    return transitmessage.replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l')
}

function decrypt (transitmessage, pass) {
    transitmessage = transitmessage.replace(/p1L2u3S/g, '+' ).replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=')
    var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);
    
    var key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize/32,
        iterations: iterations
      });
  
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
      
    })
    return decrypted;
}

function jsonRead(path,callback) {
    fs.readFile(path,'utf-8',(err,dataJson)=>{
        if(err){
            return callback && callback(err);
        }
        try {
            const obj = JSON.parse(dataJson);
            return callback && callback(null,obj);
        } catch (err) {
            return callback && callback(err);
        }
    })
}

router.get('/',(req,res)=>{
    jsonRead('./backend/user.json',(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            res.send(Data)
        }
    })
});

router.post('/',(req,res)=>{
    jsonRead('./backend/user.json',(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            let user = req.body 
            const encription = encrypt(user.password, user.key)
            const newdata = {
                id:uuidv4(),
                username:user.username,
                generated:encription,
                site:user.site
            }
            Data.push(newdata);   
            fs.writeFile('./backend/user.json',JSON.stringify(Data,null,2),err=>{
                if(err){
                    console.log(err)
                }else{
                    res.send(`Data ${req.body.username} disimpan`) 
                }
            })
        }
    })
})


router.post('/decrypt',(req,res)=>{
    const {id,generated,key} = req.body
    jsonRead('./backend/user.json',(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            const user = Data.find((user)=> user.id === id)
            const decryption = decrypt(generated, key).toString(CryptoJS.enc.Utf8)
            const foundUser = {
                username:user.username,
                password:decryption,
                site:user.site
            }
            res.send(foundUser)
        }
    })

})

router.post('/search',(req,res)=>{
    const {id} = req.body
    jsonRead('./backend/user.json',(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            const foundUser = Data.find((user)=> user.id === id)
            res.send(foundUser)
        }
    })
    
})

router.patch('/edit',(req,res)=>{
    const {id,generated,old_pw,old_ky,new_pw,new_ky,username,site} = req.body
    jsonRead('./backend/user.json',(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            const foundUser = Data.find((user)=> user.id === id)
            const decryption = decrypt(generated, old_ky).toString(CryptoJS.enc.Utf8)
            if(decryption===old_pw){
                if(new_ky&&new_pw){
                    foundUser.generated = encrypt(new_pw, new_ky)
                }
                if(username){
                    foundUser.username=username
                }
                if(site){
                    foundUser.site=site
                }
                Data = Data.filter((user)=>user.id !== id)
                Data.push(foundUser);   
                fs.writeFile('./backend/user.json',JSON.stringify(Data,null,2),err=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.send(`Data ${req.body.username} berhasil diubah`) 
                    }
                })
            }else{
                res.send(`Kredensial Salah`) 
            }
            // res.send(foundUser)
        }
    })
})

router.delete('/delete',(req,res)=>{
    const {id,key,pw,generated} = req.body
    jsonRead('./backend/user.json',(err,Data)=>{
        if(err){
            console.log(err);
        }else{
            const deleteUser = Data.find((user)=> user.id === id)
            const decryption = decrypt(generated, key).toString(CryptoJS.enc.Utf8)
            if(decryption===pw){
                Data = Data.filter((user)=>user.id !== id) 
                fs.writeFile('./backend/user.json',JSON.stringify(Data,null,2),err=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.send(`Data ${deleteUser.username} dihapus`) 
                    }
                })
            }else{
                res.send(`Kredensial Salah`) 
            }
        }
    })
})
export default router