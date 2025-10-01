import { generateRideBlueprint, prepareAudioPart } from './geminiService';
import { analyzeAudio } from '../lib/audioProcessor';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('../config', () => ({
    config: {
        apiKey: 'test-api-key',
    },
}));

const mockGenerateContent = jest.fn();
const mockUploadFile = jest.fn();
const mockCountTokens = jest.fn();

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn(() => ({
            generateContent: mockGenerateContent,
            countTokens: mockCountTokens,
        })),
        files: {
            uploadFile: mockUploadFile,
        },
    })),
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

            const genAI = new GoogleGenerativeAI('test-key');
            const part = await prepareAudioPart(genAI, smallFile);

            expect(part).toHaveProperty('inlineData');
            expect(mockUploadFile).not.toHaveBeenCalled();
        });

        it('should use file upload for large files', async () => {
            const largeFile = new File([''], 'large.mp3', { type: 'audio/mpeg' });
            Object.defineProperty(largeFile, 'size', { value: 30 * 1024 * 1024 }); // 30MB

            mockUploadFile.mockResolvedValue({
                file: {
                    uri: 'gs://file-uri',
                    name: 'large.mp3',
                    mimeType: 'audio/mpeg'
                }
            });

            const genAI = new GoogleGenerativeAI('test-key');
            const part = await prepareAudioPart(genAI, largeFile);

            expect(part).toHaveProperty('fileData');
            expect(mockUploadFile).toHaveBeenCalledTimes(1);
        });
    });

    describe('generateRideBlueprint', () => {
        it('should generate a ride blueprint successfully', async () => {
            const mockBlueprint = { rideName: 'Test Ride', track: [], palette: ['#ffffff', '#ffffff', '#ffffff'], moodDescription: 'A test ride' };
            mockGenerateContent.mockResolvedValue({
                response: {
                    text: () => JSON.stringify(mockBlueprint),
                },
            });

            const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
            const blueprint = await generateRideBlueprint(file, 120, 120, 0.5, 1500, 0.2);

            expect(blueprint).toEqual(expect.objectContaining(mockBlueprint));
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
        });

        it('should throw an error for invalid JSON response', async () => {
            mockGenerateContent.mockResolvedValue({
                response: {
                    text: () => 'invalid json',
                },
            });
            const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
            await expect(generateRideBlueprint(file, 120, 120, 0.5, 1500, 0.2)).rejects.toThrow('The AI returned malformed data.');
        });
    });
});