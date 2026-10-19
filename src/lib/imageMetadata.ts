/**
 * Browser-side metadata removal for sigil uploads.
 *
 * Decoding the image and redrawing it into a canvas at the same pixel
 * dimensions, then re-encoding in the original format, drops EXIF/XMP/GPS and
 * other embedded metadata. It is a privacy mitigation only: the contributor's
 * browser performs it, so it cannot be trusted as a server-side security
 * control, and it may change file size (PNG output can be far larger than the
 * JPEG source). Callers must re-check the size limit on the returned Blob.
 */

const MAX_PIXEL_COUNT = 40_000_000;

const SUPPORTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export class ImageMetadataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageMetadataError";
  }
}

export interface SanitisedImage {
  blob: Blob;
  width: number;
  height: number;
}

export async function removeImageMetadata(file: File): Promise<SanitisedImage> {
  const mimeType = file.type.toLowerCase();
  if (!SUPPORTED_TYPES.has(mimeType)) {
    throw new ImageMetadataError(
      "The image format is not one we can re-encode safely."
    );
  }
  if (typeof createImageBitmap !== "function") {
    throw new ImageMetadataError(
      "This browser cannot decode the image for metadata removal."
    );
  }

  let bitmap: ImageBitmap;
  try {
    // "from-image" applies the EXIF orientation before the metadata is dropped,
    // so a rotated phone photo is not silently sideways after re-encoding.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new ImageMetadataError(
      "The image could not be decoded, so its metadata could not be removed."
    );
  }

  try {
    if (bitmap.width * bitmap.height > MAX_PIXEL_COUNT) {
      throw new ImageMetadataError(
        "The image exceeds 40,000,000 pixels and cannot be processed."
      );
    }

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new ImageMetadataError(
        "The browser could not create a drawing surface for metadata removal."
      );
    }

    if (mimeType === "image/jpeg") {
      // JPEG has no alpha channel; paint white rather than letting any
      // transparent pixels render black.
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        resolve,
        mimeType,
        mimeType === "image/png" ? undefined : 0.92
      );
    });

    if (!blob) {
      throw new ImageMetadataError(
        "The browser could not re-encode the image after removing metadata."
      );
    }

    return { blob, width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close?.();
  }
}
