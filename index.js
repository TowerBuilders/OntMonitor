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

  const minutes = Math.round((elapsedTime / 60.0) * 100.0) / 100.0;
  let time = `${minutes} minutes`;
  if (minutes > 60) {
    const hours = Math.round((elapsedTime / 3600.0) * 100.0) / 100.0;
    time = `${hours} hours`;
  }

  document.getElementById('latest').innerHTML = `Latest Block: ${latest}`;
  document.getElementById('previous').innerHTML = `In the previous ${previous} blocks`;
  document.getElementById('elapsed').innerHTML = `${time} have elapsed`;
  document.getElementById('totalTx').innerHTML = `Total Transactions: ${totalTransactions}`;
  document.getElementById('txPerSecond').innerHTML = `Transactions Per Second: ${txPerSecond}`;
  document.getElementById('blockTime').innerHTML = `Block Time: ${blockTime}`;
}

socket.on('StatUpdate', (data) => {
  parseStats(data);
});

function getStats() {
  $.get('/getStats', (data) => {
    const statObj = JSON.parse(data);
    parseStats(statObj);
  });
}

getStats();
