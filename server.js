const express = require("express")
const uniqid = require('uniqid');
const app = express()


const path = require("path")
const PORT = process.env.PORT || 3001

const fs = require("fs")

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const public = path.join(__dirname, 'public');
const db = path.join(__dirname, 'db');

app.get('/', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(public,'notes.html'))
 });

app.get("/api/notes/", (req, res) => {
    fs.readFile(path.join(db, 'db.json'), function (err, object) {
       if (err) {
          throw err
       }
       res.json(JSON.parse(object))
    })
 })
 app.post("/api/notes/", (req, res) => {

    fs.readFile(path.join(db, 'db.json'), function (err, object) {
       if (err) {
          console.log(err)
          return
       }
       let notes = JSON.parse(object)

       const newNote = {
          title: req.body.title,
          text: req.body.text,
          id: uniqid(),
       }
 
       notes.push(newNote)
 
       let noteJSON = JSON.stringify(notes)
       console.log(noteJSON)
 
       fs.writeFile(path.join(db, 'db.json'), noteJSON, (err) => {
          if (err) {
             return console.log(err)
          }
          return noteJSON
       })
    })
})
app.delete('/api/notes/:id', function (req, res) {

    fs.readFile(path.join(db, 'db.json'), 'utf8', (err, data) => {
       if (err) {
          console.log(err)
          return
       }
       console.log('File data:', data);
       let notes = JSON.parse(data);

      notes.splice(req.params.id, 1);
   
      let notesJSON = JSON.stringify(notes);
    
      fs.writeFile(path.join(db, 'db.json'), notesJSON, (err) => {
         if (err) {
            return console.log(err);
         }
         // this is console logging
         console.log("Success!", notesJSON);
         return notesJSON;
      });
   })
});
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
 });
 