const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        let token;

        if (authHeader) {

            token = authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : authHeader;

        }

        else if (req.query.token) {

            token = req.query.token;

        }

        else {

            return res.status(401).json({

                success: false,

                message: "No Token Provided"

            });

        }

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        req.user = {

            id: decoded.id,

            email: decoded.email

        };

        next();

    }

    catch (err) {

        return res.status(401).json({

            success: false,

            message: "Invalid Token"

        });

    }

};