// UI elements.
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const sendForm = document.getElementById('send-form');
const inputField = document.getElementById('input');

// Helpers.
const defaultDeviceName = 'Terminal';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;

const scrollElement = (element) => {
  const scrollTop = element.scrollHeight - element.offsetHeight;

  if (scrollTop > 0) {
    element.scrollTop = scrollTop;
  }
};

const logToTerminal = (message, type = '') => {
  terminalContainer.insertAdjacentHTML('beforeend',
      `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    scrollElement(terminalContainer);
  }
};

// Obtain configured instance.
const terminal = new BluetoothTerminal();

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data) {
  logToTerminal(data, 'in');
  if(data=="good night"){
	  terminal.disconnect();
  }
};

// Override default log method to output messages to the terminal and console.
terminal._log = function(...messages) {
  // We can't use `super._log()` here.
  messages.forEach((message) => {
    logToTerminal(message);
    console.log(message); // eslint-disable-line no-console
  });
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
  terminal.send(data).
      then(() => logToTerminal(data, 'out')).
      catch((error) => logToTerminal(error));
	// if(data='sleep'){
		
	// }
};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {
        deviceNameLabel.textContent = terminal.getDeviceName() ?
            terminal.getDeviceName() : defaultDeviceName;
      });
});

disconnectButton.addEventListener('click', () => {
	event.preventDefault();
  send("sleep");
  terminal.disconnect();
  deviceNameLabel.textContent = defaultDeviceName;
});

// sendForm.addEventListener('submit', (event) => {
  // event.preventDefault();

  // send(inputField.value);

  // inputField.value = '';
  // inputField.focus();
// });

// Switch terminal auto scrolling if it scrolls out of bottom.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight -
      terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});

	$(document).ready(function() {
		$('#settings').on( "click", function() {
			if($('#setting_btns').css('display')!='none'){
				$('#setting_btns').css('display','none');
			}
			else{
				$('#setting_btns').css('display','block');
			}
			  
		});
		
		$('#rotate_right').on( "click", function() {
		  event.preventDefault();
		  send("on");
		});
		$('#rotate_left').on( "click", function() {
		  event.preventDefault();
		  send("off");
		});
		$('#RightP10').on( "click", function() {
		  event.preventDefault();
		  send("r+-10");
		});
		$('#RightD10').on( "click", function() {
		  event.preventDefault();
		  send("r+10");
		});
		$('#LeftP10').on( "click", function() {
		  event.preventDefault();
		  send("l+10");
		});
		$('#LeftD10').on( "click", function() {
		  event.preventDefault();
		  send("l+-10");
		});
		$('#Sleep').on( "click", function() {
		  event.preventDefault();
		  send("sleep");
		  
		 
		  
		});
		$('#Reset').on( "click", function() {
		  event.preventDefault();
		  send("reset");
		});
	});