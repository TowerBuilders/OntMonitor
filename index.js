/* global io */

const socket = io('monitor.ryu.games');

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
  document.getElementById('elapsed').innerHTML = `${elapsedTime} seconds have elapsed`;
  document.getElementById('totalTx').innerHTML = `Total Transactions: ${totalTransactions}`;
  document.getElementById('txPerSecond').innerHTML = `Transactions Per Second: ${txPerSecond}`;
  document.getElementById('blockTime').innerHTML = `Block Time: ${blockTime}`;
}

socket.on('StatUpdate', (data) => {
  parseStats(data);
});
