#!/usr/bin/env node

const crypto = require('crypto');
const https = require('https');

// Your credentials from .env
const devId = '3003455';
const apiKey = 'bd01fe2f-b763-48ee-86c4-8defad3de705';

function signUrl(path, devId, apiKey) {
  const urlWithDev = `${path}${path.includes('?') ? '&' : '?'}devid=${devId}`;
  const signature = crypto
    .createHmac('sha1', apiKey)
    .update(urlWithDev)
    .digest('hex')
    .toUpperCase();

  return `https://timetableapi.ptv.vic.gov.au${urlWithDev}&signature=${signature}`;
}

// South Yarra station: stop_id 1180, trains (route_type: 0)
const testPath = '/v3/departures/route_type/0/stop/1180?max_results=5&expand=all';
const signedUrl = signUrl(testPath, devId, apiKey);

const urlObj = new URL(signedUrl);
const options = {
  hostname: urlObj.hostname,
  path: urlObj.pathname + urlObj.search,
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'TrainTracker/1.0',
  },
  timeout: 10000,
};

const request = https.request(options, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    if (response.statusCode === 200) {
      try {
        const jsonData = JSON.parse(data);
        
        console.log('\n🚆 SOUTH YARRA STATION - NEXT SERVICES\n');
        console.log('═'.repeat(70));
        
        if (jsonData.departures && jsonData.departures.length > 0) {
          const departures = jsonData.departures.slice(0, 5);
          
          departures.forEach((dep, index) => {
            const route = jsonData.routes[dep.route_id];
            const scheduledTime = new Date(dep.scheduled_departure_utc);
            const estimatedTime = dep.estimated_departure_utc ? new Date(dep.estimated_departure_utc) : null;
            
            const now = new Date();
            let minutesUntil = Math.round((scheduledTime - now) / 60000);
            
            // Determine status
            let status = '';
            if (estimatedTime) {
              const delay = Math.round((estimatedTime - scheduledTime) / 60000);
              if (delay > 0) {
                status = ` [DELAYED: +${delay} min]`;
              } else if (delay < 0) {
                status = ` [EARLY: ${delay} min]`;
              }
            }
            
            console.log(`\n${index + 1}. ${route.route_name} (Line ${route.route_number})`);
            console.log(`   Scheduled: ${scheduledTime.toLocaleTimeString('en-AU')} (in ${minutesUntil} min)`);
            if (estimatedTime) {
              console.log(`   Estimated: ${estimatedTime.toLocaleTimeString('en-AU')}${status}`);
            }
            console.log(`   Platform: ${dep.platform_number || 'TBA'}`);
          });
          
          console.log('\n' + '═'.repeat(70));
        } else {
          console.log('❌ No upcoming services found.');
        }
      } catch (e) {
        console.log('Error parsing response:', e.message);
      }
    } else {
      console.log(`❌ ERROR: Status ${response.statusCode}`);
    }
  });
});

request.on('error', (error) => {
  console.log('❌ REQUEST ERROR:', error.message);
});

request.end();
