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
    const length = await Users.find({ role: 0 }).countDocuments();
    let data = await Users.find({ role: 0 })
      .select([
        "name",
        "number_phone",
        "avatar",
        "id_card",
        "address",
        "verified",
        "birthdate",
      ])
      .sort({ createdAt: sort == "asc" ? -1 : 1 })
      .skip(Number(skip))
      .limit(Number(limit));

    // @ts-ignore
    data = data.map((e, idx) => {
      return {
        num: Number(skip) + idx + 1,
        id: e._id,
        name: e.name,
        number_phone: e.number_phone,
        avatar: e.avatar,
        id_card: e.id_card,
        address: e.address,
        birthdate: e.birthdate,
        verified: e.verified,
      };
    });

    return { status: "success", total: length, data: data };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    return { status: "fail", message: error.message };
  }
});
