# OntMonitor

The OntMonitor tracks key metrics of the Ontology blockchain - latest block, blocktime, tps and tx per block. It can be subscribed to in three ways:

1) View the network stats at [http://monitor.ryu.games](http://monitor.ryu.games).
2) Follow Twitter updates at [@OntMonitor](https://twitter.com/OntMonitor).
3) Subscribe to `StatUpdate` web socket events from http://monitor.ryu.games.

Socket.IO Example

``` javascript
const socket = io('monitor.ryu.games');

socket.on('StatUpdate', (data) => {
  const {
    latest,                 // latest block
    previous,               // previous period of blocks (1k)
    elapsedTime,            // time to propagate the blocks
    totalTransactions,      // total transactions in the period
    txPerSecond,            // avg transactions per second
    blockTime,              // time per block
  } = data;
  // Do whatever you want here...
});
```
