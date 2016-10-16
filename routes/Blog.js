/**
 * Created by FAN on 2016/4/21.
 */
function Blog(id, title, contents, time, auther) {
    this._id = id;
    this.title = title;
    this.contents = contents;
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
    this.auther = auther;
}

module.exports = Blog;
