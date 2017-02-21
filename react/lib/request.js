import axios from 'axios';

// https://github.com/mzabriskie/axios#cancellation
export default function request(config) {
  return axios(config).catch((err) => {

    if (err.response.status === 500) {
      window.location = '/';
    } else if (err.response.status === 401) {
      console.log('session expired, redirecting to login');
      window.location = '/';
    } else {
      console.error('error while making request', err);
    }
  });
}
