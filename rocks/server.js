const express = require('express')
const app = express()

app.use(express.static('client'))

let rocks = require("./rocks.json")
const e = require('express')

app.get('/', function(req, resp){
  resp.send('Hello world')
})

app.get('/rock/random', function(req, resp){
    let rock_number = Math.floor(Math.random()*rocks.length) 
    let rock = rocks[rock_number]
    resp.send(rock.name)
  })
  
app.get('/rock/search', function(req, resp) {
    let search_term = req.query.search_term
    let search_results = []
    for (let rock of rocks){
        if(rock.name.includes(search_term)){
            search_results.push(rock)
        }
    }
    resp.send(search_results)
})

app.get('/rock/details/:rock_type', function(req, resp){
    let type = req.params.rock_type
    for (let rock of rocks){
        if(rock.name == type){
            resp.send(rock)
            return
        }
  }
})
app.use(express.static('client'))

/* app.get('/r', function(req, resp){
    max = parseInt(req.query.max)
    rand = Math.floor(Math.random()*max) +1
    console.log('Max via query is ' + max + ' rand is ' + rand)
    resp.send('' + rand)
  })
/*/
app.listen(8090)