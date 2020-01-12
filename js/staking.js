const ont = require('ontology-ts-sdk');

const {
  GovernanceTxBuilder,
} = ont;

const {
  getPeerPoolMap,
} = GovernanceTxBuilder;

const url = 'http://dappnode2.ont.io:20334';

const isOntFoundation = {
  APSFBEbQzMUjuCtSVwHcRjiqCrDe56jAHJ: true,
  AXNxyP2HEKW7GoSqYfeqcYfCSE7XaaVVu4: true,
  AUy6TaM9wxTqo9T7FiaYMnDeVExhjsR1Pq: true,
  AGqzuKoEeDfMHPEBPJVs2h2fapxDGoGtK1: true,
  AWWChRewNcQ5nZuh8LzF8ksqPaCW8EXPBU: true,
  AGEdeZu965DFFFwsAWcThgL6uduJf4U7ci: true,
  AJEAVCJpa7JmpDZsJ9vPA1r9fPZAvjec8D: true,
  ATDFE9qkZEUpjTBe81jdLnWAMZQv27EGcH: true,
  ALZ3dhx4K74TAiLkprBRPWNe4LppW5ff6P: true,
  AN6xsEH2JpA8drNWYL8TTbmRF5oC6t9V9H: true,
};

const governance = {
  APSFBEbQzMUjuCtSVwHcRjiqCrDe56jAHJ: 'Alioth (Ontology Foundation)',
  AXNxyP2HEKW7GoSqYfeqcYfCSE7XaaVVu4: 'Alkaid (Ontology Foundation)',
  AUy6TaM9wxTqo9T7FiaYMnDeVExhjsR1Pq: 'Megrez (Ontology Foundation)',
  AGqzuKoEeDfMHPEBPJVs2h2fapxDGoGtK1: 'Dubhe (Ontology Foundation)',
  AWWChRewNcQ5nZuh8LzF8ksqPaCW8EXPBU: 'Mixar (Ontology Foundation)',
  AGEdeZu965DFFFwsAWcThgL6uduJf4U7ci: 'Merak (Ontology Foundation)',
  AJEAVCJpa7JmpDZsJ9vPA1r9fPZAvjec8D: 'Phecda (Ontology Foundation)',
  AJiEBNzr4NeAyaQx6qn1jgNkLFCgxtTt5U: 'OKEx Pool',
  AevYU9HK7B4iryyx6Av5iEVczBkfmM3cXy: 'huobipool-pro',
  ATTzSUQm5MgXQCLfrbWBv9hSBLcZX75giR: 'Huobi Wallet',
  AYgiXzs4b7XmaQjNoo6ANuFJ5zHDebgPdq: 'Jumple Foundation',
  Aa1MF3pTq4CaE3HK4umgZL3WxLh3A1CiBH: 'Longlink Fund',
  ANRRE8xKwKzuaCeAjP6eZYDnVi7n2x6byE: 'Sesameseed',
  AWGrHN1DUAo6Ao3yTHu4tUHZonPNAy9ZmU: 'Krypto Knight',
  ALfbQ4yv4Pho31DA1EoeacMj6VJhyxDHqu: 'Charbo',
  ASPPqj8yCcCV2sWHQZwsYfWZS2FMfd3PF7: 'Midwest Blockchain Club',
  AVaQJM27YxLkD5JAd1n4wGnxMx2Ey1h9cQ: 'Hashed',
  AbZuVX9M2F4cw6myDFVP9shAFKPm8xBY9J: 'Infinity Stones',
  ASNRUBi1X56kW55zRv7jFPQsE6SngBJfrs: 'Lichang',
  AUEAGG1pWTg2nAMsoR4x6EvSN2wb2wdZHx: 'Martview',
  AGUekTnhucrQShdATUFhZqFqiPdC65nRxv: 'Fenbushi Digital',
  Ac8P8376ozoQ5H2Srcm32n5yb8kLoixRaP: 'Dragon',
  AV59sm9kRGB4EYRKCMYXXsiCPKzbAFMcpA: 'Abine',
  ANumnYcRtbT1XxCw1hs9WGjJaDURMxiuQ9: 'Accomplicate Blockchain Capital',
  AModfYVLuvvaacsexSBAvegnykog5yH2Ji: 'Nebuchadnezzar Limited',
  AcdH5iCT5DSxUio29YMykT8eakgbjYeWBW: 'Cobo',
  AbGDhXXyjHLBc53BDR8jrRZLAL1BteL7VA: 'Timestamp Capital',
  AFsfeivZ1iTbL1sqY8UkTZ8kqygwGerDNj: 'Marvelous Peach Capital',
  AXMKzXMc9nKpZJYecPe5NBLJraZwJ37zbg: 'SNZPool',
  AbPsjYENUywQDDNdMq8iCGHXLduP1zbqaZ: 'DAD Foundation',
  AHnRpJ8Hnk9eAdDsW1gMAwTK88pvtZEGfg: 'ONTLabo',
  AXwfq4jnhvByDmvuFhFzHSSdKJ3GQTwZ8Z: 'MovieBloc',
  AX9MxQSbQPKKA4cP9VzTwE8o6MXC3pC9Nw: 'G&Q Tech Limited',
  AZ3TqZAEhUELfNHrjrmXShbVzKJv64x12w: 'Ku Coin',
  AXtswyDXUgkpUobpyc9cj8cTTAtAdMbTTy: 'CloudDesk',
  AW4ytrVJX2h6W2jxKCf5Ws2bh1DUXAK2qq: 'Karathen',
  ATGDCxCUEzGdX2mpLriT3hBUK7VW3dX1FT: '本体微积分',
  AJ6exTNyr8joCkBEbz6DpHbe357EoBX1Tf: 'Lightbringer',
  AKshHCFGWHMftXELBmogxrjrDMW61xgph9: 'BlockBoost',
  ARXKEj5r61cWm1X7DLZttDJo3D5Zhwdexc: 'J&D Tech Limited',
  AGgCp8dKedjJXaWDoU4qfnSAU6pgLKhxVx: 'PNP',
  AY65tbb1bzDJ4fbcqPCExMyMEq2BRNb9fu: 'ont-huobipool',
  AGns9etVHUknEgZ6yUhnHSZm6G6AxKXkPx: 'CertiK Ltd',
  ALaDrS5ZwMKZgTS3a8okgDDz84k3ttfP4x: 'PreAngel',
  AGgP7kWDSxzbRHdeDwULwYUV7qVuKWBoTr: 'Accomplicate Blockchain Capital',
  AKkcxjHGXnF68FYNP5UQ5Hkv4j3HBsdmP5: 'Matrix Partners China',
  ATDFE9qkZEUpjTBe81jdLnWAMZQv27EGcH: 'Kochab (Ontology Foundation)',
  ALZ3dhx4K74TAiLkprBRPWNe4LppW5ff6P: 'Polaris (Ontology Foundation)',
  AN6xsEH2JpA8drNWYL8TTbmRF5oC6t9V9H: 'Pherkad (Ontology Foundation)',
  AMJskicSD18QzVYcx5o4F6d67dbG4kKW7v: 'Points Foundation',
  AdW4BrKWQaRzKTZaCHzBexFJzgK7iDNudN: 'BigONE',
  APP42849YXfRtDp5Y4bTVbt1g5vhajAAya: 'Animals.NET',
};

