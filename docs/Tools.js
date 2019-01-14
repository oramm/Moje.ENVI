class Tools{
   //finds an alament in Array by its value
    static search(nameKey, property, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i][property] === nameKey) {
                return myArray[i];
            }
        }
    }
    static dateDMYtoYMD(inputDate) {   
        if(inputDate){
            var parts = inputDate.split("-");
            if (parts[2].length===4)
                return parts[2] + '-' + parts[1] + '-' + parts[0];
            else
                return inputDate;
        }
    }
    
    static daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }
    
    static loadjscssfile(filename, filetype){
        if (filetype=="js"){ //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type","text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype == "css"){ //if filename is an external CSS file
            var fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref!="undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
       }
    
    //retrieves GET variables from URL
    static getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, 
                                                 function(m,key,value) {
                                                    vars[key] = value;
                                                });
        return vars;
    }
    
    static hasFunction(functionRef) {
        if (typeof functionRef === 'undefined') {
            throw new SyntaxError('Derived object must implement function');
        } else if (typeof functionRef !== 'function') {
            throw new SyntaxError("It's neither undefined nor a function. It's a " + typeof functionRef);
        }
    }
    
    static stringToSql(string){
        var sqlString = string.replace(/\'/gi, "\\'");
        sqlString = sqlString.replace(/\"/gi, '\\"');
        sqlString = sqlString.replace(/\%/gi, '\\%');
        sqlString = sqlString.replace(/\_/gi, '\\_');
        return sqlString;
    }
    
    static cloneOfObject(object){
        return JSON.parse(JSON.stringify(object));
    }

    static areEqualObjects(obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!areEqualObjects(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
    };
}

//finds an alament in Array by its value
function search(nameKey, property, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][property] === nameKey) {
            return myArray[i];
        }
    }
}
//retrieves GET variables from URL
function getUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
vars[key] = value;
});
return vars;
}