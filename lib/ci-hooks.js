const _request = require( 'request' );
const travisUrl = 'https://api.travis-ci.org';

var ciToken;

function request( options ) {
  options.url = travisUrl + options.url;
  options.json = true;
  if ( ciToken ) {
    options.headers = options.headers || {};
    options.headers.Authorization = `token ${ciToken}`;
  }

  return new Promise( ( resolve, reject ) => {
    _request( options, ( error, response, body ) => {
      // console.log('options', options);
      // console.log(body);
      if (error) return reject( error );
      resolve( body );
    });
  });
}

module.exports = function setupHooks( repoName, prefs ) {
  return request({
    method: 'POST',
    url: '/auth/github',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Travis/1.6.8',
      'accept': 'application/vnd.travis-ci.2+json'
    },
    body: { github_token: prefs.github_token }
  })
    .then( body => ciToken = body.access_token )
    .then( () => request({
      method: 'POST',
      url: `/users/sync`
    }))
    .then( () => request({
      method: 'GET',
      url: `/repos/${prefs.github_org}/${repoName}`
    }))
    .then( ciRepo => {
      if (ciRepo.id) return ciRepo.id;
      else console.log('no ciRepo.id: ', ciRepo);
    })
    .then( repoId => request({
      method: 'PUT',
      url: '/hooks',
      body: {
        hook: {
          id: repoId,
          active: true
        }
      }
    }))
    .catch(console.log);
};
