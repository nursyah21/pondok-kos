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
    if (role != 2) throw new Error("user not authorization, you must be admin");
    const skip = getRequestURL(event).searchParams.get("skip");
    const limit = getRequestURL(event).searchParams.get("limit");
    const length = await PenjagaKos.find({}).countDocuments();
    const penjaga = await PenjagaKos.find({})
      .populate(["id_user", "id_kos"])
      .skip(Number(skip))
      .limit(Number(limit));

    const data = penjaga.map((e: any, idx) => {
      return {
        num: Number(skip) + idx + 1,
        name: e.id_user.name,
        number_phone: e.id_user.number_phone,
        avatar: e.id_user.avatar,
        kos: e.id_kos.name,
        location: e.id_kos.address,
      };
    });

    return { status: "success", total: length, data: data };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    return { status: "fail", message: error.message };
  }
});
