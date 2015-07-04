import React from 'react'
import d3 from 'd3'

function getValues(tree){
	if (typeof tree.values.male !== 'undefined'){
		return tree.values
	} else {
		let out = {
			male: 0,
			female: 0,
			total: 0
		}
		for (let i in tree.values){
			let vals = getValues(tree.values[i])
			out.male += vals.male
			out.female += vals.female
			out.total += vals.total
		}
		return out
	}
}


export default class Plot {
	componentDidMount(){
		this.update()
	}
	componentDidUpdate(){
		this.update()
	}
	update(){
		let yscale = d3.scale.ordinal()
			.rangeBands([0, this.props.height])
		switch (this.props.view){
			case 'By occupation':
				yscale.domain(_.uniq(_.pluck(this.props.data, 'occupation')))
				break;
			case 'By employment type':
				yscale.domain(_.uniq(_.pluck(this.props.data, 'employment_status')))
				break;
		}
		let data = d3.nest()
			.key(d => d.division)
			.key(d => d.subdivision)
			.key(d => d.group)
			.key(d => d.class)
			.rollup(d => {
				let male = d3.sum(d.filter(d => d.gender=='Male'), d => +d.number_of_employees)
				let female = d3.sum(d.filter(d => d.gender=='Female'), d => +d.number_of_employees)

				return {
					male,
					female,
					total: male + female
				}
			})
			.entries(this.props.data)
		var color = d3.scale.linear()
			.range(['#0077FF','#FF00F2'])

		let rscale = d3.scale.linear()
			.domain([0,100])
			.range([0,10])
			.clamp(true)
		
		var xscale = d3.scale.linear().range([0, this.props.width])
		
		let el = d3.select(React.findDOMNode(this))

		let divisions = el.selectAll('.division')
			.data(data, d => d.key)

		let styleCircle = (sel, type) => {
			sel.each(d => d._vals = getValues(d))
				.attr('r', d => rscale(d._vals.total))
				.attr('fill', d => color(d._vals.female/d._vals.total))
				.attr('stroke', d => color(d._vals.female/d._vals.total))
				.attr('cx', d => xscale(d._vals.female/d._vals.total))
				.attr('cy', this.props.view?yscale('1'):20)
				.attr('fill-opacity', this.props.selected?(d => this.props.selected===d._vals.key?0.8:0.1):0.2)
				.attr('r', d => rscale(d._vals.total))
				.attr('opacity',this.props.grouping===type?0.3:0)
		}

		let divisionsEnter = divisions.enter()
			.append('g')
			.classed('division', true)

		divisionsEnter.append('circle')
			.classed('divisioncircle', true)

		divisions.select('.divisioncircle').call(styleCircle, 'division')

		let subdivisions = divisions.selectAll('.subdivision')
			.data(d => d.values, d => d.key)
		
		let subdivisionsEnter = subdivisions
			.enter()
			.append('g')
			.classed('subdivision', true)

		subdivisionsEnter.append('circle')
			.classed('subdivisioncircle', true)

		subdivisions.select('.subdivisioncircle').call(styleCircle, 'subdivision')

		let groups = subdivisions.selectAll('.group')
			.data(d => d.values, d => d.key)
		
		let groupsEnter = groups
			.enter()
			.append('g')
			.classed('group', true)

		groupsEnter.append('circle')
			.classed('groupcircle', true)

		groups.select('.groupcircle').call(styleCircle, 'group')

		let classes = groups.selectAll('.class')
			.data(d => d.values, d => d.key)
		
		let classesEnter = classes
			.enter()
			.append('g')
			.classed('class', true)

		classesEnter.append('circle')
			.classed('classcircle', true)

		classes.select('.classcircle').call(styleCircle, 'class')
	}
	render(){
		return <g></g>
	}
}