// initialize the raphael canvas
function init(){
    var w=document.body.clientWidth-20;
	var barspace=2;
	var barsize=(w/json.length)-barspace;
	var h=document.body.clientHeight-20-2*barspace;
	var r=Raphael('canvas',w,h);
	var log=document.getElementById('log');
	var url='https://sourcemap.codebasehq.com/sourcemap/main/tree/';
	
	var authors={};
	var maxpaths = 0;
	for(var i=0;i<json.length;i++){
		if(json[i].author in authors){
			authors[json[i].author]++;
		}
		else{
			authors[json[i].author]=1;
		}
		maxpaths=Math.max(maxpaths,json[i].paths.length);
	}
	
	var log=document.getElementById('log');
	
	var parseDate=function(str){
		// 2009-11-20T20:31:58.263077Z
		var re=/^(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
		re.test(str);
		
		var d=new Date();
		d.setFullYear(RegExp.$1);
		d.setMonth(parseInt(RegExp.$2,10)-1);
		d.setDate(RegExp.$3);
		d.setHours(RegExp.$4);
		d.setMinutes(RegExp.$5);
		d.setSeconds(RegExp.$6);
		return d.toDateString()+' at '+d.toLocaleTimeString();
	};
	
	var getHover=function(entry,color,shape){
		return function(){
			// remove the old log entries
			while(log.firstChild!=null) log.removeChild(log.firstChild);
			var lbox=document.createElement('div');
			lbox.id='lbox';
			log.appendChild(lbox);
			var rbox=document.createElement('div');
			rbox.id='rbox';
			log.appendChild(rbox);
			// add the author info
			var node=document.createElement('div');
			node.id='entryAuthor';
			node.style.color=color;
			node.appendChild(document.createTextNode(entry.author));
			lbox.appendChild(node);
			// add the revision info
			node=document.createElement('div');
			node.id='entryRev';
			node.appendChild(document.createTextNode('r'+entry.revision));
			lbox.appendChild(node);
			// add the date info
			node=document.createElement('div');
			node.id='entryDate';
			node.appendChild(document.createTextNode(parseDate(entry.date)));
			lbox.appendChild(node);
			// add the message info
			node=document.createElement('div');
			node.id='entryMsg';
			node.appendChild(document.createTextNode(entry.msg));
			lbox.appendChild(node);
			// add the path info
			node=document.createElement('div');
			node.id='entryPaths';
			node.appendChild(document.createTextNode('Files:'));
			var ul=document.createElement('ul');
			node.appendChild(ul);
			for(var i=0;i<entry.paths.length;i++){
				var li=document.createElement('li');
				li.className = 'action'+entry.paths[i].action;
				
				var a=document.createElement('a');
				var plen=entry.paths[i].path.lastIndexOf('/');
				a.href=url+entry.revision+entry.paths[i].path.substring(0,plen);
				a.appendChild(document.createTextNode(entry.paths[i].path));
				a.target='_blank';
				
				li.appendChild(a);
				ul.appendChild(li);
			}
			rbox.appendChild(node);
			// highligh the border
			shape.animate({stroke:'#fff','stroke-opacity':1,'stroke-width':'2px'},250).toFront();
			// which revision?
			var bbox = shape.getBBox();
			shape.label = r.set();
			shape.label.push(r.text(bbox.x+barsize+barspace,bbox.y+(bbox.height/2),entry.revision));
			shape.label.attr({fill:'#fff','fill-opacity':0,'text-anchor':'start','font-size':'15px'});
			shape.label.animate({'fill-opacity':1},250);
		};
	};
	
	var getNoHover=function(color,shape){
		return function(){
  	  shape.animate({stroke:color,'stroke-opacity':0.25,'stroke-width':'1px'},100);
  	  shape.label.animate({'fill-opacity':0},100);
  	};
	};
	
	var getPaths=function(entry,action){
		var added=[];
		for(var i=0;i<entry.paths.length;i++){
			if(entry.paths[i].action==action)
				added.push(entry.paths[i]);
		}
		return added;
	};

	for(var a in authors){
		var clr = Raphael.getColor(0.9);
		for(var c=0;c<json.length;c++){
			if(json[c].author == a)
			{
				var added = getPaths(json[c],'A');
				var adds = r.rect((c*barsize)+barspace,barspace,barsize-barspace,(added.length/maxpaths)*h);
				adds.attr({fill:clr,'fill-opacity':1,stroke:clr,'stroke-opacity':1});
				
				var modified = getPaths(json[c],'M');
				var mods = r.rect((c*barsize)+barspace,(added.length/maxpaths)*h+barspace,barsize-barspace,(modified.length/maxpaths)*h);
				mods.attr({fill:clr,'fill-opacity':0.6,stroke:clr,'stroke-opacity':0.6});

				var deleted = getPaths(json[c],'D');
				var dels = r.rect((c*barsize)+barspace,((added.length/maxpaths)+(modified.length/maxpaths))*h+barspace,barsize-barspace,(deleted.length/maxpaths)*h);
				dels.attr({fill:clr,'fill-opacity':0.25,stroke:clr,'stroke-opacity':0.25});
				
		  	var rect = r.rect((c*barsize)+barspace,barspace,barsize-barspace,(json[c].paths.length/maxpaths)*h);
		  	rect.attr({fill:clr,'fill-opacity':0,'stroke-opacity':0.25,'stroke-width':'1px',stroke:clr});
		  	rect.mouseover(getHover(json[c],clr,rect));
		  	rect.mouseout(getNoHover(clr,rect));
	  	}  	
		}
	}
};