function getStakeInfo() {
  return new Promise((resolve, reject) => {
    getPeerPoolMap(url)
      .then(async (res) => {
        const keys = Object.keys(res);
        const count = keys.length;
        let nodes = [];
        let total = 0;
        let ofNodes = 0;
        let ofStake = 0;

        for (let i = 0; i < count; i += 1) {
          const key = keys[i];
          const { address, totalPos, initPos } = res[key];
          const b58 = address.toBase58();
          let nodeName = governance[b58];
          if (nodeName == null) {
            nodeName = 'Unknown Node';
          }

          let isOnt = isOntFoundation[b58];
          if (isOnt == null) {
            isOnt = false;
          }

          const stake = initPos + totalPos;
          const node = {
            name: nodeName,
            initialStake: initPos,
            userStake: totalPos,
            totalStake: stake,
            isOntologyFoundation: isOnt,
          };

          if (isOnt) {
            ofNodes += 1;
            ofStake += stake;
          }

          nodes.push(node);
          total += stake;
        }

        nodes = nodes.sort((a, b) => ((a.totalStake < b.totalStake) ? 1 : -1));
        const ofNodeShare = ofNodes / count * 100.0;
        const ofStakeShare = ofStake / total * 100.0;

        const response = {
          nodes,
          nodeCount: count,
          totalStake: total,
          foundationStake: ofStake,
          foundationNodes: ofNodes,
          ofNodeShare,
          ofStakeShare,
        };
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getStakeInfo,
};
