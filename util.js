var util = {};

util.parseError = function(errors){
    var parsed = {};
    if(errors.name == 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsd[name] = { massage: validationError.message };
        }
    }
    else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = { message:'This username already exists!' };
    } 
    else {
      parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

module.exports = util;
