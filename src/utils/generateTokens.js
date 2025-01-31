// utils/tokenGenerator.js
import jwt from 'jsonwebtoken';

const generateAccessToken = (userId, email) => {
    try {
        // Generate Access Token
        const accessToken = jwt.sign(
            { userId, email },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
        );
        return accessToken;
    } catch (error) {
        throw new Error("Error generating tokens: " + error.message);
    }
};

const generateRefreshToken = (userId, email) => {
    try {
        // Generate Refresh Token
        const refreshToken = jwt.sign(
            { userId, email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }  // Token expires in 7 days
        );

        return refreshToken
    } catch (error) {
        throw new Error("Error generating tokens: " + error.message);
    }
};

// Verify Access Token
const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid access token");
    }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
};

// Generate new Access Token using Refresh Token
const regenerateAccessToken = (refreshToken) => {
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const accessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        return accessToken;
    } catch (error) {
        throw new Error("Error regenerating access token");
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    regenerateAccessToken
};