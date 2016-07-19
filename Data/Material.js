/**
 * Created by zhy on 16/7/14.
 */
function Material() {
	var self = this;
	
	// var connection = require('../DB_Class').getConnection();
	var file = require('../Service/File');
	var uploadPath = '/upload';
	
	//添加原料
	this.add = function (dbMaterial, fields, files, res, callBack) {
		dbMaterial.create({
			name: fields.name[0],
			nutrition_value: fields.nutrition_value[0],
			del: 0
		}, function (err, rows) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			//materialId
			var materialId = rows[0].id;
			
			//图片路径
			var newPath = '/material/{id}'.format({
				id: materialId
			});
			var newFileName = '/img{ext}'.format({
				ext: file.getFileType(files.img[0].originalFilename)
			});
			
			file.move(files.img[0].path, newPath, newFileName, res, function () {
				//修改数据
				var row = rows[0];
				
				row.img = uploadPath + newPath + newFileName;
				row.save(function (err) {
					if (err) {
						res.send(JSON.stringify(0));
						return;
					}
					
					callBack(materialId)
				});
			});
		});
	};
	
	//添加至菜单
	this.bindWithMenuId = function (materialId, menuId, dbMenu_Material, res, callBack) {
		dbMenu_Material.create({
			material_id: materialId,
			menu_id: menuId
		}, function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	//修改原料
	this.update = function (req, res, callBack) {
		//解析二进制数据
		file.parse(req, res, function (fields, file) {
			//寻找原料
			req.models.material.find({ id: fields.id[0] }, function (err, rows) {
				if (err || rows.length == 0) {
					res.send(JSON.stringify(0));
					return;
				}
				
				//图片路径
				var newPath = '/material/{id}'.format({
					id: fields.id[0]
				});
				var newFileName = '/img{ext}'.format({
					ext: file.getFileType(files.img[0].originalFilename)
				});
				
				//移动文件
				file.move(files.img[0].path, newPath, newFileName, res, function () {
					//修改数据
					var row = rows[0];
					
					row.name = fields.name[0];
					row.nutrition_value = fields.nutrition_value[0];
					row.img = uploadPath + newPath + newFileName;
					//保存
					row.save(function (err) {
						if (err) {
							res.send(JSON.stringify(0));
							return;
						}
						
						callBack()
					});
				});
			});
		});
	};
	
	//从菜单中删除原料
	this.delFromMenu = function (params, dbMenu_Material, res, callBack) {
		dbMenu_Material.find({
			material_id: params.materialId,
			menu_id: params.menuId
		}).remove(function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	//向菜单中添加现成的原料
	this.addForMenuId = function (params, dbMenu_Material, res, callBack) {
		dbMenu_Material.create({
			material_id: params.materialId,
			menu_id: params.menuId
		}, function (err) {
			if (err) {
				res.send(JSON.stringify(0));
				return;
			}
			
			callBack()
		});
	};
	
	//封禁
	this.del = function (materialId, dbMaterial, res, callBack) {
		dbMaterial.find({ id: materialId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			rows[0].del = 1;
			rows[0].save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack()
			});
		});
	};
	
	//激活
	this.activate = function (materialId, dbMaterial, res, callBack) {
		dbMaterial.find({ id: materialId }, function (err, rows) {
			if (err || rows.length == 0) {
				res.send(JSON.stringify(0));
				return;
			}
			
			rows[0].del = 0;
			rows[0].save(function (err) {
				if (err) {
					res.send(JSON.stringify(0));
					return;
				}
				
				callBack()
			});
		});
	}
}

module.exports = new Material();