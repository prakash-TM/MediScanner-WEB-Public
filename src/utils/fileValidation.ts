export const validateMedicalFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please upload only PNG, JPG, or JPEG files.",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size should not exceed 5MB.",
    };
  }

  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
