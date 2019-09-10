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


const server = (port) =>{
    
    app.use(express.static(path.join(__dirname, '../dist')))
    // 资源权限设置
    app.get('/search' , (req,res) =>{
        // const html = renderMarkUp(renderToString(SSR))
        const html = template.replace('<!-- html-placeholder -->', renderToString(SSR));
        res.status(200).send(html)
    })

    app.listen(port ,()=>{
        console.log('at'+port)
    })

}

server(process.env.PORT||3000)

const renderMarkUp = (str) =>{
    return template.replace('<!-- html-placeholder -->',str)
}