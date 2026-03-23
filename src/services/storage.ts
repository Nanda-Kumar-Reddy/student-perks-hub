/**
 * Storage Service — Design mode placeholder until backend file storage is wired.
 */

export async function uploadFile(bucket: string, path: string, file: File) {
  return {
    bucket,
    path,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };
}

export function getPublicUrl(bucket: string, path: string) {
  return `/mock-storage/${bucket}/${path}`;
}

export async function deleteFile(bucket: string, path: string) {
  return {
    bucket,
    path,
    deleted: true,
  };
}
