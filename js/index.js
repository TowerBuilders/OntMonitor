/* global io */

const socket = io('monitor.ryu.games');

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

function parseStats(statObj) {
  const {
    latest,
    previous,
    elapsedTime,
    totalTransactions,
    txPerSecond,
    blockTime,
    sinceLastBlock,
  } = statObj;

  const elapsedText = secondsToHms(elapsedTime);
  document.getElementById('latest').innerHTML = `Latest Block: ${latest}`;
  document.getElementById('previous').innerHTML = `In the previous ${previous} blocks`;
  document.getElementById('elapsed').innerHTML = `${elapsedText} have elapsed`;
  document.getElementById('totalTx').innerHTML = `Total Transactions: ${totalTransactions}`;
  document.getElementById('txPerSecond').innerHTML = `Transactions Per Second: ${txPerSecond}`;
  document.getElementById('blockTime').innerHTML = `Block Time: ${blockTime}`;
  document.getElementById('sinceLastBlock').innerHTML = `Seconds since last block: ${sinceLastBlock}`;
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
