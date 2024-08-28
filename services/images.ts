import * as FileSystem from 'expo-file-system';

const METADATA_FILE = `${FileSystem.documentDirectory}imageMetadata.json`;

const ImageCacheService = {
  async cacheImage(imageUrl:any) {
    try {
      const fileName = imageUrl.split('/').pop();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const metadata = await this.getImageMetadata();

      // Verifica si la URL es la misma que la almacenada en caché
      if (metadata[fileName] && metadata[fileName].url === imageUrl) {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          return fileUri;
        }
      }

      // Si la URL es diferente o no existe, descarga la nueva imagen
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

      // Actualiza los metadatos con la nueva URL
      metadata[fileName] = { url: imageUrl, uri: uri };
      await this.saveImageMetadata(metadata);

      return uri;
    } catch (error) {
      console.error('Error caching image:', error);
      return null;
    }
  },

  async deleteImageFromCache(imageUrl:any) {
    try {
      const fileName = imageUrl.split('/').pop();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }

      // Elimina los metadatos relacionados
      const metadata = await this.getImageMetadata();
      delete metadata[fileName];
      await this.saveImageMetadata(metadata);
    } catch (error) {
      console.error('Error deleting cached image:', error);
    }
  },

  async getImageUri(imageUrl:any) {
    try {
      const uri = await this.cacheImage(imageUrl);
      return uri;
    } catch (error) {
      console.error('Error getting image URI:', error);
      return null;
    }
  },

  async getImageMetadata() {
    try {
      const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE);
      if (!fileInfo.exists) {
        return {};
      }
      const metadataJson = await FileSystem.readAsStringAsync(METADATA_FILE);
      return JSON.parse(metadataJson);
    } catch (error) {
      console.error('Error reading image metadata:', error);
      return {};
    }
  },

  async saveImageMetadata(metadata:any) {
    try {
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving image metadata:', error);
    }
  }
};

export default ImageCacheService;
