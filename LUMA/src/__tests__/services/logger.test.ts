import { logger } from "@/services/logger";

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockConsoleInfo = jest.spyOn(console, "info").mockImplementation();
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("Logger Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("in development mode", () => {
        beforeAll(() => {
            Object.defineProperty(process.env, "NODE_ENV", {
                value: "development",
                writable: true,
                configurable: true
            });
        });

        it("should log debug messages", () => {
            logger.debug("Test debug message");
            expect(mockConsoleLog).toHaveBeenCalled();
        });

        it("should log info messages", () => {
            logger.info("Test info message");
            expect(mockConsoleInfo).toHaveBeenCalled();
        });

        it("should log warning messages", () => {
            logger.warn("Test warning message");
            expect(mockConsoleWarn).toHaveBeenCalled();
        });

        it("should log error messages", () => {
            logger.error("Test error message");
            expect(mockConsoleError).toHaveBeenCalled();
        });

        it("should log form submissions", () => {
            const formData = { name: "Test", email: "test@test.com" };
            logger.formSubmission("TestForm", formData);
            expect(mockConsoleInfo).toHaveBeenCalled();
        });

        it("should include data in log output", () => {
            const testData = { key: "value" };
            logger.debug("Test message", testData);
            expect(mockConsoleLog).toHaveBeenCalledWith(
                expect.stringContaining("[DEBUG]"),
                expect.objectContaining(testData)
            );
        });
    });

    describe("log format", () => {
        it("should include timestamp in log output", () => {
            logger.info("Test message");
            expect(mockConsoleInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T/),
                expect.anything()
            );
        });

        it("should include log level in output", () => {
            logger.warn("Test warning");
            expect(mockConsoleWarn).toHaveBeenCalledWith(
                expect.stringContaining("[WARN]"),
                expect.anything()
            );
        });
    });
});
