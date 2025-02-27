import * as d3 from 'd3'
import { ArrowRight, ChevronLeft, ChevronRight, createIcons } from 'lucide'
import Swiper from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import * as topojson from 'topojson-client'
import { places } from './location'

import './style.scss'

const markerImg =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMyA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjUwNCAwQzcuMzg4OSAwIDAgNy40NzcwMiAwIDE2LjcxMDlDMCAyNS45NDQ4IDE2LjUwNCA0OCAxNi41MDQgNDhDMTYuNTA0IDQ4IDMzIDI1Ljk0NDggMzMgMTYuNzEwOUMzMyA3LjQ3NzAyIDI1LjYxOTIgMCAxNi41MDQgMFpNMTYuNTA0IDI3Ljc3NTNDMTAuNDcwMyAyNy43NzUzIDUuNTgyMDEgMjIuODIzMyA1LjU4MjAxIDE2LjcxMDlDNS41ODIwMSAxMC41OTg2IDEwLjQ3MDMgNS42NDY1OCAxNi41MDQgNS42NDY1OEMyMi41Mzc4IDUuNjQ2NTggMjcuNDI2MSAxMC41OTg2IDI3LjQyNjEgMTYuNzEwOUMyNy40MjYxIDIyLjgyMzMgMjIuNTM3OCAyNy43NzUzIDE2LjUwNCAyNy43NzUzWiIgZmlsbD0iI0JFNDUyOCIvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHJ4PSIxMi41IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI1Ljk5OTUgMTYuNTYzMkMyMS43NDIgMTUuNDc5NSAxOC4wMDkyIDE0LjU0ODggMTQuMjkzMyAxMy41NDM3QzEzLjg5MDIgMTMuNDM2MiAxNC4wMDM2IDEzLjQ0ODUgMTMuNDM2OCAxMy4zMDM4QzEyLjk4MzMgMTEuNDUwNyAxMi4yMTkxIDguOTE5MjYgMTEuODA3NiA3QzE1LjMwOTQgMTAuODY3NSAxMy45MzY0IDkuOTA3ODUgMTkuMTAwOSAxMC44MzAzQzIxLjg2MzcgMTEuMzIyNSAyMi45MzAyIDExLjU2NjUgMjQuNzYwOSAxMS43OTgyQzI1LjAwMDMgMTIuNDQzNCAyNS43MjY2IDE1LjE4MTcgMjUuOTk5NSAxNi41NjMyWiIgZmlsbD0iIzNGNkJBOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjU5ODYgMjQuOTMxMkMxMy41OTY2IDIxLjc2NjkgMTYuMjEyNCAxOC45NzQ4IDE4Ljg3ODcgMTYuMjQwN0MxOS4xNjg0IDE1Ljk0MjkgMTkuMjYwNyAxNS44Njg1IDE5LjY2MzggMTUuNDQ2NUMyMS40OTQ1IDE1Ljk1OTQgMjMuOTkyOCAxNi40ODg5IDI1LjkwMzMgMTcuMDQ3M0MyMC43ODQ5IDE4LjIzNDQgMjIuMDQ0NiAxNy44MTI1IDE5LjAwNDYgMjEuNjk2NUMxNy4yMzI4IDIzLjk1OTEgMTYuNTE4OSAyNC42NTgyIDE1LjQzOTggMjYuMTMwN0wxMC41OTg2IDI0LjkzMTJaIiBmaWxsPSIjMTY0MjhBIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTA2IDcuMDYyMDFDMTIuNDQyMyAxMS4yNjA0IDEzLjIyMzMgMTUuNjMyNSAxNC4yMzEgMTkuMjk3M0MxNC4zNDAyIDE5LjY5NDQgMTQuMjY0NiAxOS40ODM1IDE0LjQyNDIgMjAuMDM3N0MxMy4xNTE5IDIxLjQ1MjQgMTEuNzM2OSAyMy4xMjM0IDEwLjI1OSAyNC42MTY3QzExLjYyNzggMjEuMDU1MyAxMS44MjA5IDIwLjg4NTcgMTAuMDA3IDE2LjAzNzlDOS4wMzcxIDEzLjQ0NDQgOC43MjYzOSAxMi40MDYyIDggMTAuNzM1MUM4LjQ0MDg3IDEwLjE5NzQgMTAuNDM1MyA3Ljk5MjY5IDExLjUwNiA3LjA2MjAxWiIgZmlsbD0iIzc4QUREMyIvPgo8L3N2Zz4K'

