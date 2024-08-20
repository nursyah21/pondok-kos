// @ts-ignore
import { useLocalStorage } from "@vueuse/core"

const penghuni = [
    '/logout',
    '/dashboard',
    '/dashboard/cari-kos',
    '/dashboard/laporan',
    '/dashboard/messages',
    '/dashboard/riwayat-transaksi',
    '/dashboard/edit-profile'
]
const penjaga = [
    '/logout',
    '/dashboard',
    '/dashboard/laporan',
    '/dashboard/messages',
    '/dashboard/riwayat-transaksi',
    '/dashboard/edit-profile',
    '/dashboard/penghuni',
    '/dashboard/verifikasi-penghuni'
]
const pemilik = [
    '/logout',
    '/dashboard',
    '/dashboard/riwayat-transaksi',
    '/dashboard/edit-profile',
    '/dashboard/penghuni',
    '/dashboard/verifikasi-penghuni',
    '/dashboard/manajemen-user',
    '/dashboard/penjaga',
    '/dashboard/kamar-kos',
    '/dashboard/unit-kos',
]
const guest = [
    '/', 
    '/cari-kos', 
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
            const data = await $fetch('/api/auth/verify',{
                headers: {
                    Authorization: `Bearer ${token}`
               },
                method: 'get'
            })
            role = data.data?.role
        } catch (error:any) {
            // console.error(new Date().toLocaleTimeString(), 'error', error.message)
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
  