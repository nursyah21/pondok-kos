import { formatRupiahIntl } from "~/utils/formatRupiah";

export default defineEventHandler(async (event) => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        checkBooking()
        const refreshTokens = await RefreshTokens.findOne({ token })

        if (!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')

        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        // const { role } = user

        let data: DataDashboard;
        data = {
            totalPenghuni: "32",
            totalPenjaga: "4",
            totalKamarKos: "12",
            pendapatan: 123000,
            chartPiePenghuni: {
                description: "Total Penghuni 15 orang",
                options: {
                    chart: {
                        type: 'donut',
                    },
                    responsive: [{
                        // breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                                height: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                    labels: ['Kos Arsapati', 'Kos Beringin'],
                    dataLabels: {
                        enabled: false,
                    },
                    theme: {
                        mode: 'light', 
                        palette: 'palette1', 
                        monochrome: {
                            enabled: false,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        },
                    }
                },
                series: [10, 5]
            },
            chartBarPendapatan: {
                description: "Total Penghuni 15 orang",
                options: {
                    chart: {
                        type: 'donut',
                    },
                    responsive: [{
                        // breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                                height: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                    labels: ['Kos Arsapati', 'Kos Beringin'],
                    dataLabels: {
                        enabled: false
                    }
                },
                series: [10, 5]
            },
            chartLineTransaksi: {
                description: `Total Transaksi ${[10, 41, 35, 51, 49, 62, 69, 91, 148].reduce((a, b) => a + b)}`,
                options: {
                    chart: {
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    title: {
                        text: 'Transaksi per bulan',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    },
                    colors: [
                        '#ca8a04'
                    ],
                    responsive: [{
                        // breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                                height: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                },
                series: [{
                    name: "Transaksi",
                    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
                }]
            }
        }

        return { status: 'success', data }
    } catch (error: any) {
        event.node.res.statusCode = 400
        writeError(error.message)

        return { status: 'fail', message: error.message }
    }

})