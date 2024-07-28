import { useLocalStorage } from "@vueuse/core"

const penghuni = [
    '/logout',
    '/dashboard',
    '/dashboard/find-kos',
    '/dashboard/laporan',
    '/dashboard/messages',
    '/dashboard/transaksi',
    '/dashboard/settings'
]
const penjaga = [
    '/logout',
    '/dashboard',
    '/dashboard/laporan',
    '/dashboard/messages',
    '/dashboard/transaksi',
    '/dashboard/settings',
    '/dashboard/penghuni',
    '/dashboard/penghuni/data-penghuni',
    '/dashboard/penghuni/data-verif',
    '/dashboard/pengeluaran'
]
const pemilik = [
    '/logout',
    '/dashboard',
    '/dashboard/laporan',
    '/dashboard/messages',
    '/dashboard/transaksi',
    '/dashboard/settings',
    '/dashboard/penghuni',
    '/dashboard/penghuni/data-penghuni',
    '/dashboard/penghuni/data-verif',
    '/dashboard/user',
    '/dashboard/user/data-penjaga',
    '/dashboard/user/data-user',
    '/dashboard/penjaga',
    '/dashboard/kos',
    '/dashboard/kos/data-kamar-kos',
    '/dashboard/kos/data-kos'
]
const guest = [
    '/', 
    '/unit-kos', 
    '/login', 
    '/register', 
    '/reset-password'
]
const token = useLocalStorage('user_id', '').value

export default defineNuxtRouteMiddleware(async (to, from) => {
    const redirect = (e:string) => {
        if(to.path != e) return navigateTo(e)
    }
    if (import.meta.client) {
        let role;
        const path = to.path;
        try {
            const data = await $fetch('/api/v2/public/verify',{
                headers: {
                    Authorization: `Bearer ${token}`
               },
                method: 'post'
            })
            role = data.data?.role
        } catch (error:any) {
            console.error(new Date().toLocaleTimeString(), 'error', error.message)
        }
        
        
        // redirect if already login
        if(role != undefined && guest.some(e=>path == e)){
            return redirect('/dashboard')
        }
        
        if(role != undefined){
            // it will return dashboard if we use
            // redirect based role
            if(role == 0){
                if(!penghuni.some(e=>e == path)) return redirect('/dashboard')
            }
            if(role == 1){
                if(!penjaga.some(e=>e == path)) return redirect('/dashboard')
            }
            if(role == 2){
                if(!pemilik.some(e=>e == path)) return redirect('/dashboard')
            }
        }

        // redirect if role is not found
        if(role == undefined && path.startsWith('/dashboard')){
            return redirect('/login')
        }
    }
    
})
  