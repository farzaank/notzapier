export type Task = {
    name: string;
    provider: string;
    needsKey: boolean;
    params?: Record<string, string>;
};

export default Task;