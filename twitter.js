const Twit = require('twit');
const config = require('./config.js');

const T = new Twit(config);

function sendTweet(tweetText) {
  T.post('statuses/update', { status: `${tweetText}` }, (error) => {
    if (error != null) {
      console.log(`There was an error posting to twitter: ${error}`);
    } else {
      console.log('Tweeted successfully!');
    }
  });
}

function sendUpdate(stats) {
  const {
    latest,
    previous,
    elapsedTime,
    totalTransactions,
    txPerSecond,
    blockTime,
  } = stats;

  if (latest === 0) {
    return;
  }

  const minutes = Math.round((elapsedTime / 60.0) * 100.0) / 100.0;
  let time = `${minutes} minutes`;
  if (minutes > 60) {
    const hours = Math.round((elapsedTime / 3600.0) * 100.0) / 100.0;
    time = `${hours} hours`;
  }

  const avgBlocks = Math.round((totalTransactions / previous) * 100.0) / 100.0;

  let tweetText = `@OntologyNetwork latest block: #${latest}\n\n`;
  tweetText += `Last ${previous} block stats:\n`;
  tweetText += `${time} elapsed\n`;
  tweetText += `${avgBlocks} tx per block\n`;
  tweetText += `${txPerSecond} tx per second\n`;
  tweetText += `${blockTime} sec average block time\n\n`;
  tweetText += 'Source: https://monitor.ryu.games\n\n';
  tweetText += '#ONT #Ontology';

  sendTweet(tweetText);
}

module.exports = {
  sendUpdate,
};
