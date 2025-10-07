
import ImageKit from 'imagekit-javascript';
import { ImageKitUploadResponse } from '../types';
import { apiClient } from '../services/api';
import { config } from '../../config';

// export const imagekit = new ImageKit({
//   publicKey: "your_public_key_here",
//   urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
// });

export const uploadToImageKit = async (
  file: File,
  authenticationEndpoint: string
): Promise<ImageKitUploadResponse> => {
  // Fetch authentication parameters from your backend
  const authRes = await apiClient.get<{ signature: string; token: string; expire: number }>(authenticationEndpoint);
  if (authRes.status < 200 || authRes.status >= 300) {
    throw new Error("Failed to get ImageKit authentication parameters");
  }
  const { signature, token, expire } = authRes.data;

  return new Promise((resolve, reject) => {
    const imagekit = new ImageKit({
      publicKey: config.imageKitPublicKey,
      urlEndpoint: config.imageKitUrlEndpoint,
    });

    imagekit.upload(
      {
        file: file,
        fileName: file.name,
        folder: "/medical-prescriptions", // Optional: organize files
        tags: ["prescription"], // Optional: add tags
        signature,
        token,
        expire,
      },
      (err: unknown, result: ImageKitUploadResponse | null) => {
        if (err) {
          reject(err);
        } else if (result) {
          resolve({
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            thumbnailUrl: result.thumbnailUrl || result.url,
          });
        }
      }
    );
  });
};