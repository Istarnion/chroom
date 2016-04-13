# CHRoom
A simple web app for chatting about topics you care about with strangers you don't care (as much) about :)

# Dependencies
-node.js and npm

# building
To build the project (actually, install the deps..)

'''sh
cd server
npm install
cd ../client
npm install
'''

# running
'''sh
cd server
node server.js
'''

if you are on a debian-based OS, such as Ubuntu, make yourself an alias like this first:
'''sh
alias node="nodejs"
'''

But if you really want, you can run it by just
'''sh
cd server
nodejs server.js
'''

However, I will recomend installing and using nodemon. nodemon will detect changes in your files and restart the server when needed.
'''sh
npm install -g nodemon
'''
Note that npm with -g may require sudo.

