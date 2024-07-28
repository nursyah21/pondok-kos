import { useLocalStorage } from "@vueuse/core"

// clear token
export const clearToken = () => {
    useLocalStorage('user_id', '').value = ''
}

// set token
export const setToken = (e:string) => {
    useLocalStorage('user_id', '').value = e
}

// get token
export const token = useLocalStorage('user_id', '').value