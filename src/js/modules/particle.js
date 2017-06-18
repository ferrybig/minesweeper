'use strict';

const Particle = (function() {
	const definitions = {
		explode: {
			create: ({ x, y, scale, size }) => {
				const particles = [];
				for (var i = 0; i < size * size; i++) {
					particles.push({
						x: x,
						y: y,
						size: Math.random() * size * scale + Math.random() * size * scale,
						vx: (Math.random() - 0.5) * size * size * scale,
						vy: (Math.random() - 0.5) * size * size * scale,
						color: '#F' + Math.floor(Math.random() * 16).toString(16) + '0',
						ttl: 15
					});
				}
				return particles;
			},
			update: p => {
				p.x += p.vx;
				p.y += p.vy;
				p.vx *= 0.8;
				p.vy *= 0.8;
			},
			draw: (graphics, p) => {
				graphics.fillStyle = p.color;
				graphics.beginPath();
				graphics.moveTo(p.x, p.y);
				graphics.arc(p.x, p.y, p.size, 0, Math.PI * 2, true);
				graphics.closePath();
				graphics.fill();
			},
			list: []
		}
	};

	const addParticle = function(type, options) {
		if (definitions[type] === undefined) {
			throw 'Particle ' + type + ' is undefined';
		}
		definitions[type].list.push(...definitions[type].create(options));
	};

	const updateParticles = function(category, name) {
		while (category.list.length !== 0 && category.list[0].ttl < 0) {
			category.list.pop();
		}
		for (let i = 0; i < category.list.length; i++) {
			category.update(category.list[i]);
			category.list[i].ttl--;
		}
	};

	const update = function() {
		for (let i in definitions) {
			updateParticles(definitions[i], i);
		}
	};

	const draw = function(graphics, delta) {
		for (let i in definitions) {
			if (!definitions.hasOwnProperty(i)) {
				continue;
			}
			const category = definitions[i];
			for (let i = 0; i < category.list.length; i++) {
				category.draw(graphics, category.list[i], delta);
			}
		}
	};

	const init = function(canvas) {
		canvas.registerGraphicsUpdate(draw);
		canvas.registerPhysicsUpdate(update);
	};

	return Object.seal({
		init,
		draw,
		update,
		addParticle
	});
})();