async function usaMap() {
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
		.scaleExtent([1.25, 1.25])
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
		.attr('width', '100%')
		.attr('height', '100%')
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
	let cities = []
	const locationCards = document.querySelectorAll('.location-card')
	locationCards.forEach((card) => {
		const data = {
			name: card.getAttribute('data-city'),
			coords: [
				card.getAttribute('data-latitude'),
				card.getAttribute('data-longitude'),
			],
		}

		cities.push(data)
	})

	const cityGroup = g.append('g').attr('class', 'cities')
	cityGroup
		.selectAll('circle')
		.data(cities)
		.enter()
		.append('circle')
		.attr('class', 'city-marker')
		.attr('data-index', (d, i) => i) // Assign unique index
		.attr('cx', (d) => projection(d.coords)[0])
		.attr('cy', (d) => projection(d.coords)[1])
		.attr('r', 8)
		.attr('fill', '#e58c32')
		.attr('stroke', '#fff')
		.attr('stroke-width', 1)

	svg.call(zoom)
	svg.call(zoom.transform, d3.zoomIdentity.scale(1.5))

	svg.on('zoom', null)

	function moveToCity(index) {
		const city = cities[index]
		const [x, y] = projection(city.coords)
		const offsetX = 0 // Adjust this value to move more right
		const offsetY = 0 // Adjust this value to move more down

		// Hide all city markers and labels
		d3.selectAll('.city-marker, .city-label').style('opacity', 0)
		// console.log(document.querySelector(`.city-marker[data-index="${index}"]`))

		// Show only the current city's marker and label
		d3.select(`.city-marker[data-index="${index}"]`).style('opacity', 1)
		d3.select(`.city-label[data-index="${index}"]`).style('opacity', 1)

		const currentTransform = d3.zoomTransform(svg.node())

		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity
					.scale(currentTransform.k)
					.translate(
						currentTransform.x +
							(width / 2 -
								x * currentTransform.k +
								offsetX -
								currentTransform.x),
						currentTransform.y +
							(height / 2 -
								y * currentTransform.k +
								offsetY -
								currentTransform.y),
					),
				// .translate(-x / 2, -y / 2),

				// .translate(width / 2 - x * 2, height / 2 - y * 2),
			)
	}

	moveToCity(0)

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

