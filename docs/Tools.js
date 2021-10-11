class Tools {
    //finds an alament in Array by its value
    static search(nameKey, property, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i][property] == nameKey) {
                return myArray[i];
            }
        }
    }
    static dateDMYtoYMD(inputDate) {
        if (inputDate) {
            var parts = inputDate.split("-");
            if (parts[2].length === 4)
                return parts[2] + '-' + parts[1] + '-' + parts[0];
            else
                return inputDate;
        }
    }
    static timestampToString(timestamp) {
        if (typeof timestamp === 'string')
            timestamp = new Date(timestamp);
        var day = this.addZero(timestamp.getDate());
        var month = this.addZero(timestamp.getMonth() + 1);
        var year = timestamp.getFullYear();
        var h = this.addZero(timestamp.getHours());
        var m = this.addZero(timestamp.getMinutes());
        return day + '&#8209;' + month + '&#8209;' + year + ' ' +
            h + ':' + m

    }

    static addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    static dateJStoDMY(inputDate) {
        if (inputDate) {
            var dd = this.addZero(inputDate.getDate());
            var mm = this.addZero(inputDate.getMonth() + 1); //January is 0!
            var yyyy = inputDate.getFullYear();

            return dd + '-' + mm + '-' + yyyy;
        }
    }

    static dateJStoYMD(inputDate) {
        return this.dateDMYtoYMD(this.dateJStoDMY(inputDate));
    }

    static daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    static loadjscssfile(filename, filetype) {
        if (filetype == "js") { //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype == "css") { //if filename is an external CSS file
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    //retrieves GET variables from URL
    static getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function (m, key, value) {
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

    static stringToSql(string) {
        var sqlString = string.replace(/\'/gi, "\\'");
        sqlString = sqlString.replace(/\"/gi, '\\"');
        sqlString = sqlString.replace(/\%/gi, '\\%');
        sqlString = sqlString.replace(/\_/gi, '\\_');
        return sqlString;
    }

    static cloneOfObject(object) {
        if (object) return JSON.parse(JSON.stringify(object));
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
    }
    /* https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
     * sprawdza który oiekt jest większy - do użycia w Array.sort()
     * @param {type} key - nazwa atrybutu obiektu
     * @param {type} order
     * @returns {Function}
     */
    static compareValues(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
            let comparison = a[key].localeCompare(b[key]);
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    //https://codeburst.io/javascript-array-distinct-5edc93501dc4
    static ArrNoDuplicates(array) {
        const result = [];
        const map = new Map();
        for (const item of array) {
            if (!map.has(item.id)) {
                map.set(item.id, true);    // set any value to Map
                result.push(item);
            }
        }
        console.log(result);
        return result;
    }
    /*
     * item {Object}
     */
    static arrGetIndexOf(array, property, searchValue) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][property] === searchValue)
                return i;
        }
    }

    /**
     * If you don't care about primitives and only objects then this function
     * is for you, otherwise look elsewhere.
     * This function will return `false` for any valid json primitive.
     * EG, 'true' -> false
     *     '123' -> false
     *     'null' -> false
     *     '"I'm a string"' -> false
     */
    static tryParseJSONObject(jsonString) {
        try {
            var o = JSON.parse(jsonString);
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object", 
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === "object")
                return o;
        }
        catch (e) { }
        return false;
    }

    //https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    static b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
}