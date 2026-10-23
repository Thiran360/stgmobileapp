import { Share as RNShare } from 'react-native';

export const Share = {
  open: async (options: any) => {
    try {
      const url = options?.url || (Array.isArray(options?.urls) ? options.urls[0] : '');
      const message = options?.message || options?.title || '';
      return await RNShare.share({
        url: url,
        message: message ? `${message} ${url || ''}`.trim() : (url || ''),
        title: options?.title || 'Share'
      });
    } catch (e) {
      console.log('SafeShare error:', e);
      return null;
    }
  },
  shareSingle: async (options: any) => {
    return Share.open(options);
  }
};

export default Share;
