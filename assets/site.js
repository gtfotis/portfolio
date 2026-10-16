// One-page routing: each section has its own URL (/work/, /projects/, ...).
// Clicking a nav link scrolls there and pushes the URL; scrolling updates it in place.
(function () {
	var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));
	var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var root = (document.querySelector('.name').getAttribute('href') || '/').replace(/\/?$/, '/');
	var current = null;
	var scrollingTo = null;
	var settleTimer;

	if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

	function pathFor(id) {
		return id === 'home' ? root : root + id + '/';
	}

	function idForPath(path) {
		var seg = path.slice(root.length).replace(/\/+$/, '');
		return document.getElementById(seg) ? seg : 'home';
	}

	function setActive(id, historyMode) {
		if (id !== current) {
			current = id;
			links.forEach(function (a) {
				if (a.dataset.nav === id && a.closest('.nav')) a.setAttribute('aria-current', 'page');
				else a.removeAttribute('aria-current');
			});
			document.title = document.getElementById(id).dataset.title;
		}
		if (historyMode && location.pathname !== pathFor(id)) {
			history[historyMode + 'State']({ id: id }, '', pathFor(id));
		}
	}

	function scrollToSection(id, smooth) {
		scrollingTo = id;
		var top = id === 'home' ? 0 : document.getElementById(id).getBoundingClientRect().top + window.scrollY;
		var barH = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
		window.scrollTo({ top: Math.max(0, top - (id === 'home' ? 0 : barH)), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
		clearTimeout(settleTimer);
		settleTimer = setTimeout(function () { scrollingTo = null; }, smooth ? 1000 : 50);
	}

	function sectionInView() {
		if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
			return sections[sections.length - 1].id;
		}
		var line = window.innerHeight * 0.35;
		var id = sections[0].id;
		sections.forEach(function (s) {
			if (s.getBoundingClientRect().top <= line) id = s.id;
		});
		return id;
	}

	links.forEach(function (a) {
		a.addEventListener('click', function (e) {
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
			e.preventDefault();
			setActive(a.dataset.nav, 'push');
			scrollToSection(a.dataset.nav, true);
		});
	});

	var ticking = false;
	window.addEventListener('scroll', function () {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(function () {
			ticking = false;
			if (!scrollingTo) setActive(sectionInView(), 'replace');
		});
	}, { passive: true });

	window.addEventListener('popstate', function () {
		var id = idForPath(location.pathname);
		setActive(id);
		scrollToSection(id, true);
	});

	var start = document.body.dataset.section || idForPath(location.pathname);
	setActive(start);
	if (start !== 'home') {
		scrollToSection(start, false);
		// Web fonts can shift layout after the first jump; re-align if the reader hasn't moved on
		if (document.fonts) document.fonts.ready.then(function () {
			if (current === start) scrollToSection(start, false);
		});
	}
})();
