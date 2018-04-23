import React, {Component} from 'react';
import {Button, Input, Dropdown, Checkbox} from 'semantic-ui-react'
import './App.css';
import axios from 'axios'

const roleOptions = [
    {text: "None", value: ""},
    {text: "Undergraduate Student", value: "Undergraduate Student"},
    {text: "Graduate Student", value: "Graduate Student"},
    {text: "Transfer Student", value: "Transfer Student"},
    {text: "Prospective Student", value: "Prospective Student"}
];

const filetypeOptions = [
    {text: "None", value: ""},
    {text: 'Article', value: 'article'},
    {text: 'Basic Page', value: 'basic_page'},
    {text: 'Book Page', value: 'book_page'},
    {text: 'Carousel', value: 'carousel'},
    {text: 'Events', value: 'events'},
    {text: 'Faculty Profile', value: 'faculty_profile'},
    {text: 'Memoriam', value: 'memoriam'},
    {text: 'News', value: 'news'},
    {text: 'Webform', value: 'webform'},
    {text: 'Welcome', value: 'welcome'},
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
        this.roleText = "";
        this.filetypes = [];
        this.excludedWordsText = "";
        this.pdfResultsOnly = false;

        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.updateFiletypes = this.updateFiletypes.bind(this);
        this.updateExcludedWords = this.updateExcludedWords.bind(this);
        this.updatePdfResultsOnly = this.updatePdfResultsOnly.bind(this);
    }

    // API TOKEN
    //AIzaSyBpXIM30QZZ3vaNakuU0oiYwRl9hMBIFps (Shivan's)
    //AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE (Harpreet's)

    // CX TOKEN
    // 010701151667155428281:junz-utdbgg (Shivan's)
    // 008731622318034957631:wtj28fwp1ew (Harpreet's)

    render() {
        return (
            <div className="mainContainer">
                <div className="header">
                    <div className="inner">
                        <Input icon='search' className="searchInput" onChange={this.updateSearchQuery}
                               placeholder='Search...'/>
                        <Button onClick={this.fetchResults} type='submit'>Search</Button>
                    </div>
                    <div className="quotesContainer">
                        <div className="quotesItem">
                            <div className="center">
                                <Input placeholder='Exclude Words'
                                       onChange={this.updateExcludedWords}/>
                            </div>
                        </div>
                        <div className="quotesItem">
                            <div className="center">
                                <Dropdown placeholder='File Type'
                                          selection
                                          options={filetypeOptions}
                                          onChange={this.updateFiletypes}/>
                            </div>
                        </div>
                        <div className="quotesItem">
                            <div className="center">
                                <Dropdown placeholder='Role'
                                          selection defaultValue=""
                                          options={roleOptions}
                                          onChange={this.updateRole}/>
                            </div>
                        </div>
                        <div className="quotesItem">
                            <div className="center">
                                <Checkbox
                                    label={<label>PDF Results Only</label>}
                                    onChange={this.updatePdfResultsOnly}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.results.length < 1 &&
                    <h2 align="center" style={{padding: "5px"}}>
                        Enter your query and select Search
                    </h2>
                    }
                </div>
                <div className="linksContainer">
                    {this.state.results.map((row) => {
                        return (
                            <div className="linkContainer" key={row.id}>
                                <div className="titleContainer">
                                    <a href={row.link}>{row.title}</a>
                                </div>
                                <div className="urlContainer">
                                    <a>{row.link}</a>
                                </div>
                                <div className="snippetContainer">
                                    <a>{row.snippet}</a>
                                </div>
                            </div>
                        )
                    })}
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
        let excludedWordsQuery = "";
        let pdfResultsOnly = this.pdfResultsOnly;
        let pdfQuery = "";

        if (filetypes.length > 0) {
            filetypesQuery += "type:";
            for (let i = 0; i < filetypes.length - 1; i++) {
                filetypesQuery += filetypes[i] + ",";
            }
            filetypesQuery += filetypes[filetypes.length - 1];
        }

        let excludedWords = this.excludedWordsText.split(" ");
        if (this.excludedWordsText.length > 1 && excludedWords.length > 0) {
            excludedWords.forEach(function (excludedWord) {
                excludedWordsQuery += "-" + excludedWord + " ";
            });
        }

        if (pdfResultsOnly) {
            pdfQuery = "filetype:pdf";
        }

        let queryUrl = roleText + " " + searchQuery +
            " " + filetypesQuery + " " + excludedWordsQuery + " " + pdfQuery;
        console.log(queryUrl);
        let encodedQueryUrl = encodeURI(queryUrl);


        // Build the full url here
        let url = this.baseUrl + encodedQueryUrl;

        axios.get(url)
            .then((response) => response.data.items)
            .then((responseData) => {
                if (responseData !== undefined) {
                    console.log(responseData.length + ' results found');
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

    updateExcludedWords(e, data) {
        this.excludedWordsText = data.value;
        console.log(this.excludedWordsText);
    }

    updatePdfResultsOnly(e, data) {
        this.pdfResultsOnly = data.checked;
        console.log(data.checked);
    }
}

export default App;
