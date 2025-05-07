import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import User from "../user/user.model"

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "your-secret-key",
}

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select("-password")

      if (!user || user.isDeleted) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  }),
)

export default passport
