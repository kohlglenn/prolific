// make sure to update front-end constant as well
const bucket = {
    NONE: 'None',
    TODO: 'Todo', 
    RECURRING: 'Recurring', 
    INPROGRESS: 'In Progress', 
    BLOCKED: 'Blocked', 
    DONE: 'Done'
};
const progress = {
    NONE: 'None', 
    INPROGRESS: 'In Progress', 
    DONE: 'Done'
};
const priority = {
    LOW: 'Low', 
    MEDIUM: 'Medium', 
    HIGH: 'High'
};

module.exports = Enum = {
    bucket: bucket, 
    progress: progress, 
    priority: priority};