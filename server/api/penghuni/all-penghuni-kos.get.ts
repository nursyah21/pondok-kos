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
    let length = 0;
    const listpenghuni: any[] = [];

    const booking = await Booking.find({
      paid_status: 2,
    }).populate(["id_user", { path: "id_kamar_kos", populate: ["id_kos"] }]);

    booking.forEach((e: any, idx) => {
      
      const durationDays =
        new Date(e.createdAt).getTime() + e.duration * 24000 * 3600;
      const tersisa = Math.ceil(
        (durationDays - new Date().getTime()) / (24000 * 3600)
      );
      console.log(tersisa, e.duration)
      if (tersisa >= 0) {
        length++;
        listpenghuni.push({
          num: length,
          name: e.id_user.name,
          number_phone: e.id_user.number_phone,
          avatar: e.id_user.avatar,
          kamar: e.id_kamar_kos.name,
          id_kamar_kos: e.id_kamar_kos._id,
          id_user: e.id_user._id,
          kos: e.id_kamar_kos.id_kos.name,
          tanggal_bayar: moment(e.updatedAt).format("DD-MM-YYYY"),
          price: e.price,
        });
      }
    });

    if (sort == "desc") {
      listpenghuni.sort((a, b) => b.num - a.num);
    }

    return { status: "success", total: length, data: listpenghuni };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    return { status: "fail", message: error.message };
  }
});
