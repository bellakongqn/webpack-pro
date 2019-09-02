// document.write('Hello Search')

import React from 'react'
import ReactDom from 'react-dom'
import img from './images/array.jpg'
import './index.less'

class SearchBar extends React.PureComponent{
    render(){
        return(
           <div className="red">
               fdsff<img src={img}/>
           </div>
        )
    }
}

ReactDom.render(
    <SearchBar />,
    document.getElementById('root')
)