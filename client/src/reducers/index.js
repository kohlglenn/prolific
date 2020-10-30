import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import taskReducer from "./taskReducer";
import groupReducer from "./groupReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  tasks: taskReducer,
  groups: groupReducer
});