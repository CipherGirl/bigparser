import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, DeleteQueryObject, MethodConfig } from './types';

export async function deleteByQuery<GridDataModel>(
  deleteQueryObj: DeleteQueryObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.delete(
      gridURL('rows/delete_by_queryObj', gridId, viewId, qa),
      authId != null
        ? { headers: { authId }, data: deleteQueryObj }
        : { ...CONFIG, data: deleteQueryObj }
    )
  );
}
