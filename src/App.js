import React, { Component } from 'react';
import { Button, Input, Label } from 'semantic-ui-react'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchQuery: "",
      results: null
    }
    this.updateInputValue = this.updateInputValue.bind(this);
    this.getResults = this.getResults.bind(this)
  }
  //AIzaSyBpXIM30QZZ3vaNakuU0oiYwRl9hMBIFps

  getResults(){
    console.log("here");
    let self = this
    var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBpXIM30QZZ3vaNakuU0oiYwRl9hMBIFps&cx=010701151667155428281:junz-utdbgg&q=" + this.state.searchQuery
    fetch(url, {
      method: 'GET',
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials':true,
        'Access-Control-Allow-Methods':'POST, GET'
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson.items);
      self.setState({
        results: myJson.items,
        searchQuery:"",
      });
    });
    }
  updateInputValue(event){
    this.setState({ searchQuery: event.target.value });
  }
  render() {
    if(this.state.results == null){
    return (
      <div>
      <div>
      <input value={this.state.inputValue} onChange={this.updateInputValue}/>
      <Button className="ui button" role="button" onClick={this.getResults}>submit</Button>
      </div>
      </div>

    );
    }
    else{
      return (
        <div>
        <div>
        <input value={this.state.inputValue} onChange={this.updateInputValue}/>
        <Button className="ui button" role="button" onClick={this.getResults}>submit</Button>
        </div>
        <ul>
          {this.state.results.map((row) => {
            return (
              <li key={row.id}>
                <div>{row.title}</div>
                <div>{row.snippet}</div>
              </li>
            )
          })}
        </ul>
        </div>
        )
    }
  }

}

export default App;
