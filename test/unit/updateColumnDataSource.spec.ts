import mockAxios from "jest-mock-axios";
import {
  updateColumnDataSource,
  UpdateColumnDataSourceObject,
} from "../../src/index";
import { TestGrid } from "../__grids__/TestGrid";

const { TEST_GRID_ID, BP_AUTH } = process.env;
const updateColumnDataSourceObject: UpdateColumnDataSourceObject<TestGrid> = {
  columns: [
    {
      columnDataSource: {
        columnNames: ["Number Column", "Number 2 Column"],
        functionType: "AVG",
      },
      columnName: "Formula Column",
    },
  ],
};

describe("Update Column Data Source", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe("Positive Test Cases", () => {
    it("Axios Returns Successfully", async () => {
      // Given
      const gridResponse = {};

      // When
      const updateColumnDataSourcePromise = updateColumnDataSource<TestGrid>(
        updateColumnDataSourceObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await updateColumnDataSourcePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_dataSource`,
        updateColumnDataSourceObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
  });
  describe("Negative Test Cases", () => {
    it("Axios Returns Error", async () => {
      // Given
      const errorObject = {
        err: {
          message: "Invalid Auth Id",
          statusCode: 403,
        },
      };

      // When
      const updateColumnDataSourcePromise = updateColumnDataSource<TestGrid>(
        updateColumnDataSourceObject,
        TEST_GRID_ID,
        {
          authId: "INVALID_AUTHID",
        }
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await updateColumnDataSourcePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_dataSource`,
        updateColumnDataSourceObject,
        {
          headers: {
            authId: "INVALID_AUTHID",
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});