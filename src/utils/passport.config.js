import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

const initializePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/user/auth/google/callback"
    }, async (profile, done) => {
        try {
            let user = await User.findOne({ 
                $or: [
                    { googleId: profile.id },
                    { email: profile.emails[0].value }
                ]
            });

            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    fullName: profile.displayName
                });
            } else if (!user.googleId) {
                // Link Google ID to existing email account
                user.googleId = profile.id;
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
};

export default initializePassport;