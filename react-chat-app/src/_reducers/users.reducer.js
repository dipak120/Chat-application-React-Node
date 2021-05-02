import { userConstants } from '../_constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.DELETE_REQUEST:
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };
    case userConstants.DELETE_SUCCESS:
      return {
        items: state.items.filter(user => user.id == action.id)
      };
    case userConstants.DELETE_FAILURE:
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            const { deleting, ...userCopy } = user;
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        })
      };
      case userConstants.SEND_REQUEST:
        return {
          ...state,
          items: action.users
        };
      case userConstants.SEND_SUCCESS:
        return {
          ...state,
          items: action.users
        };
      case userConstants.SEND_FAILURE:
        return {
          error: action.error
        };

        case userConstants.ACCEPT_REQUEST:
          return {
            ...state,
            items: action.users
          };
        case userConstants.ACCEPT_SUCCESS:
          return {
            ...state,
            items: action.users
          };
        case userConstants.ACCEPT_FAILURE:
          return {
            ...state,
            error: action.error
  
          };
          case userConstants.GETALLUSERSLIST_REQUEST:
            return {
              ...state,
              items:''
            };
          case userConstants.GETALLUSERSLIST_SUCCESS:
            return {
              ...state,
              items: action.users
            };
          case userConstants.GETALLUSERSLIST_FAILURE:
            return {
              ...state,
              error: action.error
            };
    default:
      return state
  }
}