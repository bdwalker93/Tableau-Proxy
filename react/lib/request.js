import axios from 'axios';

// https://github.com/mzabriskie/axios#cancellation
export default function request(config) {
  return axios(config).then(res=>{
    if ( res && res.data && res.data.result && res.data.result.errors) {
      console.log(res.data.result.errors);
      throw new Error('Tableau threw errors');
    }
    return res;
  }).catch((err) => {

    if (err.response.status === 500) {
      window.location = '/';
    } else if(err.response.status === 502) {
      throw new Error('Bad Gateway');
    } else if (err.response.status === 401) {
      console.log('session expired, redirecting to login');
      window.location = '/';
    } else {
      console.error('error while making request', err);
    }
  });
}
