import { AxiosError } from 'axios';
import { deleteGrid } from '../../src/index';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let TEST_GRID_ID: string;

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};

describe('addColumn', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Metadata of File Deleted', async () => {
      // When
      const {
        data: { fileId },
      } = await getGridMetadata(TEST_GRID_ID);
      const { data, error } = await deleteGrid(fileId);

      // Then
      expect(error).toEqual(undefined);
      expect(data).toEqual('');
    });
  });
  describe('Negative Test Cases', () => {
    it('Rejects Invalid Auth Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'You are not authorized to this grid.',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const {
        data: { fileId },
      } = await getGridMetadata(TEST_GRID_ID);

      const { data, error } = await deleteGrid(fileId, {
        authId: 'INVALID_AUTHID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
  it('Should Reject Invalid Auth Id', async () => {
    // Given
    const errorObject = {
      errorMessage: 'authId is invalid',
      otherDetails: {},
      errorType: 'AUTHERROR',
      recoverable: true,
    };

    // When
    const {
      data: { fileId },
    } = await getGridMetadata(TEST_GRID_ID);
    const { data, error } = await deleteGrid(fileId, {
      authId: 'INVALID_AUTHID',
    });

    // Then
    expect(data).toEqual(undefined);
    expect((error as AxiosError).response.data).toEqual(errorObject);
  });
});
