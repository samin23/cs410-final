// The following imports are required for the code to compile.
import React, {Component} from 'react';
import {Button, Input, Dropdown, Checkbox} from 'semantic-ui-react'
// Make all CSS changes in APP.css to have proper and neat coding style for HTML and React
import './App.css';
import axios from 'axios'

// This const array holds the values for the type of student you are, add more here too add more detailed search
// The value chosen gets appended to the search string when we send the query to googles custom search engine. For example, if one chooses Undergraduate Student from the dropdown, search query will contain "Undergraduate Student" for specific search results
const roleOptions = [
    {text: "None", value: ""},
    {text: "Undergraduate Student", value: "Undergraduate Student"},
    {text: "Graduate Student", value: "Graduate Student"},
    {text: "Transfer Student", value: "Transfer Student"},
    {text: "Prospective Student", value: "Prospective Student"}
];

// This array holds the type of file the user wants to search for
// When the user selects a filetype, we append "type:{filetype}" to the query and then send to googles custom search engine. For instance, if someone chooses "Article", we append "type
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
        //this baseUrl variable holds the intial api call to the custom search engine with the API key and the CX number included
        this.baseUrl =
            "https://www.googleapis.com/customsearch/v1?key=AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE" +
            "&cx=008731622318034957631:wtj28fwp1ew&q=";
        //the following varibles are the ones we use to send the 
        //query once the user selects opitions we build the query with these variables
        this.searchQuery = "";
        this.roleText = "";
        this.filetypesText = "";
        this.excludedWordsText = "";
        this.pdfResultsOnly = false;
        
        //thses bind the functions we have defined below in our program
        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.updateFiletypes = this.updateFiletypes.bind(this);
        this.updateExcludedWords = this.updateExcludedWords.bind(this);
        this.updatePdfResultsOnly = this.updatePdfResultsOnly.bind(this);
    }

    // API TOKENs to use once limit of 100 per day is used since we have free accounts
    //AIzaSyBpXIM30QZZ3vaNakuU0oiYwRl9hMBIFps (Shivan's)
    //AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE (Harpreet's)

    // CX TOKENs for custom search since we using free acccount 100 limit again
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

    // Event functions when the user types into the search box this function updates the state of that 
    //variable so we can have a proper query when we send it to google's api
    updateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }
    
    //this function fetchResults does not take any input but when its called takes the query and appeneds all the additional
    //options the user selected and makes a GET call to Google and on reterival of the search results updates the state of 
    //the page with the resutlts shown
    fetchResults() {
        console.log('FETCHING DATA');
        let searchQuery = this.searchQuery;
        let roleText = this.roleText;
        let filetypesText = this.filetypesText;
        let filetypesQuery = "";
        let excludedWordsQuery = "";
        let pdfResultsOnly = this.pdfResultsOnly;
        let pdfQuery = "";

        if (filetypesText.length > 0) {
            filetypesQuery += "type:" + filetypesText;
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
    // Event functions when the user selects their role this function updates the state of that 
    //variable so we can have a proper query when we send it to google's api
    updateRole(e, data) {
        this.roleText = data.value;
        console.log(this.roleText);
    }
    // Event functions when the user selects what type of file they want to search for
    //this function updates the state of that variable so we can have a proper query when we send it to google's api
    updateFiletypes(e, data) {
        this.filetypesText = data.value;
        console.log(this.filetypesText);
    }
    // Event functions when the user types into words to exclude box function updates the state of that 
    //variable so we can have a proper query when we send it to google's api
    updateExcludedWords(e, data) {
        this.excludedWordsText = data.value;
        console.log(this.excludedWordsText);
    }
    // Event functions when the user selects the pdf file box this function updates the state of that 
    //variable so we can have a proper query when we send it to google's api
    updatePdfResultsOnly(e, data) {
        this.pdfResultsOnly = data.checked;
        console.log(data.checked);
    }
}

export default App;
