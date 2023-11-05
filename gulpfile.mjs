import gulp from "gulp";
import fileInclude from "gulp-file-include";
import { default as gulpSass } from "gulp-sass";
import * as sass from "sass";
import { default as server } from "gulp-server-livereload";
import { default as clean } from "gulp-clean"; // clean dist folder
import fs from "fs"; //for files control / delete etc
import { default as sourceMap } from "gulp-sourcemaps"; //to see in dev panel the path to original scss file with styles
import { default as groupMedia } from "gulp-group-css-media-queries"; //to delete doubling media queries in css, used in dev mode bacuse get conflicted with sourceMapping
import plumber from "gulp-plumber";
import notify from "gulp-notify";

const scss = gulpSass(sass);

const { task, src, dest, watch, parallel, series } = gulp;

/**
 * For deleting dist
 */
task("clean", (done) => {
  if (!fs.existsSync("./dist/")) return done();
  return src("./dist/", { read: false }).pipe(clean({ force: true }));
});

/**
 * For icluding html partials
 */
task("html", (done) => {
  return src("./src/*.html")
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "HTML",
          message: "Error <%= error.message %>",
          sound: false,
        }),
      })
    )
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./dist/"));
});

/**
 * For scss compile
 */
task("sass", (done) => {
  return (
    src("./src/scss/*.scss")
      .pipe(
        plumber({
          errorHandler: notify.onError({
            title: "Styles",
            message: "Error <%= error.message %>",
            sound: false,
          }),
        })
      )
      .pipe(sourceMap.init())
      .pipe(scss())
      // .pipe(groupMedia())
      .pipe(sourceMap.write())
      .pipe(dest("./dist/css"))
  );
});

/**
 * To copy images from src to dist
 */
task("images", (done) => {
  return src("./src/img/**/*").pipe(dest("./dist/img/"));
});

/**
 * To copy fonts from src to dist
 */
task("fonts", (done) => {
  return src("./src/fonts/**/*").pipe(dest("./dist/fonts/"));
});

/**
 * To copy files from src to dist
 */
task("fonts", (done) => {
  return src("./src/files/**/*").pipe(dest("./dist/files/"));
});

/**
 * Live server To copy images from src to dist
 */
task("server", (done) => {
  return src("./dist").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

/**
 * Watching for changes in written directories and run relevant tasks on change
 */
task("watch", (done) => {
  watch("./src/scss/**/*.scss", parallel("sass"));
  watch("./src/**/*.html", parallel("html"));
  watch("./src/img/**/*", parallel("images"));
  watch("./src/fonts/**/*", parallel("fonts"));
  watch("./src/files/**/*", parallel("files"));
});

/**
 * main task that runs with 'gulp' command in terminal
 */
task(
  "default",
  series(
    "clean",
    parallel("html", "sass", "images", "fonts", "files"),
    parallel("server", "watch")
  )
);
