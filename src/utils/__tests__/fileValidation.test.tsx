import { describe, it, expect } from 'vitest';
import { validateMedicalFile, formatFileSize } from '../fileValidation';

describe('fileValidation', () => {
  describe('validateMedicalFile', () => {
    it('validates PNG files correctly', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      const result = validateMedicalFile(file);
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid file types', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      const result = validateMedicalFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please upload only PNG, JPG, or JPEG files.');
    });

    it('rejects files larger than 2MB', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }); // 3MB
      
      const result = validateMedicalFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size should not exceed 2MB.');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });
});