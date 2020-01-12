const Twit = require('twit');
const config = require('../config.js');
const staking = require('./staking.js');

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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function sendStakingInfo() {
  staking.getStakeInfo()
    .then((res) => {
      const {
        totalStake,
        foundationStake,
      } = res;

      const total = 1000000000;
      let stakePerentage = totalStake / total * 100.0;
      stakePerentage = (Math.round(stakePerentage * 100) / 100).toFixed(2);

      let tweetText = '#ONT (@OntologyNetwork) staking update\n\n';
      tweetText += `There is currently ${numberWithCommas(totalStake)} ONT staked\n`;
      tweetText += `${numberWithCommas(foundationStake)} ONT is staked in Ontology Foundation nodes\n`;
      tweetText += `${numberWithCommas(totalStake - foundationStake)} ONT is staked in community run nodes\n`;
      tweetText += `${stakePerentage}% of the total supply is staked\n`;

      sendTweet(tweetText);
    })
    .catch((err) => {
      console.log(`Failed to load the staking info: ${err.message}`);
    });
}

function sendNodeInfo() {
  staking.getStakeInfo()
    .then((res) => {
      const {
        nodes,
        nodeCount,
        foundationNodes,
      } = res;

      let tweetText = '#ONT (@OntologyNetwork) node info\n\n';
      tweetText += `There are currently ${nodeCount} CN nodes\n`;
      tweetText += `${nodeCount - foundationNodes} are community run nodes\n`;

      let first = nodes[Math.floor(Math.random() * nodeCount)];
      while (first.name === 'Unknown Node') {
        first = nodes[Math.floor(Math.random() * nodeCount)];
      }

      let second = nodes[Math.floor(Math.random() * nodeCount)];
      while (second.name === first.name || second.name === 'Unknown Node') {
        second = nodes[Math.floor(Math.random() * nodeCount)];
      }

      let third = nodes[Math.floor(Math.random() * nodeCount)];
      while (second.name === third.name || first.name === third.name || third.name === 'Unknown Node') {
        third = nodes[Math.floor(Math.random() * nodeCount)];
      }

      tweetText += `${first.name} has ${first.totalStake} ONT staked\n`;
      tweetText += `${second.name} has ${second.totalStake} ONT staked\n`;
      tweetText += `${third.name} has ${third.totalStake} ONT staked\n`;

      sendTweet(tweetText);
    })
    .catch((err) => {
      console.log(`Failed to load the node info: ${err.message}`);
    });
}

module.exports = {
  sendNetworkUpdate,
  sendStakingInfo,
  sendNodeInfo,
};
