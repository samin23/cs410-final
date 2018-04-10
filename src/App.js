import React, {Component} from 'react';
import {Button, Input, Label, Dropdown} from 'semantic-ui-react'
import './App.css';
import axios from 'axios'

const roleOptions = [
    {text: "Undergraduate Student", value: "Undergraduate Student"},
    {text: "Graduate Student", value: "Graduate Student"},
    {text: "Transfer Student", value: "Transfer Student"},
    {text: "Prospective Student", value: "Prospective Student"}
];

const filetypeOptions = [
    { text: 'Article', value: 'article' },
    { text: 'Basic Page', value: 'basic_page' },
    { text: 'Book Page', value: 'book_page' },
    { text: 'Carousel', value: 'carousel' },
    { text: 'Events', value: 'events' },
    { text: 'Faculty Profile', value: 'faculty_profile' },
    { text: 'Memoriam', value: 'memoriam' },
    { text: 'News', value: 'news' },
    { text: 'Webform', value: 'webform' },
    { text: 'Welcome', value: 'welcome' },
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
        this.filetypes = [];

        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.updateFiletypes = this.updateFiletypes.bind(this);
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
                          selection defaultValue="Undergraduate Student"
                          options={roleOptions}
                          onChange={this.updateRole}
                          size='massive'/>
                <Dropdown placeholder='File Type'
                            fluid multiple selection
                            size='massive'
                            options={filetypeOptions}
                            onChange={this.updateFiletypes}/>
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
        let filetypes = this.filetypes;
        let filetypesQuery = "";

        if (filetypes.length > 0) {
            filetypesQuery += "type:";
            for (let i = 0; i < filetypes.length - 1; i++) {
                filetypesQuery += filetypes[i] + ",";
            }
            filetypesQuery += filetypes[filetypes.length-1];
        }

        let queryUrl = roleText + " " + searchQuery + " " + filetypesQuery;
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
        this.roleText = data.value;
        console.log(this.roleText);
    }

    updateFiletypes(e, data) {
        this.filetypes = data.value;
        console.log(this.filetypes);
    }
}

export default App;
