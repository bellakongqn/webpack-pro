// document.write('Hello Search')

const  React = require('react')
const largeNumber = require ('large-bella-number')
require ('./search.css')

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

module.exports = <SearchBar />