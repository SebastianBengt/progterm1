const express = require('express')
const app = express()

let rocks = [
"pumice",
"granite",
"sandstone",
"coal",
"marble",
"slate",
]
app.get('/', function(req, resp){
  resp.send('Hello world')
})

app.get('/rock/random', function(req, resp){
    let rock_number = Math.floor(Math.random()*rocks.length) 
    let rock = rocks[rock_number]
    resp.send(rock)
  })
  

app.get('/random/:max', function(req, resp){
    let max = parseInt(req.params.max)
    let rand = Math.floor(Math.random()*max) +1
    console.log('Max via url is ' + max + ' rand is ' + rand)
    resp.send('' + rand)
  })
  
  app.get('/r', function(req, resp){
    max = parseInt(req.query.max)
    rand = Math.floor(Math.random()*max) +1
    console.log('Max via query is ' + max + ' rand is ' + rand)
    resp.send('' + rand)
  })

app.listen(8090)