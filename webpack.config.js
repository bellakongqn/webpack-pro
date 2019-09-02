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
            {test:/.js$/ , use:'babel-loader'},
            // 解析 css
            {test:/.css$/, use:['style-loader', 'css-loader']},
            // 解析 less
            {test:/.less$/, use:['style-loader', 'css-loader','less-loader']},
            // 解析图片等文件
            {test:/.(png|jpg|svg|gif)$/, use:['file-loader']}
        ]
    },
    mode:'production',
    // watch:true, 热更新 与package.json中设置一个即可

 
}