//Connectar con MongoDB
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
//Definir modelo
const app = express();
const port = 5555;
//Connectar con Mongo
mongoose.connect("mongodb+srv://user1:user12345@testing1.lpa6yme.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});
const db = mongoose.connection;
//Definir un modelo de datos
const User = mongoose.model("User", {
    name: String,
    email: String,
});
//middleware para pasar datos
app.use(bodyParser.urlencoded({extended:true}));
//send html
app.get("/", (req,res)=>{
    res.sendFile(__dirname+ "/index.html");
});
//Manejar el envio del form
app.post("/add",async(req,res)=>{
    const {name, email} = req.body;
//Crear una nueva instancia del modelor User
    const newUser = new User({name, email});
    try{
        //Guardar el documento en la base de datos async/await
        await newUser.save()
        const userID = newUser._id;
        console.log("Usuario agregado exitosamente y el ID correspondiente es: "+userID);
        res.redirect(`/?success=1&userID=${userID}`);
    }catch (err)
    {
        console.error("Error insertando el documento: ", err);
        res.status(500).send("Error agregando usuario");
    }
});
//obtener el usuario agregado
app.get("/users/:userId", async (req, res)=>{
    try{
        const userID=req.params.userId;
        const user = await User.findById(userID);

        if(!user){
            return res.status(404).json({error:"Usuario no encontrado"});
        }
        res.json(user);
    }catch(err){
    console.error("Error mostrando usuario: ", err);
    res.status(500).jsom({error: "Error mostrando usuario"});
    }   
});
//borrar un usuario por ID
 app.delete("/delete/:userId", async(req, res)=>{
     const userID = req.params.userId;
     const deleteUser = await User.findByIdAndRemove(userID);
     try{
         if(!deleteUser){
             return res.status(400).json({error: "Usuario no encontrado"});
         }else{
             res.json({mensaje:"Usuario eliminado correctamente"+ deleteUser});
         }
     }catch(err){
         console.error("Error al elimnar usuario"+err);
         res.status(500).json({error:"Error eliminando al usuario"});
     }
 });
//Iniciar el server
app.listen(port,()=>{
    console.log(`Server ir runnig on port ${port}`);
});