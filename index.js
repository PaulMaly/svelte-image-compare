(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('svelte/internal')) :
	typeof define === 'function' && define.amd ? define(['svelte/internal'], factory) :
	(global = global || self, global.ImageCompare = factory(global.internal));
}(this, function (internal) { 'use strict';

	/* src/index.html generated by Svelte v3.0.0-beta.1 */

	function add_css() {
		var style = internal.createElement("style");
		style.id = 'svelte-1frzg7s-style';
		style.textContent = ".container.svelte-1frzg7s{overflow:hidden;position:relative;box-sizing:content-box}.container.svelte-1frzg7s img.svelte-1frzg7s{top:0;left:0;z-index:20;display:block;max-width:100%;user-select:none;object-fit:cover;position:absolute}.overlay.svelte-1frzg7s{top:0;opacity:0;z-index:25;width:100%;height:100%;position:absolute;transition:opacity .5s;background:rgba(0, 0, 0, .5)}.before-label.svelte-1frzg7s,.after-label.svelte-1frzg7s{top:0;bottom:0;z-index:25;user-select:none;position:absolute}.before-label.svelte-1frzg7s{left:0}.after-label.svelte-1frzg7s{right:0}.container.svelte-1frzg7s:hover>.overlay.svelte-1frzg7s{opacity:1}.handle.svelte-1frzg7s{z-index:30;width:40px;height:40px;cursor:move;background:none;margin-top:-4px;margin-left:-4px;user-select:none;position:absolute;border-radius:50px;top:calc(50% - 20px);border:4px solid white}.handle.svelte-1frzg7s:before,.handle.svelte-1frzg7s:after{content:\"\";height:9999px;position:absolute;left:calc(50% - 2px);border:2px solid white}.handle.svelte-1frzg7s:before{top:40px}.handle.svelte-1frzg7s:after{bottom:40px}.arrow-right.svelte-1frzg7s,.arrow-left.svelte-1frzg7s{width:0;height:0;user-select:none;position:relative;border-top:10px solid transparent;border-bottom:10px solid transparent}.arrow-right.svelte-1frzg7s{left:23px;bottom:10px;border-left:10px solid white}.arrow-left.svelte-1frzg7s{left:7px;top:10px;border-right:10px solid white}";
		internal.append(document.head, style);
	}

	// (24:1) {#if overlay}
	function create_if_block(ctx) {
		var div;

		return {
			c() {
				div = internal.createElement("div");
				div.className = "overlay svelte-1frzg7s";
				internal.setStyle(div, "opacity", ctx.opacity);
			},

			m(target, anchor) {
				internal.insert(target, div, anchor);
			},

			p(changed, ctx) {
				if (changed.opacity) {
					internal.setStyle(div, "opacity", ctx.opacity);
				}
			},

			d(detach) {
				if (detach) {
					internal.detachNode(div);
				}
			}
		};
	}

	function create_fragment(ctx) {
		var div5, img0, text0, img1, img1_style_value, text1, text2, div0, text3, div1, text4, div4, div2, text5, div3, dispose;

		var if_block = (ctx.overlay) && create_if_block(ctx);

		const before_slot_1 = ctx.$$slot_before;
		const before_slot = internal.create_slot(before_slot_1, ctx, null);

		const after_slot_1 = ctx.$$slot_after;
		const after_slot = internal.create_slot(after_slot_1, ctx, null);

		return {
			c() {
				div5 = internal.createElement("div");
				img0 = internal.createElement("img");
				text0 = internal.createText("\n\t");
				img1 = internal.createElement("img");
				text1 = internal.createText("\n\t");
				if (if_block) if_block.c();
				text2 = internal.createText("\n\t");
				div0 = internal.createElement("div");

				if (before_slot) before_slot.c();
				text3 = internal.createText("\n\t");
				div1 = internal.createElement("div");

				if (after_slot) after_slot.c();
				text4 = internal.createText("\n\t");
				div4 = internal.createElement("div");
				div2 = internal.createElement("div");
				text5 = internal.createText("\n\t\t");
				div3 = internal.createElement("div");
				img0.src = ctx.after;
				img0.alt = "after";
				img0.style.cssText = ctx.style;
				img0.className = "svelte-1frzg7s";
				img1.src = ctx.before;
				img1.alt = "before";
				img1.style.cssText = img1_style_value = "" + ctx.style + "clip:rect(0, " + ctx.x + "px, " + ctx.h + "px, 0);";
				img1.className = "svelte-1frzg7s";

				div0.className = "before-label svelte-1frzg7s";
				internal.setStyle(div0, "opacity", ctx.opacity);

				div1.className = "after-label svelte-1frzg7s";
				internal.setStyle(div1, "opacity", ctx.opacity);
				div2.className = "arrow-left svelte-1frzg7s";
				div3.className = "arrow-right svelte-1frzg7s";
				div4.className = "handle svelte-1frzg7s";
				internal.setStyle(div4, "left", "calc(" + ctx.offset * 100 + "% - 20px)");
				div5.className = "container svelte-1frzg7s";
				div5.style.cssText = ctx.style;

				dispose = [
					internal.addListener(window, "touchmove", ctx.move),
					internal.addListener(window, "touchend", ctx.end),
					internal.addListener(window, "mousemove", ctx.move),
					internal.addListener(window, "mouseup", ctx.end),
					internal.addListener(window, "resize", ctx.resize),
					internal.addListener(img0, "mousedown", internal.preventDefault(ctx.mousedown_handler)),
					internal.addListener(img0, "load", ctx.resize),
					internal.addListener(img1, "mousedown", internal.preventDefault(ctx.mousedown_handler_1)),
					internal.addListener(div5, "touchstart", ctx.start),
					internal.addListener(div5, "mousedown", ctx.start)
				];
			},

			l(nodes) {
				if (before_slot) before_slot.l(div0_nodes);
				if (after_slot) after_slot.l(div1_nodes);
			},

			m(target, anchor) {
				internal.insert(target, div5, anchor);
				internal.append(div5, img0);
				internal.add_binding_callback(() => ctx.img0_binding(img0, null));
				internal.append(div5, text0);
				internal.append(div5, img1);
				internal.append(div5, text1);
				if (if_block) if_block.m(div5, null);
				internal.append(div5, text2);
				internal.append(div5, div0);

				if (before_slot) {
					before_slot.m(div0, null);
				}

				internal.append(div5, text3);
				internal.append(div5, div1);

				if (after_slot) {
					after_slot.m(div1, null);
				}

				internal.append(div5, text4);
				internal.append(div5, div4);
				internal.append(div4, div2);
				internal.append(div4, text5);
				internal.append(div4, div3);
			},

			p(changed, ctx) {
				if (changed.items) {
					ctx.img0_binding(null, img0);
					ctx.img0_binding(img0, null);
				}

				if (changed.after) {
					img0.src = ctx.after;
				}

				if (changed.style) {
					img0.style.cssText = ctx.style;
				}

				if (changed.before) {
					img1.src = ctx.before;
				}

				if ((changed.style || changed.x || changed.h) && img1_style_value !== (img1_style_value = "" + ctx.style + "clip:rect(0, " + ctx.x + "px, " + ctx.h + "px, 0);")) {
					img1.style.cssText = img1_style_value;
				}

				if (ctx.overlay) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(div5, text2);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (before_slot && changed.$$scope) {
					before_slot.p(internal.assign(internal.assign({},(changed)), ctx.$$scope.changed), internal.get_slot_context(before_slot_1, ctx, null));
				}

				if (changed.opacity) {
					internal.setStyle(div0, "opacity", ctx.opacity);
				}

				if (after_slot && changed.$$scope) {
					after_slot.p(internal.assign(internal.assign({},(changed)), ctx.$$scope.changed), internal.get_slot_context(after_slot_1, ctx, null));
				}

				if (changed.opacity) {
					internal.setStyle(div1, "opacity", ctx.opacity);
				}

				if (changed.offset) {
					internal.setStyle(div4, "left", "calc(" + ctx.offset * 100 + "% - 20px)");
				}

				if (changed.style) {
					div5.style.cssText = ctx.style;
				}
			},

			i: internal.noop,
			o: internal.noop,

			d(detach) {
				if (detach) {
					internal.detachNode(div5);
				}

				ctx.img0_binding(null, img0);
				if (if_block) if_block.d();

				if (before_slot) before_slot.d(detach);

				if (after_slot) after_slot.d(detach);
				internal.run_all(dispose);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let imgOffset = null,
			sliding = false,
			img;

		let { before = '', after = '', offset = 0.5, overlay = true, contain = false, hideOnSlide = true } = $$props;

		function resize() {
			imgOffset = img.getBoundingClientRect(); $$invalidate('imgOffset', imgOffset);
		}

		function move(e) {
			if (sliding && imgOffset) {
				let x = (e.touches ? e.touches[0].pageX : e.pageX) - imgOffset.left;
				x = x < 0 ? 0 : ((x > w) ? w : x);
				offset = x / w; $$invalidate('offset', offset);
			}
		}

		function start(e) {
			sliding = true; $$invalidate('sliding', sliding);
			move(e);
		}

		function end() {
			sliding = false; $$invalidate('sliding', sliding);
		}

		let w, h, x, style, opacity;

		let { $$slot_before, $$slot_after, $$scope } = $$props;

		function mousedown_handler(event) {
			internal.bubble($$self, event);
		}

		function mousedown_handler_1(event) {
			internal.bubble($$self, event);
		}

		function img0_binding($$node, check) {
			img = $$node;
			$$invalidate('img', img);
		}

		$$self.$set = $$props => {
			if ('before' in $$props) $$invalidate('before', before = $$props.before);
			if ('after' in $$props) $$invalidate('after', after = $$props.after);
			if ('offset' in $$props) $$invalidate('offset', offset = $$props.offset);
			if ('overlay' in $$props) $$invalidate('overlay', overlay = $$props.overlay);
			if ('contain' in $$props) $$invalidate('contain', contain = $$props.contain);
			if ('hideOnSlide' in $$props) $$invalidate('hideOnSlide', hideOnSlide = $$props.hideOnSlide);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		$$self.$$.update = ($$dirty = { w: 1, imgOffset: 1, h: 1, x: 1, offset: 1, opacity: 1, hideOnSlide: 1, sliding: 1, style: 1, contain: 1 }) => {
			if ($$dirty.w || $$dirty.imgOffset) {
				w = imgOffset && imgOffset.width; $$invalidate('w', w);
			}
			if ($$dirty.h || $$dirty.imgOffset) {
				h = imgOffset && imgOffset.height; $$invalidate('h', h);
			}
			if ($$dirty.x || $$dirty.w || $$dirty.offset) {
				x = w * offset; $$invalidate('x', x);
			}
			if ($$dirty.opacity || $$dirty.hideOnSlide || $$dirty.sliding) {
				opacity = hideOnSlide && sliding ? 0 : 1; $$invalidate('opacity', opacity);
			}
			if ($$dirty.style || $$dirty.contain || $$dirty.w || $$dirty.h) {
				style = contain ? `width:100%;height:100%;` : `width:${w}px;height:${h}px;`; $$invalidate('style', style);
			}
		};

		return {
			img,
			before,
			after,
			offset,
			overlay,
			contain,
			hideOnSlide,
			resize,
			move,
			start,
			end,
			h,
			x,
			style,
			opacity,
			mousedown_handler,
			mousedown_handler_1,
			img0_binding,
			$$slot_before,
			$$slot_after,
			$$scope
		};
	}

	class Index extends internal.SvelteComponent {
		constructor(options) {
			super();
			if (!document.getElementById("svelte-1frzg7s-style")) add_css();
			internal.init(this, options, instance, create_fragment, internal.safe_not_equal);
		}

		get before() {
			return this.$$.ctx.before;
		}

		set before(before) {
			this.$set({ before });
			internal.flush();
		}

		get after() {
			return this.$$.ctx.after;
		}

		set after(after) {
			this.$set({ after });
			internal.flush();
		}

		get offset() {
			return this.$$.ctx.offset;
		}

		set offset(offset) {
			this.$set({ offset });
			internal.flush();
		}

		get overlay() {
			return this.$$.ctx.overlay;
		}

		set overlay(overlay) {
			this.$set({ overlay });
			internal.flush();
		}

		get contain() {
			return this.$$.ctx.contain;
		}

		set contain(contain) {
			this.$set({ contain });
			internal.flush();
		}

		get hideOnSlide() {
			return this.$$.ctx.hideOnSlide;
		}

		set hideOnSlide(hideOnSlide) {
			this.$set({ hideOnSlide });
			internal.flush();
		}
	}

	return Index;

}));