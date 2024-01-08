import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '90d' });
};

const verifyToken = (req: any, res: any, next: any) => {
    try {
        let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        token = token.replace("Bearer ", "")
        const temp = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.decoded = temp;

        next();

    } catch (err: any) {
        console.log("Error:", err);
        return res.status(400).send({ stausCode: 0, data: err.toString() });
    }
};

export { generateToken, verifyToken };
