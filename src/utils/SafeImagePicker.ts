import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export const ImagePicker = {
  openPicker: async (options?: any) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
        ...options
      });
      if (result.didCancel) {
        throw new Error('User cancelled image selection');
      }
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          path: asset.uri,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          mime: asset.type,
          size: asset.fileSize,
          filename: asset.fileName
        };
      }
      throw new Error('No image selected');
    } catch (e: any) {
      if (e?.message === 'User cancelled image selection') {
        throw e;
      }
      console.log('SafeImagePicker error:', e);
      throw e;
    }
  },
  openCamera: async (options?: any) => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        ...options
      });
      if (result.didCancel) {
        throw new Error('User cancelled image selection');
      }
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          path: asset.uri,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          mime: asset.type,
          size: asset.fileSize,
          filename: asset.fileName
        };
      }
      throw new Error('No image captured');
    } catch (e: any) {
      if (e?.message === 'User cancelled image selection') {
        throw e;
      }
      console.log('SafeImagePicker camera error:', e);
      throw e;
    }
  }
};

export default ImagePicker;
