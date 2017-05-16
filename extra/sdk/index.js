var cosAPI = require('cos-nodejs-sdk-v5'),
    cosConfig = require('cos-nodejs-sdk-v5/sdk/config'),
    cosUtil = require('cos-nodejs-sdk-v5/sdk/util'),
    cosConfig = require('cos-nodejs-sdk-v5/sdk/config'),
    threeArse,
    AppId,
    SecretId,
    SecretKey;

var parseString = require('xml2js').parseString;


try {
    threeArse = require("../../threeArse.json");
    AppId = threeArse.qcloud.AppId;
    SecretId = threeArse.qcloud.SecretId;
    SecretKey = threeArse.qcloud.SecretKey;
} catch(e) {

}

cosConfig.setAppInfo(AppId, SecretId, SecretKey);



exports.cosAPI = cosAPI;
exports.cosUtil = cosUtil;
exports.cosConfig = cosConfig;




if (!module.parent) {


    var basePath = "../../db_src";
    var traversalDir = require("../common").traversalDir;

    function checkToUpload(filesList) {
        var item = filesList.shift();
        if (item) {
            var ContentLength = item.size,
                Body = item.path,
                Key = item.path.replace(`${basePath}/`, ""),
                Bucket = "silverjourney",
                Region = "cn-south";
            cosAPI.putObject({
                ContentLength: ContentLength,
                Body: Body,
                Bucket: Bucket,
                Region: Region,
                Key: Key
            }, function() {
                console.log(arguments);
                checkToUpload(filesList);
            });
        }
    }


    traversalDir(basePath, function(err, filesList) {
        console.log(filesList);
        checkToUpload(filesList);
    });

}
