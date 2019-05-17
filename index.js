/* global io */

const socket = io('http://localhost');

function parseStats(statObj) {
  const {
    elapsedTime,
    totalTransactions,
    totalBlocks,
    txPerSecond,
    blockTime,
  } = statObj;

  document.getElementById('elapsed').innerHTML = `Elapsed Time: ${elapsedTime}`;
  document.getElementById('totalTx').innerHTML = `Total Transactions: ${totalTransactions}`;
  document.getElementById('totalBlocks').innerHTML = `Total Blocks: ${totalBlocks}`;
  document.getElementById('txPerSecond').innerHTML = `Transactions Per Second: ${txPerSecond}`;
  document.getElementById('blockTime').innerHTML = `Block Time: ${blockTime}`;
}

function getStats() {
  $.get('/getStats', (data) => {
    const statObj = JSON.parse(data);
    parseStats(statObj);
  });
}

socket.on('StatUpdate', (data) => {
  parseStats(data);
});

getStats();
