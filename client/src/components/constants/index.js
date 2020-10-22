export const COLORS = {
    gray: "#e9e9e9",
    gray800: "rgb(45, 55, 72)",
    orange500: "rgb(237,137,54)",
    red500: "rgb(245,101,101)",
    red800: "rgb(155,44,44)",
    blue500: "rgb(66,153,225)",
    green500: "rgb(72, 187, 120)"
};

// make sure to update models as well
export const bucket = {
    NONE: 'None',
    TODO: 'Todo', 
    RECURRING: 'Recurring', 
    INPROGRESS: 'In Progress', 
    BLOCKED: 'Blocked', 
    DONE: 'Done'
};
export const progress = {
    NONE: 'None', 
    INPROGRESS: 'In Progress', 
    DONE: 'Done'
};
export const priority = {
    LOW: 'Low', 
    MEDIUM: 'Medium', 
    HIGH: 'High'
};

export const incrementProgress = p => {
    const NEXT_PROGRESS = {
        [progress.NONE]: progress.INPROGRESS,
        [progress.INPROGRESS]: progress.DONE,
        [progress.DONE]: progress.NONE
    };
    return NEXT_PROGRESS[p];
};