async function worldMap() {
	const width = 800,
		height = 800
	let zoomLevel = 2.25
	let currentCity = 0
	let rotation = [100, -24]

	const world = await d3.json(
		'https://unpkg.com/world-atlas@2.0.2/countries-110m.json',
	) // ? loading the map asset

	const countries = topojson.feature(world, world.objects.countries)

	const projection = d3
		.geoOrthographic()
		.scale(350)
		.translate([width / 2, height / 2])
		.rotate([100, -24])

	const path = d3.geoPath().projection(projection)

	// svg.call(zoom.transform, d3.zoomIdentity.scale(1.5))

	const svg = d3
		.create('svg')
		.attr('viewBox', [0, 0, width, height])
		.attr('width', width)
		.attr('height', height)
		.attr('style', 'max-width: 100%;')
		.attr('id', 'globe')

	// 	const handleDrag = () => {
	// 		const globe = document.getElementById('globe')
	// 		console.log(globe)
	//
	// 		let isDragging = false
	// 		let lastX, lastY
	// 		let rotation = projection.rotate() // Initial rotation
	//
	// 		const onDragStart = (e) => {
	// 			isDragging = true
	// 			lastX = e.pageX
	// 			lastY = e.pageY
	// 		}
	//
	// 		const onDrag = (e) => {
	// 			if (!isDragging) return
	//
	// 			// Calculate the change in mouse position
	// 			const dx = e.pageX - lastX
	// 			const dy = e.pageY - lastY
	//
	// 			lastX = e.pageX
	// 			lastY = e.pageY
	//
	// 			// Adjust rotation based on mouse movement
	// 			rotation[0] += dx * 0.2 // Horizontal drag
	// 			rotation[1] -= dy * 0.2 // Vertical drag
	//
	// 			projection.rotate(rotation)
	//
	// 			// Update map
	// 			g.selectAll('path').attr('d', path)
	// 			d3.selectAll('.city-marker')
	// 				.attr('cx', (d) => projection(d.coords)[0])
	// 				.attr('cy', (d) => projection(d.coords)[1])
	// 		}
	//
	// 		const onDragEnd = () => {
	// 			isDragging = false
	// 		}
	//
	// 		if (globe) {
	// 			globe.addEventListener('pointerdown', onDragStart)
	// 			globe.addEventListener('pointermove', onDrag)
	// 			globe.addEventListener('pointerup', onDragEnd)
	// 			globe.addEventListener('pointerleave', onDragEnd) // Handle case where mouse leaves element
	// 		}
	// 	}

	svg
		.append('clipPath')
		.attr('id', 'clip')
		.append('circle')
		.attr('cx', width / 2)
		.attr('cy', height / 2)
		.attr('r', projection.scale())

	svg
		.append('circle')
		.attr('cx', width / 2)
		.attr('cy', height / 2)
		.attr('r', projection.scale())
		.attr('fill', '#e3e4e5')
		.attr('stroke', '#fff')
		.attr('stroke-width', 0.5)
		.attr('class', 'water-body')
	// .attr('style', 'cursor: move;')

	const g = svg
		.append('g')
		.attr('class', 'countries')
		.attr('clip-path', 'url(#clip)')

	g.selectAll('path')
		.data(countries.features)
		.join('path')
		.attr('d', path)
		.attr('fill', '#f6f6f6')
		.attr('stroke', '#fff')
		.attr('stroke-width', 0.3)

	g.selectAll('.country-borders')
		.data(countries.features)
		.join('path')
		.attr('class', 'country-borders')
		.attr('d', path)
		.attr('fill', 'none')
		.attr('stroke', 'red') // Dark border color
		.attr('stroke-width', 0.5)

	const countriesPath = g
		.selectAll('path')
		.data(countries.features)
		.join('path')
		.attr('d', path)
		.attr('fill', '#fff')
		.attr('stroke', '#fff')
		.attr('stroke-width', 0.3)
		.attr('class', 'land-body')

	const gradient = svg
		.append('defs') // Add definitions
		.append('radialGradient')
		.attr('id', 'shine')
		.attr('cx', '50%') // Center of the gradient (same as the center of the globe)
		.attr('cy', '50%')
		.attr('r', '50%') // Radius of the gradient
		.attr('fx', '50%') // Focus point of the gradient (center of the circle)
		.attr('fy', '50%')

	gradient
		.append('stop')
		.attr('offset', '0%') // Center of the gradient (lit area)
		.attr('stop-color', '#fff') // Light color in the center
		.attr('stop-opacity', 0)

	gradient
		.append('stop')
		.attr('offset', '50%') // Center of the gradient (lit area)
		.attr('stop-color', '#fff') // Light color in the center
		.attr('stop-opacity', 0)

	gradient
		.append('stop')
		.attr('offset', '100%') // Outer edge of the gradient
		.attr('stop-color', '#ededed') // Dark color for edges
		.attr('stop-opacity', 0.6)

	svg
		.append('circle')
		.attr('cx', width / 2)
		.attr('cy', height / 2)
		.attr('r', projection.scale())
		.attr('fill', 'url(#shine)') // Use the defined gradient
		.attr('stroke', '#ededed')
		.attr('stroke-width', 0.5)
		.attr('style', 'pointer-events: none')

	let cities = []
	const locationCards = document.querySelectorAll('.location-card')
	locationCards.forEach((card) => {
		const data = {
			name: card.getAttribute('data-city'),
			coords: [
				card.getAttribute('data-longitude'),
				card.getAttribute('data-latitude'),
			],
		}

		cities.push(data)
	})
	console.log('locations\t', cities)

	const cityGroup = g
		.append('g')
		.attr('class', 'cities')
		.attr('clip-path', 'url(#clip)')

	cityGroup
		.selectAll('circle')
		.data(cities)
		.enter()
		.append('circle')
		.attr('class', 'city-marker')
		.attr('data-index', (d, i) => i) // Assign unique index
		.attr('cx', (d) => projection(d.coords)[0])
		.attr('cy', (d) => projection(d.coords)[1])
		.attr('r', 4)
		.attr('fill', '#e58c32')
		.attr('stroke', '#fff')
		.attr('stroke-width', 1)

	const zoom = d3
		.zoom()
		.scaleExtent([zoomLevel, zoomLevel]) // Define zoom range
		.on('zoom', (event) => {
			zoomLevel = event.transform.k
			projection.scale(350 * zoomLevel) // Adjust the projection scale
			countriesPath.attr('d', path)

			cityGroup
				.selectAll('.city-marker')
				.attr('cx', (d) => projection(d.coords)[0])
				.attr('cy', (d) => projection(d.coords)[1])
		})

	svg
		.append('image')
		.attr('href', markerImg)
		.attr('width', 40)
		.attr('height', 40)
		.attr('x', width / 2 - 20)
		.attr('y', height / 2 - 120)
		.attr('id', 'marker')
		.attr('style', 'transition: all 200ms ease-in-out;')

	svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(zoomLevel))
	// svg.on('click', () => {
	// 	console.log('dragging')
	// })

	svg.call(d3.drag().on('start', () => console.log('dragging')))

	const drag = d3.drag().on('drag', (event) => {
		console.log('drag event')
		rotation[0] += event.dx * 0.2 // Rotate on X-axis
		rotation[1] -= event.dy * 0.2 // Rotate on Y-axis
		projection.rotate(rotation)
		g.selectAll('path').attr('d', path)
	})

	// let rotation = projection.rotate(),
	let startRotation, dragIndex
	const dragThis = d3
		.drag()
		.on('start', () => {
			startRotation = [...rotation]
		})
		.on('drag', (e) => {
			// this is center point of the map
			const center = [400, 331.3648525862192]
			// console.log(startRotation)
			// console.log(e)

			rotation[0] += e.dx * 0.2
			rotation[1] -= e.dy * 0.2
			projection.rotate(rotation)
			g.selectAll('path').attr('d', path) // moves the map
			// moves the city marker
			d3.selectAll('.city-marker')
				.attr('cx', (d) => projection(d.coords)[0])
				.attr('cy', (d) => projection(d.coords)[1])

			const determineClosest = () => {
				const cityMarkers = document.querySelectorAll('.city-marker')
				let coordinates = [],
					diff = []

				// get the coordinates of the city markers
				cityMarkers.forEach((mark, index) => {
					const x = mark.getAttribute('cx')
					const y = mark.getAttribute('cy')
					coordinates.push([x, y])
				})

				// get the difference between the center and the city markers
				coordinates.forEach((point) => {
					diff.push(Math.abs(point[0] - center[0]))
				})
				const index = diff.indexOf(Math.min(...diff)) // get the index of smallest diff
				dragIndex = index

				document.getElementById('marker').style.transform = `translateY(-9px)`
			}

			determineClosest()
		})
		.on('end', () => {
			setTimeout(() => {
				document.getElementById('marker').style.transform = `translateY(0)`
			}, 600)
			moveToCity(dragIndex)
			swiper.slideTo(dragIndex, 750)
		})

	g.call(dragThis)
	// const countriesGroup = d3.select('.countries')
	// console.log(countriesGroup.on('click', () => console.log('first')))

	document.getElementById('map-container').appendChild(svg.node())

	function moveToCity(index) {
		const city = cities[index]
		if (!city) return

		const [lon, lat] = city.coords.map(Number) // Ensure numeric values

		// Calculate new rotation so that the city is at the center
		const newRotation = [-lon, -lat + 5]
		rotation = [-lon, -lat + 5]

		d3.selectAll('.city-marker').attr('fill', '#c3c3c4') // Gray out all markers

		d3.select(`.city-marker[data-index="${index}"]`).attr('fill', '#e58c32') // Highlight the selected marker

		d3.transition()
			.duration(750)
			.tween('rotate', () => {
				const interp = d3.interpolate(projection.rotate(), newRotation)
				return (t) => {
					projection.rotate(interp(t))
					g.selectAll('path').attr('d', path) // Update country positions
					d3.selectAll('.city-marker')
						.attr('cx', (d) => projection(d.coords)[0])
						.attr('cy', (d) => projection(d.coords)[1]) // Update city positions
				}
			})
		// projection.rotate(rotation) // Apply new rotation
		// g.selectAll('path').attr('d', path)
		// d3.selectAll('.city-marker')
		// 	.attr('cx', (d) => projection(d.coords)[0])
		// 	.attr('cy', (d) => projection(d.coords)[1])
	}
	// handleDrag()

	var swiper = new Swiper('.mySwiper', {
		// slidesPerView: 4,
		centeredSlides: true,
		spaceBetween: 30,
		loop: false,
		autoplay: {
			delay: 5000,
		},
		rewind: true,
		grabCursor: true,
		freeMode: true,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
			400: {
				slidesPerView: 1,
			},
			640: {
				slidesPerView: 2,
			},
			1024: {
				slidesPerView: 4,
			},
		},
		modules: [Navigation, Autoplay],
	})

	swiper.on('slideChange', () => {
		// console.log('swiper change')
		moveToCity(swiper.activeIndex)
		currentCity = swiper.activeIndex
	})

	const pins = document.querySelectorAll('.city-marker')
	pins.forEach((pin, index) => {
		pin.addEventListener('click', () => {
			moveToCity(index)
			swiper.slideTo(index, 750)
		})
	})

	moveToCity(0)
}

document.addEventListener('DOMContentLoaded', () => {
	// usaMap()
	worldMap()

	createIcons({
		icons: { ChevronLeft, ChevronRight, ArrowRight },
	})

	const locationWrapper = document.querySelector('.location-wrapper')
	places.forEach((place) => {
		const locationCard = document.createElement('div')

		locationCard.classList.add('swiper-slide')
		locationCard.classList.add('location-card')
		locationCard.setAttribute('data-city', place.city)
		locationCard.setAttribute('data-latitude', place.lat)
		locationCard.setAttribute('data-longitude', place.lng)
		locationCard.style.backgroundImage = `url(${place.img})`

		locationCard.innerHTML = `
			<div class="location-card-body">
				<p class="city-name">${place.city}</p>
				<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="arrow-right" class="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
			</div>
		`

		locationWrapper.appendChild(locationCard)
	})
})
