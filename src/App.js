import React, {Component} from 'react';
import {Button, Input, Label} from 'semantic-ui-react'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };

        this.baseUrl =
            "https://www.googleapis.com/customsearch/v1?key=AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE" +
            "&cx=008731622318034957631:wtj28fwp1ew&q=";
        this.searchQuery = "";

        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
    }

    // API TOKEN
    //AIzaSyBpXIM30QZZ3vaNakuU0oiYwRl9hMBIFps (Shivan's)
    //AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE (Mine)


    updateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    fetchResults() {
        let url = this.baseUrl + this.searchQuery;

        axios.get(url)
            .then((response) => response.data.items)
            .then((responseData) => {
                if (responseData !== undefined) {
                    console.log(responseData.length + ' results found');

                    // responseData.forEach(function(response) {
                    //     console.log("Title: " + response.title);
                    //     console.log("Snippet: " + response.snippet);
                    //     console.log("\n");
                    // });

                    console.log(responseData);
                    this.setState({
                        results: responseData
                    });
                } else {
                    console.log('no results found');

                    this.setState({
                        results: []
                    });
                }
            });
    }

    render() {
        if (this.state.results.length === 0) {
            return this.noResultsFoundTemplate();
        } else {
            return this.resultsFoundTemplate();
        }
    }

    noResultsFoundTemplate() {
        return (
            <div>
                <input value={this.state.inputValue}
                       onChange={this.updateSearchQuery}/>
                <Button className="ui button"
                        role="button"
                        onClick={this.fetchResults}>Submit</Button>
                <Label>No Results Found</Label>
            </div>
        );
    }

    resultsFoundTemplate() {
        return (
            <div>
                <div>
                    <input value={this.state.inputValue}
                           onChange={this.updateSearchQuery}/>
                    <Button className="ui button"
                            role="button"
                            onClick={this.fetchResults}>Search</Button>
                </div>
                <ul>
                    {
                        this.state.results.map((row) => {
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

export default App;
