import { IPinfoWrapper } from 'node-ipinfo';

const token = process.env.IPINFO_TOKEN ?? '';
const ipinfoWrapper = new IPinfoWrapper(token);

export const getIpInfo = async (ip: string) => {
  try {
    const data = await ipinfoWrapper.lookupIp(ip);
    return data;
  } catch (err) {
    console.error('IPinfo lookup error:', err);
    return null;
  }
};
