import axios from 'axios';

export default function request(config) {
  return axios(config).catch((err) => {
    if (err.response.status === 401) {
      console.log('session expired, redirecting to login');
      window.location = '/';
    } else {
      console.error('error while making request', err);
    }
  });
}
