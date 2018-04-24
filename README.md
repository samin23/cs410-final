1) An overview of the function of the code (i.e., what it does and what it can be used for). 
	
We wrote a React web application that will benefit members of the computer science department that are looking to search through the cs.illinois page with advanced search functionality (i.e. what type of student, words to exclude, and what type of page they are searching for). Our code takes all the user input from the page, the search terms, the words to exclude, etc and then makes an API call to Google’s server with those specific request and only ask for results with cs.illinois.edu. This API call is possible because we we set up a search engine on the backend with Google and they provided us with a CX code and an API key to use. Our application is useful as it provides a specialized search service for different people. For example, our search interface can help students who are interested in applying for graduate programs in the department to limit their searches only to what they are looking for instead of having to go through entire cs.illinois.edu website.



2) Documentation of how the software is implemented with sufficient detail so that others can have a basic understanding of your code for future extension or any further improvement. 

Added into the App.js file and App.css file present in the src directory.


3) Documentation of the usage of the software including either documentation of usages of APIs or detailed instructions on how to install and run a software, whichever is applicable. 

1. Clone the code using the command "git clone git@github.com:samin23/cs410-final.git"
2. cd into the main directory using the command "cd cs410-final/"
3. Enter the following command to intstall npm files "npm install"
4. Enter the command "npm start" to start the project
5. Open browser and go to the following address to use the site "http://localhost:3000/"

API Code is include included in code comments ( https://developers.google.com/custom-search/docs/start)
	

4) Brief description of contribution of each team member in case of a multi-person team.

50% of the work done by Harpreet: Added all the advanced functionality buttons, restructured the code, added documentation for the code and also the readme file.
	
50% of the work done by Shivan: Set up google custom search, got api key, setup initial website with google api call, redesigned the UI and also added documentation.
	
Overall, both of us evenly shared the work and got the project done that far exceeded our initial thoughts with a layout easy for anyone to use.

