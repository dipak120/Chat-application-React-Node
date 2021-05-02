import { userConstants } from '../_constants';
export function getuserprofile(state = {}, action) {
  switch (action.type) {
    case userConstants.GETUSERPROFILE_REQUEST:
      return {
        ...state,
        items: ''
      };
    case userConstants.GETUSERPROFILE_SUCCESS:
      return {
        ...state,
        items: action.users
      };
    case userConstants.GETUSERPROFILE_FAILURE:
      return {
        error: action.error
      };
    default:
      return state
  }
}