import { userConstants } from '../_constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true,
        usersProfile: false 
      };
    case userConstants.REGISTER_SUCCESS:
      return { usersProfile: action.user };
    case userConstants.REGISTER_FAILURE:
      return {};
    case userConstants.UPDATE_PROFILE_REQUEST:
      return { registering: true,usersProfile: false};
    case userConstants.UPDATE_PROFILE_SUCCESS:
      return { usersProfile: action.user };
    case userConstants.UPDATE_PROFILE_FAILURE:
      return {};
    default:
      return state
  }
}