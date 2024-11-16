import { formatRupiahIntl } from "~/utils/formatRupiah";
import moment from "moment";

export default defineEventHandler(async (event) => {
  const authorizationHeader = event.node.req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1];
  try {
    checkBooking();
    const refreshTokens = await RefreshTokens.findOne({ token });

    if (!refreshTokens || !refreshTokens.id_user)
      throw new Error("token not valid");

    const user = await Users.findById(refreshTokens.id_user);
    if (!user) throw new Error("user not valid");
    const { role, _id } = user;
    let data: DataDashboard = {};

    // pemilik
    if (role == 2) {
      const totalPenghuni = (
        await PenghuniKos.find({}).countDocuments()
      ).toString();
      const totalPenjaga = (
        await PenjagaKos.find({}).countDocuments()
      ).toString();
      const totalKamarKos = (
        await KamarKos.find({}).countDocuments()
      ).toString();

      const temp = await PenghuniKos.find({})
        .populate(["id_kamar_kos"])
        .select("id_kamar_kos")
        .limit(10);
      let pendapatan = 0;
      temp.forEach((e: any) => {
        pendapatan += e?.id_kamar_kos?.price ?? 0;
      });
      const listpenghuni: any[] = [];
      const _listpenghuni = await PenghuniKos.find({})
        .populate([{ path: "id_kamar_kos", populate: ["id_kos"] }, "id_user"])
        .limit(10);

      let num = 1;
      _listpenghuni.forEach((e: any) => {
        listpenghuni.push({
          num,
          name: e.id_user.name,
          kamar: e.id_kamar_kos.name,
          kos: e.id_kamar_kos.id_kos.name,
          tanggal_bayar: moment(e.tanggal_bayar).format("DD-MM-YYYY"),
        });
        num++;
      });

      const transaksi = await Booking.find({
        updatedAt: {
          $gte: new Date().getFullYear(),
        },
      });

      const transaksiData = new Array(12).fill(0);
      transaksi.forEach((e: any) => {
        const month = new Date(e.updatedAt).getMonth();
        transaksiData[month] += e.price;
      });

      data = {
        totalPenghuni,
        totalPenjaga,
        totalKamarKos,
        pendapatan,
        chartBarPendapatan: {
          options: {
            chart: {
              type: "bar",
            },
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
            dataLabels: {
              enabled: false,
            },
          },
          series: [
            {
              data: [
                { x: "jan", y: transaksiData[0] },
                { x: "feb", y: transaksiData[1] },
                { x: "mar", y: transaksiData[2] },
                { x: "apr", y: transaksiData[3] },
                { x: "mei", y: transaksiData[4] },
                { x: "jun", y: transaksiData[5] },
                { x: "jul", y: transaksiData[6] },
                { x: "agu", y: transaksiData[7] },
                { x: "sep", y: transaksiData[8] },
                { x: "okt", y: transaksiData[9] },
                { x: "nov", y: transaksiData[10] },
                { x: "dec", y: transaksiData[11] },
              ],
            },
          ],
        },
        listPenghuni: listpenghuni,
      };
    }
    // penjaga
    if (role == 1) {
      const penjagakos = await PenjagaKos.find({ id_user: _id })
        .populate(["id_kos"])
        .limit(10);
      const _listkos: any[] = [];
      const _listpenghuni: any[] = [];
      const idkos: any[] = [];
      penjagakos.forEach((e: any) => {
        idkos.push(e.id_kos._id.toString());
        _listkos.push({
          kos: e.id_kos.name,
          address: e.id_kos.address,
          imgkos: e.id_kos.image,
        });
      });
      const penghuni = await PenghuniKos.find({})
        .populate(["id_user", { path: "id_kamar_kos", populate: ["id_kos"] }])
        .limit(10);
      let num = 1;
      penghuni.forEach((e: any) => {
        if (idkos.indexOf(e.id_kos._id.toString()) === -1) {
          return;
        }
        _listpenghuni.push({
          num,
          name: e.id_user.name,
          kamar: e.id_kamar_kos.name,
          kos: e.id_kamar_kos.id_kos.name,
          tanggal_bayar: moment(e.tanggal_bayar).format("DD-MM-YYYY"),
        });
        num++;
      });

      data = {
        listKos: _listkos,
        listPenghuni: _listpenghuni,
      };
    }
    // penghuni
    if (role == 0) {
      const penghuni = await PenghuniKos.find({ id_user: { _id } })
        .populate(["id_user", { path: "id_kamar_kos", populate: ["id_kos"] }])
        .limit(10);

      const listKos: any[] = [];
      const listTransaksi: any[] = [];
      const idpenghunikamarkos: any[] = [];
      penghuni.forEach((e: any) => {
        idpenghunikamarkos.push(e.id_kamar_kos._id.toString());
      });

      const booking = await Booking.find({
        id_user: _id,
        paid_status: 2,
      }).populate([{ path: "id_kamar_kos", populate: ["id_kos"] }]);
      booking.forEach((e: any, idx) => {
        const durationDays =
          new Date(e.createdAt).getTime() + e.duration * 24000 * 3600;
        const tersisa = Math.ceil(
          (durationDays - new Date().getTime()) / (24000 * 3600)
        );

        if (idpenghunikamarkos.indexOf(e.id_kamar_kos._id.toString()) != -1) {
          listKos.push({
            kos: e.id_kamar_kos.id_kos.name,
            kamar: e.id_kamar_kos.name,
            address: e.id_kamar_kos.id_kos.address,
            imgkos: e.id_kamar_kos.image[0],
            price: e.price,
            tersisa,
          });
        }

        listTransaksi.push({
          num: idx + 1,
          kamar: e.id_kamar_kos.name,
          kos: e.id_kamar_kos.id_kos.name,
          price: "Rp" + formatRupiahIntl(e.price),
          tanggal_bayar: moment(e.updatetAt).format("DD-MM-YYYY"),
        });
      });

      data = {
        listKos,
        listTransaksi,
      };
    }

    return { status: "success", data };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    writeError(error.message);

    return { status: "fail", message: error.message };
  }
});
