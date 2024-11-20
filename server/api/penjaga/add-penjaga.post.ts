export default defineEventHandler(async (event) => {
  const { id_penjaga: id_user, id_kos } = await readBody(event);
  const data = await readBody(event);
  const authorizationHeader = event.node.req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1];

  try {
    const refreshTokens = await RefreshTokens.findOne({ token });
    console.log(data)
    if (!refreshTokens || !refreshTokens.id_user)
      throw new Error("token not valid");

    const user = await Users.findById(refreshTokens.id_user);
    if (!user) throw new Error("user not valid");

    const { role } = user;
    if (role != 2) throw new Error("user not authorization, you must be admin");

    const exist = await PenjagaKos.findOne({ id_kos, id_user });
    if (exist) {
      throw new Error("penjaga kos sudah terdaftar pada kos ini");
    }
    await PenjagaKos.create({ id_kos, id_user });

    return { status: "success", message: "sukses menambahkan penjaga" };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    let message = `gagal menambahkan penjaga`;
    if (error.message) {
      message = error.message;
    }
    return { status: "fail", message };
  }
});
