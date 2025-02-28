const cesenaCampusLocation = {
  latitude: 44.147843982335836,
  longitude: 12.23510261898422,
};

const piazzaDelPopoloLocation = {
  latitude: 44.13734012989611,
  longitude: 12.243828352831988,
};

function testablePath() {
  return [
    cesenaCampusLocation,
    { latitude: 44.146491259882225, longitude: 12.2349564549283 },
    { latitude: 44.14372253536823, longitude: 12.235647290979074 },
    { latitude: 44.14212467001738, longitude: 12.238297335920198 },
    { latitude: 44.14192095254784, longitude: 12.24027836844145 },
    { latitude: 44.14176154018782, longitude: 12.242786540498049 },
    { latitude: 44.13964872372436, longitude: 12.246433745126328 },
    { latitude: 44.13765039628027, longitude: 12.245009358944937 },
    { latitude: 44.138017476200716, longitude: 12.243344846276443 },
    piazzaDelPopoloLocation
  ];
}

const MockedLocation = (() => {
  const path = testablePath();
  let index = 0;
  let forward = true;
  return {
    getNextPosition: () => {
      const position = path[index];
      if (forward) {
        index++;
        if (index >= path.length - 1) {
          forward = false;
        }
      } else {
        index--;
        if (index <= 0) {
          forward = true;
        }
      }
      return {
        coordinates: {
          latitude: position.latitude,
          longitude: position.longitude,
        },
        timestamp: new Date().toISOString()
      }
    },
    reset: () => {
      index = 0;
      forward = true;
    },
  };
})();

export const getMockedPosition = () => MockedLocation.getNextPosition();
export const resetMockedPosition = () => MockedLocation.reset();
