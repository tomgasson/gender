var fs = require('fs')
var path = require('path')

fs.readFile(path.join(__dirname,'data', 'codes.tsv'), 'utf-8', function(err, d){
	d = d.replace(/\r/g,'').replace(/\n+/g,'\n')
	d = d.split('\n')
	var division = ''
	var subdivision = ''
	var group = ''
	var outDesc = []
	var outCode = []
	d.forEach(function(line){
		var type = 'division'
 		if (/^\t\t\t/.test(line)){
 			parts = line.replace(/^\t\t\t/, '').split('\t')
 			code = parts[0].trim()
 			desc = parts[1].trim()
 			outDesc.push([division.desc,subdivision.desc,group.desc,desc])
 			outCode.push([division.code,subdivision.code,group.code,code])
 		} else if (/^\t\t/.test(line)){
 			parts = line.replace(/^\t\t/, '').split('\t')
 			code = parts[0].trim()
 			desc = parts[1].trim()
 			group = {code:code, desc:desc}
 		} else if (/^\t/.test(line)){
 			parts = line.replace(/^\t/, '').split('\t')
 			code = parts[0].trim()
 			desc = parts[1].trim()
 			subdivision = {code:code, desc:desc}
 		} else {
 			parts = line.split('\t')
 			code = parts[0].trim()
 			desc = parts[1].trim()
 			division = {code:code, desc:desc}
 		}
	})

	outDesc.unshift(['division','subdivision','group','class'])
	var text = outDesc.map(function(d){
		return d.map(function(d){
			return /,/.test(d)?'"'+d+'"':d
		}).join(',')
	}).join('\n')
	fs.writeFile('codes.csv', text)
})