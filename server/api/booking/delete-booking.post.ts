export default defineEventHandler(async (event) => {
  const { _id } = await readBody(event);
  const authorizationHeader = event.node.req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1];

  try {
    const refreshTokens = await RefreshTokens.findOne({ token });
    if (!refreshTokens || !refreshTokens.id_user)
      throw new Error("token not valid");

    const user = await Users.findById(refreshTokens.id_user);
    if (!user) throw new Error("user not valid");

    const { role, verified } = user;
    console.log(_id)
    if (role != 0) throw new Error("user not authorization");
    if (!verified) throw new Error("user not verified");
    const booking = await Booking.findById(_id);
    if (!booking) throw new Error("booking sudah tidak tersedia");    

    const { id_kamar_kos } = booking;
    const res = await Booking.findByIdAndUpdate(_id, { paid_status: 0 });
    if (!res) {
      throw Error("booking didnt exist");
    }
    await KamarKos.findByIdAndUpdate(id_kamar_kos, { available: 0 });

    return {
      status: "success",
      message: "membatalkan booking kamar kos",
      id: res._id.toString(),
    };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    console.error(error.message);
    return { status: "fail", message: error.message };
  }
});
