export function checkRole(...roles) {

  return (req, res, next) => {
    
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "invalid token",
      });
    }


    const current_role = user.role;
    
    
    if (roles.includes(current_role)) {
      next()
    } else {
      return res.status(403).json({
        error: "forbidden"
      })
    }
    
  }

}