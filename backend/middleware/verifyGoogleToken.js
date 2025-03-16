const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // Contains user details
        req.user = payload; // Attach user info to request

        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
}

module.exports = verifyGoogleToken;
