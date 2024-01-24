
const authenticate = (req,res,next) =>{
    if (!req.session || !req.session.user) {
        const err = new Error('Please login again');
        err.statusCode = 401;
        next(err);
    }
    next();
}

module.exports = authenticate;