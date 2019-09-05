'use strict'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin= require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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
        filename: '[name]_[chunkHash:8].js'
    },
    module:{
        rules:[
            // 解析Es6 React
            {test:/.js$/ , use:'babel-loader'},
            // 解析 css
            {test:/.css$/, use:[
                MiniCssExtractPlugin.loader,
                 'css-loader',
                 {
                    loader:'postcss-loader',
                    // 自动补齐css前缀
                    options: {
                       plugins: () => [
                           require('autoprefixer') ({
                                browsers: ['last 2 version', '>1%', 'ios 7']
                                // last 2 version为兼容浏览器最后两个版本。
                           })
                       ]
                   }
                },
                {
                    loader:'px2rem-loader',
                    options:{
                        remUnit: 75,
                        // x2rem-loader 的 remUnit 选项意思是 1rem=多少像素，
                        // 结合 lib-flexible 的方案，我们将 px2remLoader 的 options.remUnit 
                        // 设置成设计稿宽度的 1/10，这里我们假设设计稿宽为 750px
                        remPrecesion:8
                        // px-rem小数点后面的位数
                    }
                }
               ]
            },
            // 解析 less
            {test:/.less$/, use:[
                MiniCssExtractPlugin.loader,
                 'css-loader',
                 'less-loader',
                 {
                     loader:'postcss-loader',
                     options: {
                        plugins: () => [
                            require('autoprefixer') ({
                                overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                            })
                        ]
                    }
                 }
                ]
            },
            // 解析图片等文件
            {test:/.(png|jpg|svg|gif)$/, use:[
                {loader:'file-loader',
                 options:{
                     name:'[name]_[hash:8].[ext]'
                 }}
            ]}
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'[name]_[contentHash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins),
    // 设置打开端口
    devServer: {
        contentBase: './dist',
        compress: true,
        // 配置是否启用 gzip 压缩。boolean 为类型，默认为 false。
        port: 9000,
        hot: true,
        // devServer默认的行为是在发现源代码被更新后会通过自动刷新整个页面来做到实现预览，
        // 开启模块热替换功能后在不刷新整个页面的情况下通过用心模块替换老模块来实现实时预览
        open: true,
        // 在DevServer第一次构建完成时，自动用浏览器打开网页，默认是true
    },
    mode:'production',
    // production自动开启treeShaking

 
}