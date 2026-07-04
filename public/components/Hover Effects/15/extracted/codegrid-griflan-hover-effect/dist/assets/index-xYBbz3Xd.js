//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region node_modules/gsap/gsap-core.js
function _assertThisInitialized(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _inheritsLoose(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
	subClass.__proto__ = superClass;
}
/*!
* GSAP 3.15.0
* https://gsap.com
*
* @license Copyright 2008-2026, GreenSock. All rights reserved.
* Subject to the terms at https://gsap.com/standard-license
* @author: Jack Doyle, jack@greensock.com
*/
var _config = {
	autoSleep: 120,
	force3D: "auto",
	nullTargetWarn: 1,
	units: { lineHeight: "" }
}, _defaults = {
	duration: .5,
	overwrite: false,
	delay: 0
}, _suppressOverwrites, _reverting$1, _context, _bigNum$1 = 1e8, _tinyNum = 1 / _bigNum$1, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt = Math.sqrt, _cos = Math.cos, _sin = Math.sin, _isString = function _isString(value) {
	return typeof value === "string";
}, _isFunction = function _isFunction(value) {
	return typeof value === "function";
}, _isNumber = function _isNumber(value) {
	return typeof value === "number";
}, _isUndefined = function _isUndefined(value) {
	return typeof value === "undefined";
}, _isObject = function _isObject(value) {
	return typeof value === "object";
}, _isNotFalse = function _isNotFalse(value) {
	return value !== false;
}, _windowExists$1 = function _windowExists() {
	return typeof window !== "undefined";
}, _isFuncOrString = function _isFuncOrString(value) {
	return _isFunction(value) || _isString(value);
}, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {}, _isArray = Array.isArray, _randomExp = /random\([^)]+\)/g, _commaDelimExp = /,\s*/g, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globalTimeline, _win$1, _coreInitted, _doc$1, _globals = {}, _installScope = {}, _coreReady, _install = function _install(scope) {
	return (_installScope = _merge(scope, _globals)) && gsap;
}, _missingPlugin = function _missingPlugin(property, value) {
	return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
}, _warn = function _warn(message, suppress) {
	return !suppress && console.warn(message);
}, _addGlobal = function _addGlobal(name, obj) {
	return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
}, _emptyFunc = function _emptyFunc() {
	return 0;
}, _startAtRevertConfig = {
	suppressEvents: true,
	isStart: true,
	kill: false
}, _revertConfigNoKill = {
	suppressEvents: true,
	kill: false
}, _revertConfig = { suppressEvents: true }, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _lastRenderedFrame, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness(targets) {
	var target = targets[0], harnessPlugin, i;
	_isObject(target) || _isFunction(target) || (targets = [targets]);
	if (!(harnessPlugin = (target._gsap || {}).harness)) {
		i = _harnessPlugins.length;
		while (i-- && !_harnessPlugins[i].targetTest(target));
		harnessPlugin = _harnessPlugins[i];
	}
	i = targets.length;
	while (i--) targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
	return targets;
}, _getCache = function _getCache(target) {
	return target._gsap || _harness(toArray(target))[0]._gsap;
}, _getProperty = function _getProperty(target, property, v) {
	return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
}, _forEachName = function _forEachName(names, func) {
	return (names = names.split(",")).forEach(func) || names;
}, _round = function _round(value) {
	return Math.round(value * 1e5) / 1e5 || 0;
}, _roundPrecise = function _roundPrecise(value) {
	return Math.round(value * 1e7) / 1e7 || 0;
}, _parseRelative = function _parseRelative(start, value) {
	var operator = value.charAt(0), end = parseFloat(value.substr(2));
	start = parseFloat(start);
	return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
}, _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
	var l = toFind.length, i = 0;
	for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;);
	return i < l;
}, _lazyRender = function _lazyRender() {
	var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
	_lazyLookup = {};
	_lazyTweens.length = 0;
	for (i = 0; i < l; i++) {
		tween = a[i];
		tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
	}
}, _isRevertWorthy = function _isRevertWorthy(animation) {
	return !!(animation._initted || animation._startAt || animation.add);
}, _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
	_lazyTweens.length && !_reverting$1 && _lazyRender();
	animation.render(time, suppressEvents, force || !!(_reverting$1 && time < 0 && _isRevertWorthy(animation)));
	_lazyTweens.length && !_reverting$1 && _lazyRender();
}, _numericIfPossible = function _numericIfPossible(value) {
	var n = parseFloat(value);
	return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
}, _passThrough = function _passThrough(p) {
	return p;
}, _setDefaults = function _setDefaults(obj, defaults) {
	for (var p in defaults) p in obj || (obj[p] = defaults[p]);
	return obj;
}, _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
	return function(obj, defaults) {
		for (var p in defaults) p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
	};
}, _merge = function _merge(base, toMerge) {
	for (var p in toMerge) base[p] = toMerge[p];
	return base;
}, _mergeDeep = function _mergeDeep(base, toMerge) {
	for (var p in toMerge) p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
	return base;
}, _copyExcluding = function _copyExcluding(obj, excluding) {
	var copy = {}, p;
	for (p in obj) p in excluding || (copy[p] = obj[p]);
	return copy;
}, _inheritDefaults = function _inheritDefaults(vars) {
	var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
	if (_isNotFalse(vars.inherit)) while (parent) {
		func(vars, parent.vars.defaults);
		parent = parent.parent || parent._dp;
	}
	return vars;
}, _arraysMatch = function _arraysMatch(a1, a2) {
	var i = a1.length, match = i === a2.length;
	while (match && i-- && a1[i] === a2[i]);
	return i < 0;
}, _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
	if (firstProp === void 0) firstProp = "_first";
	if (lastProp === void 0) lastProp = "_last";
	var prev = parent[lastProp], t;
	if (sortBy) {
		t = child[sortBy];
		while (prev && prev[sortBy] > t) prev = prev._prev;
	}
	if (prev) {
		child._next = prev._next;
		prev._next = child;
	} else {
		child._next = parent[firstProp];
		parent[firstProp] = child;
	}
	if (child._next) child._next._prev = child;
	else parent[lastProp] = child;
	child._prev = prev;
	child.parent = child._dp = parent;
	return child;
}, _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
	if (firstProp === void 0) firstProp = "_first";
	if (lastProp === void 0) lastProp = "_last";
	var prev = child._prev, next = child._next;
	if (prev) prev._next = next;
	else if (parent[firstProp] === child) parent[firstProp] = next;
	if (next) next._prev = prev;
	else if (parent[lastProp] === child) parent[lastProp] = prev;
	child._next = child._prev = child.parent = null;
}, _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
	child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
	child._act = 0;
}, _uncache = function _uncache(animation, child) {
	if (animation && (!child || child._end > animation._dur || child._start < 0)) {
		var a = animation;
		while (a) {
			a._dirty = 1;
			a = a.parent;
		}
	}
	return animation;
}, _recacheAncestors = function _recacheAncestors(animation) {
	var parent = animation.parent;
	while (parent && parent.parent) {
		parent._dirty = 1;
		parent.totalDuration();
		parent = parent.parent;
	}
	return animation;
}, _rewindStartAt = function _rewindStartAt(tween, totalTime, suppressEvents, force) {
	return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
}, _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
	return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
}, _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
	return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
}, _animationCycle = function _animationCycle(tTime, cycleDuration) {
	var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
	return tTime && whole === tTime ? whole - 1 : whole;
}, _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
	return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
}, _setEnd = function _setEnd(animation) {
	return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
}, _alignPlayhead = function _alignPlayhead(animation, totalTime) {
	var parent = animation._dp;
	if (parent && parent.smoothChildTiming && animation._ts) {
		animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
		_setEnd(animation);
		parent._dirty || _uncache(parent, animation);
	}
	return animation;
}, _postAddChecks = function _postAddChecks(timeline, child) {
	var t;
	if (child._time || !child._dur && child._initted || child._start < timeline._time && (child._dur || !child.add)) {
		t = _parentToChildTotalTime(timeline.rawTime(), child);
		if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) child.render(t, true);
	}
	if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
		if (timeline._dur < timeline.duration()) {
			t = timeline;
			while (t._dp) {
				t.rawTime() >= 0 && t.totalTime(t._tTime);
				t = t._dp;
			}
		}
		timeline._zTime = -_tinyNum;
	}
}, _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
	child.parent && _removeFromParent(child);
	child._start = _roundPrecise((_isNumber(position) ? position : position || timeline !== _globalTimeline ? _parsePosition(timeline, position, child) : timeline._time) + child._delay);
	child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
	_addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
	_isFromOrFromStart(child) || (timeline._recent = child);
	skipChecks || _postAddChecks(timeline, child);
	timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime);
	return timeline;
}, _scrollTrigger = function _scrollTrigger(animation, trigger) {
	return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
}, _attemptInitTween = function _attemptInitTween(tween, time, force, suppressEvents, tTime) {
	_initTween(tween, time, tTime);
	if (!tween._initted) return 1;
	if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
		_lazyTweens.push(tween);
		tween._lazy = [tTime, suppressEvents];
		return 1;
	}
}, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
	var parent = _ref.parent;
	return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
}, _isFromOrFromStart = function _isFromOrFromStart(_ref2) {
	var data = _ref2.data;
	return data === "isFromStart" || data === "isStart";
}, _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
	var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
	if (repeatDelay && tween._repeat) {
		tTime = _clamp(0, tween._tDur, totalTime);
		iteration = _animationCycle(tTime, repeatDelay);
		tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
		if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
			prevRatio = 1 - ratio;
			tween.vars.repeatRefresh && tween._initted && tween.invalidate();
		}
	}
	if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
		if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) return;
		prevIteration = tween._zTime;
		tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
		suppressEvents || (suppressEvents = totalTime && !prevIteration);
		tween.ratio = ratio;
		tween._from && (ratio = 1 - ratio);
		tween._time = 0;
		tween._tTime = tTime;
		pt = tween._pt;
		while (pt) {
			pt.r(ratio, pt.d);
			pt = pt._next;
		}
		totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
		tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
		tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
		if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
			ratio && _removeFromParent(tween, 1);
			if (!suppressEvents && !_reverting$1) {
				_callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
				tween._prom && tween._prom();
			}
		}
	} else if (!tween._zTime) tween._zTime = totalTime;
}, _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
	var child;
	if (time > prevTime) {
		child = animation._first;
		while (child && child._start <= time) {
			if (child.data === "isPause" && child._start > prevTime) return child;
			child = child._next;
		}
	} else {
		child = animation._last;
		while (child && child._start >= time) {
			if (child.data === "isPause" && child._start < prevTime) return child;
			child = child._prev;
		}
	}
}, _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
	var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
	totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
	animation._dur = dur;
	animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
	totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
	animation.parent && _setEnd(animation);
	skipUncache || _uncache(animation.parent, animation);
	return animation;
}, _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
	return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
}, _zeroPosition = {
	_start: 0,
	endTime: _emptyFunc,
	totalDuration: _emptyFunc
}, _parsePosition = function _parsePosition(animation, position, percentAnimation) {
	var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$1 ? recent.endTime(false) : animation._dur, i, offset, isPercent;
	if (_isString(position) && (isNaN(position) || position in labels)) {
		offset = position.charAt(0);
		isPercent = position.substr(-1) === "%";
		i = position.indexOf("=");
		if (offset === "<" || offset === ">") {
			i >= 0 && (position = position.replace(/=/, ""));
			return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
		}
		if (i < 0) {
			position in labels || (labels[position] = clippedDuration);
			return labels[position];
		}
		offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
		if (isPercent && percentAnimation) offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
		return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
	}
	return position == null ? clippedDuration : +position;
}, _createTweenType = function _createTweenType(type, params, timeline) {
	var isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
	isLegacy && (vars.duration = params[1]);
	vars.parent = timeline;
	if (type) {
		irVars = vars;
		parent = timeline;
		while (parent && !("immediateRender" in irVars)) {
			irVars = parent.vars.defaults || {};
			parent = _isNotFalse(parent.vars.inherit) && parent.parent;
		}
		vars.immediateRender = _isNotFalse(irVars.immediateRender);
		type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
	}
	return new Tween(params[0], vars, params[varsIndex + 1]);
}, _conditionalReturn = function _conditionalReturn(value, func) {
	return value || value === 0 ? func(value) : func;
}, _clamp = function _clamp(min, max, value) {
	return value < min ? min : value > max ? max : value;
}, getUnit = function getUnit(value, v) {
	return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
}, clamp = function clamp(min, max, value) {
	return _conditionalReturn(value, function(v) {
		return _clamp(min, max, v);
	});
}, _slice = [].slice, _isArrayLike = function _isArrayLike(value, nonEmpty) {
	return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win$1;
}, _flatten = function _flatten(ar, leaveStrings, accumulator) {
	if (accumulator === void 0) accumulator = [];
	return ar.forEach(function(value) {
		var _accumulator;
		return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
	}) || accumulator;
}, toArray = function toArray(value, scope, leaveStrings) {
	return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc$1).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
}, selector = function selector(value) {
	value = toArray(value)[0] || _warn("Invalid scope") || {};
	return function(v) {
		var el = value.current || value.nativeElement || value;
		return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$1.createElement("div") : value);
	};
}, shuffle = function shuffle(a) {
	return a.sort(function() {
		return .5 - Math.random();
	});
}, distribute = function distribute(v) {
	if (_isFunction(v)) return v;
	var vars = _isObject(v) ? v : { each: v }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
	if (_isString(from)) ratioX = ratioY = {
		center: .5,
		edges: .5,
		end: 1
	}[from] || 0;
	else if (!isDecimal && ratios) {
		ratioX = from[0];
		ratioY = from[1];
	}
	return function(i, target, a) {
		var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max, min, wrapAt;
		if (!distances) {
			wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
			if (!wrapAt) {
				max = -_bigNum$1;
				while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l);
				wrapAt < l && wrapAt--;
			}
			distances = cache[l] = [];
			originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
			originY = wrapAt === _bigNum$1 ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
			max = 0;
			min = _bigNum$1;
			for (j = 0; j < l; j++) {
				x = j % wrapAt - originX;
				y = originY - (j / wrapAt | 0);
				distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
				d > max && (max = d);
				d < min && (min = d);
			}
			from === "random" && shuffle(distances);
			distances.max = max - min;
			distances.min = min;
			distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
			distances.b = l < 0 ? base - l : base;
			distances.u = getUnit(vars.amount || vars.each) || 0;
			ease = ease && l < 0 ? _invertEase(ease) : ease;
		}
		l = (distances[i] - distances.min) / distances.max || 0;
		return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
	};
}, _roundModifier = function _roundModifier(v) {
	var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
	return function(raw) {
		var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
		return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
	};
}, snap = function snap(snapTo, value) {
	var isArray = _isArray(snapTo), radius, is2D;
	if (!isArray && _isObject(snapTo)) {
		radius = isArray = snapTo.radius || _bigNum$1;
		if (snapTo.values) {
			snapTo = toArray(snapTo.values);
			if (is2D = !_isNumber(snapTo[0])) radius *= radius;
		} else snapTo = _roundModifier(snapTo.increment);
	}
	return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
		is2D = snapTo(raw);
		return Math.abs(is2D - raw) <= radius ? is2D : raw;
	} : function(raw) {
		var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum$1, closest = 0, i = snapTo.length, dx, dy;
		while (i--) {
			if (is2D) {
				dx = snapTo[i].x - x;
				dy = snapTo[i].y - y;
				dx = dx * dx + dy * dy;
			} else dx = Math.abs(snapTo[i] - x);
			if (dx < min) {
				min = dx;
				closest = i;
			}
		}
		closest = !radius || min <= radius ? snapTo[closest] : raw;
		return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
	});
}, random = function random(min, max, roundingIncrement, returnFunction) {
	return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
		return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
	});
}, pipe = function pipe() {
	for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) functions[_key] = arguments[_key];
	return function(value) {
		return functions.reduce(function(v, f) {
			return f(v);
		}, value);
	};
}, unitize = function unitize(func, unit) {
	return function(value) {
		return func(parseFloat(value)) + (unit || getUnit(value));
	};
}, normalize = function normalize(min, max, value) {
	return mapRange(min, max, 0, 1, value);
}, _wrapArray = function _wrapArray(a, wrapper, value) {
	return _conditionalReturn(value, function(index) {
		return a[~~wrapper(index)];
	});
}, wrap = function wrap(min, max, value) {
	var range = max - min;
	return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function(value) {
		return (range + (value - min) % range) % range + min;
	});
}, wrapYoyo = function wrapYoyo(min, max, value) {
	var range = max - min, total = range * 2;
	return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function(value) {
		value = (total + (value - min) % total) % total || 0;
		return min + (value > range ? total - value : value);
	});
}, _replaceRandom = function _replaceRandom(s) {
	return s.replace(_randomExp, function(match) {
		var arIndex = match.indexOf("[") + 1, values = match.substring(arIndex || 7, arIndex ? match.indexOf("]") : match.length - 1).split(_commaDelimExp);
		return random(arIndex ? values : +values[0], arIndex ? 0 : +values[1], +values[2] || 1e-5);
	});
}, mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
	var inRange = inMax - inMin, outRange = outMax - outMin;
	return _conditionalReturn(value, function(value) {
		return outMin + ((value - inMin) / inRange * outRange || 0);
	});
}, interpolate = function interpolate(start, end, progress, mutate) {
	var func = isNaN(start + end) ? 0 : function(p) {
		return (1 - p) * start + p * end;
	};
	if (!func) {
		var isString = _isString(start), master = {}, p, i, interpolators, l, il;
		progress === true && (mutate = 1) && (progress = null);
		if (isString) {
			start = { p: start };
			end = { p: end };
		} else if (_isArray(start) && !_isArray(end)) {
			interpolators = [];
			l = start.length;
			il = l - 2;
			for (i = 1; i < l; i++) interpolators.push(interpolate(start[i - 1], start[i]));
			l--;
			func = function func(p) {
				p *= l;
				var i = Math.min(il, ~~p);
				return interpolators[i](p - i);
			};
			progress = end;
		} else if (!mutate) start = _merge(_isArray(start) ? [] : {}, start);
		if (!interpolators) {
			for (p in end) _addPropTween.call(master, start, p, "get", end[p]);
			func = function func(p) {
				return _renderPropTweens(p, master) || (isString ? start.p : start);
			};
		}
	}
	return _conditionalReturn(progress, func);
}, _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
	var labels = timeline.labels, min = _bigNum$1, p, distance, label;
	for (p in labels) {
		distance = labels[p] - fromTime;
		if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
			label = p;
			min = distance;
		}
	}
	return label;
}, _callback = function _callback(animation, type, executeLazyFirst) {
	var v = animation.vars, callback = v[type], prevContext = _context, context = animation._ctx, params, scope, result;
	if (!callback) return;
	params = v[type + "Params"];
	scope = v.callbackScope || animation;
	executeLazyFirst && _lazyTweens.length && _lazyRender();
	context && (_context = context);
	result = params ? callback.apply(scope, params) : callback.call(scope);
	_context = prevContext;
	return result;
}, _interrupt = function _interrupt(animation) {
	_removeFromParent(animation);
	animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
	animation.progress() < 1 && _callback(animation, "onInterrupt");
	return animation;
}, _quickTween, _registerPluginQueue = [], _createPlugin = function _createPlugin(config) {
	if (!config) return;
	config = !config.name && config["default"] || config;
	if (_windowExists$1() || config.headless) {
		var name = config.name, isFunc = _isFunction(config), Plugin = name && !isFunc && config.init ? function() {
			this._props = [];
		} : config, instanceDefaults = {
			init: _emptyFunc,
			render: _renderPropTweens,
			add: _addPropTween,
			kill: _killPropTweensOf,
			modifier: _addPluginModifier,
			rawVars: 0
		}, statics = {
			targetTest: 0,
			get: 0,
			getSetter: _getSetter,
			aliases: {},
			register: 0
		};
		_wake();
		if (config !== Plugin) {
			if (_plugins[name]) return;
			_setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));
			_merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));
			_plugins[Plugin.prop = name] = Plugin;
			if (config.targetTest) {
				_harnessPlugins.push(Plugin);
				_reservedProps[name] = 1;
			}
			name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
		}
		_addGlobal(name, Plugin);
		config.register && config.register(gsap, Plugin, PropTween);
	} else _registerPluginQueue.push(config);
}, _255 = 255, _colorLookup = {
	aqua: [
		0,
		_255,
		_255
	],
	lime: [
		0,
		_255,
		0
	],
	silver: [
		192,
		192,
		192
	],
	black: [
		0,
		0,
		0
	],
	maroon: [
		128,
		0,
		0
	],
	teal: [
		0,
		128,
		128
	],
	blue: [
		0,
		0,
		_255
	],
	navy: [
		0,
		0,
		128
	],
	white: [
		_255,
		_255,
		_255
	],
	olive: [
		128,
		128,
		0
	],
	yellow: [
		_255,
		_255,
		0
	],
	orange: [
		_255,
		165,
		0
	],
	gray: [
		128,
		128,
		128
	],
	purple: [
		128,
		0,
		128
	],
	green: [
		0,
		128,
		0
	],
	red: [
		_255,
		0,
		0
	],
	pink: [
		_255,
		192,
		203
	],
	cyan: [
		0,
		_255,
		_255
	],
	transparent: [
		_255,
		_255,
		_255,
		0
	]
}, _hue = function _hue(h, m1, m2) {
	h += h < 0 ? 1 : h > 1 ? -1 : 0;
	return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
}, splitColor = function splitColor(v, toHSL, forceAlpha) {
	var a = !v ? _colorLookup.black : _isNumber(v) ? [
		v >> 16,
		v >> 8 & _255,
		v & _255
	] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
	if (!a) {
		if (v.substr(-1) === ",") v = v.substr(0, v.length - 1);
		if (_colorLookup[v]) a = _colorLookup[v];
		else if (v.charAt(0) === "#") {
			if (v.length < 6) {
				r = v.charAt(1);
				g = v.charAt(2);
				b = v.charAt(3);
				v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
			}
			if (v.length === 9) {
				a = parseInt(v.substr(1, 6), 16);
				return [
					a >> 16,
					a >> 8 & _255,
					a & _255,
					parseInt(v.substr(7), 16) / 255
				];
			}
			v = parseInt(v.substr(1), 16);
			a = [
				v >> 16,
				v >> 8 & _255,
				v & _255
			];
		} else if (v.substr(0, 3) === "hsl") {
			a = wasHSL = v.match(_strictNumExp);
			if (!toHSL) {
				h = +a[0] % 360 / 360;
				s = +a[1] / 100;
				l = +a[2] / 100;
				g = l <= .5 ? l * (s + 1) : l + s - l * s;
				r = l * 2 - g;
				a.length > 3 && (a[3] *= 1);
				a[0] = _hue(h + 1 / 3, r, g);
				a[1] = _hue(h, r, g);
				a[2] = _hue(h - 1 / 3, r, g);
			} else if (~v.indexOf("=")) {
				a = v.match(_numExp);
				forceAlpha && a.length < 4 && (a[3] = 1);
				return a;
			}
		} else a = v.match(_strictNumExp) || _colorLookup.transparent;
		a = a.map(Number);
	}
	if (toHSL && !wasHSL) {
		r = a[0] / _255;
		g = a[1] / _255;
		b = a[2] / _255;
		max = Math.max(r, g, b);
		min = Math.min(r, g, b);
		l = (max + min) / 2;
		if (max === min) h = s = 0;
		else {
			d = max - min;
			s = l > .5 ? d / (2 - max - min) : d / (max + min);
			h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
			h *= 60;
		}
		a[0] = ~~(h + .5);
		a[1] = ~~(s * 100 + .5);
		a[2] = ~~(l * 100 + .5);
	}
	forceAlpha && a.length < 4 && (a[3] = 1);
	return a;
}, _colorOrderData = function _colorOrderData(v) {
	var values = [], c = [], i = -1;
	v.split(_colorExp).forEach(function(v) {
		var a = v.match(_numWithUnitExp) || [];
		values.push.apply(values, a);
		c.push(i += a.length + 1);
	});
	values.c = c;
	return values;
}, _formatColors = function _formatColors(s, toHSL, orderMatchData) {
	var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
	if (!colors) return s;
	colors = colors.map(function(color) {
		return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
	});
	if (orderMatchData) {
		d = _colorOrderData(s);
		c = orderMatchData.c;
		if (c.join(result) !== d.c.join(result)) {
			shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
			l = shell.length - 1;
			for (; i < l; i++) result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
		}
	}
	if (!shell) {
		shell = s.split(_colorExp);
		l = shell.length - 1;
		for (; i < l; i++) result += shell[i] + colors[i];
	}
	return result + shell[l];
}, _colorExp = function() {
	var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
	for (p in _colorLookup) s += "|" + p + "\\b";
	return new RegExp(s + ")", "gi");
}(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter(a) {
	var combined = a.join(" "), toHSL;
	_colorExp.lastIndex = 0;
	if (_colorExp.test(combined)) {
		toHSL = _hslExp.test(combined);
		a[1] = _formatColors(a[1], toHSL);
		a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
		return true;
	}
}, _tickerActive, _ticker = function() {
	var _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick(v) {
		var elapsed = _getTime() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
		(elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
		_lastUpdate += elapsed;
		time = _lastUpdate - _startTime;
		overlap = time - _nextTime;
		if (overlap > 0 || manual) {
			frame = ++_self.frame;
			_delta = time - _self.time * 1e3;
			_self.time = time = time / 1e3;
			_nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
			dispatch = 1;
		}
		manual || (_id = _req(_tick));
		if (dispatch) for (_i = 0; _i < _listeners.length; _i++) _listeners[_i](time, _delta, frame, v);
	};
	_self = {
		time: 0,
		frame: 0,
		tick: function tick() {
			_tick(true);
		},
		deltaRatio: function deltaRatio(fps) {
			return _delta / (1e3 / (fps || 60));
		},
		wake: function wake() {
			if (_coreReady) {
				if (!_coreInitted && _windowExists$1()) {
					_win$1 = _coreInitted = window;
					_doc$1 = _win$1.document || {};
					_globals.gsap = gsap;
					(_win$1.gsapVersions || (_win$1.gsapVersions = [])).push(gsap.version);
					_install(_installScope || _win$1.GreenSockGlobals || !_win$1.gsap && _win$1 || {});
					_registerPluginQueue.forEach(_createPlugin);
				}
				_raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
				_id && _self.sleep();
				_req = _raf || function(f) {
					return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
				};
				_tickerActive = 1;
				_tick(2);
			}
		},
		sleep: function sleep() {
			(_raf ? cancelAnimationFrame : clearTimeout)(_id);
			_tickerActive = 0;
			_req = _emptyFunc;
		},
		lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
			_lagThreshold = threshold || Infinity;
			_adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
		},
		fps: function fps(_fps) {
			_gap = 1e3 / (_fps || 240);
			_nextTime = _self.time * 1e3 + _gap;
		},
		add: function add(callback, once, prioritize) {
			var func = once ? function(t, d, f, v) {
				callback(t, d, f, v);
				_self.remove(func);
			} : callback;
			_self.remove(callback);
			_listeners[prioritize ? "unshift" : "push"](func);
			_wake();
			return func;
		},
		remove: function remove(callback, i) {
			~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
		},
		_listeners
	};
	return _self;
}(), _wake = function _wake() {
	return !_tickerActive && _ticker.wake();
}, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString(value) {
	var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index, val, parsedVal;
	for (; i < l; i++) {
		val = split[i];
		index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
		parsedVal = val.substr(0, index);
		obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
		key = val.substr(index + 1).trim();
	}
	return obj;
}, _valueInParentheses = function _valueInParentheses(value) {
	var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
	return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
}, _configEaseFromString = function _configEaseFromString(name) {
	var split = (name + "").split("("), ease = _easeMap[split[0]];
	return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
}, _invertEase = function _invertEase(ease) {
	return function(p) {
		return 1 - ease(1 - p);
	};
}, _parseEase = function _parseEase(ease, defaultEase) {
	return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
}, _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
	if (easeOut === void 0) easeOut = function easeOut(p) {
		return 1 - easeIn(1 - p);
	};
	if (easeInOut === void 0) easeInOut = function easeInOut(p) {
		return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
	};
	var ease = {
		easeIn,
		easeOut,
		easeInOut
	}, lowercaseName;
	_forEachName(names, function(name) {
		_easeMap[name] = _globals[name] = ease;
		_easeMap[lowercaseName = name.toLowerCase()] = easeOut;
		for (var p in ease) _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
	});
	return ease;
}, _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
	return function(p) {
		return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
	};
}, _configElastic = function _configElastic(type, amplitude, period) {
	var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut(p) {
		return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
	}, ease = type === "out" ? easeOut : type === "in" ? function(p) {
		return 1 - easeOut(1 - p);
	} : _easeInOutFromOut(easeOut);
	p2 = _2PI / p2;
	ease.config = function(amplitude, period) {
		return _configElastic(type, amplitude, period);
	};
	return ease;
}, _configBack = function _configBack(type, overshoot) {
	if (overshoot === void 0) overshoot = 1.70158;
	var easeOut = function easeOut(p) {
		return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
	}, ease = type === "out" ? easeOut : type === "in" ? function(p) {
		return 1 - easeOut(1 - p);
	} : _easeInOutFromOut(easeOut);
	ease.config = function(overshoot) {
		return _configBack(type, overshoot);
	};
	return ease;
};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
	var power = i < 5 ? i + 1 : i;
	_insertEase(name + ",Power" + (power - 1), i ? function(p) {
		return Math.pow(p, power);
	} : function(p) {
		return p;
	}, function(p) {
		return 1 - Math.pow(1 - p, power);
	}, function(p) {
		return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
	});
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
(function(n, c) {
	var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut(p) {
		return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
	};
	_insertEase("Bounce", function(p) {
		return 1 - easeOut(1 - p);
	}, easeOut);
})(7.5625, 2.75);
_insertEase("Expo", function(p) {
	return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
});
_insertEase("Circ", function(p) {
	return -(_sqrt(1 - p * p) - 1);
});
_insertEase("Sine", function(p) {
	return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = { config: function config(steps, immediateStart) {
	if (steps === void 0) steps = 1;
	var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
	return function(p) {
		return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
	};
} };
_defaults.ease = _easeMap["quad.out"];
_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
	return _callbackNames += name + "," + name + "Params,";
});
var GSCache = function GSCache(target, harness) {
	this.id = _gsID++;
	target._gsap = this;
	this.target = target;
	this.harness = harness;
	this.get = harness ? harness.get : _getProperty;
	this.set = harness ? harness.getSetter : _getSetter;
};
var Animation = /*#__PURE__*/ function() {
	function Animation(vars) {
		this.vars = vars;
		this._delay = +vars.delay || 0;
		if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
			this._rDelay = vars.repeatDelay || 0;
			this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
		}
		this._ts = 1;
		_setDuration(this, +vars.duration, 1, 1);
		this.data = vars.data;
		if (_context) {
			this._ctx = _context;
			_context.data.push(this);
		}
		_tickerActive || _ticker.wake();
	}
	var _proto = Animation.prototype;
	_proto.delay = function delay(value) {
		if (value || value === 0) {
			this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
			this._delay = value;
			return this;
		}
		return this._delay;
	};
	_proto.duration = function duration(value) {
		return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
	};
	_proto.totalDuration = function totalDuration(value) {
		if (!arguments.length) return this._tDur;
		this._dirty = 0;
		return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
	};
	_proto.totalTime = function totalTime(_totalTime, suppressEvents) {
		_wake();
		if (!arguments.length) return this._tTime;
		var parent = this._dp;
		if (parent && parent.smoothChildTiming && this._ts) {
			_alignPlayhead(this, _totalTime);
			!parent._dp || parent.parent || _postAddChecks(parent, this);
			while (parent && parent.parent) {
				if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) parent.totalTime(parent._tTime, true);
				parent = parent.parent;
			}
			if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) _addToTimeline(this._dp, this, this._start - this._delay);
		}
		if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !this._initted && this._dur && _totalTime || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
			this._ts || (this._pTime = _totalTime);
			_lazySafeRender(this, _totalTime, suppressEvents);
		}
		return this;
	};
	_proto.time = function time(value, suppressEvents) {
		return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
	};
	_proto.totalProgress = function totalProgress(value, suppressEvents) {
		return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
	};
	_proto.progress = function progress(value, suppressEvents) {
		return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
	};
	_proto.iteration = function iteration(value, suppressEvents) {
		var cycleDuration = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
	};
	_proto.timeScale = function timeScale(value, suppressEvents) {
		if (!arguments.length) return this._rts === -_tinyNum ? 0 : this._rts;
		if (this._rts === value) return this;
		var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
		this._rts = +value || 0;
		this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
		this.totalTime(_clamp(-Math.abs(this._delay), this.totalDuration(), tTime), suppressEvents !== false);
		_setEnd(this);
		return _recacheAncestors(this);
	};
	_proto.paused = function paused(value) {
		if (!arguments.length) return this._ps;
		if (this._ps !== value) {
			this._ps = value;
			if (value) {
				this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
				this._ts = this._act = 0;
			} else {
				_wake();
				this._ts = this._rts;
				this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
			}
		}
		return this;
	};
	_proto.startTime = function startTime(value) {
		if (arguments.length) {
			this._start = _roundPrecise(value);
			var parent = this.parent || this._dp;
			parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, this._start - this._delay);
			return this;
		}
		return this._start;
	};
	_proto.endTime = function endTime(includeRepeats) {
		return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
	};
	_proto.rawTime = function rawTime(wrapRepeats) {
		var parent = this.parent || this._dp;
		return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
	};
	_proto.revert = function revert(config) {
		if (config === void 0) config = _revertConfig;
		var prevIsReverting = _reverting$1;
		_reverting$1 = config;
		if (_isRevertWorthy(this)) {
			this.timeline && this.timeline.revert(config);
			this.totalTime(-.01, config.suppressEvents);
		}
		this.data !== "nested" && config.kill !== false && this.kill();
		_reverting$1 = prevIsReverting;
		return this;
	};
	_proto.globalTime = function globalTime(rawTime) {
		var animation = this, time = arguments.length ? rawTime : animation.rawTime();
		while (animation) {
			time = animation._start + time / (Math.abs(animation._ts) || 1);
			animation = animation._dp;
		}
		return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
	};
	_proto.repeat = function repeat(value) {
		if (arguments.length) {
			this._repeat = value === Infinity ? -2 : value;
			return _onUpdateTotalDuration(this);
		}
		return this._repeat === -2 ? Infinity : this._repeat;
	};
	_proto.repeatDelay = function repeatDelay(value) {
		if (arguments.length) {
			var time = this._time;
			this._rDelay = value;
			_onUpdateTotalDuration(this);
			return time ? this.time(time) : this;
		}
		return this._rDelay;
	};
	_proto.yoyo = function yoyo(value) {
		if (arguments.length) {
			this._yoyo = value;
			return this;
		}
		return this._yoyo;
	};
	_proto.seek = function seek(position, suppressEvents) {
		return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
	};
	_proto.restart = function restart(includeDelay, suppressEvents) {
		this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
		this._dur || (this._zTime = -_tinyNum);
		return this;
	};
	_proto.play = function play(from, suppressEvents) {
		from != null && this.seek(from, suppressEvents);
		return this.reversed(false).paused(false);
	};
	_proto.reverse = function reverse(from, suppressEvents) {
		from != null && this.seek(from || this.totalDuration(), suppressEvents);
		return this.reversed(true).paused(false);
	};
	_proto.pause = function pause(atTime, suppressEvents) {
		atTime != null && this.seek(atTime, suppressEvents);
		return this.paused(true);
	};
	_proto.resume = function resume() {
		return this.paused(false);
	};
	_proto.reversed = function reversed(value) {
		if (arguments.length) {
			!!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
			return this;
		}
		return this._rts < 0;
	};
	_proto.invalidate = function invalidate() {
		this._initted = this._act = 0;
		this._zTime = -_tinyNum;
		return this;
	};
	_proto.isActive = function isActive() {
		var parent = this.parent || this._dp, start = this._start, rawTime;
		return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
	};
	_proto.eventCallback = function eventCallback(type, callback, params) {
		var vars = this.vars;
		if (arguments.length > 1) {
			if (!callback) delete vars[type];
			else {
				vars[type] = callback;
				params && (vars[type + "Params"] = params);
				type === "onUpdate" && (this._onUpdate = callback);
			}
			return this;
		}
		return vars[type];
	};
	_proto.then = function then(onFulfilled) {
		var self = this, prevProm = self._prom;
		return new Promise(function(resolve) {
			var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve() {
				var _then = self.then;
				self.then = null;
				prevProm && prevProm();
				_isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
				resolve(f);
				self.then = _then;
			};
			if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) _resolve();
			else self._prom = _resolve;
		});
	};
	_proto.kill = function kill() {
		_interrupt(this);
	};
	return Animation;
}();
_setDefaults(Animation.prototype, {
	_time: 0,
	_start: 0,
	_end: 0,
	_tTime: 0,
	_tDur: 0,
	_dirty: 0,
	_repeat: 0,
	_yoyo: false,
	parent: null,
	_initted: false,
	_rDelay: 0,
	_ts: 1,
	_dp: 0,
	ratio: 0,
	_zTime: -_tinyNum,
	_prom: 0,
	_ps: false,
	_rts: 1
});
var Timeline = /*#__PURE__*/ function(_Animation) {
	_inheritsLoose(Timeline, _Animation);
	function Timeline(vars, position) {
		var _this;
		if (vars === void 0) vars = {};
		_this = _Animation.call(this, vars) || this;
		_this.labels = {};
		_this.smoothChildTiming = !!vars.smoothChildTiming;
		_this.autoRemoveChildren = !!vars.autoRemoveChildren;
		_this._sort = _isNotFalse(vars.sortChildren);
		_globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
		vars.reversed && _this.reverse();
		vars.paused && _this.paused(true);
		vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
		return _this;
	}
	var _proto2 = Timeline.prototype;
	_proto2.to = function to(targets, vars, position) {
		_createTweenType(0, arguments, this);
		return this;
	};
	_proto2.from = function from(targets, vars, position) {
		_createTweenType(1, arguments, this);
		return this;
	};
	_proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
		_createTweenType(2, arguments, this);
		return this;
	};
	_proto2.set = function set(targets, vars, position) {
		vars.duration = 0;
		vars.parent = this;
		_inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
		vars.immediateRender = !!vars.immediateRender;
		new Tween(targets, vars, _parsePosition(this, position), 1);
		return this;
	};
	_proto2.call = function call(callback, params, position) {
		return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
	};
	_proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
		vars.duration = duration;
		vars.stagger = vars.stagger || stagger;
		vars.onComplete = onCompleteAll;
		vars.onCompleteParams = onCompleteAllParams;
		vars.parent = this;
		new Tween(targets, vars, _parsePosition(this, position));
		return this;
	};
	_proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
		vars.runBackwards = 1;
		_inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
		return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
	};
	_proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
		toVars.startAt = fromVars;
		_inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
		return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
	};
	_proto2.render = function render(totalTime, suppressEvents, force) {
		var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
		this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
		if (tTime !== this._tTime || force || crossingStart) {
			if (prevTime !== this._time && dur) {
				tTime += this._time - prevTime;
				totalTime += this._time - prevTime;
			}
			time = tTime;
			prevStart = this._start;
			timeScale = this._ts;
			prevPaused = !timeScale;
			if (crossingStart) {
				dur || (prevTime = this._zTime);
				(totalTime || !suppressEvents) && (this._zTime = totalTime);
			}
			if (this._repeat) {
				yoyo = this._yoyo;
				cycleDuration = dur + this._rDelay;
				if (this._repeat < -1 && totalTime < 0) return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
				time = _roundPrecise(tTime % cycleDuration);
				if (tTime === tDur) {
					iteration = this._repeat;
					time = dur;
				} else {
					prevIteration = _roundPrecise(tTime / cycleDuration);
					iteration = ~~prevIteration;
					if (iteration && iteration === prevIteration) {
						time = dur;
						iteration--;
					}
					time > dur && (time = dur);
				}
				prevIteration = _animationCycle(this._tTime, cycleDuration);
				!prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
				if (yoyo && iteration & 1) {
					time = dur - time;
					isYoyo = 1;
				}
				if (iteration !== prevIteration && !this._lock) {
					var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
					iteration < prevIteration && (rewinding = !rewinding);
					prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
					this._lock = 1;
					this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
					this._tTime = tTime;
					!suppressEvents && this.parent && _callback(this, "onRepeat");
					if (this.vars.repeatRefresh && !isYoyo) {
						this.invalidate()._lock = 1;
						prevIteration = iteration;
					}
					if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
					dur = this._dur;
					tDur = this._tDur;
					if (doesWrap) {
						this._lock = 2;
						prevTime = rewinding ? dur : -1e-4;
						this.render(prevTime, true);
						this.vars.repeatRefresh && !isYoyo && this.invalidate();
					}
					this._lock = 0;
					if (!this._ts && !prevPaused) return this;
				}
			}
			if (this._hasPause && !this._forcing && this._lock < 2) {
				pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
				if (pauseTween) tTime -= time - (time = pauseTween._start);
			}
			this._tTime = tTime;
			this._time = time;
			this._act = !!timeScale;
			if (!this._initted) {
				this._onUpdate = this.vars.onUpdate;
				this._initted = 1;
				this._zTime = totalTime;
				prevTime = 0;
			}
			if (!prevTime && tTime && dur && !suppressEvents && !prevIteration) {
				_callback(this, "onStart");
				if (this._tTime !== tTime) return this;
			}
			if (time >= prevTime && totalTime >= 0) {
				child = this._first;
				while (child) {
					next = child._next;
					if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
						if (child.parent !== this) return this.render(totalTime, suppressEvents, force);
						child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
						if (time !== this._time || !this._ts && !prevPaused) {
							pauseTween = 0;
							next && (tTime += this._zTime = -_tinyNum);
							break;
						}
					}
					child = next;
				}
			} else {
				child = this._last;
				var adjustedTime = totalTime < 0 ? totalTime : time;
				while (child) {
					next = child._prev;
					if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
						if (child.parent !== this) return this.render(totalTime, suppressEvents, force);
						child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && _isRevertWorthy(child));
						if (time !== this._time || !this._ts && !prevPaused) {
							pauseTween = 0;
							next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
							break;
						}
					}
					child = next;
				}
			}
			if (pauseTween && !suppressEvents) {
				this.pause();
				pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
				if (this._ts) {
					this._start = prevStart;
					_setEnd(this);
					return this.render(totalTime, suppressEvents, force);
				}
			}
			this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
			if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
				if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
					if (!this._lock) {
						(totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
						if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
							_callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
							this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
						}
					}
				}
			}
		}
		return this;
	};
	_proto2.add = function add(child, position) {
		var _this2 = this;
		_isNumber(position) || (position = _parsePosition(this, position, child));
		if (!(child instanceof Animation)) {
			if (_isArray(child)) {
				child.forEach(function(obj) {
					return _this2.add(obj, position);
				});
				return this;
			}
			if (_isString(child)) return this.addLabel(child, position);
			if (_isFunction(child)) child = Tween.delayedCall(0, child);
			else return this;
		}
		return this !== child ? _addToTimeline(this, child, position) : this;
	};
	_proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
		if (nested === void 0) nested = true;
		if (tweens === void 0) tweens = true;
		if (timelines === void 0) timelines = true;
		if (ignoreBeforeTime === void 0) ignoreBeforeTime = -_bigNum$1;
		var a = [], child = this._first;
		while (child) {
			if (child._start >= ignoreBeforeTime) if (child instanceof Tween) tweens && a.push(child);
			else {
				timelines && a.push(child);
				nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
			}
			child = child._next;
		}
		return a;
	};
	_proto2.getById = function getById(id) {
		var animations = this.getChildren(1, 1, 1), i = animations.length;
		while (i--) if (animations[i].vars.id === id) return animations[i];
	};
	_proto2.remove = function remove(child) {
		if (_isString(child)) return this.removeLabel(child);
		if (_isFunction(child)) return this.killTweensOf(child);
		child.parent === this && _removeLinkedListItem(this, child);
		if (child === this._recent) this._recent = this._last;
		return _uncache(this);
	};
	_proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
		if (!arguments.length) return this._tTime;
		this._forcing = 1;
		if (!this._dp && this._ts) this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
		_Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
		this._forcing = 0;
		return this;
	};
	_proto2.addLabel = function addLabel(label, position) {
		this.labels[label] = _parsePosition(this, position);
		return this;
	};
	_proto2.removeLabel = function removeLabel(label) {
		delete this.labels[label];
		return this;
	};
	_proto2.addPause = function addPause(position, callback, params) {
		var t = Tween.delayedCall(0, callback || _emptyFunc, params);
		t.data = "isPause";
		this._hasPause = 1;
		return _addToTimeline(this, t, _parsePosition(this, position));
	};
	_proto2.removePause = function removePause(position) {
		var child = this._first;
		position = _parsePosition(this, position);
		while (child) {
			if (child._start === position && child.data === "isPause") _removeFromParent(child);
			child = child._next;
		}
	};
	_proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
		var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
		while (i--) _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
		return this;
	};
	_proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
		var a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children;
		while (child) {
			if (child instanceof Tween) {
				if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) a.push(child);
			} else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) a.push.apply(a, children);
			child = child._next;
		}
		return a;
	};
	_proto2.tweenTo = function tweenTo(position, vars) {
		vars = vars || {};
		var tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults({
			ease: vars.ease || "none",
			lazy: false,
			immediateRender: false,
			time: endTime,
			overwrite: "auto",
			duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
			onStart: function onStart() {
				tl.pause();
				if (!initted) {
					var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
					tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
					initted = 1;
				}
				_onStart && _onStart.apply(tween, onStartParams || []);
			}
		}, vars));
		return immediateRender ? tween.render(0) : tween;
	};
	_proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
		return this.tweenTo(toPosition, _setDefaults({ startAt: { time: _parsePosition(this, fromPosition) } }, vars));
	};
	_proto2.recent = function recent() {
		return this._recent;
	};
	_proto2.nextLabel = function nextLabel(afterTime) {
		if (afterTime === void 0) afterTime = this._time;
		return _getLabelInDirection(this, _parsePosition(this, afterTime));
	};
	_proto2.previousLabel = function previousLabel(beforeTime) {
		if (beforeTime === void 0) beforeTime = this._time;
		return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
	};
	_proto2.currentLabel = function currentLabel(value) {
		return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
	};
	_proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
		if (ignoreBeforeTime === void 0) ignoreBeforeTime = 0;
		var child = this._first, labels = this.labels, p;
		amount = _roundPrecise(amount);
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				child._start += amount;
				child._end += amount;
			}
			child = child._next;
		}
		if (adjustLabels) {
			for (p in labels) if (labels[p] >= ignoreBeforeTime) labels[p] += amount;
		}
		return _uncache(this);
	};
	_proto2.invalidate = function invalidate(soft) {
		var child = this._first;
		this._lock = 0;
		while (child) {
			child.invalidate(soft);
			child = child._next;
		}
		return _Animation.prototype.invalidate.call(this, soft);
	};
	_proto2.clear = function clear(includeLabels) {
		if (includeLabels === void 0) includeLabels = true;
		var child = this._first, next;
		while (child) {
			next = child._next;
			this.remove(child);
			child = next;
		}
		this._dp && (this._time = this._tTime = this._pTime = 0);
		includeLabels && (this.labels = {});
		return _uncache(this);
	};
	_proto2.totalDuration = function totalDuration(value) {
		var max = 0, self = this, child = self._last, prevStart = _bigNum$1, prev, start, parent;
		if (arguments.length) return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
		if (self._dirty) {
			parent = self.parent;
			while (child) {
				prev = child._prev;
				child._dirty && child.totalDuration();
				start = child._start;
				if (start > prevStart && self._sort && child._ts && !self._lock) {
					self._lock = 1;
					_addToTimeline(self, child, start - child._delay, 1)._lock = 0;
				} else prevStart = start;
				if (start < 0 && child._ts) {
					max -= start;
					if (!parent && !self._dp || parent && parent.smoothChildTiming) {
						self._start += _roundPrecise(start / self._ts);
						self._time -= start;
						self._tTime -= start;
					}
					self.shiftChildren(-start, false, -Infinity);
					prevStart = 0;
				}
				child._end > max && child._ts && (max = child._end);
				child = prev;
			}
			_setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
			self._dirty = 0;
		}
		return self._tDur;
	};
	Timeline.updateRoot = function updateRoot(time) {
		if (_globalTimeline._ts) {
			_lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
			_lastRenderedFrame = _ticker.frame;
		}
		if (_ticker.frame >= _nextGCFrame) {
			_nextGCFrame += _config.autoSleep || 120;
			var child = _globalTimeline._first;
			if (!child || !child._ts) {
				if (_config.autoSleep && _ticker._listeners.length < 2) {
					while (child && !child._ts) child = child._next;
					child || _ticker.sleep();
				}
			}
		}
	};
	return Timeline;
}(Animation);
_setDefaults(Timeline.prototype, {
	_lock: 0,
	_hasPause: 0,
	_forcing: 0
});
var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
	var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
	pt.b = start;
	pt.e = end;
	start += "";
	end += "";
	if (hasRandom = ~end.indexOf("random(")) end = _replaceRandom(end);
	if (stringFilter) {
		a = [start, end];
		stringFilter(a, target, prop);
		start = a[0];
		end = a[1];
	}
	startNums = start.match(_complexStringNumExp) || [];
	while (result = _complexStringNumExp.exec(end)) {
		endNum = result[0];
		chunk = end.substring(index, result.index);
		if (color) color = (color + 1) % 5;
		else if (chunk.substr(-5) === "rgba(") color = 1;
		if (endNum !== startNums[matchIndex++]) {
			startNum = parseFloat(startNums[matchIndex - 1]) || 0;
			pt._pt = {
				_next: pt._pt,
				p: chunk || matchIndex === 1 ? chunk : ",",
				s: startNum,
				c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
				m: color && color < 4 ? Math.round : 0
			};
			index = _complexStringNumExp.lastIndex;
		}
	}
	pt.c = index < end.length ? end.substring(index, end.length) : "";
	pt.fp = funcParam;
	if (_relExp.test(end) || hasRandom) pt.e = 0;
	this._pt = pt;
	return pt;
}, _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
	_isFunction(end) && (end = end(index || 0, target, targets));
	var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
	if (_isString(end)) {
		if (~end.indexOf("random(")) end = _replaceRandom(end);
		if (end.charAt(1) === "=") {
			pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
			if (pt || pt === 0) end = pt;
		}
	}
	if (!optional || parsedStart !== end || _forceAllPropTweens) {
		if (!isNaN(parsedStart * end) && end !== "") {
			pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
			funcParam && (pt.fp = funcParam);
			modifier && pt.modifier(modifier, this, target);
			return this._pt = pt;
		}
		!currentValue && !(prop in target) && _missingPlugin(prop, end);
		return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
	}
}, _processVars = function _processVars(vars, index, target, targets, tween) {
	_isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
	if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
	var copy = {}, p;
	for (p in vars) copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
	return copy;
}, _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
	var plugin, pt, ptLookup, i;
	if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
		tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
		if (tween !== _quickTween) {
			ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
			i = plugin._props.length;
			while (i--) ptLookup[plugin._props[i]] = pt;
		}
	}
	return plugin;
}, _overwritingTween, _forceAllPropTweens, _initTween = function _initTween(tween, time, tTime) {
	var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline, reverseEase = vars.easeReverse || yoyoEase, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
	tl && (!keyframes || !ease) && (ease = "none");
	tween._ease = _parseEase(ease, _defaults.ease);
	tween._rEase = reverseEase && (_parseEase(reverseEase) || tween._ease);
	tween._from = !tl && !!vars.runBackwards;
	if (tween._from) tween.ratio = 1;
	if (!tl || keyframes && !vars.stagger) {
		harness = targets[0] ? _getCache(targets[0]).harness : 0;
		harnessVars = harness && vars[harness.prop];
		cleanVars = _copyExcluding(vars, _reservedProps);
		if (prevStartAt) {
			prevStartAt._zTime < 0 && prevStartAt.progress(1);
			time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
			prevStartAt._lazy = 0;
		}
		if (startAt) {
			_removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
				data: "isStart",
				overwrite: false,
				parent,
				immediateRender: true,
				lazy: !prevStartAt && _isNotFalse(lazy),
				startAt: null,
				delay: 0,
				onUpdate: onUpdate && function() {
					return _callback(tween, "onUpdate");
				},
				stagger: 0
			}, startAt)));
			tween._startAt._dp = 0;
			tween._startAt._sat = tween;
			time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
			if (immediateRender) {
				if (dur && time <= 0 && tTime <= 0) {
					time && (tween._zTime = time);
					return;
				}
			}
		} else if (runBackwards && dur) {
			if (!prevStartAt) {
				time && (immediateRender = false);
				p = _setDefaults({
					overwrite: false,
					data: "isFromStart",
					lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
					immediateRender,
					stagger: 0,
					parent
				}, cleanVars);
				harnessVars && (p[harness.prop] = harnessVars);
				_removeFromParent(tween._startAt = Tween.set(targets, p));
				tween._startAt._dp = 0;
				tween._startAt._sat = tween;
				time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
				tween._zTime = time;
				if (!immediateRender) _initTween(tween._startAt, _tinyNum, _tinyNum);
				else if (!time) return;
			}
		}
		tween._pt = tween._ptCache = 0;
		lazy = dur && _isNotFalse(lazy) || lazy && !dur;
		for (i = 0; i < targets.length; i++) {
			target = targets[i];
			gsData = target._gsap || _harness(targets)[i]._gsap;
			tween._ptLookup[i] = ptLookup = {};
			_lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
			index = fullTargets === targets ? i : fullTargets.indexOf(target);
			if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
				tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
				plugin._props.forEach(function(name) {
					ptLookup[name] = pt;
				});
				plugin.priority && (hasPriority = 1);
			}
			if (!harness || harnessVars) for (p in cleanVars) if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) plugin.priority && (hasPriority = 1);
			else ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
			tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
			if (autoOverwrite && tween._pt) {
				_overwritingTween = tween;
				_globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
				overwritten = !tween.parent;
				_overwritingTween = 0;
			}
			tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
		}
		hasPriority && _sortPropTweensByPriority(tween);
		tween._onInit && tween._onInit(tween);
	}
	tween._onUpdate = onUpdate;
	tween._initted = (!tween._op || tween._pt) && !overwritten;
	keyframes && time <= 0 && tl.render(_bigNum$1, true, true);
}, _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
	var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
	if (!ptCache) {
		ptCache = tween._ptCache[property] = [];
		lookup = tween._ptLookup;
		i = tween._targets.length;
		while (i--) {
			pt = lookup[i][property];
			if (pt && pt.d && pt.d._pt) {
				pt = pt.d._pt;
				while (pt && pt.p !== property && pt.fp !== property) pt = pt._next;
			}
			if (!pt) {
				_forceAllPropTweens = 1;
				tween.vars[property] = "+=0";
				_initTween(tween, time);
				_forceAllPropTweens = 0;
				return skipRecursion ? _warn(property + " not eligible for reset. Try splitting into individual properties") : 1;
			}
			ptCache.push(pt);
		}
	}
	i = ptCache.length;
	while (i--) {
		rootPT = ptCache[i];
		pt = rootPT._pt || rootPT;
		pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
		pt.c = value - pt.s;
		rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
		rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
	}
}, _addAliasesToVars = function _addAliasesToVars(targets, vars) {
	var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases;
	if (!propertyAliases) return vars;
	copy = _merge({}, vars);
	for (p in propertyAliases) if (p in copy) {
		aliases = propertyAliases[p].split(",");
		i = aliases.length;
		while (i--) copy[aliases[i]] = copy[p];
	}
	return copy;
}, _parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
	var ease = obj.ease || easeEach || "power1.inOut", p, a;
	if (_isArray(obj)) {
		a = allProps[prop] || (allProps[prop] = []);
		obj.forEach(function(value, i) {
			return a.push({
				t: i / (obj.length - 1) * 100,
				v: value,
				e: ease
			});
		});
	} else for (p in obj) {
		a = allProps[p] || (allProps[p] = []);
		p === "ease" || a.push({
			t: parseFloat(prop),
			v: obj[p],
			e: ease
		});
	}
}, _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
	return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
}, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", _staggerPropsToSkip = {};
_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
	return _staggerPropsToSkip[name] = 1;
});
var Tween = /*#__PURE__*/ function(_Animation2) {
	_inheritsLoose(Tween, _Animation2);
	function Tween(targets, vars, position, skipInherit) {
		var _this3;
		if (typeof vars === "number") {
			position.duration = vars;
			vars = position;
			position = null;
		}
		_this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
		var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
		_this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
		_this3._ptLookup = [];
		_this3._overwrite = overwrite;
		if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
			vars = _this3.vars;
			var easeReverse = vars.easeReverse || vars.yoyoEase;
			tl = _this3.timeline = new Timeline({
				data: "nested",
				defaults: defaults || {},
				targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
			});
			tl.kill();
			tl.parent = tl._dp = _assertThisInitialized(_this3);
			tl._start = 0;
			if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
				l = parsedTargets.length;
				staggerFunc = stagger && distribute(stagger);
				if (_isObject(stagger)) {
					for (p in stagger) if (~_staggerTweenProps.indexOf(p)) {
						staggerVarsToMerge || (staggerVarsToMerge = {});
						staggerVarsToMerge[p] = stagger[p];
					}
				}
				for (i = 0; i < l; i++) {
					copy = _copyExcluding(vars, _staggerPropsToSkip);
					copy.stagger = 0;
					easeReverse && (copy.easeReverse = easeReverse);
					staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
					curTarget = parsedTargets[i];
					copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
					copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
					if (!stagger && l === 1 && copy.delay) {
						_this3._delay = delay = copy.delay;
						_this3._start += delay;
						copy.delay = 0;
					}
					tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
					tl._ease = _easeMap.none;
				}
				tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
			} else if (keyframes) {
				_inheritDefaults(_setDefaults(tl.vars.defaults, { ease: "none" }));
				tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
				var time = 0, a, kf, v;
				if (_isArray(keyframes)) {
					keyframes.forEach(function(frame) {
						return tl.to(parsedTargets, frame, ">");
					});
					tl.duration();
				} else {
					copy = {};
					for (p in keyframes) p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
					for (p in copy) {
						a = copy[p].sort(function(a, b) {
							return a.t - b.t;
						});
						time = 0;
						for (i = 0; i < a.length; i++) {
							kf = a[i];
							v = {
								ease: kf.e,
								duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
							};
							v[p] = kf.v;
							tl.to(parsedTargets, v, time);
							time += v.duration;
						}
					}
					tl.duration() < duration && tl.to({}, { duration: duration - tl.duration() });
				}
			}
			duration || _this3.duration(duration = tl.duration());
		} else _this3.timeline = 0;
		if (overwrite === true && !_suppressOverwrites) {
			_overwritingTween = _assertThisInitialized(_this3);
			_globalTimeline.killTweensOf(parsedTargets);
			_overwritingTween = 0;
		}
		_addToTimeline(parent, _assertThisInitialized(_this3), position);
		vars.reversed && _this3.reverse();
		vars.paused && _this3.paused(true);
		if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
			_this3._tTime = -_tinyNum;
			_this3.render(Math.max(0, -delay) || 0);
		}
		scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
		return _this3;
	}
	var _proto3 = Tween.prototype;
	_proto3.render = function render(totalTime, suppressEvents, force) {
		var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline;
		if (!dur) _renderZeroDurationTween(this, totalTime, suppressEvents, force);
		else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
			time = tTime;
			timeline = this.timeline;
			if (this._repeat) {
				cycleDuration = dur + this._rDelay;
				if (this._repeat < -1 && isNegative) return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
				time = _roundPrecise(tTime % cycleDuration);
				if (tTime === tDur) {
					iteration = this._repeat;
					time = dur;
				} else {
					prevIteration = _roundPrecise(tTime / cycleDuration);
					iteration = ~~prevIteration;
					if (iteration && iteration === prevIteration) {
						time = dur;
						iteration--;
					} else if (time > dur) time = dur;
				}
				isYoyo = this._yoyo && iteration & 1;
				if (isYoyo) time = dur - time;
				prevIteration = _animationCycle(this._tTime, cycleDuration);
				if (time === prevTime && !force && this._initted && iteration === prevIteration) {
					this._tTime = tTime;
					return this;
				}
				if (iteration !== prevIteration) {
					if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
						this._lock = force = 1;
						this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
					}
				}
			}
			if (!this._initted) {
				if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
					this._tTime = 0;
					return this;
				}
				if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) return this;
				if (dur !== this._dur) return this.render(totalTime, suppressEvents, force);
			}
			if (this._rEase) {
				var inv = time < prevTime;
				if (inv !== this._inv) {
					var segDur = inv ? prevTime : dur - prevTime;
					this._inv = inv;
					if (this._from) this.ratio = 1 - this.ratio;
					this._invRatio = this.ratio;
					this._invTime = prevTime;
					this._invRecip = segDur ? (inv ? -1 : 1) / segDur : 0;
					this._invScale = inv ? -this.ratio : 1 - this.ratio;
					this._invEase = inv ? this._rEase : this._ease;
				}
				this.ratio = ratio = this._invRatio + this._invScale * this._invEase((time - this._invTime) * this._invRecip);
			} else this.ratio = ratio = this._ease(time / dur);
			if (this._from) this.ratio = ratio = 1 - ratio;
			this._tTime = tTime;
			this._time = time;
			if (!this._act && this._ts) {
				this._act = 1;
				this._lazy = 0;
			}
			if (!prevTime && tTime && !suppressEvents && !prevIteration) {
				_callback(this, "onStart");
				if (this._tTime !== tTime) return this;
			}
			pt = this._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
			timeline && timeline.render(totalTime < 0 ? totalTime : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
			if (this._onUpdate && !suppressEvents) {
				isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
				_callback(this, "onUpdate");
			}
			this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
			if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
				isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
				(totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
				if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
					_callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
					this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
				}
			}
		}
		return this;
	};
	_proto3.targets = function targets() {
		return this._targets;
	};
	_proto3.invalidate = function invalidate(soft) {
		(!soft || !this.vars.runBackwards) && (this._startAt = 0);
		this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
		this._ptLookup = [];
		this.timeline && this.timeline.invalidate(soft);
		return _Animation2.prototype.invalidate.call(this, soft);
	};
	_proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
		_tickerActive || _ticker.wake();
		this._ts || this.play();
		var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
		this._initted || _initTween(this, time);
		ratio = this._ease(time / this._dur);
		if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) return this.resetTo(property, value, start, startIsRelative, 1);
		_alignPlayhead(this, 0);
		this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
		return this.render(0);
	};
	_proto3.kill = function kill(targets, vars) {
		if (vars === void 0) vars = "all";
		if (!targets && (!vars || vars === "all")) {
			this._lazy = this._pt = 0;
			this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting$1);
			return this;
		}
		if (this.timeline) {
			var tDur = this.timeline.totalDuration();
			this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
			this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
			return this;
		}
		var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
		if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
			vars === "all" && (this._pt = 0);
			return _interrupt(this);
		}
		overwrittenProps = this._op = this._op || [];
		if (vars !== "all") {
			if (_isString(vars)) {
				p = {};
				_forEachName(vars, function(name) {
					return p[name] = 1;
				});
				vars = p;
			}
			vars = _addAliasesToVars(parsedTargets, vars);
		}
		i = parsedTargets.length;
		while (i--) if (~killingTargets.indexOf(parsedTargets[i])) {
			curLookup = propTweenLookup[i];
			if (vars === "all") {
				overwrittenProps[i] = vars;
				props = curLookup;
				curOverwriteProps = {};
			} else {
				curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
				props = vars;
			}
			for (p in props) {
				pt = curLookup && curLookup[p];
				if (pt) {
					if (!("kill" in pt.d) || pt.d.kill(p) === true) _removeLinkedListItem(this, pt, "_pt");
					delete curLookup[p];
				}
				if (curOverwriteProps !== "all") curOverwriteProps[p] = 1;
			}
		}
		this._initted && !this._pt && firstPT && _interrupt(this);
		return this;
	};
	Tween.to = function to(targets, vars) {
		return new Tween(targets, vars, arguments[2]);
	};
	Tween.from = function from(targets, vars) {
		return _createTweenType(1, arguments);
	};
	Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
		return new Tween(callback, 0, {
			immediateRender: false,
			lazy: false,
			overwrite: false,
			delay,
			onComplete: callback,
			onReverseComplete: callback,
			onCompleteParams: params,
			onReverseCompleteParams: params,
			callbackScope: scope
		});
	};
	Tween.fromTo = function fromTo(targets, fromVars, toVars) {
		return _createTweenType(2, arguments);
	};
	Tween.set = function set(targets, vars) {
		vars.duration = 0;
		vars.repeatDelay || (vars.repeat = 0);
		return new Tween(targets, vars);
	};
	Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
		return _globalTimeline.killTweensOf(targets, props, onlyActive);
	};
	return Tween;
}(Animation);
_setDefaults(Tween.prototype, {
	_targets: [],
	_lazy: 0,
	_startAt: 0,
	_op: 0,
	_onInit: 0
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
	Tween[name] = function() {
		var tl = new Timeline(), params = _slice.call(arguments, 0);
		params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
		return tl[name].apply(tl, params);
	};
});
var _setterPlain = function _setterPlain(target, property, value) {
	return target[property] = value;
}, _setterFunc = function _setterFunc(target, property, value) {
	return target[property](value);
}, _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
	return target[property](data.fp, value);
}, _setterAttribute = function _setterAttribute(target, property, value) {
	return target.setAttribute(property, value);
}, _getSetter = function _getSetter(target, property) {
	return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
}, _renderPlain = function _renderPlain(ratio, data) {
	return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
}, _renderBoolean = function _renderBoolean(ratio, data) {
	return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
}, _renderComplexString = function _renderComplexString(ratio, data) {
	var pt = data._pt, s = "";
	if (!ratio && data.b) s = data.b;
	else if (ratio === 1 && data.e) s = data.e;
	else {
		while (pt) {
			s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
			pt = pt._next;
		}
		s += data.c;
	}
	data.set(data.t, data.p, s, data);
}, _renderPropTweens = function _renderPropTweens(ratio, data) {
	var pt = data._pt;
	while (pt) {
		pt.r(ratio, pt.d);
		pt = pt._next;
	}
}, _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
	var pt = this._pt, next;
	while (pt) {
		next = pt._next;
		pt.p === property && pt.modifier(modifier, tween, target);
		pt = next;
	}
}, _killPropTweensOf = function _killPropTweensOf(property) {
	var pt = this._pt, hasNonDependentRemaining, next;
	while (pt) {
		next = pt._next;
		if (pt.p === property && !pt.op || pt.op === property) _removeLinkedListItem(this, pt, "_pt");
		else if (!pt.dep) hasNonDependentRemaining = 1;
		pt = next;
	}
	return !hasNonDependentRemaining;
}, _setterWithModifier = function _setterWithModifier(target, property, value, data) {
	data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
}, _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
	var pt = parent._pt, next, pt2, first, last;
	while (pt) {
		next = pt._next;
		pt2 = first;
		while (pt2 && pt2.pr > pt.pr) pt2 = pt2._next;
		if (pt._prev = pt2 ? pt2._prev : last) pt._prev._next = pt;
		else first = pt;
		if (pt._next = pt2) pt2._prev = pt;
		else last = pt;
		pt = next;
	}
	parent._pt = first;
};
var PropTween = /*#__PURE__*/ function() {
	function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
		this.t = target;
		this.s = start;
		this.c = change;
		this.p = prop;
		this.r = renderer || _renderPlain;
		this.d = data || this;
		this.set = setter || _setterPlain;
		this.pr = priority || 0;
		this._next = next;
		if (next) next._prev = this;
	}
	var _proto4 = PropTween.prototype;
	_proto4.modifier = function modifier(func, tween, target) {
		this.mSet = this.mSet || this.set;
		this.set = _setterWithModifier;
		this.m = func;
		this.mt = target;
		this.tween = tween;
	};
	return PropTween;
}();
_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(name) {
	return _reservedProps[name] = 1;
});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
	sortChildren: false,
	defaults: _defaults,
	autoRemoveChildren: true,
	id: "root",
	smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
var _media = [], _listeners = {}, _emptyArray = [], _lastMediaTime = 0, _contextID = 0, _dispatch = function _dispatch(type) {
	return (_listeners[type] || _emptyArray).map(function(f) {
		return f();
	});
}, _onMediaChange = function _onMediaChange() {
	var time = Date.now(), matches = [];
	if (time - _lastMediaTime > 2) {
		_dispatch("matchMediaInit");
		_media.forEach(function(c) {
			var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
			for (p in queries) {
				match = _win$1.matchMedia(queries[p]).matches;
				match && (anyMatch = 1);
				if (match !== conditions[p]) {
					conditions[p] = match;
					toggled = 1;
				}
			}
			if (toggled) {
				c.revert();
				anyMatch && matches.push(c);
			}
		});
		_dispatch("matchMediaRevert");
		matches.forEach(function(c) {
			return c.onMatch(c, function(func) {
				return c.add(null, func);
			});
		});
		_lastMediaTime = time;
		_dispatch("matchMedia");
	}
};
var Context = /*#__PURE__*/ function() {
	function Context(func, scope) {
		this.selector = scope && selector(scope);
		this.data = [];
		this._r = [];
		this.isReverted = false;
		this.id = _contextID++;
		func && this.add(func);
	}
	var _proto5 = Context.prototype;
	_proto5.add = function add(name, func, scope) {
		if (_isFunction(name)) {
			scope = func;
			func = name;
			name = _isFunction;
		}
		var self = this, f = function f() {
			var prev = _context, prevSelector = self.selector, result;
			prev && prev !== self && prev.data.push(self);
			scope && (self.selector = selector(scope));
			_context = self;
			result = func.apply(self, arguments);
			_isFunction(result) && self._r.push(result);
			_context = prev;
			self.selector = prevSelector;
			self.isReverted = false;
			return result;
		};
		self.last = f;
		return name === _isFunction ? f(self, function(func) {
			return self.add(null, func);
		}) : name ? self[name] = f : f;
	};
	_proto5.ignore = function ignore(func) {
		var prev = _context;
		_context = null;
		func(this);
		_context = prev;
	};
	_proto5.getTweens = function getTweens() {
		var a = [];
		this.data.forEach(function(e) {
			return e instanceof Context ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
		});
		return a;
	};
	_proto5.clear = function clear() {
		this._r.length = this.data.length = 0;
	};
	_proto5.kill = function kill(revert, matchMedia) {
		var _this4 = this;
		if (revert) (function() {
			var tweens = _this4.getTweens(), i = _this4.data.length, t;
			while (i--) {
				t = _this4.data[i];
				if (t.data === "isFlip") {
					t.revert();
					t.getChildren(true, true, false).forEach(function(tween) {
						return tweens.splice(tweens.indexOf(tween), 1);
					});
				}
			}
			tweens.map(function(t) {
				return {
					g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -Infinity,
					t
				};
			}).sort(function(a, b) {
				return b.g - a.g || -Infinity;
			}).forEach(function(o) {
				return o.t.revert(revert);
			});
			i = _this4.data.length;
			while (i--) {
				t = _this4.data[i];
				if (t instanceof Timeline) {
					if (t.data !== "nested") {
						t.scrollTrigger && t.scrollTrigger.revert();
						t.kill();
					}
				} else !(t instanceof Tween) && t.revert && t.revert(revert);
			}
			_this4._r.forEach(function(f) {
				return f(revert, _this4);
			});
			_this4.isReverted = true;
		})();
		else this.data.forEach(function(e) {
			return e.kill && e.kill();
		});
		this.clear();
		if (matchMedia) {
			var i = _media.length;
			while (i--) _media[i].id === this.id && _media.splice(i, 1);
		}
	};
	_proto5.revert = function revert(config) {
		this.kill(config || {});
	};
	return Context;
}();
var MatchMedia = /*#__PURE__*/ function() {
	function MatchMedia(scope) {
		this.contexts = [];
		this.scope = scope;
		_context && _context.data.push(this);
	}
	var _proto6 = MatchMedia.prototype;
	_proto6.add = function add(conditions, func, scope) {
		_isObject(conditions) || (conditions = { matches: conditions });
		var context = new Context(0, scope || this.scope), cond = context.conditions = {}, mq, p, active;
		_context && !context.selector && (context.selector = _context.selector);
		this.contexts.push(context);
		func = context.add("onMatch", func);
		context.queries = conditions;
		for (p in conditions) if (p === "all") active = 1;
		else {
			mq = _win$1.matchMedia(conditions[p]);
			if (mq) {
				_media.indexOf(context) < 0 && _media.push(context);
				(cond[p] = mq.matches) && (active = 1);
				mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
			}
		}
		active && func(context, function(f) {
			return context.add(null, f);
		});
		return this;
	};
	_proto6.revert = function revert(config) {
		this.kill(config || {});
	};
	_proto6.kill = function kill(revert) {
		this.contexts.forEach(function(c) {
			return c.kill(revert, true);
		});
	};
	return MatchMedia;
}();
var _gsap = {
	registerPlugin: function registerPlugin() {
		for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		args.forEach(function(config) {
			return _createPlugin(config);
		});
	},
	timeline: function timeline(vars) {
		return new Timeline(vars);
	},
	getTweensOf: function getTweensOf(targets, onlyActive) {
		return _globalTimeline.getTweensOf(targets, onlyActive);
	},
	getProperty: function getProperty(target, property, unit, uncache) {
		_isString(target) && (target = toArray(target)[0]);
		var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
		unit === "native" && (unit = "");
		return !target ? target : !property ? function(property, unit, uncache) {
			return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
		} : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
	},
	quickSetter: function quickSetter(target, property, unit) {
		target = toArray(target);
		if (target.length > 1) {
			var setters = target.map(function(t) {
				return gsap.quickSetter(t, property, unit);
			}), l = setters.length;
			return function(value) {
				var i = l;
				while (i--) setters[i](value);
			};
		}
		target = target[0] || {};
		var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
			var p = new Plugin();
			_quickTween._pt = 0;
			p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
			p.render(1, p);
			_quickTween._pt && _renderPropTweens(1, _quickTween);
		} : cache.set(target, p);
		return Plugin ? setter : function(value) {
			return setter(target, p, unit ? value + unit : value, cache, 1);
		};
	},
	quickTo: function quickTo(target, property, vars) {
		var _setDefaults2;
		var tween = gsap.to(target, _setDefaults((_setDefaults2 = {}, _setDefaults2[property] = "+=0.1", _setDefaults2.paused = true, _setDefaults2.stagger = 0, _setDefaults2), vars || {})), func = function func(value, start, startIsRelative) {
			return tween.resetTo(property, value, start, startIsRelative);
		};
		func.tween = tween;
		return func;
	},
	isTweening: function isTweening(targets) {
		return _globalTimeline.getTweensOf(targets, true).length > 0;
	},
	defaults: function defaults(value) {
		value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
		return _mergeDeep(_defaults, value || {});
	},
	config: function config(value) {
		return _mergeDeep(_config, value || {});
	},
	registerEffect: function registerEffect(_ref3) {
		var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
		(plugins || "").split(",").forEach(function(pluginName) {
			return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
		});
		_effects[name] = function(targets, vars, tl) {
			return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
		};
		if (extendTimeline) Timeline.prototype[name] = function(targets, vars, position) {
			return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
		};
	},
	registerEase: function registerEase(name, ease) {
		_easeMap[name] = _parseEase(ease);
	},
	parseEase: function parseEase(ease, defaultEase) {
		return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
	},
	getById: function getById(id) {
		return _globalTimeline.getById(id);
	},
	exportRoot: function exportRoot(vars, includeDelayedCalls) {
		if (vars === void 0) vars = {};
		var tl = new Timeline(vars), child, next;
		tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
		_globalTimeline.remove(tl);
		tl._dp = 0;
		tl._time = tl._tTime = _globalTimeline._time;
		child = _globalTimeline._first;
		while (child) {
			next = child._next;
			if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) _addToTimeline(tl, child, child._start - child._delay);
			child = next;
		}
		_addToTimeline(_globalTimeline, tl, 0);
		return tl;
	},
	context: function context(func, scope) {
		return func ? new Context(func, scope) : _context;
	},
	matchMedia: function matchMedia(scope) {
		return new MatchMedia(scope);
	},
	matchMediaRefresh: function matchMediaRefresh() {
		return _media.forEach(function(c) {
			var cond = c.conditions, found, p;
			for (p in cond) if (cond[p]) {
				cond[p] = false;
				found = 1;
			}
			found && c.revert();
		}) || _onMediaChange();
	},
	addEventListener: function addEventListener(type, callback) {
		var a = _listeners[type] || (_listeners[type] = []);
		~a.indexOf(callback) || a.push(callback);
	},
	removeEventListener: function removeEventListener(type, callback) {
		var a = _listeners[type], i = a && a.indexOf(callback);
		i >= 0 && a.splice(i, 1);
	},
	utils: {
		wrap,
		wrapYoyo,
		distribute,
		random,
		snap,
		normalize,
		getUnit,
		clamp,
		splitColor,
		toArray,
		selector,
		mapRange,
		pipe,
		unitize,
		interpolate,
		shuffle
	},
	install: _install,
	effects: _effects,
	ticker: _ticker,
	updateRoot: Timeline.updateRoot,
	plugins: _plugins,
	globalTimeline: _globalTimeline,
	core: {
		PropTween,
		globals: _addGlobal,
		Tween,
		Timeline,
		Animation,
		getCache: _getCache,
		_removeLinkedListItem,
		reverting: function reverting() {
			return _reverting$1;
		},
		context: function context(toAdd) {
			if (toAdd && _context) {
				_context.data.push(toAdd);
				toAdd._ctx = _context;
			}
			return _context;
		},
		suppressOverwrites: function suppressOverwrites(value) {
			return _suppressOverwrites = value;
		}
	}
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
	return _gsap[name] = Tween[name];
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, { duration: 0 });
var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
	var pt = plugin._pt;
	while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) pt = pt._next;
	return pt;
}, _addModifiers = function _addModifiers(tween, modifiers) {
	var targets = tween._targets, p, i, pt;
	for (p in modifiers) {
		i = targets.length;
		while (i--) {
			pt = tween._ptLookup[i][p];
			if (pt && (pt = pt.d)) {
				if (pt._pt) pt = _getPluginPropTween(pt, p);
				pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
			}
		}
	}
}, _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
	return {
		name,
		headless: 1,
		rawVars: 1,
		init: function init(target, vars, tween) {
			tween._onInit = function(tween) {
				var temp, p;
				if (_isString(vars)) {
					temp = {};
					_forEachName(vars, function(name) {
						return temp[name] = 1;
					});
					vars = temp;
				}
				if (modifier) {
					temp = {};
					for (p in vars) temp[p] = modifier(vars[p]);
					vars = temp;
				}
				_addModifiers(tween, vars);
			};
		}
	};
};
var gsap = _gsap.registerPlugin({
	name: "attr",
	init: function init(target, vars, tween, index, targets) {
		var p, pt, v;
		this.tween = tween;
		for (p in vars) {
			v = target.getAttribute(p) || "";
			pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
			pt.op = p;
			pt.b = v;
			this._props.push(p);
		}
	},
	render: function render(ratio, data) {
		var pt = data._pt;
		while (pt) {
			_reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
			pt = pt._next;
		}
	}
}, {
	name: "endArray",
	headless: 1,
	init: function init(target, value) {
		var i = value.length;
		while (i--) this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
	}
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
Tween.version = Timeline.version = gsap.version = "3.15.0";
_coreReady = 1;
_windowExists$1() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
//#endregion
//#region node_modules/gsap/CSSPlugin.js
/*!
* CSSPlugin 3.15.0
* https://gsap.com
*
* Copyright 2008-2026, GreenSock. All rights reserved.
* Subject to the terms at https://gsap.com/standard-license
* @author: Jack Doyle, jack@greensock.com
*/
var _win, _doc, _docElement, _pluginInitted, _tempDiv, _recentSetterPlugin, _reverting, _windowExists = function _windowExists() {
	return typeof window !== "undefined";
}, _transformProps = {}, _RAD2DEG = 180 / Math.PI, _DEG2RAD = Math.PI / 180, _atan2 = Math.atan2, _bigNum = 1e8, _capsExp = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
	autoAlpha: "opacity,visibility",
	scale: "scaleX,scaleY",
	alpha: "opacity"
}, _renderCSSProp = function _renderCSSProp(ratio, data) {
	return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
	return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
	return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
}, _renderCSSPropWithBeginningAndEnd = function _renderCSSPropWithBeginningAndEnd(ratio, data) {
	return data.set(data.t, data.p, ratio === 1 ? data.e : ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
}, _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
	var value = data.s + data.c * ratio;
	data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
}, _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
	return data.set(data.t, data.p, ratio ? data.e : data.b, data);
}, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
	return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
}, _setterCSSStyle = function _setterCSSStyle(target, property, value) {
	return target.style[property] = value;
}, _setterCSSProp = function _setterCSSProp(target, property, value) {
	return target.style.setProperty(property, value);
}, _setterTransform = function _setterTransform(target, property, value) {
	return target._gsap[property] = value;
}, _setterScale = function _setterScale(target, property, value) {
	return target._gsap.scaleX = target._gsap.scaleY = value;
}, _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
	var cache = target._gsap;
	cache.scaleX = cache.scaleY = value;
	cache.renderTransform(ratio, cache);
}, _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
	var cache = target._gsap;
	cache[property] = value;
	cache.renderTransform(ratio, cache);
}, _transformProp = "transform", _transformOriginProp = _transformProp + "Origin", _saveStyle = function _saveStyle(property, isNotCSS) {
	var _this = this;
	var target = this.target, style = target.style, cache = target._gsap;
	if (property in _transformProps && style) {
		this.tfm = this.tfm || {};
		if (property !== "transform") {
			property = _propertyAliases[property] || property;
			~property.indexOf(",") ? property.split(",").forEach(function(a) {
				return _this.tfm[a] = _get(target, a);
			}) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
			property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
		} else return _propertyAliases.transform.split(",").forEach(function(p) {
			return _saveStyle.call(_this, p, isNotCSS);
		});
		if (this.props.indexOf(_transformProp) >= 0) return;
		if (cache.svg) {
			this.svgo = target.getAttribute("data-svg-origin");
			this.props.push(_transformOriginProp, isNotCSS, "");
		}
		property = _transformProp;
	}
	(style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
}, _removeIndependentTransforms = function _removeIndependentTransforms(style) {
	if (style.translate) {
		style.removeProperty("translate");
		style.removeProperty("scale");
		style.removeProperty("rotate");
	}
}, _revertStyle = function _revertStyle() {
	var props = this.props, target = this.target, style = target.style, cache = target._gsap, i, p;
	for (i = 0; i < props.length; i += 3) if (!props[i + 1]) props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
	else if (props[i + 1] === 2) target[props[i]](props[i + 2]);
	else target[props[i]] = props[i + 2];
	if (this.tfm) {
		for (p in this.tfm) cache[p] = this.tfm[p];
		if (cache.svg) {
			cache.renderTransform();
			target.setAttribute("data-svg-origin", this.svgo || "");
		}
		i = _reverting();
		if ((!i || !i.isStart) && !style[_transformProp]) {
			_removeIndependentTransforms(style);
			if (cache.zOrigin && style[_transformOriginProp]) {
				style[_transformOriginProp] += " " + cache.zOrigin + "px";
				cache.zOrigin = 0;
				cache.renderTransform();
			}
			cache.uncache = 1;
		}
	}
}, _getStyleSaver = function _getStyleSaver(target, properties) {
	var saver = {
		target,
		props: [],
		revert: _revertStyle,
		save: _saveStyle
	};
	target._gsap || gsap.core.getCache(target);
	properties && target.style && target.nodeType && properties.split(",").forEach(function(p) {
		return saver.save(p);
	});
	return saver;
}, _supports3D, _createElement = function _createElement(type, ns) {
	var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type);
	return e && e.style ? e : _doc.createElement(type);
}, _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
	var cs = getComputedStyle(target);
	return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
}, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
	var s = (element || _tempDiv).style, i = 5;
	if (property in s && !preferPrefix) return property;
	property = property.charAt(0).toUpperCase() + property.substr(1);
	while (i-- && !(_prefixes[i] + property in s));
	return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
}, _initCore = function _initCore() {
	if (_windowExists() && window.document) {
		_win = window;
		_doc = _win.document;
		_docElement = _doc.documentElement;
		_tempDiv = _createElement("div") || { style: {} };
		_createElement("div");
		_transformProp = _checkPropPrefix(_transformProp);
		_transformOriginProp = _transformProp + "Origin";
		_tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
		_supports3D = !!_checkPropPrefix("perspective");
		_reverting = gsap.core.reverting;
		_pluginInitted = 1;
	}
}, _getReparentedCloneBBox = function _getReparentedCloneBBox(target) {
	var owner = target.ownerSVGElement, svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone = target.cloneNode(true), bbox;
	clone.style.display = "block";
	svg.appendChild(clone);
	_docElement.appendChild(svg);
	try {
		bbox = clone.getBBox();
	} catch (e) {}
	svg.removeChild(clone);
	_docElement.removeChild(svg);
	return bbox;
}, _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
	var i = attributesArray.length;
	while (i--) if (target.hasAttribute(attributesArray[i])) return target.getAttribute(attributesArray[i]);
}, _getBBox = function _getBBox(target) {
	var bounds, cloned;
	try {
		bounds = target.getBBox();
	} catch (error) {
		bounds = _getReparentedCloneBBox(target);
		cloned = 1;
	}
	bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
	return bounds && !bounds.width && !bounds.x && !bounds.y ? {
		x: +_getAttributeFallbacks(target, [
			"x",
			"cx",
			"x1"
		]) || 0,
		y: +_getAttributeFallbacks(target, [
			"y",
			"cy",
			"y1"
		]) || 0,
		width: 0,
		height: 0
	} : bounds;
}, _isSVG = function _isSVG(e) {
	return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
}, _removeProperty = function _removeProperty(target, property) {
	if (property) {
		var style = target.style, first2Chars;
		if (property in _transformProps && property !== _transformOriginProp) property = _transformProp;
		if (style.removeProperty) {
			first2Chars = property.substr(0, 2);
			if (first2Chars === "ms" || property.substr(0, 6) === "webkit") property = "-" + property;
			style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
		} else style.removeAttribute(property);
	}
}, _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
	var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
	plugin._pt = pt;
	pt.b = beginning;
	pt.e = end;
	plugin._props.push(property);
	return pt;
}, _nonConvertibleUnits = {
	deg: 1,
	rad: 1,
	turn: 1
}, _nonStandardLayouts = {
	grid: 1,
	flex: 1
}, _convertToUnit = function _convertToUnit(target, property, value, unit) {
	var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
	if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) return curValue;
	curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
	isSVG = target.getCTM && _isSVG(target);
	if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
		px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
		return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
	}
	style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
	parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
	if (isSVG) parent = (target.ownerSVGElement || {}).parentNode;
	if (!parent || parent === _doc || !parent.appendChild) parent = _doc.body;
	cache = parent._gsap;
	if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) return _round(curValue / cache.width * amount);
	else {
		if (toPercent && (property === "height" || property === "width")) {
			var v = target.style[property];
			target.style[property] = amount + unit;
			px = target[measureProperty];
			v ? target.style[property] = v : _removeProperty(target, property);
		} else {
			(toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
			parent === target && (style.position = "static");
			parent.appendChild(_tempDiv);
			px = _tempDiv[measureProperty];
			parent.removeChild(_tempDiv);
			style.position = "absolute";
		}
		if (horizontal && toPercent) {
			cache = _getCache(parent);
			cache.time = _ticker.time;
			cache.width = parent[measureProperty];
		}
	}
	return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
}, _get = function _get(target, property, unit, uncache) {
	var value;
	_pluginInitted || _initCore();
	if (property in _propertyAliases && property !== "transform") {
		property = _propertyAliases[property];
		if (~property.indexOf(",")) property = property.split(",")[0];
	}
	if (_transformProps[property] && property !== "transform") {
		value = _parseTransform(target, uncache);
		value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
	} else {
		value = target.style[property];
		if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
	}
	return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
}, _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
	if (!start || start === "none") {
		var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
		if (s && s !== start) {
			prop = p;
			start = s;
		} else if (prop === "borderColor") start = _getComputedProperty(target, "borderTopColor");
	}
	var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
	pt.b = start;
	pt.e = end;
	start += "";
	end += "";
	if (end.substring(0, 6) === "var(--") end = _getComputedProperty(target, end.substring(4, end.indexOf(")")));
	if (end === "auto") {
		startValue = target.style[prop];
		target.style[prop] = end;
		end = _getComputedProperty(target, prop) || end;
		startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
	}
	a = [start, end];
	_colorStringFilter(a);
	start = a[0];
	end = a[1];
	startValues = start.match(_numWithUnitExp) || [];
	endValues = end.match(_numWithUnitExp) || [];
	if (endValues.length) {
		while (result = _numWithUnitExp.exec(end)) {
			endValue = result[0];
			chunk = end.substring(index, result.index);
			if (color) color = (color + 1) % 5;
			else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") color = 1;
			if (endValue !== (startValue = startValues[matchIndex++] || "")) {
				startNum = parseFloat(startValue) || 0;
				startUnit = startValue.substr((startNum + "").length);
				endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
				endNum = parseFloat(endValue);
				endUnit = endValue.substr((endNum + "").length);
				index = _numWithUnitExp.lastIndex - endUnit.length;
				if (!endUnit) {
					endUnit = endUnit || _config.units[prop] || startUnit;
					if (index === end.length) {
						end += endUnit;
						pt.e += endUnit;
					}
				}
				if (startUnit !== endUnit) startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
				pt._pt = {
					_next: pt._pt,
					p: chunk || matchIndex === 1 ? chunk : ",",
					s: startNum,
					c: endNum - startNum,
					m: color && color < 4 || prop === "zIndex" ? Math.round : 0
				};
			}
		}
		pt.c = index < end.length ? end.substring(index, end.length) : "";
	} else pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
	_relExp.test(end) && (pt.e = 0);
	this._pt = pt;
	return pt;
}, _keywordToPercent = {
	top: "0%",
	bottom: "100%",
	left: "0%",
	right: "100%",
	center: "50%"
}, _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
	var split = value.split(" "), x = split[0], y = split[1] || "50%";
	if (x === "top" || x === "bottom" || y === "left" || y === "right") {
		value = x;
		x = y;
		y = value;
	}
	split[0] = _keywordToPercent[x] || x;
	split[1] = _keywordToPercent[y] || y;
	return split.join(" ");
}, _renderClearProps = function _renderClearProps(ratio, data) {
	if (data.tween && data.tween._time === data.tween._dur) {
		var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i;
		if (props === "all" || props === true) {
			style.cssText = "";
			clearTransforms = 1;
		} else {
			props = props.split(",");
			i = props.length;
			while (--i > -1) {
				prop = props[i];
				if (_transformProps[prop]) {
					clearTransforms = 1;
					prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
				}
				_removeProperty(target, prop);
			}
		}
		if (clearTransforms) {
			_removeProperty(target, _transformProp);
			if (cache) {
				cache.svg && target.removeAttribute("transform");
				style.scale = style.rotate = style.translate = "none";
				_parseTransform(target, 1);
				cache.uncache = 1;
				_removeIndependentTransforms(style);
			}
		}
	}
}, _specialProps = { clearProps: function clearProps(plugin, target, property, endValue, tween) {
	if (tween.data !== "isFromStart") {
		var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
		pt.u = endValue;
		pt.pr = -10;
		pt.tween = tween;
		plugin._props.push(property);
		return 1;
	}
} }, _identity2DMatrix = [
	1,
	0,
	0,
	1,
	0,
	0
], _rotationalProperties = {}, _isNullTransform = function _isNullTransform(value) {
	return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
}, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
	var matrixString = _getComputedProperty(target, _transformProp);
	return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
}, _getMatrix = function _getMatrix(target, force2D) {
	var cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
	if (cache.svg && target.getAttribute("transform")) {
		temp = target.transform.baseVal.consolidate().matrix;
		matrix = [
			temp.a,
			temp.b,
			temp.c,
			temp.d,
			temp.e,
			temp.f
		];
		return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
	} else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
		temp = style.display;
		style.display = "block";
		parent = target.parentNode;
		if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
			addedToDOM = 1;
			nextSibling = target.nextElementSibling;
			_docElement.appendChild(target);
		}
		matrix = _getComputedTransformMatrixAsArray(target);
		temp ? style.display = temp : _removeProperty(target, "display");
		if (addedToDOM) nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
	}
	return force2D && matrix.length > 6 ? [
		matrix[0],
		matrix[1],
		matrix[4],
		matrix[5],
		matrix[12],
		matrix[13]
	] : matrix;
}, _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
	var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
	if (!originIsAbsolute) {
		bounds = _getBBox(target);
		xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
		yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
	} else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
		x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
		y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
		xOrigin = x;
		yOrigin = y;
	}
	if (smooth || smooth !== false && cache.smooth) {
		tx = xOrigin - xOriginOld;
		ty = yOrigin - yOriginOld;
		cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
		cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
	} else cache.xOffset = cache.yOffset = 0;
	cache.xOrigin = xOrigin;
	cache.yOrigin = yOrigin;
	cache.smooth = !!smooth;
	cache.origin = origin;
	cache.originIsAbsolute = !!originIsAbsolute;
	target.style[_transformOriginProp] = "0px 0px";
	if (pluginToAddPropTweensTo) {
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
		_addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
	}
	target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
}, _parseTransform = function _parseTransform(target, uncache) {
	var cache = target._gsap || new GSCache(target);
	if ("x" in cache && !uncache && !cache.uncache) return cache;
	var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0, y, z, scaleX = scaleY = 1, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
	cache.svg = !!(target.getCTM && _isSVG(target));
	if (cs.translate) {
		if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
		style.scale = style.rotate = style.translate = "none";
	}
	matrix = _getMatrix(target, cache.svg);
	if (cache.svg) {
		if (cache.uncache) {
			t2 = target.getBBox();
			origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
			t1 = "";
		} else t1 = !uncache && target.getAttribute("data-svg-origin");
		_applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
	}
	xOrigin = cache.xOrigin || 0;
	yOrigin = cache.yOrigin || 0;
	if (matrix !== _identity2DMatrix) {
		a = matrix[0];
		b = matrix[1];
		c = matrix[2];
		d = matrix[3];
		x = a12 = matrix[4];
		y = a22 = matrix[5];
		if (matrix.length === 6) {
			scaleX = Math.sqrt(a * a + b * b);
			scaleY = Math.sqrt(d * d + c * c);
			rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
			skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
			skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
			if (cache.svg) {
				x -= xOrigin - (xOrigin * a + yOrigin * c);
				y -= yOrigin - (xOrigin * b + yOrigin * d);
			}
		} else {
			a32 = matrix[6];
			a42 = matrix[7];
			a13 = matrix[8];
			a23 = matrix[9];
			a33 = matrix[10];
			a43 = matrix[11];
			x = matrix[12];
			y = matrix[13];
			z = matrix[14];
			angle = _atan2(a32, a33);
			rotationX = angle * _RAD2DEG;
			if (angle) {
				cos = Math.cos(-angle);
				sin = Math.sin(-angle);
				t1 = a12 * cos + a13 * sin;
				t2 = a22 * cos + a23 * sin;
				t3 = a32 * cos + a33 * sin;
				a13 = a12 * -sin + a13 * cos;
				a23 = a22 * -sin + a23 * cos;
				a33 = a32 * -sin + a33 * cos;
				a43 = a42 * -sin + a43 * cos;
				a12 = t1;
				a22 = t2;
				a32 = t3;
			}
			angle = _atan2(-c, a33);
			rotationY = angle * _RAD2DEG;
			if (angle) {
				cos = Math.cos(-angle);
				sin = Math.sin(-angle);
				t1 = a * cos - a13 * sin;
				t2 = b * cos - a23 * sin;
				t3 = c * cos - a33 * sin;
				a43 = d * sin + a43 * cos;
				a = t1;
				b = t2;
				c = t3;
			}
			angle = _atan2(b, a);
			rotation = angle * _RAD2DEG;
			if (angle) {
				cos = Math.cos(angle);
				sin = Math.sin(angle);
				t1 = a * cos + b * sin;
				t2 = a12 * cos + a22 * sin;
				b = b * cos - a * sin;
				a22 = a22 * cos - a12 * sin;
				a = t1;
				a12 = t2;
			}
			if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
				rotationX = rotation = 0;
				rotationY = 180 - rotationY;
			}
			scaleX = _round(Math.sqrt(a * a + b * b + c * c));
			scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
			angle = _atan2(a12, a22);
			skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
			perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
		}
		if (cache.svg) {
			t1 = target.getAttribute("transform");
			cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
			t1 && target.setAttribute("transform", t1);
		}
	}
	if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) if (invertedScaleX) {
		scaleX *= -1;
		skewX += rotation <= 0 ? 180 : -180;
		rotation += rotation <= 0 ? 180 : -180;
	} else {
		scaleY *= -1;
		skewX += skewX <= 0 ? 180 : -180;
	}
	uncache = uncache || cache.uncache;
	cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
	cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
	cache.z = z + px;
	cache.scaleX = _round(scaleX);
	cache.scaleY = _round(scaleY);
	cache.rotation = _round(rotation) + deg;
	cache.rotationX = _round(rotationX) + deg;
	cache.rotationY = _round(rotationY) + deg;
	cache.skewX = skewX + deg;
	cache.skewY = skewY + deg;
	cache.transformPerspective = perspective + px;
	if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) style[_transformOriginProp] = _firstTwoOnly(origin);
	cache.xOffset = cache.yOffset = 0;
	cache.force3D = _config.force3D;
	cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
	cache.uncache = 0;
	return cache;
}, _firstTwoOnly = function _firstTwoOnly(value) {
	return (value = value.split(" "))[0] + " " + value[1];
}, _addPxTranslate = function _addPxTranslate(target, start, value) {
	var unit = getUnit(start);
	return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
}, _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
	cache.z = "0px";
	cache.rotationY = cache.rotationX = "0deg";
	cache.force3D = 0;
	_renderCSSTransforms(ratio, cache);
}, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
	var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
	if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
		var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
		angle = parseFloat(rotationX) * _DEG2RAD;
		cos = Math.cos(angle);
		x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
		y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
		z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
	}
	if (transformPerspective !== _zeroPx) transforms += "perspective(" + transformPerspective + _endParenthesis;
	if (xPercent || yPercent) transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
	if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
	if (rotation !== _zeroDeg) transforms += "rotate(" + rotation + _endParenthesis;
	if (rotationY !== _zeroDeg) transforms += "rotateY(" + rotationY + _endParenthesis;
	if (rotationX !== _zeroDeg) transforms += "rotateX(" + rotationX + _endParenthesis;
	if (skewX !== _zeroDeg || skewY !== _zeroDeg) transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
	if (scaleX !== 1 || scaleY !== 1) transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
	target.style[_transformProp] = transforms || "translate(0, 0)";
}, _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
	var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
	rotation = parseFloat(rotation);
	skewX = parseFloat(skewX);
	skewY = parseFloat(skewY);
	if (skewY) {
		skewY = parseFloat(skewY);
		skewX += skewY;
		rotation += skewY;
	}
	if (rotation || skewX) {
		rotation *= _DEG2RAD;
		skewX *= _DEG2RAD;
		a11 = Math.cos(rotation) * scaleX;
		a21 = Math.sin(rotation) * scaleX;
		a12 = Math.sin(rotation - skewX) * -scaleY;
		a22 = Math.cos(rotation - skewX) * scaleY;
		if (skewX) {
			skewY *= _DEG2RAD;
			temp = Math.tan(skewX - skewY);
			temp = Math.sqrt(1 + temp * temp);
			a12 *= temp;
			a22 *= temp;
			if (skewY) {
				temp = Math.tan(skewY);
				temp = Math.sqrt(1 + temp * temp);
				a11 *= temp;
				a21 *= temp;
			}
		}
		a11 = _round(a11);
		a21 = _round(a21);
		a12 = _round(a12);
		a22 = _round(a22);
	} else {
		a11 = scaleX;
		a22 = scaleY;
		a21 = a12 = 0;
	}
	if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
		tx = _convertToUnit(target, "x", x, "px");
		ty = _convertToUnit(target, "y", y, "px");
	}
	if (xOrigin || yOrigin || xOffset || yOffset) {
		tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
		ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
	}
	if (xPercent || yPercent) {
		temp = target.getBBox();
		tx = _round(tx + xPercent / 100 * temp.width);
		ty = _round(ty + yPercent / 100 * temp.height);
	}
	temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
	target.setAttribute("transform", temp);
	forceCSS && (target.style[_transformProp] = temp);
}, _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
	var cap = 360, isString = _isString(endValue), change = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1) - startNum, finalValue = startNum + change + "deg", direction, pt;
	if (isString) {
		direction = endValue.split("_")[1];
		if (direction === "short") {
			change %= cap;
			if (change !== change % (cap / 2)) change += change < 0 ? cap : -cap;
		}
		if (direction === "cw" && change < 0) change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
		else if (direction === "ccw" && change > 0) change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
	}
	plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
	pt.e = finalValue;
	pt.u = "deg";
	plugin._props.push(property);
	return pt;
}, _assign = function _assign(target, source) {
	for (var p in source) target[p] = source[p];
	return target;
}, _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
	var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
	if (startCache.svg) {
		startValue = target.getAttribute("transform");
		target.setAttribute("transform", "");
		style[_transformProp] = transforms;
		endCache = _parseTransform(target, 1);
		_removeProperty(target, _transformProp);
		target.setAttribute("transform", startValue);
	} else {
		startValue = getComputedStyle(target)[_transformProp];
		style[_transformProp] = transforms;
		endCache = _parseTransform(target, 1);
		style[_transformProp] = startValue;
	}
	for (p in _transformProps) {
		startValue = startCache[p];
		endValue = endCache[p];
		if (startValue !== endValue && exclude.indexOf(p) < 0) {
			startUnit = getUnit(startValue);
			endUnit = getUnit(endValue);
			startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
			endNum = parseFloat(endValue);
			plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
			plugin._pt.u = endUnit || 0;
			plugin._props.push(p);
		}
	}
	_assign(endCache, startCache);
};
_forEachName("padding,margin,Width,Radius", function(name, index) {
	var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [
		t,
		r,
		b,
		l
	] : [
		t + l,
		t + r,
		b + r,
		b + l
	]).map(function(side) {
		return index < 2 ? name + side : "border" + side + name;
	});
	_specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
		var a, vars;
		if (arguments.length < 4) {
			a = props.map(function(prop) {
				return _get(plugin, prop, property);
			});
			vars = a.join(" ");
			return vars.split(a[0]).length === 5 ? a[0] : vars;
		}
		a = (endValue + "").split(" ");
		vars = {};
		props.forEach(function(prop, i) {
			return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
		});
		plugin.init(target, vars, tween);
	};
});
var CSSPlugin = {
	name: "css",
	register: _initCore,
	targetTest: function targetTest(target) {
		return target.style && target.nodeType;
	},
	init: function init(target, vars, tween, index, targets) {
		var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps, finalTransformValue;
		_pluginInitted || _initCore();
		this.styles = this.styles || _getStyleSaver(target);
		inlineProps = this.styles.props;
		this.tween = tween;
		for (p in vars) {
			if (p === "autoRound") continue;
			endValue = vars[p];
			if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) continue;
			type = typeof endValue;
			specialProp = _specialProps[p];
			if (type === "function") {
				endValue = endValue.call(tween, index, target, targets);
				type = typeof endValue;
			}
			if (type === "string" && ~endValue.indexOf("random(")) endValue = _replaceRandom(endValue);
			if (specialProp) specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
			else if (p.substr(0, 2) === "--") {
				startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
				endValue += "";
				_colorExp.lastIndex = 0;
				if (!_colorExp.test(startValue)) {
					startUnit = getUnit(startValue);
					endUnit = getUnit(endValue);
					endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
				}
				this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
				props.push(p);
				inlineProps.push(p, 0, style[p]);
			} else if (type !== "undefined") {
				if (startAt && p in startAt) {
					startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
					_isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
					getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
					(startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
				} else startValue = _get(target, p);
				startNum = parseFloat(startValue);
				relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
				relative && (endValue = endValue.substr(2));
				endNum = parseFloat(endValue);
				if (p in _propertyAliases) {
					if (p === "autoAlpha") {
						if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) startNum = 0;
						inlineProps.push("visibility", 0, style.visibility);
						_addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
					}
					if (p !== "scale" && p !== "transform") {
						p = _propertyAliases[p];
						~p.indexOf(",") && (p = p.split(",")[0]);
					}
				}
				isTransformRelated = p in _transformProps;
				if (isTransformRelated) {
					this.styles.save(p);
					finalTransformValue = endValue;
					if (type === "string" && endValue.substring(0, 6) === "var(--") {
						endValue = _getComputedProperty(target, endValue.substring(4, endValue.indexOf(")")));
						if (endValue.substring(0, 5) === "calc(") {
							var origPerspective = target.style.perspective;
							target.style.perspective = endValue;
							endValue = _getComputedProperty(target, "perspective");
							origPerspective ? target.style.perspective = origPerspective : _removeProperty(target, "perspective");
						}
						endNum = parseFloat(endValue);
					}
					if (!transformPropTween) {
						cache = target._gsap;
						cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
						smooth = vars.smoothOrigin !== false && cache.smooth;
						transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
						transformPropTween.dep = 1;
					}
					if (p === "scale") {
						this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
						this._pt.u = 0;
						props.push("scaleY", p);
						p += "X";
					} else if (p === "transformOrigin") {
						inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
						endValue = _convertKeywordsToPercentages(endValue);
						if (cache.svg) _applySVGOrigin(target, endValue, 0, smooth, 0, this);
						else {
							endUnit = parseFloat(endValue.split(" ")[2]) || 0;
							endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
							_addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
						}
						continue;
					} else if (p === "svgOrigin") {
						_applySVGOrigin(target, endValue, 1, smooth, 0, this);
						continue;
					} else if (p in _rotationalProperties) {
						_addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
						continue;
					} else if (p === "smoothOrigin") {
						_addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
						continue;
					} else if (p === "force3D") {
						cache[p] = endValue;
						continue;
					} else if (p === "transform") {
						_addRawTransformPTs(this, endValue, target);
						continue;
					}
				} else if (!(p in style)) p = _checkPropPrefix(p) || p;
				if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
					startUnit = (startValue + "").substr((startNum + "").length);
					endNum || (endNum = 0);
					endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
					startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
					this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
					this._pt.u = endUnit || 0;
					if (isTransformRelated && finalTransformValue !== endValue) {
						this._pt.b = startValue;
						this._pt.e = finalTransformValue;
						this._pt.r = _renderCSSPropWithBeginningAndEnd;
					} else if (startUnit !== endUnit && endUnit !== "%") {
						this._pt.b = startValue;
						this._pt.r = _renderCSSPropWithBeginning;
					}
				} else if (!(p in style)) {
					if (p in target) this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
					else if (p !== "parseTransform") {
						_missingPlugin(p, endValue);
						continue;
					}
				} else _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
				isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
				props.push(p);
			}
		}
		hasPriority && _sortPropTweensByPriority(this);
	},
	render: function render(ratio, data) {
		if (data.tween._time || !_reverting()) {
			var pt = data._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
		} else data.styles.revert();
	},
	get: _get,
	aliases: _propertyAliases,
	getSetter: function getSetter(target, property, plugin) {
		var p = _propertyAliases[property];
		p && p.indexOf(",") < 0 && (property = p);
		return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
	},
	core: {
		_removeProperty,
		_getMatrix
	}
};
gsap.utils.checkPrefix = _checkPropPrefix;
gsap.core.getStyleSaver = _getStyleSaver;
(function(positionAndScale, rotation, others, aliases) {
	var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
		_transformProps[name] = 1;
	});
	_forEachName(rotation, function(name) {
		_config.units[name] = "deg";
		_rotationalProperties[name] = 1;
	});
	_propertyAliases[all[13]] = positionAndScale + "," + rotation;
	_forEachName(aliases, function(name) {
		var split = name.split(":");
		_propertyAliases[split[1]] = all[split[0]];
	});
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
_forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
	_config.units[name] = "px";
});
gsap.registerPlugin(CSSPlugin);
//#endregion
//#region node_modules/gsap/index.js
var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
gsapWithCSS.core.Tween;
/*!
* matter-js 0.20.0 by @liabru
* http://brm.io/matter-js/
* License MIT
* 
* The MIT License (MIT)
* 
* Copyright (c) Liam Brummitt and contributors.
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
//#endregion
//#region script.js
var import_matter = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function webpackUniversalModuleDefinition(root, factory) {
		if (typeof exports === "object" && typeof module === "object") module.exports = factory();
		else if (typeof define === "function" && define.amd) define("Matter", [], factory);
		else if (typeof exports === "object") exports["Matter"] = factory();
		else root["Matter"] = factory();
	})(exports, function() {
		return (function(modules) {
			var installedModules = {};
			function __webpack_require__(moduleId) {
				if (installedModules[moduleId]) return installedModules[moduleId].exports;
				var module$1 = installedModules[moduleId] = {
					i: moduleId,
					l: false,
					exports: {}
				};
				modules[moduleId].call(module$1.exports, module$1, module$1.exports, __webpack_require__);
				module$1.l = true;
				return module$1.exports;
			}
			__webpack_require__.m = modules;
			__webpack_require__.c = installedModules;
			__webpack_require__.d = function(exports$1, name, getter) {
				if (!__webpack_require__.o(exports$1, name)) Object.defineProperty(exports$1, name, {
					enumerable: true,
					get: getter
				});
			};
			__webpack_require__.r = function(exports$2) {
				if (typeof Symbol !== "undefined" && Symbol.toStringTag) Object.defineProperty(exports$2, Symbol.toStringTag, { value: "Module" });
				Object.defineProperty(exports$2, "__esModule", { value: true });
			};
			__webpack_require__.t = function(value, mode) {
				if (mode & 1) value = __webpack_require__(value);
				if (mode & 8) return value;
				if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
				var ns = Object.create(null);
				__webpack_require__.r(ns);
				Object.defineProperty(ns, "default", {
					enumerable: true,
					value
				});
				if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
					return value[key];
				}.bind(null, key));
				return ns;
			};
			__webpack_require__.n = function(module$2) {
				var getter = module$2 && module$2.__esModule ? function getDefault() {
					return module$2["default"];
				} : function getModuleExports() {
					return module$2;
				};
				__webpack_require__.d(getter, "a", getter);
				return getter;
			};
			__webpack_require__.o = function(object, property) {
				return Object.prototype.hasOwnProperty.call(object, property);
			};
			__webpack_require__.p = "";
			return __webpack_require__(__webpack_require__.s = 20);
		})([
			(function(module$3, exports$3) {
				/**
				* The `Matter.Common` module contains utility functions that are common to all modules.
				*
				* @class Common
				*/
				var Common = {};
				module$3.exports = Common;
				(function() {
					Common._baseDelta = 1e3 / 60;
					Common._nextId = 0;
					Common._seed = 0;
					Common._nowStartTime = +/* @__PURE__ */ new Date();
					Common._warnedOnce = {};
					Common._decomp = null;
					/**
					* Extends the object in the first argument using the object in the second argument.
					* @method extend
					* @param {} obj
					* @param {boolean} deep
					* @return {} obj extended
					*/
					Common.extend = function(obj, deep) {
						var argsStart, deepClone;
						if (typeof deep === "boolean") {
							argsStart = 2;
							deepClone = deep;
						} else {
							argsStart = 1;
							deepClone = true;
						}
						for (var i = argsStart; i < arguments.length; i++) {
							var source = arguments[i];
							if (source) for (var prop in source) if (deepClone && source[prop] && source[prop].constructor === Object) if (!obj[prop] || obj[prop].constructor === Object) {
								obj[prop] = obj[prop] || {};
								Common.extend(obj[prop], deepClone, source[prop]);
							} else obj[prop] = source[prop];
							else obj[prop] = source[prop];
						}
						return obj;
					};
					/**
					* Creates a new clone of the object, if deep is true references will also be cloned.
					* @method clone
					* @param {} obj
					* @param {bool} deep
					* @return {} obj cloned
					*/
					Common.clone = function(obj, deep) {
						return Common.extend({}, deep, obj);
					};
					/**
					* Returns the list of keys for the given object.
					* @method keys
					* @param {} obj
					* @return {string[]} keys
					*/
					Common.keys = function(obj) {
						if (Object.keys) return Object.keys(obj);
						var keys = [];
						for (var key in obj) keys.push(key);
						return keys;
					};
					/**
					* Returns the list of values for the given object.
					* @method values
					* @param {} obj
					* @return {array} Array of the objects property values
					*/
					Common.values = function(obj) {
						var values = [];
						if (Object.keys) {
							var keys = Object.keys(obj);
							for (var i = 0; i < keys.length; i++) values.push(obj[keys[i]]);
							return values;
						}
						for (var key in obj) values.push(obj[key]);
						return values;
					};
					/**
					* Gets a value from `base` relative to the `path` string.
					* @method get
					* @param {} obj The base object
					* @param {string} path The path relative to `base`, e.g. 'Foo.Bar.baz'
					* @param {number} [begin] Path slice begin
					* @param {number} [end] Path slice end
					* @return {} The object at the given path
					*/
					Common.get = function(obj, path, begin, end) {
						path = path.split(".").slice(begin, end);
						for (var i = 0; i < path.length; i += 1) obj = obj[path[i]];
						return obj;
					};
					/**
					* Sets a value on `base` relative to the given `path` string.
					* @method set
					* @param {} obj The base object
					* @param {string} path The path relative to `base`, e.g. 'Foo.Bar.baz'
					* @param {} val The value to set
					* @param {number} [begin] Path slice begin
					* @param {number} [end] Path slice end
					* @return {} Pass through `val` for chaining
					*/
					Common.set = function(obj, path, val, begin, end) {
						var parts = path.split(".").slice(begin, end);
						Common.get(obj, path, 0, -1)[parts[parts.length - 1]] = val;
						return val;
					};
					/**
					* Shuffles the given array in-place.
					* The function uses a seeded random generator.
					* @method shuffle
					* @param {array} array
					* @return {array} array shuffled randomly
					*/
					Common.shuffle = function(array) {
						for (var i = array.length - 1; i > 0; i--) {
							var j = Math.floor(Common.random() * (i + 1));
							var temp = array[i];
							array[i] = array[j];
							array[j] = temp;
						}
						return array;
					};
					/**
					* Randomly chooses a value from a list with equal probability.
					* The function uses a seeded random generator.
					* @method choose
					* @param {array} choices
					* @return {object} A random choice object from the array
					*/
					Common.choose = function(choices) {
						return choices[Math.floor(Common.random() * choices.length)];
					};
					/**
					* Returns true if the object is a HTMLElement, otherwise false.
					* @method isElement
					* @param {object} obj
					* @return {boolean} True if the object is a HTMLElement, otherwise false
					*/
					Common.isElement = function(obj) {
						if (typeof HTMLElement !== "undefined") return obj instanceof HTMLElement;
						return !!(obj && obj.nodeType && obj.nodeName);
					};
					/**
					* Returns true if the object is an array.
					* @method isArray
					* @param {object} obj
					* @return {boolean} True if the object is an array, otherwise false
					*/
					Common.isArray = function(obj) {
						return Object.prototype.toString.call(obj) === "[object Array]";
					};
					/**
					* Returns true if the object is a function.
					* @method isFunction
					* @param {object} obj
					* @return {boolean} True if the object is a function, otherwise false
					*/
					Common.isFunction = function(obj) {
						return typeof obj === "function";
					};
					/**
					* Returns true if the object is a plain object.
					* @method isPlainObject
					* @param {object} obj
					* @return {boolean} True if the object is a plain object, otherwise false
					*/
					Common.isPlainObject = function(obj) {
						return typeof obj === "object" && obj.constructor === Object;
					};
					/**
					* Returns true if the object is a string.
					* @method isString
					* @param {object} obj
					* @return {boolean} True if the object is a string, otherwise false
					*/
					Common.isString = function(obj) {
						return toString.call(obj) === "[object String]";
					};
					/**
					* Returns the given value clamped between a minimum and maximum value.
					* @method clamp
					* @param {number} value
					* @param {number} min
					* @param {number} max
					* @return {number} The value clamped between min and max inclusive
					*/
					Common.clamp = function(value, min, max) {
						if (value < min) return min;
						if (value > max) return max;
						return value;
					};
					/**
					* Returns the sign of the given value.
					* @method sign
					* @param {number} value
					* @return {number} -1 if negative, +1 if 0 or positive
					*/
					Common.sign = function(value) {
						return value < 0 ? -1 : 1;
					};
					/**
					* Returns the current timestamp since the time origin (e.g. from page load).
					* The result is in milliseconds and will use high-resolution timing if available.
					* @method now
					* @return {number} the current timestamp in milliseconds
					*/
					Common.now = function() {
						if (typeof window !== "undefined" && window.performance) {
							if (window.performance.now) return window.performance.now();
							else if (window.performance.webkitNow) return window.performance.webkitNow();
						}
						if (Date.now) return Date.now();
						return /* @__PURE__ */ new Date() - Common._nowStartTime;
					};
					/**
					* Returns a random value between a minimum and a maximum value inclusive.
					* The function uses a seeded random generator.
					* @method random
					* @param {number} min
					* @param {number} max
					* @return {number} A random number between min and max inclusive
					*/
					Common.random = function(min, max) {
						min = typeof min !== "undefined" ? min : 0;
						max = typeof max !== "undefined" ? max : 1;
						return min + _seededRandom() * (max - min);
					};
					var _seededRandom = function() {
						Common._seed = (Common._seed * 9301 + 49297) % 233280;
						return Common._seed / 233280;
					};
					/**
					* Converts a CSS hex colour string into an integer.
					* @method colorToNumber
					* @param {string} colorString
					* @return {number} An integer representing the CSS hex string
					*/
					Common.colorToNumber = function(colorString) {
						colorString = colorString.replace("#", "");
						if (colorString.length == 3) colorString = colorString.charAt(0) + colorString.charAt(0) + colorString.charAt(1) + colorString.charAt(1) + colorString.charAt(2) + colorString.charAt(2);
						return parseInt(colorString, 16);
					};
					/**
					* The console logging level to use, where each level includes all levels above and excludes the levels below.
					* The default level is 'debug' which shows all console messages.  
					*
					* Possible level values are:
					* - 0 = None
					* - 1 = Debug
					* - 2 = Info
					* - 3 = Warn
					* - 4 = Error
					* @static
					* @property logLevel
					* @type {Number}
					* @default 1
					*/
					Common.logLevel = 1;
					/**
					* Shows a `console.log` message only if the current `Common.logLevel` allows it.
					* The message will be prefixed with 'matter-js' to make it easily identifiable.
					* @method log
					* @param ...objs {} The objects to log.
					*/
					Common.log = function() {
						if (console && Common.logLevel > 0 && Common.logLevel <= 3) console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
					};
					/**
					* Shows a `console.info` message only if the current `Common.logLevel` allows it.
					* The message will be prefixed with 'matter-js' to make it easily identifiable.
					* @method info
					* @param ...objs {} The objects to log.
					*/
					Common.info = function() {
						if (console && Common.logLevel > 0 && Common.logLevel <= 2) console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
					};
					/**
					* Shows a `console.warn` message only if the current `Common.logLevel` allows it.
					* The message will be prefixed with 'matter-js' to make it easily identifiable.
					* @method warn
					* @param ...objs {} The objects to log.
					*/
					Common.warn = function() {
						if (console && Common.logLevel > 0 && Common.logLevel <= 3) console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
					};
					/**
					* Uses `Common.warn` to log the given message one time only.
					* @method warnOnce
					* @param ...objs {} The objects to log.
					*/
					Common.warnOnce = function() {
						var message = Array.prototype.slice.call(arguments).join(" ");
						if (!Common._warnedOnce[message]) {
							Common.warn(message);
							Common._warnedOnce[message] = true;
						}
					};
					/**
					* Shows a deprecated console warning when the function on the given object is called.
					* The target function will be replaced with a new function that first shows the warning
					* and then calls the original function.
					* @method deprecated
					* @param {object} obj The object or module
					* @param {string} name The property name of the function on obj
					* @param {string} warning The one-time message to show if the function is called
					*/
					Common.deprecated = function(obj, prop, warning) {
						obj[prop] = Common.chain(function() {
							Common.warnOnce("🔅 deprecated 🔅", warning);
						}, obj[prop]);
					};
					/**
					* Returns the next unique sequential ID.
					* @method nextId
					* @return {Number} Unique sequential ID
					*/
					Common.nextId = function() {
						return Common._nextId++;
					};
					/**
					* A cross browser compatible indexOf implementation.
					* @method indexOf
					* @param {array} haystack
					* @param {object} needle
					* @return {number} The position of needle in haystack, otherwise -1.
					*/
					Common.indexOf = function(haystack, needle) {
						if (haystack.indexOf) return haystack.indexOf(needle);
						for (var i = 0; i < haystack.length; i++) if (haystack[i] === needle) return i;
						return -1;
					};
					/**
					* A cross browser compatible array map implementation.
					* @method map
					* @param {array} list
					* @param {function} func
					* @return {array} Values from list transformed by func.
					*/
					Common.map = function(list, func) {
						if (list.map) return list.map(func);
						var mapped = [];
						for (var i = 0; i < list.length; i += 1) mapped.push(func(list[i]));
						return mapped;
					};
					/**
					* Takes a directed graph and returns the partially ordered set of vertices in topological order.
					* Circular dependencies are allowed.
					* @method topologicalSort
					* @param {object} graph
					* @return {array} Partially ordered set of vertices in topological order.
					*/
					Common.topologicalSort = function(graph) {
						var result = [], visited = [], temp = [];
						for (var node in graph) if (!visited[node] && !temp[node]) Common._topologicalSort(node, visited, temp, graph, result);
						return result;
					};
					Common._topologicalSort = function(node, visited, temp, graph, result) {
						var neighbors = graph[node] || [];
						temp[node] = true;
						for (var i = 0; i < neighbors.length; i += 1) {
							var neighbor = neighbors[i];
							if (temp[neighbor]) continue;
							if (!visited[neighbor]) Common._topologicalSort(neighbor, visited, temp, graph, result);
						}
						temp[node] = false;
						visited[node] = true;
						result.push(node);
					};
					/**
					* Takes _n_ functions as arguments and returns a new function that calls them in order.
					* The arguments applied when calling the new function will also be applied to every function passed.
					* The value of `this` refers to the last value returned in the chain that was not `undefined`.
					* Therefore if a passed function does not return a value, the previously returned value is maintained.
					* After all passed functions have been called the new function returns the last returned value (if any).
					* If any of the passed functions are a chain, then the chain will be flattened.
					* @method chain
					* @param ...funcs {function} The functions to chain.
					* @return {function} A new function that calls the passed functions in order.
					*/
					Common.chain = function() {
						var funcs = [];
						for (var i = 0; i < arguments.length; i += 1) {
							var func = arguments[i];
							if (func._chained) funcs.push.apply(funcs, func._chained);
							else funcs.push(func);
						}
						var chain = function() {
							var lastResult, args = new Array(arguments.length);
							for (var i = 0, l = arguments.length; i < l; i++) args[i] = arguments[i];
							for (i = 0; i < funcs.length; i += 1) {
								var result = funcs[i].apply(lastResult, args);
								if (typeof result !== "undefined") lastResult = result;
							}
							return lastResult;
						};
						chain._chained = funcs;
						return chain;
					};
					/**
					* Chains a function to excute before the original function on the given `path` relative to `base`.
					* See also docs for `Common.chain`.
					* @method chainPathBefore
					* @param {} base The base object
					* @param {string} path The path relative to `base`
					* @param {function} func The function to chain before the original
					* @return {function} The chained function that replaced the original
					*/
					Common.chainPathBefore = function(base, path, func) {
						return Common.set(base, path, Common.chain(func, Common.get(base, path)));
					};
					/**
					* Chains a function to excute after the original function on the given `path` relative to `base`.
					* See also docs for `Common.chain`.
					* @method chainPathAfter
					* @param {} base The base object
					* @param {string} path The path relative to `base`
					* @param {function} func The function to chain after the original
					* @return {function} The chained function that replaced the original
					*/
					Common.chainPathAfter = function(base, path, func) {
						return Common.set(base, path, Common.chain(Common.get(base, path), func));
					};
					/**
					* Provide the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module to enable
					* concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`.
					* @method setDecomp
					* @param {} decomp The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module.
					*/
					Common.setDecomp = function(decomp) {
						Common._decomp = decomp;
					};
					/**
					* Returns the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module provided through `Common.setDecomp`,
					* otherwise returns the global `decomp` if set.
					* @method getDecomp
					* @return {} The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module if provided.
					*/
					Common.getDecomp = function() {
						var decomp = Common._decomp;
						try {
							if (!decomp && typeof window !== "undefined") decomp = window.decomp;
							if (!decomp && typeof global !== "undefined") decomp = global.decomp;
						} catch (e) {
							decomp = null;
						}
						return decomp;
					};
				})();
			}),
			(function(module$4, exports$4) {
				/**
				* The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
				*
				* @class Bounds
				*/
				var Bounds = {};
				module$4.exports = Bounds;
				(function() {
					/**
					* Creates a new axis-aligned bounding box (AABB) for the given vertices.
					* @method create
					* @param {vertices} vertices
					* @return {bounds} A new bounds object
					*/
					Bounds.create = function(vertices) {
						var bounds = {
							min: {
								x: 0,
								y: 0
							},
							max: {
								x: 0,
								y: 0
							}
						};
						if (vertices) Bounds.update(bounds, vertices);
						return bounds;
					};
					/**
					* Updates bounds using the given vertices and extends the bounds given a velocity.
					* @method update
					* @param {bounds} bounds
					* @param {vertices} vertices
					* @param {vector} velocity
					*/
					Bounds.update = function(bounds, vertices, velocity) {
						bounds.min.x = Infinity;
						bounds.max.x = -Infinity;
						bounds.min.y = Infinity;
						bounds.max.y = -Infinity;
						for (var i = 0; i < vertices.length; i++) {
							var vertex = vertices[i];
							if (vertex.x > bounds.max.x) bounds.max.x = vertex.x;
							if (vertex.x < bounds.min.x) bounds.min.x = vertex.x;
							if (vertex.y > bounds.max.y) bounds.max.y = vertex.y;
							if (vertex.y < bounds.min.y) bounds.min.y = vertex.y;
						}
						if (velocity) {
							if (velocity.x > 0) bounds.max.x += velocity.x;
							else bounds.min.x += velocity.x;
							if (velocity.y > 0) bounds.max.y += velocity.y;
							else bounds.min.y += velocity.y;
						}
					};
					/**
					* Returns true if the bounds contains the given point.
					* @method contains
					* @param {bounds} bounds
					* @param {vector} point
					* @return {boolean} True if the bounds contain the point, otherwise false
					*/
					Bounds.contains = function(bounds, point) {
						return point.x >= bounds.min.x && point.x <= bounds.max.x && point.y >= bounds.min.y && point.y <= bounds.max.y;
					};
					/**
					* Returns true if the two bounds intersect.
					* @method overlaps
					* @param {bounds} boundsA
					* @param {bounds} boundsB
					* @return {boolean} True if the bounds overlap, otherwise false
					*/
					Bounds.overlaps = function(boundsA, boundsB) {
						return boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y;
					};
					/**
					* Translates the bounds by the given vector.
					* @method translate
					* @param {bounds} bounds
					* @param {vector} vector
					*/
					Bounds.translate = function(bounds, vector) {
						bounds.min.x += vector.x;
						bounds.max.x += vector.x;
						bounds.min.y += vector.y;
						bounds.max.y += vector.y;
					};
					/**
					* Shifts the bounds to the given position.
					* @method shift
					* @param {bounds} bounds
					* @param {vector} position
					*/
					Bounds.shift = function(bounds, position) {
						var deltaX = bounds.max.x - bounds.min.x, deltaY = bounds.max.y - bounds.min.y;
						bounds.min.x = position.x;
						bounds.max.x = position.x + deltaX;
						bounds.min.y = position.y;
						bounds.max.y = position.y + deltaY;
					};
				})();
			}),
			(function(module$5, exports$5) {
				/**
				* The `Matter.Vector` module contains methods for creating and manipulating vectors.
				* Vectors are the basis of all the geometry related operations in the engine.
				* A `Matter.Vector` object is of the form `{ x: 0, y: 0 }`.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Vector
				*/
				var Vector = {};
				module$5.exports = Vector;
				(function() {
					/**
					* Creates a new vector.
					* @method create
					* @param {number} x
					* @param {number} y
					* @return {vector} A new vector
					*/
					Vector.create = function(x, y) {
						return {
							x: x || 0,
							y: y || 0
						};
					};
					/**
					* Returns a new vector with `x` and `y` copied from the given `vector`.
					* @method clone
					* @param {vector} vector
					* @return {vector} A new cloned vector
					*/
					Vector.clone = function(vector) {
						return {
							x: vector.x,
							y: vector.y
						};
					};
					/**
					* Returns the magnitude (length) of a vector.
					* @method magnitude
					* @param {vector} vector
					* @return {number} The magnitude of the vector
					*/
					Vector.magnitude = function(vector) {
						return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
					};
					/**
					* Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
					* @method magnitudeSquared
					* @param {vector} vector
					* @return {number} The squared magnitude of the vector
					*/
					Vector.magnitudeSquared = function(vector) {
						return vector.x * vector.x + vector.y * vector.y;
					};
					/**
					* Rotates the vector about (0, 0) by specified angle.
					* @method rotate
					* @param {vector} vector
					* @param {number} angle
					* @param {vector} [output]
					* @return {vector} The vector rotated about (0, 0)
					*/
					Vector.rotate = function(vector, angle, output) {
						var cos = Math.cos(angle), sin = Math.sin(angle);
						if (!output) output = {};
						var x = vector.x * cos - vector.y * sin;
						output.y = vector.x * sin + vector.y * cos;
						output.x = x;
						return output;
					};
					/**
					* Rotates the vector about a specified point by specified angle.
					* @method rotateAbout
					* @param {vector} vector
					* @param {number} angle
					* @param {vector} point
					* @param {vector} [output]
					* @return {vector} A new vector rotated about the point
					*/
					Vector.rotateAbout = function(vector, angle, point, output) {
						var cos = Math.cos(angle), sin = Math.sin(angle);
						if (!output) output = {};
						var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
						output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
						output.x = x;
						return output;
					};
					/**
					* Normalises a vector (such that its magnitude is `1`).
					* @method normalise
					* @param {vector} vector
					* @return {vector} A new vector normalised
					*/
					Vector.normalise = function(vector) {
						var magnitude = Vector.magnitude(vector);
						if (magnitude === 0) return {
							x: 0,
							y: 0
						};
						return {
							x: vector.x / magnitude,
							y: vector.y / magnitude
						};
					};
					/**
					* Returns the dot-product of two vectors.
					* @method dot
					* @param {vector} vectorA
					* @param {vector} vectorB
					* @return {number} The dot product of the two vectors
					*/
					Vector.dot = function(vectorA, vectorB) {
						return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
					};
					/**
					* Returns the cross-product of two vectors.
					* @method cross
					* @param {vector} vectorA
					* @param {vector} vectorB
					* @return {number} The cross product of the two vectors
					*/
					Vector.cross = function(vectorA, vectorB) {
						return vectorA.x * vectorB.y - vectorA.y * vectorB.x;
					};
					/**
					* Returns the cross-product of three vectors.
					* @method cross3
					* @param {vector} vectorA
					* @param {vector} vectorB
					* @param {vector} vectorC
					* @return {number} The cross product of the three vectors
					*/
					Vector.cross3 = function(vectorA, vectorB, vectorC) {
						return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
					};
					/**
					* Adds the two vectors.
					* @method add
					* @param {vector} vectorA
					* @param {vector} vectorB
					* @param {vector} [output]
					* @return {vector} A new vector of vectorA and vectorB added
					*/
					Vector.add = function(vectorA, vectorB, output) {
						if (!output) output = {};
						output.x = vectorA.x + vectorB.x;
						output.y = vectorA.y + vectorB.y;
						return output;
					};
					/**
					* Subtracts the two vectors.
					* @method sub
					* @param {vector} vectorA
					* @param {vector} vectorB
					* @param {vector} [output]
					* @return {vector} A new vector of vectorA and vectorB subtracted
					*/
					Vector.sub = function(vectorA, vectorB, output) {
						if (!output) output = {};
						output.x = vectorA.x - vectorB.x;
						output.y = vectorA.y - vectorB.y;
						return output;
					};
					/**
					* Multiplies a vector and a scalar.
					* @method mult
					* @param {vector} vector
					* @param {number} scalar
					* @return {vector} A new vector multiplied by scalar
					*/
					Vector.mult = function(vector, scalar) {
						return {
							x: vector.x * scalar,
							y: vector.y * scalar
						};
					};
					/**
					* Divides a vector and a scalar.
					* @method div
					* @param {vector} vector
					* @param {number} scalar
					* @return {vector} A new vector divided by scalar
					*/
					Vector.div = function(vector, scalar) {
						return {
							x: vector.x / scalar,
							y: vector.y / scalar
						};
					};
					/**
					* Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
					* @method perp
					* @param {vector} vector
					* @param {bool} [negate=false]
					* @return {vector} The perpendicular vector
					*/
					Vector.perp = function(vector, negate) {
						negate = negate === true ? -1 : 1;
						return {
							x: negate * -vector.y,
							y: negate * vector.x
						};
					};
					/**
					* Negates both components of a vector such that it points in the opposite direction.
					* @method neg
					* @param {vector} vector
					* @return {vector} The negated vector
					*/
					Vector.neg = function(vector) {
						return {
							x: -vector.x,
							y: -vector.y
						};
					};
					/**
					* Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
					* @method angle
					* @param {vector} vectorA
					* @param {vector} vectorB
					* @return {number} The angle in radians
					*/
					Vector.angle = function(vectorA, vectorB) {
						return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
					};
					/**
					* Temporary vector pool (not thread-safe).
					* @property _temp
					* @type {vector[]}
					* @private
					*/
					Vector._temp = [
						Vector.create(),
						Vector.create(),
						Vector.create(),
						Vector.create(),
						Vector.create(),
						Vector.create()
					];
				})();
			}),
			(function(module$6, exports$6, __webpack_require__) {
				/**
				* The `Matter.Vertices` module contains methods for creating and manipulating sets of vertices.
				* A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
				* A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Vertices
				*/
				var Vertices = {};
				module$6.exports = Vertices;
				var Vector = __webpack_require__(2);
				var Common = __webpack_require__(0);
				(function() {
					/**
					* Creates a new set of `Matter.Body` compatible vertices.
					* The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
					*
					*     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
					*
					* The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
					* but with some additional references required for efficient collision detection routines.
					*
					* Vertices must be specified in clockwise order.
					*
					* Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
					*
					* @method create
					* @param {vector[]} points
					* @param {body} body
					*/
					Vertices.create = function(points, body) {
						var vertices = [];
						for (var i = 0; i < points.length; i++) {
							var point = points[i], vertex = {
								x: point.x,
								y: point.y,
								index: i,
								body,
								isInternal: false
							};
							vertices.push(vertex);
						}
						return vertices;
					};
					/**
					* Parses a string containing ordered x y pairs separated by spaces (and optionally commas), 
					* into a `Matter.Vertices` object for the given `Matter.Body`.
					* For parsing SVG paths, see `Svg.pathToVertices`.
					* @method fromPath
					* @param {string} path
					* @param {body} body
					* @return {vertices} vertices
					*/
					Vertices.fromPath = function(path, body) {
						var pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi, points = [];
						path.replace(pathPattern, function(match, x, y) {
							points.push({
								x: parseFloat(x),
								y: parseFloat(y)
							});
						});
						return Vertices.create(points, body);
					};
					/**
					* Returns the centre (centroid) of the set of vertices.
					* @method centre
					* @param {vertices} vertices
					* @return {vector} The centre point
					*/
					Vertices.centre = function(vertices) {
						var area = Vertices.area(vertices, true), centre = {
							x: 0,
							y: 0
						}, cross, temp, j;
						for (var i = 0; i < vertices.length; i++) {
							j = (i + 1) % vertices.length;
							cross = Vector.cross(vertices[i], vertices[j]);
							temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
							centre = Vector.add(centre, temp);
						}
						return Vector.div(centre, 6 * area);
					};
					/**
					* Returns the average (mean) of the set of vertices.
					* @method mean
					* @param {vertices} vertices
					* @return {vector} The average point
					*/
					Vertices.mean = function(vertices) {
						var average = {
							x: 0,
							y: 0
						};
						for (var i = 0; i < vertices.length; i++) {
							average.x += vertices[i].x;
							average.y += vertices[i].y;
						}
						return Vector.div(average, vertices.length);
					};
					/**
					* Returns the area of the set of vertices.
					* @method area
					* @param {vertices} vertices
					* @param {bool} signed
					* @return {number} The area
					*/
					Vertices.area = function(vertices, signed) {
						var area = 0, j = vertices.length - 1;
						for (var i = 0; i < vertices.length; i++) {
							area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
							j = i;
						}
						if (signed) return area / 2;
						return Math.abs(area) / 2;
					};
					/**
					* Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
					* @method inertia
					* @param {vertices} vertices
					* @param {number} mass
					* @return {number} The polygon's moment of inertia
					*/
					Vertices.inertia = function(vertices, mass) {
						var numerator = 0, denominator = 0, v = vertices, cross, j;
						for (var n = 0; n < v.length; n++) {
							j = (n + 1) % v.length;
							cross = Math.abs(Vector.cross(v[j], v[n]));
							numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
							denominator += cross;
						}
						return mass / 6 * (numerator / denominator);
					};
					/**
					* Translates the set of vertices in-place.
					* @method translate
					* @param {vertices} vertices
					* @param {vector} vector
					* @param {number} scalar
					*/
					Vertices.translate = function(vertices, vector, scalar) {
						scalar = typeof scalar !== "undefined" ? scalar : 1;
						var verticesLength = vertices.length, translateX = vector.x * scalar, translateY = vector.y * scalar, i;
						for (i = 0; i < verticesLength; i++) {
							vertices[i].x += translateX;
							vertices[i].y += translateY;
						}
						return vertices;
					};
					/**
					* Rotates the set of vertices in-place.
					* @method rotate
					* @param {vertices} vertices
					* @param {number} angle
					* @param {vector} point
					*/
					Vertices.rotate = function(vertices, angle, point) {
						if (angle === 0) return;
						var cos = Math.cos(angle), sin = Math.sin(angle), pointX = point.x, pointY = point.y, verticesLength = vertices.length, vertex, dx, dy, i;
						for (i = 0; i < verticesLength; i++) {
							vertex = vertices[i];
							dx = vertex.x - pointX;
							dy = vertex.y - pointY;
							vertex.x = pointX + (dx * cos - dy * sin);
							vertex.y = pointY + (dx * sin + dy * cos);
						}
						return vertices;
					};
					/**
					* Returns `true` if the `point` is inside the set of `vertices`.
					* @method contains
					* @param {vertices} vertices
					* @param {vector} point
					* @return {boolean} True if the vertices contains point, otherwise false
					*/
					Vertices.contains = function(vertices, point) {
						var pointX = point.x, pointY = point.y, verticesLength = vertices.length, vertex = vertices[verticesLength - 1], nextVertex;
						for (var i = 0; i < verticesLength; i++) {
							nextVertex = vertices[i];
							if ((pointX - vertex.x) * (nextVertex.y - vertex.y) + (pointY - vertex.y) * (vertex.x - nextVertex.x) > 0) return false;
							vertex = nextVertex;
						}
						return true;
					};
					/**
					* Scales the vertices from a point (default is centre) in-place.
					* @method scale
					* @param {vertices} vertices
					* @param {number} scaleX
					* @param {number} scaleY
					* @param {vector} point
					*/
					Vertices.scale = function(vertices, scaleX, scaleY, point) {
						if (scaleX === 1 && scaleY === 1) return vertices;
						point = point || Vertices.centre(vertices);
						var vertex, delta;
						for (var i = 0; i < vertices.length; i++) {
							vertex = vertices[i];
							delta = Vector.sub(vertex, point);
							vertices[i].x = point.x + delta.x * scaleX;
							vertices[i].y = point.y + delta.y * scaleY;
						}
						return vertices;
					};
					/**
					* Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
					* The radius parameter is a single number or an array to specify the radius for each vertex.
					* @method chamfer
					* @param {vertices} vertices
					* @param {number[]} radius
					* @param {number} quality
					* @param {number} qualityMin
					* @param {number} qualityMax
					*/
					Vertices.chamfer = function(vertices, radius, quality, qualityMin, qualityMax) {
						if (typeof radius === "number") radius = [radius];
						else radius = radius || [8];
						quality = typeof quality !== "undefined" ? quality : -1;
						qualityMin = qualityMin || 2;
						qualityMax = qualityMax || 14;
						var newVertices = [];
						for (var i = 0; i < vertices.length; i++) {
							var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1], vertex = vertices[i], nextVertex = vertices[(i + 1) % vertices.length], currentRadius = radius[i < radius.length ? i : radius.length - 1];
							if (currentRadius === 0) {
								newVertices.push(vertex);
								continue;
							}
							var prevNormal = Vector.normalise({
								x: vertex.y - prevVertex.y,
								y: prevVertex.x - vertex.x
							});
							var nextNormal = Vector.normalise({
								x: nextVertex.y - vertex.y,
								y: vertex.x - nextVertex.x
							});
							var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)), radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius), midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), .5)), scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));
							var precision = quality;
							if (quality === -1) precision = Math.pow(currentRadius, .32) * 1.75;
							precision = Common.clamp(precision, qualityMin, qualityMax);
							if (precision % 2 === 1) precision += 1;
							var theta = Math.acos(Vector.dot(prevNormal, nextNormal)) / precision;
							for (var j = 0; j < precision; j++) newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
						}
						return newVertices;
					};
					/**
					* Sorts the input vertices into clockwise order in place.
					* @method clockwiseSort
					* @param {vertices} vertices
					* @return {vertices} vertices
					*/
					Vertices.clockwiseSort = function(vertices) {
						var centre = Vertices.mean(vertices);
						vertices.sort(function(vertexA, vertexB) {
							return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB);
						});
						return vertices;
					};
					/**
					* Returns true if the vertices form a convex shape (vertices must be in clockwise order).
					* @method isConvex
					* @param {vertices} vertices
					* @return {bool} `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
					*/
					Vertices.isConvex = function(vertices) {
						var flag = 0, n = vertices.length, i, j, k, z;
						if (n < 3) return null;
						for (i = 0; i < n; i++) {
							j = (i + 1) % n;
							k = (i + 2) % n;
							z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
							z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);
							if (z < 0) flag |= 1;
							else if (z > 0) flag |= 2;
							if (flag === 3) return false;
						}
						if (flag !== 0) return true;
						else return null;
					};
					/**
					* Returns the convex hull of the input vertices as a new array of points.
					* @method hull
					* @param {vertices} vertices
					* @return [vertex] vertices
					*/
					Vertices.hull = function(vertices) {
						var upper = [], lower = [], vertex, i;
						vertices = vertices.slice(0);
						vertices.sort(function(vertexA, vertexB) {
							var dx = vertexA.x - vertexB.x;
							return dx !== 0 ? dx : vertexA.y - vertexB.y;
						});
						for (i = 0; i < vertices.length; i += 1) {
							vertex = vertices[i];
							while (lower.length >= 2 && Vector.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) lower.pop();
							lower.push(vertex);
						}
						for (i = vertices.length - 1; i >= 0; i -= 1) {
							vertex = vertices[i];
							while (upper.length >= 2 && Vector.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) upper.pop();
							upper.push(vertex);
						}
						upper.pop();
						lower.pop();
						return upper.concat(lower);
					};
				})();
			}),
			(function(module$7, exports$7, __webpack_require__) {
				/**
				* The `Matter.Body` module contains methods for creating and manipulating rigid bodies.
				* For creating bodies with common configurations such as rectangles, circles and other polygons see the module `Matter.Bodies`.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				
				* @class Body
				*/
				var Body = {};
				module$7.exports = Body;
				var Vertices = __webpack_require__(3);
				var Vector = __webpack_require__(2);
				var Sleeping = __webpack_require__(7);
				var Common = __webpack_require__(0);
				var Bounds = __webpack_require__(1);
				var Axes = __webpack_require__(11);
				(function() {
					Body._timeCorrection = true;
					Body._inertiaScale = 4;
					Body._nextCollidingGroupId = 1;
					Body._nextNonCollidingGroupId = -1;
					Body._nextCategory = 1;
					Body._baseDelta = 1e3 / 60;
					/**
					* Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
					* All properties have default values, and many are pre-calculated automatically based on other properties.
					* Vertices must be specified in clockwise order.
					* See the properties section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {} options
					* @return {body} body
					*/
					Body.create = function(options) {
						var defaults = {
							id: Common.nextId(),
							type: "body",
							label: "Body",
							parts: [],
							plugin: {},
							angle: 0,
							vertices: Vertices.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
							position: {
								x: 0,
								y: 0
							},
							force: {
								x: 0,
								y: 0
							},
							torque: 0,
							positionImpulse: {
								x: 0,
								y: 0
							},
							constraintImpulse: {
								x: 0,
								y: 0,
								angle: 0
							},
							totalContacts: 0,
							speed: 0,
							angularSpeed: 0,
							velocity: {
								x: 0,
								y: 0
							},
							angularVelocity: 0,
							isSensor: false,
							isStatic: false,
							isSleeping: false,
							motion: 0,
							sleepThreshold: 60,
							density: .001,
							restitution: 0,
							friction: .1,
							frictionStatic: .5,
							frictionAir: .01,
							collisionFilter: {
								category: 1,
								mask: 4294967295,
								group: 0
							},
							slop: .05,
							timeScale: 1,
							render: {
								visible: true,
								opacity: 1,
								strokeStyle: null,
								fillStyle: null,
								lineWidth: null,
								sprite: {
									xScale: 1,
									yScale: 1,
									xOffset: 0,
									yOffset: 0
								}
							},
							events: null,
							bounds: null,
							chamfer: null,
							circleRadius: 0,
							positionPrev: null,
							anglePrev: 0,
							parent: null,
							axes: null,
							area: 0,
							mass: 0,
							inertia: 0,
							deltaTime: 1e3 / 60,
							_original: null
						};
						var body = Common.extend(defaults, options);
						_initProperties(body, options);
						return body;
					};
					/**
					* Returns the next unique group index for which bodies will collide.
					* If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
					* See `body.collisionFilter` for more information.
					* @method nextGroup
					* @param {bool} [isNonColliding=false]
					* @return {Number} Unique group index
					*/
					Body.nextGroup = function(isNonColliding) {
						if (isNonColliding) return Body._nextNonCollidingGroupId--;
						return Body._nextCollidingGroupId++;
					};
					/**
					* Returns the next unique category bitfield (starting after the initial default category `0x0001`).
					* There are 32 available. See `body.collisionFilter` for more information.
					* @method nextCategory
					* @return {Number} Unique category bitfield
					*/
					Body.nextCategory = function() {
						Body._nextCategory = Body._nextCategory << 1;
						return Body._nextCategory;
					};
					/**
					* Initialises body properties.
					* @method _initProperties
					* @private
					* @param {body} body
					* @param {} [options]
					*/
					var _initProperties = function(body, options) {
						options = options || {};
						Body.set(body, {
							bounds: body.bounds || Bounds.create(body.vertices),
							positionPrev: body.positionPrev || Vector.clone(body.position),
							anglePrev: body.anglePrev || body.angle,
							vertices: body.vertices,
							parts: body.parts || [body],
							isStatic: body.isStatic,
							isSleeping: body.isSleeping,
							parent: body.parent || body
						});
						Vertices.rotate(body.vertices, body.angle, body.position);
						Axes.rotate(body.axes, body.angle);
						Bounds.update(body.bounds, body.vertices, body.velocity);
						Body.set(body, {
							axes: options.axes || body.axes,
							area: options.area || body.area,
							mass: options.mass || body.mass,
							inertia: options.inertia || body.inertia
						});
						var defaultFillStyle = body.isStatic ? "#14151f" : Common.choose([
							"#f19648",
							"#f5d259",
							"#f55a3c",
							"#063e7b",
							"#ececd1"
						]), defaultStrokeStyle = body.isStatic ? "#555" : "#ccc", defaultLineWidth = body.isStatic && body.render.fillStyle === null ? 1 : 0;
						body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
						body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
						body.render.lineWidth = body.render.lineWidth || defaultLineWidth;
						body.render.sprite.xOffset += -(body.bounds.min.x - body.position.x) / (body.bounds.max.x - body.bounds.min.x);
						body.render.sprite.yOffset += -(body.bounds.min.y - body.position.y) / (body.bounds.max.y - body.bounds.min.y);
					};
					/**
					* Given a property and a value (or map of), sets the property(s) on the body, using the appropriate setter functions if they exist.
					* Prefer to use the actual setter functions in performance critical situations.
					* @method set
					* @param {body} body
					* @param {} settings A property name (or map of properties and values) to set on the body.
					* @param {} value The value to set if `settings` is a single property name.
					*/
					Body.set = function(body, settings, value) {
						var property;
						if (typeof settings === "string") {
							property = settings;
							settings = {};
							settings[property] = value;
						}
						for (property in settings) {
							if (!Object.prototype.hasOwnProperty.call(settings, property)) continue;
							value = settings[property];
							switch (property) {
								case "isStatic":
									Body.setStatic(body, value);
									break;
								case "isSleeping":
									Sleeping.set(body, value);
									break;
								case "mass":
									Body.setMass(body, value);
									break;
								case "density":
									Body.setDensity(body, value);
									break;
								case "inertia":
									Body.setInertia(body, value);
									break;
								case "vertices":
									Body.setVertices(body, value);
									break;
								case "position":
									Body.setPosition(body, value);
									break;
								case "angle":
									Body.setAngle(body, value);
									break;
								case "velocity":
									Body.setVelocity(body, value);
									break;
								case "angularVelocity":
									Body.setAngularVelocity(body, value);
									break;
								case "speed":
									Body.setSpeed(body, value);
									break;
								case "angularSpeed":
									Body.setAngularSpeed(body, value);
									break;
								case "parts":
									Body.setParts(body, value);
									break;
								case "centre":
									Body.setCentre(body, value);
									break;
								default: body[property] = value;
							}
						}
					};
					/**
					* Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
					* @method setStatic
					* @param {body} body
					* @param {bool} isStatic
					*/
					Body.setStatic = function(body, isStatic) {
						for (var i = 0; i < body.parts.length; i++) {
							var part = body.parts[i];
							if (isStatic) {
								if (!part.isStatic) part._original = {
									restitution: part.restitution,
									friction: part.friction,
									mass: part.mass,
									inertia: part.inertia,
									density: part.density,
									inverseMass: part.inverseMass,
									inverseInertia: part.inverseInertia
								};
								part.restitution = 0;
								part.friction = 1;
								part.mass = part.inertia = part.density = Infinity;
								part.inverseMass = part.inverseInertia = 0;
								part.positionPrev.x = part.position.x;
								part.positionPrev.y = part.position.y;
								part.anglePrev = part.angle;
								part.angularVelocity = 0;
								part.speed = 0;
								part.angularSpeed = 0;
								part.motion = 0;
							} else if (part._original) {
								part.restitution = part._original.restitution;
								part.friction = part._original.friction;
								part.mass = part._original.mass;
								part.inertia = part._original.inertia;
								part.density = part._original.density;
								part.inverseMass = part._original.inverseMass;
								part.inverseInertia = part._original.inverseInertia;
								part._original = null;
							}
							part.isStatic = isStatic;
						}
					};
					/**
					* Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
					* @method setMass
					* @param {body} body
					* @param {number} mass
					*/
					Body.setMass = function(body, mass) {
						body.inertia = body.inertia / (body.mass / 6) * (mass / 6);
						body.inverseInertia = 1 / body.inertia;
						body.mass = mass;
						body.inverseMass = 1 / body.mass;
						body.density = body.mass / body.area;
					};
					/**
					* Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
					* @method setDensity
					* @param {body} body
					* @param {number} density
					*/
					Body.setDensity = function(body, density) {
						Body.setMass(body, density * body.area);
						body.density = density;
					};
					/**
					* Sets the moment of inertia of the body. This is the second moment of area in two dimensions.
					* Inverse inertia is automatically updated to reflect the change. Mass is not changed.
					* @method setInertia
					* @param {body} body
					* @param {number} inertia
					*/
					Body.setInertia = function(body, inertia) {
						body.inertia = inertia;
						body.inverseInertia = 1 / body.inertia;
					};
					/**
					* Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
					* Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
					* They are then automatically translated to world space based on `body.position`.
					*
					* The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
					* Vertices must form a convex hull. Concave vertices must be decomposed into convex parts.
					* 
					* @method setVertices
					* @param {body} body
					* @param {vector[]} vertices
					*/
					Body.setVertices = function(body, vertices) {
						if (vertices[0].body === body) body.vertices = vertices;
						else body.vertices = Vertices.create(vertices, body);
						body.axes = Axes.fromVertices(body.vertices);
						body.area = Vertices.area(body.vertices);
						Body.setMass(body, body.density * body.area);
						var centre = Vertices.centre(body.vertices);
						Vertices.translate(body.vertices, centre, -1);
						Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));
						Vertices.translate(body.vertices, body.position);
						Bounds.update(body.bounds, body.vertices, body.velocity);
					};
					/**
					* Sets the parts of the `body`. 
					* 
					* See `body.parts` for details and requirements on how parts are used.
					* 
					* See Bodies.fromVertices for a related utility.
					* 
					* This function updates `body` mass, inertia and centroid based on the parts geometry.  
					* Sets each `part.parent` to be this `body`.  
					* 
					* The convex hull is computed and set on this `body` (unless `autoHull` is `false`).  
					* Automatically ensures that the first part in `body.parts` is the `body`.
					* @method setParts
					* @param {body} body
					* @param {body[]} parts
					* @param {bool} [autoHull=true]
					*/
					Body.setParts = function(body, parts, autoHull) {
						var i;
						parts = parts.slice(0);
						body.parts.length = 0;
						body.parts.push(body);
						body.parent = body;
						for (i = 0; i < parts.length; i++) {
							var part = parts[i];
							if (part !== body) {
								part.parent = body;
								body.parts.push(part);
							}
						}
						if (body.parts.length === 1) return;
						autoHull = typeof autoHull !== "undefined" ? autoHull : true;
						if (autoHull) {
							var vertices = [];
							for (i = 0; i < parts.length; i++) vertices = vertices.concat(parts[i].vertices);
							Vertices.clockwiseSort(vertices);
							var hull = Vertices.hull(vertices), hullCentre = Vertices.centre(hull);
							Body.setVertices(body, hull);
							Vertices.translate(body.vertices, hullCentre);
						}
						var total = Body._totalProperties(body);
						body.area = total.area;
						body.parent = body;
						body.position.x = total.centre.x;
						body.position.y = total.centre.y;
						body.positionPrev.x = total.centre.x;
						body.positionPrev.y = total.centre.y;
						Body.setMass(body, total.mass);
						Body.setInertia(body, total.inertia);
						Body.setPosition(body, total.centre);
					};
					/**
					* Set the centre of mass of the body. 
					* The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
					* The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
					* This is equal to moving `body.position` but not the `body.vertices`.
					* Invalid if the `centre` falls outside the body's convex hull.
					* @method setCentre
					* @param {body} body
					* @param {vector} centre
					* @param {bool} relative
					*/
					Body.setCentre = function(body, centre, relative) {
						if (!relative) {
							body.positionPrev.x = centre.x - (body.position.x - body.positionPrev.x);
							body.positionPrev.y = centre.y - (body.position.y - body.positionPrev.y);
							body.position.x = centre.x;
							body.position.y = centre.y;
						} else {
							body.positionPrev.x += centre.x;
							body.positionPrev.y += centre.y;
							body.position.x += centre.x;
							body.position.y += centre.y;
						}
					};
					/**
					* Sets the position of the body. By default velocity is unchanged.
					* If `updateVelocity` is `true` then velocity is inferred from the change in position.
					* @method setPosition
					* @param {body} body
					* @param {vector} position
					* @param {boolean} [updateVelocity=false]
					*/
					Body.setPosition = function(body, position, updateVelocity) {
						var delta = Vector.sub(position, body.position);
						if (updateVelocity) {
							body.positionPrev.x = body.position.x;
							body.positionPrev.y = body.position.y;
							body.velocity.x = delta.x;
							body.velocity.y = delta.y;
							body.speed = Vector.magnitude(delta);
						} else {
							body.positionPrev.x += delta.x;
							body.positionPrev.y += delta.y;
						}
						for (var i = 0; i < body.parts.length; i++) {
							var part = body.parts[i];
							part.position.x += delta.x;
							part.position.y += delta.y;
							Vertices.translate(part.vertices, delta);
							Bounds.update(part.bounds, part.vertices, body.velocity);
						}
					};
					/**
					* Sets the angle of the body. By default angular velocity is unchanged.
					* If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
					* @method setAngle
					* @param {body} body
					* @param {number} angle
					* @param {boolean} [updateVelocity=false]
					*/
					Body.setAngle = function(body, angle, updateVelocity) {
						var delta = angle - body.angle;
						if (updateVelocity) {
							body.anglePrev = body.angle;
							body.angularVelocity = delta;
							body.angularSpeed = Math.abs(delta);
						} else body.anglePrev += delta;
						for (var i = 0; i < body.parts.length; i++) {
							var part = body.parts[i];
							part.angle += delta;
							Vertices.rotate(part.vertices, delta, body.position);
							Axes.rotate(part.axes, delta);
							Bounds.update(part.bounds, part.vertices, body.velocity);
							if (i > 0) Vector.rotateAbout(part.position, delta, body.position, part.position);
						}
					};
					/**
					* Sets the current linear velocity of the body.  
					* Affects body speed.
					* @method setVelocity
					* @param {body} body
					* @param {vector} velocity
					*/
					Body.setVelocity = function(body, velocity) {
						var timeScale = body.deltaTime / Body._baseDelta;
						body.positionPrev.x = body.position.x - velocity.x * timeScale;
						body.positionPrev.y = body.position.y - velocity.y * timeScale;
						body.velocity.x = (body.position.x - body.positionPrev.x) / timeScale;
						body.velocity.y = (body.position.y - body.positionPrev.y) / timeScale;
						body.speed = Vector.magnitude(body.velocity);
					};
					/**
					* Gets the current linear velocity of the body.
					* @method getVelocity
					* @param {body} body
					* @return {vector} velocity
					*/
					Body.getVelocity = function(body) {
						var timeScale = Body._baseDelta / body.deltaTime;
						return {
							x: (body.position.x - body.positionPrev.x) * timeScale,
							y: (body.position.y - body.positionPrev.y) * timeScale
						};
					};
					/**
					* Gets the current linear speed of the body.  
					* Equivalent to the magnitude of its velocity.
					* @method getSpeed
					* @param {body} body
					* @return {number} speed
					*/
					Body.getSpeed = function(body) {
						return Vector.magnitude(Body.getVelocity(body));
					};
					/**
					* Sets the current linear speed of the body.  
					* Direction is maintained. Affects body velocity.
					* @method setSpeed
					* @param {body} body
					* @param {number} speed
					*/
					Body.setSpeed = function(body, speed) {
						Body.setVelocity(body, Vector.mult(Vector.normalise(Body.getVelocity(body)), speed));
					};
					/**
					* Sets the current rotational velocity of the body.  
					* Affects body angular speed.
					* @method setAngularVelocity
					* @param {body} body
					* @param {number} velocity
					*/
					Body.setAngularVelocity = function(body, velocity) {
						var timeScale = body.deltaTime / Body._baseDelta;
						body.anglePrev = body.angle - velocity * timeScale;
						body.angularVelocity = (body.angle - body.anglePrev) / timeScale;
						body.angularSpeed = Math.abs(body.angularVelocity);
					};
					/**
					* Gets the current rotational velocity of the body.
					* @method getAngularVelocity
					* @param {body} body
					* @return {number} angular velocity
					*/
					Body.getAngularVelocity = function(body) {
						return (body.angle - body.anglePrev) * Body._baseDelta / body.deltaTime;
					};
					/**
					* Gets the current rotational speed of the body.  
					* Equivalent to the magnitude of its angular velocity.
					* @method getAngularSpeed
					* @param {body} body
					* @return {number} angular speed
					*/
					Body.getAngularSpeed = function(body) {
						return Math.abs(Body.getAngularVelocity(body));
					};
					/**
					* Sets the current rotational speed of the body.  
					* Direction is maintained. Affects body angular velocity.
					* @method setAngularSpeed
					* @param {body} body
					* @param {number} speed
					*/
					Body.setAngularSpeed = function(body, speed) {
						Body.setAngularVelocity(body, Common.sign(Body.getAngularVelocity(body)) * speed);
					};
					/**
					* Moves a body by a given vector relative to its current position. By default velocity is unchanged.
					* If `updateVelocity` is `true` then velocity is inferred from the change in position.
					* @method translate
					* @param {body} body
					* @param {vector} translation
					* @param {boolean} [updateVelocity=false]
					*/
					Body.translate = function(body, translation, updateVelocity) {
						Body.setPosition(body, Vector.add(body.position, translation), updateVelocity);
					};
					/**
					* Rotates a body by a given angle relative to its current angle. By default angular velocity is unchanged.
					* If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
					* @method rotate
					* @param {body} body
					* @param {number} rotation
					* @param {vector} [point]
					* @param {boolean} [updateVelocity=false]
					*/
					Body.rotate = function(body, rotation, point, updateVelocity) {
						if (!point) Body.setAngle(body, body.angle + rotation, updateVelocity);
						else {
							var cos = Math.cos(rotation), sin = Math.sin(rotation), dx = body.position.x - point.x, dy = body.position.y - point.y;
							Body.setPosition(body, {
								x: point.x + (dx * cos - dy * sin),
								y: point.y + (dx * sin + dy * cos)
							}, updateVelocity);
							Body.setAngle(body, body.angle + rotation, updateVelocity);
						}
					};
					/**
					* Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
					* @method scale
					* @param {body} body
					* @param {number} scaleX
					* @param {number} scaleY
					* @param {vector} [point]
					*/
					Body.scale = function(body, scaleX, scaleY, point) {
						var totalArea = 0, totalInertia = 0;
						point = point || body.position;
						for (var i = 0; i < body.parts.length; i++) {
							var part = body.parts[i];
							Vertices.scale(part.vertices, scaleX, scaleY, point);
							part.axes = Axes.fromVertices(part.vertices);
							part.area = Vertices.area(part.vertices);
							Body.setMass(part, body.density * part.area);
							Vertices.translate(part.vertices, {
								x: -part.position.x,
								y: -part.position.y
							});
							Body.setInertia(part, Body._inertiaScale * Vertices.inertia(part.vertices, part.mass));
							Vertices.translate(part.vertices, {
								x: part.position.x,
								y: part.position.y
							});
							if (i > 0) {
								totalArea += part.area;
								totalInertia += part.inertia;
							}
							part.position.x = point.x + (part.position.x - point.x) * scaleX;
							part.position.y = point.y + (part.position.y - point.y) * scaleY;
							Bounds.update(part.bounds, part.vertices, body.velocity);
						}
						if (body.parts.length > 1) {
							body.area = totalArea;
							if (!body.isStatic) {
								Body.setMass(body, body.density * totalArea);
								Body.setInertia(body, totalInertia);
							}
						}
						if (body.circleRadius) if (scaleX === scaleY) body.circleRadius *= scaleX;
						else body.circleRadius = null;
					};
					/**
					* Performs an update by integrating the equations of motion on the `body`.
					* This is applied every update by `Matter.Engine` automatically.
					* @method update
					* @param {body} body
					* @param {number} [deltaTime=16.666]
					*/
					Body.update = function(body, deltaTime) {
						deltaTime = (typeof deltaTime !== "undefined" ? deltaTime : 1e3 / 60) * body.timeScale;
						var deltaTimeSquared = deltaTime * deltaTime, correction = Body._timeCorrection ? deltaTime / (body.deltaTime || deltaTime) : 1;
						var frictionAir = 1 - body.frictionAir * (deltaTime / Common._baseDelta), velocityPrevX = (body.position.x - body.positionPrev.x) * correction, velocityPrevY = (body.position.y - body.positionPrev.y) * correction;
						body.velocity.x = velocityPrevX * frictionAir + body.force.x / body.mass * deltaTimeSquared;
						body.velocity.y = velocityPrevY * frictionAir + body.force.y / body.mass * deltaTimeSquared;
						body.positionPrev.x = body.position.x;
						body.positionPrev.y = body.position.y;
						body.position.x += body.velocity.x;
						body.position.y += body.velocity.y;
						body.deltaTime = deltaTime;
						body.angularVelocity = (body.angle - body.anglePrev) * frictionAir * correction + body.torque / body.inertia * deltaTimeSquared;
						body.anglePrev = body.angle;
						body.angle += body.angularVelocity;
						for (var i = 0; i < body.parts.length; i++) {
							var part = body.parts[i];
							Vertices.translate(part.vertices, body.velocity);
							if (i > 0) {
								part.position.x += body.velocity.x;
								part.position.y += body.velocity.y;
							}
							if (body.angularVelocity !== 0) {
								Vertices.rotate(part.vertices, body.angularVelocity, body.position);
								Axes.rotate(part.axes, body.angularVelocity);
								if (i > 0) Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
							}
							Bounds.update(part.bounds, part.vertices, body.velocity);
						}
					};
					/**
					* Updates properties `body.velocity`, `body.speed`, `body.angularVelocity` and `body.angularSpeed` which are normalised in relation to `Body._baseDelta`.
					* @method updateVelocities
					* @param {body} body
					*/
					Body.updateVelocities = function(body) {
						var timeScale = Body._baseDelta / body.deltaTime, bodyVelocity = body.velocity;
						bodyVelocity.x = (body.position.x - body.positionPrev.x) * timeScale;
						bodyVelocity.y = (body.position.y - body.positionPrev.y) * timeScale;
						body.speed = Math.sqrt(bodyVelocity.x * bodyVelocity.x + bodyVelocity.y * bodyVelocity.y);
						body.angularVelocity = (body.angle - body.anglePrev) * timeScale;
						body.angularSpeed = Math.abs(body.angularVelocity);
					};
					/**
					* Applies the `force` to the `body` from the force origin `position` in world-space, over a single timestep, including applying any resulting angular torque.
					* 
					* Forces are useful for effects like gravity, wind or rocket thrust, but can be difficult in practice when precise control is needed. In these cases see `Body.setVelocity` and `Body.setPosition` as an alternative.
					* 
					* The force from this function is only applied once for the duration of a single timestep, in other words the duration depends directly on the current engine update `delta` and the rate of calls to this function.
					* 
					* Therefore to account for time, you should apply the force constantly over as many engine updates as equivalent to the intended duration.
					* 
					* If all or part of the force duration is some fraction of a timestep, first multiply the force by `duration / timestep`.
					* 
					* The force origin `position` in world-space must also be specified. Passing `body.position` will result in zero angular effect as the force origin would be at the centre of mass.
					* 
					* The `body` will take time to accelerate under a force, the resulting effect depends on duration of the force, the body mass and other forces on the body including friction combined.
					* @method applyForce
					* @param {body} body
					* @param {vector} position The force origin in world-space. Pass `body.position` to avoid angular torque.
					* @param {vector} force
					*/
					Body.applyForce = function(body, position, force) {
						var offset = {
							x: position.x - body.position.x,
							y: position.y - body.position.y
						};
						body.force.x += force.x;
						body.force.y += force.y;
						body.torque += offset.x * force.y - offset.y * force.x;
					};
					/**
					* Returns the sums of the properties of all compound parts of the parent body.
					* @method _totalProperties
					* @private
					* @param {body} body
					* @return {}
					*/
					Body._totalProperties = function(body) {
						var properties = {
							mass: 0,
							area: 0,
							inertia: 0,
							centre: {
								x: 0,
								y: 0
							}
						};
						for (var i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
							var part = body.parts[i], mass = part.mass !== Infinity ? part.mass : 1;
							properties.mass += mass;
							properties.area += part.area;
							properties.inertia += part.inertia;
							properties.centre = Vector.add(properties.centre, Vector.mult(part.position, mass));
						}
						properties.centre = Vector.div(properties.centre, properties.mass);
						return properties;
					};
					/**
					* Fired when a body starts sleeping (where `this` is the body).
					*
					* @event sleepStart
					* @this {body} The body that has started sleeping
					* @param {} event An event object
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when a body ends sleeping (where `this` is the body).
					*
					* @event sleepEnd
					* @this {body} The body that has ended sleeping
					* @param {} event An event object
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* An integer `Number` uniquely identifying number generated in `Body.create` by `Common.nextId`.
					*
					* @property id
					* @type number
					*/
					/**
					* _Read only_. Set by `Body.create`.
					* 
					* A `String` denoting the type of object.
					*
					* @readOnly
					* @property type
					* @type string
					* @default "body"
					*/
					/**
					* An arbitrary `String` name to help the user identify and manage bodies.
					*
					* @property label
					* @type string
					* @default "Body"
					*/
					/**
					* _Read only_. Use `Body.setParts` to set. 
					* 
					* See `Bodies.fromVertices` for a related utility.
					* 
					* An array of bodies (the 'parts') that make up this body (the 'parent'). The first body in this array must always be a self-reference to this `body`.  
					* 
					* The parts are fixed together and therefore perform as a single unified rigid body.
					* 
					* Parts in relation to each other are allowed to overlap, as well as form gaps or holes, so can be used to create complex concave bodies unlike when using a single part. 
					* 
					* Use properties and functions on the parent `body` rather than on parts.
					*   
					* Outside of their geometry, most properties on parts are not considered or updated.  
					* As such 'per-part' material properties among others are not currently considered.
					* 
					* Parts should be created specifically for their parent body.  
					* Parts should not be shared or reused between bodies, only one parent is supported.  
					* Parts should not have their own parts, they are not handled recursively.  
					* Parts should not be added to the world directly or any other composite.  
					* Parts own vertices must be convex and in clockwise order.   
					* 
					* A body with more than one part is sometimes referred to as a 'compound' body. 
					* 
					* Use `Body.setParts` when setting parts to ensure correct updates of all properties.  
					*
					* @readOnly
					* @property parts
					* @type body[]
					*/
					/**
					* An object reserved for storing plugin-specific properties.
					*
					* @property plugin
					* @type {}
					*/
					/**
					* _Read only_. Updated by `Body.setParts`.
					* 
					* A reference to the body that this is a part of. See `body.parts`.
					* This is a self reference if the body is not a part of another body.
					*
					* @readOnly
					* @property parent
					* @type body
					*/
					/**
					* A `Number` specifying the angle of the body, in radians.
					*
					* @property angle
					* @type number
					* @default 0
					*/
					/**
					* _Read only_. Use `Body.setVertices` or `Body.setParts` to set. See also `Bodies.fromVertices`.
					* 
					* An array of `Vector` objects that specify the convex hull of the rigid body.
					* These should be provided about the origin `(0, 0)`. E.g.
					*
					* `[{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]`
					* 
					* Vertices must always be convex, in clockwise order and must not contain any duplicate points.
					* 
					* Concave vertices should be decomposed into convex `parts`, see `Bodies.fromVertices` and `Body.setParts`.
					*
					* When set the vertices are translated such that `body.position` is at the centre of mass.
					* Many other body properties are automatically calculated from these vertices when set including `density`, `area` and `inertia`.
					* 
					* The module `Matter.Vertices` contains useful methods for working with vertices.
					*
					* @readOnly
					* @property vertices
					* @type vector[]
					*/
					/**
					* _Read only_. Use `Body.setPosition` to set. 
					* 
					* A `Vector` that specifies the current world-space position of the body.
					* 
					* @readOnly
					* @property position
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* A `Vector` that accumulates the total force applied to the body for a single update.
					* Force is zeroed after every `Engine.update`, so constant forces should be applied for every update they are needed. See also `Body.applyForce`.
					* 
					* @property force
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* A `Number` that accumulates the total torque (turning force) applied to the body for a single update. See also `Body.applyForce`.
					* Torque is zeroed after every `Engine.update`, so constant torques should be applied for every update they are needed.
					*
					* Torques result in angular acceleration on every update, which depends on body inertia and the engine update delta.
					* 
					* @property torque
					* @type number
					* @default 0
					*/
					/**
					* _Read only_. Use `Body.setSpeed` to set. 
					* 
					* See `Body.getSpeed` for details.
					* 
					* Equivalent to the magnitude of `body.velocity` (always positive).
					* 
					* @readOnly
					* @property speed
					* @type number
					* @default 0
					*/
					/**
					* _Read only_. Use `Body.setVelocity` to set. 
					* 
					* See `Body.getVelocity` for details.
					* 
					* Equivalent to the magnitude of `body.angularVelocity` (always positive).
					* 
					* @readOnly
					* @property velocity
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* _Read only_. Use `Body.setAngularSpeed` to set. 
					* 
					* See `Body.getAngularSpeed` for details.
					* 
					* 
					* @readOnly
					* @property angularSpeed
					* @type number
					* @default 0
					*/
					/**
					* _Read only_. Use `Body.setAngularVelocity` to set. 
					* 
					* See `Body.getAngularVelocity` for details.
					* 
					*
					* @readOnly
					* @property angularVelocity
					* @type number
					* @default 0
					*/
					/**
					* _Read only_. Use `Body.setStatic` to set. 
					* 
					* A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
					*
					* @readOnly
					* @property isStatic
					* @type boolean
					* @default false
					*/
					/**
					* A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
					*
					* @property isSensor
					* @type boolean
					* @default false
					*/
					/**
					* _Read only_. Use `Sleeping.set` to set. 
					* 
					* A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
					*
					* @readOnly
					* @property isSleeping
					* @type boolean
					* @default false
					*/
					/**
					* _Read only_. Calculated during engine update only when sleeping is enabled.
					* 
					* A `Number` that loosely measures the amount of movement a body currently has.
					*
					* Derived from `body.speed^2 + body.angularSpeed^2`. See `Sleeping.update`.
					* 
					* @readOnly
					* @property motion
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that defines the length of time during which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
					* 
					* @property sleepThreshold
					* @type number
					* @default 60
					*/
					/**
					* _Read only_. Use `Body.setDensity` to set. 
					* 
					* A `Number` that defines the density of the body (mass per unit area).
					* 
					* Mass will also be updated when set.
					*
					* @readOnly
					* @property density
					* @type number
					* @default 0.001
					*/
					/**
					* _Read only_. Use `Body.setMass` to set. 
					* 
					* A `Number` that defines the mass of the body.
					* 
					* Density will also be updated when set.
					* 
					* @readOnly
					* @property mass
					* @type number
					*/
					/**
					* _Read only_. Use `Body.setMass` to set. 
					* 
					* A `Number` that defines the inverse mass of the body (`1 / mass`).
					*
					* @readOnly
					* @property inverseMass
					* @type number
					*/
					/**
					* _Read only_. Automatically calculated when vertices, mass or density are set or set through `Body.setInertia`.
					* 
					* A `Number` that defines the moment of inertia of the body. This is the second moment of area in two dimensions.
					* 
					* Can be manually set to `Infinity` to prevent rotation of the body. See `Body.setInertia`.
					* 
					* @readOnly
					* @property inertia
					* @type number
					*/
					/**
					* _Read only_. Automatically calculated when vertices, mass or density are set or calculated by `Body.setInertia`.
					* 
					* A `Number` that defines the inverse moment of inertia of the body (`1 / inertia`).
					* 
					* @readOnly
					* @property inverseInertia
					* @type number
					*/
					/**
					* A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
					* A value of `0` means collisions may be perfectly inelastic and no bouncing may occur. 
					* A value of `0.8` means the body may bounce back with approximately 80% of its kinetic energy.
					* Note that collision response is based on _pairs_ of bodies, and that `restitution` values are _combined_ with the following formula:
					*
					* `Math.max(bodyA.restitution, bodyB.restitution)`
					*
					* @property restitution
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`.
					* A value of `0` means that the body may slide indefinitely.
					* A value of `1` means the body may come to a stop almost instantly after a force is applied.
					*
					* The effects of the value may be non-linear. 
					* High values may be unstable depending on the body.
					* The engine uses a Coulomb friction model including static and kinetic friction.
					* Note that collision response is based on _pairs_ of bodies, and that `friction` values are _combined_ with the following formula:
					*
					* `Math.min(bodyA.friction, bodyB.friction)`
					*
					* @property friction
					* @type number
					* @default 0.1
					*/
					/**
					* A `Number` that defines the static friction of the body (in the Coulomb friction model). 
					* A value of `0` means the body will never 'stick' when it is nearly stationary and only dynamic `friction` is used.
					* The higher the value (e.g. `10`), the more force it will take to initially get the body moving when nearly stationary.
					* This value is multiplied with the `friction` property to make it easier to change `friction` and maintain an appropriate amount of static friction.
					*
					* @property frictionStatic
					* @type number
					* @default 0.5
					*/
					/**
					* A `Number` that defines the air friction of the body (air resistance). 
					* A value of `0` means the body will never slow as it moves through space.
					* The higher the value, the faster a body slows when moving through space.
					* The effects of the value are non-linear. 
					*
					* @property frictionAir
					* @type number
					* @default 0.01
					*/
					/**
					* An `Object` that specifies the collision filtering properties of this body.
					*
					* Collisions between two bodies will obey the following rules:
					* - If the two bodies have the same non-zero value of `collisionFilter.group`,
					*   they will always collide if the value is positive, and they will never collide
					*   if the value is negative.
					* - If the two bodies have different values of `collisionFilter.group` or if one
					*   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
					*
					* Each body belongs to a collision category, given by `collisionFilter.category`. This
					* value is used as a bit field and the category should have only one bit set, meaning that
					* the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
					* different collision categories available.
					*
					* Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
					* the categories it collides with (the value is the bitwise AND value of all these categories).
					*
					* Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
					* category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
					* are both true.
					*
					* @property collisionFilter
					* @type object
					*/
					/**
					* An Integer `Number`, that specifies the collision group this body belongs to.
					* See `body.collisionFilter` for more information.
					*
					* @property collisionFilter.group
					* @type object
					* @default 0
					*/
					/**
					* A bit field that specifies the collision category this body belongs to.
					* The category value should have only one bit set, for example `0x0001`.
					* This means there are up to 32 unique collision categories available.
					* See `body.collisionFilter` for more information.
					*
					* @property collisionFilter.category
					* @type object
					* @default 1
					*/
					/**
					* A bit mask that specifies the collision categories this body may collide with.
					* See `body.collisionFilter` for more information.
					*
					* @property collisionFilter.mask
					* @type object
					* @default -1
					*/
					/**
					* A `Number` that specifies a thin boundary around the body where it is allowed to slightly sink into other bodies.
					* 
					* This is required for proper collision response, including friction and restitution effects.
					* 
					* The default should generally suffice in most cases. You may need to decrease this value for very small bodies that are nearing the default value in scale.
					*
					* @property slop
					* @type number
					* @default 0.05
					*/
					/**
					* A `Number` that specifies per-body time scaling.
					*
					* @property timeScale
					* @type number
					* @default 1
					*/
					/**
					* _Read only_. Updated during engine update.
					* 
					* A `Number` that records the last delta time value used to update this body.
					* Used to calculate speed and velocity.
					*
					* @readOnly
					* @property deltaTime
					* @type number
					* @default 1000 / 60
					*/
					/**
					* An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
					*
					* @property render
					* @type object
					*/
					/**
					* A flag that indicates if the body should be rendered.
					*
					* @property render.visible
					* @type boolean
					* @default true
					*/
					/**
					* Sets the opacity to use when rendering.
					*
					* @property render.opacity
					* @type number
					* @default 1
					*/
					/**
					* An `Object` that defines the sprite properties to use when rendering, if any.
					*
					* @property render.sprite
					* @type object
					*/
					/**
					* An `String` that defines the path to the image to use as the sprite texture, if any.
					*
					* @property render.sprite.texture
					* @type string
					*/
					/**
					* A `Number` that defines the scaling in the x-axis for the sprite, if any.
					*
					* @property render.sprite.xScale
					* @type number
					* @default 1
					*/
					/**
					* A `Number` that defines the scaling in the y-axis for the sprite, if any.
					*
					* @property render.sprite.yScale
					* @type number
					* @default 1
					*/
					/**
					* A `Number` that defines the offset in the x-axis for the sprite (normalised by texture width).
					*
					* @property render.sprite.xOffset
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that defines the offset in the y-axis for the sprite (normalised by texture height).
					*
					* @property render.sprite.yOffset
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that defines the line width to use when rendering the body outline (if a sprite is not defined).
					* A value of `0` means no outline will be rendered.
					*
					* @property render.lineWidth
					* @type number
					* @default 0
					*/
					/**
					* A `String` that defines the fill style to use when rendering the body (if a sprite is not defined).
					* It is the same as when using a canvas, so it accepts CSS style property values.
					*
					* @property render.fillStyle
					* @type string
					* @default a random colour
					*/
					/**
					* A `String` that defines the stroke style to use when rendering the body outline (if a sprite is not defined).
					* It is the same as when using a canvas, so it accepts CSS style property values.
					*
					* @property render.strokeStyle
					* @type string
					* @default a random colour
					*/
					/**
					* _Read only_. Calculated automatically when vertices are set.
					* 
					* An array of unique axis vectors (edge normals) used for collision detection.
					* These are automatically calculated when vertices are set.
					* They are constantly updated by `Body.update` during the simulation.
					*
					* @readOnly
					* @property axes
					* @type vector[]
					*/
					/**
					* _Read only_. Calculated automatically when vertices are set.
					* 
					* A `Number` that measures the area of the body's convex hull.
					* 
					* @readOnly
					* @property area
					* @type string
					* @default 
					*/
					/**
					* A `Bounds` object that defines the AABB region for the body.
					* It is automatically calculated when vertices are set and constantly updated by `Body.update` during simulation.
					* 
					* @property bounds
					* @type bounds
					*/
					/**
					* Temporarily may hold parameters to be passed to `Vertices.chamfer` where supported by external functions.
					* 
					* See `Vertices.chamfer` for possible parameters this object may hold.
					* 
					* Currently only functions inside `Matter.Bodies` provide a utility using this property as a vertices pre-processing option.
					* 
					* Alternatively consider using `Vertices.chamfer` directly on vertices before passing them to a body creation function.
					* 
					* @property chamfer
					* @type object|null|undefined
					*/
				})();
			}),
			(function(module$8, exports$8, __webpack_require__) {
				/**
				* The `Matter.Events` module contains methods to fire and listen to events on other objects.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Events
				*/
				var Events = {};
				module$8.exports = Events;
				var Common = __webpack_require__(0);
				(function() {
					/**
					* Subscribes a callback function to the given object's `eventName`.
					* @method on
					* @param {} object
					* @param {string} eventNames
					* @param {function} callback
					*/
					Events.on = function(object, eventNames, callback) {
						var names = eventNames.split(" "), name;
						for (var i = 0; i < names.length; i++) {
							name = names[i];
							object.events = object.events || {};
							object.events[name] = object.events[name] || [];
							object.events[name].push(callback);
						}
						return callback;
					};
					/**
					* Removes the given event callback. If no callback, clears all callbacks in `eventNames`. If no `eventNames`, clears all events.
					* @method off
					* @param {} object
					* @param {string} eventNames
					* @param {function} callback
					*/
					Events.off = function(object, eventNames, callback) {
						if (!eventNames) {
							object.events = {};
							return;
						}
						if (typeof eventNames === "function") {
							callback = eventNames;
							eventNames = Common.keys(object.events).join(" ");
						}
						var names = eventNames.split(" ");
						for (var i = 0; i < names.length; i++) {
							var callbacks = object.events[names[i]], newCallbacks = [];
							if (callback && callbacks) {
								for (var j = 0; j < callbacks.length; j++) if (callbacks[j] !== callback) newCallbacks.push(callbacks[j]);
							}
							object.events[names[i]] = newCallbacks;
						}
					};
					/**
					* Fires all the callbacks subscribed to the given object's `eventName`, in the order they subscribed, if any.
					* @method trigger
					* @param {} object
					* @param {string} eventNames
					* @param {} event
					*/
					Events.trigger = function(object, eventNames, event) {
						var names, name, callbacks, eventClone;
						var events = object.events;
						if (events && Common.keys(events).length > 0) {
							if (!event) event = {};
							names = eventNames.split(" ");
							for (var i = 0; i < names.length; i++) {
								name = names[i];
								callbacks = events[name];
								if (callbacks) {
									eventClone = Common.clone(event, false);
									eventClone.name = name;
									eventClone.source = object;
									for (var j = 0; j < callbacks.length; j++) callbacks[j].apply(object, [eventClone]);
								}
							}
						}
					};
				})();
			}),
			(function(module$9, exports$9, __webpack_require__) {
				/**
				* A composite is a collection of `Matter.Body`, `Matter.Constraint` and other `Matter.Composite` objects.
				*
				* They are a container that can represent complex objects made of multiple parts, even if they are not physically connected.
				* A composite could contain anything from a single body all the way up to a whole world.
				* 
				* When making any changes to composites, use the included functions rather than changing their properties directly.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Composite
				*/
				var Composite = {};
				module$9.exports = Composite;
				var Events = __webpack_require__(5);
				var Common = __webpack_require__(0);
				var Bounds = __webpack_require__(1);
				var Body = __webpack_require__(4);
				(function() {
					/**
					* Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
					* See the properites section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {} [options]
					* @return {composite} A new composite
					*/
					Composite.create = function(options) {
						return Common.extend({
							id: Common.nextId(),
							type: "composite",
							parent: null,
							isModified: false,
							bodies: [],
							constraints: [],
							composites: [],
							label: "Composite",
							plugin: {},
							cache: {
								allBodies: null,
								allConstraints: null,
								allComposites: null
							}
						}, options);
					};
					/**
					* Sets the composite's `isModified` flag. 
					* If `updateParents` is true, all parents will be set (default: false).
					* If `updateChildren` is true, all children will be set (default: false).
					* @private
					* @method setModified
					* @param {composite} composite
					* @param {boolean} isModified
					* @param {boolean} [updateParents=false]
					* @param {boolean} [updateChildren=false]
					*/
					Composite.setModified = function(composite, isModified, updateParents, updateChildren) {
						composite.isModified = isModified;
						if (isModified && composite.cache) {
							composite.cache.allBodies = null;
							composite.cache.allConstraints = null;
							composite.cache.allComposites = null;
						}
						if (updateParents && composite.parent) Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
						if (updateChildren) for (var i = 0; i < composite.composites.length; i++) {
							var childComposite = composite.composites[i];
							Composite.setModified(childComposite, isModified, updateParents, updateChildren);
						}
					};
					/**
					* Generic single or multi-add function. Adds a single or an array of body(s), constraint(s) or composite(s) to the given composite.
					* Triggers `beforeAdd` and `afterAdd` events on the `composite`.
					* @method add
					* @param {composite} composite
					* @param {object|array} object A single or an array of body(s), constraint(s) or composite(s)
					* @return {composite} The original composite with the objects added
					*/
					Composite.add = function(composite, object) {
						var objects = [].concat(object);
						Events.trigger(composite, "beforeAdd", { object });
						for (var i = 0; i < objects.length; i++) {
							var obj = objects[i];
							switch (obj.type) {
								case "body":
									if (obj.parent !== obj) {
										Common.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
										break;
									}
									Composite.addBody(composite, obj);
									break;
								case "constraint":
									Composite.addConstraint(composite, obj);
									break;
								case "composite":
									Composite.addComposite(composite, obj);
									break;
								case "mouseConstraint":
									Composite.addConstraint(composite, obj.constraint);
									break;
							}
						}
						Events.trigger(composite, "afterAdd", { object });
						return composite;
					};
					/**
					* Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
					* Optionally searching its children recursively.
					* Triggers `beforeRemove` and `afterRemove` events on the `composite`.
					* @method remove
					* @param {composite} composite
					* @param {object|array} object
					* @param {boolean} [deep=false]
					* @return {composite} The original composite with the objects removed
					*/
					Composite.remove = function(composite, object, deep) {
						var objects = [].concat(object);
						Events.trigger(composite, "beforeRemove", { object });
						for (var i = 0; i < objects.length; i++) {
							var obj = objects[i];
							switch (obj.type) {
								case "body":
									Composite.removeBody(composite, obj, deep);
									break;
								case "constraint":
									Composite.removeConstraint(composite, obj, deep);
									break;
								case "composite":
									Composite.removeComposite(composite, obj, deep);
									break;
								case "mouseConstraint":
									Composite.removeConstraint(composite, obj.constraint);
									break;
							}
						}
						Events.trigger(composite, "afterRemove", { object });
						return composite;
					};
					/**
					* Adds a composite to the given composite.
					* @private
					* @method addComposite
					* @param {composite} compositeA
					* @param {composite} compositeB
					* @return {composite} The original compositeA with the objects from compositeB added
					*/
					Composite.addComposite = function(compositeA, compositeB) {
						compositeA.composites.push(compositeB);
						compositeB.parent = compositeA;
						Composite.setModified(compositeA, true, true, false);
						return compositeA;
					};
					/**
					* Removes a composite from the given composite, and optionally searching its children recursively.
					* @private
					* @method removeComposite
					* @param {composite} compositeA
					* @param {composite} compositeB
					* @param {boolean} [deep=false]
					* @return {composite} The original compositeA with the composite removed
					*/
					Composite.removeComposite = function(compositeA, compositeB, deep) {
						var position = Common.indexOf(compositeA.composites, compositeB);
						if (position !== -1) {
							var bodies = Composite.allBodies(compositeB);
							Composite.removeCompositeAt(compositeA, position);
							for (var i = 0; i < bodies.length; i++) bodies[i].sleepCounter = 0;
						}
						if (deep) for (var i = 0; i < compositeA.composites.length; i++) Composite.removeComposite(compositeA.composites[i], compositeB, true);
						return compositeA;
					};
					/**
					* Removes a composite from the given composite.
					* @private
					* @method removeCompositeAt
					* @param {composite} composite
					* @param {number} position
					* @return {composite} The original composite with the composite removed
					*/
					Composite.removeCompositeAt = function(composite, position) {
						composite.composites.splice(position, 1);
						Composite.setModified(composite, true, true, false);
						return composite;
					};
					/**
					* Adds a body to the given composite.
					* @private
					* @method addBody
					* @param {composite} composite
					* @param {body} body
					* @return {composite} The original composite with the body added
					*/
					Composite.addBody = function(composite, body) {
						composite.bodies.push(body);
						Composite.setModified(composite, true, true, false);
						return composite;
					};
					/**
					* Removes a body from the given composite, and optionally searching its children recursively.
					* @private
					* @method removeBody
					* @param {composite} composite
					* @param {body} body
					* @param {boolean} [deep=false]
					* @return {composite} The original composite with the body removed
					*/
					Composite.removeBody = function(composite, body, deep) {
						var position = Common.indexOf(composite.bodies, body);
						if (position !== -1) {
							Composite.removeBodyAt(composite, position);
							body.sleepCounter = 0;
						}
						if (deep) for (var i = 0; i < composite.composites.length; i++) Composite.removeBody(composite.composites[i], body, true);
						return composite;
					};
					/**
					* Removes a body from the given composite.
					* @private
					* @method removeBodyAt
					* @param {composite} composite
					* @param {number} position
					* @return {composite} The original composite with the body removed
					*/
					Composite.removeBodyAt = function(composite, position) {
						composite.bodies.splice(position, 1);
						Composite.setModified(composite, true, true, false);
						return composite;
					};
					/**
					* Adds a constraint to the given composite.
					* @private
					* @method addConstraint
					* @param {composite} composite
					* @param {constraint} constraint
					* @return {composite} The original composite with the constraint added
					*/
					Composite.addConstraint = function(composite, constraint) {
						composite.constraints.push(constraint);
						Composite.setModified(composite, true, true, false);
						return composite;
					};
					/**
					* Removes a constraint from the given composite, and optionally searching its children recursively.
					* @private
					* @method removeConstraint
					* @param {composite} composite
					* @param {constraint} constraint
					* @param {boolean} [deep=false]
					* @return {composite} The original composite with the constraint removed
					*/
					Composite.removeConstraint = function(composite, constraint, deep) {
						var position = Common.indexOf(composite.constraints, constraint);
						if (position !== -1) Composite.removeConstraintAt(composite, position);
						if (deep) for (var i = 0; i < composite.composites.length; i++) Composite.removeConstraint(composite.composites[i], constraint, true);
						return composite;
					};
					/**
					* Removes a body from the given composite.
					* @private
					* @method removeConstraintAt
					* @param {composite} composite
					* @param {number} position
					* @return {composite} The original composite with the constraint removed
					*/
					Composite.removeConstraintAt = function(composite, position) {
						composite.constraints.splice(position, 1);
						Composite.setModified(composite, true, true, false);
						return composite;
					};
					/**
					* Removes all bodies, constraints and composites from the given composite.
					* Optionally clearing its children recursively.
					* @method clear
					* @param {composite} composite
					* @param {boolean} keepStatic
					* @param {boolean} [deep=false]
					*/
					Composite.clear = function(composite, keepStatic, deep) {
						if (deep) for (var i = 0; i < composite.composites.length; i++) Composite.clear(composite.composites[i], keepStatic, true);
						if (keepStatic) composite.bodies = composite.bodies.filter(function(body) {
							return body.isStatic;
						});
						else composite.bodies.length = 0;
						composite.constraints.length = 0;
						composite.composites.length = 0;
						Composite.setModified(composite, true, true, false);
						return composite;
					};
					/**
					* Returns all bodies in the given composite, including all bodies in its children, recursively.
					* @method allBodies
					* @param {composite} composite
					* @return {body[]} All the bodies
					*/
					Composite.allBodies = function(composite) {
						if (composite.cache && composite.cache.allBodies) return composite.cache.allBodies;
						var bodies = [].concat(composite.bodies);
						for (var i = 0; i < composite.composites.length; i++) bodies = bodies.concat(Composite.allBodies(composite.composites[i]));
						if (composite.cache) composite.cache.allBodies = bodies;
						return bodies;
					};
					/**
					* Returns all constraints in the given composite, including all constraints in its children, recursively.
					* @method allConstraints
					* @param {composite} composite
					* @return {constraint[]} All the constraints
					*/
					Composite.allConstraints = function(composite) {
						if (composite.cache && composite.cache.allConstraints) return composite.cache.allConstraints;
						var constraints = [].concat(composite.constraints);
						for (var i = 0; i < composite.composites.length; i++) constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));
						if (composite.cache) composite.cache.allConstraints = constraints;
						return constraints;
					};
					/**
					* Returns all composites in the given composite, including all composites in its children, recursively.
					* @method allComposites
					* @param {composite} composite
					* @return {composite[]} All the composites
					*/
					Composite.allComposites = function(composite) {
						if (composite.cache && composite.cache.allComposites) return composite.cache.allComposites;
						var composites = [].concat(composite.composites);
						for (var i = 0; i < composite.composites.length; i++) composites = composites.concat(Composite.allComposites(composite.composites[i]));
						if (composite.cache) composite.cache.allComposites = composites;
						return composites;
					};
					/**
					* Searches the composite recursively for an object matching the type and id supplied, null if not found.
					* @method get
					* @param {composite} composite
					* @param {number} id
					* @param {string} type
					* @return {object} The requested object, if found
					*/
					Composite.get = function(composite, id, type) {
						var objects, object;
						switch (type) {
							case "body":
								objects = Composite.allBodies(composite);
								break;
							case "constraint":
								objects = Composite.allConstraints(composite);
								break;
							case "composite":
								objects = Composite.allComposites(composite).concat(composite);
								break;
						}
						if (!objects) return null;
						object = objects.filter(function(object) {
							return object.id.toString() === id.toString();
						});
						return object.length === 0 ? null : object[0];
					};
					/**
					* Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
					* @method move
					* @param {compositeA} compositeA
					* @param {object[]} objects
					* @param {compositeB} compositeB
					* @return {composite} Returns compositeA
					*/
					Composite.move = function(compositeA, objects, compositeB) {
						Composite.remove(compositeA, objects);
						Composite.add(compositeB, objects);
						return compositeA;
					};
					/**
					* Assigns new ids for all objects in the composite, recursively.
					* @method rebase
					* @param {composite} composite
					* @return {composite} Returns composite
					*/
					Composite.rebase = function(composite) {
						var objects = Composite.allBodies(composite).concat(Composite.allConstraints(composite)).concat(Composite.allComposites(composite));
						for (var i = 0; i < objects.length; i++) objects[i].id = Common.nextId();
						return composite;
					};
					/**
					* Translates all children in the composite by a given vector relative to their current positions, 
					* without imparting any velocity.
					* @method translate
					* @param {composite} composite
					* @param {vector} translation
					* @param {bool} [recursive=true]
					*/
					Composite.translate = function(composite, translation, recursive) {
						var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
						for (var i = 0; i < bodies.length; i++) Body.translate(bodies[i], translation);
						return composite;
					};
					/**
					* Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
					* @method rotate
					* @param {composite} composite
					* @param {number} rotation
					* @param {vector} point
					* @param {bool} [recursive=true]
					*/
					Composite.rotate = function(composite, rotation, point, recursive) {
						var cos = Math.cos(rotation), sin = Math.sin(rotation), bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
							Body.setPosition(body, {
								x: point.x + (dx * cos - dy * sin),
								y: point.y + (dx * sin + dy * cos)
							});
							Body.rotate(body, rotation);
						}
						return composite;
					};
					/**
					* Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
					* @method scale
					* @param {composite} composite
					* @param {number} scaleX
					* @param {number} scaleY
					* @param {vector} point
					* @param {bool} [recursive=true]
					*/
					Composite.scale = function(composite, scaleX, scaleY, point, recursive) {
						var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
							Body.setPosition(body, {
								x: point.x + dx * scaleX,
								y: point.y + dy * scaleY
							});
							Body.scale(body, scaleX, scaleY);
						}
						return composite;
					};
					/**
					* Returns the union of the bounds of all of the composite's bodies.
					* @method bounds
					* @param {composite} composite The composite.
					* @returns {bounds} The composite bounds.
					*/
					Composite.bounds = function(composite) {
						var bodies = Composite.allBodies(composite), vertices = [];
						for (var i = 0; i < bodies.length; i += 1) {
							var body = bodies[i];
							vertices.push(body.bounds.min, body.bounds.max);
						}
						return Bounds.create(vertices);
					};
					/**
					* Fired when a call to `Composite.add` is made, before objects have been added.
					*
					* @event beforeAdd
					* @param {} event An event object
					* @param {} event.object The object(s) to be added (may be a single body, constraint, composite or a mixed array of these)
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when a call to `Composite.add` is made, after objects have been added.
					*
					* @event afterAdd
					* @param {} event An event object
					* @param {} event.object The object(s) that have been added (may be a single body, constraint, composite or a mixed array of these)
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when a call to `Composite.remove` is made, before objects have been removed.
					*
					* @event beforeRemove
					* @param {} event An event object
					* @param {} event.object The object(s) to be removed (may be a single body, constraint, composite or a mixed array of these)
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when a call to `Composite.remove` is made, after objects have been removed.
					*
					* @event afterRemove
					* @param {} event An event object
					* @param {} event.object The object(s) that have been removed (may be a single body, constraint, composite or a mixed array of these)
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
					*
					* @property id
					* @type number
					*/
					/**
					* A `String` denoting the type of object.
					*
					* @property type
					* @type string
					* @default "composite"
					* @readOnly
					*/
					/**
					* An arbitrary `String` name to help the user identify and manage composites.
					*
					* @property label
					* @type string
					* @default "Composite"
					*/
					/**
					* A flag that specifies whether the composite has been modified during the current step.
					* This is automatically managed when bodies, constraints or composites are added or removed.
					*
					* @property isModified
					* @type boolean
					* @default false
					*/
					/**
					* The `Composite` that is the parent of this composite. It is automatically managed by the `Matter.Composite` methods.
					*
					* @property parent
					* @type composite
					* @default null
					*/
					/**
					* An array of `Body` that are _direct_ children of this composite.
					* To add or remove bodies you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
					* If you wish to recursively find all descendants, you should use the `Composite.allBodies` method.
					*
					* @property bodies
					* @type body[]
					* @default []
					*/
					/**
					* An array of `Constraint` that are _direct_ children of this composite.
					* To add or remove constraints you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
					* If you wish to recursively find all descendants, you should use the `Composite.allConstraints` method.
					*
					* @property constraints
					* @type constraint[]
					* @default []
					*/
					/**
					* An array of `Composite` that are _direct_ children of this composite.
					* To add or remove composites you should use `Composite.add` and `Composite.remove` methods rather than directly modifying this property.
					* If you wish to recursively find all descendants, you should use the `Composite.allComposites` method.
					*
					* @property composites
					* @type composite[]
					* @default []
					*/
					/**
					* An object reserved for storing plugin-specific properties.
					*
					* @property plugin
					* @type {}
					*/
					/**
					* An object used for storing cached results for performance reasons.
					* This is used internally only and is automatically managed.
					*
					* @private
					* @property cache
					* @type {}
					*/
				})();
			}),
			(function(module$10, exports$10, __webpack_require__) {
				/**
				* The `Matter.Sleeping` module contains methods to manage the sleeping state of bodies.
				*
				* @class Sleeping
				*/
				var Sleeping = {};
				module$10.exports = Sleeping;
				var Body = __webpack_require__(4);
				var Events = __webpack_require__(5);
				var Common = __webpack_require__(0);
				(function() {
					Sleeping._motionWakeThreshold = .18;
					Sleeping._motionSleepThreshold = .08;
					Sleeping._minBias = .9;
					/**
					* Puts bodies to sleep or wakes them up depending on their motion.
					* @method update
					* @param {body[]} bodies
					* @param {number} delta
					*/
					Sleeping.update = function(bodies, delta) {
						var timeScale = delta / Common._baseDelta, motionSleepThreshold = Sleeping._motionSleepThreshold;
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i], speed = Body.getSpeed(body), angularSpeed = Body.getAngularSpeed(body), motion = speed * speed + angularSpeed * angularSpeed;
							if (body.force.x !== 0 || body.force.y !== 0) {
								Sleeping.set(body, false);
								continue;
							}
							var minMotion = Math.min(body.motion, motion), maxMotion = Math.max(body.motion, motion);
							body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
							if (body.sleepThreshold > 0 && body.motion < motionSleepThreshold) {
								body.sleepCounter += 1;
								if (body.sleepCounter >= body.sleepThreshold / timeScale) Sleeping.set(body, true);
							} else if (body.sleepCounter > 0) body.sleepCounter -= 1;
						}
					};
					/**
					* Given a set of colliding pairs, wakes the sleeping bodies involved.
					* @method afterCollisions
					* @param {pair[]} pairs
					*/
					Sleeping.afterCollisions = function(pairs) {
						var motionSleepThreshold = Sleeping._motionSleepThreshold;
						for (var i = 0; i < pairs.length; i++) {
							var pair = pairs[i];
							if (!pair.isActive) continue;
							var collision = pair.collision, bodyA = collision.bodyA.parent, bodyB = collision.bodyB.parent;
							if (bodyA.isSleeping && bodyB.isSleeping || bodyA.isStatic || bodyB.isStatic) continue;
							if (bodyA.isSleeping || bodyB.isSleeping) {
								var sleepingBody = bodyA.isSleeping && !bodyA.isStatic ? bodyA : bodyB, movingBody = sleepingBody === bodyA ? bodyB : bodyA;
								if (!sleepingBody.isStatic && movingBody.motion > motionSleepThreshold) Sleeping.set(sleepingBody, false);
							}
						}
					};
					/**
					* Set a body as sleeping or awake.
					* @method set
					* @param {body} body
					* @param {boolean} isSleeping
					*/
					Sleeping.set = function(body, isSleeping) {
						var wasSleeping = body.isSleeping;
						if (isSleeping) {
							body.isSleeping = true;
							body.sleepCounter = body.sleepThreshold;
							body.positionImpulse.x = 0;
							body.positionImpulse.y = 0;
							body.positionPrev.x = body.position.x;
							body.positionPrev.y = body.position.y;
							body.anglePrev = body.angle;
							body.speed = 0;
							body.angularSpeed = 0;
							body.motion = 0;
							if (!wasSleeping) Events.trigger(body, "sleepStart");
						} else {
							body.isSleeping = false;
							body.sleepCounter = 0;
							if (wasSleeping) Events.trigger(body, "sleepEnd");
						}
					};
				})();
			}),
			(function(module$11, exports$11, __webpack_require__) {
				/**
				* The `Matter.Collision` module contains methods for detecting collisions between a given pair of bodies.
				*
				* For efficient detection between a list of bodies, see `Matter.Detector` and `Matter.Query`.
				*
				* See `Matter.Engine` for collision events.
				*
				* @class Collision
				*/
				var Collision = {};
				module$11.exports = Collision;
				var Vertices = __webpack_require__(3);
				var Pair = __webpack_require__(9);
				(function() {
					var _supports = [];
					var _overlapAB = {
						overlap: 0,
						axis: null
					};
					var _overlapBA = {
						overlap: 0,
						axis: null
					};
					/**
					* Creates a new collision record.
					* @method create
					* @param {body} bodyA The first body part represented by the collision record
					* @param {body} bodyB The second body part represented by the collision record
					* @return {collision} A new collision record
					*/
					Collision.create = function(bodyA, bodyB) {
						return {
							pair: null,
							collided: false,
							bodyA,
							bodyB,
							parentA: bodyA.parent,
							parentB: bodyB.parent,
							depth: 0,
							normal: {
								x: 0,
								y: 0
							},
							tangent: {
								x: 0,
								y: 0
							},
							penetration: {
								x: 0,
								y: 0
							},
							supports: [null, null],
							supportCount: 0
						};
					};
					/**
					* Detect collision between two bodies.
					* @method collides
					* @param {body} bodyA
					* @param {body} bodyB
					* @param {pairs} [pairs] Optionally reuse collision records from existing pairs.
					* @return {collision|null} A collision record if detected, otherwise null
					*/
					Collision.collides = function(bodyA, bodyB, pairs) {
						Collision._overlapAxes(_overlapAB, bodyA.vertices, bodyB.vertices, bodyA.axes);
						if (_overlapAB.overlap <= 0) return null;
						Collision._overlapAxes(_overlapBA, bodyB.vertices, bodyA.vertices, bodyB.axes);
						if (_overlapBA.overlap <= 0) return null;
						var pair = pairs && pairs.table[Pair.id(bodyA, bodyB)], collision;
						if (!pair) {
							collision = Collision.create(bodyA, bodyB);
							collision.collided = true;
							collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
							collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
							collision.parentA = collision.bodyA.parent;
							collision.parentB = collision.bodyB.parent;
						} else collision = pair.collision;
						bodyA = collision.bodyA;
						bodyB = collision.bodyB;
						var minOverlap;
						if (_overlapAB.overlap < _overlapBA.overlap) minOverlap = _overlapAB;
						else minOverlap = _overlapBA;
						var normal = collision.normal, tangent = collision.tangent, penetration = collision.penetration, supports = collision.supports, depth = minOverlap.overlap, minAxis = minOverlap.axis, normalX = minAxis.x, normalY = minAxis.y, deltaX = bodyB.position.x - bodyA.position.x, deltaY = bodyB.position.y - bodyA.position.y;
						if (normalX * deltaX + normalY * deltaY >= 0) {
							normalX = -normalX;
							normalY = -normalY;
						}
						normal.x = normalX;
						normal.y = normalY;
						tangent.x = -normalY;
						tangent.y = normalX;
						penetration.x = normalX * depth;
						penetration.y = normalY * depth;
						collision.depth = depth;
						var supportsB = Collision._findSupports(bodyA, bodyB, normal, 1), supportCount = 0;
						if (Vertices.contains(bodyA.vertices, supportsB[0])) supports[supportCount++] = supportsB[0];
						if (Vertices.contains(bodyA.vertices, supportsB[1])) supports[supportCount++] = supportsB[1];
						if (supportCount < 2) {
							var supportsA = Collision._findSupports(bodyB, bodyA, normal, -1);
							if (Vertices.contains(bodyB.vertices, supportsA[0])) supports[supportCount++] = supportsA[0];
							if (supportCount < 2 && Vertices.contains(bodyB.vertices, supportsA[1])) supports[supportCount++] = supportsA[1];
						}
						if (supportCount === 0) supports[supportCount++] = supportsB[0];
						collision.supportCount = supportCount;
						return collision;
					};
					/**
					* Find the overlap between two sets of vertices.
					* @method _overlapAxes
					* @private
					* @param {object} result
					* @param {vertices} verticesA
					* @param {vertices} verticesB
					* @param {axes} axes
					*/
					Collision._overlapAxes = function(result, verticesA, verticesB, axes) {
						var verticesALength = verticesA.length, verticesBLength = verticesB.length, verticesAX = verticesA[0].x, verticesAY = verticesA[0].y, verticesBX = verticesB[0].x, verticesBY = verticesB[0].y, axesLength = axes.length, overlapMin = Number.MAX_VALUE, overlapAxisNumber = 0, overlap, overlapAB, overlapBA, dot, i, j;
						for (i = 0; i < axesLength; i++) {
							var axis = axes[i], axisX = axis.x, axisY = axis.y, minA = verticesAX * axisX + verticesAY * axisY, minB = verticesBX * axisX + verticesBY * axisY, maxA = minA, maxB = minB;
							for (j = 1; j < verticesALength; j += 1) {
								dot = verticesA[j].x * axisX + verticesA[j].y * axisY;
								if (dot > maxA) maxA = dot;
								else if (dot < minA) minA = dot;
							}
							for (j = 1; j < verticesBLength; j += 1) {
								dot = verticesB[j].x * axisX + verticesB[j].y * axisY;
								if (dot > maxB) maxB = dot;
								else if (dot < minB) minB = dot;
							}
							overlapAB = maxA - minB;
							overlapBA = maxB - minA;
							overlap = overlapAB < overlapBA ? overlapAB : overlapBA;
							if (overlap < overlapMin) {
								overlapMin = overlap;
								overlapAxisNumber = i;
								if (overlap <= 0) break;
							}
						}
						result.axis = axes[overlapAxisNumber];
						result.overlap = overlapMin;
					};
					/**
					* Finds supporting vertices given two bodies along a given direction using hill-climbing.
					* @method _findSupports
					* @private
					* @param {body} bodyA
					* @param {body} bodyB
					* @param {vector} normal
					* @param {number} direction
					* @return [vector]
					*/
					Collision._findSupports = function(bodyA, bodyB, normal, direction) {
						var vertices = bodyB.vertices, verticesLength = vertices.length, bodyAPositionX = bodyA.position.x, bodyAPositionY = bodyA.position.y, normalX = normal.x * direction, normalY = normal.y * direction, vertexA = vertices[0], vertexB = vertexA, nearestDistance = normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y), vertexC, distance, j;
						for (j = 1; j < verticesLength; j += 1) {
							vertexB = vertices[j];
							distance = normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y);
							if (distance < nearestDistance) {
								nearestDistance = distance;
								vertexA = vertexB;
							}
						}
						vertexC = vertices[(verticesLength + vertexA.index - 1) % verticesLength];
						nearestDistance = normalX * (bodyAPositionX - vertexC.x) + normalY * (bodyAPositionY - vertexC.y);
						vertexB = vertices[(vertexA.index + 1) % verticesLength];
						if (normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y) < nearestDistance) {
							_supports[0] = vertexA;
							_supports[1] = vertexB;
							return _supports;
						}
						_supports[0] = vertexA;
						_supports[1] = vertexC;
						return _supports;
					};
					/**
					* A reference to the pair using this collision record, if there is one.
					*
					* @property pair
					* @type {pair|null}
					* @default null
					*/
					/**
					* A flag that indicates if the bodies were colliding when the collision was last updated.
					* 
					* @property collided
					* @type boolean
					* @default false
					*/
					/**
					* The first body part represented by the collision (see also `collision.parentA`).
					* 
					* @property bodyA
					* @type body
					*/
					/**
					* The second body part represented by the collision (see also `collision.parentB`).
					* 
					* @property bodyB
					* @type body
					*/
					/**
					* The first body represented by the collision (i.e. `collision.bodyA.parent`).
					* 
					* @property parentA
					* @type body
					*/
					/**
					* The second body represented by the collision (i.e. `collision.bodyB.parent`).
					* 
					* @property parentB
					* @type body
					*/
					/**
					* A `Number` that represents the minimum separating distance between the bodies along the collision normal.
					*
					* @readOnly
					* @property depth
					* @type number
					* @default 0
					*/
					/**
					* A normalised `Vector` that represents the direction between the bodies that provides the minimum separating distance.
					*
					* @property normal
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* A normalised `Vector` that is the tangent direction to the collision normal.
					*
					* @property tangent
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* A `Vector` that represents the direction and depth of the collision.
					*
					* @property penetration
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* An array of body vertices that represent the support points in the collision.
					* 
					* _Note:_ Only the first `collision.supportCount` items of `collision.supports` are active.
					* Therefore use `collision.supportCount` instead of `collision.supports.length` when iterating the active supports.
					* 
					* These are the deepest vertices (along the collision normal) of each body that are contained by the other body's vertices.
					*
					* @property supports
					* @type vector[]
					* @default []
					*/
					/**
					* The number of active supports for this collision found in `collision.supports`.
					* 
					* _Note:_ Only the first `collision.supportCount` items of `collision.supports` are active.
					* Therefore use `collision.supportCount` instead of `collision.supports.length` when iterating the active supports.
					*
					* @property supportCount
					* @type number
					* @default 0
					*/
				})();
			}),
			(function(module$12, exports$12, __webpack_require__) {
				/**
				* The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
				*
				* @class Pair
				*/
				var Pair = {};
				module$12.exports = Pair;
				var Contact = __webpack_require__(16);
				(function() {
					/**
					* Creates a pair.
					* @method create
					* @param {collision} collision
					* @param {number} timestamp
					* @return {pair} A new pair
					*/
					Pair.create = function(collision, timestamp) {
						var bodyA = collision.bodyA, bodyB = collision.bodyB;
						var pair = {
							id: Pair.id(bodyA, bodyB),
							bodyA,
							bodyB,
							collision,
							contacts: [Contact.create(), Contact.create()],
							contactCount: 0,
							separation: 0,
							isActive: true,
							isSensor: bodyA.isSensor || bodyB.isSensor,
							timeCreated: timestamp,
							timeUpdated: timestamp,
							inverseMass: 0,
							friction: 0,
							frictionStatic: 0,
							restitution: 0,
							slop: 0
						};
						Pair.update(pair, collision, timestamp);
						return pair;
					};
					/**
					* Updates a pair given a collision.
					* @method update
					* @param {pair} pair
					* @param {collision} collision
					* @param {number} timestamp
					*/
					Pair.update = function(pair, collision, timestamp) {
						var supports = collision.supports, supportCount = collision.supportCount, contacts = pair.contacts, parentA = collision.parentA, parentB = collision.parentB;
						pair.isActive = true;
						pair.timeUpdated = timestamp;
						pair.collision = collision;
						pair.separation = collision.depth;
						pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
						pair.friction = parentA.friction < parentB.friction ? parentA.friction : parentB.friction;
						pair.frictionStatic = parentA.frictionStatic > parentB.frictionStatic ? parentA.frictionStatic : parentB.frictionStatic;
						pair.restitution = parentA.restitution > parentB.restitution ? parentA.restitution : parentB.restitution;
						pair.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop;
						pair.contactCount = supportCount;
						collision.pair = pair;
						var supportA = supports[0], contactA = contacts[0], supportB = supports[1], contactB = contacts[1];
						if (contactB.vertex === supportA || contactA.vertex === supportB) {
							contacts[1] = contactA;
							contacts[0] = contactA = contactB;
							contactB = contacts[1];
						}
						contactA.vertex = supportA;
						contactB.vertex = supportB;
					};
					/**
					* Set a pair as active or inactive.
					* @method setActive
					* @param {pair} pair
					* @param {bool} isActive
					* @param {number} timestamp
					*/
					Pair.setActive = function(pair, isActive, timestamp) {
						if (isActive) {
							pair.isActive = true;
							pair.timeUpdated = timestamp;
						} else {
							pair.isActive = false;
							pair.contactCount = 0;
						}
					};
					/**
					* Get the id for the given pair.
					* @method id
					* @param {body} bodyA
					* @param {body} bodyB
					* @return {string} Unique pairId
					*/
					Pair.id = function(bodyA, bodyB) {
						return bodyA.id < bodyB.id ? bodyA.id.toString(36) + ":" + bodyB.id.toString(36) : bodyB.id.toString(36) + ":" + bodyA.id.toString(36);
					};
				})();
			}),
			(function(module$13, exports$13, __webpack_require__) {
				/**
				* The `Matter.Constraint` module contains methods for creating and manipulating constraints.
				* Constraints are used for specifying that a fixed distance must be maintained between two bodies (or a body and a fixed world-space position).
				* The stiffness of constraints can be modified to create springs or elastic.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Constraint
				*/
				var Constraint = {};
				module$13.exports = Constraint;
				var Vertices = __webpack_require__(3);
				var Vector = __webpack_require__(2);
				var Sleeping = __webpack_require__(7);
				var Bounds = __webpack_require__(1);
				var Axes = __webpack_require__(11);
				var Common = __webpack_require__(0);
				(function() {
					Constraint._warming = .4;
					Constraint._torqueDampen = 1;
					Constraint._minLength = 1e-6;
					/**
					* Creates a new constraint.
					* All properties have default values, and many are pre-calculated automatically based on other properties.
					* To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
					* If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
					* For compound bodies, constraints must be applied to the parent body (not one of its parts).
					* See the properties section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {} options
					* @return {constraint} constraint
					*/
					Constraint.create = function(options) {
						var constraint = options;
						if (constraint.bodyA && !constraint.pointA) constraint.pointA = {
							x: 0,
							y: 0
						};
						if (constraint.bodyB && !constraint.pointB) constraint.pointB = {
							x: 0,
							y: 0
						};
						var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA, initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB, length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
						constraint.length = typeof constraint.length !== "undefined" ? constraint.length : length;
						constraint.id = constraint.id || Common.nextId();
						constraint.label = constraint.label || "Constraint";
						constraint.type = "constraint";
						constraint.stiffness = constraint.stiffness || (constraint.length > 0 ? 1 : .7);
						constraint.damping = constraint.damping || 0;
						constraint.angularStiffness = constraint.angularStiffness || 0;
						constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
						constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
						constraint.plugin = {};
						var render = {
							visible: true,
							lineWidth: 2,
							strokeStyle: "#ffffff",
							type: "line",
							anchors: true
						};
						if (constraint.length === 0 && constraint.stiffness > .1) {
							render.type = "pin";
							render.anchors = false;
						} else if (constraint.stiffness < .9) render.type = "spring";
						constraint.render = Common.extend(render, constraint.render);
						return constraint;
					};
					/**
					* Prepares for solving by constraint warming.
					* @private
					* @method preSolveAll
					* @param {body[]} bodies
					*/
					Constraint.preSolveAll = function(bodies) {
						for (var i = 0; i < bodies.length; i += 1) {
							var body = bodies[i], impulse = body.constraintImpulse;
							if (body.isStatic || impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) continue;
							body.position.x += impulse.x;
							body.position.y += impulse.y;
							body.angle += impulse.angle;
						}
					};
					/**
					* Solves all constraints in a list of collisions.
					* @private
					* @method solveAll
					* @param {constraint[]} constraints
					* @param {number} delta
					*/
					Constraint.solveAll = function(constraints, delta) {
						var timeScale = Common.clamp(delta / Common._baseDelta, 0, 1);
						for (var i = 0; i < constraints.length; i += 1) {
							var constraint = constraints[i], fixedA = !constraint.bodyA || constraint.bodyA && constraint.bodyA.isStatic, fixedB = !constraint.bodyB || constraint.bodyB && constraint.bodyB.isStatic;
							if (fixedA || fixedB) Constraint.solve(constraints[i], timeScale);
						}
						for (i = 0; i < constraints.length; i += 1) {
							constraint = constraints[i];
							fixedA = !constraint.bodyA || constraint.bodyA && constraint.bodyA.isStatic;
							fixedB = !constraint.bodyB || constraint.bodyB && constraint.bodyB.isStatic;
							if (!fixedA && !fixedB) Constraint.solve(constraints[i], timeScale);
						}
					};
					/**
					* Solves a distance constraint with Gauss-Siedel method.
					* @private
					* @method solve
					* @param {constraint} constraint
					* @param {number} timeScale
					*/
					Constraint.solve = function(constraint, timeScale) {
						var bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointA = constraint.pointA, pointB = constraint.pointB;
						if (!bodyA && !bodyB) return;
						if (bodyA && !bodyA.isStatic) {
							Vector.rotate(pointA, bodyA.angle - constraint.angleA, pointA);
							constraint.angleA = bodyA.angle;
						}
						if (bodyB && !bodyB.isStatic) {
							Vector.rotate(pointB, bodyB.angle - constraint.angleB, pointB);
							constraint.angleB = bodyB.angle;
						}
						var pointAWorld = pointA, pointBWorld = pointB;
						if (bodyA) pointAWorld = Vector.add(bodyA.position, pointA);
						if (bodyB) pointBWorld = Vector.add(bodyB.position, pointB);
						if (!pointAWorld || !pointBWorld) return;
						var delta = Vector.sub(pointAWorld, pointBWorld), currentLength = Vector.magnitude(delta);
						if (currentLength < Constraint._minLength) currentLength = Constraint._minLength;
						var difference = (currentLength - constraint.length) / currentLength, stiffness = constraint.stiffness >= 1 || constraint.length === 0 ? constraint.stiffness * timeScale : constraint.stiffness * timeScale * timeScale, damping = constraint.damping * timeScale, force = Vector.mult(delta, difference * stiffness), massTotal = (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0), resistanceTotal = massTotal + ((bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0)), torque, share, normal, normalVelocity, relativeVelocity;
						if (damping > 0) {
							var zero = Vector.create();
							normal = Vector.div(delta, currentLength);
							relativeVelocity = Vector.sub(bodyB && Vector.sub(bodyB.position, bodyB.positionPrev) || zero, bodyA && Vector.sub(bodyA.position, bodyA.positionPrev) || zero);
							normalVelocity = Vector.dot(normal, relativeVelocity);
						}
						if (bodyA && !bodyA.isStatic) {
							share = bodyA.inverseMass / massTotal;
							bodyA.constraintImpulse.x -= force.x * share;
							bodyA.constraintImpulse.y -= force.y * share;
							bodyA.position.x -= force.x * share;
							bodyA.position.y -= force.y * share;
							if (damping > 0) {
								bodyA.positionPrev.x -= damping * normal.x * normalVelocity * share;
								bodyA.positionPrev.y -= damping * normal.y * normalVelocity * share;
							}
							torque = Vector.cross(pointA, force) / resistanceTotal * Constraint._torqueDampen * bodyA.inverseInertia * (1 - constraint.angularStiffness);
							bodyA.constraintImpulse.angle -= torque;
							bodyA.angle -= torque;
						}
						if (bodyB && !bodyB.isStatic) {
							share = bodyB.inverseMass / massTotal;
							bodyB.constraintImpulse.x += force.x * share;
							bodyB.constraintImpulse.y += force.y * share;
							bodyB.position.x += force.x * share;
							bodyB.position.y += force.y * share;
							if (damping > 0) {
								bodyB.positionPrev.x += damping * normal.x * normalVelocity * share;
								bodyB.positionPrev.y += damping * normal.y * normalVelocity * share;
							}
							torque = Vector.cross(pointB, force) / resistanceTotal * Constraint._torqueDampen * bodyB.inverseInertia * (1 - constraint.angularStiffness);
							bodyB.constraintImpulse.angle += torque;
							bodyB.angle += torque;
						}
					};
					/**
					* Performs body updates required after solving constraints.
					* @private
					* @method postSolveAll
					* @param {body[]} bodies
					*/
					Constraint.postSolveAll = function(bodies) {
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i], impulse = body.constraintImpulse;
							if (body.isStatic || impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) continue;
							Sleeping.set(body, false);
							for (var j = 0; j < body.parts.length; j++) {
								var part = body.parts[j];
								Vertices.translate(part.vertices, impulse);
								if (j > 0) {
									part.position.x += impulse.x;
									part.position.y += impulse.y;
								}
								if (impulse.angle !== 0) {
									Vertices.rotate(part.vertices, impulse.angle, body.position);
									Axes.rotate(part.axes, impulse.angle);
									if (j > 0) Vector.rotateAbout(part.position, impulse.angle, body.position, part.position);
								}
								Bounds.update(part.bounds, part.vertices, body.velocity);
							}
							impulse.angle *= Constraint._warming;
							impulse.x *= Constraint._warming;
							impulse.y *= Constraint._warming;
						}
					};
					/**
					* Returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
					* @method pointAWorld
					* @param {constraint} constraint
					* @returns {vector} the world-space position
					*/
					Constraint.pointAWorld = function(constraint) {
						return {
							x: (constraint.bodyA ? constraint.bodyA.position.x : 0) + (constraint.pointA ? constraint.pointA.x : 0),
							y: (constraint.bodyA ? constraint.bodyA.position.y : 0) + (constraint.pointA ? constraint.pointA.y : 0)
						};
					};
					/**
					* Returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
					* @method pointBWorld
					* @param {constraint} constraint
					* @returns {vector} the world-space position
					*/
					Constraint.pointBWorld = function(constraint) {
						return {
							x: (constraint.bodyB ? constraint.bodyB.position.x : 0) + (constraint.pointB ? constraint.pointB.x : 0),
							y: (constraint.bodyB ? constraint.bodyB.position.y : 0) + (constraint.pointB ? constraint.pointB.y : 0)
						};
					};
					/**
					* Returns the current length of the constraint. 
					* This is the distance between both of the constraint's end points.
					* See `constraint.length` for the target rest length.
					* @method currentLength
					* @param {constraint} constraint
					* @returns {number} the current length
					*/
					Constraint.currentLength = function(constraint) {
						var pointAX = (constraint.bodyA ? constraint.bodyA.position.x : 0) + (constraint.pointA ? constraint.pointA.x : 0);
						var pointAY = (constraint.bodyA ? constraint.bodyA.position.y : 0) + (constraint.pointA ? constraint.pointA.y : 0);
						var pointBX = (constraint.bodyB ? constraint.bodyB.position.x : 0) + (constraint.pointB ? constraint.pointB.x : 0);
						var pointBY = (constraint.bodyB ? constraint.bodyB.position.y : 0) + (constraint.pointB ? constraint.pointB.y : 0);
						var deltaX = pointAX - pointBX;
						var deltaY = pointAY - pointBY;
						return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					};
					/**
					* An integer `Number` uniquely identifying number generated in `Composite.create` by `Common.nextId`.
					*
					* @property id
					* @type number
					*/
					/**
					* A `String` denoting the type of object.
					*
					* @property type
					* @type string
					* @default "constraint"
					* @readOnly
					*/
					/**
					* An arbitrary `String` name to help the user identify and manage bodies.
					*
					* @property label
					* @type string
					* @default "Constraint"
					*/
					/**
					* An `Object` that defines the rendering properties to be consumed by the module `Matter.Render`.
					*
					* @property render
					* @type object
					*/
					/**
					* A flag that indicates if the constraint should be rendered.
					*
					* @property render.visible
					* @type boolean
					* @default true
					*/
					/**
					* A `Number` that defines the line width to use when rendering the constraint outline.
					* A value of `0` means no outline will be rendered.
					*
					* @property render.lineWidth
					* @type number
					* @default 2
					*/
					/**
					* A `String` that defines the stroke style to use when rendering the constraint outline.
					* It is the same as when using a canvas, so it accepts CSS style property values.
					*
					* @property render.strokeStyle
					* @type string
					* @default a random colour
					*/
					/**
					* A `String` that defines the constraint rendering type. 
					* The possible values are 'line', 'pin', 'spring'.
					* An appropriate render type will be automatically chosen unless one is given in options.
					*
					* @property render.type
					* @type string
					* @default 'line'
					*/
					/**
					* A `Boolean` that defines if the constraint's anchor points should be rendered.
					*
					* @property render.anchors
					* @type boolean
					* @default true
					*/
					/**
					* The first possible `Body` that this constraint is attached to.
					*
					* @property bodyA
					* @type body
					* @default null
					*/
					/**
					* The second possible `Body` that this constraint is attached to.
					*
					* @property bodyB
					* @type body
					* @default null
					*/
					/**
					* A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
					*
					* @property pointA
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyB` if defined, otherwise a world-space position.
					*
					* @property pointB
					* @type vector
					* @default { x: 0, y: 0 }
					*/
					/**
					* A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`.
					* A value of `1` means the constraint should be very stiff.
					* A value of `0.2` means the constraint acts like a soft spring.
					*
					* @property stiffness
					* @type number
					* @default 1
					*/
					/**
					* A `Number` that specifies the damping of the constraint, 
					* i.e. the amount of resistance applied to each body based on their velocities to limit the amount of oscillation.
					* Damping will only be apparent when the constraint also has a very low `stiffness`.
					* A value of `0.1` means the constraint will apply heavy damping, resulting in little to no oscillation.
					* A value of `0` means the constraint will apply no damping.
					*
					* @property damping
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that specifies the target resting length of the constraint. 
					* It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
					*
					* @property length
					* @type number
					*/
					/**
					* An object reserved for storing plugin-specific properties.
					*
					* @property plugin
					* @type {}
					*/
				})();
			}),
			(function(module$14, exports$14, __webpack_require__) {
				/**
				* The `Matter.Axes` module contains methods for creating and manipulating sets of axes.
				*
				* @class Axes
				*/
				var Axes = {};
				module$14.exports = Axes;
				var Vector = __webpack_require__(2);
				var Common = __webpack_require__(0);
				(function() {
					/**
					* Creates a new set of axes from the given vertices.
					* @method fromVertices
					* @param {vertices} vertices
					* @return {axes} A new axes from the given vertices
					*/
					Axes.fromVertices = function(vertices) {
						var axes = {};
						for (var i = 0; i < vertices.length; i++) {
							var j = (i + 1) % vertices.length, normal = Vector.normalise({
								x: vertices[j].y - vertices[i].y,
								y: vertices[i].x - vertices[j].x
							}), gradient = normal.y === 0 ? Infinity : normal.x / normal.y;
							gradient = gradient.toFixed(3).toString();
							axes[gradient] = normal;
						}
						return Common.values(axes);
					};
					/**
					* Rotates a set of axes by the given angle.
					* @method rotate
					* @param {axes} axes
					* @param {number} angle
					*/
					Axes.rotate = function(axes, angle) {
						if (angle === 0) return;
						var cos = Math.cos(angle), sin = Math.sin(angle);
						for (var i = 0; i < axes.length; i++) {
							var axis = axes[i], xx = axis.x * cos - axis.y * sin;
							axis.y = axis.x * sin + axis.y * cos;
							axis.x = xx;
						}
					};
				})();
			}),
			(function(module$15, exports$15, __webpack_require__) {
				/**
				* The `Matter.Bodies` module contains factory methods for creating rigid body models 
				* with commonly used body configurations (such as rectangles, circles and other polygons).
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Bodies
				*/
				var Bodies = {};
				module$15.exports = Bodies;
				var Vertices = __webpack_require__(3);
				var Common = __webpack_require__(0);
				var Body = __webpack_require__(4);
				var Bounds = __webpack_require__(1);
				var Vector = __webpack_require__(2);
				(function() {
					/**
					* Creates a new rigid body model with a rectangle hull. 
					* The options parameter is an object that specifies any properties you wish to override the defaults.
					* See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
					* @method rectangle
					* @param {number} x
					* @param {number} y
					* @param {number} width
					* @param {number} height
					* @param {object} [options]
					* @return {body} A new rectangle body
					*/
					Bodies.rectangle = function(x, y, width, height, options) {
						options = options || {};
						var rectangle = {
							label: "Rectangle Body",
							position: {
								x,
								y
							},
							vertices: Vertices.fromPath("L 0 0 L " + width + " 0 L " + width + " " + height + " L 0 " + height)
						};
						if (options.chamfer) {
							var chamfer = options.chamfer;
							rectangle.vertices = Vertices.chamfer(rectangle.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
							delete options.chamfer;
						}
						return Body.create(Common.extend({}, rectangle, options));
					};
					/**
					* Creates a new rigid body model with a trapezoid hull. 
					* The `slope` is parameterised as a fraction of `width` and must be < 1 to form a valid trapezoid. 
					* The options parameter is an object that specifies any properties you wish to override the defaults.
					* See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
					* @method trapezoid
					* @param {number} x
					* @param {number} y
					* @param {number} width
					* @param {number} height
					* @param {number} slope Must be a number < 1.
					* @param {object} [options]
					* @return {body} A new trapezoid body
					*/
					Bodies.trapezoid = function(x, y, width, height, slope, options) {
						options = options || {};
						if (slope >= 1) Common.warn("Bodies.trapezoid: slope parameter must be < 1.");
						slope *= .5;
						var roof = (1 - slope * 2) * width;
						var x1 = width * slope, x2 = x1 + roof, x3 = x2 + x1, verticesPath;
						if (slope < .5) verticesPath = "L 0 0 L " + x1 + " " + -height + " L " + x2 + " " + -height + " L " + x3 + " 0";
						else verticesPath = "L 0 0 L " + x2 + " " + -height + " L " + x3 + " 0";
						var trapezoid = {
							label: "Trapezoid Body",
							position: {
								x,
								y
							},
							vertices: Vertices.fromPath(verticesPath)
						};
						if (options.chamfer) {
							var chamfer = options.chamfer;
							trapezoid.vertices = Vertices.chamfer(trapezoid.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
							delete options.chamfer;
						}
						return Body.create(Common.extend({}, trapezoid, options));
					};
					/**
					* Creates a new rigid body model with a circle hull. 
					* The options parameter is an object that specifies any properties you wish to override the defaults.
					* See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
					* @method circle
					* @param {number} x
					* @param {number} y
					* @param {number} radius
					* @param {object} [options]
					* @param {number} [maxSides]
					* @return {body} A new circle body
					*/
					Bodies.circle = function(x, y, radius, options, maxSides) {
						options = options || {};
						var circle = {
							label: "Circle Body",
							circleRadius: radius
						};
						maxSides = maxSides || 25;
						var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
						if (sides % 2 === 1) sides += 1;
						return Bodies.polygon(x, y, sides, radius, Common.extend({}, circle, options));
					};
					/**
					* Creates a new rigid body model with a regular polygon hull with the given number of sides. 
					* The options parameter is an object that specifies any properties you wish to override the defaults.
					* See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
					* @method polygon
					* @param {number} x
					* @param {number} y
					* @param {number} sides
					* @param {number} radius
					* @param {object} [options]
					* @return {body} A new regular polygon body
					*/
					Bodies.polygon = function(x, y, sides, radius, options) {
						options = options || {};
						if (sides < 3) return Bodies.circle(x, y, radius, options);
						var theta = 2 * Math.PI / sides, path = "", offset = theta * .5;
						for (var i = 0; i < sides; i += 1) {
							var angle = offset + i * theta, xx = Math.cos(angle) * radius, yy = Math.sin(angle) * radius;
							path += "L " + xx.toFixed(3) + " " + yy.toFixed(3) + " ";
						}
						var polygon = {
							label: "Polygon Body",
							position: {
								x,
								y
							},
							vertices: Vertices.fromPath(path)
						};
						if (options.chamfer) {
							var chamfer = options.chamfer;
							polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
							delete options.chamfer;
						}
						return Body.create(Common.extend({}, polygon, options));
					};
					/**
					* Utility to create a compound body based on set(s) of vertices.
					* 
					* _Note:_ To optionally enable automatic concave vertices decomposition the [poly-decomp](https://github.com/schteppe/poly-decomp.js) 
					* package must be first installed and provided see `Common.setDecomp`, otherwise the convex hull of each vertex set will be used.
					* 
					* The resulting vertices are reorientated about their centre of mass,
					* and offset such that `body.position` corresponds to this point.
					* 
					* The resulting offset may be found if needed by subtracting `body.bounds` from the original input bounds.
					* To later move the centre of mass see `Body.setCentre`.
					* 
					* Note that automatic conconcave decomposition results are not always optimal. 
					* For best results, simplify the input vertices as much as possible first.
					* By default this function applies some addtional simplification to help.
					* 
					* Some outputs may also require further manual processing afterwards to be robust.
					* In particular some parts may need to be overlapped to avoid collision gaps.
					* Thin parts and sharp points should be avoided or removed where possible.
					*
					* The options parameter object specifies any `Matter.Body` properties you wish to override the defaults.
					* 
					* See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
					* @method fromVertices
					* @param {number} x
					* @param {number} y
					* @param {array} vertexSets One or more arrays of vertex points e.g. `[[{ x: 0, y: 0 }...], ...]`.
					* @param {object} [options] The body options.
					* @param {bool} [flagInternal=false] Optionally marks internal edges with `isInternal`.
					* @param {number} [removeCollinear=0.01] Threshold when simplifying vertices along the same edge.
					* @param {number} [minimumArea=10] Threshold when removing small parts.
					* @param {number} [removeDuplicatePoints=0.01] Threshold when simplifying nearby vertices.
					* @return {body}
					*/
					Bodies.fromVertices = function(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea, removeDuplicatePoints) {
						var decomp = Common.getDecomp(), canDecomp = Boolean(decomp && decomp.quickDecomp), body, parts, isConvex, isConcave, vertices, i, j, k, v, z;
						options = options || {};
						parts = [];
						flagInternal = typeof flagInternal !== "undefined" ? flagInternal : false;
						removeCollinear = typeof removeCollinear !== "undefined" ? removeCollinear : .01;
						minimumArea = typeof minimumArea !== "undefined" ? minimumArea : 10;
						removeDuplicatePoints = typeof removeDuplicatePoints !== "undefined" ? removeDuplicatePoints : .01;
						if (!Common.isArray(vertexSets[0])) vertexSets = [vertexSets];
						for (v = 0; v < vertexSets.length; v += 1) {
							vertices = vertexSets[v];
							isConvex = Vertices.isConvex(vertices);
							isConcave = !isConvex;
							if (isConcave && !canDecomp) Common.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices.");
							if (isConvex || !canDecomp) {
								if (isConvex) vertices = Vertices.clockwiseSort(vertices);
								else vertices = Vertices.hull(vertices);
								parts.push({
									position: {
										x,
										y
									},
									vertices
								});
							} else {
								var concave = vertices.map(function(vertex) {
									return [vertex.x, vertex.y];
								});
								decomp.makeCCW(concave);
								if (removeCollinear !== false) decomp.removeCollinearPoints(concave, removeCollinear);
								if (removeDuplicatePoints !== false && decomp.removeDuplicatePoints) decomp.removeDuplicatePoints(concave, removeDuplicatePoints);
								var decomposed = decomp.quickDecomp(concave);
								for (i = 0; i < decomposed.length; i++) {
									var chunkVertices = decomposed[i].map(function(vertices) {
										return {
											x: vertices[0],
											y: vertices[1]
										};
									});
									if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea) continue;
									parts.push({
										position: Vertices.centre(chunkVertices),
										vertices: chunkVertices
									});
								}
							}
						}
						for (i = 0; i < parts.length; i++) parts[i] = Body.create(Common.extend(parts[i], options));
						if (flagInternal) {
							var coincident_max_dist = 5;
							for (i = 0; i < parts.length; i++) {
								var partA = parts[i];
								for (j = i + 1; j < parts.length; j++) {
									var partB = parts[j];
									if (Bounds.overlaps(partA.bounds, partB.bounds)) {
										var pav = partA.vertices, pbv = partB.vertices;
										for (k = 0; k < partA.vertices.length; k++) for (z = 0; z < partB.vertices.length; z++) {
											var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])), db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));
											if (da < coincident_max_dist && db < coincident_max_dist) {
												pav[k].isInternal = true;
												pbv[z].isInternal = true;
											}
										}
									}
								}
							}
						}
						if (parts.length > 1) {
							body = Body.create(Common.extend({ parts: parts.slice(0) }, options));
							Body.setPosition(body, {
								x,
								y
							});
							return body;
						} else return parts[0];
					};
				})();
			}),
			(function(module$16, exports$16, __webpack_require__) {
				/**
				* The `Matter.Detector` module contains methods for efficiently detecting collisions between a list of bodies using a broadphase algorithm.
				*
				* @class Detector
				*/
				var Detector = {};
				module$16.exports = Detector;
				var Common = __webpack_require__(0);
				var Collision = __webpack_require__(8);
				(function() {
					/**
					* Creates a new collision detector.
					* @method create
					* @param {} options
					* @return {detector} A new collision detector
					*/
					Detector.create = function(options) {
						return Common.extend({
							bodies: [],
							collisions: [],
							pairs: null
						}, options);
					};
					/**
					* Sets the list of bodies in the detector.
					* @method setBodies
					* @param {detector} detector
					* @param {body[]} bodies
					*/
					Detector.setBodies = function(detector, bodies) {
						detector.bodies = bodies.slice(0);
					};
					/**
					* Clears the detector including its list of bodies.
					* @method clear
					* @param {detector} detector
					*/
					Detector.clear = function(detector) {
						detector.bodies = [];
						detector.collisions = [];
					};
					/**
					* Efficiently finds all collisions among all the bodies in `detector.bodies` using a broadphase algorithm.
					* 
					* _Note:_ The specific ordering of collisions returned is not guaranteed between releases and may change for performance reasons.
					* If a specific ordering is required then apply a sort to the resulting array.
					* @method collisions
					* @param {detector} detector
					* @return {collision[]} collisions
					*/
					Detector.collisions = function(detector) {
						var pairs = detector.pairs, bodies = detector.bodies, bodiesLength = bodies.length, canCollide = Detector.canCollide, collides = Collision.collides, collisions = detector.collisions, collisionIndex = 0, i, j;
						bodies.sort(Detector._compareBoundsX);
						for (i = 0; i < bodiesLength; i++) {
							var bodyA = bodies[i], boundsA = bodyA.bounds, boundXMax = bodyA.bounds.max.x, boundYMax = bodyA.bounds.max.y, boundYMin = bodyA.bounds.min.y, bodyAStatic = bodyA.isStatic || bodyA.isSleeping, partsALength = bodyA.parts.length, partsASingle = partsALength === 1;
							for (j = i + 1; j < bodiesLength; j++) {
								var bodyB = bodies[j], boundsB = bodyB.bounds;
								if (boundsB.min.x > boundXMax) break;
								if (boundYMax < boundsB.min.y || boundYMin > boundsB.max.y) continue;
								if (bodyAStatic && (bodyB.isStatic || bodyB.isSleeping)) continue;
								if (!canCollide(bodyA.collisionFilter, bodyB.collisionFilter)) continue;
								var partsBLength = bodyB.parts.length;
								if (partsASingle && partsBLength === 1) {
									var collision = collides(bodyA, bodyB, pairs);
									if (collision) collisions[collisionIndex++] = collision;
								} else {
									var partsAStart = partsALength > 1 ? 1 : 0, partsBStart = partsBLength > 1 ? 1 : 0;
									for (var k = partsAStart; k < partsALength; k++) {
										var partA = bodyA.parts[k], boundsA = partA.bounds;
										for (var z = partsBStart; z < partsBLength; z++) {
											var partB = bodyB.parts[z], boundsB = partB.bounds;
											if (boundsA.min.x > boundsB.max.x || boundsA.max.x < boundsB.min.x || boundsA.max.y < boundsB.min.y || boundsA.min.y > boundsB.max.y) continue;
											var collision = collides(partA, partB, pairs);
											if (collision) collisions[collisionIndex++] = collision;
										}
									}
								}
							}
						}
						if (collisions.length !== collisionIndex) collisions.length = collisionIndex;
						return collisions;
					};
					/**
					* Returns `true` if both supplied collision filters will allow a collision to occur.
					* See `body.collisionFilter` for more information.
					* @method canCollide
					* @param {} filterA
					* @param {} filterB
					* @return {bool} `true` if collision can occur
					*/
					Detector.canCollide = function(filterA, filterB) {
						if (filterA.group === filterB.group && filterA.group !== 0) return filterA.group > 0;
						return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
					};
					/**
					* The comparison function used in the broadphase algorithm.
					* Returns the signed delta of the bodies bounds on the x-axis.
					* @private
					* @method _sortCompare
					* @param {body} bodyA
					* @param {body} bodyB
					* @return {number} The signed delta used for sorting
					*/
					Detector._compareBoundsX = function(bodyA, bodyB) {
						return bodyA.bounds.min.x - bodyB.bounds.min.x;
					};
					/**
					* The array of `Matter.Body` between which the detector finds collisions.
					* 
					* _Note:_ The order of bodies in this array _is not fixed_ and will be continually managed by the detector.
					* @property bodies
					* @type body[]
					* @default []
					*/
					/**
					* The array of `Matter.Collision` found in the last call to `Detector.collisions` on this detector.
					* @property collisions
					* @type collision[]
					* @default []
					*/
					/**
					* Optional. A `Matter.Pairs` object from which previous collision objects may be reused. Intended for internal `Matter.Engine` usage.
					* @property pairs
					* @type {pairs|null}
					* @default null
					*/
				})();
			}),
			(function(module$17, exports$17, __webpack_require__) {
				/**
				* The `Matter.Mouse` module contains methods for creating and manipulating mouse inputs.
				*
				* @class Mouse
				*/
				var Mouse = {};
				module$17.exports = Mouse;
				var Common = __webpack_require__(0);
				(function() {
					/**
					* Creates a mouse input.
					* @method create
					* @param {HTMLElement} element
					* @return {mouse} A new mouse
					*/
					Mouse.create = function(element) {
						var mouse = {};
						if (!element) Common.log("Mouse.create: element was undefined, defaulting to document.body", "warn");
						mouse.element = element || document.body;
						mouse.absolute = {
							x: 0,
							y: 0
						};
						mouse.position = {
							x: 0,
							y: 0
						};
						mouse.mousedownPosition = {
							x: 0,
							y: 0
						};
						mouse.mouseupPosition = {
							x: 0,
							y: 0
						};
						mouse.offset = {
							x: 0,
							y: 0
						};
						mouse.scale = {
							x: 1,
							y: 1
						};
						mouse.wheelDelta = 0;
						mouse.button = -1;
						mouse.pixelRatio = parseInt(mouse.element.getAttribute("data-pixel-ratio"), 10) || 1;
						mouse.sourceEvents = {
							mousemove: null,
							mousedown: null,
							mouseup: null,
							mousewheel: null
						};
						mouse.mousemove = function(event) {
							var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
							if (event.changedTouches) {
								mouse.button = 0;
								event.preventDefault();
							}
							mouse.absolute.x = position.x;
							mouse.absolute.y = position.y;
							mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
							mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
							mouse.sourceEvents.mousemove = event;
						};
						mouse.mousedown = function(event) {
							var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
							if (event.changedTouches) {
								mouse.button = 0;
								event.preventDefault();
							} else mouse.button = event.button;
							mouse.absolute.x = position.x;
							mouse.absolute.y = position.y;
							mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
							mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
							mouse.mousedownPosition.x = mouse.position.x;
							mouse.mousedownPosition.y = mouse.position.y;
							mouse.sourceEvents.mousedown = event;
						};
						mouse.mouseup = function(event) {
							var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio);
							if (event.changedTouches) event.preventDefault();
							mouse.button = -1;
							mouse.absolute.x = position.x;
							mouse.absolute.y = position.y;
							mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
							mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
							mouse.mouseupPosition.x = mouse.position.x;
							mouse.mouseupPosition.y = mouse.position.y;
							mouse.sourceEvents.mouseup = event;
						};
						mouse.mousewheel = function(event) {
							mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
							event.preventDefault();
							mouse.sourceEvents.mousewheel = event;
						};
						Mouse.setElement(mouse, mouse.element);
						return mouse;
					};
					/**
					* Sets the element the mouse is bound to (and relative to).
					* @method setElement
					* @param {mouse} mouse
					* @param {HTMLElement} element
					*/
					Mouse.setElement = function(mouse, element) {
						mouse.element = element;
						element.addEventListener("mousemove", mouse.mousemove, { passive: true });
						element.addEventListener("mousedown", mouse.mousedown, { passive: true });
						element.addEventListener("mouseup", mouse.mouseup, { passive: true });
						element.addEventListener("wheel", mouse.mousewheel, { passive: false });
						element.addEventListener("touchmove", mouse.mousemove, { passive: false });
						element.addEventListener("touchstart", mouse.mousedown, { passive: false });
						element.addEventListener("touchend", mouse.mouseup, { passive: false });
					};
					/**
					* Clears all captured source events.
					* @method clearSourceEvents
					* @param {mouse} mouse
					*/
					Mouse.clearSourceEvents = function(mouse) {
						mouse.sourceEvents.mousemove = null;
						mouse.sourceEvents.mousedown = null;
						mouse.sourceEvents.mouseup = null;
						mouse.sourceEvents.mousewheel = null;
						mouse.wheelDelta = 0;
					};
					/**
					* Sets the mouse position offset.
					* @method setOffset
					* @param {mouse} mouse
					* @param {vector} offset
					*/
					Mouse.setOffset = function(mouse, offset) {
						mouse.offset.x = offset.x;
						mouse.offset.y = offset.y;
						mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
						mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
					};
					/**
					* Sets the mouse position scale.
					* @method setScale
					* @param {mouse} mouse
					* @param {vector} scale
					*/
					Mouse.setScale = function(mouse, scale) {
						mouse.scale.x = scale.x;
						mouse.scale.y = scale.y;
						mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
						mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
					};
					/**
					* Gets the mouse position relative to an element given a screen pixel ratio.
					* @method _getRelativeMousePosition
					* @private
					* @param {} event
					* @param {} element
					* @param {number} pixelRatio
					* @return {}
					*/
					Mouse._getRelativeMousePosition = function(event, element, pixelRatio) {
						var elementBounds = element.getBoundingClientRect(), rootNode = document.documentElement || document.body.parentNode || document.body, scrollX = window.pageXOffset !== void 0 ? window.pageXOffset : rootNode.scrollLeft, scrollY = window.pageYOffset !== void 0 ? window.pageYOffset : rootNode.scrollTop, touches = event.changedTouches, x, y;
						if (touches) {
							x = touches[0].pageX - elementBounds.left - scrollX;
							y = touches[0].pageY - elementBounds.top - scrollY;
						} else {
							x = event.pageX - elementBounds.left - scrollX;
							y = event.pageY - elementBounds.top - scrollY;
						}
						return {
							x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
							y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
						};
					};
				})();
			}),
			(function(module$18, exports$18, __webpack_require__) {
				/**
				* The `Matter.Plugin` module contains functions for registering and installing plugins on modules.
				*
				* @class Plugin
				*/
				var Plugin = {};
				module$18.exports = Plugin;
				var Common = __webpack_require__(0);
				(function() {
					Plugin._registry = {};
					/**
					* Registers a plugin object so it can be resolved later by name.
					* @method register
					* @param plugin {} The plugin to register.
					* @return {object} The plugin.
					*/
					Plugin.register = function(plugin) {
						if (!Plugin.isPlugin(plugin)) Common.warn("Plugin.register:", Plugin.toString(plugin), "does not implement all required fields.");
						if (plugin.name in Plugin._registry) {
							var registered = Plugin._registry[plugin.name], pluginVersion = Plugin.versionParse(plugin.version).number, registeredVersion = Plugin.versionParse(registered.version).number;
							if (pluginVersion > registeredVersion) {
								Common.warn("Plugin.register:", Plugin.toString(registered), "was upgraded to", Plugin.toString(plugin));
								Plugin._registry[plugin.name] = plugin;
							} else if (pluginVersion < registeredVersion) Common.warn("Plugin.register:", Plugin.toString(registered), "can not be downgraded to", Plugin.toString(plugin));
							else if (plugin !== registered) Common.warn("Plugin.register:", Plugin.toString(plugin), "is already registered to different plugin object");
						} else Plugin._registry[plugin.name] = plugin;
						return plugin;
					};
					/**
					* Resolves a dependency to a plugin object from the registry if it exists. 
					* The `dependency` may contain a version, but only the name matters when resolving.
					* @method resolve
					* @param dependency {string} The dependency.
					* @return {object} The plugin if resolved, otherwise `undefined`.
					*/
					Plugin.resolve = function(dependency) {
						return Plugin._registry[Plugin.dependencyParse(dependency).name];
					};
					/**
					* Returns a pretty printed plugin name and version.
					* @method toString
					* @param plugin {} The plugin.
					* @return {string} Pretty printed plugin name and version.
					*/
					Plugin.toString = function(plugin) {
						return typeof plugin === "string" ? plugin : (plugin.name || "anonymous") + "@" + (plugin.version || plugin.range || "0.0.0");
					};
					/**
					* Returns `true` if the object meets the minimum standard to be considered a plugin.
					* This means it must define the following properties:
					* - `name`
					* - `version`
					* - `install`
					* @method isPlugin
					* @param obj {} The obj to test.
					* @return {boolean} `true` if the object can be considered a plugin otherwise `false`.
					*/
					Plugin.isPlugin = function(obj) {
						return obj && obj.name && obj.version && obj.install;
					};
					/**
					* Returns `true` if a plugin with the given `name` been installed on `module`.
					* @method isUsed
					* @param module {} The module.
					* @param name {string} The plugin name.
					* @return {boolean} `true` if a plugin with the given `name` been installed on `module`, otherwise `false`.
					*/
					Plugin.isUsed = function(module$19, name) {
						return module$19.used.indexOf(name) > -1;
					};
					/**
					* Returns `true` if `plugin.for` is applicable to `module` by comparing against `module.name` and `module.version`.
					* If `plugin.for` is not specified then it is assumed to be applicable.
					* The value of `plugin.for` is a string of the format `'module-name'` or `'module-name@version'`.
					* @method isFor
					* @param plugin {} The plugin.
					* @param module {} The module.
					* @return {boolean} `true` if `plugin.for` is applicable to `module`, otherwise `false`.
					*/
					Plugin.isFor = function(plugin, module$20) {
						var parsed = plugin.for && Plugin.dependencyParse(plugin.for);
						return !plugin.for || module$20.name === parsed.name && Plugin.versionSatisfies(module$20.version, parsed.range);
					};
					/**
					* Installs the plugins by calling `plugin.install` on each plugin specified in `plugins` if passed, otherwise `module.uses`.
					* For installing plugins on `Matter` see the convenience function `Matter.use`.
					* Plugins may be specified either by their name or a reference to the plugin object.
					* Plugins themselves may specify further dependencies, but each plugin is installed only once.
					* Order is important, a topological sort is performed to find the best resulting order of installation.
					* This sorting attempts to satisfy every dependency's requested ordering, but may not be exact in all cases.
					* This function logs the resulting status of each dependency in the console, along with any warnings.
					* - A green tick ✅ indicates a dependency was resolved and installed.
					* - An orange diamond 🔶 indicates a dependency was resolved but a warning was thrown for it or one if its dependencies.
					* - A red cross ❌ indicates a dependency could not be resolved.
					* Avoid calling this function multiple times on the same module unless you intend to manually control installation order.
					* @method use
					* @param module {} The module install plugins on.
					* @param [plugins=module.uses] {} The plugins to install on module (optional, defaults to `module.uses`).
					*/
					Plugin.use = function(module$21, plugins) {
						module$21.uses = (module$21.uses || []).concat(plugins || []);
						if (module$21.uses.length === 0) {
							Common.warn("Plugin.use:", Plugin.toString(module$21), "does not specify any dependencies to install.");
							return;
						}
						var dependencies = Plugin.dependencies(module$21), sortedDependencies = Common.topologicalSort(dependencies), status = [];
						for (var i = 0; i < sortedDependencies.length; i += 1) {
							if (sortedDependencies[i] === module$21.name) continue;
							var plugin = Plugin.resolve(sortedDependencies[i]);
							if (!plugin) {
								status.push("❌ " + sortedDependencies[i]);
								continue;
							}
							if (Plugin.isUsed(module$21, plugin.name)) continue;
							if (!Plugin.isFor(plugin, module$21)) {
								Common.warn("Plugin.use:", Plugin.toString(plugin), "is for", plugin.for, "but installed on", Plugin.toString(module$21) + ".");
								plugin._warned = true;
							}
							if (plugin.install) plugin.install(module$21);
							else {
								Common.warn("Plugin.use:", Plugin.toString(plugin), "does not specify an install function.");
								plugin._warned = true;
							}
							if (plugin._warned) {
								status.push("🔶 " + Plugin.toString(plugin));
								delete plugin._warned;
							} else status.push("✅ " + Plugin.toString(plugin));
							module$21.used.push(plugin.name);
						}
						if (status.length > 0) Common.info(status.join("  "));
					};
					/**
					* Recursively finds all of a module's dependencies and returns a flat dependency graph.
					* @method dependencies
					* @param module {} The module.
					* @return {object} A dependency graph.
					*/
					Plugin.dependencies = function(module$22, tracked) {
						var parsedBase = Plugin.dependencyParse(module$22), name = parsedBase.name;
						tracked = tracked || {};
						if (name in tracked) return;
						module$22 = Plugin.resolve(module$22) || module$22;
						tracked[name] = Common.map(module$22.uses || [], function(dependency) {
							if (Plugin.isPlugin(dependency)) Plugin.register(dependency);
							var parsed = Plugin.dependencyParse(dependency), resolved = Plugin.resolve(dependency);
							if (resolved && !Plugin.versionSatisfies(resolved.version, parsed.range)) {
								Common.warn("Plugin.dependencies:", Plugin.toString(resolved), "does not satisfy", Plugin.toString(parsed), "used by", Plugin.toString(parsedBase) + ".");
								resolved._warned = true;
								module$22._warned = true;
							} else if (!resolved) {
								Common.warn("Plugin.dependencies:", Plugin.toString(dependency), "used by", Plugin.toString(parsedBase), "could not be resolved.");
								module$22._warned = true;
							}
							return parsed.name;
						});
						for (var i = 0; i < tracked[name].length; i += 1) Plugin.dependencies(tracked[name][i], tracked);
						return tracked;
					};
					/**
					* Parses a dependency string into its components.
					* The `dependency` is a string of the format `'module-name'` or `'module-name@version'`.
					* See documentation for `Plugin.versionParse` for a description of the format.
					* This function can also handle dependencies that are already resolved (e.g. a module object).
					* @method dependencyParse
					* @param dependency {string} The dependency of the format `'module-name'` or `'module-name@version'`.
					* @return {object} The dependency parsed into its components.
					*/
					Plugin.dependencyParse = function(dependency) {
						if (Common.isString(dependency)) {
							if (!/^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/.test(dependency)) Common.warn("Plugin.dependencyParse:", dependency, "is not a valid dependency string.");
							return {
								name: dependency.split("@")[0],
								range: dependency.split("@")[1] || "*"
							};
						}
						return {
							name: dependency.name,
							range: dependency.range || dependency.version
						};
					};
					/**
					* Parses a version string into its components.  
					* Versions are strictly of the format `x.y.z` (as in [semver](http://semver.org/)).
					* Versions may optionally have a prerelease tag in the format `x.y.z-alpha`.
					* Ranges are a strict subset of [npm ranges](https://docs.npmjs.com/misc/semver#advanced-range-syntax).
					* Only the following range types are supported:
					* - Tilde ranges e.g. `~1.2.3`
					* - Caret ranges e.g. `^1.2.3`
					* - Greater than ranges e.g. `>1.2.3`
					* - Greater than or equal ranges e.g. `>=1.2.3`
					* - Exact version e.g. `1.2.3`
					* - Any version `*`
					* @method versionParse
					* @param range {string} The version string.
					* @return {object} The version range parsed into its components.
					*/
					Plugin.versionParse = function(range) {
						var pattern = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
						if (!pattern.test(range)) Common.warn("Plugin.versionParse:", range, "is not a valid version or range.");
						var parts = pattern.exec(range);
						var major = Number(parts[4]);
						var minor = Number(parts[5]);
						var patch = Number(parts[6]);
						return {
							isRange: Boolean(parts[1] || parts[2]),
							version: parts[3],
							range,
							operator: parts[1] || parts[2] || "",
							major,
							minor,
							patch,
							parts: [
								major,
								minor,
								patch
							],
							prerelease: parts[7],
							number: major * 1e8 + minor * 1e4 + patch
						};
					};
					/**
					* Returns `true` if `version` satisfies the given `range`.
					* See documentation for `Plugin.versionParse` for a description of the format.
					* If a version or range is not specified, then any version (`*`) is assumed to satisfy.
					* @method versionSatisfies
					* @param version {string} The version string.
					* @param range {string} The range string.
					* @return {boolean} `true` if `version` satisfies `range`, otherwise `false`.
					*/
					Plugin.versionSatisfies = function(version, range) {
						range = range || "*";
						var r = Plugin.versionParse(range), v = Plugin.versionParse(version);
						if (r.isRange) {
							if (r.operator === "*" || version === "*") return true;
							if (r.operator === ">") return v.number > r.number;
							if (r.operator === ">=") return v.number >= r.number;
							if (r.operator === "~") return v.major === r.major && v.minor === r.minor && v.patch >= r.patch;
							if (r.operator === "^") {
								if (r.major > 0) return v.major === r.major && v.number >= r.number;
								if (r.minor > 0) return v.minor === r.minor && v.patch >= r.patch;
								return v.patch === r.patch;
							}
						}
						return version === range || version === "*";
					};
				})();
			}),
			(function(module$23, exports$19) {
				/**
				* The `Matter.Contact` module contains methods for creating and manipulating collision contacts.
				*
				* @class Contact
				*/
				var Contact = {};
				module$23.exports = Contact;
				(function() {
					/**
					* Creates a new contact.
					* @method create
					* @param {vertex} [vertex]
					* @return {contact} A new contact
					*/
					Contact.create = function(vertex) {
						return {
							vertex,
							normalImpulse: 0,
							tangentImpulse: 0
						};
					};
				})();
			}),
			(function(module$24, exports$20, __webpack_require__) {
				/**
				* The `Matter.Engine` module contains methods for creating and manipulating engines.
				* An engine is a controller that manages updating the simulation of the world.
				* See `Matter.Runner` for an optional game loop utility.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Engine
				*/
				var Engine = {};
				module$24.exports = Engine;
				var Sleeping = __webpack_require__(7);
				var Resolver = __webpack_require__(18);
				var Detector = __webpack_require__(13);
				var Pairs = __webpack_require__(19);
				var Events = __webpack_require__(5);
				var Composite = __webpack_require__(6);
				var Constraint = __webpack_require__(10);
				var Common = __webpack_require__(0);
				var Body = __webpack_require__(4);
				(function() {
					Engine._deltaMax = 1e3 / 60;
					/**
					* Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
					* All properties have default values, and many are pre-calculated automatically based on other properties.
					* See the properties section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {object} [options]
					* @return {engine} engine
					*/
					Engine.create = function(options) {
						options = options || {};
						var engine = Common.extend({
							positionIterations: 6,
							velocityIterations: 4,
							constraintIterations: 2,
							enableSleeping: false,
							events: [],
							plugin: {},
							gravity: {
								x: 0,
								y: 1,
								scale: .001
							},
							timing: {
								timestamp: 0,
								timeScale: 1,
								lastDelta: 0,
								lastElapsed: 0,
								lastUpdatesPerFrame: 0
							}
						}, options);
						engine.world = options.world || Composite.create({ label: "World" });
						engine.pairs = options.pairs || Pairs.create();
						engine.detector = options.detector || Detector.create();
						engine.detector.pairs = engine.pairs;
						engine.grid = { buckets: [] };
						engine.world.gravity = engine.gravity;
						engine.broadphase = engine.grid;
						engine.metrics = {};
						return engine;
					};
					/**
					* Moves the simulation forward in time by `delta` milliseconds.
					* Triggers `beforeUpdate`, `beforeSolve` and `afterUpdate` events.
					* Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
					* @method update
					* @param {engine} engine
					* @param {number} [delta=16.666]
					*/
					Engine.update = function(engine, delta) {
						var startTime = Common.now();
						var world = engine.world, detector = engine.detector, pairs = engine.pairs, timing = engine.timing, timestamp = timing.timestamp, i;
						if (delta > Engine._deltaMax) Common.warnOnce("Matter.Engine.update: delta argument is recommended to be less than or equal to", Engine._deltaMax.toFixed(3), "ms.");
						delta = typeof delta !== "undefined" ? delta : Common._baseDelta;
						delta *= timing.timeScale;
						timing.timestamp += delta;
						timing.lastDelta = delta;
						var event = {
							timestamp: timing.timestamp,
							delta
						};
						Events.trigger(engine, "beforeUpdate", event);
						var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world);
						if (world.isModified) {
							Detector.setBodies(detector, allBodies);
							Composite.setModified(world, false, false, true);
						}
						if (engine.enableSleeping) Sleeping.update(allBodies, delta);
						Engine._bodiesApplyGravity(allBodies, engine.gravity);
						if (delta > 0) Engine._bodiesUpdate(allBodies, delta);
						Events.trigger(engine, "beforeSolve", event);
						Constraint.preSolveAll(allBodies);
						for (i = 0; i < engine.constraintIterations; i++) Constraint.solveAll(allConstraints, delta);
						Constraint.postSolveAll(allBodies);
						var collisions = Detector.collisions(detector);
						Pairs.update(pairs, collisions, timestamp);
						if (engine.enableSleeping) Sleeping.afterCollisions(pairs.list);
						if (pairs.collisionStart.length > 0) Events.trigger(engine, "collisionStart", {
							pairs: pairs.collisionStart,
							timestamp: timing.timestamp,
							delta
						});
						var positionDamping = Common.clamp(20 / engine.positionIterations, 0, 1);
						Resolver.preSolvePosition(pairs.list);
						for (i = 0; i < engine.positionIterations; i++) Resolver.solvePosition(pairs.list, delta, positionDamping);
						Resolver.postSolvePosition(allBodies);
						Constraint.preSolveAll(allBodies);
						for (i = 0; i < engine.constraintIterations; i++) Constraint.solveAll(allConstraints, delta);
						Constraint.postSolveAll(allBodies);
						Resolver.preSolveVelocity(pairs.list);
						for (i = 0; i < engine.velocityIterations; i++) Resolver.solveVelocity(pairs.list, delta);
						Engine._bodiesUpdateVelocities(allBodies);
						if (pairs.collisionActive.length > 0) Events.trigger(engine, "collisionActive", {
							pairs: pairs.collisionActive,
							timestamp: timing.timestamp,
							delta
						});
						if (pairs.collisionEnd.length > 0) Events.trigger(engine, "collisionEnd", {
							pairs: pairs.collisionEnd,
							timestamp: timing.timestamp,
							delta
						});
						Engine._bodiesClearForces(allBodies);
						Events.trigger(engine, "afterUpdate", event);
						engine.timing.lastElapsed = Common.now() - startTime;
						return engine;
					};
					/**
					* Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
					* @method merge
					* @param {engine} engineA
					* @param {engine} engineB
					*/
					Engine.merge = function(engineA, engineB) {
						Common.extend(engineA, engineB);
						if (engineB.world) {
							engineA.world = engineB.world;
							Engine.clear(engineA);
							var bodies = Composite.allBodies(engineA.world);
							for (var i = 0; i < bodies.length; i++) {
								var body = bodies[i];
								Sleeping.set(body, false);
								body.id = Common.nextId();
							}
						}
					};
					/**
					* Clears the engine pairs and detector.
					* @method clear
					* @param {engine} engine
					*/
					Engine.clear = function(engine) {
						Pairs.clear(engine.pairs);
						Detector.clear(engine.detector);
					};
					/**
					* Zeroes the `body.force` and `body.torque` force buffers.
					* @method _bodiesClearForces
					* @private
					* @param {body[]} bodies
					*/
					Engine._bodiesClearForces = function(bodies) {
						var bodiesLength = bodies.length;
						for (var i = 0; i < bodiesLength; i++) {
							var body = bodies[i];
							body.force.x = 0;
							body.force.y = 0;
							body.torque = 0;
						}
					};
					/**
					* Applies gravitational acceleration to all `bodies`.
					* This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet.
					* 
					* @method _bodiesApplyGravity
					* @private
					* @param {body[]} bodies
					* @param {vector} gravity
					*/
					Engine._bodiesApplyGravity = function(bodies, gravity) {
						var gravityScale = typeof gravity.scale !== "undefined" ? gravity.scale : .001, bodiesLength = bodies.length;
						if (gravity.x === 0 && gravity.y === 0 || gravityScale === 0) return;
						for (var i = 0; i < bodiesLength; i++) {
							var body = bodies[i];
							if (body.isStatic || body.isSleeping) continue;
							body.force.y += body.mass * gravity.y * gravityScale;
							body.force.x += body.mass * gravity.x * gravityScale;
						}
					};
					/**
					* Applies `Body.update` to all given `bodies`.
					* @method _bodiesUpdate
					* @private
					* @param {body[]} bodies
					* @param {number} delta The amount of time elapsed between updates
					*/
					Engine._bodiesUpdate = function(bodies, delta) {
						var bodiesLength = bodies.length;
						for (var i = 0; i < bodiesLength; i++) {
							var body = bodies[i];
							if (body.isStatic || body.isSleeping) continue;
							Body.update(body, delta);
						}
					};
					/**
					* Applies `Body.updateVelocities` to all given `bodies`.
					* @method _bodiesUpdateVelocities
					* @private
					* @param {body[]} bodies
					*/
					Engine._bodiesUpdateVelocities = function(bodies) {
						var bodiesLength = bodies.length;
						for (var i = 0; i < bodiesLength; i++) Body.updateVelocities(bodies[i]);
					};
					/**
					* A deprecated alias for `Runner.run`, use `Matter.Runner.run(engine)` instead and see `Matter.Runner` for more information.
					* @deprecated use Matter.Runner.run(engine) instead
					* @method run
					* @param {engine} engine
					*/
					/**
					* Fired just before an update
					*
					* @event beforeUpdate
					* @param {object} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {number} event.delta The delta time in milliseconds value used in the update
					* @param {engine} event.source The source object of the event
					* @param {string} event.name The name of the event
					*/
					/**
					* Fired after bodies updated based on their velocity and forces, but before any collision detection, constraints and resolving etc.
					*
					* @event beforeSolve
					* @param {object} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {number} event.delta The delta time in milliseconds value used in the update
					* @param {engine} event.source The source object of the event
					* @param {string} event.name The name of the event
					*/
					/**
					* Fired after engine update and all collision events
					*
					* @event afterUpdate
					* @param {object} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {number} event.delta The delta time in milliseconds value used in the update
					* @param {engine} event.source The source object of the event
					* @param {string} event.name The name of the event
					*/
					/**
					* Fired after engine update, provides a list of all pairs that have started to collide in the current tick (if any)
					*
					* @event collisionStart
					* @param {object} event An event object
					* @param {pair[]} event.pairs List of affected pairs
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {number} event.delta The delta time in milliseconds value used in the update
					* @param {engine} event.source The source object of the event
					* @param {string} event.name The name of the event
					*/
					/**
					* Fired after engine update, provides a list of all pairs that are colliding in the current tick (if any)
					*
					* @event collisionActive
					* @param {object} event An event object
					* @param {pair[]} event.pairs List of affected pairs
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {number} event.delta The delta time in milliseconds value used in the update
					* @param {engine} event.source The source object of the event
					* @param {string} event.name The name of the event
					*/
					/**
					* Fired after engine update, provides a list of all pairs that have ended collision in the current tick (if any)
					*
					* @event collisionEnd
					* @param {object} event An event object
					* @param {pair[]} event.pairs List of affected pairs
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {number} event.delta The delta time in milliseconds value used in the update
					* @param {engine} event.source The source object of the event
					* @param {string} event.name The name of the event
					*/
					/**
					* An integer `Number` that specifies the number of position iterations to perform each update.
					* The higher the value, the higher quality the simulation will be at the expense of performance.
					*
					* @property positionIterations
					* @type number
					* @default 6
					*/
					/**
					* An integer `Number` that specifies the number of velocity iterations to perform each update.
					* The higher the value, the higher quality the simulation will be at the expense of performance.
					*
					* @property velocityIterations
					* @type number
					* @default 4
					*/
					/**
					* An integer `Number` that specifies the number of constraint iterations to perform each update.
					* The higher the value, the higher quality the simulation will be at the expense of performance.
					* The default value of `2` is usually very adequate.
					*
					* @property constraintIterations
					* @type number
					* @default 2
					*/
					/**
					* A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module.
					* Sleeping can improve stability and performance, but often at the expense of accuracy.
					*
					* @property enableSleeping
					* @type boolean
					* @default false
					*/
					/**
					* An `Object` containing properties regarding the timing systems of the engine. 
					*
					* @property timing
					* @type object
					*/
					/**
					* A `Number` that specifies the global scaling factor of time for all bodies.
					* A value of `0` freezes the simulation.
					* A value of `0.1` gives a slow-motion effect.
					* A value of `1.2` gives a speed-up effect.
					*
					* @property timing.timeScale
					* @type number
					* @default 1
					*/
					/**
					* A `Number` that specifies the current simulation-time in milliseconds starting from `0`. 
					* It is incremented on every `Engine.update` by the given `delta` argument. 
					* 
					* @property timing.timestamp
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that represents the total execution time elapsed during the last `Engine.update` in milliseconds.
					* It is updated by timing from the start of the last `Engine.update` call until it ends.
					*
					* This value will also include the total execution time of all event handlers directly or indirectly triggered by the engine update.
					* 
					* @property timing.lastElapsed
					* @type number
					* @default 0
					*/
					/**
					* A `Number` that represents the `delta` value used in the last engine update.
					* 
					* @property timing.lastDelta
					* @type number
					* @default 0
					*/
					/**
					* A `Matter.Detector` instance.
					*
					* @property detector
					* @type detector
					* @default a Matter.Detector instance
					*/
					/**
					* A `Matter.Grid` instance.
					*
					* @deprecated replaced by `engine.detector`
					* @property grid
					* @type grid
					* @default a Matter.Grid instance
					*/
					/**
					* Replaced by and now alias for `engine.grid`.
					*
					* @deprecated replaced by `engine.detector`
					* @property broadphase
					* @type grid
					* @default a Matter.Grid instance
					*/
					/**
					* The root `Matter.Composite` instance that will contain all bodies, constraints and other composites to be simulated by this engine.
					*
					* @property world
					* @type composite
					* @default a Matter.Composite instance
					*/
					/**
					* An object reserved for storing plugin-specific properties.
					*
					* @property plugin
					* @type {}
					*/
					/**
					* An optional gravitational acceleration applied to all bodies in `engine.world` on every update.
					* 
					* This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet. For gravity in other contexts, disable this and apply forces as needed.
					* 
					* To disable set the `scale` component to `0`.
					* 
					* This is split into three components for ease of use:  
					* a normalised direction (`x` and `y`) and magnitude (`scale`).
					*
					* @property gravity
					* @type object
					*/
					/**
					* The gravitational direction normal `x` component, to be multiplied by `gravity.scale`.
					* 
					* @property gravity.x
					* @type object
					* @default 0
					*/
					/**
					* The gravitational direction normal `y` component, to be multiplied by `gravity.scale`.
					*
					* @property gravity.y
					* @type object
					* @default 1
					*/
					/**
					* The magnitude of the gravitational acceleration.
					* 
					* @property gravity.scale
					* @type object
					* @default 0.001
					*/
				})();
			}),
			(function(module$25, exports$21, __webpack_require__) {
				/**
				* The `Matter.Resolver` module contains methods for resolving collision pairs.
				*
				* @class Resolver
				*/
				var Resolver = {};
				module$25.exports = Resolver;
				var Vertices = __webpack_require__(3);
				var Common = __webpack_require__(0);
				var Bounds = __webpack_require__(1);
				(function() {
					Resolver._restingThresh = 2;
					Resolver._restingThreshTangent = Math.sqrt(6);
					Resolver._positionDampen = .9;
					Resolver._positionWarming = .8;
					Resolver._frictionNormalMultiplier = 5;
					Resolver._frictionMaxStatic = Number.MAX_VALUE;
					/**
					* Prepare pairs for position solving.
					* @method preSolvePosition
					* @param {pair[]} pairs
					*/
					Resolver.preSolvePosition = function(pairs) {
						var i, pair, contactCount, pairsLength = pairs.length;
						for (i = 0; i < pairsLength; i++) {
							pair = pairs[i];
							if (!pair.isActive) continue;
							contactCount = pair.contactCount;
							pair.collision.parentA.totalContacts += contactCount;
							pair.collision.parentB.totalContacts += contactCount;
						}
					};
					/**
					* Find a solution for pair positions.
					* @method solvePosition
					* @param {pair[]} pairs
					* @param {number} delta
					* @param {number} [damping=1]
					*/
					Resolver.solvePosition = function(pairs, delta, damping) {
						var i, pair, collision, bodyA, bodyB, normal, contactShare, positionImpulse, positionDampen = Resolver._positionDampen * (damping || 1), slopDampen = Common.clamp(delta / Common._baseDelta, 0, 1), pairsLength = pairs.length;
						for (i = 0; i < pairsLength; i++) {
							pair = pairs[i];
							if (!pair.isActive || pair.isSensor) continue;
							collision = pair.collision;
							bodyA = collision.parentA;
							bodyB = collision.parentB;
							normal = collision.normal;
							pair.separation = collision.depth + normal.x * (bodyB.positionImpulse.x - bodyA.positionImpulse.x) + normal.y * (bodyB.positionImpulse.y - bodyA.positionImpulse.y);
						}
						for (i = 0; i < pairsLength; i++) {
							pair = pairs[i];
							if (!pair.isActive || pair.isSensor) continue;
							collision = pair.collision;
							bodyA = collision.parentA;
							bodyB = collision.parentB;
							normal = collision.normal;
							positionImpulse = pair.separation - pair.slop * slopDampen;
							if (bodyA.isStatic || bodyB.isStatic) positionImpulse *= 2;
							if (!(bodyA.isStatic || bodyA.isSleeping)) {
								contactShare = positionDampen / bodyA.totalContacts;
								bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
								bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
							}
							if (!(bodyB.isStatic || bodyB.isSleeping)) {
								contactShare = positionDampen / bodyB.totalContacts;
								bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
								bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
							}
						}
					};
					/**
					* Apply position resolution.
					* @method postSolvePosition
					* @param {body[]} bodies
					*/
					Resolver.postSolvePosition = function(bodies) {
						var positionWarming = Resolver._positionWarming, bodiesLength = bodies.length, verticesTranslate = Vertices.translate, boundsUpdate = Bounds.update;
						for (var i = 0; i < bodiesLength; i++) {
							var body = bodies[i], positionImpulse = body.positionImpulse, positionImpulseX = positionImpulse.x, positionImpulseY = positionImpulse.y, velocity = body.velocity;
							body.totalContacts = 0;
							if (positionImpulseX !== 0 || positionImpulseY !== 0) {
								for (var j = 0; j < body.parts.length; j++) {
									var part = body.parts[j];
									verticesTranslate(part.vertices, positionImpulse);
									boundsUpdate(part.bounds, part.vertices, velocity);
									part.position.x += positionImpulseX;
									part.position.y += positionImpulseY;
								}
								body.positionPrev.x += positionImpulseX;
								body.positionPrev.y += positionImpulseY;
								if (positionImpulseX * velocity.x + positionImpulseY * velocity.y < 0) {
									positionImpulse.x = 0;
									positionImpulse.y = 0;
								} else {
									positionImpulse.x *= positionWarming;
									positionImpulse.y *= positionWarming;
								}
							}
						}
					};
					/**
					* Prepare pairs for velocity solving.
					* @method preSolveVelocity
					* @param {pair[]} pairs
					*/
					Resolver.preSolveVelocity = function(pairs) {
						var pairsLength = pairs.length, i, j;
						for (i = 0; i < pairsLength; i++) {
							var pair = pairs[i];
							if (!pair.isActive || pair.isSensor) continue;
							var contacts = pair.contacts, contactCount = pair.contactCount, collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, normal = collision.normal, tangent = collision.tangent;
							for (j = 0; j < contactCount; j++) {
								var contact = contacts[j], contactVertex = contact.vertex, normalImpulse = contact.normalImpulse, tangentImpulse = contact.tangentImpulse;
								if (normalImpulse !== 0 || tangentImpulse !== 0) {
									var impulseX = normal.x * normalImpulse + tangent.x * tangentImpulse, impulseY = normal.y * normalImpulse + tangent.y * tangentImpulse;
									if (!(bodyA.isStatic || bodyA.isSleeping)) {
										bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
										bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
										bodyA.anglePrev += bodyA.inverseInertia * ((contactVertex.x - bodyA.position.x) * impulseY - (contactVertex.y - bodyA.position.y) * impulseX);
									}
									if (!(bodyB.isStatic || bodyB.isSleeping)) {
										bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
										bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
										bodyB.anglePrev -= bodyB.inverseInertia * ((contactVertex.x - bodyB.position.x) * impulseY - (contactVertex.y - bodyB.position.y) * impulseX);
									}
								}
							}
						}
					};
					/**
					* Find a solution for pair velocities.
					* @method solveVelocity
					* @param {pair[]} pairs
					* @param {number} delta
					*/
					Resolver.solveVelocity = function(pairs, delta) {
						var timeScale = delta / Common._baseDelta, timeScaleCubed = timeScale * timeScale * timeScale, restingThresh = -Resolver._restingThresh * timeScale, restingThreshTangent = Resolver._restingThreshTangent, frictionNormalMultiplier = Resolver._frictionNormalMultiplier * timeScale, frictionMaxStatic = Resolver._frictionMaxStatic, pairsLength = pairs.length, tangentImpulse, maxFriction, i, j;
						for (i = 0; i < pairsLength; i++) {
							var pair = pairs[i];
							if (!pair.isActive || pair.isSensor) continue;
							var collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, normalX = collision.normal.x, normalY = collision.normal.y, tangentX = collision.tangent.x, tangentY = collision.tangent.y, inverseMassTotal = pair.inverseMass, friction = pair.friction * pair.frictionStatic * frictionNormalMultiplier, contacts = pair.contacts, contactCount = pair.contactCount, contactShare = 1 / contactCount;
							var bodyAVelocityX = bodyA.position.x - bodyA.positionPrev.x, bodyAVelocityY = bodyA.position.y - bodyA.positionPrev.y, bodyAAngularVelocity = bodyA.angle - bodyA.anglePrev, bodyBVelocityX = bodyB.position.x - bodyB.positionPrev.x, bodyBVelocityY = bodyB.position.y - bodyB.positionPrev.y, bodyBAngularVelocity = bodyB.angle - bodyB.anglePrev;
							for (j = 0; j < contactCount; j++) {
								var contact = contacts[j], contactVertex = contact.vertex;
								var offsetAX = contactVertex.x - bodyA.position.x, offsetAY = contactVertex.y - bodyA.position.y, offsetBX = contactVertex.x - bodyB.position.x, offsetBY = contactVertex.y - bodyB.position.y;
								var velocityPointAX = bodyAVelocityX - offsetAY * bodyAAngularVelocity, velocityPointAY = bodyAVelocityY + offsetAX * bodyAAngularVelocity, velocityPointBX = bodyBVelocityX - offsetBY * bodyBAngularVelocity, velocityPointBY = bodyBVelocityY + offsetBX * bodyBAngularVelocity;
								var relativeVelocityX = velocityPointAX - velocityPointBX, relativeVelocityY = velocityPointAY - velocityPointBY;
								var normalVelocity = normalX * relativeVelocityX + normalY * relativeVelocityY, tangentVelocity = tangentX * relativeVelocityX + tangentY * relativeVelocityY;
								var normalOverlap = pair.separation + normalVelocity;
								var normalForce = Math.min(normalOverlap, 1);
								normalForce = normalOverlap < 0 ? 0 : normalForce;
								var frictionLimit = normalForce * friction;
								if (tangentVelocity < -frictionLimit || tangentVelocity > frictionLimit) {
									maxFriction = tangentVelocity > 0 ? tangentVelocity : -tangentVelocity;
									tangentImpulse = pair.friction * (tangentVelocity > 0 ? 1 : -1) * timeScaleCubed;
									if (tangentImpulse < -maxFriction) tangentImpulse = -maxFriction;
									else if (tangentImpulse > maxFriction) tangentImpulse = maxFriction;
								} else {
									tangentImpulse = tangentVelocity;
									maxFriction = frictionMaxStatic;
								}
								var oAcN = offsetAX * normalY - offsetAY * normalX, oBcN = offsetBX * normalY - offsetBY * normalX, share = contactShare / (inverseMassTotal + bodyA.inverseInertia * oAcN * oAcN + bodyB.inverseInertia * oBcN * oBcN);
								var normalImpulse = (1 + pair.restitution) * normalVelocity * share;
								tangentImpulse *= share;
								if (normalVelocity < restingThresh) contact.normalImpulse = 0;
								else {
									var contactNormalImpulse = contact.normalImpulse;
									contact.normalImpulse += normalImpulse;
									if (contact.normalImpulse > 0) contact.normalImpulse = 0;
									normalImpulse = contact.normalImpulse - contactNormalImpulse;
								}
								if (tangentVelocity < -restingThreshTangent || tangentVelocity > restingThreshTangent) contact.tangentImpulse = 0;
								else {
									var contactTangentImpulse = contact.tangentImpulse;
									contact.tangentImpulse += tangentImpulse;
									if (contact.tangentImpulse < -maxFriction) contact.tangentImpulse = -maxFriction;
									if (contact.tangentImpulse > maxFriction) contact.tangentImpulse = maxFriction;
									tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
								}
								var impulseX = normalX * normalImpulse + tangentX * tangentImpulse, impulseY = normalY * normalImpulse + tangentY * tangentImpulse;
								if (!(bodyA.isStatic || bodyA.isSleeping)) {
									bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
									bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
									bodyA.anglePrev += (offsetAX * impulseY - offsetAY * impulseX) * bodyA.inverseInertia;
								}
								if (!(bodyB.isStatic || bodyB.isSleeping)) {
									bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
									bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
									bodyB.anglePrev -= (offsetBX * impulseY - offsetBY * impulseX) * bodyB.inverseInertia;
								}
							}
						}
					};
				})();
			}),
			(function(module$26, exports$22, __webpack_require__) {
				/**
				* The `Matter.Pairs` module contains methods for creating and manipulating collision pair sets.
				*
				* @class Pairs
				*/
				var Pairs = {};
				module$26.exports = Pairs;
				var Pair = __webpack_require__(9);
				var Common = __webpack_require__(0);
				(function() {
					/**
					* Creates a new pairs structure.
					* @method create
					* @param {object} options
					* @return {pairs} A new pairs structure
					*/
					Pairs.create = function(options) {
						return Common.extend({
							table: {},
							list: [],
							collisionStart: [],
							collisionActive: [],
							collisionEnd: []
						}, options);
					};
					/**
					* Updates pairs given a list of collisions.
					* @method update
					* @param {object} pairs
					* @param {collision[]} collisions
					* @param {number} timestamp
					*/
					Pairs.update = function(pairs, collisions, timestamp) {
						var pairUpdate = Pair.update, pairCreate = Pair.create, pairSetActive = Pair.setActive, pairsTable = pairs.table, pairsList = pairs.list, pairsListLength = pairsList.length, pairsListIndex = pairsListLength, collisionStart = pairs.collisionStart, collisionEnd = pairs.collisionEnd, collisionActive = pairs.collisionActive, collisionsLength = collisions.length, collisionStartIndex = 0, collisionEndIndex = 0, collisionActiveIndex = 0, collision, pair, i;
						for (i = 0; i < collisionsLength; i++) {
							collision = collisions[i];
							pair = collision.pair;
							if (pair) {
								if (pair.isActive) collisionActive[collisionActiveIndex++] = pair;
								pairUpdate(pair, collision, timestamp);
							} else {
								pair = pairCreate(collision, timestamp);
								pairsTable[pair.id] = pair;
								collisionStart[collisionStartIndex++] = pair;
								pairsList[pairsListIndex++] = pair;
							}
						}
						pairsListIndex = 0;
						pairsListLength = pairsList.length;
						for (i = 0; i < pairsListLength; i++) {
							pair = pairsList[i];
							if (pair.timeUpdated >= timestamp) pairsList[pairsListIndex++] = pair;
							else {
								pairSetActive(pair, false, timestamp);
								if (pair.collision.bodyA.sleepCounter > 0 && pair.collision.bodyB.sleepCounter > 0) pairsList[pairsListIndex++] = pair;
								else {
									collisionEnd[collisionEndIndex++] = pair;
									delete pairsTable[pair.id];
								}
							}
						}
						if (pairsList.length !== pairsListIndex) pairsList.length = pairsListIndex;
						if (collisionStart.length !== collisionStartIndex) collisionStart.length = collisionStartIndex;
						if (collisionEnd.length !== collisionEndIndex) collisionEnd.length = collisionEndIndex;
						if (collisionActive.length !== collisionActiveIndex) collisionActive.length = collisionActiveIndex;
					};
					/**
					* Clears the given pairs structure.
					* @method clear
					* @param {pairs} pairs
					* @return {pairs} pairs
					*/
					Pairs.clear = function(pairs) {
						pairs.table = {};
						pairs.list.length = 0;
						pairs.collisionStart.length = 0;
						pairs.collisionActive.length = 0;
						pairs.collisionEnd.length = 0;
						return pairs;
					};
				})();
			}),
			(function(module$27, exports$23, __webpack_require__) {
				var Matter = module$27.exports = __webpack_require__(21);
				Matter.Axes = __webpack_require__(11);
				Matter.Bodies = __webpack_require__(12);
				Matter.Body = __webpack_require__(4);
				Matter.Bounds = __webpack_require__(1);
				Matter.Collision = __webpack_require__(8);
				Matter.Common = __webpack_require__(0);
				Matter.Composite = __webpack_require__(6);
				Matter.Composites = __webpack_require__(22);
				Matter.Constraint = __webpack_require__(10);
				Matter.Contact = __webpack_require__(16);
				Matter.Detector = __webpack_require__(13);
				Matter.Engine = __webpack_require__(17);
				Matter.Events = __webpack_require__(5);
				Matter.Grid = __webpack_require__(23);
				Matter.Mouse = __webpack_require__(14);
				Matter.MouseConstraint = __webpack_require__(24);
				Matter.Pair = __webpack_require__(9);
				Matter.Pairs = __webpack_require__(19);
				Matter.Plugin = __webpack_require__(15);
				Matter.Query = __webpack_require__(25);
				Matter.Render = __webpack_require__(26);
				Matter.Resolver = __webpack_require__(18);
				Matter.Runner = __webpack_require__(27);
				Matter.SAT = __webpack_require__(28);
				Matter.Sleeping = __webpack_require__(7);
				Matter.Svg = __webpack_require__(29);
				Matter.Vector = __webpack_require__(2);
				Matter.Vertices = __webpack_require__(3);
				Matter.World = __webpack_require__(30);
				Matter.Engine.run = Matter.Runner.run;
				Matter.Common.deprecated(Matter.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
			}),
			(function(module$28, exports$24, __webpack_require__) {
				/**
				* The `Matter` module is the top level namespace. It also includes a function for installing plugins on top of the library.
				*
				* @class Matter
				*/
				var Matter = {};
				module$28.exports = Matter;
				var Plugin = __webpack_require__(15);
				var Common = __webpack_require__(0);
				(function() {
					/**
					* The library name.
					* @property name
					* @readOnly
					* @type {String}
					*/
					Matter.name = "matter-js";
					/**
					* The library version.
					* @property version
					* @readOnly
					* @type {String}
					*/
					Matter.version = "0.20.0";
					/**
					* A list of plugin dependencies to be installed. These are normally set and installed through `Matter.use`.
					* Alternatively you may set `Matter.uses` manually and install them by calling `Plugin.use(Matter)`.
					* @property uses
					* @type {Array}
					*/
					Matter.uses = [];
					/**
					* The plugins that have been installed through `Matter.Plugin.install`. Read only.
					* @property used
					* @readOnly
					* @type {Array}
					*/
					Matter.used = [];
					/**
					* Installs the given plugins on the `Matter` namespace.
					* This is a short-hand for `Plugin.use`, see it for more information.
					* Call this function once at the start of your code, with all of the plugins you wish to install as arguments.
					* Avoid calling this function multiple times unless you intend to manually control installation order.
					* @method use
					* @param ...plugin {Function} The plugin(s) to install on `base` (multi-argument).
					*/
					Matter.use = function() {
						Plugin.use(Matter, Array.prototype.slice.call(arguments));
					};
					/**
					* Chains a function to excute before the original function on the given `path` relative to `Matter`.
					* See also docs for `Common.chain`.
					* @method before
					* @param {string} path The path relative to `Matter`
					* @param {function} func The function to chain before the original
					* @return {function} The chained function that replaced the original
					*/
					Matter.before = function(path, func) {
						path = path.replace(/^Matter./, "");
						return Common.chainPathBefore(Matter, path, func);
					};
					/**
					* Chains a function to excute after the original function on the given `path` relative to `Matter`.
					* See also docs for `Common.chain`.
					* @method after
					* @param {string} path The path relative to `Matter`
					* @param {function} func The function to chain after the original
					* @return {function} The chained function that replaced the original
					*/
					Matter.after = function(path, func) {
						path = path.replace(/^Matter./, "");
						return Common.chainPathAfter(Matter, path, func);
					};
				})();
			}),
			(function(module$29, exports$25, __webpack_require__) {
				/**
				* The `Matter.Composites` module contains factory methods for creating composite bodies
				* with commonly used configurations (such as stacks and chains).
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Composites
				*/
				var Composites = {};
				module$29.exports = Composites;
				var Composite = __webpack_require__(6);
				var Constraint = __webpack_require__(10);
				var Common = __webpack_require__(0);
				var Body = __webpack_require__(4);
				var Bodies = __webpack_require__(12);
				var deprecated = Common.deprecated;
				(function() {
					/**
					* Create a new composite containing bodies created in the callback in a grid arrangement.
					* This function uses the body's bounds to prevent overlaps.
					* @method stack
					* @param {number} x Starting position in X.
					* @param {number} y Starting position in Y.
					* @param {number} columns
					* @param {number} rows
					* @param {number} columnGap
					* @param {number} rowGap
					* @param {function} callback
					* @return {composite} A new composite containing objects created in the callback
					*/
					Composites.stack = function(x, y, columns, rows, columnGap, rowGap, callback) {
						var stack = Composite.create({ label: "Stack" }), currentX = x, currentY = y, lastBody, i = 0;
						for (var row = 0; row < rows; row++) {
							var maxHeight = 0;
							for (var column = 0; column < columns; column++) {
								var body = callback(currentX, currentY, column, row, lastBody, i);
								if (body) {
									var bodyHeight = body.bounds.max.y - body.bounds.min.y, bodyWidth = body.bounds.max.x - body.bounds.min.x;
									if (bodyHeight > maxHeight) maxHeight = bodyHeight;
									Body.translate(body, {
										x: bodyWidth * .5,
										y: bodyHeight * .5
									});
									currentX = body.bounds.max.x + columnGap;
									Composite.addBody(stack, body);
									lastBody = body;
									i += 1;
								} else currentX += columnGap;
							}
							currentY += maxHeight + rowGap;
							currentX = x;
						}
						return stack;
					};
					/**
					* Chains all bodies in the given composite together using constraints.
					* @method chain
					* @param {composite} composite
					* @param {number} xOffsetA
					* @param {number} yOffsetA
					* @param {number} xOffsetB
					* @param {number} yOffsetB
					* @param {object} options
					* @return {composite} A new composite containing objects chained together with constraints
					*/
					Composites.chain = function(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
						var bodies = composite.bodies;
						for (var i = 1; i < bodies.length; i++) {
							var bodyA = bodies[i - 1], bodyB = bodies[i], bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y, bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y, bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
							var defaults = {
								bodyA,
								pointA: {
									x: bodyAWidth * xOffsetA,
									y: bodyAHeight * yOffsetA
								},
								bodyB,
								pointB: {
									x: bodyBWidth * xOffsetB,
									y: bodyBHeight * yOffsetB
								}
							};
							var constraint = Common.extend(defaults, options);
							Composite.addConstraint(composite, Constraint.create(constraint));
						}
						composite.label += " Chain";
						return composite;
					};
					/**
					* Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
					* @method mesh
					* @param {composite} composite
					* @param {number} columns
					* @param {number} rows
					* @param {boolean} crossBrace
					* @param {object} options
					* @return {composite} The composite containing objects meshed together with constraints
					*/
					Composites.mesh = function(composite, columns, rows, crossBrace, options) {
						var bodies = composite.bodies, row, col, bodyA, bodyB, bodyC;
						for (row = 0; row < rows; row++) {
							for (col = 1; col < columns; col++) {
								bodyA = bodies[col - 1 + row * columns];
								bodyB = bodies[col + row * columns];
								Composite.addConstraint(composite, Constraint.create(Common.extend({
									bodyA,
									bodyB
								}, options)));
							}
							if (row > 0) for (col = 0; col < columns; col++) {
								bodyA = bodies[col + (row - 1) * columns];
								bodyB = bodies[col + row * columns];
								Composite.addConstraint(composite, Constraint.create(Common.extend({
									bodyA,
									bodyB
								}, options)));
								if (crossBrace && col > 0) {
									bodyC = bodies[col - 1 + (row - 1) * columns];
									Composite.addConstraint(composite, Constraint.create(Common.extend({
										bodyA: bodyC,
										bodyB
									}, options)));
								}
								if (crossBrace && col < columns - 1) {
									bodyC = bodies[col + 1 + (row - 1) * columns];
									Composite.addConstraint(composite, Constraint.create(Common.extend({
										bodyA: bodyC,
										bodyB
									}, options)));
								}
							}
						}
						composite.label += " Mesh";
						return composite;
					};
					/**
					* Create a new composite containing bodies created in the callback in a pyramid arrangement.
					* This function uses the body's bounds to prevent overlaps.
					* @method pyramid
					* @param {number} x Starting position in X.
					* @param {number} y Starting position in Y.
					* @param {number} columns
					* @param {number} rows
					* @param {number} columnGap
					* @param {number} rowGap
					* @param {function} callback
					* @return {composite} A new composite containing objects created in the callback
					*/
					Composites.pyramid = function(x, y, columns, rows, columnGap, rowGap, callback) {
						return Composites.stack(x, y, columns, rows, columnGap, rowGap, function(stackX, stackY, column, row, lastBody, i) {
							var actualRows = Math.min(rows, Math.ceil(columns / 2)), lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
							if (row > actualRows) return;
							row = actualRows - row;
							var start = row, end = columns - 1 - row;
							if (column < start || column > end) return;
							if (i === 1) Body.translate(lastBody, {
								x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth,
								y: 0
							});
							return callback(x + (lastBody ? column * lastBodyWidth : 0) + column * columnGap, stackY, column, row, lastBody, i);
						});
					};
					/**
					* This has now moved to the [newtonsCradle example](https://github.com/liabru/matter-js/blob/master/examples/newtonsCradle.js), follow that instead as this function is deprecated here.
					* @deprecated moved to newtonsCradle example
					* @method newtonsCradle
					* @param {number} x Starting position in X.
					* @param {number} y Starting position in Y.
					* @param {number} number
					* @param {number} size
					* @param {number} length
					* @return {composite} A new composite newtonsCradle body
					*/
					Composites.newtonsCradle = function(x, y, number, size, length) {
						var newtonsCradle = Composite.create({ label: "Newtons Cradle" });
						for (var i = 0; i < number; i++) {
							var separation = 1.9, circle = Bodies.circle(x + i * (size * separation), y + length, size, {
								inertia: Infinity,
								restitution: 1,
								friction: 0,
								frictionAir: 1e-4,
								slop: 1
							}), constraint = Constraint.create({
								pointA: {
									x: x + i * (size * separation),
									y
								},
								bodyB: circle
							});
							Composite.addBody(newtonsCradle, circle);
							Composite.addConstraint(newtonsCradle, constraint);
						}
						return newtonsCradle;
					};
					deprecated(Composites, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example");
					/**
					* This has now moved to the [car example](https://github.com/liabru/matter-js/blob/master/examples/car.js), follow that instead as this function is deprecated here.
					* @deprecated moved to car example
					* @method car
					* @param {number} x Starting position in X.
					* @param {number} y Starting position in Y.
					* @param {number} width
					* @param {number} height
					* @param {number} wheelSize
					* @return {composite} A new composite car body
					*/
					Composites.car = function(x, y, width, height, wheelSize) {
						var group = Body.nextGroup(true), wheelBase = 20, wheelAOffset = -width * .5 + wheelBase, wheelBOffset = width * .5 - wheelBase, wheelYOffset = 0;
						var car = Composite.create({ label: "Car" }), body = Bodies.rectangle(x, y, width, height, {
							collisionFilter: { group },
							chamfer: { radius: height * .5 },
							density: 2e-4
						});
						var wheelA = Bodies.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, {
							collisionFilter: { group },
							friction: .8
						});
						var wheelB = Bodies.circle(x + wheelBOffset, y + wheelYOffset, wheelSize, {
							collisionFilter: { group },
							friction: .8
						});
						var axelA = Constraint.create({
							bodyB: body,
							pointB: {
								x: wheelAOffset,
								y: wheelYOffset
							},
							bodyA: wheelA,
							stiffness: 1,
							length: 0
						});
						var axelB = Constraint.create({
							bodyB: body,
							pointB: {
								x: wheelBOffset,
								y: wheelYOffset
							},
							bodyA: wheelB,
							stiffness: 1,
							length: 0
						});
						Composite.addBody(car, body);
						Composite.addBody(car, wheelA);
						Composite.addBody(car, wheelB);
						Composite.addConstraint(car, axelA);
						Composite.addConstraint(car, axelB);
						return car;
					};
					deprecated(Composites, "car", "Composites.car ➤ moved to car example");
					/**
					* This has now moved to the [softBody example](https://github.com/liabru/matter-js/blob/master/examples/softBody.js)
					* and the [cloth example](https://github.com/liabru/matter-js/blob/master/examples/cloth.js), follow those instead as this function is deprecated here.
					* @deprecated moved to softBody and cloth examples
					* @method softBody
					* @param {number} x Starting position in X.
					* @param {number} y Starting position in Y.
					* @param {number} columns
					* @param {number} rows
					* @param {number} columnGap
					* @param {number} rowGap
					* @param {boolean} crossBrace
					* @param {number} particleRadius
					* @param {} particleOptions
					* @param {} constraintOptions
					* @return {composite} A new composite softBody
					*/
					Composites.softBody = function(x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
						particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
						constraintOptions = Common.extend({
							stiffness: .2,
							render: {
								type: "line",
								anchors: false
							}
						}, constraintOptions);
						var softBody = Composites.stack(x, y, columns, rows, columnGap, rowGap, function(stackX, stackY) {
							return Bodies.circle(stackX, stackY, particleRadius, particleOptions);
						});
						Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
						softBody.label = "Soft Body";
						return softBody;
					};
					deprecated(Composites, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
				})();
			}),
			(function(module$30, exports$26, __webpack_require__) {
				/**
				* This module has now been replaced by `Matter.Detector`.
				*
				* All usage should be migrated to `Matter.Detector` or another alternative.
				* For back-compatibility purposes this module will remain for a short term and then later removed in a future release.
				*
				* The `Matter.Grid` module contains methods for creating and manipulating collision broadphase grid structures.
				*
				* @class Grid
				* @deprecated
				*/
				var Grid = {};
				module$30.exports = Grid;
				var Pair = __webpack_require__(9);
				var Common = __webpack_require__(0);
				var deprecated = Common.deprecated;
				(function() {
					/**
					* Creates a new grid.
					* @deprecated replaced by Matter.Detector
					* @method create
					* @param {} options
					* @return {grid} A new grid
					*/
					Grid.create = function(options) {
						return Common.extend({
							buckets: {},
							pairs: {},
							pairsList: [],
							bucketWidth: 48,
							bucketHeight: 48
						}, options);
					};
					/**
					* The width of a single grid bucket.
					*
					* @property bucketWidth
					* @type number
					* @default 48
					*/
					/**
					* The height of a single grid bucket.
					*
					* @property bucketHeight
					* @type number
					* @default 48
					*/
					/**
					* Updates the grid.
					* @deprecated replaced by Matter.Detector
					* @method update
					* @param {grid} grid
					* @param {body[]} bodies
					* @param {engine} engine
					* @param {boolean} forceUpdate
					*/
					Grid.update = function(grid, bodies, engine, forceUpdate) {
						var i, col, row, world = engine.world, buckets = grid.buckets, bucket, bucketId, gridChanged = false;
						for (i = 0; i < bodies.length; i++) {
							var body = bodies[i];
							if (body.isSleeping && !forceUpdate) continue;
							if (world.bounds && (body.bounds.max.x < world.bounds.min.x || body.bounds.min.x > world.bounds.max.x || body.bounds.max.y < world.bounds.min.y || body.bounds.min.y > world.bounds.max.y)) continue;
							var newRegion = Grid._getRegion(grid, body);
							if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
								if (!body.region || forceUpdate) body.region = newRegion;
								var union = Grid._regionUnion(newRegion, body.region);
								for (col = union.startCol; col <= union.endCol; col++) for (row = union.startRow; row <= union.endRow; row++) {
									bucketId = Grid._getBucketId(col, row);
									bucket = buckets[bucketId];
									var isInsideNewRegion = col >= newRegion.startCol && col <= newRegion.endCol && row >= newRegion.startRow && row <= newRegion.endRow;
									var isInsideOldRegion = col >= body.region.startCol && col <= body.region.endCol && row >= body.region.startRow && row <= body.region.endRow;
									if (!isInsideNewRegion && isInsideOldRegion) {
										if (isInsideOldRegion) {
											if (bucket) Grid._bucketRemoveBody(grid, bucket, body);
										}
									}
									if (body.region === newRegion || isInsideNewRegion && !isInsideOldRegion || forceUpdate) {
										if (!bucket) bucket = Grid._createBucket(buckets, bucketId);
										Grid._bucketAddBody(grid, bucket, body);
									}
								}
								body.region = newRegion;
								gridChanged = true;
							}
						}
						if (gridChanged) grid.pairsList = Grid._createActivePairsList(grid);
					};
					deprecated(Grid, "update", "Grid.update ➤ replaced by Matter.Detector");
					/**
					* Clears the grid.
					* @deprecated replaced by Matter.Detector
					* @method clear
					* @param {grid} grid
					*/
					Grid.clear = function(grid) {
						grid.buckets = {};
						grid.pairs = {};
						grid.pairsList = [];
					};
					deprecated(Grid, "clear", "Grid.clear ➤ replaced by Matter.Detector");
					/**
					* Finds the union of two regions.
					* @method _regionUnion
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} regionA
					* @param {} regionB
					* @return {} region
					*/
					Grid._regionUnion = function(regionA, regionB) {
						var startCol = Math.min(regionA.startCol, regionB.startCol), endCol = Math.max(regionA.endCol, regionB.endCol), startRow = Math.min(regionA.startRow, regionB.startRow), endRow = Math.max(regionA.endRow, regionB.endRow);
						return Grid._createRegion(startCol, endCol, startRow, endRow);
					};
					/**
					* Gets the region a given body falls in for a given grid.
					* @method _getRegion
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} grid
					* @param {} body
					* @return {} region
					*/
					Grid._getRegion = function(grid, body) {
						var bounds = body.bounds, startCol = Math.floor(bounds.min.x / grid.bucketWidth), endCol = Math.floor(bounds.max.x / grid.bucketWidth), startRow = Math.floor(bounds.min.y / grid.bucketHeight), endRow = Math.floor(bounds.max.y / grid.bucketHeight);
						return Grid._createRegion(startCol, endCol, startRow, endRow);
					};
					/**
					* Creates a region.
					* @method _createRegion
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} startCol
					* @param {} endCol
					* @param {} startRow
					* @param {} endRow
					* @return {} region
					*/
					Grid._createRegion = function(startCol, endCol, startRow, endRow) {
						return {
							id: startCol + "," + endCol + "," + startRow + "," + endRow,
							startCol,
							endCol,
							startRow,
							endRow
						};
					};
					/**
					* Gets the bucket id at the given position.
					* @method _getBucketId
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} column
					* @param {} row
					* @return {string} bucket id
					*/
					Grid._getBucketId = function(column, row) {
						return "C" + column + "R" + row;
					};
					/**
					* Creates a bucket.
					* @method _createBucket
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} buckets
					* @param {} bucketId
					* @return {} bucket
					*/
					Grid._createBucket = function(buckets, bucketId) {
						return buckets[bucketId] = [];
					};
					/**
					* Adds a body to a bucket.
					* @method _bucketAddBody
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} grid
					* @param {} bucket
					* @param {} body
					*/
					Grid._bucketAddBody = function(grid, bucket, body) {
						var gridPairs = grid.pairs, pairId = Pair.id, bucketLength = bucket.length, i;
						for (i = 0; i < bucketLength; i++) {
							var bodyB = bucket[i];
							if (body.id === bodyB.id || body.isStatic && bodyB.isStatic) continue;
							var id = pairId(body, bodyB), pair = gridPairs[id];
							if (pair) pair[2] += 1;
							else gridPairs[id] = [
								body,
								bodyB,
								1
							];
						}
						bucket.push(body);
					};
					/**
					* Removes a body from a bucket.
					* @method _bucketRemoveBody
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} grid
					* @param {} bucket
					* @param {} body
					*/
					Grid._bucketRemoveBody = function(grid, bucket, body) {
						var gridPairs = grid.pairs, pairId = Pair.id, i;
						bucket.splice(Common.indexOf(bucket, body), 1);
						var bucketLength = bucket.length;
						for (i = 0; i < bucketLength; i++) {
							var pair = gridPairs[pairId(body, bucket[i])];
							if (pair) pair[2] -= 1;
						}
					};
					/**
					* Generates a list of the active pairs in the grid.
					* @method _createActivePairsList
					* @deprecated replaced by Matter.Detector
					* @private
					* @param {} grid
					* @return [] pairs
					*/
					Grid._createActivePairsList = function(grid) {
						var pair, gridPairs = grid.pairs, pairKeys = Common.keys(gridPairs), pairKeysLength = pairKeys.length, pairs = [], k;
						for (k = 0; k < pairKeysLength; k++) {
							pair = gridPairs[pairKeys[k]];
							if (pair[2] > 0) pairs.push(pair);
							else delete gridPairs[pairKeys[k]];
						}
						return pairs;
					};
				})();
			}),
			(function(module$31, exports$27, __webpack_require__) {
				/**
				* The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
				* Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class MouseConstraint
				*/
				var MouseConstraint = {};
				module$31.exports = MouseConstraint;
				var Vertices = __webpack_require__(3);
				var Sleeping = __webpack_require__(7);
				var Mouse = __webpack_require__(14);
				var Events = __webpack_require__(5);
				var Detector = __webpack_require__(13);
				var Constraint = __webpack_require__(10);
				var Composite = __webpack_require__(6);
				var Common = __webpack_require__(0);
				var Bounds = __webpack_require__(1);
				(function() {
					/**
					* Creates a new mouse constraint.
					* All properties have default values, and many are pre-calculated automatically based on other properties.
					* See the properties section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {engine} engine
					* @param {} options
					* @return {MouseConstraint} A new MouseConstraint
					*/
					MouseConstraint.create = function(engine, options) {
						var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);
						if (!mouse) if (engine && engine.render && engine.render.canvas) mouse = Mouse.create(engine.render.canvas);
						else if (options && options.element) mouse = Mouse.create(options.element);
						else {
							mouse = Mouse.create();
							Common.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected");
						}
						var constraint = Constraint.create({
							label: "Mouse Constraint",
							pointA: mouse.position,
							pointB: {
								x: 0,
								y: 0
							},
							length: .01,
							stiffness: .1,
							angularStiffness: 1,
							render: {
								strokeStyle: "#90EE90",
								lineWidth: 3
							}
						});
						var defaults = {
							type: "mouseConstraint",
							mouse,
							element: null,
							body: null,
							constraint,
							collisionFilter: {
								category: 1,
								mask: 4294967295,
								group: 0
							}
						};
						var mouseConstraint = Common.extend(defaults, options);
						Events.on(engine, "beforeUpdate", function() {
							var allBodies = Composite.allBodies(engine.world);
							MouseConstraint.update(mouseConstraint, allBodies);
							MouseConstraint._triggerEvents(mouseConstraint);
						});
						return mouseConstraint;
					};
					/**
					* Updates the given mouse constraint.
					* @private
					* @method update
					* @param {MouseConstraint} mouseConstraint
					* @param {body[]} bodies
					*/
					MouseConstraint.update = function(mouseConstraint, bodies) {
						var mouse = mouseConstraint.mouse, constraint = mouseConstraint.constraint, body = mouseConstraint.body;
						if (mouse.button === 0) if (!constraint.bodyB) for (var i = 0; i < bodies.length; i++) {
							body = bodies[i];
							if (Bounds.contains(body.bounds, mouse.position) && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
								var part = body.parts[j];
								if (Vertices.contains(part.vertices, mouse.position)) {
									constraint.pointA = mouse.position;
									constraint.bodyB = mouseConstraint.body = body;
									constraint.pointB = {
										x: mouse.position.x - body.position.x,
										y: mouse.position.y - body.position.y
									};
									constraint.angleB = body.angle;
									Sleeping.set(body, false);
									Events.trigger(mouseConstraint, "startdrag", {
										mouse,
										body
									});
									break;
								}
							}
						}
						else {
							Sleeping.set(constraint.bodyB, false);
							constraint.pointA = mouse.position;
						}
						else {
							constraint.bodyB = mouseConstraint.body = null;
							constraint.pointB = null;
							if (body) Events.trigger(mouseConstraint, "enddrag", {
								mouse,
								body
							});
						}
					};
					/**
					* Triggers mouse constraint events.
					* @method _triggerEvents
					* @private
					* @param {mouse} mouseConstraint
					*/
					MouseConstraint._triggerEvents = function(mouseConstraint) {
						var mouse = mouseConstraint.mouse, mouseEvents = mouse.sourceEvents;
						if (mouseEvents.mousemove) Events.trigger(mouseConstraint, "mousemove", { mouse });
						if (mouseEvents.mousedown) Events.trigger(mouseConstraint, "mousedown", { mouse });
						if (mouseEvents.mouseup) Events.trigger(mouseConstraint, "mouseup", { mouse });
						Mouse.clearSourceEvents(mouse);
					};
					/**
					* Fired when the mouse has moved (or a touch moves) during the last step
					*
					* @event mousemove
					* @param {} event An event object
					* @param {mouse} event.mouse The engine's mouse instance
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when the mouse is down (or a touch has started) during the last step
					*
					* @event mousedown
					* @param {} event An event object
					* @param {mouse} event.mouse The engine's mouse instance
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when the mouse is up (or a touch has ended) during the last step
					*
					* @event mouseup
					* @param {} event An event object
					* @param {mouse} event.mouse The engine's mouse instance
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when the user starts dragging a body
					*
					* @event startdrag
					* @param {} event An event object
					* @param {mouse} event.mouse The engine's mouse instance
					* @param {body} event.body The body being dragged
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired when the user ends dragging a body
					*
					* @event enddrag
					* @param {} event An event object
					* @param {mouse} event.mouse The engine's mouse instance
					* @param {body} event.body The body that has stopped being dragged
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* A `String` denoting the type of object.
					*
					* @property type
					* @type string
					* @default "constraint"
					* @readOnly
					*/
					/**
					* The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
					*
					* @property mouse
					* @type mouse
					* @default mouse
					*/
					/**
					* The `Body` that is currently being moved by the user, or `null` if no body.
					*
					* @property body
					* @type body
					* @default null
					*/
					/**
					* The `Constraint` object that is used to move the body during interaction.
					*
					* @property constraint
					* @type constraint
					*/
					/**
					* An `Object` that specifies the collision filter properties.
					* The collision filter allows the user to define which types of body this mouse constraint can interact with.
					* See `body.collisionFilter` for more information.
					*
					* @property collisionFilter
					* @type object
					*/
				})();
			}),
			(function(module$32, exports$28, __webpack_require__) {
				/**
				* The `Matter.Query` module contains methods for performing collision queries.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Query
				*/
				var Query = {};
				module$32.exports = Query;
				var Vector = __webpack_require__(2);
				var Collision = __webpack_require__(8);
				var Bounds = __webpack_require__(1);
				var Bodies = __webpack_require__(12);
				var Vertices = __webpack_require__(3);
				(function() {
					/**
					* Returns a list of collisions between `body` and `bodies`.
					* @method collides
					* @param {body} body
					* @param {body[]} bodies
					* @return {collision[]} Collisions
					*/
					Query.collides = function(body, bodies) {
						var collisions = [], bodiesLength = bodies.length, bounds = body.bounds, collides = Collision.collides, overlaps = Bounds.overlaps;
						for (var i = 0; i < bodiesLength; i++) {
							var bodyA = bodies[i], partsALength = bodyA.parts.length, partsAStart = partsALength === 1 ? 0 : 1;
							if (overlaps(bodyA.bounds, bounds)) for (var j = partsAStart; j < partsALength; j++) {
								var part = bodyA.parts[j];
								if (overlaps(part.bounds, bounds)) {
									var collision = collides(part, body);
									if (collision) {
										collisions.push(collision);
										break;
									}
								}
							}
						}
						return collisions;
					};
					/**
					* Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
					* @method ray
					* @param {body[]} bodies
					* @param {vector} startPoint
					* @param {vector} endPoint
					* @param {number} [rayWidth]
					* @return {collision[]} Collisions
					*/
					Query.ray = function(bodies, startPoint, endPoint, rayWidth) {
						rayWidth = rayWidth || 1e-100;
						var rayAngle = Vector.angle(startPoint, endPoint), rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)), rayX = (endPoint.x + startPoint.x) * .5, rayY = (endPoint.y + startPoint.y) * .5, ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }), collisions = Query.collides(ray, bodies);
						for (var i = 0; i < collisions.length; i += 1) {
							var collision = collisions[i];
							collision.body = collision.bodyB = collision.bodyA;
						}
						return collisions;
					};
					/**
					* Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
					* @method region
					* @param {body[]} bodies
					* @param {bounds} bounds
					* @param {bool} [outside=false]
					* @return {body[]} The bodies matching the query
					*/
					Query.region = function(bodies, bounds, outside) {
						var result = [];
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i], overlaps = Bounds.overlaps(body.bounds, bounds);
							if (overlaps && !outside || !overlaps && outside) result.push(body);
						}
						return result;
					};
					/**
					* Returns all bodies whose vertices contain the given point, from the given set of bodies.
					* @method point
					* @param {body[]} bodies
					* @param {vector} point
					* @return {body[]} The bodies matching the query
					*/
					Query.point = function(bodies, point) {
						var result = [];
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i];
							if (Bounds.contains(body.bounds, point)) for (var j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
								var part = body.parts[j];
								if (Bounds.contains(part.bounds, point) && Vertices.contains(part.vertices, point)) {
									result.push(body);
									break;
								}
							}
						}
						return result;
					};
				})();
			}),
			(function(module$33, exports$29, __webpack_require__) {
				/**
				* The `Matter.Render` module is a lightweight, optional utility which provides a simple canvas based renderer for visualising instances of `Matter.Engine`.
				* It is intended for development and debugging purposes, but may also be suitable for simple games.
				* It includes a number of drawing options including wireframe, vector with support for sprites and viewports.
				*
				* @class Render
				*/
				var Render = {};
				module$33.exports = Render;
				var Body = __webpack_require__(4);
				var Common = __webpack_require__(0);
				var Composite = __webpack_require__(6);
				var Bounds = __webpack_require__(1);
				var Events = __webpack_require__(5);
				var Vector = __webpack_require__(2);
				var Mouse = __webpack_require__(14);
				(function() {
					var _requestAnimationFrame, _cancelAnimationFrame;
					if (typeof window !== "undefined") {
						_requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
							window.setTimeout(function() {
								callback(Common.now());
							}, 1e3 / 60);
						};
						_cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
					}
					Render._goodFps = 30;
					Render._goodDelta = 1e3 / 60;
					/**
					* Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
					* All properties have default values, and many are pre-calculated automatically based on other properties.
					* See the properties section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {object} [options]
					* @return {render} A new renderer
					*/
					Render.create = function(options) {
						var defaults = {
							engine: null,
							element: null,
							canvas: null,
							mouse: null,
							frameRequestId: null,
							timing: {
								historySize: 60,
								delta: 0,
								deltaHistory: [],
								lastTime: 0,
								lastTimestamp: 0,
								lastElapsed: 0,
								timestampElapsed: 0,
								timestampElapsedHistory: [],
								engineDeltaHistory: [],
								engineElapsedHistory: [],
								engineUpdatesHistory: [],
								elapsedHistory: []
							},
							options: {
								width: 800,
								height: 600,
								pixelRatio: 1,
								background: "#14151f",
								wireframeBackground: "#14151f",
								wireframeStrokeStyle: "#bbb",
								hasBounds: !!options.bounds,
								enabled: true,
								wireframes: true,
								showSleeping: true,
								showDebug: false,
								showStats: false,
								showPerformance: false,
								showBounds: false,
								showVelocity: false,
								showCollisions: false,
								showSeparations: false,
								showAxes: false,
								showPositions: false,
								showAngleIndicator: false,
								showIds: false,
								showVertexNumbers: false,
								showConvexHulls: false,
								showInternalEdges: false,
								showMousePosition: false
							}
						};
						var render = Common.extend(defaults, options);
						if (render.canvas) {
							render.canvas.width = render.options.width || render.canvas.width;
							render.canvas.height = render.options.height || render.canvas.height;
						}
						render.mouse = options.mouse;
						render.engine = options.engine;
						render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
						render.context = render.canvas.getContext("2d");
						render.textures = {};
						render.bounds = render.bounds || {
							min: {
								x: 0,
								y: 0
							},
							max: {
								x: render.canvas.width,
								y: render.canvas.height
							}
						};
						render.controller = Render;
						render.options.showBroadphase = false;
						if (render.options.pixelRatio !== 1) Render.setPixelRatio(render, render.options.pixelRatio);
						if (Common.isElement(render.element)) render.element.appendChild(render.canvas);
						return render;
					};
					/**
					* Continuously updates the render canvas on the `requestAnimationFrame` event.
					* @method run
					* @param {render} render
					*/
					Render.run = function(render) {
						(function loop(time) {
							render.frameRequestId = _requestAnimationFrame(loop);
							_updateTiming(render, time);
							Render.world(render, time);
							render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
							if (render.options.showStats || render.options.showDebug) Render.stats(render, render.context, time);
							if (render.options.showPerformance || render.options.showDebug) Render.performance(render, render.context, time);
							render.context.setTransform(1, 0, 0, 1, 0, 0);
						})();
					};
					/**
					* Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
					* @method stop
					* @param {render} render
					*/
					Render.stop = function(render) {
						_cancelAnimationFrame(render.frameRequestId);
					};
					/**
					* Sets the pixel ratio of the renderer and updates the canvas.
					* To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
					* @method setPixelRatio
					* @param {render} render
					* @param {number} pixelRatio
					*/
					Render.setPixelRatio = function(render, pixelRatio) {
						var options = render.options, canvas = render.canvas;
						if (pixelRatio === "auto") pixelRatio = _getPixelRatio(canvas);
						options.pixelRatio = pixelRatio;
						canvas.setAttribute("data-pixel-ratio", pixelRatio);
						canvas.width = options.width * pixelRatio;
						canvas.height = options.height * pixelRatio;
						canvas.style.width = options.width + "px";
						canvas.style.height = options.height + "px";
					};
					/**
					* Sets the render `width` and `height`.
					* 
					* Updates the canvas accounting for `render.options.pixelRatio`.  
					* 
					* Updates the bottom right render bound `render.bounds.max` relative to the provided `width` and `height`.
					* The top left render bound `render.bounds.min` isn't changed.
					* 
					* Follow this call with `Render.lookAt` if you need to change the render bounds.
					* 
					* See also `Render.setPixelRatio`.
					* @method setSize
					* @param {render} render
					* @param {number} width The width (in CSS pixels)
					* @param {number} height The height (in CSS pixels)
					*/
					Render.setSize = function(render, width, height) {
						render.options.width = width;
						render.options.height = height;
						render.bounds.max.x = render.bounds.min.x + width;
						render.bounds.max.y = render.bounds.min.y + height;
						if (render.options.pixelRatio !== 1) Render.setPixelRatio(render, render.options.pixelRatio);
						else {
							render.canvas.width = width;
							render.canvas.height = height;
						}
					};
					/**
					* Positions and sizes the viewport around the given object bounds.
					* Objects must have at least one of the following properties:
					* - `object.bounds`
					* - `object.position`
					* - `object.min` and `object.max`
					* - `object.x` and `object.y`
					* @method lookAt
					* @param {render} render
					* @param {object[]} objects
					* @param {vector} [padding]
					* @param {bool} [center=true]
					*/
					Render.lookAt = function(render, objects, padding, center) {
						center = typeof center !== "undefined" ? center : true;
						objects = Common.isArray(objects) ? objects : [objects];
						padding = padding || {
							x: 0,
							y: 0
						};
						var bounds = {
							min: {
								x: Infinity,
								y: Infinity
							},
							max: {
								x: -Infinity,
								y: -Infinity
							}
						};
						for (var i = 0; i < objects.length; i += 1) {
							var object = objects[i], min = object.bounds ? object.bounds.min : object.min || object.position || object, max = object.bounds ? object.bounds.max : object.max || object.position || object;
							if (min && max) {
								if (min.x < bounds.min.x) bounds.min.x = min.x;
								if (max.x > bounds.max.x) bounds.max.x = max.x;
								if (min.y < bounds.min.y) bounds.min.y = min.y;
								if (max.y > bounds.max.y) bounds.max.y = max.y;
							}
						}
						var width = bounds.max.x - bounds.min.x + 2 * padding.x, height = bounds.max.y - bounds.min.y + 2 * padding.y, viewHeight = render.canvas.height, outerRatio = render.canvas.width / viewHeight, innerRatio = width / height, scaleX = 1, scaleY = 1;
						if (innerRatio > outerRatio) scaleY = innerRatio / outerRatio;
						else scaleX = outerRatio / innerRatio;
						render.options.hasBounds = true;
						render.bounds.min.x = bounds.min.x;
						render.bounds.max.x = bounds.min.x + width * scaleX;
						render.bounds.min.y = bounds.min.y;
						render.bounds.max.y = bounds.min.y + height * scaleY;
						if (center) {
							render.bounds.min.x += width * .5 - width * scaleX * .5;
							render.bounds.max.x += width * .5 - width * scaleX * .5;
							render.bounds.min.y += height * .5 - height * scaleY * .5;
							render.bounds.max.y += height * .5 - height * scaleY * .5;
						}
						render.bounds.min.x -= padding.x;
						render.bounds.max.x -= padding.x;
						render.bounds.min.y -= padding.y;
						render.bounds.max.y -= padding.y;
						if (render.mouse) {
							Mouse.setScale(render.mouse, {
								x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
								y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height
							});
							Mouse.setOffset(render.mouse, render.bounds.min);
						}
					};
					/**
					* Applies viewport transforms based on `render.bounds` to a render context.
					* @method startViewTransform
					* @param {render} render
					*/
					Render.startViewTransform = function(render) {
						var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
						render.context.setTransform(render.options.pixelRatio / boundsScaleX, 0, 0, render.options.pixelRatio / boundsScaleY, 0, 0);
						render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
					};
					/**
					* Resets all transforms on the render context.
					* @method endViewTransform
					* @param {render} render
					*/
					Render.endViewTransform = function(render) {
						render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
					};
					/**
					* Renders the given `engine`'s `Matter.World` object.
					* This is the entry point for all rendering and should be called every time the scene changes.
					* @method world
					* @param {render} render
					*/
					Render.world = function(render, time) {
						var startTime = Common.now(), engine = render.engine, world = engine.world, canvas = render.canvas, context = render.context, options = render.options, timing = render.timing;
						var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world), background = options.wireframes ? options.wireframeBackground : options.background, bodies = [], constraints = [], i;
						var event = { timestamp: engine.timing.timestamp };
						Events.trigger(render, "beforeRender", event);
						if (render.currentBackground !== background) _applyBackground(render, background);
						context.globalCompositeOperation = "source-in";
						context.fillStyle = "transparent";
						context.fillRect(0, 0, canvas.width, canvas.height);
						context.globalCompositeOperation = "source-over";
						if (options.hasBounds) {
							for (i = 0; i < allBodies.length; i++) {
								var body = allBodies[i];
								if (Bounds.overlaps(body.bounds, render.bounds)) bodies.push(body);
							}
							for (i = 0; i < allConstraints.length; i++) {
								var constraint = allConstraints[i], bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointAWorld = constraint.pointA, pointBWorld = constraint.pointB;
								if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
								if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);
								if (!pointAWorld || !pointBWorld) continue;
								if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld)) constraints.push(constraint);
							}
							Render.startViewTransform(render);
							if (render.mouse) {
								Mouse.setScale(render.mouse, {
									x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
									y: (render.bounds.max.y - render.bounds.min.y) / render.options.height
								});
								Mouse.setOffset(render.mouse, render.bounds.min);
							}
						} else {
							constraints = allConstraints;
							bodies = allBodies;
							if (render.options.pixelRatio !== 1) render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
						}
						if (!options.wireframes || engine.enableSleeping && options.showSleeping) Render.bodies(render, bodies, context);
						else {
							if (options.showConvexHulls) Render.bodyConvexHulls(render, bodies, context);
							Render.bodyWireframes(render, bodies, context);
						}
						if (options.showBounds) Render.bodyBounds(render, bodies, context);
						if (options.showAxes || options.showAngleIndicator) Render.bodyAxes(render, bodies, context);
						if (options.showPositions) Render.bodyPositions(render, bodies, context);
						if (options.showVelocity) Render.bodyVelocity(render, bodies, context);
						if (options.showIds) Render.bodyIds(render, bodies, context);
						if (options.showSeparations) Render.separations(render, engine.pairs.list, context);
						if (options.showCollisions) Render.collisions(render, engine.pairs.list, context);
						if (options.showVertexNumbers) Render.vertexNumbers(render, bodies, context);
						if (options.showMousePosition) Render.mousePosition(render, render.mouse, context);
						Render.constraints(constraints, context);
						if (options.hasBounds) Render.endViewTransform(render);
						Events.trigger(render, "afterRender", event);
						timing.lastElapsed = Common.now() - startTime;
					};
					/**
					* Renders statistics about the engine and world useful for debugging.
					* @private
					* @method stats
					* @param {render} render
					* @param {RenderingContext} context
					* @param {Number} time
					*/
					Render.stats = function(render, context, time) {
						var engine = render.engine, world = engine.world, bodies = Composite.allBodies(world), parts = 0, width = 55, height = 44, x = 0, y = 0;
						for (var i = 0; i < bodies.length; i += 1) parts += bodies[i].parts.length;
						var sections = {
							"Part": parts,
							"Body": bodies.length,
							"Cons": Composite.allConstraints(world).length,
							"Comp": Composite.allComposites(world).length,
							"Pair": engine.pairs.list.length
						};
						context.fillStyle = "#0e0f19";
						context.fillRect(x, y, width * 5.5, height);
						context.font = "12px Arial";
						context.textBaseline = "top";
						context.textAlign = "right";
						for (var key in sections) {
							var section = sections[key];
							context.fillStyle = "#aaa";
							context.fillText(key, x + width, y + 8);
							context.fillStyle = "#eee";
							context.fillText(section, x + width, y + 26);
							x += width;
						}
					};
					/**
					* Renders engine and render performance information.
					* @private
					* @method performance
					* @param {render} render
					* @param {RenderingContext} context
					*/
					Render.performance = function(render, context) {
						var engine = render.engine, timing = render.timing, deltaHistory = timing.deltaHistory, elapsedHistory = timing.elapsedHistory, timestampElapsedHistory = timing.timestampElapsedHistory, engineDeltaHistory = timing.engineDeltaHistory, engineUpdatesHistory = timing.engineUpdatesHistory, engineElapsedHistory = timing.engineElapsedHistory, lastEngineUpdatesPerFrame = engine.timing.lastUpdatesPerFrame, lastEngineDelta = engine.timing.lastDelta;
						var deltaMean = _mean(deltaHistory), elapsedMean = _mean(elapsedHistory), engineDeltaMean = _mean(engineDeltaHistory), engineUpdatesMean = _mean(engineUpdatesHistory), engineElapsedMean = _mean(engineElapsedHistory), rateMean = _mean(timestampElapsedHistory) / deltaMean || 0, neededUpdatesPerFrame = Math.round(deltaMean / lastEngineDelta), fps = 1e3 / deltaMean || 0;
						var graphHeight = 4, gap = 12, width = 60, height = 34, x = 10, y = 69;
						context.fillStyle = "#0e0f19";
						context.fillRect(0, 50, gap * 5 + width * 6 + 22, height);
						Render.status(context, x, y, width, graphHeight, deltaHistory.length, Math.round(fps) + " fps", fps / Render._goodFps, function(i) {
							return deltaHistory[i] / deltaMean - 1;
						});
						Render.status(context, x + gap + width, y, width, graphHeight, engineDeltaHistory.length, lastEngineDelta.toFixed(2) + " dt", Render._goodDelta / lastEngineDelta, function(i) {
							return engineDeltaHistory[i] / engineDeltaMean - 1;
						});
						Render.status(context, x + (gap + width) * 2, y, width, graphHeight, engineUpdatesHistory.length, lastEngineUpdatesPerFrame + " upf", Math.pow(Common.clamp(engineUpdatesMean / neededUpdatesPerFrame || 1, 0, 1), 4), function(i) {
							return engineUpdatesHistory[i] / engineUpdatesMean - 1;
						});
						Render.status(context, x + (gap + width) * 3, y, width, graphHeight, engineElapsedHistory.length, engineElapsedMean.toFixed(2) + " ut", 1 - lastEngineUpdatesPerFrame * engineElapsedMean / Render._goodFps, function(i) {
							return engineElapsedHistory[i] / engineElapsedMean - 1;
						});
						Render.status(context, x + (gap + width) * 4, y, width, graphHeight, elapsedHistory.length, elapsedMean.toFixed(2) + " rt", 1 - elapsedMean / Render._goodFps, function(i) {
							return elapsedHistory[i] / elapsedMean - 1;
						});
						Render.status(context, x + (gap + width) * 5, y, width, graphHeight, timestampElapsedHistory.length, rateMean.toFixed(2) + " x", rateMean * rateMean * rateMean, function(i) {
							return (timestampElapsedHistory[i] / deltaHistory[i] / rateMean || 0) - 1;
						});
					};
					/**
					* Renders a label, indicator and a chart.
					* @private
					* @method status
					* @param {RenderingContext} context
					* @param {number} x
					* @param {number} y
					* @param {number} width
					* @param {number} height
					* @param {number} count
					* @param {string} label
					* @param {string} indicator
					* @param {function} plotY
					*/
					Render.status = function(context, x, y, width, height, count, label, indicator, plotY) {
						context.strokeStyle = "#888";
						context.fillStyle = "#444";
						context.lineWidth = 1;
						context.fillRect(x, y + 7, width, 1);
						context.beginPath();
						context.moveTo(x, y + 7 - height * Common.clamp(.4 * plotY(0), -2, 2));
						for (var i = 0; i < width; i += 1) context.lineTo(x + i, y + 7 - (i < count ? height * Common.clamp(.4 * plotY(i), -2, 2) : 0));
						context.stroke();
						context.fillStyle = "hsl(" + Common.clamp(25 + 95 * indicator, 0, 120) + ",100%,60%)";
						context.fillRect(x, y - 7, 4, 4);
						context.font = "12px Arial";
						context.textBaseline = "middle";
						context.textAlign = "right";
						context.fillStyle = "#eee";
						context.fillText(label, x + width, y - 5);
					};
					/**
					* Description
					* @private
					* @method constraints
					* @param {constraint[]} constraints
					* @param {RenderingContext} context
					*/
					Render.constraints = function(constraints, context) {
						var c = context;
						for (var i = 0; i < constraints.length; i++) {
							var constraint = constraints[i];
							if (!constraint.render.visible || !constraint.pointA || !constraint.pointB) continue;
							var bodyA = constraint.bodyA, bodyB = constraint.bodyB, start, end;
							if (bodyA) start = Vector.add(bodyA.position, constraint.pointA);
							else start = constraint.pointA;
							if (constraint.render.type === "pin") {
								c.beginPath();
								c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
								c.closePath();
							} else {
								if (bodyB) end = Vector.add(bodyB.position, constraint.pointB);
								else end = constraint.pointB;
								c.beginPath();
								c.moveTo(start.x, start.y);
								if (constraint.render.type === "spring") {
									var delta = Vector.sub(end, start), normal = Vector.perp(Vector.normalise(delta)), coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20)), offset;
									for (var j = 1; j < coils; j += 1) {
										offset = j % 2 === 0 ? 1 : -1;
										c.lineTo(start.x + delta.x * (j / coils) + normal.x * offset * 4, start.y + delta.y * (j / coils) + normal.y * offset * 4);
									}
								}
								c.lineTo(end.x, end.y);
							}
							if (constraint.render.lineWidth) {
								c.lineWidth = constraint.render.lineWidth;
								c.strokeStyle = constraint.render.strokeStyle;
								c.stroke();
							}
							if (constraint.render.anchors) {
								c.fillStyle = constraint.render.strokeStyle;
								c.beginPath();
								c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
								c.arc(end.x, end.y, 3, 0, 2 * Math.PI);
								c.closePath();
								c.fill();
							}
						}
					};
					/**
					* Description
					* @private
					* @method bodies
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodies = function(render, bodies, context) {
						var c = context;
						render.engine;
						var options = render.options, showInternalEdges = options.showInternalEdges || !options.wireframes, body, part, i, k;
						for (i = 0; i < bodies.length; i++) {
							body = bodies[i];
							if (!body.render.visible) continue;
							for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
								part = body.parts[k];
								if (!part.render.visible) continue;
								if (options.showSleeping && body.isSleeping) c.globalAlpha = .5 * part.render.opacity;
								else if (part.render.opacity !== 1) c.globalAlpha = part.render.opacity;
								if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
									var sprite = part.render.sprite, texture = _getTexture(render, sprite.texture);
									c.translate(part.position.x, part.position.y);
									c.rotate(part.angle);
									c.drawImage(texture, texture.width * -sprite.xOffset * sprite.xScale, texture.height * -sprite.yOffset * sprite.yScale, texture.width * sprite.xScale, texture.height * sprite.yScale);
									c.rotate(-part.angle);
									c.translate(-part.position.x, -part.position.y);
								} else {
									if (part.circleRadius) {
										c.beginPath();
										c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
									} else {
										c.beginPath();
										c.moveTo(part.vertices[0].x, part.vertices[0].y);
										for (var j = 1; j < part.vertices.length; j++) {
											if (!part.vertices[j - 1].isInternal || showInternalEdges) c.lineTo(part.vertices[j].x, part.vertices[j].y);
											else c.moveTo(part.vertices[j].x, part.vertices[j].y);
											if (part.vertices[j].isInternal && !showInternalEdges) c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
										}
										c.lineTo(part.vertices[0].x, part.vertices[0].y);
										c.closePath();
									}
									if (!options.wireframes) {
										c.fillStyle = part.render.fillStyle;
										if (part.render.lineWidth) {
											c.lineWidth = part.render.lineWidth;
											c.strokeStyle = part.render.strokeStyle;
											c.stroke();
										}
										c.fill();
									} else {
										c.lineWidth = 1;
										c.strokeStyle = render.options.wireframeStrokeStyle;
										c.stroke();
									}
								}
								c.globalAlpha = 1;
							}
						}
					};
					/**
					* Optimised method for drawing body wireframes in one pass
					* @private
					* @method bodyWireframes
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyWireframes = function(render, bodies, context) {
						var c = context, showInternalEdges = render.options.showInternalEdges, body, part, i, j, k;
						c.beginPath();
						for (i = 0; i < bodies.length; i++) {
							body = bodies[i];
							if (!body.render.visible) continue;
							for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
								part = body.parts[k];
								c.moveTo(part.vertices[0].x, part.vertices[0].y);
								for (j = 1; j < part.vertices.length; j++) {
									if (!part.vertices[j - 1].isInternal || showInternalEdges) c.lineTo(part.vertices[j].x, part.vertices[j].y);
									else c.moveTo(part.vertices[j].x, part.vertices[j].y);
									if (part.vertices[j].isInternal && !showInternalEdges) c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
								}
								c.lineTo(part.vertices[0].x, part.vertices[0].y);
							}
						}
						c.lineWidth = 1;
						c.strokeStyle = render.options.wireframeStrokeStyle;
						c.stroke();
					};
					/**
					* Optimised method for drawing body convex hull wireframes in one pass
					* @private
					* @method bodyConvexHulls
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyConvexHulls = function(render, bodies, context) {
						var c = context, body, i, j;
						c.beginPath();
						for (i = 0; i < bodies.length; i++) {
							body = bodies[i];
							if (!body.render.visible || body.parts.length === 1) continue;
							c.moveTo(body.vertices[0].x, body.vertices[0].y);
							for (j = 1; j < body.vertices.length; j++) c.lineTo(body.vertices[j].x, body.vertices[j].y);
							c.lineTo(body.vertices[0].x, body.vertices[0].y);
						}
						c.lineWidth = 1;
						c.strokeStyle = "rgba(255,255,255,0.2)";
						c.stroke();
					};
					/**
					* Renders body vertex numbers.
					* @private
					* @method vertexNumbers
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.vertexNumbers = function(render, bodies, context) {
						var c = context, i, j, k;
						for (i = 0; i < bodies.length; i++) {
							var parts = bodies[i].parts;
							for (k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
								var part = parts[k];
								for (j = 0; j < part.vertices.length; j++) {
									c.fillStyle = "rgba(255,255,255,0.2)";
									c.fillText(i + "_" + j, part.position.x + (part.vertices[j].x - part.position.x) * .8, part.position.y + (part.vertices[j].y - part.position.y) * .8);
								}
							}
						}
					};
					/**
					* Renders mouse position.
					* @private
					* @method mousePosition
					* @param {render} render
					* @param {mouse} mouse
					* @param {RenderingContext} context
					*/
					Render.mousePosition = function(render, mouse, context) {
						var c = context;
						c.fillStyle = "rgba(255,255,255,0.8)";
						c.fillText(mouse.position.x + "  " + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
					};
					/**
					* Draws body bounds
					* @private
					* @method bodyBounds
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyBounds = function(render, bodies, context) {
						var c = context;
						render.engine;
						var options = render.options;
						c.beginPath();
						for (var i = 0; i < bodies.length; i++) if (bodies[i].render.visible) {
							var parts = bodies[i].parts;
							for (var j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
								var part = parts[j];
								c.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
							}
						}
						if (options.wireframes) c.strokeStyle = "rgba(255,255,255,0.08)";
						else c.strokeStyle = "rgba(0,0,0,0.1)";
						c.lineWidth = 1;
						c.stroke();
					};
					/**
					* Draws body angle indicators and axes
					* @private
					* @method bodyAxes
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyAxes = function(render, bodies, context) {
						var c = context;
						render.engine;
						var options = render.options, part, i, j, k;
						c.beginPath();
						for (i = 0; i < bodies.length; i++) {
							var body = bodies[i], parts = body.parts;
							if (!body.render.visible) continue;
							if (options.showAxes) for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
								part = parts[j];
								for (k = 0; k < part.axes.length; k++) {
									var axis = part.axes[k];
									c.moveTo(part.position.x, part.position.y);
									c.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
								}
							}
							else for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
								part = parts[j];
								for (k = 0; k < part.axes.length; k++) {
									c.moveTo(part.position.x, part.position.y);
									c.lineTo((part.vertices[0].x + part.vertices[part.vertices.length - 1].x) / 2, (part.vertices[0].y + part.vertices[part.vertices.length - 1].y) / 2);
								}
							}
						}
						if (options.wireframes) {
							c.strokeStyle = "indianred";
							c.lineWidth = 1;
						} else {
							c.strokeStyle = "rgba(255, 255, 255, 0.4)";
							c.globalCompositeOperation = "overlay";
							c.lineWidth = 2;
						}
						c.stroke();
						c.globalCompositeOperation = "source-over";
					};
					/**
					* Draws body positions
					* @private
					* @method bodyPositions
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyPositions = function(render, bodies, context) {
						var c = context;
						render.engine;
						var options = render.options, body, part, i, k;
						c.beginPath();
						for (i = 0; i < bodies.length; i++) {
							body = bodies[i];
							if (!body.render.visible) continue;
							for (k = 0; k < body.parts.length; k++) {
								part = body.parts[k];
								c.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
								c.closePath();
							}
						}
						if (options.wireframes) c.fillStyle = "indianred";
						else c.fillStyle = "rgba(0,0,0,0.5)";
						c.fill();
						c.beginPath();
						for (i = 0; i < bodies.length; i++) {
							body = bodies[i];
							if (body.render.visible) {
								c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
								c.closePath();
							}
						}
						c.fillStyle = "rgba(255,165,0,0.8)";
						c.fill();
					};
					/**
					* Draws body velocity
					* @private
					* @method bodyVelocity
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyVelocity = function(render, bodies, context) {
						var c = context;
						c.beginPath();
						for (var i = 0; i < bodies.length; i++) {
							var body = bodies[i];
							if (!body.render.visible) continue;
							var velocity = Body.getVelocity(body);
							c.moveTo(body.position.x, body.position.y);
							c.lineTo(body.position.x + velocity.x, body.position.y + velocity.y);
						}
						c.lineWidth = 3;
						c.strokeStyle = "cornflowerblue";
						c.stroke();
					};
					/**
					* Draws body ids
					* @private
					* @method bodyIds
					* @param {render} render
					* @param {body[]} bodies
					* @param {RenderingContext} context
					*/
					Render.bodyIds = function(render, bodies, context) {
						var c = context, i, j;
						for (i = 0; i < bodies.length; i++) {
							if (!bodies[i].render.visible) continue;
							var parts = bodies[i].parts;
							for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
								var part = parts[j];
								c.font = "12px Arial";
								c.fillStyle = "rgba(255,255,255,0.5)";
								c.fillText(part.id, part.position.x + 10, part.position.y - 10);
							}
						}
					};
					/**
					* Description
					* @private
					* @method collisions
					* @param {render} render
					* @param {pair[]} pairs
					* @param {RenderingContext} context
					*/
					Render.collisions = function(render, pairs, context) {
						var c = context, options = render.options, pair, collision, i, j;
						c.beginPath();
						for (i = 0; i < pairs.length; i++) {
							pair = pairs[i];
							if (!pair.isActive) continue;
							collision = pair.collision;
							for (j = 0; j < pair.contactCount; j++) {
								var vertex = pair.contacts[j].vertex;
								c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
							}
						}
						if (options.wireframes) c.fillStyle = "rgba(255,255,255,0.7)";
						else c.fillStyle = "orange";
						c.fill();
						c.beginPath();
						for (i = 0; i < pairs.length; i++) {
							pair = pairs[i];
							if (!pair.isActive) continue;
							collision = pair.collision;
							if (pair.contactCount > 0) {
								var normalPosX = pair.contacts[0].vertex.x, normalPosY = pair.contacts[0].vertex.y;
								if (pair.contactCount === 2) {
									normalPosX = (pair.contacts[0].vertex.x + pair.contacts[1].vertex.x) / 2;
									normalPosY = (pair.contacts[0].vertex.y + pair.contacts[1].vertex.y) / 2;
								}
								if (collision.bodyB === collision.supports[0].body || collision.bodyA.isStatic === true) c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
								else c.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
								c.lineTo(normalPosX, normalPosY);
							}
						}
						if (options.wireframes) c.strokeStyle = "rgba(255,165,0,0.7)";
						else c.strokeStyle = "orange";
						c.lineWidth = 1;
						c.stroke();
					};
					/**
					* Description
					* @private
					* @method separations
					* @param {render} render
					* @param {pair[]} pairs
					* @param {RenderingContext} context
					*/
					Render.separations = function(render, pairs, context) {
						var c = context, options = render.options, pair, collision, bodyA, bodyB, i;
						c.beginPath();
						for (i = 0; i < pairs.length; i++) {
							pair = pairs[i];
							if (!pair.isActive) continue;
							collision = pair.collision;
							bodyA = collision.bodyA;
							bodyB = collision.bodyB;
							var k = 1;
							if (!bodyB.isStatic && !bodyA.isStatic) k = .5;
							if (bodyB.isStatic) k = 0;
							c.moveTo(bodyB.position.x, bodyB.position.y);
							c.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);
							k = 1;
							if (!bodyB.isStatic && !bodyA.isStatic) k = .5;
							if (bodyA.isStatic) k = 0;
							c.moveTo(bodyA.position.x, bodyA.position.y);
							c.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
						}
						if (options.wireframes) c.strokeStyle = "rgba(255,165,0,0.5)";
						else c.strokeStyle = "orange";
						c.stroke();
					};
					/**
					* Description
					* @private
					* @method inspector
					* @param {inspector} inspector
					* @param {RenderingContext} context
					*/
					Render.inspector = function(inspector, context) {
						inspector.engine;
						var selected = inspector.selected, render = inspector.render, options = render.options, bounds;
						if (options.hasBounds) {
							var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
							context.scale(1 / boundsScaleX, 1 / boundsScaleY);
							context.translate(-render.bounds.min.x, -render.bounds.min.y);
						}
						for (var i = 0; i < selected.length; i++) {
							var item = selected[i].data;
							context.translate(.5, .5);
							context.lineWidth = 1;
							context.strokeStyle = "rgba(255,165,0,0.9)";
							context.setLineDash([1, 2]);
							switch (item.type) {
								case "body":
									bounds = item.bounds;
									context.beginPath();
									context.rect(Math.floor(bounds.min.x - 3), Math.floor(bounds.min.y - 3), Math.floor(bounds.max.x - bounds.min.x + 6), Math.floor(bounds.max.y - bounds.min.y + 6));
									context.closePath();
									context.stroke();
									break;
								case "constraint":
									var point = item.pointA;
									if (item.bodyA) point = item.pointB;
									context.beginPath();
									context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
									context.closePath();
									context.stroke();
									break;
							}
							context.setLineDash([]);
							context.translate(-.5, -.5);
						}
						if (inspector.selectStart !== null) {
							context.translate(.5, .5);
							context.lineWidth = 1;
							context.strokeStyle = "rgba(255,165,0,0.6)";
							context.fillStyle = "rgba(255,165,0,0.1)";
							bounds = inspector.selectBounds;
							context.beginPath();
							context.rect(Math.floor(bounds.min.x), Math.floor(bounds.min.y), Math.floor(bounds.max.x - bounds.min.x), Math.floor(bounds.max.y - bounds.min.y));
							context.closePath();
							context.stroke();
							context.fill();
							context.translate(-.5, -.5);
						}
						if (options.hasBounds) context.setTransform(1, 0, 0, 1, 0, 0);
					};
					/**
					* Updates render timing.
					* @method _updateTiming
					* @private
					* @param {render} render
					* @param {number} time
					*/
					var _updateTiming = function(render, time) {
						var engine = render.engine, timing = render.timing, historySize = timing.historySize, timestamp = engine.timing.timestamp;
						timing.delta = time - timing.lastTime || Render._goodDelta;
						timing.lastTime = time;
						timing.timestampElapsed = timestamp - timing.lastTimestamp || 0;
						timing.lastTimestamp = timestamp;
						timing.deltaHistory.unshift(timing.delta);
						timing.deltaHistory.length = Math.min(timing.deltaHistory.length, historySize);
						timing.engineDeltaHistory.unshift(engine.timing.lastDelta);
						timing.engineDeltaHistory.length = Math.min(timing.engineDeltaHistory.length, historySize);
						timing.timestampElapsedHistory.unshift(timing.timestampElapsed);
						timing.timestampElapsedHistory.length = Math.min(timing.timestampElapsedHistory.length, historySize);
						timing.engineUpdatesHistory.unshift(engine.timing.lastUpdatesPerFrame);
						timing.engineUpdatesHistory.length = Math.min(timing.engineUpdatesHistory.length, historySize);
						timing.engineElapsedHistory.unshift(engine.timing.lastElapsed);
						timing.engineElapsedHistory.length = Math.min(timing.engineElapsedHistory.length, historySize);
						timing.elapsedHistory.unshift(timing.lastElapsed);
						timing.elapsedHistory.length = Math.min(timing.elapsedHistory.length, historySize);
					};
					/**
					* Returns the mean value of the given numbers.
					* @method _mean
					* @private
					* @param {Number[]} values
					* @return {Number} the mean of given values
					*/
					var _mean = function(values) {
						var result = 0;
						for (var i = 0; i < values.length; i += 1) result += values[i];
						return result / values.length || 0;
					};
					/**
					* @method _createCanvas
					* @private
					* @param {} width
					* @param {} height
					* @return canvas
					*/
					var _createCanvas = function(width, height) {
						var canvas = document.createElement("canvas");
						canvas.width = width;
						canvas.height = height;
						canvas.oncontextmenu = function() {
							return false;
						};
						canvas.onselectstart = function() {
							return false;
						};
						return canvas;
					};
					/**
					* Gets the pixel ratio of the canvas.
					* @method _getPixelRatio
					* @private
					* @param {HTMLElement} canvas
					* @return {Number} pixel ratio
					*/
					var _getPixelRatio = function(canvas) {
						var context = canvas.getContext("2d");
						return (window.devicePixelRatio || 1) / (context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1);
					};
					/**
					* Gets the requested texture (an Image) via its path
					* @method _getTexture
					* @private
					* @param {render} render
					* @param {string} imagePath
					* @return {Image} texture
					*/
					var _getTexture = function(render, imagePath) {
						var image = render.textures[imagePath];
						if (image) return image;
						image = render.textures[imagePath] = new Image();
						image.src = imagePath;
						return image;
					};
					/**
					* Applies the background to the canvas using CSS.
					* @method applyBackground
					* @private
					* @param {render} render
					* @param {string} background
					*/
					var _applyBackground = function(render, background) {
						var cssBackground = background;
						if (/(jpg|gif|png)$/.test(background)) cssBackground = "url(" + background + ")";
						render.canvas.style.background = cssBackground;
						render.canvas.style.backgroundSize = "contain";
						render.currentBackground = background;
					};
					/**
					* Fired before rendering
					*
					* @event beforeRender
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired after rendering
					*
					* @event afterRender
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* A back-reference to the `Matter.Render` module.
					*
					* @deprecated
					* @property controller
					* @type render
					*/
					/**
					* A reference to the `Matter.Engine` instance to be used.
					*
					* @property engine
					* @type engine
					*/
					/**
					* A reference to the element where the canvas is to be inserted (if `render.canvas` has not been specified)
					*
					* @property element
					* @type HTMLElement
					* @default null
					*/
					/**
					* The canvas element to render to. If not specified, one will be created if `render.element` has been specified.
					*
					* @property canvas
					* @type HTMLCanvasElement
					* @default null
					*/
					/**
					* A `Bounds` object that specifies the drawing view region.
					* Rendering will be automatically transformed and scaled to fit within the canvas size (`render.options.width` and `render.options.height`).
					* This allows for creating views that can pan or zoom around the scene.
					* You must also set `render.options.hasBounds` to `true` to enable bounded rendering.
					*
					* @property bounds
					* @type bounds
					*/
					/**
					* The 2d rendering context from the `render.canvas` element.
					*
					* @property context
					* @type CanvasRenderingContext2D
					*/
					/**
					* The sprite texture cache.
					*
					* @property textures
					* @type {}
					*/
					/**
					* The mouse to render if `render.options.showMousePosition` is enabled.
					*
					* @property mouse
					* @type mouse
					* @default null
					*/
					/**
					* The configuration options of the renderer.
					*
					* @property options
					* @type {}
					*/
					/**
					* The target width in pixels of the `render.canvas` to be created.
					* See also the `options.pixelRatio` property to change render quality.
					*
					* @property options.width
					* @type number
					* @default 800
					*/
					/**
					* The target height in pixels of the `render.canvas` to be created.
					* See also the `options.pixelRatio` property to change render quality.
					*
					* @property options.height
					* @type number
					* @default 600
					*/
					/**
					* The [pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) to use when rendering.
					*
					* @property options.pixelRatio
					* @type number
					* @default 1
					*/
					/**
					* A CSS background color string to use when `render.options.wireframes` is disabled.
					* This may be also set to `'transparent'` or equivalent.
					*
					* @property options.background
					* @type string
					* @default '#14151f'
					*/
					/**
					* A CSS color string to use for background when `render.options.wireframes` is enabled.
					* This may be also set to `'transparent'` or equivalent.
					*
					* @property options.wireframeBackground
					* @type string
					* @default '#14151f'
					*/
					/**
					* A CSS color string to use for stroke when `render.options.wireframes` is enabled.
					* This may be also set to `'transparent'` or equivalent.
					*
					* @property options.wireframeStrokeStyle
					* @type string
					* @default '#bbb'
					*/
					/**
					* A flag that specifies if `render.bounds` should be used when rendering.
					*
					* @property options.hasBounds
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable all debug information overlays together.  
					* This includes and has priority over the values of:
					*
					* - `render.options.showStats`
					* - `render.options.showPerformance`
					*
					* @property options.showDebug
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the engine stats info overlay.  
					* From left to right, the values shown are:
					*
					* - body parts total
					* - body total
					* - constraints total
					* - composites total
					* - collision pairs total
					*
					* @property options.showStats
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable performance charts.  
					* From left to right, the values shown are:
					*
					* - average render frequency (e.g. 60 fps)
					* - exact engine delta time used for last update (e.g. 16.66ms)
					* - average updates per frame (e.g. 1)
					* - average engine execution duration (e.g. 5.00ms)
					* - average render execution duration (e.g. 0.40ms)
					* - average effective play speed (e.g. '1.00x' is 'real-time')
					*
					* Each value is recorded over a fixed sample of past frames (60 frames).
					*
					* A chart shown below each value indicates the variance from the average over the sample.
					* The more stable or fixed the value is the flatter the chart will appear.
					*
					* @property options.showPerformance
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable rendering entirely.
					*
					* @property options.enabled
					* @type boolean
					* @default false
					*/
					/**
					* A flag to toggle wireframe rendering otherwise solid fill rendering is used.
					*
					* @property options.wireframes
					* @type boolean
					* @default true
					*/
					/**
					* A flag to enable or disable sleeping bodies indicators.
					*
					* @property options.showSleeping
					* @type boolean
					* @default true
					*/
					/**
					* A flag to enable or disable the debug information overlay.
					*
					* @property options.showDebug
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the collision broadphase debug overlay.
					*
					* @deprecated no longer implemented
					* @property options.showBroadphase
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body bounds debug overlay.
					*
					* @property options.showBounds
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body velocity debug overlay.
					*
					* @property options.showVelocity
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body collisions debug overlay.
					*
					* @property options.showCollisions
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the collision resolver separations debug overlay.
					*
					* @property options.showSeparations
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body axes debug overlay.
					*
					* @property options.showAxes
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body positions debug overlay.
					*
					* @property options.showPositions
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body angle debug overlay.
					*
					* @property options.showAngleIndicator
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body and part ids debug overlay.
					*
					* @property options.showIds
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body vertex numbers debug overlay.
					*
					* @property options.showVertexNumbers
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body convex hulls debug overlay.
					*
					* @property options.showConvexHulls
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the body internal edges debug overlay.
					*
					* @property options.showInternalEdges
					* @type boolean
					* @default false
					*/
					/**
					* A flag to enable or disable the mouse position debug overlay.
					*
					* @property options.showMousePosition
					* @type boolean
					* @default false
					*/
				})();
			}),
			(function(module$34, exports$30, __webpack_require__) {
				/**
				* The `Matter.Runner` module is an optional utility that provides a game loop for running a `Matter.Engine` inside a browser environment.
				* A runner will continuously update a `Matter.Engine` whilst synchronising engine updates with the browser frame rate.
				* This runner favours a smoother user experience over perfect time keeping.
				* This runner is optional and is used for development and debugging but could be useful as a starting point for implementing some games and experiences.
				* Alternatively see `Engine.update` to step the engine directly inside your own game loop implementation as may be needed inside other environments.
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Runner
				*/
				var Runner = {};
				module$34.exports = Runner;
				var Events = __webpack_require__(5);
				var Engine = __webpack_require__(17);
				var Common = __webpack_require__(0);
				(function() {
					Runner._maxFrameDelta = 1e3 / 15;
					Runner._frameDeltaFallback = 1e3 / 60;
					Runner._timeBufferMargin = 1.5;
					Runner._elapsedNextEstimate = 1;
					Runner._smoothingLowerBound = .1;
					Runner._smoothingUpperBound = .9;
					/**
					* Creates a new Runner. 
					* See the properties section below for detailed information on what you can pass via the `options` object.
					* @method create
					* @param {} options
					*/
					Runner.create = function(options) {
						var runner = Common.extend({
							delta: 1e3 / 60,
							frameDelta: null,
							frameDeltaSmoothing: true,
							frameDeltaSnapping: true,
							frameDeltaHistory: [],
							frameDeltaHistorySize: 100,
							frameRequestId: null,
							timeBuffer: 0,
							timeLastTick: null,
							maxUpdates: null,
							maxFrameTime: 1e3 / 30,
							lastUpdatesDeferred: 0,
							enabled: true
						}, options);
						runner.fps = 0;
						return runner;
					};
					/**
					* Runs a `Matter.Engine` whilst synchronising engine updates with the browser frame rate. 
					* See module and properties descriptions for more information on this runner.
					* Alternatively see `Engine.update` to step the engine directly inside your own game loop implementation.
					* @method run
					* @param {runner} runner
					* @param {engine} [engine]
					* @return {runner} runner
					*/
					Runner.run = function(runner, engine) {
						runner.timeBuffer = Runner._frameDeltaFallback;
						(function onFrame(time) {
							runner.frameRequestId = Runner._onNextFrame(runner, onFrame);
							if (time && runner.enabled) Runner.tick(runner, engine, time);
						})();
						return runner;
					};
					/**
					* Performs a single runner tick as used inside `Runner.run`.
					* See module and properties descriptions for more information on this runner.
					* Alternatively see `Engine.update` to step the engine directly inside your own game loop implementation.
					* @method tick
					* @param {runner} runner
					* @param {engine} engine
					* @param {number} time
					*/
					Runner.tick = function(runner, engine, time) {
						var tickStartTime = Common.now(), engineDelta = runner.delta, updateCount = 0;
						var frameDelta = time - runner.timeLastTick;
						if (!frameDelta || !runner.timeLastTick || frameDelta > Math.max(Runner._maxFrameDelta, runner.maxFrameTime)) frameDelta = runner.frameDelta || Runner._frameDeltaFallback;
						if (runner.frameDeltaSmoothing) {
							runner.frameDeltaHistory.push(frameDelta);
							runner.frameDeltaHistory = runner.frameDeltaHistory.slice(-runner.frameDeltaHistorySize);
							var deltaHistorySorted = runner.frameDeltaHistory.slice(0).sort();
							frameDelta = _mean(runner.frameDeltaHistory.slice(deltaHistorySorted.length * Runner._smoothingLowerBound, deltaHistorySorted.length * Runner._smoothingUpperBound)) || frameDelta;
						}
						if (runner.frameDeltaSnapping) frameDelta = 1e3 / Math.round(1e3 / frameDelta);
						runner.frameDelta = frameDelta;
						runner.timeLastTick = time;
						runner.timeBuffer += runner.frameDelta;
						runner.timeBuffer = Common.clamp(runner.timeBuffer, 0, runner.frameDelta + engineDelta * Runner._timeBufferMargin);
						runner.lastUpdatesDeferred = 0;
						var maxUpdates = runner.maxUpdates || Math.ceil(runner.maxFrameTime / engineDelta);
						var event = { timestamp: engine.timing.timestamp };
						Events.trigger(runner, "beforeTick", event);
						Events.trigger(runner, "tick", event);
						var updateStartTime = Common.now();
						while (engineDelta > 0 && runner.timeBuffer >= engineDelta * Runner._timeBufferMargin) {
							Events.trigger(runner, "beforeUpdate", event);
							Engine.update(engine, engineDelta);
							Events.trigger(runner, "afterUpdate", event);
							runner.timeBuffer -= engineDelta;
							updateCount += 1;
							var elapsedTimeTotal = Common.now() - tickStartTime, elapsedTimeUpdates = Common.now() - updateStartTime, elapsedNextEstimate = elapsedTimeTotal + Runner._elapsedNextEstimate * elapsedTimeUpdates / updateCount;
							if (updateCount >= maxUpdates || elapsedNextEstimate > runner.maxFrameTime) {
								runner.lastUpdatesDeferred = Math.round(Math.max(0, runner.timeBuffer / engineDelta - Runner._timeBufferMargin));
								break;
							}
						}
						engine.timing.lastUpdatesPerFrame = updateCount;
						Events.trigger(runner, "afterTick", event);
						if (runner.frameDeltaHistory.length >= 100) {
							if (runner.lastUpdatesDeferred && Math.round(runner.frameDelta / engineDelta) > maxUpdates) Common.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.");
							else if (runner.lastUpdatesDeferred) Common.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs.");
							if (typeof runner.isFixed !== "undefined") Common.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs.");
							if (runner.deltaMin || runner.deltaMax) Common.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs.");
							if (runner.fps !== 0) Common.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs.");
						}
					};
					/**
					* Ends execution of `Runner.run` on the given `runner` by canceling the frame loop.
					* Alternatively to temporarily pause the runner, see `runner.enabled`.
					* @method stop
					* @param {runner} runner
					*/
					Runner.stop = function(runner) {
						Runner._cancelNextFrame(runner);
					};
					/**
					* Schedules the `callback` on this `runner` for the next animation frame.
					* @private
					* @method _onNextFrame
					* @param {runner} runner
					* @param {function} callback
					* @return {number} frameRequestId
					*/
					Runner._onNextFrame = function(runner, callback) {
						if (typeof window !== "undefined" && window.requestAnimationFrame) runner.frameRequestId = window.requestAnimationFrame(callback);
						else throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
						return runner.frameRequestId;
					};
					/**
					* Cancels the last callback scheduled by `Runner._onNextFrame` on this `runner`.
					* @private
					* @method _cancelNextFrame
					* @param {runner} runner
					*/
					Runner._cancelNextFrame = function(runner) {
						if (typeof window !== "undefined" && window.cancelAnimationFrame) window.cancelAnimationFrame(runner.frameRequestId);
						else throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");
					};
					/**
					* Returns the mean of the given numbers.
					* @method _mean
					* @private
					* @param {Number[]} values
					* @return {Number} the mean of given values.
					*/
					var _mean = function(values) {
						var result = 0, valuesLength = values.length;
						for (var i = 0; i < valuesLength; i += 1) result += values[i];
						return result / valuesLength || 0;
					};
					/**
					* Fired once at the start of the browser frame, before any engine updates.
					*
					* @event beforeTick
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired once at the start of the browser frame, after `beforeTick`.
					*
					* @event tick
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired once at the end of the browser frame, after `beforeTick`, `tick` and after any engine updates.
					*
					* @event afterTick
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired before each and every engine update in this browser frame (if any). 
					* There may be multiple engine update calls per browser frame (or none) depending on framerate and timestep delta.
					*
					* @event beforeUpdate
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* Fired after each and every engine update in this browser frame (if any). 
					* There may be multiple engine update calls per browser frame (or none) depending on framerate and timestep delta.
					*
					* @event afterUpdate
					* @param {} event An event object
					* @param {number} event.timestamp The engine.timing.timestamp of the event
					* @param {} event.source The source object of the event
					* @param {} event.name The name of the event
					*/
					/**
					* The fixed timestep size used for `Engine.update` calls in milliseconds, known as `delta`.
					* 
					* This value is recommended to be `1000 / 60` ms or smaller (i.e. equivalent to at least 60hz).
					* 
					* Smaller `delta` values provide higher quality results at the cost of performance.
					* 
					* You should usually avoid changing `delta` during running, otherwise quality may be affected. 
					* 
					* For smoother frame pacing choose a `delta` that is an even multiple of each display FPS you target, i.e. `1000 / (n * fps)` as this helps distribute an equal number of updates over each display frame.
					* 
					* For example with a 60 Hz `delta` i.e. `1000 / 60` the runner will on average perform one update per frame on displays running 60 FPS and one update every two frames on displays running 120 FPS, etc.
					* 
					* Where as e.g. using a 240 Hz `delta` i.e. `1000 / 240` the runner will on average perform four updates per frame on displays running 60 FPS and two updates per frame on displays running 120 FPS, etc.
					* 
					* Therefore `Runner.run` will call multiple engine updates (or none) as needed to simulate the time elapsed between browser frames. 
					* 
					* In practice the number of updates in any particular frame may be restricted to respect the runner's performance budgets. These are specified by `runner.maxFrameTime` and `runner.maxUpdates`, see those properties for details.
					* 
					* @property delta
					* @type number
					* @default 1000 / 60
					*/
					/**
					* A flag that can be toggled to enable or disable tick calls on this runner, therefore pausing engine updates and events while the runner loop remains running.
					*
					* @property enabled
					* @type boolean
					* @default true
					*/
					/**
					* The accumulated time elapsed that has yet to be simulated in milliseconds.
					* This value is clamped within certain limits (see `Runner.tick` code).
					*
					* @private
					* @property timeBuffer
					* @type number
					* @default 0
					*/
					/**
					* The measured time elapsed between the last two browser frames measured in milliseconds.
					* This is useful e.g. to estimate the current browser FPS using `1000 / runner.frameDelta`.
					*
					* @readonly
					* @property frameDelta
					* @type number
					*/
					/**
					* Enables averaging to smooth frame rate measurements and therefore stabilise play rate.
					*
					* @property frameDeltaSmoothing
					* @type boolean
					* @default true
					*/
					/**
					* Rounds measured browser frame delta to the nearest 1 Hz.
					* This option can help smooth frame rate measurements and simplify handling hardware timing differences e.g. 59.94Hz and 60Hz displays.
					* For best results you should also round your `runner.delta` equivalent to the nearest 1 Hz.
					*
					* @property frameDeltaSnapping
					* @type boolean
					* @default true
					*/
					/**
					* A performance budget that limits execution time allowed for this runner per browser frame in milliseconds.
					* 
					* To calculate the effective browser FPS at which this throttle is applied use `1000 / runner.maxFrameTime`.
					* 
					* This performance budget is intended to help maintain browser interactivity and help improve framerate recovery during temporary high CPU usage.
					* 
					* This budget only covers the measured time elapsed executing the functions called in the scope of the runner tick, including `Engine.update` and its related user event callbacks.
					* 
					* You may also reduce this budget to allow for any significant additional processing you perform on the same thread outside the scope of this runner tick, e.g. rendering time.
					* 
					* See also `runner.maxUpdates`.
					*
					* @property maxFrameTime
					* @type number
					* @default 1000 / 30
					*/
					/**
					* An optional limit for maximum engine update count allowed per frame tick in addition to `runner.maxFrameTime`.
					* 
					* Unless you set a value it is automatically chosen based on `runner.delta` and `runner.maxFrameTime`.
					* 
					* See also `runner.maxFrameTime`.
					* 
					* @property maxUpdates
					* @type number
					* @default null
					*/
					/**
					* The timestamp of the last call to `Runner.tick` used to measure `frameDelta`.
					*
					* @private
					* @property timeLastTick
					* @type number
					* @default 0
					*/
					/**
					* The id of the last call to `Runner._onNextFrame`.
					*
					* @private
					* @property frameRequestId
					* @type number
					* @default null
					*/
				})();
			}),
			(function(module$35, exports$31, __webpack_require__) {
				/**
				* This module has now been replaced by `Matter.Collision`.
				*
				* All usage should be migrated to `Matter.Collision`.
				* For back-compatibility purposes this module will remain for a short term and then later removed in a future release.
				*
				* The `Matter.SAT` module contains methods for detecting collisions using the Separating Axis Theorem.
				*
				* @class SAT
				* @deprecated
				*/
				var SAT = {};
				module$35.exports = SAT;
				var Collision = __webpack_require__(8);
				var deprecated = __webpack_require__(0).deprecated;
				(function() {
					/**
					* Detect collision between two bodies using the Separating Axis Theorem.
					* @deprecated replaced by Collision.collides
					* @method collides
					* @param {body} bodyA
					* @param {body} bodyB
					* @return {collision} collision
					*/
					SAT.collides = function(bodyA, bodyB) {
						return Collision.collides(bodyA, bodyB);
					};
					deprecated(SAT, "collides", "SAT.collides ➤ replaced by Collision.collides");
				})();
			}),
			(function(module$36, exports$32, __webpack_require__) {
				/**
				* The `Matter.Svg` module contains methods for converting SVG images into an array of vector points.
				*
				* To use this module you also need the SVGPathSeg polyfill: https://github.com/progers/pathseg
				*
				* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
				*
				* @class Svg
				*/
				var Svg = {};
				module$36.exports = Svg;
				__webpack_require__(1);
				var Common = __webpack_require__(0);
				(function() {
					/**
					* Converts an SVG path into an array of vector points.
					* If the input path forms a concave shape, you must decompose the result into convex parts before use.
					* See `Bodies.fromVertices` which provides support for this.
					* Note that this function is not guaranteed to support complex paths (such as those with holes).
					* You must load the `pathseg.js` polyfill on newer browsers.
					* @method pathToVertices
					* @param {SVGPathElement} path
					* @param {Number} [sampleLength=15]
					* @return {Vector[]} points
					*/
					Svg.pathToVertices = function(path, sampleLength) {
						if (typeof window !== "undefined" && !("SVGPathSeg" in window)) Common.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
						var i, il, total, point, segment, segments, segmentsQueue, lastSegment, lastPoint, segmentIndex, points = [], lx, ly, length = 0, x = 0, y = 0;
						sampleLength = sampleLength || 15;
						var addPoint = function(px, py, pathSegType) {
							var isRelative = pathSegType % 2 === 1 && pathSegType > 1;
							if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
								if (lastPoint && isRelative) {
									lx = lastPoint.x;
									ly = lastPoint.y;
								} else {
									lx = 0;
									ly = 0;
								}
								var point = {
									x: lx + px,
									y: ly + py
								};
								if (isRelative || !lastPoint) lastPoint = point;
								points.push(point);
								x = lx + px;
								y = ly + py;
							}
						};
						var addSegmentPoint = function(segment) {
							var segType = segment.pathSegTypeAsLetter.toUpperCase();
							if (segType === "Z") return;
							switch (segType) {
								case "M":
								case "L":
								case "T":
								case "C":
								case "S":
								case "Q":
									x = segment.x;
									y = segment.y;
									break;
								case "H":
									x = segment.x;
									break;
								case "V":
									y = segment.y;
									break;
							}
							addPoint(x, y, segment.pathSegType);
						};
						Svg._svgPathToAbsolute(path);
						total = path.getTotalLength();
						segments = [];
						for (i = 0; i < path.pathSegList.numberOfItems; i += 1) segments.push(path.pathSegList.getItem(i));
						segmentsQueue = segments.concat();
						while (length < total) {
							segmentIndex = path.getPathSegAtLength(length);
							segment = segments[segmentIndex];
							if (segment != lastSegment) {
								while (segmentsQueue.length && segmentsQueue[0] != segment) addSegmentPoint(segmentsQueue.shift());
								lastSegment = segment;
							}
							switch (segment.pathSegTypeAsLetter.toUpperCase()) {
								case "C":
								case "T":
								case "S":
								case "Q":
								case "A":
									point = path.getPointAtLength(length);
									addPoint(point.x, point.y, 0);
									break;
							}
							length += sampleLength;
						}
						for (i = 0, il = segmentsQueue.length; i < il; ++i) addSegmentPoint(segmentsQueue[i]);
						return points;
					};
					Svg._svgPathToAbsolute = function(path) {
						var x0, y0, x1, y1, x2, y2, segs = path.pathSegList, x = 0, y = 0, len = segs.numberOfItems;
						for (var i = 0; i < len; ++i) {
							var seg = segs.getItem(i), segType = seg.pathSegTypeAsLetter;
							if (/[MLHVCSQTA]/.test(segType)) {
								if ("x" in seg) x = seg.x;
								if ("y" in seg) y = seg.y;
							} else {
								if ("x1" in seg) x1 = x + seg.x1;
								if ("x2" in seg) x2 = x + seg.x2;
								if ("y1" in seg) y1 = y + seg.y1;
								if ("y2" in seg) y2 = y + seg.y2;
								if ("x" in seg) x += seg.x;
								if ("y" in seg) y += seg.y;
								switch (segType) {
									case "m":
										segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
										break;
									case "l":
										segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
										break;
									case "h":
										segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
										break;
									case "v":
										segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
										break;
									case "c":
										segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
										break;
									case "s":
										segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
										break;
									case "q":
										segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
										break;
									case "t":
										segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
										break;
									case "a":
										segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
										break;
									case "z":
									case "Z":
										x = x0;
										y = y0;
										break;
								}
							}
							if (segType == "M" || segType == "m") {
								x0 = x;
								y0 = y;
							}
						}
					};
				})();
			}),
			(function(module$37, exports$33, __webpack_require__) {
				/**
				* This module has now been replaced by `Matter.Composite`.
				*
				* All usage should be migrated to the equivalent functions found on `Matter.Composite`.
				* For example `World.add(world, body)` now becomes `Composite.add(world, body)`.
				*
				* The property `world.gravity` has been moved to `engine.gravity`.
				*
				* For back-compatibility purposes this module will remain as a direct alias to `Matter.Composite` in the short term during migration.
				* Eventually this alias module will be marked as deprecated and then later removed in a future release.
				*
				* @class World
				*/
				var World = {};
				module$37.exports = World;
				var Composite = __webpack_require__(6);
				__webpack_require__(0);
				(function() {
					/**
					* See above, aliases for back compatibility only
					*/
					World.create = Composite.create;
					World.add = Composite.add;
					World.remove = Composite.remove;
					World.clear = Composite.clear;
					World.addComposite = Composite.addComposite;
					World.addBody = Composite.addBody;
					World.addConstraint = Composite.addConstraint;
				})();
			})
		]);
	});
})))());
var services = document.querySelectorAll(".service");
var { Engine, World, Bodies, Body } = import_matter.default;
function getTagDimensions(label) {
	const ghostTag = document.createElement("div");
	ghostTag.classList.add("tag");
	ghostTag.textContent = label;
	document.body.appendChild(ghostTag);
	const size = {
		width: ghostTag.offsetWidth,
		height: ghostTag.offsetHeight
	};
	ghostTag.remove();
	return size;
}
services.forEach((service) => {
	const serviceImages = service.querySelectorAll(".img");
	const serviceName = service.querySelector("h1");
	const tagLabels = service.dataset.tags.split(",");
	const tagSizes = tagLabels.map((label) => getTagDimensions(label));
	let engine = null;
	let tagElements = [];
	let tagBodies = [];
	let rafId = null;
	let tagsContainer = null;
	let isHovered = false;
	let tagDropTimer = null;
	function createTags() {
		cleanupTags();
		const serviceWidth = service.offsetWidth;
		const serviceHeight = service.offsetHeight;
		tagsContainer = document.createElement("div");
		tagsContainer.classList.add("tags-container");
		service.appendChild(tagsContainer);
		engine = Engine.create({ gravity: {
			x: 0,
			y: 2
		} });
		const wallThickness = 20;
		const floorOffset = window.innerWidth < 1e3 ? 25 : 50;
		const floor = Bodies.rectangle(serviceWidth / 2, serviceHeight - floorOffset + wallThickness / 2, serviceWidth * 3, wallThickness, { isStatic: true });
		const leftWall = Bodies.rectangle(-20 / 2, serviceHeight / 2, wallThickness, serviceHeight * 3, { isStatic: true });
		const rightWall = Bodies.rectangle(serviceWidth + wallThickness / 2, serviceHeight / 2, wallThickness, serviceHeight * 3, { isStatic: true });
		World.add(engine.world, [
			floor,
			leftWall,
			rightWall
		]);
		tagLabels.forEach((label, i) => {
			const tagElement = document.createElement("div");
			tagElement.classList.add("tag");
			tagElement.textContent = label;
			tagsContainer.appendChild(tagElement);
			const tagWidth = tagSizes[i].width;
			const tagHeight = tagSizes[i].height;
			const startX = serviceWidth * .25 + Math.random() * serviceWidth * .5;
			const startY = -(tagHeight / 2) - i * 5;
			const angle = (Math.random() - .5) * .4;
			const body = Bodies.rectangle(startX, startY, tagWidth, tagHeight, {
				chamfer: { radius: tagHeight / 2 },
				restitution: .15,
				friction: .6,
				density: .002
			});
			Body.setAngle(body, angle);
			World.add(engine.world, body);
			gsapWithCSS.to(tagElement, {
				opacity: 1,
				duration: .3,
				delay: i * .04,
				ease: "power2.out"
			});
			tagElements.push(tagElement);
			tagBodies.push(body);
		});
		function update() {
			Engine.update(engine, 1e3 / 60);
			for (let i = 0; i < tagElements.length; i++) {
				const body = tagBodies[i];
				const tagElement = tagElements[i];
				const tagWidth = tagSizes[i].width;
				const tagHeight = tagSizes[i].height;
				tagElement.style.transform = `translate(${body.position.x - tagWidth / 2}px, ${body.position.y - tagHeight / 2}px) rotate(${body.angle}rad)`;
			}
			rafId = requestAnimationFrame(update);
		}
		rafId = requestAnimationFrame(update);
	}
	function cleanupTags() {
		if (rafId) cancelAnimationFrame(rafId);
		if (engine) Engine.clear(engine);
		if (tagsContainer) tagsContainer.remove();
		tagElements = [];
		tagBodies = [];
		engine = null;
		rafId = null;
		tagsContainer = null;
	}
	service.addEventListener("mouseenter", () => {
		isHovered = true;
		const expandedHeight = window.innerWidth < 1e3 ? "12.5rem" : "25rem";
		gsapWithCSS.killTweensOf(service);
		gsapWithCSS.killTweensOf(serviceImages);
		gsapWithCSS.killTweensOf(serviceName);
		gsapWithCSS.to(service, {
			height: expandedHeight,
			duration: .75,
			ease: "elastic.out(1,0.5)"
		});
		gsapWithCSS.to(serviceName, {
			color: "#FFFFD9",
			duration: .25,
			ease: "power4.out"
		});
		gsapWithCSS.to(serviceImages, {
			y: "-50%",
			duration: .75,
			ease: "elastic.out(1,0.5)",
			stagger: .075
		});
		tagDropTimer = gsapWithCSS.delayedCall(.2, () => {
			if (isHovered) createTags();
		});
	});
	service.addEventListener("mouseleave", () => {
		isHovered = false;
		const collapsedHeight = window.innerWidth < 1e3 ? "5rem" : "10rem";
		if (tagDropTimer) tagDropTimer.kill();
		gsapWithCSS.killTweensOf(service);
		gsapWithCSS.killTweensOf(serviceImages);
		gsapWithCSS.killTweensOf(serviceName);
		if (tagElements.length) gsapWithCSS.to(tagElements, {
			opacity: 0,
			duration: .25,
			ease: "power2.out",
			onComplete: cleanupTags
		});
		else cleanupTags();
		gsapWithCSS.to(serviceName, {
			color: "#ff3831",
			duration: .25,
			ease: "power4.out"
		});
		gsapWithCSS.to(serviceImages, {
			y: "50%",
			duration: .75,
			ease: "elastic.out(1,0.5)",
			stagger: .075
		});
		gsapWithCSS.to(service, {
			height: collapsedHeight,
			duration: .5,
			ease: "elastic.out(1,0.75)"
		});
	});
});
//#endregion
