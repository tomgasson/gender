import SVG from 'SVG'
import Toggle from 'Toggle'
import React from 'react'
import Margin from 'Margin'
import Plot from 'Plot'
import styles from './index.css'
import _ from 'lodash'
import grid from 'grid.css'
import classnames from 'classnames'
import 'fonts/volkorn.css'
import Axis from 'Axis'

export default class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			data: [],			
			selected: undefined,
			view: undefined,
			grouping: 'class'
		}
	}
	componentDidMount(){
		d3.csv('data.csv', data => {
			
			d3.csv('codes.csv', codes => {
				let _classes = d3.nest()
					.key(d => d.class)
					.map(codes)

				data = data.map(d => {
					let extra = _classes[d.class][0]
					return {
						class: extra.class,
						group: extra.group,
						subdivision: extra.subdivision,
						division: extra.division,
						employment_status: d.employment_status,
						occupation: d.occupation,
						gender: d.gender,
						number_of_employees: +d.number_of_employees
					}
				})
				this.setState({data})

			})
		})
	}
	setView(view){
		this.setState({view})
	}
	setGrouping(grouping){
		this.setState({grouping})
	}
	select(item){
		this.setState({selected:item})
	}
	render(){
		let data = this.state.data
		let plotcls = {}
		plotcls[styles.plot] = true
		plotcls[styles.plotopen] = !!this.state.view
		return (
			<div>
				<h1>Gender Equality</h1>
				<div className={styles.wrap}>
					<Toggle all={true} items={['By occupation','By employment type']} selected={this.state.view} select={this.setView.bind(this)}/>
					<Toggle all={false} items={['division','subdivision','group','class']} selected={this.state.grouping} select={this.setGrouping.bind(this)}/>
				</div>
				<div className={classnames(plotcls)}>
					<SVG>
						<Margin>
							<Plot grouping={this.state.grouping} view={this.state.view} data={data} select={this.select.bind(this)} selected={this.state.selected}/>
							<Axis />
						</Margin>
					</SVG>
				</div>
				<div className={styles.wrap}>
					<p>Many people are aware of the gender imbalances in their own industry. In 2012 the Australian Govenment introduced legislation to track these balances. The data is collected yearly from all Australian companies with over 100 employees.</p>
					<p className={styles.lead}>Select an occupation, employment type of click a bubble below to explore the data.</p>
					<p>The data is further broken down into the ANZIC industry classification codes.</p>
					<small>ANZIC publishes these codes, but not in a very nice format. For this project I had to convert them to <a>csv</a>.</small>
				</div>
			</div>
		)
	}
}

if (typeof document !== 'undefined'){
	React.render(<App />, document.body)
}