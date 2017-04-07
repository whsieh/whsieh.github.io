
(self.AMP = self.AMP || []).push({
    n: "amp-carousel",
    v: "1490899213109",
    f: (function(AMP) {
        var f;

        function k(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            for (var d in b)
                if (Object.defineProperties) {
                    var e = Object.getOwnPropertyDescriptor(b, d);
                    e && Object.defineProperty(a, d, e)
                } else a[d] = b[d]
        };
        Date.now();
        self.log = self.log || {
            user: null,
            dev: null
        };
        var m = self.log;

        function n() {
            if (m.dev) return m.dev;
            throw Error("failed to call initLogConstructor");
        };

        function p(a, b) {
            a = a.__AMP_TOP || a;
            var c = a.services && a.services[b] && a.services[b].obj;
            return c
        }

        function aa(a) {
            if (a.nodeType) {
                var b = (a.ownerDocument || a).defaultView;
                if (b = b != (b.__AMP_TOP || b) && b.services && b.services.action && b.services.action.obj ? b.services.action.obj : null) return b
            }
            return (a = q(a)) && a.services && a.services.action && a.services.action.obj
        }

        function r(a, b) {
            var c, d = a = a.__AMP_TOP || a,
                e = c ? c : void 0;
            a = t(a);
            var g = a[b];
            g || (g = a[b] = {
                obj: null,
                promise: null,
                resolve: null,
                build: null
            });
            g.obj || (g.obj = g.build ? g.build() : e(d), g.resolve && g.resolve(g.obj));
            return g.obj
        }

        function u(a) {
            return a.nodeType ? r((a.ownerDocument || a).defaultView, "ampdoc").getAmpDoc(a) : a
        }

        function q(a) {
            a = u(a);
            return a.isSingleDoc() ? a.win : a
        }

        function v(a) {
            var b = w(a);
            if (b) return b;
            var c, d = new Promise(function(a) {
                c = a
            });
            a = t(a);
            var e = a["amp-analytics-instrumentation"];
            e ? (e.promise = d, e.resolve = c, e.build && (e.obj = e.build(), e.resolve(e.obj))) : e = a["amp-analytics-instrumentation"] = {
                obj: null,
                promise: d,
                resolve: c,
                build: null
            };
            return d
        }

        function w(a) {
            if (a = t(a)["amp-analytics-instrumentation"]) {
                if (a.promise) return a.promise;
                if (a.obj) return a.promise = Promise.resolve(a.obj)
            }
            return null
        }

        function t(a) {
            var b = a.services;
            b || (b = a.services = {});
            return b
        };

        function x(a) {
            return a.ampExtendedElements ? !!a.ampExtendedElements["amp-analytics"] : !1
        }

        function ba(a) {
            var b = u(a),
                c = w(q(a));
            return c ? c : Promise.resolve().then(function() {
                return x(b.win) ? v(q(a)) : b.whenBodyAvailable().then(function() {
                    return x(b.win) ? v(q(a)) : null
                })
            })
        };

        function y(a) {
            return p(a, "timer")
        };
        var z;

        function ca(a) {
            a: {
                var b;b: {
                    try {
                        b = a.document.cookie;
                        break b
                    } catch (h) {}
                    b = void 0
                }
                if (a = b)
                    for (a = a.split(";"), b = 0; b < a.length; b++) {
                        var c = a[b].trim(),
                            d = c.indexOf("=");
                        if (-1 != d && "AMP_EXP" == decodeURIComponent(c.substring(0, d).trim())) {
                            a = decodeURIComponent(c.substring(d + 1).trim());
                            break a
                        }
                    }
                a = null
            }
            var e = a,
                g = e ? e.split(/\s*,\s*/g) : [];a = Object.create(null);
            for (b = 0; b < g.length; b++) 0 != g[b].length && ("-" == g[b][0] ? a[g[b].substr(1)] = !1 : a[g[b]] = !0);
            return a
        };
        var A, B = "Webkit webkit Moz moz ms O o".split(" ");

        function C(a, b) {
            var c = void 0;
            A || (A = Object.create(null));
            var d = A[b];
            if (!d || c) {
                d = b;
                if (void 0 === a[b]) {
                    var e = b.charAt(0).toUpperCase() + b.slice(1);
                    a: {
                        for (var g = 0; g < B.length; g++) {
                            var h = B[g] + e;
                            if (void 0 !== a[h]) {
                                e = h;
                                break a
                            }
                        }
                        e = ""
                    }
                    var l = e;
                    void 0 !== a[l] && (d = l)
                }
                c || (A[b] = d)
            }
            return d
        }

        function D(a, b) {
            var c, d = C(a.style, "order");
            d && (a.style[d] = c ? b + c : b)
        }

        function da(a) {
            var b = C(a.style, "scrollSnapType");
            if (b) return a.style[b]
        };

        function E(a, b, c) {
            ba(a).then(function(a) {
                a && a.triggerEvent(b, c)
            })
        };

        function F(a, b, c, d) {
            var e = new G(0, 0, a, b, c, d, 1, 1);
            return e.solveYValueFromXValue.bind(e)
        }

        function G(a, b, c, d, e, g, h, l) {
            this.x0 = a;
            this.y0 = b;
            this.x1 = c;
            this.y1 = d;
            this.x2 = e;
            this.y2 = g;
            this.x3 = h;
            this.y3 = l
        }
        f = G.prototype;
        f.solveYValueFromXValue = function(a) {
            return this.getPointY(this.solvePositionFromXValue(a))
        };
        f.solvePositionFromXValue = function(a) {
            var b = 1E-6,
                c = (a - this.x0) / (this.x3 - this.x0);
            if (0 >= c) return 0;
            if (1 <= c) return 1;
            for (var d = 0, e = 1, g = 0, h = 0; 8 > h; h++) {
                var g = this.getPointX(c),
                    l = (this.getPointX(c + b) - g) / b;
                if (Math.abs(g - a) < b) return c;
                if (Math.abs(l) < b) break;
                else g < a ? d = c : e = c, c -= (g - a) / l
            }
            for (h = 0; Math.abs(g - a) > b && 8 > h; h++) g < a ? (d = c, c = (c + e) / 2) : (e = c, c = (c + d) / 2), g = this.getPointX(c);
            return c
        };
        f.getPointX = function(a) {
            if (0 == a) return this.x0;
            if (1 == a) return this.x3;
            var b = this.lerp(this.x0, this.x1, a),
                c = this.lerp(this.x1, this.x2, a),
                d = this.lerp(this.x2, this.x3, a),
                b = this.lerp(b, c, a),
                c = this.lerp(c, d, a);
            return this.lerp(b, c, a)
        };
        f.getPointY = function(a) {
            if (0 == a) return this.y0;
            if (1 == a) return this.y3;
            var b = this.lerp(this.y0, this.y1, a),
                c = this.lerp(this.y1, this.y2, a),
                d = this.lerp(this.y2, this.y3, a),
                b = this.lerp(b, c, a),
                c = this.lerp(c, d, a);
            return this.lerp(b, c, a)
        };
        f.lerp = function(a, b, c) {
            return a + c * (b - a)
        };
        var ea = F(.25, .1, .25, 1),
            fa = F(.42, 0, 1, 1),
            ga = F(0, 0, .58, 1),
            ha = F(.42, 0, .58, 1),
            ia = {
                linear: function(a) {
                    return a
                },
                ease: ea,
                "ease-in": fa,
                "ease-out": ga,
                "ease-in-out": ha
            };

        function H(a) {
            if (!a) return null;
            if ("string" == typeof a) {
                if (-1 != a.indexOf("cubic-bezier")) {
                    var b = a.match(/cubic-bezier\((.+)\)/);
                    if (b) {
                        var c = b[1].split(",").map(parseFloat);
                        if (4 == c.length) {
                            for (var d = 0; 4 > d; d++)
                                if (isNaN(c[d])) return null;
                            return F(c[0], c[1], c[2], c[3])
                        }
                    }
                    return null
                }
                return ia[a]
            }
            return a
        };

        function ja() {}

        function I(a, b) {
            this.v = a;
            (a = b) || (a = r(self, "vsync"));
            this.m = a;
            this.W = null;
            this.c = []
        }

        function J(a, b, c, d) {
            return (new I(a)).setCurve(d).add(0, b, 1).start(c)
        }
        I.prototype.setCurve = function(a) {
            a && (this.W = H(a));
            return this
        };
        I.prototype.add = function(a, b, c, d) {
            this.c.push({
                delay: a,
                func: b,
                duration: c,
                curve: H(d)
            });
            return this
        };
        I.prototype.start = function(a) {
            var b = new K(this.m, this.v, this.c, this.W, a);
            a = b;
            a.$ = Date.now();
            a.J = !0;
            a.m.canAnimate(a.v) ? a.ba(a.aa) : (n().warn("Animation", "cannot animate"), L(a, !1, 0));
            return b
        };

        function K(a, b, c, d, e) {
            var g = this;
            this.m = a;
            this.v = b;
            this.c = [];
            for (b = 0; b < c.length; b++) {
                var h = c[b];
                this.c.push({
                    delay: h.delay,
                    func: h.func,
                    duration: h.duration,
                    curve: h.curve || d,
                    started: !1,
                    completed: !1
                })
            }
            this.ca = e;
            this.ja = this.ia = this.$ = 0;
            this.J = !1;
            this.aa = {};
            this.Z = new Promise(function(a, b) {
                g.ea = a;
                g.da = b
            });
            this.ba = this.m.createAnimTask(this.v, {
                mutate: this.fa.bind(this)
            })
        }
        K.prototype.then = function(a, b) {
            return a || b ? this.Z.then(a, b) : this.Z
        };
        K.prototype.thenAlways = function(a) {
            a = a || ja;
            return this.then(a, a)
        };
        K.prototype.halt = function(a) {
            L(this, !1, a || 0)
        };

        function L(a, b, c) {
            if (a.J) {
                a.J = !1;
                if (0 != c) {
                    1 < a.c.length && a.c.sort(function(a, b) {
                        return a.delay + a.duration - (b.delay + b.duration)
                    });
                    try {
                        if (0 < c)
                            for (var d = 0; d < a.c.length; d++) a.c[d].func(1, !0);
                        else
                            for (d = a.c.length - 1; 0 <= d; d--) a.c[d].func(0, !1)
                    } catch (e) {
                        n().error("Animation", "completion failed: " + e, e), b = !1
                    }
                }
                b ? a.ea() : a.da()
            }
        }
        K.prototype.fa = function() {
            if (this.J) {
                for (var a = Date.now(), b = Math.min((a - this.$) / this.ca, 1), c = 0; c < this.c.length; c++) {
                    var d = this.c[c];
                    !d.started && b >= d.delay && (d.started = !0)
                }
                for (c = 0; c < this.c.length; c++)
                    if (d = this.c[c], d.started && !d.completed) a: {
                        var e, g;
                        if (0 < d.duration) {
                            if (g = e = Math.min((b - d.delay) / d.duration, 1), d.curve && 1 != g) try {
                                g = d.curve(e)
                            } catch (h) {
                                n().error("Animation", "step curve failed: " + h, h);
                                L(this, !1, 0);
                                break a
                            }
                        } else g = e = 1;1 == e && (d.completed = !0);
                        try {
                            d.func(g, d.completed)
                        } catch (h) {
                            n().error("Animation",
                                "step mutate failed: " + h, h), L(this, !1, 0)
                        }
                    }
                1 == b ? L(this, !0, 0) : this.m.canAnimate(this.v) ? this.ba(this.aa) : (n().warn("Animation", "cancel animation"), L(this, !1, 0))
            }
        };

        function M(a, b) {
            return function(c) {
                return a + (b - a) * c
            }
        };

        function N(a) {
            AMP.BaseElement.call(this, a);
            this.j = this.l = null;
            this.T = !1
        }
        k(N, AMP.BaseElement);
        f = N.prototype;
        f.buildCallback = function() {
            (this.T = this.element.hasAttribute("controls")) && this.element.classList.add("-amp-carousel-has-controls");
            this.buildCarousel();
            this.buildButtons();
            this.setupGestures();
            this.setControlsState()
        };
        f.viewportCallback = function(a) {
            this.onViewportCallback(a);
            a && this.hintControls()
        };
        f.onViewportCallback = function() {};
        f.buildButtons = function() {
            var a = this;
            this.l = this.element.ownerDocument.createElement("div");
            this.l.classList.add("amp-carousel-button");
            this.l.classList.add("amp-carousel-button-prev");
            this.l.setAttribute("role", "button");
            this.l.setAttribute("aria-label", "previous");
            this.l.onclick = function() {
                a.interactionPrev()
            };
            this.element.appendChild(this.l);
            this.j = this.element.ownerDocument.createElement("div");
            this.j.classList.add("amp-carousel-button");
            this.j.classList.add("amp-carousel-button-next");
            this.j.setAttribute("role",
                "button");
            this.j.setAttribute("aria-label", "next");
            this.j.onclick = function() {
                a.interactionNext()
            };
            this.element.appendChild(this.j)
        };
        f.prerenderAllowed = function() {
            return !0
        };
        f.isRelayoutNeeded = function() {
            return !0
        };
        f.buildCarousel = function() {};
        f.setupGestures = function() {};
        f.go = function(a, b, c) {
            c = void 0 === c ? !1 : c;
            this.goCallback(a, b, c)
        };
        f.goCallback = function() {};
        f.setControlsState = function() {
            this.l.classList.toggle("amp-disabled", !this.hasPrev());
            this.l.setAttribute("aria-disabled", !this.hasPrev());
            this.j.classList.toggle("amp-disabled", !this.hasNext());
            this.j.setAttribute("aria-disabled", !this.hasNext())
        };
        f.hintControls = function() {
            var a = this;
            !this.T && this.isInViewport() && this.getVsync().mutate(function() {
                a.element.classList.add("-amp-carousel-button-start-hint");
                y(a.win).delay(function() {
                    a.deferMutate(function() {
                        return a.element.classList.remove("-amp-carousel-button-start-hint")
                    })
                }, 4E3)
            })
        };
        f.unlayoutCallback = function() {
            return !0
        };
        f.hasPrev = function() {};
        f.hasNext = function() {};
        f.interactionNext = function() {
            this.j.classList.contains("amp-disabled") || this.go(1, !0, !1)
        };
        f.interactionPrev = function() {
            this.l.classList.contains("amp-disabled") || this.go(-1, !0, !1)
        };

        function O(a) {
            N.call(this, a);
            this.D = null;
            this.X = this.G = !1;
            this.V = 5E3;
            this.R = this.shouldLoop = !1
        }
        k(O, N);
        f = O.prototype;
        f.buildCarousel = function() {
            this.G = this.element.hasAttribute("loop");
            this.X = this.element.hasAttribute("autoplay");
            this.buildSlides();
            this.shouldLoop = this.G && this.isLoopingEligible();
            if (this.R = this.X && this.isLoopingEligible()) {
                var a = Number(this.element.getAttribute("delay"));
                0 < a && (this.V = Math.max(1E3, a));
                this.G || (this.element.setAttribute("loop", ""), this.shouldLoop = this.G = !0)
            }
        };
        f.buildSlides = function() {};
        f.onViewportCallback = function(a) {
            this.updateViewportState(a);
            a ? P(this) : this.clearAutoplay()
        };
        f.goCallback = function(a, b, c) {
            this.moveSlide(a, b);
            c ? P(this) : this.clearAutoplay()
        };
        f.moveSlide = function() {};
        f.updateViewportState = function() {};
        f.isLoopingEligible = function() {
            return !1
        };

        function P(a) {
            a.R && (a.clearAutoplay(), a.D = y(a.win).delay(a.go.bind(a, 1, !0, !0), a.V))
        }
        f.clearAutoplay = function() {
            null !== this.D && (y(this.win).cancel(this.D), this.D = null)
        };

        function Q(a) {
            O.call(this, a);
            this.m = null;
            this.s = !1;
            this.f = [];
            this.h = 0;
            this.a = null;
            this.u = [];
            this.B = !1;
            this.C = this.A = null;
            this.M = !1;
            this.w = 0;
            this.b = null;
            this.I = this.o = this.Y = 0;
            this.L = [];
            var b = p(this.win, "platform");
            this.H = b.isIos();
            this.U = null;
            a = this.win;
            if (!z) {
                z = Object.create(null);
                if (a.AMP_CONFIG)
                    for (var c in a.AMP_CONFIG) {
                        var d = a.AMP_CONFIG[c];
                        "number" === typeof d && 0 <= d && 1 >= d && (z[c] = Math.random() < d)
                    }
                if (a.AMP_CONFIG && Array.isArray(a.AMP_CONFIG["allow-doc-opt-in"]) && 0 < a.AMP_CONFIG["allow-doc-opt-in"].length &&
                    (c = a.AMP_CONFIG["allow-doc-opt-in"], d = a.document.head.querySelector('meta[name="amp-experiments-opt-in"]')))
                    for (var d = d.getAttribute("content").split(","), e = 0; e < d.length; e++) - 1 != c.indexOf(d[e]) && (z[d[e]] = !0);
                Object.assign(z, ca(a))
            }
            a = z;
            if (a = false/*!!a["slidescroll-disable-css-snap"]*/) a = p(this.win, "platform").getIosVersionString(), a = 4 > a.length ? !1 : 0 == a.lastIndexOf("10.3", 0);
            this.S = a
        }
        k(Q, O);
        f = Q.prototype;
        f.isLayoutSupported = function(a) {
            return "fixed" == a || "fixed-height" == a || "responsive" == a || "fill" == a || "flex-item" == a
        };
        f.buildSlides = function() {
            var a = this;
            this.m = this.getVsync();
            this.U = aa(this.element);
            this.s = void 0 != da(this.element);
            this.S && (this.s = !1);
            this.element.classList.add("-amp-slidescroll");
            this.f = this.getRealChildren();
            this.h = this.f.length;
            this.a = this.win.document.createElement("div");
            this.a.classList.add("-amp-slides-container");
            this.a.setAttribute("aria-live", "polite");
            this.S && this.a.classList.add("-amp-slidescroll-no-snap");
            if (this.s) {
                var b = this.win.document.createElement("div");
                b.classList.add("-amp-carousel-start-marker");
                this.a.appendChild(b);
                b = this.win.document.createElement("div");
                b.classList.add("-amp-carousel-end-marker");
                this.a.appendChild(b)
            }
            this.f.forEach(function(b, d) {
                a.L.push(b.getAttribute("data-slide-id") || d.toString());
                a.setAsOwner(b);
                var c = a.win.document.createElement("div");
                b.classList.add("amp-carousel-slide");
                c.appendChild(b);
                c.classList.add("-amp-slide-item");
                a.a.appendChild(c);
                a.u.push(c)
            });
            this.element.appendChild(this.a);
            this.K();
            this.a.addEventListener("scroll", this.O.bind(this));
            this.a.addEventListener("touchmove",
                this.ha.bind(this));
            this.a.addEventListener("touchend", this.ga.bind(this));
            this.registerAction("goToSlide", function(b) {
                var c = b.args;
                c && R(a, c.index)
            })
        };
        f.isLoopingEligible = function() {
            return 2 < this.h
        };
        f.mutatedAttributesCallback = function(a) {
            var b = a.slide;
            void 0 !== b && R(this, b)
        };
        f.ha = function() {
            this.clearAutoplay();
            this.s && (this.M = !0, this.C && y(this.win).cancel(this.C))
        };
        f.ga = function() {
            var a = this;
            if (this.M) {
                this.A && y(this.win).cancel(this.A);
                var b = this.S ? 45 : 120;
                this.C = y(this.win).delay(function() {
                    var b = a.a.scrollLeft;
                    a.B || (S(a, b), a.C = null)
                }, b)
            }
            this.M = !1
        };
        f.onLayoutMeasure = function() {
            this.o = this.getLayoutWidth();
            null !== this.b && (this.a.scrollLeft = T(this, this.b));
            this.I = this.a.scrollLeft
        };
        f.layoutCallback = function() {
            null === this.b && U(this, this.Y);
            return Promise.resolve()
        };
        f.updateViewportState = function(a) {
            null !== this.b && this.updateInViewport(this.f[this.b], a)
        };
        f.hasPrev = function() {
            return this.shouldLoop || 0 < this.b
        };
        f.hasNext = function() {
            return this.shouldLoop || this.b < this.f.length - 1
        };
        f.moveSlide = function(a, b) {
            if (null !== this.b) {
                var c = this.hasNext(),
                    d = this.hasPrev();
                if (1 == a && c || -1 == a && d) {
                    var e = this.b + a; - 1 == e ? e = this.h - 1 : e >= this.h && (e = 0);
                    b ? V(this, 1 != a || d ? this.o : 0, a) : ka(this, e)
                }
            }
        };
        f.O = function() {
            var a = this;
            this.A && y(this.win).cancel(this.A);
            var b = this.a.scrollLeft;
            this.H || la(this, b);
            if (!this.C) {
                var c = this.s ? 35 : this.H ? 45 : 100;
                this.A = y(this.win).delay(function() {
                    a.B || (a.s ? S(a, b) : V(a, b))
                }, c)
            }
            this.I = b
        };

        function la(a, b) {
            var c = a.a.scrollWidth; - 1 == a.w && b >= a.I ? V(a, b).then(function() {
                a.w = 0
            }) : 1 == a.w && b <= a.I ? V(a, b).then(function() {
                a.w = 0
            }) : a.w = 0 > b ? -1 : b + a.o > c ? 1 : 0
        }

        function V(a, b, c) {
            a.B = !0;
            var d, e = ma(a, b) - a.b,
                g = a.hasPrev();
            0 != e || 1 != c && -1 != c || (e = c);
            if (0 == e) d = g ? a.o : 0;
            else if (1 == e || -1 != e && e == -1 * (a.h - 1)) d = g ? 2 * a.o : a.o;
            else if (-1 == e || e == a.h - 1) d = 0;
            return na(a, b, d).then(function() {
                S(a, d)
            })
        }

        function ma(a, b) {
            var c = Math.round(b / a.o),
                d = 0;
            b = a.hasPrev();
            var e = a.hasNext();
            b && e ? d = c - 1 : e ? d = c : b && (d = c - 1);
            b = a.b + d;
            return b = a.shouldLoop ? 0 > b ? a.h - 1 : b >= a.h ? 0 : b : 0 > b ? 0 : b >= a.h ? a.h - 1 : b
        }

        function S(a, b) {
            a.B = !0;
            var c = ma(a, b);
            a.m.mutate(function() {
                a.H && a.a.classList.add("-amp-no-scroll");
                ka(a, c);
                a.m.mutate(function() {
                    a.H && a.a.classList.remove("-amp-no-scroll");
                    a.B = !1
                })
            })
        }

        function R(a, b) {
            var c = parseInt(b, 10);
            if (isFinite(c)) null === a.b ? a.Y = c : U(a, c);
            else {
                if (m.user) a = m.user;
                else throw Error("failed to call initLogConstructor");
                a.warn("AMP-CAROUSEL", "Invalid [slide] value: %s", b)
            }
        }

        function U(a, b) {
            var c = a.h;
            if (!(0 > b || b >= c || a.b == b)) {
                var d = 0 <= b - 1 ? b - 1 : a.shouldLoop ? c - 1 : null,
                    e = b + 1 < c ? b + 1 : a.shouldLoop ? 0 : null,
                    g = [];
                null != d && g.push(d);
                g.push(b);
                null != e && g.push(e);
                null !== a.b && a.updateInViewport(a.f[a.b], !1);
                a.updateInViewport(a.f[b], !0);
                g.forEach(function(c, d) {
                    a.shouldLoop && D(a.u[c], d + 1);
                    a.u[c].classList.add("-amp-slide-item-show");
                    c == b ? (a.scheduleLayout(a.f[c]), a.scheduleResume(a.f[c]), a.f[c].setAttribute("aria-hidden", "false")) : (a.schedulePreload(a.f[c]), a.f[c].setAttribute("aria-hidden",
                        "true"))
                });
                a.a.scrollLeft = T(a, b);
                oa(a, b);
                a.b = b;
                pa(a, g);
                a.setControlsState()
            }
        }

        function ka(a, b) {
            U(a, b);
            var c = new CustomEvent("slidescroll.slideChange", {
                detail: {
                    index: b
                }
            });
            a.U.trigger(a.element, "slideChange", c)
        }

        function T(a, b) {
            var c = a.o;
            a.shouldLoop || 0 != b || (c = 0);
            return c
        }

        function pa(a, b) {
            for (var c = a.h, d = 0; d < c; d++) a.u[d].classList.contains("-amp-slide-item-show") && (-1 == b.indexOf(d) && (a.shouldLoop && D(a.u[d], ""), a.u[d].classList.remove("-amp-slide-item-show"), a.f[d].removeAttribute("aria-hidden")), a.b != d && a.schedulePause(a.f[d]))
        }

        function na(a, b, c) {
            if (b == c) return Promise.resolve();
            var d = M(b, c);
            c = F(.4, 0, .2, 1);
            var e = a.a;
            return J(e, function(b) {
                a.a.scrollLeft = d(b)
            }, 80, c).thenAlways()
        }
        f.K = function() {
            this.element.addEventListener("touchmove", function(a) {
                a.stopPropagation()
            })
        };

        function oa(a, b) {
            var c = b - a.b;
            if (0 != c) {
                1 !== Math.abs(c) && (c = 0 > c ? 1 : -1);
                var d = {
                    fromSlide: a.L[a.b],
                    toSlide: a.L[b]
                };
                E(a.element, "amp-carousel-change", d);
                1 == c ? E(a.element, "amp-carousel-next", d) : E(a.element, "amp-carousel-prev", d)
            }
        };

        function W(a) {
            N.call(this, a);
            this.N = this.g = 0;
            this.P = this.i = this.F = null
        }
        k(W, N);
        f = W.prototype;
        f.isLayoutSupported = function(a) {
            return "fixed" == a || "fixed-height" == a
        };
        f.buildCarousel = function() {
            var a = this;
            this.F = this.getRealChildren();
            this.i = this.element.ownerDocument.createElement("div");
            this.i.classList.add("-amp-scrollable-carousel-container");
            this.element.appendChild(this.i);
            this.F.forEach(function(b) {
                a.setAsOwner(b);
                b.classList.add("amp-carousel-slide");
                a.i.appendChild(b)
            });
            this.K();
            this.i.addEventListener("scroll", this.O.bind(this))
        };
        f.layoutCallback = function() {
            qa(this, this.g);
            ra(this, this.g, 1);
            this.setControlsState();
            return Promise.resolve()
        };
        f.onViewportCallback = function() {
            sa(this, this.g, this.g)
        };
        f.goCallback = function(a, b) {
            var c = this,
                d = ta(this, this.g, a),
                e = this.g;
            if (d != e)
                if (b) {
                    var g = M(e, d);
                    J(this.element, function(a) {
                        c.i.scrollLeft = g(a)
                    }, 200, "ease-in-out").thenAlways(function() {
                        X(c, d)
                    })
                } else X(this, d), this.i.scrollLeft = d
        };
        f.O = function() {
            var a = this.i.scrollLeft;
            this.g = a;
            null === this.P && ua(this, a)
        };

        function ua(a, b) {
            a.P = y(a.win).delay(function() {
                30 > Math.abs(b - a.g) ? (a.P = null, X(a, a.g)) : ua(a, a.g)
            }, 100)
        }

        function X(a, b) {
            sa(a, b, a.N);
            qa(a, b);
            ra(a, b, Math.sign(b - a.N));
            a.N = b;
            a.g = b;
            a.setControlsState()
        }

        function ta(a, b, c) {
            var d = a.element.offsetWidth,
                e = a.i.scrollWidth;
            a = b + c * d;
            return 0 > a ? 0 : e >= d && a > e - d ? e - d : a
        }

        function Y(a, b, c) {
            for (var d = a.getLayoutWidth(), e = 0; e < a.F.length; e++) {
                var g = a.F[e];
                g.offsetLeft + g.offsetWidth >= b && g.offsetLeft <= b + d && c(g)
            }
        }

        function qa(a, b) {
            Y(a, b, function(b) {
                a.scheduleLayout(b)
            })
        }

        function ra(a, b, c) {
            var d = ta(a, b, c);
            d != b && Y(a, d, function(b) {
                a.schedulePreload(b)
            })
        }

        function sa(a, b, c) {
            var d = [];
            Y(a, b, function(b) {
                d.push(b);
                a.updateInViewport(b, !0)
            });
            c != b && Y(a, c, function(b) {
                -1 == d.indexOf(b) && (a.updateInViewport(b, !1), a.schedulePause(b))
            })
        }
        f.hasPrev = function() {
            return 0 != this.g
        };
        f.hasNext = function() {
            var a = this.getLayoutWidth(),
                b = Math.max(this.i.scrollWidth - a, 0);
            return this.g != b
        };
        f.K = function() {
            this.element.addEventListener("touchmove", function(a) {
                a.stopPropagation()
            })
        };

        function Z(a) {
            AMP.BaseElement.apply(this, arguments)
        }
        k(Z, AMP.BaseElement);
        Z.prototype.upgradeCallback = function() {
            return "slides" == this.element.getAttribute("type") ? new Q(this.element) : new W(this.element)
        };
        AMP.registerElement("amp-carousel", Z, ".amp-carousel-slide>.i-amphtml-replaced-content{-o-object-fit:contain;object-fit:contain}.amp-carousel-button{position:absolute;box-sizing:border-box;top:50%;height:34px;width:34px;border-radius:2px;opacity:0;pointer-events:all;background-color:rgba(0,0,0,.5);background-position:50% 50%;background-repeat:no-repeat;-webkit-transform:translateY(-50%);transform:translateY(-50%);visibility:hidden;z-index:10}.amp-mode-mouse .amp-carousel-button,amp-carousel[controls] .amp-carousel-button{opacity:1;visibility:visible}.amp-carousel-button-prev{left:16px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='%23fff' viewBox='0 0 18 18'%3E%3Cpath d='M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z'/%3E%3C/svg%3E\");background-size:18px 18px}.amp-carousel-button-next{right:16px;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='%23fff' viewBox='0 0 18 18'%3E%3Cpath d='M9 3L7.94 4.06l4.19 4.19H3v1.5h9.13l-4.19 4.19L9 15l6-6z'/%3E%3C/svg%3E\");background-size:18px 18px}:not(.amp-mode-mouse) .-amp-carousel-button-start-hint .amp-carousel-button:not(.amp-disabled){-webkit-animation:-amp-carousel-hint 1s ease-in 3s 1 normal both;animation:-amp-carousel-hint 1s ease-in 3s 1 normal both}@-webkit-keyframes -amp-carousel-hint{0%{opacity:1;visibility:visible}to{opacity:0;visibility:hidden}}@keyframes -amp-carousel-hint{0%{opacity:1;visibility:visible}to{opacity:0;visibility:hidden}}amp-carousel .amp-carousel-button.amp-disabled{-webkit-animation:none;animation:none;opacity:0;visibility:hidden}.-amp-slides-container{display:-webkit-box!important;display:-webkit-flex!important;display:-ms-flexbox!important;display:flex!important;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;height:100%!important;left:0;overflow-x:auto!important;overflow-y:hidden!important;position:absolute!important;top:0;width:100%!important;-webkit-scroll-snap-type:mandatory!important;scroll-snap-type:mandatory!important;padding-bottom:20px!important;box-sizing:content-box!important;-webkit-overflow-scrolling:touch!important}.-amp-slides-container.-amp-no-scroll{overflow-x:hidden!important}.-amp-slide-item{-webkit-box-align:center!important;-webkit-align-items:center!important;-ms-flex-align:center!important;align-items:center!important;display:none!important;-webkit-box-flex:0!important;-webkit-flex:0 0 100%!important;-ms-flex:0 0 100%!important;flex:0 0 100%!important;height:100%!important;-webkit-box-pack:center!important;-webkit-justify-content:center!important;-ms-flex-pack:center!important;justify-content:center!important;position:relative!important;-webkit-scroll-snap-coordinate:0 0!important;scroll-snap-align:start;scroll-snap-coordinate:0 0!important;width:100%!important}.-amp-slide-item>*{height:100%;width:100%;overflow:hidden!important}.-amp-slide-item-show{display:-webkit-box!important;display:-webkit-flex!important;display:-ms-flexbox!important;display:flex!important}.-amp-carousel-end-marker,.-amp-carousel-start-marker{background-color:transparent!important;display:block!important;-webkit-box-flex:0!important;-webkit-flex:0 0 1px!important;-ms-flex:0 0 1px!important;flex:0 0 1px!important;height:100%!important;position:relative!important;-webkit-scroll-snap-coordinate:0 0!important;scroll-snap-align:start;scroll-snap-coordinate:0 0!important;width:1px!important}.-amp-carousel-start-marker{-webkit-box-ordinal-group:0!important;-webkit-order:-1!important;-ms-flex-order:-1!important;order:-1!important;margin-left:-1px!important}.-amp-carousel-end-marker{-webkit-box-ordinal-group:100000001!important;-webkit-order:100000000!important;-ms-flex-order:100000000!important;order:100000000!important;margin-right:-1px!important}.-amp-slidescroll-no-snap.-amp-slides-container{-webkit-scroll-snap-type:none!important;scroll-snap-type:none!important}.-amp-slidescroll-no-snap .-amp-slide-item{-webkit-scroll-snap-coordinate:none!important;scroll-snap-coordinate:none!important}.-amp-scrollable-carousel-container .amp-carousel-slide{display:inline-block!important;margin-left:8px}.-amp-scrollable-carousel-container .amp-carousel-slide:first-child{margin-left:0px}.-amp-scrollable-carousel-container{white-space:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important}\n/*# sourceURL=/extensions/amp-carousel/0.1/amp-carousel.css*/");
    })
});
