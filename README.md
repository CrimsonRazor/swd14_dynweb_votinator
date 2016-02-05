#Votinator
Last modified: 05.02.2016
##Authors
- Robert Petrov
- Richard Raumberger

##Prerequesites
- Installed and setup MongoDB

##How to install
- Run 'npm install' in votinator directory
- Optional: Configure votinator using 'config/env/default.js' and 'config/env/production.js'. Set environment variable NODE_ENV to 'production'.
- Start app by running 'server.js' with NodeJS. (Default port: 3000)

##Features
- User registration (double-optin), login, logout
- User groups (user, admin)
- CRUD operations for polls (votings)
- Vote and Devote on polls
- Create recurring polls
- Create multiple-choice polls
- Create dynamic answers using scripts
###Admin only
- Manage Users
- Approve dynamic scripts

##Notes to dynamic scripting
All dynamic scripts of a voting must be approved by the administrator, before the poll's scripts are evaluated.

