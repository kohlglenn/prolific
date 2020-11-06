import axios from "axios";

import {
  GET_GROUP_BY_ID,
  GET_GROUPS_BY_USER_ID,
  CREATE_GROUP,
  DELETE_GROUP_BY_ID,
  UPDATE_GROUP_BY_ID
} from "./types";

// // Create Task
// export const createTask = taskData => dispatch => {
//   axios
//     .post("/api/tasks/create", taskData)
//     .then(res =>
//       dispatch({
//         type: CREATE_TASK,
//         payload: res.data
//       })
//     )
//     .catch(err => console.log(err));
// };

// Get groups by user id
export const getGroups = id => dispatch => {
  return axios
    .get(`/api/groups/users/${id}`)
    .then(res => {
      // res returns a list groups, defined in models/groups in the backend
      let groupPromise = [];

      // for each user within each group, get the Promise containing user details and put it in groupPromise
      res.data.map(group => {
        return group.users.forEach(u => {
           groupPromise.push(axios.get(`/api/users/${u}`));
        })
      });
      return Promise.all(groupPromise).then(users => {
        // augment each 'user' in a group with additional information
        let groupsWithUsers = res.data;
        let formattedUsers = users.map(u => u.data);
        groupsWithUsers = groupsWithUsers.map(group => {
          let groupUsersWithInfo = group.users.map(id => formattedUsers.find(u => u.id === id) ? formattedUsers.find(u => u.id === id) : {id: id, name: "NAME NOT FOUND ERR: GROUPACTIONS"});
          return ({...group, users: groupUsersWithInfo});
        });
        dispatch({
          type: GET_GROUPS_BY_USER_ID,
          payload: groupsWithUsers,
        });
        return Promise.resolve(res);
      })
    })
    .catch(err => {
      dispatch({
        type: GET_GROUPS_BY_USER_ID,
        payload: null
      });
      return Promise.reject(err);
    }
    );
};

// // Delete Task
// export const deleteTask = id => dispatch => {
//   axios
//     .delete(`/api/tasks/delete/${id}`)
//     .then(res =>
//       dispatch({
//         type: DELETE_TASK,
//         payload: id
//       })
//     )
//     .catch(err => console.log(err));
// };

// // Update Task
// export const updateTask = taskData => dispatch => {
//   axios
//     .patch("/api/tasks/update", taskData)
//     .then(res =>
//       dispatch({
//         type: UPDATE_TASK,
//         payload: res.data
//       })
//     )
//     .catch(err => console.log(err));
// };

// // Tasks loading
// export const setTasksLoading = () => {
//   return {
//     type: TASKS_LOADING
//   };
// };