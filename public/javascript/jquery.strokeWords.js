
/* Javascript for drawing strokes from audreyt's moedict-webkit */

! function (c) {
    for (var h = 0, e = ["webkit", "moz"], g = c.requestAnimationFrame, i = c.cancelRequestAnimationFrame, k = e.length; 0 <= --k;) g = c[e[k] + "RequestAnimationFrame"], i = c[e[k] + "CancelRequestAnimationFrame"];
    if (!g || !i) g = function (c) {
        var a = +Date.now(),
            b = Math.max(h + 16, a);
        return setTimeout(function () {
            c(h = b)
        }, b - a)
    }, i = clearTimeout;
    c.requestAnimationFrame = g;
    c.cancelRequestAnimationFrame = i
}(window);
(function () {
    $(function () {
        var c, h, e, g, i, k, j;
        g = function (a, b, d) {
            return $.get("utf8/" + a.toLowerCase() + ".xml", b, "xml").fail(d)
        };
        c = function (a, b) {
            var d;
            this.options = $.extend({
                dim: 2150,
                scales: {
                    fill: 0.4,
                    style: 0.25
                },
                trackWidth: 150,
                updatesPerStep: 10,
                updatesPerTrack: 1,
                delays: {
                    stroke: ($('body').hasClass('overflow-scrolling-false') ? 0 : 0.25),
                    word: 0.5
                }
            }, b);
            this.val = a;
            this.utf8code = escape(a).replace(/%u/, "");
            this.strokes = [];
            this.canvas = document.createElement("canvas");
            d = $(this.canvas);
            d.css("width", this.styleWidth() + "px");
            d.css("height", this.styleHeight() + "px");
            this.canvas.width = this.fillWidth();
            this.canvas.height = this.fillHeight();
            return this
        };
        c.prototype.init = function () {
            return this.time = this.currentTrack = this.currentStroke = 0
        };
        c.prototype.width = function () {
            return this.options.dim
        };
        c.prototype.height = function () {
            return this.options.dim
        };
        c.prototype.fillWidth = function () {
            return this.width() * this.options.scales.fill
        };
        c.prototype.fillHeight = function () {
            return this.height() * this.options.scales.fill
        };
        c.prototype.styleWidth = function () {
            return this.fillWidth() * this.options.scales.style
        };
        c.prototype.styleHeight =
            function () {
                return this.fillHeight() * this.options.scales.style
        };
        c.prototype.drawBackground = function () {
            var a;
            a = this.canvas.getContext("2d");
            a.fillStyle = "#FFF";
            a.fillRect(0, 0, this.fillWidth(), this.fillHeight());
            return e(a, this.fillWidth())
        };
        c.prototype.draw = function () {
            var a, b = this;
            this.init();
            a = this.canvas.getContext("2d");
            a.strokeStyle = "#000";
            a.fillStyle = "#000";
            a.lineWidth = 5;
            requestAnimationFrame(function () {
                return b.update()
            });
            return this.promise = $.Deferred()
        };
        c.prototype.update = function () {
            var a, b,
                d, f, c = this;
            if (!(this.currentStroke >= this.strokes.length)) {
                a = this.canvas.getContext("2d");
                d = this.strokes[this.currentStroke];
                0 === this.time && (this.vector = {
                    x: d.track[this.currentTrack + 1].x - d.track[this.currentTrack].x,
                    y: d.track[this.currentTrack + 1].y - d.track[this.currentTrack].y,
                    size: d.track[this.currentTrack].size
                }, a.save(), a.beginPath(), j(a, d.outline, this.options.scales.fill), a.clip(), this.options.updatesPerStep = this.options.updatesPerTrack * d.track.length);
                b = 1;
                for (f = this.options.updatesPerStep;
                    (1 <= f ? b <= f : b >= f) && !(this.time += 0.02, 1 <= this.time && (this.time = 1), a.beginPath(),
                        a.arc((d.track[this.currentTrack].x + this.vector.x * this.time) * this.options.scales.fill, (d.track[this.currentTrack].y + this.vector.y * this.time) * this.options.scales.fill, 2 * this.vector.size * this.options.scales.fill, 0, 2 * Math.PI), a.fill(), 1 <= this.time); 1 <= f ? ++b : --b);
                b = 0;
                1 <= this.time && (a.restore(), this.time = 0, this.currentTrack += 1, this.options.updatesPerStep -= 1);
                this.currentTrack >= d.track.length - 1 && (this.currentTrack = 0, this.currentStroke += 1, b = this.options.delays.stroke);
                return this.currentStroke >= this.strokes.length ? setTimeout(function () {
                        return c.promise.resolve({
                            remove: function () {
                                $(c.canvas).remove();
                            }
                        });
                    },
                    1E3 * this.options.delays.word) : b ? setTimeout(function () {
                    return requestAnimationFrame(function () {
                        return c.update()
                    })
                }, 1E3 * b) : requestAnimationFrame(function () {
                    return c.update()
                })
            }
        };
        e = function (a, b) {
            a.strokeStyle = "#A33";
            a.beginPath();
            a.lineWidth = 10;
            a.moveTo(0, 0);
            a.lineTo(0, b);
            a.lineTo(b, b);
            a.lineTo(b, 0);
            a.lineTo(0, 0);
            a.stroke();
            a.beginPath();
            a.lineWidth = 2;
            a.moveTo(0, b / 3);
            a.lineTo(b, b / 3);
            a.moveTo(0, 2 * (b / 3));
            a.lineTo(b, 2 * (b / 3));
            a.moveTo(b / 3, 0);
            a.lineTo(b / 3, b);
            a.moveTo(2 * (b / 3), 0);
            a.lineTo(2 * (b / 3), b);
            return a.stroke()
        };
        j = function (a, b, d) {
            var f, c, l, e;
            e = [];
            c = 0;
            for (l = b.length; c < l; c++) switch (f = b[c], f.type) {
            case "M":
                e.push(a.moveTo(f.x * d, f.y * d));
                break;
            case "L":
                e.push(a.lineTo(f.x * d, f.y * d));
                break;
            case "C":
                e.push(a.bezierCurveTo(f.begin.x * d, f.begin.y * d, f.mid.x * d, f.mid.y * d, f.end.x * d, f.end.y * d));
                break;
            case "Q":
                e.push(a.quadraticCurveTo(f.begin.x * d, f.begin.y * d, f.end.x * d, f.end.y * d));
                break;
            default:
                e.push(void 0)
            }
            return e
        };
        i = function (a) {
            var b, d, f, c, e;
            d = [];
            e = a.childNodes;
            f = 0;
            for (c = e.length; f < c; f++)
                if (b = e[f], 1 === b.nodeType && (a =
                    b.attributes)) switch (b.nodeName) {
                case "MoveTo":
                    d.push({
                        type: "M",
                        x: parseFloat(a.x.value),
                        y: parseFloat(a.y.value)
                    });
                    break;
                case "LineTo":
                    d.push({
                        type: "L",
                        x: parseFloat(a.x.value),
                        y: parseFloat(a.y.value)
                    });
                    break;
                case "CubicTo":
                    d.push({
                        type: "C",
                        begin: {
                            x: parseFloat(a.x1.value),
                            y: parseFloat(a.y1.value)
                        },
                        mid: {
                            x: parseFloat(a.x2.value),
                            y: parseFloat(a.y2.value)
                        },
                        end: {
                            x: parseFloat(a.x3.value),
                            y: parseFloat(a.y3.value)
                        }
                    });
                    break;
                case "QuadTo":
                    d.push({
                        type: "Q",
                        begin: {
                            x: parseFloat(a.x1.value),
                            y: parseFloat(a.y1.value)
                        },
                        end: {
                            x: parseFloat(a.x2.value),
                            y: parseFloat(a.y2.value)
                        }
                    })
                }
                return d
        };
        k = function (a, b) {
            var d, f, c, e, g, i;
            c = [];
            i = a.childNodes;
            e = 0;
            for (g = i.length; e < g; e++)
                if (f = i[e], 1 === f.nodeType && (d = f.attributes)) switch (f.nodeName) {
                case "MoveTo":
                    c.push({
                        x: parseFloat(d.x.value),
                        y: parseFloat(d.y.value),
                        size: d.size ? parseFloat(d.size.value) : b
                    })
                }
                return c
        };
        h = function (a, b, d) {
            var f, e, div = a;
            f = jQuery.Deferred();
            e = new c(b, d);
            g(e.utf8code, function (a) {
                var b, d, c, g, h, j;
                d = a.getElementsByTagName("Track");
                h = a.getElementsByTagName("Outline");
                j = [];
                a = c = 0;
                for (g = h.length; c < g; a = ++c) b = h[a], e.strokes.push({
                    outline: i(b),
                    track: k(d[a], e.options.trackWidth)
                }), j.push(f.resolve({
                    drawBackground: function () {
                        $(div).append(e.canvas);
                        return e.drawBackground()
                    },
                    draw: function () {
                        return e.draw()
                    }
                }));
                return j
            }, function () {
                return f.resolve({
                    drawBackground: function () {
                        $(div).append(e.canvas);
                        return e.drawBackground()
                    },
                    draw: function () {
                        var a;
                        a = jQuery.Deferred();
                        $(e.canvas).fadeTo("fast", 0.1, function () {
                            return a.resolve()
                        });
                        return a
                    }
                })
            });
            return f
        };
        window.WordStroker || (window.WordStroker = {});
        return window.WordStroker.canvas = {
            Word: c,
            createWordsAndViews: function (a, b, d) {
                return Array.prototype.map.call(b, function (b) {
                    return h(a, b, d)
                })
            }
        }
    })
}).call(this);
(function () {
    var c, h;
    h = function () {
        var c;
        return null != (c = document.createElement("canvas")) ? c.getContext("2d") : void 0
    };
    c = jQuery;
    c.fn.extend({
        strokeWords: function (e, g) {
            if (void 0 === e || "" === e) return null;
            g = c.extend({
                svg: !h()
            }, g);
            return this.each(function () {
                var c, h, j;
                if (g.svg) return window.WordStroker.raphael.strokeWords(this, e);
                j = window.WordStroker.canvas.createWordsAndViews(this, e, g);
                c = 0;
                h = function () {
                    if (c < j.length) return j[c++].then(function (a) {
                        a.drawBackground()
                        return a.draw().then(function (a) {
                            if (c < j.length)
                                a.remove();
                            h();
                        });
                    })
                };
                return h()
            }).data("strokeWords", {
                play: null
            })
        }
    })
}).call(this);
