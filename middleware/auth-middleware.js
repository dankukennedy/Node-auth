import jwt from 'jsonwebtoken';

// Setting Authentication
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found in authorization header'
            });
        }

        // Verify and decode the token
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded Token:', decodedTokenInfo);

        // Attach user info to request
        req.userInfo = decodedTokenInfo;

        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};