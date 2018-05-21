let DEV = false;
let SERVER = false;

const fs = require('fs');
const path = require('path')
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const uglify = require('gulp-babili');
const minifyCss = require('gulp-clean-css');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const imagemin = require('gulp-imagemin');
const imageminOptipng = require('imagemin-optipng');
const imageminPngquant = require('imagemin-pngquant');
const plumber = require('gulp-plumber');
const spritesmith = require('gulp.spritesmith');
const gls = require('gulp-live-server');
const pug = require('gulp-pug');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const addsrc = require('gulp-add-src').prepend;
const gulpif = require('gulp-if');
const cmq = require('gulp-combine-mq');
const notifier = require('node-notifier');
//const restart = require('gulp-restart');
const onExit = require('on-exit');

const watchOpts = {events: ['add', 'change']};
const assetsDir = 'assets/';

let server;

function getDirs (srcpath) {
    return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

function getFiles (srcpath) {
    return fs.readdirSync(srcpath).filter(file => !fs.statSync(path.join(srcpath, file)).isDirectory());
}

function autoGlobal(scopes, type, folder) {
    getFiles(__dirname + '/' + folder).forEach(name => {
        name = name.replace(/\.[^/.]+$/, "");
        let filteredScopes = scopes.find(scope => {
            let filteredObj = scope[type].find(obj => {
                return name === obj;
            });
            return !!filteredObj;
        });
        if (!filteredScopes) {
            let globalIndex = scopes.findIndex(scope => scope.name === 'global');
            scopes[globalIndex][type].push(name);
        }
    });
}

function combineCSS(scopes) {
    return Promise.all(scopes.map(scope => {
        let vendor = typeof(scope.vendor) !== 'undefined' && typeof(scope.vendor.css) !== 'undefined' ? scope.vendor.css.map(file => {
            return `vendor/${file}`;
        }) : false;
        let sprite = __dirname + `/css/sprites/${scope.sprite}.styl`;
        let base = [
            __dirname + '/node_modules/rupture/rupture/index.styl',
            __dirname + '/css/fonts.styl',
            __dirname + '/css/mixins.styl',
            __dirname + '/css/settings.styl'
        ];
        if (fs.existsSync(sprite)) {
            base.push(sprite);
        }
        return new Promise(resolve => {
            gulp.src(scope.styl.map((name) => {return `css/site/${name}.styl`}))
                .pipe(plumber({
                    errorHandler: function (error) {
                        gutil.log(gutil.colors.red(error));
                        notifier.notify({
                            title: 'error',
                            message: gutil.colors.red(error)
                        });
                        this.emit('end');
                    }
                }))
                .pipe(stylus({
                    import: base
                }))
                .pipe(addsrc(vendor ? vendor : ''))
                .pipe(concat(scope.name + '.css'))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions', 'ie >= 8'],
                    cascade: false
                }))
                //.pipe(gulpif(!DEV, cmq({beautify: false})))
                .pipe(gulpif(!DEV, minifyCss({
                    compatibility: 'ie8'
                })))
                .pipe(gulp.dest(`${assetsDir}build`))
                .on('end', () => {
                    gutil.log('combined css for ', scope.name);
                    resolve();
                })
        });
    })).then(() => {
        gutil.log('css combined');
    });
}

function combineJS(scopes) {
    return Promise.all(scopes.map(scope => {
        let vendor = typeof(scope.vendor) !== 'undefined' && typeof(scope.vendor.js) !== 'undefined' ? scope.vendor.js.map(file => {
            return `vendor/${file}`;
        }) : false;
        return new Promise(resolve => {
            gulp.src(scope.js.map((name) => {return `js/${name}.js`}))
                .pipe(plumber({
                    errorHandler: function (error) {
                        gutil.log(gutil.colors.red(error));
                        notifier.notify({
                            title: 'error',
                            message: gutil.colors.red(error)
                        });
                        this.emit('end');
                    }
                }))
                .pipe(babel({
                    presets: [
                        ["env", {"targets": {
                            "browsers": ["last 2 versions", "ie 11"]
                        }, "modules": false}]
                    ]
                }))
                .pipe(addsrc(vendor ? vendor : ''))
                .pipe(gulpif(!DEV, uglify()))
                .pipe(concat(scope.name + '.js'))
                .pipe(gulp.dest(`${assetsDir}build`))
                .on('end', () => {
                    gutil.log('combined js for ', scope.name);
                    resolve();
                });
        });
    })).then(() => {
        gutil.log('js combined');
    });
}

function createSprite(name) {
    return new Promise((resolve, reject) => {
        let spriteData = gulp.src(`sprites/${name}/*.png`)
            .pipe(spritesmith({
                imgName: name + '.png',
                cssName: name + '.styl',
                imgPath: '../images/sprites/' + name + '.png?v=5',
                padding: 10
            }));
        Promise.all([
            new Promise((resolve, reject) => {
                spriteData.img
                    .pipe(gulp.dest(`${assetsDir}images/sprites/`))
                    .on('end', resolve);
            }),
            new Promise((resolve, reject) => {
                spriteData.css
                    .pipe(gulp.dest('css/sprites/'))
                    .on('end', resolve)
            }),
        ]).then(() => {
            gutil.log('created sprite ', name);
            resolve();
        });
    });
}

function createSprites() {
    return Promise.all(getDirs(__dirname + '/sprites').map(sprite => {
        return createSprite(sprite);
    })).then(() => {
        gutil.log('sprites created');
    });
}

