const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin= require('optimize-css-assets-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')


const setMPA = () => {

    const entry = {};
    const htmlWebpackPlugins =[];

    const entryFiles = glob.sync(path.join(__dirname,'./src/*/index-server.js'))

    

    Object.keys(entryFiles).map(( index ) => {
        const entryFile = entryFiles[index]
        // D:/My/webpack-pro/src/index/index.js
        // D:/My/webpack-pro/src/search/index.js
        const match = entryFile.match(/src\/(.*)\/index-server\.js/)
        const pageName = match && match[1]

        if(pageName){
            entry[pageName] = entryFile

            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template:path.join(__dirname,`src/${pageName}/index.html`),
                    filename:`${pageName}.html`,
                    chunks:['common',pageName],
                    inject:true,
                    minify:{
                        html5:true,
                        collapseWhitespace:true,
                        preserveLineBreaks:false,
                        minifyCSS:true,
                        minifyJS:true,
                        removeComments:false,
                    }
                }),
            )
        }
        // index
        // search
       
        
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
        filename: '[name]-server.js',
        libraryTarget:"umd"
    },
    module:{
        rules:[
            // 解析Es6 React
            {test:/.js$/ , use:['babel-loader']},
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
        new CleanWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                  module: 'react',
                  entry: 'https://unpkg.com/react@16.9.0/umd/react.production.min.js',
                  global: 'React',
                },
                {
                    module: 'react-dom',
                    entry: 'https://unpkg.com/react-dom@16.9.0/umd/react-dom.production.min.js',
                    global: 'ReactDOM',
                }
            ]
        })
    ].concat(htmlWebpackPlugins),
    // devtool:"inline-source-map",
    // eval 不生成单独得soucreMap文件，sourceMapn被包裹在js文件里面eval()
    // source-map 生成单独的.map文件 js底部 //# sourceMappingURL=index_eed7159b.js.map
    // inline-source-map map与js文件在一起 ，底部展示map文件信息
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
    optimization:{
        // 提取react react-dom
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /(react|react-dom)/,
        //             name: 'vendors',
        //             chunks: 'all'
        //         }
        //     }
        // }
        // 提取公共模块
        splitChunks:{
            minSize:0,
            // 文件大小
            cacheGroups:{
                commons:{
                    name:'common',
                    chunks:'all',
                    minChunks:4,
                    // 至少引用几次
                }
            }
        }
    },
    mode:'production',
    // production自动开启treeShaking  scopeHoisting

 
}