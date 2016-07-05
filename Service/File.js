/**
 * Created by zhy on 16/7/2.
 */
function File() {
	var multiparty = require('multiparty');
	var path = require('path');
	var fs = require('fs');

	var uploadPath = path.join(__dirname, '../Public/upload');
	var tempUploadPath = path.join(__dirname, '../Public/temp_upload');

	this.parse = function (req, res, callBack) {
		//初始化multiparty对象
		var form = multiparty.Form({uploadDir: tempUploadPath});

		//解析二进制表单
		form.parse(req, function (err, fields, files) {
			if (err) {
				res.send('数据流解析错误');
				return;
			}

			//解析出的非二进制字段及文件
			callBack(fields, files);
		})
	};

	this.move = function (oldPath, newPath, fileName, res, callBack) {
		//判断用户目录
		if (!fs.existsSync(newPath)) {
			//无则创建
			fs.mkdirSync(newPath);
		}

		fs.rename(oldPath, uploadPath + newPath + fileName, function (err) {
			if (err) {
				res.send(0);
				return;
			}
			
			callBack();
		})
	}
}

module.exports = new File();