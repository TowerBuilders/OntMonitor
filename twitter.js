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

  const seconds = elapsedTime;
  let elapsedText = '';
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const secSuffix = sec === 1 ? 'second' : 'seconds';
    const minSuffix = minutes === 1 ? 'minute' : 'minutes';
    elapsedText = `${minutes} ${minSuffix} and ${sec} ${secSuffix}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    const secSuffix = sec === 1 ? 'second' : 'seconds';
    const minSuffix = minutes === 1 ? 'minute' : 'minutes';
    const hrSuffix = hours === 1 ? 'hour' : 'hours';
    elapsedText = `${hours} ${hrSuffix}, ${minutes} ${minSuffix} and ${sec} ${secSuffix}`;
  }

  const avgBlocks = Math.round((totalTransactions / previous) * 100.0) / 100.0;

  let tweetText = `#ONT (@OntologyNetwork) latest block: #${latest}\n\n`;
  tweetText += `Last ${previous} block stats:\n`;
  tweetText += `${elapsedText} elapsed\n`;
  tweetText += `${avgBlocks} tx per block\n`;
  tweetText += `${txPerSecond} tx per second\n`;
  tweetText += `${blockTime} sec average block time\n\n`;

  sendTweet(tweetText);
}

module.exports = {
  sendUpdate,
};
