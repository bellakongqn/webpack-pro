'use strict'
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const  { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const setMPA = () => {

    const entry = {};
    const htmlWebpackPlugins =[];

    const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'))

    

    Object.keys(entryFiles).map(( index ) => {
        const entryFile = entryFiles[index]
        // D:/My/webpack-pro/src/index/index.js
        // D:/My/webpack-pro/src/search/index.js
        const match = entryFile.match(/src\/(.*)\/index\.js/)
        const pageName = match && match[1]
        // index
        // search
        entry[pageName] = entryFile

        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template:path.join(__dirname,`src/${pageName}/index.html`),
                filename:`${pageName}.html`,
                chunks:[pageName],
                inject:true,
                minify:{
                    html5:true,
                    collapseWhitespace:true,
                    preserveLineBreaks:false,
                    minifyCSS:true,
                    minifyJS:true,
                    removeComments:true,
                }
            }),
        )
        
    })

    return {
        entry,
        htmlWebpackPlugins
    }

}

const { entry ,htmlWebpackPlugins} = setMPA()

module.exports = {
    entry:entry,
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
            {test:/.(png|jpg|svg|gif)$/, use:[
                {loader:'file-loader',
                 options:{
                     name:'img/[name].[ext]'
                 }}
            ]}
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'[name].css'
        }),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ].concat(htmlWebpackPlugins),
    // 设置打开端口
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        // 配置是否启用 gzip 压缩。boolean 为类型，默认为 false。
        port: 9000,
        hot: true,
        // devServer默认的行为是在发现源代码被更新后会通过自动刷新整个页面来做到实现预览，
        // 开启模块热替换功能后在不刷新整个页面的情况下通过用心模块替换老模块来实现实时预览
        open: true,
        // 在DevServer第一次构建完成时，自动用浏览器打开网页，默认是true
    },
    devtool:"inline-source-map",
    stats: 'errors-only',
    performance: {
        hints:false   
    },
    mode:'development',

 
}