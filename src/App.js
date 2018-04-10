import React, {Component} from 'react';
import {Button, Input, Label, Dropdown} from 'semantic-ui-react'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

let RoleOptions = {
    Undergraduate_Student: 0,
    Graduate_Student: 1,
    Transfer_Student: 2,
    Prospective_Student: 3
};

const roleOptions = [
    {text: "Undergraduate Student", value: RoleOptions.Undergraduate_Student},
    {text: "Graduate Student", value: RoleOptions.Graduate_Student},
    {text: "Transfer Student", value: RoleOptions.Transfer_Student},
    {text: "Prospective Student", value: RoleOptions.Prospective_Student}
];

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
        this.roleText = "Undergraduate Student";

        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.updateRole = this.updateRole.bind(this);
    }

    // API TOKEN
    //AIzaSyBpXIM30QZZ3vaNakuU0oiYwRl9hMBIFps (Shivan's)
    //AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE (Harpreet's)

    // CX TOKEN
    // 010701151667155428281:junz-utdbgg (Shivan's)
    // 008731622318034957631:wtj28fwp1ew (Harpreet's)

    render() {
        let headerFrame =
            <div>
                <Input placeholder='Search...'
                       onChange={this.updateSearchQuery}
                       size='big'/>
                <Button size='big' onClick={this.fetchResults}>Submit</Button>
                <Dropdown placeholder='Role'
                          selection defaultValue={0}
                          options={roleOptions}
                          onChange={this.updateRole}
                          size={'massive'}/>
            </div>;

        if (this.state.results.length === 0) {
            return this.noResultsFoundTemplate(headerFrame);
        } else {
            return this.resultsFoundTemplate(headerFrame);
        }
    }

    noResultsFoundTemplate(headerFrame) {
        return (
            <div className="mainContainer">
                {headerFrame}
                <div>
                    <Label>No Results to Show</Label>
                </div>
            </div>
        );
    }

    resultsFoundTemplate(headerFrame) {
        return (
            <div className="mainContainer">
                {headerFrame}
                <div>
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
            </div>
        )
    }

    // Event functions
    updateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    fetchResults() {
        console.log('FETCHING DATA');
        let searchQuery = this.searchQuery;
        let roleText = this.roleText;

        let queryUrl = this.roleText + " " + this.searchQuery;
        console.log(queryUrl);
        let encodedQueryUrl = encodeURI(queryUrl);


        // Build the full url here
        let url = this.baseUrl + encodedQueryUrl;

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

    updateRole(e, data) {
        let value = data.value;
        console.log(value);
        this.roleText = roleOptions[value].text;
    }
}

export default App;
