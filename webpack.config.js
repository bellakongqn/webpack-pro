'use strict'
const path = require('path')

module.exports = {
    entry:{
        index:'./src/index.js',
        search:'./src/searchBar.js'
    },
    output:{
        path:path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module:{
        rules:[
            // 解析Es6 React
            {test:/.js$/ , use:'babel-loader'}
        ]
    },
    mode:'production'

 
}