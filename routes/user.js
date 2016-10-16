/**
 * Created by LFAN on 2016/5/1.
 * 用于创建用户
 */
function User(user){
    this._id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;
