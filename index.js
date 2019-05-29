const fs = require('fs');
const mockserver = require('mockserver-node');
const axios = require('axios');

const MOCK_SERVER_HOST = 'http://localhost';
const MOCK_SERVER_PORT = 1080;

const path = './apis/'
const matchFiles = /mock.api.json$/;

const readAllAPIFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const filtered = files.filter((item) => item.match(matchFiles))
        resolve(filtered);
      }
    });

  })
}

const readAPIFromJson = (file) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(require(`${file}`));
    } catch (err) {
      reject(err);
    }
  })
}

const addExpectation = async (apiInfo) => {
  let data;
  if (apiInfo.httpResponse && apiInfo.httpResponse.body && typeof apiInfo.httpResponse.body === 'object') {
    data = Object.assign({}, apiInfo, {
      httpResponse: Object.assign({}, apiInfo.httpResponse, {
        body: JSON.stringify(apiInfo.httpResponse.body),
      })
    })
  } else {
    data = apiInfo;
  }

  await axios.put(`${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/expectation`, data);

}

const initialize = async () => {

  await mockserver.start_mockserver({
    serverPort: MOCK_SERVER_PORT,
    trace: true,
  })

  const files = await readAllAPIFiles();

  for (file of files) {
    console.info(`${path}${file}`);
    const apis = await readAPIFromJson(`${path}${file}`);
    if (!Array.isArray(apis)) {
      throw new Error('json file should be array');
    }
    for (api of apis) {
      await addExpectation(api)
    }
  }

}


initialize()
  .then((result) => {
    console.info('initialized')
  }).catch((err) => {
    console.error(err);
    throw err;
  })



