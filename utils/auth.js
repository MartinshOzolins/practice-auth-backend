import jwt from "jsonwebtoken";
import util from "node:util";

export function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function attachJWTCookie(res, token) {
  //sets a cookie with a jwt within response header
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    //secure: true, // only for production
  });
}

// verifies jwt
export async function verifyJWT(token) {
  return await util.promisify(jwt.verify)(token, process.env.JWT_SECRET); // { id: 3, iat: 1743358615, exp: 1751134615 }
}
