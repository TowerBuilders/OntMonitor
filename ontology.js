const ont = require('ontology-ts-sdk');
const twitter = require('./twitter.js');

const {
  RpcClient,
} = ont;

const node = 'http://dappnode1.ont.io:20336';
const rpcClient = new RpcClient(node);

const previous = 1000; // In blocks
const beatTime = 1000; // In milliseconds

// Exported Stats
let latest = 0;
let totalTransactions = 0;
let elapsedTime = 0;
let txPerSecond = 0;
let blockTime = 0;

const blockDict = {};

const tweetTimeout = 6 * 60 * 60 * 1000;

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

function elapsed(start, now) {
  const difference = now - start;
  return difference;
}

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

function getStats() {
  const obj = {
    latest,
    previous,
    elapsedTime,
    totalTransactions,
    txPerSecond,
    blockTime,
  };
  return obj;
}

function getPromises(height) {
  const promises = [];
  for (let i = 1; i <= previous; i += 1) {
    promises.push(safeGetBlock(height - i, 3));
  }
  return promises;
}

function beat(io) {
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

                if (height > latest) {
                  latest = height;
                  elapsedTime = elapsed(oldest, timestamp);
                  totalTransactions = txCount * 1.0;
                  txPerSecond = Math.round((totalTransactions / elapsedTime) * 100) / 100;
                  blockTime = Math.round((elapsedTime / previous) * 100) / 100;

                  const alertString = `
                  Latest Block: ${latest}
                  In the previous ${previous} blocks
                  Total time elapsed: ${elapsedTime} seconds
                  Total Transactions: ${totalTransactions}
                  Tx Per Second: ${txPerSecond}
                  Block Time: ${blockTime} seconds
                  `;
                  console.log(alertString);

                  const stats = getStats();
                  io.emit('StatUpdate', stats);
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

function tweet() {
  setInterval(() => {
    const stats = getStats();
    if (stats.latest !== 0) {
      twitter.sendUpdate(stats);
    }
  }, tweetTimeout);
}

function heartBeat(io) {
  setInterval(() => {
    beat(io);
  }, beatTime);

  setTimeout(() => {
    tweet();
  }, 30000); // Delay start 30 seconds
}

module.exports = {
  heartBeat,
  getStats,
};