function compileJade(src) {
    return new Promise(resolve => {
        gulp.src(src)
            .pipe(plumber({
                errorHandler: function (error) {
                    gutil.log(gutil.colors.red(error));
                    notifier.notify({
                        title: 'error',
                        message: gutil.colors.red(error)
                    });
                    this.emit('end');
                }
            }))
            .pipe(pug({pretty: false}))
            .pipe(gulp.dest('./'))
            .on('end', resolve);
    }).then(() => {
        gutil.log('html compiled');
    });
}

gulp.task('create-sprites', createSprites);

gulp.task('minify-png', function() {
    gulp.src(`${assetsDir}images/*.png`)
        .pipe(plumber({
            errorHandler: function (error) {
                gutil.log(gutil.colors.red(error));
                this.emit('end');
            }
        }))
        .pipe(imagemin({
            verbose: true,
            use: [imageminPngquant({quality: '70-80', speed: 1}), imageminOptipng({optimizationLevel: 2})] //не менять порядок аргументов
        }))
        .pipe(gulp.dest(`${assetsDir}images/*.png`));
    gulp.src(`${assetsDir}images/sprites/*.png`)
        .pipe(plumber({
            errorHandler: function (error) {
                gutil.log(gutil.colors.red(error));
                this.emit('end');
            }
        }))
        .pipe(imagemin({
            verbose: true,
            use: [imageminPngquant({quality: '70-80', speed: 1}), imageminOptipng({optimizationLevel: 2})] //не менять порядок аргументов
        }))
        .pipe(gulp.dest(`${assetsDir}images/sprites/*.png`));
});

gulp.task('default', function () {
    DEV = process.argv.includes('--dev');
    SERVER = process.argv.includes('--server');
    let scopes;
    del.sync([
        `${assetsDir}build/**/*`,
        `${assetsDir}images/sprites/**/*`,
        `css/sprites/**/*`,
        '*.html'
    ], {force: true});

    fs.readFile('scopes.json', (err, data) => {
        scopes = JSON.parse(data);
        autoGlobal(scopes, 'styl', 'css/site');
        autoGlobal(scopes, 'js', 'js');
        Promise.all([
            createSprites().then(() => {
                return combineCSS(scopes);
            }),
            combineJS(scopes),
            compileJade('jade/*.pug')
        ]).then(() => {
            gutil.log('build completed');

            if (SERVER) {

                server = gls.static('./', 8080);
                server.start();
                onExit(function() {
                    console.log('Stopping server');
                    server.stop();
                });
            }

            if (DEV) {

                gutil.log('watching');

                /*watch(['scopes.json', 'gulpfile.js'], function(file) {
                    gutil.log(gutil.colors.yellow(file.path+' updated, restarting'));
                    if (SERVER) server.stop();
                    restart();
                });*/

                watch(['sprites/*/*.png'], function(file) {
                    gutil.log('sprite updated', gutil.colors.blue(file.path));
                    notifier.notify({
                        title: 'sprite updated',
                        message: file.path
                    });
                    let sprite = path.basename(path.dirname(file.path));
                    let filteredScopes = scopes.filter(scope => {
                        return scope.sprite === sprite;
                    });
                    createSprite(sprite).then(() => {
                        combineCSS(filteredScopes);
                    });
                });

                watch(['css/**/*.styl', '!css/sprites/*.styl'], function(file) {
                    gutil.log('src updated', gutil.colors.blue(file.path));
                    notifier.notify({
                        title: 'src updated',
                        message: file.path
                    });
                    autoGlobal(scopes, 'styl', 'css/site');
                    let filteredScopes = scopes.filter(scope => {
                        if (path.basename(path.dirname(file.path)) === 'css' || path.basename(path.dirname(file.path)) === 'site' && scope.styl.indexOf(path.basename(file.path, '.styl')) !== -1) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    combineCSS(filteredScopes);
                });

                watch('js/**/*.js', function(file) {
                    gutil.log('src updated', gutil.colors.blue(file.path));
                    notifier.notify({
                        title: 'src updated',
                        message: file.path
                    });
                    autoGlobal(scopes, 'js', 'js');
                    let filteredScopes = scopes.filter(scope => {
                        if (path.basename(path.dirname(file.path)) === 'js' && scope.js.indexOf(path.basename(file.path, '.js')) !== -1) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    combineJS(filteredScopes);
                });

                watch(`${assetsDir}build/*.css`, watchOpts, function (file) {
                    gutil.log('dist updated', gutil.colors.green(file.path));
                    notifier.notify({
                        title: 'dist updated',
                        message: file.path
                    });
                    if (SERVER) server.notify.apply(server, [file]);
                });

                watch(`${assetsDir}build/*.js`, watchOpts, function (file) {
                    gutil.log('dist updated', gutil.colors.green(file.path));
                    notifier.notify({
                        title: 'dist updated',
                        message: file.path
                    });
                    if (SERVER) server.notify.apply(server, [file]);
                });

                watch('jade/*.pug', watchOpts, function (file) {
                    compileJade(file.path).then(() => {
                        gutil.log('src updated', gutil.colors.green(file.path));
                        notifier.notify({
                            title: 'src updated',
                            message: file.path
                        });
                        if (SERVER) server.notify.apply(server, [{path: 'index.html'}]);
                    });
                });

                watch('jade/include/*.pug', function (file) {
                    compileJade('jade/*.pug').then(() => {
                        gutil.log('src updated', gutil.colors.green(file.path));
                        notifier.notify({
                            title: 'src updated',
                            message: file.path
                        });
                        if (SERVER) server.notify.apply(server, [{path: 'index.html'}]);
                    });
                });

            } else {
                process.exit();
            }
        });
    });

});