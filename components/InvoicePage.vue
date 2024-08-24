<template>
	<div class="mb-4 flex flex-col justify-between sm:flex-row gap-y-4 sm:gap-y-0 ">
	                <div>
	                    <h1 class="text-2xl font-bold text-green-600">
	                        Pondok kos jaya
	                    </h1>
	                    <h1 class="text-slate-600 dark:text-slate-200 dark:text-slate-200 text-sm">
	                        Jl. Gn. Galunggung 2 No.4, RT.47 <br />
	                        Tenggarong, Kalimantan timur <br />
	                        0852-5057-9806
	                    </h1>
	                </div>
	                <div class="sm:text-end">
	                    <h1 class="text-2xl font-bold text-blue-900">
	                        Invoice
	                    </h1>
	                    <h1 class="text-slate-600 dark:text-slate-200 dark:text-slate-200 text-sm">
	                        #{{ data.order_id.split('_')[2] }}
	                    </h1> 
	                </div>
	            </div>
	            <div >
	                <h1 class="font-bold">Ditujukan untuk</h1> 
	                <table class="text-sm mb-4">
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Pembeli</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ data.user_name }}</td>
	                    </tr>
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Telepon</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ data.user_phone }}</td>
	                    </tr>
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Tanggal Masuk</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ moment(data.tgl).format('DD-MM-YYYY') }}</td>
	                    </tr>
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Tanggal Keluar</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ moment(getNextDate(data.duration)).format('DD-MM-YYYY') }}</td>
	                    </tr>
	                </table>
	
	
	                <h1 class="font-bold">Diterbitkan oleh</h1> 
	                <table class="text-sm mb-4">
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Penjual</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ data.admin_name }}</td>
	                    </tr>
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Telepon</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ data.admin_phone }}</td>
	                    </tr>
	                    <tr class="text-slate-600 dark:text-slate-200">
	                        <td>Metode</td>
	                        <td class="px-2">:</td>
	                        <td class="text-slate-800 font-bold">{{ data.method_payment }}</td>
	                    </tr>
	                </table>
	
	                <hr class="h-2"/>
	                <table class="w-full">
	                    <tr class="font-bold">
	                        <td>Deskripsi</td>
	                        <td>Durasi (hari)</td>
	                        <td>Harga</td>
	                    </tr>
	                    <tr class="text-sm bg-slate-100">
	                        <td>{{data.name_kos}} - {{ data.name_kamar }} 
	                             </td>
	                        <td>{{data.duration}}</td>
	                        <td>{{ formatRupiahIntl(data.price) }}</td>
	                    </tr>
	                </table>
	
	                <h1 class="text-2xl font-bold text-blue-900 mt-2 text-end">{{ formatRupiahIntl(data.price) }}</h1>                
	                
	            </div>
</template>

<script setup lang="ts">
import moment from 'moment';
defineProps<{ 
	data: any;
	moment: typeof moment;
	getNextDate: (day: number) => string;
	formatRupiahIntl: (number: number) => string;
}>()
</script>
