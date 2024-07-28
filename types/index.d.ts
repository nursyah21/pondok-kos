type id_Owner = {
    message: {
        id: string
    }
}
type Chart = {
    description?: string
    options: any
    series: any
}

type Res = {
    status: string
    data?: any
    message: string
}

type Kos = {
    name: string
    location: string
    description: string
    image: string
    available: number
    id: string
    price: number
}

type DataDashboard = {
    totalPenghuni: string
    totalPenjaga: string
    totalKamarKos: string
    pendapatan: number // because it will use function to rupiah
    chartPiePenghuni: Chart,
    chartBarPendapatan: Chart,
    chartLineTransaksi: Chart,
}

type ModeCrud = 'add' | 'edit' | 'delete'
type Data = Ref<any[]>
type Status = 'fail' | 'success'

type Profile = {
    name: string
    role: number
    number_phone: string
    verified: boolean
    avatar?: string | null | undefined
    id_card?: string | null |undefined
    birthdate: string | Date
    address: string
}

interface ErrorMessage  {
    data?: {
        message: string
    },
    message: string
}