var world = {
  'North America': {
    'United States': {
      Florida: 10
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

var world = {
  'North America': {
    'United States': {
      Florida: 10,
      California: 1
    }
  }
};

var newWorld = {
  'North America': {
    'United States': {
      California: 1
    }
  }
};
