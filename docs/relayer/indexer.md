---
sidebar_position: 3
sidebar_label: Indexer
---

# Helix Data Indexing

Before attempting to run a relay, it's essential to have a comprehensive understanding of Helix data indexing. The index plays a pivotal role in the proper functioning and security of the relayer, as it heavily relies on and trusts indexed data.

## Structure

Helix indexing employs a two-tier structure. The first tier directly indexes data on the chain, often utilizing established solutions like thegraph. The second tier then aggregates and correlates the data gathered from the first tier.

```
+------------------------------+                +------------------------------+
|      blockchain(contract)    |                |     blockchain(contract)     |
+----------------+-------------+                +----------------+-------------+
                  |                                               |
                  |event                                          | event
                  |                                               |
+----------------v--------------+                  +-------------v-------------+
|         indexer(level1)       |                  |        indexer(level1)    |
|          thegraph             |                  |          thegraph         |
+----------------+--------------+                  +--------------+------------+
                  |                                                |
                  |                                                |
                +-v------------------------------------------------v--+
                |                   indexer(level2)                   |
                +--^----------------------^-----------------------^---+
                   |                      |                       |
+--------------+   |       +------------+ |         +-----------+ |
|   relayer    +---+       |   relayer  +-+         |  relayer  +-+
+--------------+           +------------+           +-----------+
```

Each indexer on the first layer is responsible for indexing and storing data from a single chain. The second layer's service is unique; it connects to the first layer's services, requests data from them sequentially, and associates data from different chains while performing global sorting. The Relayer only requests data from the second-layer indexer and trusts the data from that indexer.

Each first-layer indexer is responsible for indexing and storing data from a single chain. The second-layer indexer connects to the first-layer services, sequentially requests data from them, and performs global sorting to associate data from different chains. The Relayer exclusively relies on data from the second-layer indexer.
