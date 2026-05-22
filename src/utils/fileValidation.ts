export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_FILES = 25;

export function validateFiles(files: File[]) {
  if (files.length === 0) {
    return {
      valid: false,
      message: "Please select images",
    };
  }

  if (files.length > MAX_FILES) {
    return {
      valid: false,
      message: `Maximum ${MAX_FILES} images allowed`,
    };
  }

  for (const file of files) {
    if (file.type !== "image/jpeg") {
      return {
        valid: false,
        message: "Only JPG images are supported",
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: "Each image must be under 20MB",
      };
    }
  }

  return {
    valid: true,
    message: "",
  };
}
