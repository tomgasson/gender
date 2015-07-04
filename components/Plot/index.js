import React from 'react'
import d3 from 'd3'
import Tip from 'd3-tip'
import Tooltip from 'Tooltip'

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
function getDivision(tree){
	let leaf = tree;
	while (leaf.values.length > 0){
		leaf = leaf.values[0]
	}

	console.log(leaf)

	return leaf.division
}

export default class Plot {
	componentDidMount(){
		this.tip = Tip()
		this.tip.html(d => {
			return React.renderToString(<Tooltip division={this.props.grouping!=='division'} {...d.values} />)
		})
		this.update()
	}
	componentDidUpdate(){
		this.update()
	}
	update(){

		let nest = d3.nest()
		switch (this.props.grouping){
			case 'division':
				nest = nest.key(d => d.division)
				break;
			case 'subdivision':
				nest = nest.key(d => d.division)
				nest = nest.key(d => d.subdivision)
				break;
			case 'group':
				nest = nest.key(d => d.division)
				nest = nest.key(d => d.subdivision)
				nest = nest.key(d => d.group)
				break;
			case 'class':
				nest = nest.key(d => d.division)
				nest = nest.key(d => d.subdivision)
				nest = nest.key(d => d.group)
				nest = nest.key(d => d.class)
				break;
		}
		let colors = d3.scale.category20()

		let yscale = d3.scale.ordinal()
			.rangeBands([0, this.props.height])
		switch (this.props.view){
			case 'By occupation':
				yscale.domain(_.uniq(_.pluck(this.props.data, 'occupation')))
				nest = nest.key(d => d.occupation)
				break;
			case 'By employment type':
				yscale.domain(_.uniq(_.pluck(this.props.data, 'employment_status')))
				nest = nest.key(d => d.employment_status)
				break;
		}

		let data = nest
			.rollup(d => {
				let male = d3.sum(d.filter(d => d.gender=='Male'), d => +d.number_of_employees)
				let female = d3.sum(d.filter(d => d.gender=='Female'), d => +d.number_of_employees)

				return {
					male,
					female,
					total: male + female,
					division: d[0].division,
					name: d[0][this.props.grouping]
				}
			})
			.entries(this.props.data)

		var color = d3.scale.linear()
			.range(['#0077FF','#FF00F2'])

		let rscale = d3.scale.linear()
			.domain([0,10000])
			.range([5,10])
			.clamp(true)
		
		var xscale = d3.scale.linear().range([0, this.props.width])
		
		let el = d3.select(React.findDOMNode(this))

		el.call(this.tip)

		let divisions = el.selectAll('.division')
			.data(data, d => d.key)

		let styleCircle = (sel, type) => {
			sel.each(d => d._vals = getValues(d))
				.attr('fill', this.props.color?(d => colors(d.values.division)):(d => color(d._vals.female/d._vals.total)))
				.attr('fill-opacity', this.props.color?0.6:0.2)
				.attr('stroke', this.props.color?(d => colors(d.values.division)):(d => color(d._vals.female/d._vals.total)))
				.attr('stroke-opacity', 0.3)
				.attr('cx', d => xscale(d._vals.female/d._vals.total))
				.attr('cy', this.props.view?(d => yscale.rangeBand()/2 + yscale(d.key)):this.props.height/2)
				.attr('r', d => rscale(d._vals.total))
		}

		let divisionsEnter = divisions.enter()
			.append('g')
			.classed('division', true)

		divisionsEnter.append('circle')
			.classed('divisioncircle', true)

		divisions.select('.divisioncircle').attr('opacity',0).transition(1000).call(styleCircle, 'division')
		divisions.exit().remove()

		let subdivisions = divisions.selectAll('.subdivision')
			.data(d => d.values, d => d.key)
		
		let subdivisionsEnter = subdivisions
			.enter()
			.append('g')
			.classed('subdivision', true)

		subdivisionsEnter.append('circle')
			.classed('subdivisioncircle', true)
			.attr('cx', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cx') })
			.attr('cy', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cy') })
			.attr('r', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('r') })

		subdivisions.select('.subdivisioncircle').attr('opacity',0).transition(1000).call(styleCircle, 'subdivision')
		subdivisions.exit().remove()
		let groups = subdivisions.selectAll('.group')
			.data(d => d.values, d => d.key)
		
		let groupsEnter = groups
			.enter()
			.append('g')
			.classed('group', true)

		groupsEnter.append('circle')
			.classed('groupcircle', true)
			.attr('cx', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cx') })
			.attr('cy', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cy') })
			.attr('r', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('r') })

		groups.select('.groupcircle').attr('opacity',0).transition(1000).call(styleCircle, 'group')
		groups.exit().remove()

		let classes = groups.selectAll('.class')
			.data(d => d.values, d => d.key)
		
		let classesEnter = classes
			.enter()
			.append('g')
			.classed('class', true)

		classesEnter.append('circle')
			.classed('classcircle', true)
			.attr('cx', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cx') })
			.attr('cy', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cy') })
			.attr('r', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('r') })
			

		classes.select('.classcircle').attr('opacity',0).transition(1000).call(styleCircle, 'class')

		classes.exit().remove()

		let last = classes
		switch (this.props.grouping){
			case 'division':
				last = divisions
				break;
			case 'subdivision':
				divisions.selectAll('.splits').remove()
				last = subdivisions
				break;
			case 'group':
				divisions.selectAll('.splits').remove()
				subdivisions.selectAll('.splits').remove()
				last = groups
				break;
			case 'class':
				divisions.selectAll('.splits').remove()
				subdivisions.selectAll('.splits').remove()
				groups.selectAll('.splits').remove()
				last = classes
				break;
		}

		let verylast = last

		let splits = last.selectAll('.splits')
			.data(d => d.values, d => d.key)
		
		let splitsEnter = splits
			.enter()
			.append('g')
			.classed('splits', true)

		splitsEnter.append('circle')
			.classed('splitscircle', true)
			.attr('cx', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cx') })
			.attr('cy', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('cy') })
			.attr('r', function(){ return d3.select(this.parentNode.parentNode).select('circle').attr('r') })
			

		splits.select('.splitscircle').attr('opacity',0).transition(1000).call(styleCircle, 'splits')

		splits.exit().remove()

		if (this.props.view){
			let labels = el.selectAll('.label')
				.data(yscale.domain())

			labels
				.enter()
				.append('text')
				.classed('label', true)
			labels.text(d => d)
				.attr('fill', '#ccc')
				.attr('fill-opacity', 0.5)
				.attr('y', d => yscale(d) + 12)
				// .attr('x', this.props.width/2)
				// .attr('text-anchor','middle')
				.attr('font-size', '12px')
				.attr('font-family', 'arial')

			labels.exit().remove()

			verylast = splits
		} else {
			el.selectAll('.label').remove()
		}


		verylast.select('circle').on('mouseover', this.tip.show).on('mouseout', this.tip.hide).attr('opacity',1)

	}
	render(){
		return <g></g>
	}
}