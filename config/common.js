

function security(res){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
res.header('Expires', '-1');
res.header('Pragma', 'no-cache');
return res;
}

module.exports = {
    security: security
};