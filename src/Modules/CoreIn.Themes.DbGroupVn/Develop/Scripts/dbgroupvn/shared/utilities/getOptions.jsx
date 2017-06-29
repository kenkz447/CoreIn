const OPPTION_CONTROLLER = '/optionGroup'
const GET_OPTION_ACTION = '/GetSingle'

const GET_OPTION_LINK = global.APP_DOMAIN + OPPTION_CONTROLLER + GET_OPTION_ACTION

function arrayNameValueString_To_ArrayNameValueObject(options) {
    return options.map(item => {
        var strs = String(item.value).split('\n');
        var obj = { name: item.name };
        for (var i in strs) {
            var str = strs[ i ].split(':');
            if (str.length == 2) {
                var kv = str;
                var k = kv[ 0 ].trim();
                var v = kv[ 1 ].trim();
                obj[ k ] = v;
            }
        }
        return obj;
    });
}

function arrayNameValueObject_To_Object(array) {
    const obj = {}
    for (var index in array) {
        var arrayObj = array[ index ];
        obj[ arrayObj.name ] = arrayObj
        delete obj[ arrayObj.name ].name
    }
    return obj
}

function getOptions(entityName) {
    return new Promise((resolve, reject) => {
        $.get(GET_OPTION_LINK, { entityName }, function (response) {
            var array = arrayNameValueString_To_ArrayNameValueObject(response.details.options)
            var options = arrayNameValueObject_To_Object(array)
            resolve(options);
        });
    })
}

function getOption(optionName, options) {
    return options.filter(option => option.name === optionName)[ 0 ]
}

export { getOption, getOptions }
