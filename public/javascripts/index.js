
// import textToSpeech from '@google-cloud/text-to-speech'

const textExample = "Our inventions change the world, and the reinvented world changes us. Human life on Earth today looks radically different from just a century ago, thanks in good part to technologies invented in the intervening years. Once firmly earthbound, with only legs and wheels to carry us on land and ships to cross the waters, we have now taken to flight in droves, with more than eight million passengers criss-crossing continents each day in a few airborne hours. If Rich-ard Branson, found of Virgin Galactic, achieves his dream of building the world's first commercial ordinary people may soon become astronauts. Communication, too, has broken free from shackles of time and distance. When I left India in the mid-1950s, it took three weeks for letters to go back and forth from Kolkata, where I was born, to Scarsdale, New York, where my family first settled. Mail would not arrive reliably. Stamps would be stolen and packages not delivered. Today, an electronic message sent at night from the eastern United States brings an instant reply from a friend in Europe or Asia whose day is just beginning. Facebook connects more than a billion users worldwide with a single mouse click or two. Last but not least, we have cracked the secrets of living";

async function init() {
  await loadIdentity();
}
// Import other required libraries
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// export function playAudio() {
//     // The text to synthesize
//     var msg = new SpeechSynthesisUtterance();
//     //msg.text = "Our inventions change the world, and the reinvented world changes us. Human life on Earth today looks radically different from just a century ago, thanks in good part to technologies invented in the intervening years. Once firmly earthbound, with only legs and wheels to carry us on land and ships to cross the waters, we have now taken to flight in droves, with more than eight million passengers criss-crossing continents each day in a few airborne hours. If Rich-ard Branson, found of Virgin Galactic, achieves his dream of building the world's first commercial ordinary people may soon become astronauts. Communication, too, has broken free from shackles of time and distance. When I left India in the mid-1950s, it took three weeks for letters to go back and forth from Kolkata, where I was born, to Scarsdale, New York, where my family first settled. Mail would not arrive reliably. Stamps would be stolen and packages not delivered. Today, an electronic message sent at night from the eastern United States brings an instant reply from a friend in Europe or Asia whose day is just beginning. Facebook connects more than a billion users worldwide with a single mouse click or two. Last but not least, we have cracked the secrets of living";
//     msg.text = textExample;
//     console.log('msg: ', msg)
//     window.speechSynthesis.speak(msg);
// }



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  
  //header
  //file uploader
    //description
    //File accepter
      //Big image plane
      //Button to accept file input
  //Preview of accepted file (?)
  //Button to download file
  //Button to play audio
  //Button to download audio file (?)

  //send request to get text of the file
  // if the request exists (if text exists), render text of the file
  
});

function display() {
  document.getElementById("main").appendChild(textExample);
}


/* 
    <div class="button-wrap">
      <label class="button" for="pdf">Upload PDF you wish to convert to audio:</label>
      <input type="file" id="pdf" accept="application/pdf"/>
    </div>
    <input id="input" type="submit" onclick="display()">
*/