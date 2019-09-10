// document.write('Hello Search')

import React from 'react'
import ReactDom from 'react-dom'
import img from './images/array.jpg'
import { a } from '../tree-shaking'
import largeNumber from 'large-bella-number'
import {tooth} from '../../common/index'
import './search.css'

if(false){
    a()
}

class SearchBar extends React.PureComponent{

   
        state={
            Text:null
        }

    handleShow = () =>{
        import('./test.js').then((Text) =>[
            this.setState({
                Text:Text.default
            })
        ])

    }


    // import('./component.js')
    // .then((m) => {
    //     // 处理异步加载到的模块m
    // })
    // .catch((err) => {
    //     // 错误处理
    // });
    
    render(){
        const { Text } = this.state
        const result = largeNumber('9999','1')
        return(
           <div className="red" onClick={this.handleShow}>
               {result}
               {Text?<Text />:"hahhaha"}
           </div>
        )
    }
}

ReactDom.render(
    <SearchBar />,
    document.getElementById('root')
)