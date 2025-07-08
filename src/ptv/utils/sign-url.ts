import * as crypto from 'crypto';

export function signUrl(path: string, devId: string, apiKey: string): string {
  const urlWithDev = `${path}${path.includes('?') ? '&' : '?'}devid=${devId}`;
  const signature = crypto
    .createHmac('sha1', apiKey)
    .update(urlWithDev)
    .digest('hex')
    .toUpperCase();

  return `https://timetableapi.ptv.vic.gov.au${urlWithDev}&signature=${signature}`;
}