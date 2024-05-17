import { localize } from '@deriv-com/translations';

export type TFile = File & { file: Blob };
export type TFileType = File & { file: File };

export const maxPotFileSize = 5242880;

/**
 * Convert bytes to MB
 * @param {number} bytes
 * @returns {number} MB
 */
export const convertToMB = (bytes: number): number => bytes / (1024 * 1024);

/**
 * Gets the supported file extensions from the filename
 * @param {string} filename
 * @returns {boolean} true if supported, false otherwise
 */
export const getPotSupportedFiles = (filename: string): boolean =>
    /^.*\.(png|PNG|jpg|JPG|jpeg|JPEG|pdf|PDF)$/.test(filename);

/**
 * Checks if the file type is an image
 * @param {string} type
 * @returns {boolean} true if image, false otherwise
 */
export const isImageType = (type: string): boolean => ['image/jpeg', 'image/png', 'image/gif'].includes(type);

/**
 * Checks if the file type is a pdf
 * @param {string} type
 * @returns {boolean} true if pdf, false otherwise
 */
export const isPDFType = (type: string): boolean => type === 'application/pdf';

/**
 * Checks if the file is too large
 * @param {TFile[]} files
 * @returns {boolean} true if file is too large, false otherwise
 */
const isFileTooLarge = (files: TFile[]): boolean => files?.length > 0 && files[0].file.size > maxPotFileSize;

/**
 * Checks if the file is supported
 * @param {TFile[]} files
 * @returns {boolean} true if file is supported, false otherwise
 */
const isFileSupported = (files: TFileType[]): boolean =>
    files.filter(eachFile => getPotSupportedFiles(eachFile.file.name))?.length > 0;

/**
 * Gets the error message for the file if it is not supported or too large
 * @param {TFile[]} files
 * @returns {string} error message
 */
export const getErrorMessage = (files: TFile[]): string =>
    isFileTooLarge(files) && isFileSupported(files as TFileType[])
        ? localize('Cannot upload a file over 5MB')
        : localize('The file you uploaded is not supported. Upload another.');

/**
 * Truncates the file name to a certain length
 * @param {TFile} file
 * @param {number} limit
 * @returns {string} truncated file name
 */
export const truncateFileName = (file: File, limit: number): string => {
    const stringLimitRegex = new RegExp(`(.{${limit || 30}})..+`);
    return file?.name?.replace(stringLimitRegex, `$1….${getFileExtension(file)}`);
};

/**
 * Gets the file extension
 * @param {TFile} file
 * @returns {string | null} file extension or null if not found
 */
const getFileExtension = (file: File): string | null => {
    const f = file?.type?.match(/[^/]+$/u);
    return f ? f[0] : null;
};

/**
 * The function renames the files by removing any non ISO-8859-1 code point from filename and returns a new blob object with the updated file name.
 * @param {TFile} file
 * @returns {Blob}
 */
export const renameFile = (file: TFile): File => {
    // eslint-disable-next-line no-control-regex
    const renamedFile = new File([file], file.name.replace(/[^\x00-\x7F]+/g, ''), { type: file.type });
    return renamedFile;
};
