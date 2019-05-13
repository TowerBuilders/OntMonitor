const ont = require('ontology-ts-sdk');

const {
  RpcClient,
} = ont;

const node = 'http://dappnode1.ont.io:20336';
const rpcClient = new RpcClient(node);

const minute = 60;
const delta = 1 * minute;
const beatTime = 30000;

let elapsedTime = 0;
let totalTransactions = 0;
let totalBlocks = 0;
let txPerSecond = 0;
let blockTime = 0;

function getBlock(height) {
  return new Promise((resolve, reject) => {
    rpcClient.getBlockJson(height)
      .then((res) => {
        const header = res.result.Header;
        const timestamp = header.Timestamp;
        const transactionCount = res.result.Transactions.length;
        const block = {
          timestamp,
          transactionCount,
        };

        resolve(block);
      })
      .catch((error) => {
        reject(error);
      });
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
  // const fiveMinutes = 60 * 5;
  const difference = start - now;
  return difference;
}

function safeGetBlock(height) {
  return new Promise((resolve) => {
    getBlock(height)
      .then((block) => {
        resolve(block);
      })
      .catch((error) => {
        console.log(`Error in safeGetBlock: ${error}`);
        resolve(null);
      });
  });
}

function getStats() {
  const obj = {
    elapsedTime,
    totalTransactions,
    totalBlocks,
    txPerSecond,
    blockTime,
  };
  return obj;
}

function beat(io) {
  getBlockHeight()
    .then((height) => {
      getBlock(height)
        .then(async (block) => {
          const { timestamp } = block;
          let { transactionCount } = block;
          let shouldEnd = false;
          let starting = height;
          let totalTime = 1;
          let blocks = 1;

          while (!shouldEnd) {
            starting -= 1;
            const newBlock = await safeGetBlock(starting);
            if (newBlock != null) {
              blocks += 1;
              const newTime = newBlock.timestamp;
              const difference = elapsed(timestamp, newTime);
              if (difference >= delta) {
                shouldEnd = true;
                totalTime = difference;
              } else {
                transactionCount += newBlock.transactionCount;
              }
            }
          }

          elapsedTime = totalTime * 1.0;
          totalTransactions = transactionCount * 1.0;
          totalBlocks = blocks * 1.0;
          txPerSecond = Math.round((totalTransactions / elapsedTime) * 100) / 100;
          blockTime = Math.round((elapsedTime / totalBlocks) * 100) / 100;

          const alertString = `
          Total time elapsed: ${elapsedTime} seconds
          Total Transactions: ${totalTransactions}
          Total Blocks: ${totalBlocks}
          Tx Per Second: ${txPerSecond}
          Block Time: ${blockTime} seconds
          `;
          console.log(alertString);

          const stats = getStats();
          io.emit('StatUpdate', stats);
        })
        .catch((error) => {
          console.log(`There was an error getting the block: ${error}`);
        });
    })
    .catch((error) => {
      console.log(`There was an error getting the block height: ${error}`);
    });
}

function heartBeat(io) {
  beat(io);
  setTimeout(() => {
    heartBeat(io);
  }, beatTime);
}

module.exports = {
  heartBeat,
  getStats,
};
