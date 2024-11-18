import moment from "moment";

export default defineEventHandler(async (event) => {
  const authorizationHeader = event.node.req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1];

  try {

    const refreshTokens = await RefreshTokens.findOne({ token });

    if (!refreshTokens || !refreshTokens.id_user)
      throw new Error("token not valid");

    const user = await Users.findById(refreshTokens.id_user);
    if (!user) throw new Error("user not valid");

    const { role } = user;
    if (role == 0) throw new Error("user not authorization, you must be admin");
    const skip = getRequestURL(event).searchParams.get("skip");
    const limit = getRequestURL(event).searchParams.get("limit");
    const sort = getRequestURL(event).searchParams.get("sort") ?? "asc";
    const length = await PenghuniKos.find({}).countDocuments();

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

    // let data = await PenghuniKos.find({})
    //   .select(["id_user", "id_kamar_kos", "id_kos", "tanggal_bayar"])
    //   .sort({ createdAt: sort == "asc" ? -1 : 1 })
    //   .skip(Number(skip))
    //   .limit(Number(limit));

    // const data_user = data.map((e) => e.id_user);

    // const penjaga = await Users.find({
    //   _id: { $in: data_user },
    // }).select(["_id", "name", "number_phone", "avatar"]);

    // const kos = await Kos.find({}).select(["_id", "name"]);
    // const _kamarkos = await KamarKos.find({}).select([
    //   "_id",
    //   "name",
    //   "price",
    //   "id_kos",
    // ]);

    // // @ts-ignore
    // const kamarkos = _kamarkos.map((e) => {
    //   const namekos = kos.find((f) => f._id.toString() == e.id_kos.toString());

    //   if (namekos) {
    //     return {
    //       _id: e._id,
    //       id_kamar_kos: e._id,
    //       id_kos: e.id_kos,
    //       price: e.price,
    //       kamar: e.name,
    //       kos: namekos.name,
    //     };
    //   }
    // });

    // // @ts-ignore
    // data = data.map((e, idx) => {
    //   const p = penjaga.find((f: any) => f._id.toString() == e.id_user);
    //   const kos_kamar = kamarkos.find(
    //     (f: any) => f._id.toString() == e.id_kamar_kos
    //   );

    //   if (p != undefined && kos_kamar != undefined) {
    //     return {
    //       num: Number(skip) + idx + 1,
    //       name: p.name,
    //       avatar: p.avatar,
    //       kos: kos_kamar.kos,
    //       number_phone: p.number_phone,
    //       kamar: kos_kamar.kamar,
    //       price: kos_kamar.price,
    //       id_user: e.id_user,
    //       id_kamar_kos: e.id_kamar_kos,
    //       id_kos: e.id_kos,
    //       tanggal_bayar: e.tanggal_bayar,
    //       id: e._id,
    //     };
    //   }
    // });
    return { status: "success", total: length, data: listpenghuni };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    return { status: "fail", message: error.message };
  }
});
