import { userConstants } from '../_constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.SEND_REQUEST:
      return { requestsent: true };
    case userConstants.SEND_SUCCESS:
      return {};
    case userConstants.SEND_FAILURE:
      return {};
    default:
      return state
  }
}