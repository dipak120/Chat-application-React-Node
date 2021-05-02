import { userConstants } from '../_constants';

export function addedPassword(state = {}, action) {
  switch (action.type) {
    case userConstants.CREATEPASS_REQUEST:
      return { createpass: true };
    case userConstants.CREATEPASS_SUCCESS:
      return {};
    case userConstants.CREATEPASS_FAILURE:
      return {};
    default:
      return state
  }
}

