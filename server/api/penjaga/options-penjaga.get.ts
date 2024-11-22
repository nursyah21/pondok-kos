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
    const optionsPenjaga = (await Users.find({ role: 1 })).flatMap((e) => {
      return { 
        value: e._id,
        name: `${e.name} - ${e.number_phone}`
     };
    });
    // const optionsPenjaga = _optionsPenjaga.map(e=>{
    //     "value": e._id,
    //     "name": `${e.name} - ${e.number_phone}`
    // })

    return { status: "success", optionsPenjaga };
  } catch (error: any) {
    event.node.res.statusCode = 400;
    if (error.data) {
      error = error.data;
    }
    return { status: "fail", message: error.message };
  }
});
