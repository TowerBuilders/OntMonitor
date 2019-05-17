/* global io */

const socket = io('http://localhost');

function parseStats(statObj) {
  const {
    latest,
    previous,
    elapsedTime,
    totalTransactions,
    txPerSecond,
    blockTime,
  } = statObj;

  document.getElementById('latest').innerHTML = `Latest Block: ${latest}`;
  document.getElementById('previous').innerHTML = `In the previous ${previous} blocks`;
  document.getElementById('elapsed').innerHTML = `Total time elapsed: ${elapsedTime} seconds`;
  document.getElementById('totalTx').innerHTML = `Total Transactions: ${totalTransactions}`;
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
