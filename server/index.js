if(typeof window === 'undefined'){
    global.window = {}
}

const express = require('express');
const SSR = require('../dist/search-server.js');
const { renderToString } = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const app = express();
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('./data.json')


const server = (port) =>{
    
    app.use(express.static(path.join(__dirname, '../dist')))
    // 资源权限设置
    app.get('/search' , (req,res) =>{
        const html = renderMarkUp(renderToString(SSR))
        res.status(200).send(html)
    })

    app.listen(port ,()=>{
        console.log('at'+port)
    })

}

server(process.env.PORT||3000)

const renderMarkUp = (str) =>{
    const dataStr = JSON.stringify(data)
    return template.replace('<!-- html-placeholder -->',str)
                   .replace('<!-- initial-data-placeholder -->',`<script>window.__initial_data=${dataStr}</script>`)
}