// The following imports are required for the code to compile.
import React, {Component} from 'react';
import {Button, Input, Dropdown, Checkbox} from 'semantic-ui-react'
// Make all CSS changes in APP.css to have proper and neat coding style for HTML and React
import './App.css';
import axios from 'axios'

// This const array holds the values for the type of student you are, add more here
// too add more detailed search. The value chosen gets appended to the search string
// when we send the query to google's custom search engine. For example,
// if one chooses Undergraduate Student
// from the dropdown, search query will contain "Undergraduate Student"
// for specific search results.
const roleOptions = [
    {text: "None", value: ""},
    {text: "Undergraduate Student", value: "Undergraduate Student"},
    {text: "Graduate Student", value: "Graduate Student"},
    {text: "Transfer Student", value: "Transfer Student"},
    {text: "Prospective Student", value: "Prospective Student"}
];

// This array holds the type of file the user wants to search for
// When the user selects a filetype, we append "type:{filetype}" to the
// query and then send to googles custom search engine. For instance, if
// someone chooses "Faculty Profile", we append "type:faculty_profile" to the search query.
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

// This is the definition of the class that contains the JavaScript code.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };

        // This baseUrl variable holds the initial api call to the custom
        // search engine with the API key and the CX number included.
        // We obtained these numbers after going to Google Custom Search
        // on the web and creating our own custom search box there.
        this.baseUrl =
            "https://www.googleapis.com/customsearch/v1?key=AIzaSyC2ZX4EB6SH1HpWSt9U_wloNBoCAXMw6PE" +
            "&cx=008731622318034957631:wtj28fwp1ew&q=";

        // The following variables are the ones we use to build the
        // custom search query. Once the user selects options we build the query
        // with these variables.
        this.searchQuery = "";
        this.roleText = "";
        this.filetypesText = "";
        this.excludedWordsText = "";
        this.pdfResultsOnly = false;
        
        // These bind the functions we have defined below in our program.
        // They are required since in order for the event handler to catch the
        // event, one needs to bind these methods in react.
        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.fetchResults = this.fetchResults.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.updateFiletypes = this.updateFiletypes.bind(this);
        this.updateExcludedWords = this.updateExcludedWords.bind(this);
        this.updatePdfResultsOnly = this.updatePdfResultsOnly.bind(this);
    }
    
    // This render function basically contains all the HTML code to layout the
    // webpage. The className are used for CSS styling and the code for CSS
    // styling can be found in the App.css file.
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

    // In general this function is called when a user clicks the submit button for search.
    // It fetches the results after building the search query based on the currently
    // selected values in the input boxes and the dropdowns.
    fetchResults() {
        console.log('FETCHING DATA');
        let searchQuery = this.searchQuery;
        let roleText = this.roleText;
        let filetypesText = this.filetypesText;
        let filetypesQuery = "";
        let excludedWordsQuery = "";
        let pdfResultsOnly = this.pdfResultsOnly;
        let pdfQuery = "";

        // If filetype is selected, add that to the query
        if (filetypesText.length > 0) {
            filetypesQuery += "type:" + filetypesText;
        }

        // Add excluded words to the query in a loop because
        // there can be many space separated words to be exluded
        let excludedWords = this.excludedWordsText.split(" ");
        if (this.excludedWordsText.length > 1 && excludedWords.length > 0) {
            excludedWords.forEach(function (excludedWord) {
                excludedWordsQuery += "-" + excludedWord + " ";
            });
        }

        // If pdf only results is selected, add "filetype:pdf" to the queryUrl
        if (pdfResultsOnly) {
            pdfQuery = "filetype:pdf";
        }

        // Build the actual query url for the options selcted here finally
        let queryUrl = roleText + " " + searchQuery +
            " " + filetypesQuery + " " + excludedWordsQuery + " " + pdfQuery;
        console.log(queryUrl);

        // Encode the url in proper format.
        let encodedQueryUrl = encodeURI(queryUrl);

        // Build the the fetch url here by adding base url to custom url.
        let url = this.baseUrl + encodedQueryUrl;

        // This is where the GET called is made to fetch the items.
        // Once they are fetched, we update the state which calls the
        // render function to display them on the site.
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

    // This function is called when the user types into the search box.
    // Once the user enter a search query, this function updates the state of that
    // variable so we can have a proper query when we send it to google's api
    updateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    // This function is called when the user selects their role. It then
    // updates the roleText variable so we can append it to our query when
    // we send it to google's api.
    updateRole(e, data) {
        this.roleText = data.value;
        console.log(this.roleText);
    }

    // This function is called when the user selects a certain filetype. It then
    // updates the filetypesText variable so we can append it to our query when
    // we send it to google's api.
    updateFiletypes(e, data) {
        this.filetypesText = data.value;
        console.log(this.filetypesText);
    }

    // This function is called when the user enters space separated words to exclude. It then
    // updates the excludedWordsText variable so we can append it to our query when
    // we send it to google's api.
    updateExcludedWords(e, data) {
        this.excludedWordsText = data.value;
        console.log(this.excludedWordsText);
    }

    // This function is called when the user selects if they only want pdf results. It then
    // updates the pdfResultsOnly boolean variable so we can append the right
    // text to our query when we send it to google's api.
    updatePdfResultsOnly(e, data) {
        this.pdfResultsOnly = data.checked;
        console.log(data.checked);
    }
}

export default App;
