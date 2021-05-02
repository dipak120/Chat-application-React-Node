import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { addedPassword } from './createpass.reducer';
import { getuserprofile } from './getuserprofile.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  addedPassword,
  getuserprofile
});

export default rootReducer;