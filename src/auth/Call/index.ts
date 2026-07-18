import axios from 'axios'

export let navigationController = new AbortController()

export const abortAllApiRequests = () => {
  navigationController.abort()
  navigationController = new AbortController()
}

export const MAXIMUM_RETRY = 2

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10_000,
})
