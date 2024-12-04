import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.DOMAIN

interface PostOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
}

export async function POST(route: string, values: any, options: PostOptions = {}) {

    try {

        const response = await axios.post(route, values, {

            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            params: options.params

        });

        (response?.status >= 200 && response?.status < 300) && toast.success(response?.data.message)

        return response

    } catch (error) {

        const err = axios.isAxiosError(error) ? error?.response?.data?.message : "Oops! We couldn't process your request at the moment. Please try again later."

        toast.error(err)

    }

}