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
<code>/registration_point/X</code>
2) Activity
<code>/activity/X</code>
3) List of Top
<code>/topten</code>
4) Admin panel with table of users for edit
<code>/adminpanel</code>


5) Emulation of red rfid card by reader
<code>/reader/:readerId/:rfid</code>
