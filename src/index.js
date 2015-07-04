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
import Checkbox from 'Checkbox'

export default class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			data: [],
			selected: undefined,
			view: undefined,
			grouping: 'class',
			color:false
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
	toggle(){
		this.setState({color:!this.state.color})
	}
	render(){
		let data = this.state.data
		let plotcls = {}
		plotcls[styles.plot] = true
		plotcls[styles.plotoccupation] = this.state.view==='By occupation'
		plotcls[styles.plotstatus] = this.state.view==='By employment type'
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
							<Plot color={this.state.color} grouping={this.state.grouping} view={this.state.view} data={data} select={this.select.bind(this)} selected={this.state.selected}/>
							<Axis />
						</Margin>
					</SVG>
				</div>
				<div className={styles.wrap}>
					<div className={styles.lead}>
						Click a bubble to explore the data
						<div className={styles.right}><Checkbox checked={this.state.color} toggle={this.toggle.bind(this)} /></div>
					</div>
					
					<p>Most people are aware of the gender imbalances in their industry. In 2012 the Australian Govenment introduced the <strong>Workplace Gender Equality Act</strong> to monitor these balances. The data is collected annually from all non-public Australian companies with over 100 employees.</p>
				</div>
				<div className={styles.footer}>
					Made by <a href="https://twitter.com/tomgasson">Tom Gasson</a> for <a href="https://www.govhack.org/">GovHack</a> | <a href="https://data.gov.au/dataset/wgea-dataset">data</a> | <a href="github">source</a>
				</div>
			</div>
		)
	}
}

if (typeof document !== 'undefined'){
	React.render(<App />, document.body)
}