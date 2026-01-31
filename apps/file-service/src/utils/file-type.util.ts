import { FileType } from "../models/file.model";

export function determineFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) {
        return FileType.IMAGE;
    }

    if (mimeType.startsWith('video/')) {
        return FileType.VIDEO;
    }

    if (mimeType.startsWith('audio/')) {
        return FileType.AUDIO;
    }

    switch (mimeType) {
        case 'application/epub+zip':
            return FileType.EBOOK;

        case 'application/pdf':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'text/plain':
        case 'text/csv':
            return FileType.DOCUMENT;

        case 'application/zip':
        case 'application/x-rar-compressed':
        case 'application/x-7z-compressed':
            return FileType.ARCHIVE;

        default:
            return FileType.OTHER;
    }
}
