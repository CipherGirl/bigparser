import { AxiosError } from 'axios';
import { getMultisheetMetadata } from '../../src/index';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(100000);

let TEST_GRID_ID: string;
let LINKED_DATA_TAB_GRID_ID: string;

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId, linkedDataTabGridId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
  LINKED_DATA_TAB_GRID_ID = linkedDataTabGridId;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};
describe('Get Headers', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Return Multigrid Metadata', async () => {
      // Given
      const response = {
        grids: [
          {
            gridId: TEST_GRID_ID,
            name: 'Test Grid',
            tabName: 'Test Grid',
            tabDescription: null,
            pinned: false,
          },
          {
            gridId: LINKED_DATA_TAB_GRID_ID,
            name: 'Linked Data Tab',
            tabName: 'Linked Data Tab',
            tabDescription: null,
            pinned: false,
          },
        ],
      };

      // When
      const { data: responseData, error: responseError } =
        await getMultisheetMetadata(TEST_GRID_ID);

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toMatchObject(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } =
        await getMultisheetMetadata('INVALID_GRID_ID');

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'share Id invalid',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await getMultisheetMetadata(TEST_GRID_ID, {
          shareId: 'INVALID_VIEW_ID',
        });
      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (prod)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await getMultisheetMetadata(TEST_GRID_ID, {
          authId: 'INVALID_AUTHID',
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (qa)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } =
        await getMultisheetMetadata(TEST_GRID_ID, {
          authId: 'INVALID_AUTHID',
          qa: true,
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
