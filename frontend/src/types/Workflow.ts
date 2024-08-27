import Task from "./Task";

export type Workflow = {
    id: number;
    name: string;
    trigger: string;
    tasks: Task[];
};

export default Workflow;