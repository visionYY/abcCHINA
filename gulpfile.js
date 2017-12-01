const gulp = require('gulp');
const webserver = require('gulp-webserver');
const mock = require('mockjs');
const fs = require('fs');
const path = require('path');
const minimg = require('gulp-imagemin')

gulp.task("webserver", function () {
    gulp.src(".")
        .pipe(webserver({
            host: "localhost",
            port: 8090,
            open: true,
            fallback: "index.html",
            livereload: true
        }));
});

gulp.task('userinfo', function () {
    gulp.src('.')
        .pipe(webserver({
            host: 'localhost',
            port: 8080,
            middleware: function (req, res) {
                res.writeHead(200, {
                    "content-type": 'text/html;charset=utf-8',
                    "access-control-allow-origin": "*" //跨域
                });
                var filename = req.url.split("/")[1];
                var datafile = path.join(__dirname, filename+".json");
                fs.exists(datafile, function (exists) {
                    if (exists) {
                        fs.readFile(datafile, function (err, data) {
                            if (err) {
                                throw err;
                            }
                            res.end(data);
                        });
                    } else {
                        var data = "can't find file " + filename;
                        res.end(data);
                    }
                })
            }
        }));
})

gulp.task('default', function () {
    gulp.start('webserver','userinfo'); //同时启动两个
})

// img
gulp.task('minImage',function(){
    gulp.src('./img/*.png')
        .pipe(minimg())
        .pipe(gulp.dest('image'))
})