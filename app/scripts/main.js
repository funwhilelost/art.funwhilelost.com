// init boostrap-material-design theme js
$.material.init();

// Load an example ACiD binary into the browser.
//$("body").load("binaries/acdu0692.zip/ACID92.ANS");

var options = {
  "font": "80x25",
    // 80x25 (Default, code page 437)
    // 80x25small (small, but legible code page 437)
    // 80x50 (Code page 437, 80x50 mode)
    // armenian
    // baltic (Code page 775)
    // cyrillic (Code page 855)
    // french-canadian (Code page 863)
    // greek (Code page 737)
    // greek-869 (Code page 869)
    // hebrew (Code page 862)
    // icelandic (Code page 861)
    // latin1 (Code page 850)
    // latin2 (Code page 852)
    // nordic (Code page 865)
    // persian (Iran System encoding standard)
    // portuguese (Code page 860)
    // russian (Code page 866)
    // terminus (Terminus font)
    // turkish (Code page 857)
    // amiga (alias to Topaz)
    // b-strict (Original B-Strict font)
    // b-struct (Original B-Struct font)
    // microknight (Original MicroKnight version)
    // microknight+ (Modified MicroKnight version)
    // microknightplus (alias to MicroKnight + to be used in URLs)
    // mosoul (Original mO’sOul font)
    // pot-noodle (Original P0T-NOoDLE font)
    // topaz (Original Topaz Kickstart 2.x version)
    // topaz+ (Modified Topaz Kickstart 2.x+ version)
    // topazplus (alias to Topaz+ to be used in URLs)
    // topaz500 (Original Topaz Kickstart 1.x version)
    // topaz500+ (Modified Topaz Kickstart 1.x version)
    // topaz500plus (alias to Topaz500+ to be used in URLs)
  "bits": "8", // "8", "9" (real textmode), "ced" (amiga-like), "workbench" (amiga workbench)
  "icecolors": 0, // off/on
  "columns": 160, // default 160 - only for .BIN files
  "thumbnail": 0 // 0 = off, 1 = 1/8, 2 = 1/4, 3 = 1/2
}

AnsiLove.render("binaries/acdu0692.zip/ACID92.ANS", function (canvas, sauce) {
  $("body").append(canvas).append("<div/>").text(sauce);
}, options);
