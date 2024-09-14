const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const WebSocket = require('ws');

let rl;

function createInterface() {
  rl = readline.createInterface({ input, output });
  rl.setPrompt('> ');
}

function printMessage(message) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  console.log(message);
  rl.prompt(true);
}

function showMainMenu() {
  console.log('1. Enter your name\n2. Exit\n');
  rl.question('Choose an option: ', handleMainMenuChoice);
}

function handleMainMenuChoice(choice) {
  switch (choice) {
    case '1':
    case '1.':
      handleLogin();
      break;
    case '2':
    case '2.':
      rl.close();
      break;
    default:
      console.log('Invalid choice. Please try again.');
      showMainMenu();
  }
}

function handleLogin() {
  rl.question('Name: ', (name) => {
    (`Logged in as ${name}`);
      connectToSocket(name);
    });
}

function handleSignup() {
  rl.question('Enter your name: ', (name) => {
    rl.question('Enter your email: ', (email) => {
      rl.question('Enter password: ', (password) => {
        rl.question('Confirm password: ', (cpassword) => {
          if (password === cpassword) {
            console.log('Account created successfully');
            showMainMenu();
          } else {
            console.log('Passwords do not match. Please try again.');
            handleSignup();
          }
        });
      });
    });
  });
}

function connectToSocket(name) {
  const ws = new WebSocket('ws://localhost:8080');

  ws.on('open', () => {
    console.log('Connected to WebSocket server');
    console.log('Enter message to send (or type "exit" to quit):');
    startChatLoop(ws, name);
  });

  ws.on('message', (data) => {
    const message = data.toString();
    if (message === 'EXIT_SIGNAL') {
      console.log('The other user has ended the session.');
      ws.close();
    } else if (!message.startsWith(`${name}:`)) {
      printMessage(message);
    }
  });

  ws.on('close', () => {
    console.log('Disconnected!!!');
    rl.close();
    process.exit(0);
  });

  ws.on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
}

function startChatLoop(ws, name) {
  rl.prompt();
  
  rl.on('line', (msg) => {
    if (msg.toLowerCase() === 'exit') {
      console.log('Ending the session...');
      ws.send('EXIT_SIGNAL');
      ws.close();
    } else {
      const fullMessage = `${name}: ${msg}`;
      ws.send(fullMessage);
      printMessage(fullMessage);
    }
  });
}

createInterface();
showMainMenu();
