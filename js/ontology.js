const ont = require('ontology-ts-sdk');
const twitter = require('./twitter.js');
const tweetConfig = require('./tweetConfig.js');

const {
  RpcClient,
} = ont;

const node = 'http://dappnode1.ont.io:20336';
const rpcClient = new RpcClient(node);

const previous = 1000; // In blocks
const refreshDelay = 1000; // In milliseconds

// Exported Stats
let latest = 0;
let totalTransactions = 0;
let elapsedTime = 0;
let txPerSecond = 0;
let blockTime = 0;
let sinceLastBlock = 0;

const blockDict = {};
const oneMinute = 60 * 1000;

/*

  Gets a block for the height

*/
function getBlock(height) {
  return new Promise((resolve, reject) => {
    if (blockDict[height] != null) {
      resolve(blockDict[height]);
    } else {
      rpcClient.getBlockJson(height)
        .then((res) => {
          if (res.desc === 'UNKNOWN BLOCK') {
            setTimeout(() => {
              getBlock(height)
                .then((b) => {
                  resolve(b);
                })
                .catch((e) => {
                  reject(e);
                });
            }, 500);
          } else {
            const header = res.result.Header;
            const timestamp = header.Timestamp;
            const transactionCount = res.result.Transactions.length;
            const block = {
              timestamp,
              transactionCount,
            };

            blockDict[height] = block;
            if (blockDict[height - previous - 5] != null) {
              delete blockDict[height - previous - 5];
            }

            resolve(block);
          }
        })
        .catch((error) => {
          console.log('Failed to get block');
          reject(error);
        });
    }
  });
}

/*

  Gets the current block height

*/
function getBlockHeight() {
  return new Promise((resolve, reject) => {
    rpcClient.getBlockHeight()
      .then((height) => {
        resolve(height);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/*

  Gets the time elapsed between two times

*/
function elapsed(startTime, now) {
  const difference = now - startTime;
  return difference;
}

/*

  Gets a block for the given height, but fails silently

*/
function safeGetBlock(height, retry) {
  return new Promise((resolve) => {
    getBlock(height)
      .then((block) => {
        resolve(block);
      })
      .catch((error) => {
        console.log(`Error in safeGetBlock: ${error}`);
        if (retry > 0) {
          setTimeout(() => {
            safeGetBlock(height, retry - 1)
              .then((block) => {
                resolve(block);
              });
          }, 250);
        } else {
          resolve(null);
        }
      });
  });
}

/*

  Makes object with all of the stats

*/
function getStats() {
  const obj = {
    latest,
    previous,
    elapsedTime,
    totalTransactions,
    txPerSecond,
    blockTime,
    sinceLastBlock,
  };
  return obj;
}

/*

  Builds an array of promises to get the last 1000 blocks

*/
function getPromises(height) {
  const promises = [];
  for (let i = 1; i <= previous; i += 1) {
    promises.push(safeGetBlock(height - i, 3));
  }
  return promises;
}

/*

  Updates the network statistics

*/
function refreshNetworkStats(io) {
  console.log('Refreshing...');
  getBlockHeight()
    .then((height) => {
      if (height > latest) {
        getBlock(height)
          .then(async (block) => {
            const promises = getPromises(height);
            Promise.all(promises)
              .then((blocks) => {
                const { timestamp } = block;
                let oldest = timestamp;
                let txCount = 0;

                blocks.forEach((newBlock) => {
                  if (newBlock == null) {
                    console.log('A block was null!');
                  } else {
                    const newTime = newBlock.timestamp;
                    if (newTime < oldest) {
                      oldest = newTime;
                    }
                    txCount += newBlock.transactionCount;
                  }
                });

                if (height >= latest) {
                  latest = height;
                  elapsedTime = elapsed(oldest, timestamp);
                  totalTransactions = txCount * 1.0;
                  txPerSecond = Math.round((totalTransactions / elapsedTime) * 100) / 100;
                  blockTime = Math.round((elapsedTime / previous) * 100) / 100;
                  const now = new Date().getTime();
                  const unixTS = now / 1000;
                  sinceLastBlock = elapsed(timestamp, unixTS);

                  const alertString = `
                  Latest Block: ${latest}
                  In the previous ${previous} blocks
                  Total time elapsed: ${elapsedTime} seconds
                  Total Transactions: ${totalTransactions}
                  Tx Per Second: ${txPerSecond}
                  Block Time: ${blockTime} seconds
                  Since Last Block: ${sinceLastBlock} seconds
                  `;
                  console.log(alertString);

                  const stats = getStats();
                  io.emit('StatUpdate', stats);
                } else {
                  console.log(`${height} < ${latest}`);
                }
              });
          })
          .catch((error) => {
            console.log(`There was an error getting the block: ${error}`);
          });
      }
    })
    .catch((error) => {
      console.log(`There was an error getting the block height: ${error}`);
    });
}

/*

  Tries to send out a tweet update with network stats

*/
function tweetNetworkStats() {
  console.log('Attempting to tweet network statistics');
  const stats = getStats();
  if (stats.latest !== 0) { // If stats have loaded
    twitter.sendNetworkUpdate(stats);
  } else { // Otherwise try again in five seconds
    setTimeout(() => {
      tweetNetworkStats();
    }, 5000);
  }
}

/*

  Checks whether the current time matches

*/
function canTweet(hr, min) {
  const d = new Date();
  const currentHr = d.getHours();
  const currentMin = d.getMinutes();
  return currentHr === hr && currentMin === min;
}

/*

  Sends a tweet if the current time is whitelisted

*/
function executeTweet(timeArray, tweet) {
  console.log('Checking if can tweet');
  const { length } = timeArray;
  for (let i = 0; i < length; i += 1) {
    const time = timeArray[i];
    if (time.length === 2) {
      const hr = time[0];
      const min = time[1];
      if (canTweet(hr, min)) {
        console.log('Tweeting...');
        tweet();
        break;
      }
    }
  }
}

/*

  Called when the app initializes
  Tries to send the tweets every minute

*/
function startTweetBot() {
  console.log('Tweet bot application starting up');
  setInterval(() => {
    const {
      networkStatTimes,
    } = tweetConfig.config;

    executeTweet(networkStatTimes, tweetNetworkStats);
  }, oneMinute);
}

/*

  Starts the system

*/
function start(io) {
  console.log('Ontology network started loading');
  setInterval(() => {
    refreshNetworkStats(io);
  }, refreshDelay);

  startTweetBot();
}

module.exports = {
  start,
  getStats,
};
