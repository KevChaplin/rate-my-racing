
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_node(node) {
        if (!node)
            return document;
        return (node.getRootNode ? node.getRootNode() : node.ownerDocument); // check for getRootNode because IE is still supported
    }
    function get_root_for_styles(node) {
        const root = get_root_for_node(node);
        return root.host ? root : root;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_styles(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_node(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.40.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const quotes = [
      {
        quote: "If you can leave two black stripes from the exit of one corner to the braking zone of the next, you have enough horsepower.",
        author: "Mark Donohue"
      },
      {
        quote: "The winner ain't the one with the fastest car. It's the one who refuses to lose.",
        author: "Dale Earnhardt, Jr"
      },
      {
        quote: "Faster, Faster, until the thrill of speed overcomes the fear of death.",
        author: "Hunter S. Thompson"
      },
      {
        quote: "What's behind you doesn't matter",
        author: "Enzo Ferrari"
      },
      {
        quote: "To achieve anything in this game you must be prepare to dabble in the boundary of disaster.",
        author: "Stirling Moss"
      },
      {
        quote: "Each driver has its limit. My limit is a little bit further than others.",
        author: "Ayrton Senna"
      },
      {
        quote: "Speed has never killed anyone. Suddenly becoming stationary, that's what gets you.",
        author: "Jeremy Clarkson"
      },
      {
        quote: "You will never know the feeling of a driver when winning a race. The helmet hides feelings that cannot be understood.",
        author: "Ayrton Senna"
      },
      {
        quote: "When I look fast, I'm not smooth and I am going slowly. And when I look slow, I am smooth and going fast.",
        author: "Alain Prost"
      },
      {
        quote: "Winning is everything. The only ones who remember you when you come second are your wife and your dog.",
        author: "Damon Hill"
      },
      {
        quote: "There are many different types of prioritites in Motor Racing, the first...being how much you are willing to sacrifice in order to get to where you want to go.",
        author: "Carroll Smith"
      },
      {
        quote: "I believe if you are doing something like competing, like motor racing, you either do well or forget it.",
        author: "Ayrton Senna"
      },
      {
        quote: "Since I started in motor racing I've worked with people from all over the world. We are all here to go racing and prejudice will never play any part in that.",
        author: "Kimi Raikkonen"
      },
      {
        quote: "Anything happens in Grand Prix racing, and it usually does.",
        author: "Murray Walker"
      },
      {
        quote: "To finish first, you must first finish.",
        author: "Juan Manuel Fangio"
      },
      {
        quote: "Auto racing began five minutes after the second car was built.",
        author: "Henry Ford"
      },
      {
        quote: "I am not a driver, I am a racer.",
        author: "Stirling Moss"
      },
      {
        quote: "It's hard to drive at the limit, but it's harder to know where the limits are.",
        author: "Stirling Moss"
      },
      {
        quote: "If everything is under control you are just not driving fast enough.",
        author: "Stirling Moss"
      },
      {
        quote: "Faster, faster, faster, until the thrill of speed overcomes the fear of death.",
        author: "Hunter Thompson"
      },
      {
        quote: "The crashes people remember, but drivers remember the near misses.",
        author: "Mario Andretti"
      },
      {
        quote: "No, I don’t drive her to win, I just drive her as fast as she will go.",
        author: "Juan Fangioi"
      },
      {
        quote: "Sometimes you have to bring back only the steering wheel so the car owner will know that you’re giving it all you have.",
        author: "Mario Andretti"
      },
      {
        quote: "Straight roads are for fast cars, turns are for fast drivers.",
        author: "Colin Mcrae"
      },
    ];

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\components\Header.svelte generated by Svelte v3.40.0 */
    const file$d = "src\\components\\Header.svelte";

    function create_fragment$d(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let h4;
    	let t3;
    	let p;
    	let em;
    	let br;
    	let t5;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "RATE MY RACING";
    			t1 = space();
    			h4 = element("h4");
    			h4.textContent = "- for Assetto Corsa Competizione -";
    			t3 = space();
    			p = element("p");
    			em = element("em");
    			em.textContent = `${/*quote*/ ctx[0]}`;
    			br = element("br");
    			t5 = text(/*author*/ ctx[1]);
    			attr_dev(h1, "class", "svelte-1n9fzmk");
    			add_location(h1, file$d, 12, 1, 364);
    			attr_dev(h4, "class", "svelte-1n9fzmk");
    			add_location(h4, file$d, 13, 2, 391);
    			add_location(em, file$d, 14, 43, 479);
    			add_location(br, file$d, 14, 59, 495);
    			attr_dev(p, "class", "svelte-1n9fzmk");
    			add_location(p, file$d, 14, 1, 437);
    			attr_dev(header, "class", "svelte-1n9fzmk");
    			add_location(header, file$d, 11, 0, 353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, h4);
    			append_dev(header, t3);
    			append_dev(header, p);
    			append_dev(p, em);
    			append_dev(p, br);
    			append_dev(p, t5);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 2000 }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 2000 }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let quoteIndex = Math.floor(Math.random() * quotes.length);
    	let quote = `"${quotes[quoteIndex].quote}"`;
    	let author = `- ${quotes[quoteIndex].author}`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ quotes, fade, quoteIndex, quote, author });

    	$$self.$inject_state = $$props => {
    		if ('quoteIndex' in $$props) quoteIndex = $$props.quoteIndex;
    		if ('quote' in $$props) $$invalidate(0, quote = $$props.quote);
    		if ('author' in $$props) $$invalidate(1, author = $$props.author);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quote, author];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    let defaultUser = {
      name: "",
      nationality: ""
    };

    // Get user data from local storage. If none, set to defaultUser.
    // Crate store: user, to store user information.
    // Subscribe to user so that changes to user are saved to local storage.
    let userStorage = localStorage.getItem("user");

    let user = writable(JSON.parse(userStorage) || defaultUser);
    user.subscribe(val => {
      localStorage.setItem("user", JSON.stringify(val));
    });

    // store: inputArr is array of data input by user on MyLapTimes component. Data is stored here before being checked for correct format (m:ss.xxx)
    const inputArr = writable([
    ]);

    let defaultData = [
      {
        id: 1,
        circuit: "Barcelona",
        location: "SPA",
        platinum: "1:44.500",
        gold: "1:45.900",
        silver: "1:47.900",
        user: ""
      },
      {
        id: 2,
        circuit: "Bathurst",
        location: "AUS",
        platinum: "2:02.500",
        gold: "2:03.900",
        silver: "2:05.900",
        user: ""
      },
      {
        id: 3,
        circuit: "Brands Hatch",
        location: "GBR",
        platinum: "1:24.000",
        gold: "1:25.400",
        silver: "1:26.900",
        user: ""
      },
      {
        id: 4,
        circuit: "Hungaroring",
        location: "HUN",
        platinum: "1:44.500",
        gold: "1:45.900",
        silver: "1:47.400",
        user: ""
      },
      {
        id: 5,
        circuit: "Kyalami",
        location: "ZAF",
        platinum: "1:42.000",
        gold: "1:43.400",
        silver: "1:45.400",
        user: ""
      },
      {
        id: 6,
        circuit: "Laguna Seca",
        location: "USA",
        platinum: "1:23.500",
        gold: "1:24.900",
        silver: "1:26.400",
        user: ""
      },
      {
        id: 7,
        circuit: "Misano",
        location: "ITA",
        platinum: "1:34.500",
        gold: "1:35.900",
        silver: "1:37.400",
        user: ""
      },
      {
        id: 8,
        circuit: "Monza",
        location: "ITA",
        platinum: "1:48.500",
        gold: "1:49.900",
        silver: "1:51.900",
        user: ""
      },
      {
        id: 9,
        circuit: "Nurburgring",
        location: "GER",
        platinum: "1:55.000",
        gold: "1:56.400",
        silver: "1:57.900",
        user: ""
      },
      {
        id: 10,
        circuit: "Paul Ricard",
        location: "FRA",
        platinum: "1:55.000",
        gold: "1:56.400",
        silver: "1:58.400",
        user: ""
      },
      {
        id: 11,
        circuit: "Silverstone",
        location: "GBR",
        platinum: "1:59.500",
        gold: "2:00.900",
        silver: "2:02.400",
        user: ""
      },
      {
        id: 12,
        circuit: "Spa",
        location: "BEL",
        platinum: "2:19.500",
        gold: "2:20.900",
        silver: "2:22.900",
        user: ""
      },
      {
        id: 13,
        circuit: "Suzuka",
        location: "JPN",
        platinum: "2:01.000",
        gold: "2:02.400",
        silver: "2:04.400",
        user: ""
      },
      {
        id: 14,
        circuit: "Zandvoort",
        location: "NLD",
        platinum: "1:36.000",
        gold: "1:37.400",
        silver: "1:38.900",
        user: ""
      },
      {
        id: 15,
        circuit: "Zolder",
        location: "BEL",
        platinum: "1:29.000",
        gold: "1:30.400",
        silver: "1:31.900",
        user: ""
      },
    ];

    // Get data from local storage. If none, set to defaultData.
    // Crate store: circuitData, to store all data on citcuits.
    // Subscribe to circuitData so that changes are saved to local storage.
    let dataStorage = localStorage.getItem("circuitData");
    let circuitData = writable(JSON.parse(dataStorage) || [...defaultData]);
    circuitData.subscribe(val => {
      localStorage.setItem("circuitData", JSON.stringify(val));
    });

    // Receive time (string) and return time in milliseconds (number)
    function strToMill(timeStr) {
      let min = parseInt(timeStr.substring(0,1));
      let sec = parseInt(timeStr.substring(2,4));
      let mil = parseInt(timeStr.substring(5));

      return (min * 60000) + (sec * 1000) + mil
    }

    // Receive time (in milliseconds) and return time as a string (m:ss.xxx)
    // Leading zeros added where needed to maintain format
    function millToStr(timeVal) {
      let min = Math.floor(timeVal / 60000);
      let sec = Math.floor((timeVal - ( 60000 * min )) / 1000);
      if (sec < 10) { sec = `0${sec}`;}
      let mil = timeVal - (min * 60000) - (sec * 1000);
      if (mil < 10) {
        mil = `00${mil}`;
      } else if (mil < 100) {
        mil = `0${mil}`;
      }
      return `${min}:${sec}.${mil}`
    }

    // Convert time from string to number or vice-versa depending on received format.
    function convertTime(time) {
      if ( typeof time === 'string') {
        return strToMill(time)
      } else if ( typeof time === 'number') {
        return millToStr(time)
      }
    }

    const userRanks = [
      "Brakes?",
      "Black Flag",
      "Going back to Gran Turismo",
      "Mobile Chicane",
      "Captain Slow",
      "T1 Menace",
      "Blue flag",
      "Divebomb!",
      "Rage Quit",
      "Dangerous",
      "You shall not pass!",
      "Plz no Punterino!",
      "I am a driving god!",
      "The Stig",
      "Alien"
    ];

    // -- Evaluation of user lap times at each circuit (array of objects containing: circuit; user lap time; % difference from platinum time; and rating)
    const circuitEval = derived(circuitData, ($circuitData) => {
      let arr = [];
      $circuitData.forEach(item => arr = [...arr,
        {
          circuit: item.circuit,
          userTime: convertTime(item.user),
          platinumDelta: item.user !== "" ? (convertTime(item.user) - convertTime(item.platinum)) / convertTime(item.platinum) : "",
          rating: item.user === "" || convertTime(item.user) > convertTime(item.silver) ? "Bronze"
                  : convertTime(item.user) > convertTime(item.gold) ? "Silver"
                  : convertTime(item.user) > convertTime(item.platinum) ? "Gold"
                  : "Platinum"
          }
      ]);
      return arr
    });

    // -- Overall driver rating and driver rank --
    const driverRating = derived(circuitEval, ($circuitEval) => {
      //Allocate points per rating at each circuit. Find average accross all circuits to find overall driver rating.
      function points(rating) {
        return (
          rating === "Platinum" ? 3
          : rating === "Gold" ? 2
          : rating === "Silver" ? 1
          : 0
        )
      }
      let scoreTotal = $circuitEval.reduce(function(total, current) {
        return total + points(current.rating)
      }, 0);
      let scoreAvg = Math.round(scoreTotal / $circuitEval.length);
      let rating = scoreAvg === 3 ? "Platinum"
        : scoreAvg === 2 ? "Gold"
        : scoreAvg === 1 ? "Silver"
        : "Bronze";
      // Allocate userRanks over range of possible scores (set up in case number of tracks change)
      let rank;
      let maxScore = $circuitEval.length * 3;
      let ranksIndex = Math.round(scoreTotal / (maxScore / userRanks.length));
      // If scoreTotal = 0, no rank (new user).
      rank = scoreTotal === 0 ? "" : userRanks[ranksIndex];
      return {
        rating: rating,
        rank: rank
      }
    });

    // -- User Title --
    // If user has no rank, title = user name.
    // Else, insert "rank" at end of name (single name) or before surname to create a userTitle
    const userTitle = derived([user, driverRating], ([$user, $driverRating]) => {
      let userTitle = "";
      const surnameRegex = /(\s+[\w-]+)$/g;

      if (!$driverRating.rank) {
        userTitle = $user.name;
      } else if (!surnameRegex.test($user.name)) {
        userTitle = `${$user.name} "${$driverRating.rank}"`;
      } else {
        userTitle = $user.name.replace(surnameRegex, ` "${$driverRating.rank}" ${$user.name.match(surnameRegex)}`);
      }
      return userTitle
    });

    /* node_modules\svelte-share-buttons-component\src\ShareButton.svelte generated by Svelte v3.40.0 */

    const file$c = "node_modules\\svelte-share-buttons-component\\src\\ShareButton.svelte";

    function create_fragment$c(ctx) {
    	let a;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let div1_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			t1 = text(/*label*/ ctx[1]);
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "class", "ssbc-button__icon svelte-abzkh4");
    			toggle_class(div0, "ssbc-button__icon--fill", /*fill*/ ctx[2]);
    			toggle_class(div0, "ssbc-button__icon--outline", !/*fill*/ ctx[2]);
    			add_location(div0, file$c, 46, 4, 748);
    			attr_dev(div1, "class", div1_class_value = "ssbc-button " + /*classes*/ ctx[4] + " svelte-abzkh4");
    			add_location(div1, file$c, 45, 2, 708);
    			attr_dev(a, "class", "ssbc-button__link svelte-abzkh4");
    			attr_dev(a, "href", /*href*/ ctx[0]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener");
    			attr_dev(a, "aria-label", /*ariaLabel*/ ctx[3]);
    			add_location(a, file$c, 44, 0, 615);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], !current ? -1 : dirty, null, null);
    				}
    			}

    			if (dirty & /*fill*/ 4) {
    				toggle_class(div0, "ssbc-button__icon--fill", /*fill*/ ctx[2]);
    			}

    			if (dirty & /*fill*/ 4) {
    				toggle_class(div0, "ssbc-button__icon--outline", !/*fill*/ ctx[2]);
    			}

    			if (!current || dirty & /*label*/ 2) set_data_dev(t1, /*label*/ ctx[1]);

    			if (!current || dirty & /*classes*/ 16 && div1_class_value !== (div1_class_value = "ssbc-button " + /*classes*/ ctx[4] + " svelte-abzkh4")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*href*/ 1) {
    				attr_dev(a, "href", /*href*/ ctx[0]);
    			}

    			if (!current || dirty & /*ariaLabel*/ 8) {
    				attr_dev(a, "aria-label", /*ariaLabel*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ShareButton', slots, ['default']);
    	let { href } = $$props;
    	let { label = '' } = $$props;
    	let { fill = true } = $$props;
    	let { ariaLabel = '' } = $$props;
    	let { class: classes = '' } = $$props;
    	const writable_props = ['href', 'label', 'fill', 'ariaLabel', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ShareButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('fill' in $$props) $$invalidate(2, fill = $$props.fill);
    		if ('ariaLabel' in $$props) $$invalidate(3, ariaLabel = $$props.ariaLabel);
    		if ('class' in $$props) $$invalidate(4, classes = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ href, label, fill, ariaLabel, classes });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('fill' in $$props) $$invalidate(2, fill = $$props.fill);
    		if ('ariaLabel' in $$props) $$invalidate(3, ariaLabel = $$props.ariaLabel);
    		if ('classes' in $$props) $$invalidate(4, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, label, fill, ariaLabel, classes, $$scope, slots];
    }

    class ShareButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			href: 0,
    			label: 1,
    			fill: 2,
    			ariaLabel: 3,
    			class: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ShareButton",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*href*/ ctx[0] === undefined && !('href' in props)) {
    			console.warn("<ShareButton> was created without expected prop 'href'");
    		}
    	}

    	get href() {
    		throw new Error("<ShareButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ShareButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<ShareButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ShareButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<ShareButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<ShareButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<ShareButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<ShareButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ShareButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ShareButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-share-buttons-component\src\Email.svelte generated by Svelte v3.40.0 */
    const file$b = "node_modules\\svelte-share-buttons-component\\src\\Email.svelte";

    // (26:0) <ShareButton class="ssbc-button--email {classes}" {...$$restProps} {ariaLabel} {href}>
    function create_default_slot$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z");
    			add_location(path, file$b, 27, 4, 628);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$b, 26, 2, 563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(26:0) <ShareButton class=\\\"ssbc-button--email {classes}\\\" {...$$restProps} {ariaLabel} {href}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let sharebutton;
    	let current;

    	const sharebutton_spread_levels = [
    		{
    			class: "ssbc-button--email " + /*classes*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[3],
    		{ ariaLabel: /*ariaLabel*/ ctx[0] },
    		{ href: /*href*/ ctx[2] }
    	];

    	let sharebutton_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < sharebutton_spread_levels.length; i += 1) {
    		sharebutton_props = assign(sharebutton_props, sharebutton_spread_levels[i]);
    	}

    	sharebutton = new ShareButton({ props: sharebutton_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sharebutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sharebutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sharebutton_changes = (dirty & /*classes, $$restProps, ariaLabel, href*/ 15)
    			? get_spread_update(sharebutton_spread_levels, [
    					dirty & /*classes*/ 2 && {
    						class: "ssbc-button--email " + /*classes*/ ctx[1]
    					},
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					dirty & /*ariaLabel*/ 1 && { ariaLabel: /*ariaLabel*/ ctx[0] },
    					dirty & /*href*/ 4 && { href: /*href*/ ctx[2] }
    				])
    			: {};

    			if (dirty & /*$$scope*/ 64) {
    				sharebutton_changes.$$scope = { dirty, ctx };
    			}

    			sharebutton.$set(sharebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sharebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sharebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sharebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["subject","body","ariaLabel","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Email', slots, []);
    	let { subject } = $$props;
    	let { body } = $$props;
    	let { ariaLabel = 'Share by Email' } = $$props;
    	let { class: classes = '' } = $$props;
    	let href;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('subject' in $$new_props) $$invalidate(4, subject = $$new_props.subject);
    		if ('body' in $$new_props) $$invalidate(5, body = $$new_props.body);
    		if ('ariaLabel' in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('class' in $$new_props) $$invalidate(1, classes = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({
    		subject,
    		body,
    		ariaLabel,
    		classes,
    		ShareButton,
    		href
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('subject' in $$props) $$invalidate(4, subject = $$new_props.subject);
    		if ('body' in $$props) $$invalidate(5, body = $$new_props.body);
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*subject, body*/ 48) {
    			$$invalidate(2, href = encodeURI(`mailto:?subject=${subject}&body=${body}`));
    		}
    	};

    	return [ariaLabel, classes, href, $$restProps, subject, body];
    }

    class Email extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			subject: 4,
    			body: 5,
    			ariaLabel: 0,
    			class: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Email",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*subject*/ ctx[4] === undefined && !('subject' in props)) {
    			console.warn("<Email> was created without expected prop 'subject'");
    		}

    		if (/*body*/ ctx[5] === undefined && !('body' in props)) {
    			console.warn("<Email> was created without expected prop 'body'");
    		}
    	}

    	get subject() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Email>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Email>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-share-buttons-component\src\Facebook.svelte generated by Svelte v3.40.0 */
    const file$a = "node_modules\\svelte-share-buttons-component\\src\\Facebook.svelte";

    // (25:0) <ShareButton class="ssbc-button--facebook {classes}" {...$$restProps} {ariaLabel} {href}>
    function create_default_slot$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z");
    			add_location(path, file$a, 26, 4, 628);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$a, 25, 2, 563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(25:0) <ShareButton class=\\\"ssbc-button--facebook {classes}\\\" {...$$restProps} {ariaLabel} {href}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let sharebutton;
    	let current;

    	const sharebutton_spread_levels = [
    		{
    			class: "ssbc-button--facebook " + /*classes*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[3],
    		{ ariaLabel: /*ariaLabel*/ ctx[0] },
    		{ href: /*href*/ ctx[2] }
    	];

    	let sharebutton_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < sharebutton_spread_levels.length; i += 1) {
    		sharebutton_props = assign(sharebutton_props, sharebutton_spread_levels[i]);
    	}

    	sharebutton = new ShareButton({ props: sharebutton_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sharebutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sharebutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sharebutton_changes = (dirty & /*classes, $$restProps, ariaLabel, href*/ 15)
    			? get_spread_update(sharebutton_spread_levels, [
    					dirty & /*classes*/ 2 && {
    						class: "ssbc-button--facebook " + /*classes*/ ctx[1]
    					},
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					dirty & /*ariaLabel*/ 1 && { ariaLabel: /*ariaLabel*/ ctx[0] },
    					dirty & /*href*/ 4 && { href: /*href*/ ctx[2] }
    				])
    			: {};

    			if (dirty & /*$$scope*/ 32) {
    				sharebutton_changes.$$scope = { dirty, ctx };
    			}

    			sharebutton.$set(sharebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sharebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sharebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sharebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["url","ariaLabel","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Facebook', slots, []);
    	let { url } = $$props;
    	let { ariaLabel = 'Share on Facebook' } = $$props;
    	let { class: classes = '' } = $$props;
    	let href;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('url' in $$new_props) $$invalidate(4, url = $$new_props.url);
    		if ('ariaLabel' in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('class' in $$new_props) $$invalidate(1, classes = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({
    		url,
    		ariaLabel,
    		classes,
    		ShareButton,
    		href
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('url' in $$props) $$invalidate(4, url = $$new_props.url);
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*url*/ 16) {
    			$$invalidate(2, href = encodeURI(`https://facebook.com/sharer/sharer.php?u=${url}`));
    		}
    	};

    	return [ariaLabel, classes, href, $$restProps, url];
    }

    class Facebook extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { url: 4, ariaLabel: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Facebook",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*url*/ ctx[4] === undefined && !('url' in props)) {
    			console.warn("<Facebook> was created without expected prop 'url'");
    		}
    	}

    	get url() {
    		throw new Error("<Facebook>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Facebook>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Facebook>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Facebook>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Facebook>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Facebook>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-share-buttons-component\src\Reddit.svelte generated by Svelte v3.40.0 */
    const file$9 = "node_modules\\svelte-share-buttons-component\\src\\Reddit.svelte";

    // (26:0) <ShareButton class="ssbc-button--reddit {classes}" {...$$restProps} {ariaLabel} {href}>
    function create_default_slot$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 13.37C1.5 13.07 1 12.35 1 11.5c0-1.1.9-2 2-2 .64 0 1.22.32 1.6.82-1.1.85-1.92 1.9-2.3 3.05zm3.7.13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.8 4.8c-1.08.63-2.42.96-3.8.96-1.4 0-2.74-.34-3.8-.95-.24-.13-.32-.44-.2-.68.15-.24.46-.32.7-.18 1.83 1.06 4.76 1.06 6.6 0 .23-.13.53-.05.67.2.14.23.06.54-.18.67zm.2-2.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.7-2.13c-.38-1.16-1.2-2.2-2.3-3.05.38-.5.97-.82 1.6-.82 1.1 0 2 .9 2 2 0 .84-.53 1.57-1.3 1.87z");
    			add_location(path, file$9, 27, 4, 657);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$9, 26, 2, 592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(26:0) <ShareButton class=\\\"ssbc-button--reddit {classes}\\\" {...$$restProps} {ariaLabel} {href}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let sharebutton;
    	let current;

    	const sharebutton_spread_levels = [
    		{
    			class: "ssbc-button--reddit " + /*classes*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[3],
    		{ ariaLabel: /*ariaLabel*/ ctx[0] },
    		{ href: /*href*/ ctx[2] }
    	];

    	let sharebutton_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < sharebutton_spread_levels.length; i += 1) {
    		sharebutton_props = assign(sharebutton_props, sharebutton_spread_levels[i]);
    	}

    	sharebutton = new ShareButton({ props: sharebutton_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sharebutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sharebutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sharebutton_changes = (dirty & /*classes, $$restProps, ariaLabel, href*/ 15)
    			? get_spread_update(sharebutton_spread_levels, [
    					dirty & /*classes*/ 2 && {
    						class: "ssbc-button--reddit " + /*classes*/ ctx[1]
    					},
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					dirty & /*ariaLabel*/ 1 && { ariaLabel: /*ariaLabel*/ ctx[0] },
    					dirty & /*href*/ 4 && { href: /*href*/ ctx[2] }
    				])
    			: {};

    			if (dirty & /*$$scope*/ 64) {
    				sharebutton_changes.$$scope = { dirty, ctx };
    			}

    			sharebutton.$set(sharebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sharebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sharebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sharebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["title","url","ariaLabel","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Reddit', slots, []);
    	let { title } = $$props;
    	let { url } = $$props;
    	let { ariaLabel = 'Share on Reddit' } = $$props;
    	let { class: classes = '' } = $$props;
    	let href;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('title' in $$new_props) $$invalidate(4, title = $$new_props.title);
    		if ('url' in $$new_props) $$invalidate(5, url = $$new_props.url);
    		if ('ariaLabel' in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('class' in $$new_props) $$invalidate(1, classes = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		url,
    		ariaLabel,
    		classes,
    		ShareButton,
    		href
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('title' in $$props) $$invalidate(4, title = $$new_props.title);
    		if ('url' in $$props) $$invalidate(5, url = $$new_props.url);
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*url, title*/ 48) {
    			$$invalidate(2, href = encodeURI(`https://reddit.com/submit/?url=${url}&resubmit=true&title=${title}`));
    		}
    	};

    	return [ariaLabel, classes, href, $$restProps, title, url];
    }

    class Reddit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { title: 4, url: 5, ariaLabel: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Reddit",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[4] === undefined && !('title' in props)) {
    			console.warn("<Reddit> was created without expected prop 'title'");
    		}

    		if (/*url*/ ctx[5] === undefined && !('url' in props)) {
    			console.warn("<Reddit> was created without expected prop 'url'");
    		}
    	}

    	get title() {
    		throw new Error("<Reddit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Reddit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Reddit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Reddit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Reddit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Reddit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Reddit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Reddit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-share-buttons-component\src\Twitter.svelte generated by Svelte v3.40.0 */
    const file$8 = "node_modules\\svelte-share-buttons-component\\src\\Twitter.svelte";

    // (29:0) <ShareButton class="ssbc-button--twitter {classes}" {...$$restProps} {ariaLabel} {href}>
    function create_default_slot(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z");
    			add_location(path, file$8, 30, 4, 779);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$8, 29, 2, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(29:0) <ShareButton class=\\\"ssbc-button--twitter {classes}\\\" {...$$restProps} {ariaLabel} {href}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let sharebutton;
    	let current;

    	const sharebutton_spread_levels = [
    		{
    			class: "ssbc-button--twitter " + /*classes*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[3],
    		{ ariaLabel: /*ariaLabel*/ ctx[0] },
    		{ href: /*href*/ ctx[2] }
    	];

    	let sharebutton_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < sharebutton_spread_levels.length; i += 1) {
    		sharebutton_props = assign(sharebutton_props, sharebutton_spread_levels[i]);
    	}

    	sharebutton = new ShareButton({ props: sharebutton_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sharebutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sharebutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sharebutton_changes = (dirty & /*classes, $$restProps, ariaLabel, href*/ 15)
    			? get_spread_update(sharebutton_spread_levels, [
    					dirty & /*classes*/ 2 && {
    						class: "ssbc-button--twitter " + /*classes*/ ctx[1]
    					},
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					dirty & /*ariaLabel*/ 1 && { ariaLabel: /*ariaLabel*/ ctx[0] },
    					dirty & /*href*/ 4 && { href: /*href*/ ctx[2] }
    				])
    			: {};

    			if (dirty & /*$$scope*/ 512) {
    				sharebutton_changes.$$scope = { dirty, ctx };
    			}

    			sharebutton.$set(sharebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sharebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sharebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sharebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["text","url","ariaLabel","hashtags","via","related","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Twitter', slots, []);
    	let { text } = $$props;
    	let { url } = $$props;
    	let { ariaLabel = 'Share on Twitter' } = $$props;
    	let { hashtags = '' } = $$props;
    	let { via = '' } = $$props;
    	let { related = '' } = $$props;
    	let { class: classes = '' } = $$props;
    	let href;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('text' in $$new_props) $$invalidate(4, text = $$new_props.text);
    		if ('url' in $$new_props) $$invalidate(5, url = $$new_props.url);
    		if ('ariaLabel' in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('hashtags' in $$new_props) $$invalidate(6, hashtags = $$new_props.hashtags);
    		if ('via' in $$new_props) $$invalidate(7, via = $$new_props.via);
    		if ('related' in $$new_props) $$invalidate(8, related = $$new_props.related);
    		if ('class' in $$new_props) $$invalidate(1, classes = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({
    		text,
    		url,
    		ariaLabel,
    		hashtags,
    		via,
    		related,
    		classes,
    		ShareButton,
    		href
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('text' in $$props) $$invalidate(4, text = $$new_props.text);
    		if ('url' in $$props) $$invalidate(5, url = $$new_props.url);
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ('hashtags' in $$props) $$invalidate(6, hashtags = $$new_props.hashtags);
    		if ('via' in $$props) $$invalidate(7, via = $$new_props.via);
    		if ('related' in $$props) $$invalidate(8, related = $$new_props.related);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text, hashtags, via, related, url*/ 496) {
    			$$invalidate(2, href = encodeURI(`https://twitter.com/intent/tweet/?text=${text}&hashtags=${hashtags}&via=${via}&related=${related}&url=${url}`));
    		}
    	};

    	return [ariaLabel, classes, href, $$restProps, text, url, hashtags, via, related];
    }

    class Twitter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			text: 4,
    			url: 5,
    			ariaLabel: 0,
    			hashtags: 6,
    			via: 7,
    			related: 8,
    			class: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Twitter",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[4] === undefined && !('text' in props)) {
    			console.warn("<Twitter> was created without expected prop 'text'");
    		}

    		if (/*url*/ ctx[5] === undefined && !('url' in props)) {
    			console.warn("<Twitter> was created without expected prop 'url'");
    		}
    	}

    	get text() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hashtags() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hashtags(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get via() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set via(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get related() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set related(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Twitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Twitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\MyProfile.svelte generated by Svelte v3.40.0 */
    const file$7 = "src\\components\\MyProfile.svelte";

    // (43:1) {#if $user.name}
    function create_if_block$3(ctx) {
    	let h2;
    	let t;
    	let h2_class_value;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*$userTitle*/ ctx[2]);
    			attr_dev(h2, "class", h2_class_value = "" + (null_to_empty(/*$driverRating*/ ctx[3].rating) + " svelte-29j9pe"));
    			add_location(h2, file$7, 43, 1, 1392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$userTitle*/ 4) set_data_dev(t, /*$userTitle*/ ctx[2]);

    			if (dirty & /*$driverRating*/ 8 && h2_class_value !== (h2_class_value = "" + (null_to_empty(/*$driverRating*/ ctx[3].rating) + " svelte-29j9pe"))) {
    				attr_dev(h2, "class", h2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(43:1) {#if $user.name}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let t0;
    	let table;
    	let tr0;
    	let td0;
    	let t2;
    	let td1;
    	let input0;
    	let t3;
    	let tr1;
    	let td2;
    	let t5;
    	let td3;
    	let input1;
    	let t6;
    	let tr2;
    	let td4;
    	let t8;
    	let td5;
    	let t9_value = /*$driverRating*/ ctx[3].rating + "";
    	let t9;
    	let t10;
    	let tr3;
    	let td6;
    	let t12;
    	let td7;

    	let t13_value = (!/*$driverRating*/ ctx[3].rank
    	? "none"
    	: `"${/*$driverRating*/ ctx[3].rank}"`) + "";

    	let t13;
    	let t14;
    	let tr4;
    	let td8;
    	let t16;
    	let td9;
    	let t17;
    	let t18;
    	let tr5;
    	let td10;
    	let t20;
    	let td11;
    	let t21;
    	let t22;
    	let div0;
    	let twitter;
    	let t23;
    	let reddit;
    	let t24;
    	let facebook;
    	let t25;
    	let email;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*$user*/ ctx[4].name && create_if_block$3(ctx);

    	twitter = new Twitter({
    			props: {
    				class: "share-button",
    				text: /*shareText*/ ctx[6],
    				url: /*myUrl*/ ctx[5]
    			},
    			$$inline: true
    		});

    	reddit = new Reddit({
    			props: {
    				class: "share-button",
    				title: /*shareText*/ ctx[6],
    				url: /*myUrl*/ ctx[5]
    			},
    			$$inline: true
    		});

    	facebook = new Facebook({
    			props: {
    				class: "share-button",
    				url: /*myUrl*/ ctx[5]
    			},
    			$$inline: true
    		});

    	email = new Email({
    			props: {
    				subject: /*shareTitle*/ ctx[7],
    				body: /*shareEmail*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Name:";
    			t2 = space();
    			td1 = element("td");
    			input0 = element("input");
    			t3 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Nationality:";
    			t5 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t6 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Rating:";
    			t8 = space();
    			td5 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Nickname:";
    			t12 = space();
    			td7 = element("td");
    			t13 = text(t13_value);
    			t14 = space();
    			tr4 = element("tr");
    			td8 = element("td");
    			td8.textContent = "Strongest Circuit:";
    			t16 = space();
    			td9 = element("td");
    			t17 = text(/*strongest*/ ctx[1]);
    			t18 = space();
    			tr5 = element("tr");
    			td10 = element("td");
    			td10.textContent = "Weakest Circuit:";
    			t20 = space();
    			td11 = element("td");
    			t21 = text(/*weakest*/ ctx[0]);
    			t22 = space();
    			div0 = element("div");
    			create_component(twitter.$$.fragment);
    			t23 = space();
    			create_component(reddit.$$.fragment);
    			t24 = space();
    			create_component(facebook.$$.fragment);
    			t25 = space();
    			create_component(email.$$.fragment);
    			attr_dev(td0, "class", "left-text svelte-29j9pe");
    			add_location(td0, file$7, 47, 6, 1476);
    			attr_dev(input0, "placeholder", "Enter Name");
    			attr_dev(input0, "class", "svelte-29j9pe");
    			add_location(input0, file$7, 49, 7, 1545);
    			attr_dev(td1, "class", "right-text svelte-29j9pe");
    			add_location(td1, file$7, 48, 3, 1513);
    			attr_dev(tr0, "class", "svelte-29j9pe");
    			add_location(tr0, file$7, 46, 2, 1464);
    			attr_dev(td2, "class", "left-text svelte-29j9pe");
    			add_location(td2, file$7, 53, 6, 1636);
    			attr_dev(input1, "placeholder", "Enter Nationality");
    			attr_dev(input1, "class", "svelte-29j9pe");
    			add_location(input1, file$7, 55, 7, 1712);
    			attr_dev(td3, "class", "right-text svelte-29j9pe");
    			add_location(td3, file$7, 54, 3, 1680);
    			attr_dev(tr1, "class", "svelte-29j9pe");
    			add_location(tr1, file$7, 52, 2, 1624);
    			attr_dev(td4, "class", "left-text svelte-29j9pe");
    			add_location(td4, file$7, 59, 6, 1817);
    			attr_dev(td5, "class", "right-text svelte-29j9pe");
    			add_location(td5, file$7, 60, 3, 1856);
    			attr_dev(tr2, "class", "svelte-29j9pe");
    			add_location(tr2, file$7, 58, 2, 1805);
    			attr_dev(td6, "class", "left-text svelte-29j9pe");
    			add_location(td6, file$7, 63, 6, 1931);
    			attr_dev(td7, "class", "right-text svelte-29j9pe");
    			add_location(td7, file$7, 64, 6, 1975);
    			attr_dev(tr3, "class", "svelte-29j9pe");
    			add_location(tr3, file$7, 62, 2, 1919);
    			attr_dev(td8, "class", "left-text svelte-29j9pe");
    			add_location(td8, file$7, 67, 6, 2086);
    			attr_dev(td9, "class", "right-text svelte-29j9pe");
    			add_location(td9, file$7, 68, 6, 2139);
    			attr_dev(tr4, "class", "svelte-29j9pe");
    			add_location(tr4, file$7, 66, 2, 2074);
    			attr_dev(td10, "class", "left-text svelte-29j9pe");
    			add_location(td10, file$7, 71, 6, 2203);
    			attr_dev(td11, "class", "right-text svelte-29j9pe");
    			add_location(td11, file$7, 72, 6, 2254);
    			attr_dev(tr5, "class", "svelte-29j9pe");
    			add_location(tr5, file$7, 70, 2, 2191);
    			attr_dev(table, "class", "svelte-29j9pe");
    			add_location(table, file$7, 45, 1, 1453);
    			attr_dev(div0, "class", "social-media svelte-29j9pe");
    			add_location(div0, file$7, 75, 1, 2315);
    			attr_dev(div1, "class", "container svelte-29j9pe");
    			add_location(div1, file$7, 41, 0, 1277);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t2);
    			append_dev(tr0, td1);
    			append_dev(td1, input0);
    			set_input_value(input0, /*$user*/ ctx[4].name);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(tr1, t5);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*$user*/ ctx[4].nationality);
    			append_dev(table, t6);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t8);
    			append_dev(tr2, td5);
    			append_dev(td5, t9);
    			append_dev(table, t10);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(tr3, t12);
    			append_dev(tr3, td7);
    			append_dev(td7, t13);
    			append_dev(table, t14);
    			append_dev(table, tr4);
    			append_dev(tr4, td8);
    			append_dev(tr4, t16);
    			append_dev(tr4, td9);
    			append_dev(td9, t17);
    			append_dev(table, t18);
    			append_dev(table, tr5);
    			append_dev(tr5, td10);
    			append_dev(tr5, t20);
    			append_dev(tr5, td11);
    			append_dev(td11, t21);
    			append_dev(div1, t22);
    			append_dev(div1, div0);
    			mount_component(twitter, div0, null);
    			append_dev(div0, t23);
    			mount_component(reddit, div0, null);
    			append_dev(div0, t24);
    			mount_component(facebook, div0, null);
    			append_dev(div0, t25);
    			mount_component(email, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$user*/ ctx[4].name) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div1, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$user*/ 16 && input0.value !== /*$user*/ ctx[4].name) {
    				set_input_value(input0, /*$user*/ ctx[4].name);
    			}

    			if (dirty & /*$user*/ 16 && input1.value !== /*$user*/ ctx[4].nationality) {
    				set_input_value(input1, /*$user*/ ctx[4].nationality);
    			}

    			if ((!current || dirty & /*$driverRating*/ 8) && t9_value !== (t9_value = /*$driverRating*/ ctx[3].rating + "")) set_data_dev(t9, t9_value);

    			if ((!current || dirty & /*$driverRating*/ 8) && t13_value !== (t13_value = (!/*$driverRating*/ ctx[3].rank
    			? "none"
    			: `"${/*$driverRating*/ ctx[3].rank}"`) + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty & /*strongest*/ 2) set_data_dev(t17, /*strongest*/ ctx[1]);
    			if (!current || dirty & /*weakest*/ 1) set_data_dev(t21, /*weakest*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(twitter.$$.fragment, local);
    			transition_in(reddit.$$.fragment, local);
    			transition_in(facebook.$$.fragment, local);
    			transition_in(email.$$.fragment, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				if (!div1_intro) div1_intro = create_in_transition(div1, fade, { delay: 500, duration: 1000 });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(twitter.$$.fragment, local);
    			transition_out(reddit.$$.fragment, local);
    			transition_out(facebook.$$.fragment, local);
    			transition_out(email.$$.fragment, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, { duration: 400 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(twitter);
    			destroy_component(reddit);
    			destroy_component(facebook);
    			destroy_component(email);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $userTitle;
    	let $driverRating;
    	let $circuitEval;
    	let $user;
    	validate_store(userTitle, 'userTitle');
    	component_subscribe($$self, userTitle, $$value => $$invalidate(2, $userTitle = $$value));
    	validate_store(driverRating, 'driverRating');
    	component_subscribe($$self, driverRating, $$value => $$invalidate(3, $driverRating = $$value));
    	validate_store(circuitEval, 'circuitEval');
    	component_subscribe($$self, circuitEval, $$value => $$invalidate(13, $circuitEval = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(4, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyProfile', slots, []);
    	let weakest = "";
    	let strongest = "";
    	let maxDelta;
    	let minDelta;

    	// Find weakest circuit (user time minus platinum time is highest)
    	// Find strongest circuit (user time minus platinum time is lowest)
    	$circuitEval.forEach(item => {
    		if (item.platinumDelta) {
    			if (!maxDelta || item.platinumDelta > maxDelta) {
    				maxDelta = item.platinumDelta;
    				$$invalidate(0, weakest = item.circuit);
    			} else if (!minDelta || item.platinumDelta < minDelta) {
    				minDelta = item.platinumDelta;
    				$$invalidate(1, strongest = item.circuit);
    			}
    		}
    	});

    	// -- For Social Media Links --
    	let myUrl = "https://kevchaplin.github.io/rate-my-racing/";

    	let shareText = `${$userTitle}
${$driverRating.rating} rated driver
Assetto Corsa Competizione`;

    	let shareTitle = $userTitle;

    	let shareEmail = `Hey checkout my new rank from ${myUrl}

${shareText}`;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyProfile> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		$user.name = this.value;
    		user.set($user);
    	}

    	function input1_input_handler() {
    		$user.nationality = this.value;
    		user.set($user);
    	}

    	$$self.$capture_state = () => ({
    		fade,
    		user,
    		userTitle,
    		driverRating,
    		circuitEval,
    		Email,
    		Reddit,
    		Facebook,
    		Twitter,
    		weakest,
    		strongest,
    		maxDelta,
    		minDelta,
    		myUrl,
    		shareText,
    		shareTitle,
    		shareEmail,
    		$userTitle,
    		$driverRating,
    		$circuitEval,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('weakest' in $$props) $$invalidate(0, weakest = $$props.weakest);
    		if ('strongest' in $$props) $$invalidate(1, strongest = $$props.strongest);
    		if ('maxDelta' in $$props) maxDelta = $$props.maxDelta;
    		if ('minDelta' in $$props) minDelta = $$props.minDelta;
    		if ('myUrl' in $$props) $$invalidate(5, myUrl = $$props.myUrl);
    		if ('shareText' in $$props) $$invalidate(6, shareText = $$props.shareText);
    		if ('shareTitle' in $$props) $$invalidate(7, shareTitle = $$props.shareTitle);
    		if ('shareEmail' in $$props) $$invalidate(8, shareEmail = $$props.shareEmail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		weakest,
    		strongest,
    		$userTitle,
    		$driverRating,
    		$user,
    		myUrl,
    		shareText,
    		shareTitle,
    		shareEmail,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class MyProfile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyProfile",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\subcomponents\SaveButton.svelte generated by Svelte v3.40.0 */
    const file$6 = "src\\components\\subcomponents\\SaveButton.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Update Records";
    			add_location(button, file$6, 40, 0, 1580);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[1]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $inputArr;
    	let $circuitData;
    	validate_store(inputArr, 'inputArr');
    	component_subscribe($$self, inputArr, $$value => $$invalidate(2, $inputArr = $$value));
    	validate_store(circuitData, 'circuitData');
    	component_subscribe($$self, circuitData, $$value => $$invalidate(3, $circuitData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SaveButton', slots, []);

    	function saveTimes() {
    		const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/;
    		let data = [...$circuitData];
    		let validEntries = 0;
    		let invalidEntries = [];

    		$inputArr.forEach(item => {
    			let index = data.findIndex(entry => entry.circuit === item.circuit);

    			if (timesRegex.test(item.inputValue)) {
    				validEntries++;
    				data[index].user = item.inputValue;
    				circuitData.set([...data]);
    			} else {
    				invalidEntries = [...invalidEntries, item.circuit];
    				document.getElementById(item.circuit).value = data[index].user;
    			}
    		});

    		inputArr.set([]);

    		// Alert user of valid and invalid entries
    		let validStr = `${validEntries} lap times updated`;

    		let invalidStr = invalidEntries.length > 0
    		? `${invalidEntries.length} lap times invalid - ${invalidEntries.join(', ')}`
    		: "";

    		let adviceStr = invalidEntries.length > 0
    		? "Please enter lap times in format m:ss.xxx"
    		: "";

    		let alertStr = `${validStr}
      ${invalidStr}
      ${adviceStr}`;

    		alert(alertStr);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SaveButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => saveTimes();

    	$$self.$capture_state = () => ({
    		circuitData,
    		inputArr,
    		saveTimes,
    		$inputArr,
    		$circuitData
    	});

    	return [saveTimes, click_handler];
    }

    class SaveButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaveButton",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    // Auto-fill colon and decimal point when inputting lap times for ease of data entry.
    function autoSeparator(e) {
      if( (/^\d$/).test(e.target.value) ) {
        e.target.value += ":";
      } else if ( (/^\d:\d\d$/).test(e.target.value) ) {
        e.target.value += ".";
      }
    }

    /* src\components\MyLapTimes.svelte generated by Svelte v3.40.0 */
    const file$5 = "src\\components\\MyLapTimes.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (45:4) {#each $circuitData as entry}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[8].circuit + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[8].location + "";
    	let t2;
    	let t3;
    	let td2;
    	let input;
    	let input_id_value;
    	let input_value_value;
    	let t4;
    	let td3;
    	let t5_value = /*circuitRating*/ ctx[3](/*entry*/ ctx[8].circuit) + "";
    	let t5;
    	let td3_value_value;
    	let t6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			input = element("input");
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			attr_dev(td0, "class", "svelte-f5m3gi");
    			add_location(td0, file$5, 46, 6, 1674);
    			attr_dev(td1, "class", "svelte-f5m3gi");
    			add_location(td1, file$5, 47, 6, 1706);
    			attr_dev(input, "id", input_id_value = /*entry*/ ctx[8].circuit);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*entry*/ ctx[8].user;
    			attr_dev(input, "placeholder", "0:00.000");
    			attr_dev(input, "class", "svelte-f5m3gi");
    			add_location(input, file$5, 49, 8, 1798);
    			attr_dev(td2, "class", "has-tooltip svelte-f5m3gi");
    			attr_dev(td2, "data-tooltip", /*tooltip*/ ctx[1]);
    			add_location(td2, file$5, 48, 8, 1741);
    			attr_dev(td3, "value", td3_value_value = /*circuitRating*/ ctx[3](/*entry*/ ctx[8].circuit));
    			attr_dev(td3, "class", "svelte-f5m3gi");
    			add_location(td3, file$5, 51, 6, 1966);
    			add_location(tr, file$5, 45, 4, 1662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, input);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(tr, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler*/ ctx[4], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$circuitData*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[8].circuit + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$circuitData*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[8].location + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$circuitData*/ 1 && input_id_value !== (input_id_value = /*entry*/ ctx[8].circuit)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*$circuitData*/ 1 && input_value_value !== (input_value_value = /*entry*/ ctx[8].user) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*$circuitData*/ 1 && t5_value !== (t5_value = /*circuitRating*/ ctx[3](/*entry*/ ctx[8].circuit) + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*$circuitData*/ 1 && td3_value_value !== (td3_value_value = /*circuitRating*/ ctx[3](/*entry*/ ctx[8].circuit))) {
    				attr_dev(td3, "value", td3_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(45:4) {#each $circuitData as entry}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let savebutton;
    	let t0;
    	let table;
    	let tr;
    	let th0;
    	let t2;
    	let th1;
    	let t4;
    	let th2;
    	let t6;
    	let th3;
    	let t8;
    	let div_intro;
    	let div_outro;
    	let current;
    	savebutton = new SaveButton({ $$inline: true });
    	let each_value = /*$circuitData*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(savebutton.$$.fragment);
    			t0 = space();
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "CIRCUIT";
    			t2 = space();
    			th1 = element("th");
    			th1.textContent = "COUNTRY";
    			t4 = space();
    			th2 = element("th");
    			th2.textContent = "TIME";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "RATING";
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "svelte-f5m3gi");
    			add_location(th0, file$5, 39, 6, 1526);
    			attr_dev(th1, "class", "svelte-f5m3gi");
    			add_location(th1, file$5, 40, 6, 1550);
    			attr_dev(th2, "class", "svelte-f5m3gi");
    			add_location(th2, file$5, 41, 6, 1574);
    			attr_dev(th3, "class", "svelte-f5m3gi");
    			add_location(th3, file$5, 42, 6, 1595);
    			add_location(tr, file$5, 38, 4, 1514);
    			attr_dev(table, "class", "svelte-f5m3gi");
    			add_location(table, file$5, 37, 2, 1501);
    			attr_dev(div, "class", "container svelte-f5m3gi");
    			add_location(div, file$5, 35, 0, 1386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(savebutton, div, null);
    			append_dev(div, t0);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t2);
    			append_dev(tr, th1);
    			append_dev(tr, t4);
    			append_dev(tr, th2);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(table, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*circuitRating, $circuitData, tooltip, autoSeparator, inputChange*/ 15) {
    				each_value = /*$circuitData*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(savebutton.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, fade, { delay: 500, duration: 1000 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(savebutton.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 400 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(savebutton);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $circuitEval;
    	let $inputArr;
    	let $circuitData;
    	validate_store(circuitEval, 'circuitEval');
    	component_subscribe($$self, circuitEval, $$value => $$invalidate(6, $circuitEval = $$value));
    	validate_store(inputArr, 'inputArr');
    	component_subscribe($$self, inputArr, $$value => $$invalidate(7, $inputArr = $$value));
    	validate_store(circuitData, 'circuitData');
    	component_subscribe($$self, circuitData, $$value => $$invalidate(0, $circuitData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyLapTimes', slots, []);
    	let tooltip = "Insert average lap time over at least 10 laps, with optimal track condition, track temperature 25-30C and at least 80L of fuel. Format m:ss.xxx.";

    	// On input change, update store: inputArr, which records all input values so they can be validated.
    	// Any changed input value is added to array, overwriting any already input values for same circuits.
    	function inputChange(e) {
    		let newArr = $inputArr.filter(function (item) {
    			return item.circuit !== e.target.id;
    		});

    		newArr = [
    			...newArr,
    			{
    				circuit: e.target.id,
    				inputValue: e.target.value
    			}
    		];

    		inputArr.set([...newArr]);
    	}

    	// Retrieve circuit rating for each circuit from store: DerivedStore
    	function circuitRating(circuit) {
    		let entry = $circuitEval.filter(item => item.circuit === circuit);
    		return entry[0].rating;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyLapTimes> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => autoSeparator(e);
    	const change_handler = e => inputChange(e);

    	$$self.$capture_state = () => ({
    		fade,
    		user,
    		circuitData,
    		inputArr,
    		circuitEval,
    		driverRating,
    		userTitle,
    		SaveButton,
    		autoSeparator,
    		tooltip,
    		inputChange,
    		circuitRating,
    		$circuitEval,
    		$inputArr,
    		$circuitData
    	});

    	$$self.$inject_state = $$props => {
    		if ('tooltip' in $$props) $$invalidate(1, tooltip = $$props.tooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$circuitData,
    		tooltip,
    		inputChange,
    		circuitRating,
    		input_handler,
    		change_handler
    	];
    }

    class MyLapTimes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyLapTimes",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\ReferenceTimes.svelte generated by Svelte v3.40.0 */
    const file$4 = "src\\components\\ReferenceTimes.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (20:4) {#each $circuitData as entry}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[1].circuit + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[1].platinum.substring(0, 6) + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*entry*/ ctx[1].gold.substring(0, 6) + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[1].silver.substring(0, 6) + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = `${/*entry*/ ctx[1].silver.substring(0, 6)}+` + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			attr_dev(td0, "class", "svelte-utt6vs");
    			add_location(td0, file$4, 21, 6, 748);
    			attr_dev(td1, "class", "svelte-utt6vs");
    			add_location(td1, file$4, 22, 6, 780);
    			attr_dev(td2, "class", "svelte-utt6vs");
    			add_location(td2, file$4, 23, 6, 828);
    			attr_dev(td3, "class", "svelte-utt6vs");
    			add_location(td3, file$4, 24, 6, 872);
    			attr_dev(td4, "class", "svelte-utt6vs");
    			add_location(td4, file$4, 25, 6, 918);
    			add_location(tr, file$4, 20, 4, 736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$circuitData*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[1].circuit + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$circuitData*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[1].platinum.substring(0, 6) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$circuitData*/ 1 && t4_value !== (t4_value = /*entry*/ ctx[1].gold.substring(0, 6) + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$circuitData*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[1].silver.substring(0, 6) + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$circuitData*/ 1 && t8_value !== (t8_value = `${/*entry*/ ctx[1].silver.substring(0, 6)}+` + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(20:4) {#each $circuitData as entry}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let table;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let t10;
    	let p;
    	let t11;
    	let br;
    	let a;
    	let div_intro;
    	let div_outro;
    	let current;
    	let each_value = /*$circuitData*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "CIRCUIT";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "PLATINUM";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "GOLD";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "SILVER";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "BRONZE";
    			t9 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			p = element("p");
    			t11 = text("All reference lap times provided by:");
    			br = element("br");
    			a = element("a");
    			a.textContent = "Racing Club International";
    			attr_dev(th0, "class", "svelte-utt6vs");
    			add_location(th0, file$4, 11, 6, 355);
    			attr_dev(th1, "class", "platinum svelte-utt6vs");
    			add_location(th1, file$4, 12, 6, 379);
    			attr_dev(th2, "class", "gold svelte-utt6vs");
    			add_location(th2, file$4, 13, 6, 421);
    			attr_dev(th3, "class", "silver svelte-utt6vs");
    			add_location(th3, file$4, 14, 6, 455);
    			attr_dev(th4, "class", "bronze svelte-utt6vs");
    			add_location(th4, file$4, 15, 6, 493);
    			add_location(tr, file$4, 10, 4, 343);
    			attr_dev(table, "class", "svelte-utt6vs");
    			add_location(table, file$4, 9, 2, 330);
    			add_location(br, file$4, 29, 41, 1041);
    			attr_dev(a, "href", "https://www.racingclubinternational.com/");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$4, 29, 45, 1045);
    			attr_dev(p, "class", "svelte-utt6vs");
    			add_location(p, file$4, 29, 2, 1002);
    			attr_dev(div, "class", "container svelte-utt6vs");
    			add_location(div, file$4, 8, 0, 233);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(table, t9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(div, t10);
    			append_dev(div, p);
    			append_dev(p, t11);
    			append_dev(p, br);
    			append_dev(p, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$circuitData*/ 1) {
    				each_value = /*$circuitData*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, fade, { delay: 500, duration: 1000 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 400 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $circuitData;
    	validate_store(circuitData, 'circuitData');
    	component_subscribe($$self, circuitData, $$value => $$invalidate(0, $circuitData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReferenceTimes', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReferenceTimes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ circuitData, fade, $circuitData });
    	return [$circuitData];
    }

    class ReferenceTimes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReferenceTimes",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    // Array of user input laptimes (string m:ss.xxx format) for a sinngle circuit to be used to calculate pace. (component: PaceCalculator)
    let paceTimes = writable(
      [""]
    );

    // New pace calculated from above array (string m:ss.xxx format).
    let newPace = writable("");

    // Difference between new pace and current user pace at given circuit (string m:ss.xxx format).
    let delta = writable("");

    /* src\components\subcomponents\CalculatePaceButton.svelte generated by Svelte v3.40.0 */
    const file$3 = "src\\components\\subcomponents\\CalculatePaceButton.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Calculate Pace";
    			attr_dev(button, "id", "calcPaceBtn");
    			add_location(button, file$3, 68, 0, 2471);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $paceTimes;
    	validate_store(paceTimes, 'paceTimes');
    	component_subscribe($$self, paceTimes, $$value => $$invalidate(4, $paceTimes = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalculatePaceButton', slots, []);
    	let { currentPace } = $$props;
    	let { currentCircuit } = $$props;

    	// -- Button to validate and calculate lap pace and delta (difference from stored user lap time) at selected circuit --
    	function calculatePace() {
    		let paceNum;
    		let deltaNum;

    		// Check and remove last entry if empty. (Empty entry automatically added if user presses return when entering data - for ease of data entry)
    		if ($paceTimes.length > 1 && $paceTimes[$paceTimes.length - 1] === "") {
    			set_store_value(paceTimes, $paceTimes = [...$paceTimes.slice(0, -1)], $paceTimes);
    		}

    		// Validate entries - user entered lap times (store: PaceStore, paceTimes) values checked for format m:ss:xxx
    		const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/;

    		let invalidEntries = 0;

    		$paceTimes.forEach(item => {
    			if (!timesRegex.test(item)) {
    				invalidEntries++;
    			}
    		});

    		// Alert string if invalid entries found
    		let alertStr = `
      Invalid entries.
      Please use format m:ss.xxx
      `;

    		// If circuit not selected or invalid entries present, show alert and reset newPace
    		// Else, calculate and set pace (store: newPace).
    		if (!currentCircuit) {
    			alert("Select circuit");
    			newPace.set("");
    		} else if (invalidEntries > 0) {
    			alert(alertStr);
    			newPace.set("");
    		} else {
    			let sum = $paceTimes.reduce((sum, time) => sum + convertTime(time), 0);
    			paceNum = Math.floor(sum / $paceTimes.length);
    			newPace.set(convertTime(paceNum));
    		}

    		// Calculate delta between new pace and current pace (if present) (newPace - circuitData.user).
    		// If delta less than 10 seconds or one miunte, delta (string) is shortened to "s.xxx" or "ss.xxx" respectively.
    		if (currentPace !== "") {
    			deltaNum = paceNum - convertTime(currentPace);
    			let deltaStr = "";

    			if (Math.abs(deltaNum) < 10000) {
    				deltaStr = convertTime(Math.abs(deltaNum)).substring(3);
    			} else if (Math.abs(deltaNum) < 60000) {
    				deltaStr = convertTime(Math.abs(deltaNum)).substring(2);
    			} else {
    				deltaStr = convertTime(Math.abs(deltaNum));
    			}

    			if (deltaNum < 0) {
    				delta.set(`- ${deltaStr}`);
    			} else {
    				delta.set(`+ ${deltaStr}`);
    			}
    		}
    	}

    	const writable_props = ['currentPace', 'currentCircuit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CalculatePaceButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => calculatePace();

    	$$self.$$set = $$props => {
    		if ('currentPace' in $$props) $$invalidate(1, currentPace = $$props.currentPace);
    		if ('currentCircuit' in $$props) $$invalidate(2, currentCircuit = $$props.currentCircuit);
    	};

    	$$self.$capture_state = () => ({
    		paceTimes,
    		newPace,
    		delta,
    		convertTime,
    		circuitData,
    		currentPace,
    		currentCircuit,
    		calculatePace,
    		$paceTimes
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPace' in $$props) $$invalidate(1, currentPace = $$props.currentPace);
    		if ('currentCircuit' in $$props) $$invalidate(2, currentCircuit = $$props.currentCircuit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [calculatePace, currentPace, currentCircuit, click_handler];
    }

    class CalculatePaceButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { currentPace: 1, currentCircuit: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalculatePaceButton",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentPace*/ ctx[1] === undefined && !('currentPace' in props)) {
    			console.warn("<CalculatePaceButton> was created without expected prop 'currentPace'");
    		}

    		if (/*currentCircuit*/ ctx[2] === undefined && !('currentCircuit' in props)) {
    			console.warn("<CalculatePaceButton> was created without expected prop 'currentCircuit'");
    		}
    	}

    	get currentPace() {
    		throw new Error("<CalculatePaceButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPace(value) {
    		throw new Error("<CalculatePaceButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentCircuit() {
    		throw new Error("<CalculatePaceButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentCircuit(value) {
    		throw new Error("<CalculatePaceButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\PaceCalculator.svelte generated by Svelte v3.40.0 */
    const file$2 = "src\\components\\PaceCalculator.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (83:6) {#each $circuitData as entry}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*entry*/ ctx[20].circuit + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*entry*/ ctx[20].circuit;
    			option.value = option.__value;
    			add_location(option, file$2, 83, 6, 3328);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$circuitData*/ 8 && t_value !== (t_value = /*entry*/ ctx[20].circuit + "")) set_data_dev(t, t_value);

    			if (dirty & /*$circuitData*/ 8 && option_value_value !== (option_value_value = /*entry*/ ctx[20].circuit)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(83:6) {#each $circuitData as entry}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if currentCircuit}
    function create_if_block_1$1(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Current Pace:";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*currentPace*/ ctx[1]);
    			attr_dev(p0, "class", "text-left svelte-is40oy");
    			add_location(p0, file$2, 89, 8, 3506);
    			attr_dev(p1, "class", "text-right svelte-is40oy");
    			add_location(p1, file$2, 90, 8, 3554);
    			attr_dev(div, "class", "records-row svelte-is40oy");
    			add_location(div, file$2, 88, 6, 3471);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPace*/ 2) set_data_dev(t2, /*currentPace*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(88:4) {#if currentCircuit}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if $newPace}
    function create_if_block$2(ctx) {
    	let div2;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let t3;
    	let div1;
    	let p2;
    	let t5;
    	let p3;
    	let t6;
    	let p3_class_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "New Pace:";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*$newPace*/ ctx[2]);
    			t3 = space();
    			div1 = element("div");
    			p2 = element("p");
    			p2.textContent = "Delta:";
    			t5 = space();
    			p3 = element("p");
    			t6 = text(/*$delta*/ ctx[5]);
    			attr_dev(p0, "class", "text-left svelte-is40oy");
    			add_location(p0, file$2, 96, 10, 3698);
    			attr_dev(p1, "class", "text-right svelte-is40oy");
    			add_location(p1, file$2, 97, 10, 3744);
    			attr_dev(div0, "class", "records-row svelte-is40oy");
    			add_location(div0, file$2, 95, 8, 3661);
    			attr_dev(p2, "class", "text-left svelte-is40oy");
    			add_location(p2, file$2, 100, 10, 3843);

    			attr_dev(p3, "class", p3_class_value = "text-right " + ((/^-/).test(/*$delta*/ ctx[5])
    			? 'delta-negative'
    			: 'delta-positive') + " svelte-is40oy");

    			add_location(p3, file$2, 101, 10, 3886);
    			attr_dev(div1, "class", "records-row svelte-is40oy");
    			add_location(div1, file$2, 99, 8, 3806);
    			add_location(div2, file$2, 94, 6, 3646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, p2);
    			append_dev(div1, t5);
    			append_dev(div1, p3);
    			append_dev(p3, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$newPace*/ 4) set_data_dev(t2, /*$newPace*/ ctx[2]);
    			if (dirty & /*$delta*/ 32) set_data_dev(t6, /*$delta*/ ctx[5]);

    			if (dirty & /*$delta*/ 32 && p3_class_value !== (p3_class_value = "text-right " + ((/^-/).test(/*$delta*/ ctx[5])
    			? 'delta-negative'
    			: 'delta-positive') + " svelte-is40oy")) {
    				attr_dev(p3, "class", p3_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(94:4) {#if $newPace}",
    		ctx
    	});

    	return block;
    }

    // (109:4) {#each $paceTimes as paceTime, i}
    function create_each_block$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1_value = /*i*/ ctx[19] + 1 + "";
    	let t1;
    	let t2;
    	let input;
    	let t3;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[14].call(input, /*each_value*/ ctx[18], /*i*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("Lap ");
    			t1 = text(t1_value);
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			attr_dev(p, "class", "text-left svelte-is40oy");
    			add_location(p, file$2, 110, 6, 4174);
    			attr_dev(input, "id", `time${/*i*/ ctx[19]}`);
    			attr_dev(input, "placeholder", "0:00.000");
    			attr_dev(input, "class", "svelte-is40oy");
    			add_location(input, file$2, 111, 6, 4216);
    			attr_dev(div, "class", "has-tooltip");
    			attr_dev(div, "data-tooltip", /*tooltip*/ ctx[6]);
    			add_location(div, file$2, 109, 4, 4118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(div, t2);
    			append_dev(div, input);
    			set_input_value(input, /*paceTime*/ ctx[17]);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", input_input_handler),
    					listen_dev(input, "input", /*input_handler*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$paceTimes*/ 16 && input.value !== /*paceTime*/ ctx[17]) {
    				set_input_value(input, /*paceTime*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(109:4) {#each $paceTimes as paceTime, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let select;
    	let option;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let div2;
    	let button0;
    	let t6;
    	let button1;
    	let t8;
    	let calculatepacebutton;
    	let t9;
    	let button2;
    	let t11;
    	let button3;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*$circuitData*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*currentCircuit*/ ctx[0] && create_if_block_1$1(ctx);
    	let if_block1 = /*$newPace*/ ctx[2] && create_if_block$2(ctx);
    	let each_value = /*$paceTimes*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	calculatepacebutton = new CalculatePaceButton({
    			props: {
    				currentPace: /*currentPace*/ ctx[1],
    				currentCircuit: /*currentCircuit*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "--Select Circuit--";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Lap";
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Delete Last";
    			t8 = space();
    			create_component(calculatepacebutton.$$.fragment);
    			t9 = space();
    			button2 = element("button");
    			button2.textContent = "Update Records";
    			t11 = space();
    			button3 = element("button");
    			button3.textContent = "Reset";
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$2, 81, 6, 3239);
    			attr_dev(select, "name", "circuit");
    			attr_dev(select, "id", "circuit");
    			attr_dev(select, "class", "svelte-is40oy");
    			if (/*currentCircuit*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[12].call(select));
    			add_location(select, file$2, 80, 4, 3123);
    			attr_dev(div0, "class", "records svelte-is40oy");
    			add_location(div0, file$2, 86, 2, 3416);
    			attr_dev(div1, "id", "lap-times");
    			attr_dev(div1, "class", "lap-times svelte-is40oy");
    			add_location(div1, file$2, 107, 2, 4035);
    			attr_dev(button0, "id", "addBtn");
    			add_location(button0, file$2, 116, 4, 4367);
    			attr_dev(button1, "id", "deleteBtn");
    			add_location(button1, file$2, 117, 4, 4429);
    			add_location(button2, file$2, 119, 4, 4588);
    			add_location(button3, file$2, 120, 4, 4650);
    			add_location(div2, file$2, 115, 2, 4356);
    			attr_dev(div3, "class", "container svelte-is40oy");
    			add_location(div3, file$2, 79, 0, 3024);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select, null);
    			}

    			select_option(select, /*currentCircuit*/ ctx[0]);
    			append_dev(div3, t1);
    			append_dev(div3, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div3, t3);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t6);
    			append_dev(div2, button1);
    			append_dev(div2, t8);
    			mount_component(calculatepacebutton, div2, null);
    			append_dev(div2, t9);
    			append_dev(div2, button2);
    			append_dev(div2, t11);
    			append_dev(div2, button3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[12]),
    					listen_dev(select, "change", /*change_handler*/ ctx[13], false, false, false),
    					listen_dev(button0, "click", /*addEntry*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*deleteEntry*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*updateRecords*/ ctx[11], false, false, false),
    					listen_dev(button3, "click", /*reset*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$circuitData*/ 8) {
    				each_value_1 = /*$circuitData*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*currentCircuit, $circuitData*/ 9) {
    				select_option(select, /*currentCircuit*/ ctx[0]);
    			}

    			if (/*currentCircuit*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$newPace*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*tooltip, $paceTimes, autoSeparator*/ 80) {
    				each_value = /*$paceTimes*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const calculatepacebutton_changes = {};
    			if (dirty & /*currentPace*/ 2) calculatepacebutton_changes.currentPace = /*currentPace*/ ctx[1];
    			if (dirty & /*currentCircuit*/ 1) calculatepacebutton_changes.currentCircuit = /*currentCircuit*/ ctx[0];
    			calculatepacebutton.$set(calculatepacebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calculatepacebutton.$$.fragment, local);

    			add_render_callback(() => {
    				if (div3_outro) div3_outro.end(1);
    				if (!div3_intro) div3_intro = create_in_transition(div3, fade, { delay: 500, duration: 1000 });
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calculatepacebutton.$$.fragment, local);
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, fade, { duration: 400 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_1, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			destroy_component(calculatepacebutton);
    			if (detaching && div3_outro) div3_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function returnKey(e) {
    	if (e.key !== "Enter") return;
    	document.querySelector("#addBtn").click();
    	e.preventDefault();
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $newPace;
    	let $circuitData;
    	let $paceTimes;
    	let $delta;
    	validate_store(newPace, 'newPace');
    	component_subscribe($$self, newPace, $$value => $$invalidate(2, $newPace = $$value));
    	validate_store(circuitData, 'circuitData');
    	component_subscribe($$self, circuitData, $$value => $$invalidate(3, $circuitData = $$value));
    	validate_store(paceTimes, 'paceTimes');
    	component_subscribe($$self, paceTimes, $$value => $$invalidate(4, $paceTimes = $$value));
    	validate_store(delta, 'delta');
    	component_subscribe($$self, delta, $$value => $$invalidate(5, $delta = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaceCalculator', slots, []);
    	let currentCircuit = "";
    	let currentPace = "";
    	let entryAdded = false;
    	let tooltip = "With optimal track condition, track temperature 25-30C and at least 80L of fuel, complete at least 10 laps. Insert lap times here to calculate average pace, compare with current record and update if required. Format m:ss.xxx.";

    	// Move focus to newly created entry (for easy input of entries).
    	// "entryAdded" variable included so that focus only moves when inut box complete - allows user to edit previous entries.
    	afterUpdate(() => {
    		if (entryAdded) {
    			document.getElementById(`time${$paceTimes.length - 1}`).focus();
    			entryAdded = false;
    		}
    	});

    	// Return current pace (lap time) for selected circuit.
    	function getTime(circuit) {
    		$$invalidate(1, currentPace = $circuitData.filter(item => item.circuit === circuit)[0].user);
    	}

    	// Add new input element to allow user to add new lap time.
    	function addEntry() {
    		set_store_value(paceTimes, $paceTimes = [...$paceTimes, ""], $paceTimes);
    		entryAdded = true;
    	}

    	onMount(() => {
    		document.getElementById("lap-times").addEventListener("keydown", returnKey);
    		return () => document.getElementById("lap-times").removeEventListener("keydown", returnKey);
    	});

    	// Remove last lap time entry.
    	function deleteEntry() {
    		if ($paceTimes.length > 1) {
    			set_store_value(paceTimes, $paceTimes = $paceTimes.slice(0, -1), $paceTimes);
    		} else {
    			set_store_value(paceTimes, $paceTimes = [""], $paceTimes);
    		}
    	}

    	// Reset to original state (delete lap times, no track selected)
    	function reset() {
    		$$invalidate(0, currentCircuit = "");
    		$$invalidate(1, currentPace = "");
    		paceTimes.set([""]);
    		newPace.set("");
    	}

    	// Update user laptimes
    	// Firstly initiate click on CalculatePaceButton to generate up-to-date pace and also check for errors.
    	// If newPace is set, update store: circuitData.user with newly calculated lap time. Then reset page.
    	function updateRecords() {
    		document.getElementById("calcPaceBtn").click();

    		if ($newPace) {
    			let dataIndex = $circuitData.findIndex(item => item.circuit === currentCircuit);
    			set_store_value(circuitData, $circuitData[dataIndex].user = $newPace, $circuitData);
    			reset();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaceCalculator> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		currentCircuit = select_value(this);
    		$$invalidate(0, currentCircuit);
    	}

    	const change_handler = () => getTime(currentCircuit);

    	function input_input_handler(each_value, i) {
    		each_value[i] = this.value;
    		paceTimes.set($paceTimes);
    	}

    	const input_handler = e => autoSeparator(e);

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		fade,
    		circuitData,
    		paceTimes,
    		newPace,
    		delta,
    		convertTime,
    		CalculatePaceButton,
    		autoSeparator,
    		currentCircuit,
    		currentPace,
    		entryAdded,
    		tooltip,
    		getTime,
    		addEntry,
    		returnKey,
    		deleteEntry,
    		reset,
    		updateRecords,
    		$newPace,
    		$circuitData,
    		$paceTimes,
    		$delta
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentCircuit' in $$props) $$invalidate(0, currentCircuit = $$props.currentCircuit);
    		if ('currentPace' in $$props) $$invalidate(1, currentPace = $$props.currentPace);
    		if ('entryAdded' in $$props) entryAdded = $$props.entryAdded;
    		if ('tooltip' in $$props) $$invalidate(6, tooltip = $$props.tooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentCircuit,
    		currentPace,
    		$newPace,
    		$circuitData,
    		$paceTimes,
    		$delta,
    		tooltip,
    		getTime,
    		addEntry,
    		deleteEntry,
    		reset,
    		updateRecords,
    		select_change_handler,
    		change_handler,
    		input_input_handler,
    		input_handler
    	];
    }

    class PaceCalculator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaceCalculator",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\shared\Tabs.svelte generated by Svelte v3.40.0 */
    const file$1 = "src\\shared\\Tabs.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (22:4) {#each items as item}
    function create_each_block_1(ctx) {
    	let li;
    	let div;
    	let t0_value = /*item*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*item*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(div, file$1, 23, 8, 833);
    			attr_dev(li, "class", "tab-li svelte-9vx3au");
    			toggle_class(li, "active", /*item*/ ctx[8] === /*activeItem*/ ctx[1]);
    			add_location(li, file$1, 22, 6, 724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*items, activeItem*/ 3) {
    				toggle_class(li, "active", /*item*/ ctx[8] === /*activeItem*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(22:4) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (31:0) {#if showNav}
    function create_if_block$1(ctx) {
    	let nav;
    	let ul;
    	let nav_transition;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "nav-ul svelte-9vx3au");
    			add_location(ul, file$1, 32, 2, 991);
    			attr_dev(nav, "class", "svelte-9vx3au");
    			add_location(nav, file$1, 31, 0, 935);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items, activeItem, toggleNav, dispatch*/ 27) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!nav_transition) nav_transition = create_bidirectional_transition(nav, fly, { x: -200, duration: 1000 }, true);
    				nav_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!nav_transition) nav_transition = create_bidirectional_transition(nav, fly, { x: -200, duration: 1000 }, false);
    			nav_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			if (detaching && nav_transition) nav_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:0) {#if showNav}",
    		ctx
    	});

    	return block;
    }

    // (34:4) {#each items as item}
    function create_each_block(ctx) {
    	let li;
    	let div;
    	let t0_value = /*item*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[7](/*item*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(div, file$1, 35, 8, 1169);
    			attr_dev(li, "class", "nav-li svelte-9vx3au");
    			toggle_class(li, "active", /*item*/ ctx[8] === /*activeItem*/ ctx[1]);
    			add_location(li, file$1, 34, 6, 1045);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*items, activeItem*/ 3) {
    				toggle_class(li, "active", /*item*/ ctx[8] === /*activeItem*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(34:4) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul;
    	let div_transition;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*items*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*showNav*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (!src_url_equal(img.src, img_src_value = "icons/menu_white_36dp.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Menu");
    			attr_dev(img, "class", "svelte-9vx3au");
    			add_location(img, file$1, 19, 2, 589);
    			attr_dev(ul, "class", "tab-ul svelte-9vx3au");
    			add_location(ul, file$1, 20, 2, 670);
    			attr_dev(div, "class", "tabs svelte-9vx3au");
    			add_location(div, file$1, 18, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items, activeItem, dispatch*/ 11) {
    				each_value_1 = /*items*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*showNav*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showNav*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { delay: 2000, duration: 2000 }, true);
    				div_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { delay: 2000, duration: 2000 }, false);
    			div_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	const dispatch = createEventDispatcher();
    	let { items } = $$props;
    	let { activeItem } = $$props;
    	let showNav = false;

    	function toggleNav() {
    		$$invalidate(2, showNav = !showNav);
    	}

    	const writable_props = ['items', 'activeItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggleNav();
    	const click_handler_1 = item => dispatch('tabChange', item);

    	const click_handler_2 = item => {
    		toggleNav();
    		dispatch('tabChange', item);
    	};

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		fly,
    		fade,
    		dispatch,
    		items,
    		activeItem,
    		showNav,
    		toggleNav
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    		if ('showNav' in $$props) $$invalidate(2, showNav = $$props.showNav);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		items,
    		activeItem,
    		showNav,
    		dispatch,
    		toggleNav,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { items: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<Tabs> was created without expected prop 'items'");
    		}

    		if (/*activeItem*/ ctx[1] === undefined && !('activeItem' in props)) {
    			console.warn("<Tabs> was created without expected prop 'activeItem'");
    		}
    	}

    	get items() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItem() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItem(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.40.0 */
    const file = "src\\App.svelte";

    // (26:44) 
    function create_if_block_3(ctx) {
    	let pacecalculator;
    	let current;
    	pacecalculator = new PaceCalculator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pacecalculator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pacecalculator, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pacecalculator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pacecalculator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pacecalculator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(26:44) ",
    		ctx
    	});

    	return block;
    }

    // (24:44) 
    function create_if_block_2(ctx) {
    	let referencetimes;
    	let current;
    	referencetimes = new ReferenceTimes({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(referencetimes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(referencetimes, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(referencetimes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(referencetimes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(referencetimes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(24:44) ",
    		ctx
    	});

    	return block;
    }

    // (22:41) 
    function create_if_block_1(ctx) {
    	let mylaptimes;
    	let current;
    	mylaptimes = new MyLapTimes({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mylaptimes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mylaptimes, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mylaptimes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mylaptimes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mylaptimes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(22:41) ",
    		ctx
    	});

    	return block;
    }

    // (20:1) {#if activeItem === "My Profile"}
    function create_if_block(ctx) {
    	let userprofile;
    	let current;
    	userprofile = new MyProfile({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(userprofile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userprofile, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userprofile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userprofile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userprofile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(20:1) {#if activeItem === \\\"My Profile\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let tabs;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	header = new Header({ $$inline: true });

    	tabs = new Tabs({
    			props: {
    				activeItem: /*activeItem*/ ctx[0],
    				items: /*items*/ ctx[1]
    			},
    			$$inline: true
    		});

    	tabs.$on("tabChange", /*tabChange*/ ctx[2]);
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeItem*/ ctx[0] === "My Profile") return 0;
    		if (/*activeItem*/ ctx[0] === "My Lap Times") return 1;
    		if (/*activeItem*/ ctx[0] === "Reference Times") return 2;
    		if (/*activeItem*/ ctx[0] === "Pace Calculator") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(tabs.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			add_location(main, file, 17, 0, 549);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(tabs, main, null);
    			append_dev(main, t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};
    			if (dirty & /*activeItem*/ 1) tabs_changes.activeItem = /*activeItem*/ ctx[0];
    			tabs.$set(tabs_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(tabs);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let items = ["My Profile", "My Lap Times", "Reference Times", "Pace Calculator"];
    	let activeItem = "";

    	const tabChange = e => {
    		$$invalidate(0, activeItem = e.detail);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		UserProfile: MyProfile,
    		MyLapTimes,
    		ReferenceTimes,
    		PaceCalculator,
    		Tabs,
    		items,
    		activeItem,
    		tabChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeItem, items, tabChange];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	intro: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
