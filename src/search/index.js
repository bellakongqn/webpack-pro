// document.write('Hello Search')

import React from 'react'
import ReactDom from 'react-dom'
import img from './images/array.jpg'
import { a } from '../tree-shaking'
import {tooth} from '../../common/index'
import './search.css'

if(false){
    a()
}

class SearchBar extends React.PureComponent{
    render(){
        return(
           <div className="red">
               dfv
           </div>
        )
    }
}

ReactDom.render(
    <SearchBar />,
    document.getElementById('root')
)