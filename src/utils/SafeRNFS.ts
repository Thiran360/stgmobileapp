import { NativeModules } from 'react-native';

let NativeRNFS: any = null;
if (NativeModules && NativeModules.RNFSManager) {
  try {
    NativeRNFS = require('react-native-fs');
  } catch (e) {
    NativeRNFS = null;
  }
}

export const RNFS = NativeRNFS || {
  PicturesDirectoryPath: '/sdcard/Pictures',
  CachesDirectoryPath: '/sdcard/Download',
  DocumentDirectoryPath: '/sdcard/Documents',
  ExternalDirectoryPath: '/sdcard',
  copyFile: async () => true,
  moveFile: async () => true,
  scanFile: async () => true,
  exists: async () => false,
  readFile: async () => '',
  writeFile: async () => true,
  unlink: async () => true,
  mkdir: async () => true,
  downloadFile: () => ({ jobId: 1, promise: Promise.resolve({ statusCode: 200, bytesWritten: 0 }) }),
};

export default RNFS;
