import cloudinary from "./cloudinary";

// ============= رفع الميديا =============
export const uploadMedia = async (file: File, folder: string) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder },
      (error: any, result: any) => {
        if (error) {
          return reject(error.message || error);
        }
        return resolve(result);
      }
    );
    uploadStream.end(bytes);
  });
};

// ============= حذف الميديا =============
export const deleteMedia = async (public_id: string) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("Deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};
