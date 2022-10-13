import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookies";
import { fetchGraphQL } from "../utils/gqlHelper";
import useUser from "./user";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const TASK_STATUS = {
    INPROGRSS: 'in-progress',
    COMPLETED: 'complete',
    OPEN: 'open',
}

export const useTasksByGroup = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const query = `
        {
        groups(filter: {id: { eq: 1 }}) {
          tasks {
            groupId
            id
          }
          id
        }`
    useEffect(() => {
        if (!tempData) {
            tempData = allTasks();
        }
        tempData.then(setData).finally(() => setIsLoading(false));
    }, [])

    return { data, isLoading, setData };
}

export const useTaskGroups = () => {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const user = useUser();
    useEffect(() => {
        (async () => {
            try {
                const query = `
                {
                    groups {
                        id
                        name
                        tasks {
                            id
                            title
                            status
                        }
                    }
                }`
                const data = await fetchGraphQL(query, user)
                setData(data.data.groups);
            } catch (error) {
                console.error(error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { data, isLoading, error, setData };
}

export function useAddTask() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('initial');
    const [error, setError] = useState();
    const user = useUser();

    const addTask = async (newTask) => {
        setIsLoading(true);
        setData(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                headers: {
                    Authorization: `bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(newTask), // body data type must match "Content-Type" header
            });
            if (!response.ok) {
                setError(response);
                console.error(response);
                setStatus('error');
            }
            const data = await response.json();
            setData(data);
            setStatus('success');
        } catch (error) {
            setError(error);
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    }
    return {
        addTask, data, isLoading, error, isSuccess: status === 'success', isError: status === 'error'
    }
}

export function useUpdateTask() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('initial');
    const [error, setError] = useState();
    const user = useUser();

    const updateTask = async (updatedTask, { onSuccess }) => {
        setIsLoading(true);
        setData(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${updatedTask.id}`, {
                headers: {
                    Authorization: `bearer ${user.accessToken}}`,
                    'Content-Type': 'application/json'
                },
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(updatedTask), // body data type must match "Content-Type" header
            });
            if (!response.ok) {
                setError(response);
                console.error(response);
                setStatus('error');
            }
            const data = await response.json();
            setData(data);
            setStatus('success');
            onSuccess(data);
        } catch (error) {
            setError(error);
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    }
    return {
        updateTask, data, isLoading, error, isSuccess: status === 'success', isError: status === 'error'
    }
}

export function useDeleteTask() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('initial');
    const [error, setError] = useState();
    const user = useUser();

    const deleteTask = async (task, { onSuccess }) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
                headers: {
                    Authorization: `bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            });
            if (!response.ok) {
                setError(response);
                console.error(response);
                setStatus('error');
            }
            setStatus('success');
            onSuccess(task);
        } catch (error) {
            setError(error);
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    }
    return {
        deleteTask, isLoading, error, isSuccess: status === 'success', isError: status === 'error'
    }
}

export function useMoveTask() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('initial');
    const [error, setError] = useState();
    const user = useUser();

    const moveTask = async (movingTask, destinationGroupId, { onSuccess }) => {
        setIsLoading(true);
        setData(null);
        const payload = {
            groupId: movingTask.id,
            newGroupId: destinationGroupId
        }
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${movingTask.id}/change-group`, {
                headers: {
                    Authorization: `bearer ${user.accessToken}}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(payload), // body data type must match "Content-Type" header
            });
            if (!response.ok) {
                setError(response);
                console.error(response);
                setStatus('error');
            }
            const data = await response.json();
            setData(data);
            setStatus('success');
            onSuccess(data);
        } catch (error) {
            setError(error);
            console.error(error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    }
    return {
        moveTask, data, isLoading, error, isSuccess: status === 'success', isError: status === 'error'
    }
}