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

function secondsToHms(sec) {
  const d = Number(sec);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 3600 % 60);

  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = `${m} ${(m === 1 ? 'minute' : 'minutes')} and `;
  const sDisplay = `${s} ${(s === 1 ? 'second' : 'seconds')}`;
  return `${hDisplay}${mDisplay}${sDisplay}`;
}

function sendNetworkUpdate(stats) {
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

  const elapsedText = secondsToHms(elapsedTime);
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
  sendNetworkUpdate,
};
