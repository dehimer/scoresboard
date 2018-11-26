<b>How to install</b>
1. At first install mongodb
2. Install packages with <code>npm i</code> command

<b>How to create and run build:</b>

<code>npm run build</code>

<code>npm start</code>


<b>How to run as dev:</b>

<code>npm run dev</code>

Dont forget to run mongod!

<hr>
<b>How to run as windows service:</b>

1) make build:
<code>npm run build</code>
2) run cmd console as admin and execute command in directory:
<code>npm run install-windows-service</code>
3) find and start scoresboard service in services list of windows

<hr>
<b>Pages (on localhost:3000):</b>

1) Register new player or get ID for registered: 
<code>/registration</code>
2) Set Scores for player by its ID 
<code>/game</code>
3) Set tournament number:
<code>/settournament</code>
4) Admin panel with table of users for edit
<code>/adminpanel</code>
5) Shot List of Top
<code>/table</code>
6) Full List of Top
<code>/table-full</code>


TODO:
1) Fill config file
