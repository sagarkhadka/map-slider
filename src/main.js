import './style.scss'
import 'swiper/css'

import * as d3 from 'd3'

async function chart() {
	const width = 975
	const height = 610
	let currentCity = 0

	const us = await d3.json('https://d3js.org/us-10m.v2.json') // ? loading the map asset

	// ? helpful to plot the points
	const projection = d3
		.geoAlbersUsa()
		.fitSize([width, height], topojson.feature(us, us.objects.states))
	// const path = d3.geoPath().projection(projection) // ! this projection doesn't works
	const path = d3.geoPath()

	const zoom = d3
		.zoom()
		.scaleExtent([2, 2])
		.translateExtent([
			[0, 0],
			[width, height],
		])
		.on('zoom', (e) => {
			g.attr('transform', e.transform)
		})
	// ?^ sets the min & max zoom to lvl 2

	// ? creating the main svg elm
	const svg = d3
		.create('svg')
		.attr('viewBox', [0, 0, width, height])
		.attr('width', width)
		.attr('height', height)
		.attr('style', 'max-width: 100%;')
	// .on('click', reset)

	const g = svg.append('g')

	// ? draws the states
	const states = g
		.append('g')
		.attr('fill', '#7cb3d6')
		.attr('cursor', 'pointer')
		.selectAll('path')
		.data(topojson.feature(us, us.objects.states).features)
		.join('path')
		// .on('click', clicked)
		.attr('d', path)

	states.append('title').text((d) => d.properties.name)

	g.append('path')
		.attr('fill', 'none')
		.attr('stroke', 'white')
		.attr('stroke-linejoin', 'round')
		.attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))

	// g.append('path')
	// 	.attr('fill', 'none')
	// 	.attr('stroke', 'white')
	// 	.attr('stroke-width', 0.5) // Reduce line thickness
	// 	.attr('stroke-linejoin', 'round')
	// 	.attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))

	const cities = [
		{ name: 'New York', coords: [-74.006, 40.7128] },
		{ name: 'Los Angeles', coords: [-118.2437, 34.0522] },
		{ name: 'Chicago', coords: [-87.6298, 41.8781] },
	]
	const cityGroup = g.append('g').attr('class', 'cities')
	cityGroup
		.selectAll('circle')
		.data(cities)
		.enter()
		.append('circle')
		.attr('cx', (d) => projection(d.coords)[0])
		.attr('cy', (d) => projection(d.coords)[1])
		.attr('r', 8)
		.attr('fill', '#e58c32')
		.attr('stroke', '#fff')
		.attr('stroke-width', 1)

	// Add city labels
	// cityGroup
	// 	.selectAll('text')
	// 	.data(cities)
	// 	.enter()
	// 	.append('text')
	// 	.attr('x', (d) => projection(d.coords)[0] + 7) // Offset text slightly
	// 	.attr('y', (d) => projection(d.coords)[1])
	// 	.text((d) => d.name)
	// 	.attr('font-size', '12px')
	// 	.attr('fill', 'black')

	svg.call(zoom)
	svg.call(zoom.transform, d3.zoomIdentity.scale(2))
	//
	moveToCity(0)

	svg.on('zoom', null)

	function moveToCity(index) {
		const city = cities[index]
		const [x, y] = projection(city.coords)

		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity.scale(2).translate(-x / 2, -y / 2),

				// .translate(width / 2 - x * 2, height / 2 - y * 2),
			)
	}

	function reset() {
		states.transition().style('fill', null)
		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity,
				d3.zoomTransform(svg.node()).invert([width / 2, height / 2]),
			)
	}

	function clicked(event, d) {
		const [[x0, y0], [x1, y1]] = path.bounds(d)
		event.stopPropagation()
		states.transition().style('fill', null)
		d3.select(this).transition().style('fill', 'red')
		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(
						Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)),
					)
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				d3.pointer(event, svg.node()),
			)
	}

	function zoomed(event) {
		const { transform } = event
		g.attr('transform', transform)
		g.attr('stroke-width', 1 / transform.k)
	}

	document.getElementById('map-container').appendChild(svg.node())

	document.getElementById('next-btn').addEventListener('click', () => {
		currentCity = (currentCity + 1) % cities.length
		moveToCity(currentCity)
	})

	document.getElementById('prev-btn').addEventListener('click', () => {
		currentCity = (currentCity - 1 + cities.length) % cities.length
		moveToCity(currentCity)
	})
}

chart()

const data = [10, 25, 35, 50, 60]
const svg = d3.select('svg')
console.log(data)
svg
	.selectAll('rect')
	.data(data)
	.enter()
	.append('rect')
	.attr('x', (d, i) => i * 60)
	.attr('y', (d, i) => 300 - d * 5)
	.attr('width', 50)
	.attr('height', (d) => d * 5)
	.attr('fill', 'teal')
