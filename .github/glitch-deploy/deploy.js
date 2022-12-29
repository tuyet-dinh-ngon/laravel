const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/peppered-reminiscent-nerve|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/lucky-elemental-patch|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/gravel-bubble-locust|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/valuable-bitter-morocco|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/plain-noon-crepe|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/glowing-cottony-mosquito|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/accurate-elite-seatbelt|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/plastic-octagonal-balance|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/opalescent-nonchalant-radium|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/dandelion-locrian-increase|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/slender-superb-play|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/crocus-fish-atrociraptor|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/handsomely-silly-pin|https://b36cce66-0be1-4708-962b-a3b94a22b7ee@api.glitch.com/git/hammerhead-iridescent-engine`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();