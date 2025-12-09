/// <reference types="jest" />

const logMock = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
};

jest.mock('@shared/utils/logger/logger.util', () => {
    return { Log: logMock, __esModule: true };
});

export const resetLogMock = (): void => {
    logMock.debug.mockReset();
    logMock.info.mockReset();
    logMock.warn.mockReset();
};
