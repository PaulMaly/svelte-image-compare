function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    if (component.$$.fragment) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, prop_names) {
    const parent_component = current_component;
    set_current_component(component);
    const props = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, props, (key, value) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

/* src/ImageCompare.svelte generated by Svelte v3.9.1 */

function add_css() {
	var style = element("style");
	style.id = 'svelte-1frzg7s-style';
	style.textContent = ".container.svelte-1frzg7s{overflow:hidden;position:relative;box-sizing:content-box}.container.svelte-1frzg7s img.svelte-1frzg7s{top:0;left:0;z-index:20;display:block;max-width:100%;user-select:none;object-fit:cover;position:absolute}.overlay.svelte-1frzg7s{top:0;opacity:0;z-index:25;width:100%;height:100%;position:absolute;transition:opacity .5s;background:rgba(0, 0, 0, .5)}.before-label.svelte-1frzg7s,.after-label.svelte-1frzg7s{top:0;bottom:0;z-index:25;user-select:none;position:absolute}.before-label.svelte-1frzg7s{left:0}.after-label.svelte-1frzg7s{right:0}.container.svelte-1frzg7s:hover>.overlay.svelte-1frzg7s{opacity:1}.handle.svelte-1frzg7s{z-index:30;width:40px;height:40px;cursor:move;background:none;margin-top:-4px;margin-left:-4px;user-select:none;position:absolute;border-radius:50px;top:calc(50% - 20px);border:4px solid white}.handle.svelte-1frzg7s:before,.handle.svelte-1frzg7s:after{content:\"\";height:9999px;position:absolute;left:calc(50% - 2px);border:2px solid white}.handle.svelte-1frzg7s:before{top:40px}.handle.svelte-1frzg7s:after{bottom:40px}.arrow-right.svelte-1frzg7s,.arrow-left.svelte-1frzg7s{width:0;height:0;user-select:none;position:relative;border-top:10px solid transparent;border-bottom:10px solid transparent}.arrow-right.svelte-1frzg7s{left:23px;bottom:10px;border-left:10px solid white}.arrow-left.svelte-1frzg7s{left:7px;top:10px;border-right:10px solid white}";
	append(document.head, style);
}

const get_after_slot_changes = () => ({});
const get_after_slot_context = () => ({});

const get_before_slot_changes = () => ({});
const get_before_slot_context = () => ({});

// (24:1) {#if overlay}
function create_if_block(ctx) {
	var div;

	return {
		c() {
			div = element("div");
			attr(div, "class", "overlay svelte-1frzg7s");
			set_style(div, "opacity", ctx.opacity);
		},

		m(target, anchor) {
			insert(target, div, anchor);
		},

		p(changed, ctx) {
			if (changed.opacity) {
				set_style(div, "opacity", ctx.opacity);
			}
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment(ctx) {
	var div5, img0, t0, img1, img1_style_value, t1, t2, div0, t3, div1, t4, div4, div2, t5, div3, current, dispose;

	var if_block = (ctx.overlay) && create_if_block(ctx);

	const before_slot_template = ctx.$$slots.before;
	const before_slot = create_slot(before_slot_template, ctx, get_before_slot_context);

	const after_slot_template = ctx.$$slots.after;
	const after_slot = create_slot(after_slot_template, ctx, get_after_slot_context);

	return {
		c() {
			div5 = element("div");
			img0 = element("img");
			t0 = space();
			img1 = element("img");
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			div0 = element("div");

			if (before_slot) before_slot.c();
			t3 = space();
			div1 = element("div");

			if (after_slot) after_slot.c();
			t4 = space();
			div4 = element("div");
			div2 = element("div");
			t5 = space();
			div3 = element("div");
			attr(img0, "src", ctx.after);
			attr(img0, "alt", "after");
			attr(img0, "style", ctx.style);
			attr(img0, "class", "svelte-1frzg7s");
			attr(img1, "src", ctx.before);
			attr(img1, "alt", "before");
			attr(img1, "style", img1_style_value = "" + ctx.style + "clip:rect(0, " + ctx.x + "px, " + ctx.h + "px, 0);");
			attr(img1, "class", "svelte-1frzg7s");

			attr(div0, "class", "before-label svelte-1frzg7s");
			set_style(div0, "opacity", ctx.opacity);

			attr(div1, "class", "after-label svelte-1frzg7s");
			set_style(div1, "opacity", ctx.opacity);
			attr(div2, "class", "arrow-left svelte-1frzg7s");
			attr(div3, "class", "arrow-right svelte-1frzg7s");
			attr(div4, "class", "handle svelte-1frzg7s");
			set_style(div4, "left", "calc(" + ctx.offset * 100 + "% - 20px)");
			attr(div5, "class", "container svelte-1frzg7s");
			attr(div5, "style", ctx.style);

			dispose = [
				listen(window, "touchmove", ctx.move),
				listen(window, "touchend", ctx.end),
				listen(window, "mousemove", ctx.move),
				listen(window, "mouseup", ctx.end),
				listen(window, "resize", ctx.resize),
				listen(img0, "mousedown", prevent_default(ctx.mousedown_handler)),
				listen(img0, "load", ctx.resize),
				listen(img1, "mousedown", prevent_default(ctx.mousedown_handler_1)),
				listen(div5, "touchstart", ctx.start),
				listen(div5, "mousedown", ctx.start)
			];
		},

		l(nodes) {
			if (before_slot) before_slot.l(div0_nodes);

			if (after_slot) after_slot.l(div1_nodes);
		},

		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, img0);
			ctx.img0_binding(img0);
			append(div5, t0);
			append(div5, img1);
			append(div5, t1);
			if (if_block) if_block.m(div5, null);
			append(div5, t2);
			append(div5, div0);

			if (before_slot) {
				before_slot.m(div0, null);
			}

			append(div5, t3);
			append(div5, div1);

			if (after_slot) {
				after_slot.m(div1, null);
			}

			append(div5, t4);
			append(div5, div4);
			append(div4, div2);
			append(div4, t5);
			append(div4, div3);
			current = true;
		},

		p(changed, ctx) {
			if (!current || changed.after) {
				attr(img0, "src", ctx.after);
			}

			if (!current || changed.style) {
				attr(img0, "style", ctx.style);
			}

			if (!current || changed.before) {
				attr(img1, "src", ctx.before);
			}

			if ((!current || changed.style || changed.x || changed.h) && img1_style_value !== (img1_style_value = "" + ctx.style + "clip:rect(0, " + ctx.x + "px, " + ctx.h + "px, 0);")) {
				attr(img1, "style", img1_style_value);
			}

			if (ctx.overlay) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div5, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (before_slot && before_slot.p && changed.$$scope) {
				before_slot.p(
					get_slot_changes(before_slot_template, ctx, changed, get_before_slot_changes),
					get_slot_context(before_slot_template, ctx, get_before_slot_context)
				);
			}

			if (!current || changed.opacity) {
				set_style(div0, "opacity", ctx.opacity);
			}

			if (after_slot && after_slot.p && changed.$$scope) {
				after_slot.p(
					get_slot_changes(after_slot_template, ctx, changed, get_after_slot_changes),
					get_slot_context(after_slot_template, ctx, get_after_slot_context)
				);
			}

			if (!current || changed.opacity) {
				set_style(div1, "opacity", ctx.opacity);
			}

			if (!current || changed.offset) {
				set_style(div4, "left", "calc(" + ctx.offset * 100 + "% - 20px)");
			}

			if (!current || changed.style) {
				attr(div5, "style", ctx.style);
			}
		},

		i(local) {
			if (current) return;
			transition_in(before_slot, local);
			transition_in(after_slot, local);
			current = true;
		},

		o(local) {
			transition_out(before_slot, local);
			transition_out(after_slot, local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				detach(div5);
			}

			ctx.img0_binding(null);
			if (if_block) if_block.d();

			if (before_slot) before_slot.d(detaching);

			if (after_slot) after_slot.d(detaching);
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { hideOnSlide = true } = $$props; let imgOffset = null,
		sliding = false,
		{ contain = false, overlay = true, offset = 0.5, before = '', after = '' } = $$props; let img;

	function resize(e) {
		$$invalidate('imgOffset', imgOffset = (e.type === 'load' ? e.target : img).getBoundingClientRect());
	}

	function move(e) {
		if (sliding && imgOffset) {
			let x = (e.touches ? e.touches[0].pageX : e.pageX) - imgOffset.left;
			x = x < 0 ? 0 : ((x > w) ? w : x);
			$$invalidate('offset', offset = x / w);
		}
	}

	function start(e) {
		$$invalidate('sliding', sliding = true);
		move(e);
	}

	function end() {
		$$invalidate('sliding', sliding = false);
	}

	let { $$slots = {}, $$scope } = $$props;

	function mousedown_handler(event) {
		bubble($$self, event);
	}

	function mousedown_handler_1(event) {
		bubble($$self, event);
	}

	function img0_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			$$invalidate('img', img = $$value);
		});
	}

	$$self.$set = $$props => {
		if ('hideOnSlide' in $$props) $$invalidate('hideOnSlide', hideOnSlide = $$props.hideOnSlide);
		if ('contain' in $$props) $$invalidate('contain', contain = $$props.contain);
		if ('overlay' in $$props) $$invalidate('overlay', overlay = $$props.overlay);
		if ('offset' in $$props) $$invalidate('offset', offset = $$props.offset);
		if ('before' in $$props) $$invalidate('before', before = $$props.before);
		if ('after' in $$props) $$invalidate('after', after = $$props.after);
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	let w, h, x, opacity, style;

	$$self.$$.update = ($$dirty = { imgOffset: 1, w: 1, offset: 1, hideOnSlide: 1, sliding: 1, contain: 1, h: 1 }) => {
		if ($$dirty.imgOffset) { $$invalidate('w', w = imgOffset && imgOffset.width); }
		if ($$dirty.imgOffset) { $$invalidate('h', h = imgOffset && imgOffset.height); }
		if ($$dirty.w || $$dirty.offset) { $$invalidate('x', x = w * offset); }
		if ($$dirty.hideOnSlide || $$dirty.sliding) { $$invalidate('opacity', opacity = hideOnSlide && sliding ? 0 : 1); }
		if ($$dirty.contain || $$dirty.w || $$dirty.h) { $$invalidate('style', style = contain ? `width:100%;height:100%;` : `width:${w}px;height:${h}px;`); }
	};

	return {
		hideOnSlide,
		contain,
		overlay,
		offset,
		before,
		after,
		img,
		resize,
		move,
		start,
		end,
		h,
		x,
		opacity,
		style,
		mousedown_handler,
		mousedown_handler_1,
		img0_binding,
		$$slots,
		$$scope
	};
}

class ImageCompare extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1frzg7s-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, ["hideOnSlide", "contain", "overlay", "offset", "before", "after"]);
	}
}

export default ImageCompare;
