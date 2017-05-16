import common from "../common"
import config from "../config"

var sha256 = common.sha256;
var sha_key = config.sha_key;


var getPassword = function(email, password) {
	return sha256(`${email}${sha_key}${password}`);
}

export default {
	getPassword
}
