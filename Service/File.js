/**
 * Created by zhy on 16/7/2.
 */
function File() {
	var multiparty = require('multiparty');
	var path = require('path');
	var fs = require('fs');

	var uploadPath = path.join(__dirname, '../Public/upload');
	var tempUploadPath = path.join(__dirname, '../Public/tempUpload');

	this.parse = function (req, res, callBack) {
		//初始化multiparty对象
		var form = new multiparty.Form({uploadDir: tempUploadPath});

		//解析二进制表单
		form.parse(req, function (err, fields, files) {
			if (err) {
				res.send('0');
				return
			}
			
			console.log(fields + files);

			//解析出的非二进制字段及文件
			callBack(fields, files);
		})
	};

	this.move = function (oldPath, newPath, fileName, res, callBack) {
		//判断用户目录
		if (!fs.existsSync(uploadPath + newPath)) {
			//无则创建
			var pathTmp;
			
			newPath.split('/').forEach(function(dirName) {
				if (pathTmp) {
					pathTmp = path.join(pathTmp, '/' + dirName);
				}
				else {
					pathTmp = '/' + dirName;
				}
				
				var dirPath = uploadPath + pathTmp;
				
				if (!fs.existsSync(dirPath)) {
					fs.mkdirSync(dirPath);
				}
			})
		}

		fs.rename(oldPath, uploadPath + newPath + fileName, function (err) {
			if (err) {
				res.send('0');
				return
			}
			
			callBack();
		})
	};
	
	this.getFileType = function (fileName) {
		return path.extname(fileName);
	};
}

module.exports = new File();