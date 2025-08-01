//Setting Admin user middleware
export const isAdminUser = (req, res, next) =>{
    if(req.userInfo.role !=="admin"){
        res.status(403).json({success:false, message:'Access Denied! Admin right required'})
    }
    next()
}
