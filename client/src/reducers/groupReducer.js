import {
  GET_GROUP_BY_ID,
  GET_GROUPS_BY_USER_ID,
  CREATE_GROUP,
  DELETE_GROUP_BY_ID,
  UPDATE_GROUP_BY_ID
} from "../actions/types";

const initialState = {
  groups: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_GROUPS_BY_USER_ID:
      return ({
        ...state,
        groups: action.payload
      });
    default:
      return state;
    // case CREATE_TASK:
    //   return {
    //     ...state,
    //     tasks: [...state.tasks, action.payload]
    //   };
    // case GET_TASKS:
    //   return {
    //     ...state,
    //     tasks: action.payload,
    //     tasksLoading: false
    //   };
    // case UPDATE_TASK:
    //   let index = state.tasks.findIndex(
    //     task => task._id === action.payload._id
    //   );

    //   let tasks = JSON.parse(JSON.stringify(state.tasks));
    //   tasks.splice(index, 1, action.payload);

    //   return {
    //     ...state,
    //     tasks: tasks
    //   };
    // case DELETE_TASK:
    //   return {
    //     ...state,
    //     tasks: state.tasks.filter(task => task._id !== action.payload)
    //   };
    // case TASKS_LOADING:
    //   return {
    //     ...state,
    //     tasksLoading: true
    //   };
  }
}