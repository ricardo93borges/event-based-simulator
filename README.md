# event-based-simulator

## Dependencies

Node v12.16.0

### How to install Node v12

Install nvm

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`

Instal Node v12

`nvm install v12.13.1`


### Usage

Run the following to install the dependencies

`npm i`

Edit schema.json file to set up the queues.

Run the following to execute:

`npm start`

### Schema

Schema is a json file that the simulator will read to build the queues, it has three properties `arrivals`, `queues` and `transitions`:

```js
{
  "arrivals": [...],
  "queues": [...],
  "transitons": [...]
}
```

`arrivals` defines the first arrivals in the queues:

```js
  "arrivals": [
    {
      "queue": 1, // ID of the queue where this event will occur
      "time": 2.5
    }
  ],
```

`queues` defines which queue the system has:

```js
"queues": [
    { // G/G/1 | Arrival 1..4 | Service 1..1.5 
      "id": 1,
      "arrivalIntervalStart": 1,
      "arrivalIntervalEnd": 4,
      "departureIntervalStart": 1,
      "departureIntervalEnd": 1.5,
      "servers": 1,
      "capacity": null
    },
    { // Queue: 2 | G/G/3/5 | Arrival 1..1.5 | Service 5..10
      "id": 2,
      "arrivalIntervalStart": 1,
      "arrivalIntervalEnd": 1.5,
      "departureIntervalStart": 5,
      "departureIntervalEnd": 10,
      "servers": 3,
      "capacity": 5
    },
    { // Queue: 2 | G/G/3/5 | Arrival 1..1.5 | Service 5..10
      "id": 3,
      "arrivalIntervalStart": 1,
      "arrivalIntervalEnd": 1.5,
      "departureIntervalStart": 10,
      "departureIntervalEnd": 20,
      "servers": 2,
      "capacity": 8
    }
  ],
```

`transitions` defines the transitions between queues (if there is only one queue you do not need to define transitions):

```js
"transitions": [
    {
      "source": 1, // ID of the queue where the event comes from
      "target": 2, // ID of the queue where the event go to
      "probability": 0.8 // probability between 0.1 and 1.0
    },
    {
      "source": 1,
      "target": 3,
      "probability": 0.2
    },
    {
      "source": 2,
      "target": 1,
      "probability": 0.3
    },
    {
      "source": 2,
      "target": 3,
      "probability": 0.5
    },
    {
      "source": 2,
      "target": "DEPARTURE", // use this when the event is a transition from a queue to exit
      "probability": 0.2
    },
    {
      "source": 3,
      "target": 2,
      "probability": 0.7
    },
    {
      "source": 3,
      "target": "DEPARTURE",
      "probability": 0.3
    }
  ]
```
