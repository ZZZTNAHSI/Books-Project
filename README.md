Yo Yo Yo this is the awesome sauce book review webpage fleshed out with front end, back end and dbs

REQUIRED TECHNOLOGIES: postgres, pgadmin (if you know how to query postgres in cli than thats find), node.js, npm, git

Steps to pull this:
1. make a folder and run this in git `git clone https://github.com/ZZZTNAHSI/Books-Project.git`
2. run `npm i ` to install dependencies
3. make a database in pgadmin called "zaBooks". You can either now make a table, call it books and insert the values using the website itself (which might not work i didnt check if the website worked if there were no books) or copy the code from values.sql (which i also didn't check if the script worked)
4. to run the website write `node index.js` into the terminal 


You can check out the index.js file which has comments on what im doing, also im using the bookcover api to render the images, although im not using axios.

This is the api: https://openlibrary.org/dev/docs/api/covers

