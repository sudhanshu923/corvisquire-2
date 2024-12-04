import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.DOMAIN || "http://localhost:3000";

interface PutOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

export async function PUT(route: string, values: any, options: PutOptions = {}) {

    try {

        const response = await axios.put(route, values, {

            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            params: options.params

        });

        (response?.status >= 200 && response?.status < 300) && toast.success(response?.data.message)

        return response;

    } catch (error) {

        const err = axios.isAxiosError(error) ? error?.response?.data?.message : "Oops! We couldn't process your request at the moment. Please try again later."

        toast.error(err)

    }
}