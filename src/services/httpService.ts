import axios from "axios"
import { getStoredAuth } from "../utils/AuthDataStore"
import type { Headers } from "../types/HTTP"

export function createApiInstance() {
    const authData = getStoredAuth()

    const headers: Headers = {
        "Accept": "application/json"
    }

    if(authData.token) {
        headers["Authorization"] = `Bearer ${authData.token}`
    }

    const baseURL = import.meta.env.VITE_SERVER_URL

    if(!baseURL) throw new Error("URL do servidor não informada!")

    const api = axios.create({
        baseURL,
        headers
    })

    return api
}
