const path = require("path")
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry:path.join(__dirname,'./src/main.js'),
    output: {
        path:path.join(__dirname,"./dist"),
        filename:"bundle.js",
    },
    devServer:{
        host:'127.0.0.1',
        open:true,
        port:3700, 
    },
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"index.html"
        })
    ],
    module:{
        rules:[
            // 记得排除 node_module
            {test:/\.js$/,use:['babel-loader'],exclude:/node_module/},
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.less$/,use:['style-loader','css-loader',"less-loader"]},
            {test:/\.scss$/,use:['style-loader','css-loader',"sass-loader"]},
            {test:/\.vue$/,use:["vue-loader"]},
            {test:/\.(jpg|png|jpeg|gif)$/,use:['url-loader']},
            {test:/\.(ttf|eot|svg|woff|woff2)$/,use:['url-loader']} // url-loader可以用来处理字体
        ]
    }
}