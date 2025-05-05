import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIResponseModel } from "../types/APIResponseModel";


interface fetchDataType<T> {
    data: T;
    error: string | null;
    loading: boolean;
    fetchAgain: (signal: any) => void;
}


const useFetch = <T>(fetchService: Function): fetchDataType<T> => {
    const [fetchedData, setFetchedData] = useState<fetchDataType<T>>({
        data: [] as T,
        error: null,
        loading: false,
        fetchAgain: fetchData
    });
    const navigate = useNavigate();
    const unAuthorizeHandle = () => {
        localStorage.clear();
        navigate("/login");
    }
    async function fetchData(signal: any) {
        setFetchedData((prev: fetchDataType<T>) => ({
            ...prev,
            loading: true,
            error: null
        }))
        const response: APIResponseModel<T> = await fetchService(signal);
        if (response.status === 401) {
            unAuthorizeHandle();
            return;
        }
        if (response.status !== 200) {
            setFetchedData((prev: fetchDataType<T>) => ({
                ...prev,
                loading: false,
                error: "Failed to fetch content",
            }));
            return;
        }
        setFetchedData((prev: fetchDataType<T>) => {
            return {
                ...prev,
                loading: false,
                data: response.data!
            }

        })
    }
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetchData(signal);
        return () => {
            controller.abort();
        }
    }, []);

    return { data: fetchedData.data, loading: fetchedData.loading, error: fetchedData.error, fetchAgain: fetchedData.fetchAgain };
}
export default useFetch;