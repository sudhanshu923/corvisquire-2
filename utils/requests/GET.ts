import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.DOMAIN || "http://localhost:3000";

interface GetOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

export async function GET(route: string, options: GetOptions = {}) {

    try {

        const response = await axios.get(route, {

            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            params: options.params

        });

        return response;

    } catch (error) {

        const err = axios.isAxiosError(error) ? error?.response?.data?.message : "Oops! We couldn't process your request at the moment. Please try again later."

        toast.error(err)

    }

}