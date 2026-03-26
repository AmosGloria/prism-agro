// utils/authService.js
const axios = require('axios');

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.INTERSWITCH_API_KEY}:${process.env.INTERSWITCH_API_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post(
      'https://qa.interswitchng.com/passport/oauth/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'profile'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`
        },
        timeout: 10000
      }
    );

    return response.data.access_token;

  } catch (error) {
    throw {
      status: 500,
      message: 'Failed to fetch access token',
      details: error.response?.data || error.message
    };
  }
}

module.exports = {
  getAccessToken
};