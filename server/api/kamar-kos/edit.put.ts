export default defineEventHandler(async (event) => {
  const {
    _id,
    _id_kos: id_kos,
    name,
    description,
    available: _available,
    image,
    price,
    price_harian,
    price_harian_on,
  } = await readBody(event);

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

    let _price = 350000;
    let _price_harian = 0;

    if (typeof price == "string") {
      _price = parseInt(price.replaceAll(",", ""));
    }
    if (price_harian_on) {
      _price_harian = parseInt(price_harian.replaceAll(",", ""));
    }

    await KamarKos.find(id_kos ? { id_kos } : {})
      .populate({
        path: "id_kos",
        select: "name address hidden",
      })
      .updateOne(
        { _id },
        {
          id_kos,
          name,
          description,
          image,
          price: _price,
          price_harian: _price_harian,
        }
      );

    return { status: "success", message: "merubah data kamar kos" };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    if (error.data) {
      error = error.data;
    }
    return { status: "fail", message: error.message };
  }
});
