import { GoogleGenAI } from '@google/genai';
import { generateRideBlueprintWithAI, prepareAudioPart } from './geminiService';
import { analyzeAudio } from '../lib/audioProcessor';

jest.mock('../config', () => ({
    config: {
        apiKey: 'test-api-key',
    },
}));

const mockGenerateContent = jest.fn();
const mockUpload = jest.fn();

jest.mock('@google/genai', () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        files: {
            upload: mockUpload,
        },
        models: {
            generateContent: mockGenerateContent,
        },
    })),
    HarmCategory: {
        HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
        HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
        HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    },
    HarmBlockThreshold: {
        BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    Type: {
        OBJECT: 'OBJECT',
        ARRAY: 'ARRAY',
        STRING: 'STRING',
        INTEGER: 'INTEGER',
        NUMBER: 'NUMBER',
    },
}));

jest.mock('../lib/audioProcessor');

describe('geminiService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (analyzeAudio as jest.Mock).mockResolvedValue({
            duration: 120,
            bpm: 120,
            energy: 0.5,
            spectralCentroid: 1500,
            spectralFlux: 0.2,
        });
    });

    describe('prepareAudioPart', () => {
        it('should use inline upload for small files', async () => {
            const smallFile = new File([''], 'small.mp3', { type: 'audio/mpeg' });
            Object.defineProperty(smallFile, 'size', { value: 1024 * 1024 }); // 1MB

            const ai = new GoogleGenAI({ apiKey: 'test-key' });
            const part = await prepareAudioPart(ai, smallFile);

            expect(part).toHaveProperty('inlineData');
            expect(mockUpload).not.toHaveBeenCalled();
        });

        it('should use file upload for large files', async () => {
            const largeFile = new File([''], 'large.mp3', { type: 'audio/mpeg' });
            Object.defineProperty(largeFile, 'size', { value: 30 * 1024 * 1024 }); // 30MB

            mockUpload.mockResolvedValue({ uri: 'gs://file-uri', name: 'large.mp3', mimeType: 'audio/mpeg' });

            const ai = new GoogleGenAI({ apiKey: 'test-key' });
            const part = await prepareAudioPart(ai, largeFile);

            expect(part).toHaveProperty('fileData');
            expect(mockUpload).toHaveBeenCalledTimes(1);
        });
    });

    describe('generateRideBlueprintWithAI', () => {
        it('should generate a ride blueprint successfully', async () => {
            const mockBlueprint = { rideName: 'Test Ride', track: [], palette: ['#ffffff', '#ffffff', '#ffffff'], moodDescription: 'A test ride' };
            mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockBlueprint) });

            const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
            const blueprint = await generateRideBlueprintWithAI(file, 120, 120, 0.5, 1500, 0.2);

            expect(blueprint).toEqual(expect.objectContaining(mockBlueprint));
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
        });

        it('should throw an error for invalid JSON response', async () => {
            mockGenerateContent.mockResolvedValue({ text: 'invalid json' });
            const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
            await expect(generateRideBlueprintWithAI(file, 120, 120, 0.5, 1500, 0.2)).rejects.toThrow('The AI returned malformed data.');
        });
    });
});
