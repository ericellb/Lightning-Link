var world = {
  'North America': {
    Canada: {
      Quebec: 5,
      Ontario: 10
    },
    'United States': {
      'New York': 5,
      Florida: 10
    }
  },
  Europe: {
    'United Kingdom': {
      Scotland: 10
    }
  }
};

for (continent in world) {
  for (country in world[continent]) {
    for (state in world[continent][country]) {
      console.log(state + ' has ' + world[continent][country][state] + ' visits');
    }
  }
}
