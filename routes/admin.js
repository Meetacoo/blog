const Router = require('express').Router;
const blogModel = require('../models/blog.js');
const commentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');
const path = require('path');
const hmac = require('../util/hmac.js');
const router = Router();

router.use((req,res,next)=>{
	if (req.userInfo.isAdmin) {
		next();
	}else{
		res.send('<h1>请用管理员账号登录</h1>');
	}
})
// 显示首页
router.get('/',(req,res)=>{
	// console.log(req.cookies.get('userInfo'));
	// console.log(req.userInfo);
	// res.send('admin');
	res.render('admin/index',{
		userInfo:req.userInfo
	});
})

/*router.get('/users',(req,res)=>{
	res.render('admin/userlist',{
		userInfo:req.userInfo
	});	
})*/
//显示用户列表
router.get('/users',(req,res)=>{
	// console.log(blogModel.find({},'_id username isAdmin'));
	/*blogModel.find()
	.then((users)=>{
		res.render('admin/userlist',{
			userInfo:req.userInfo,
			users:users
		});	
	})*/
//获取所有用户的信息,分配给模板
	//需要显示的页码
	/*let page = req.query.page || 1;
	if(page <= 0){
		page = 1;
	}
	//每页显示条数
	let limit = 2;
	
	// 分页:
	// 假设: 每页显示 2 条  
	// limit(2)
	// skip()//跳过多少条
	// 第 1 页 跳过 0 条
	// 第 2 页 跳过 2 条
	// 第 3 也 跳过 4 条
	// 综上发现规律:
	// (page - 1) * limit
	

	blogModel.estimatedDocumentCount({})
	.then((count)=>{
		let pages = Math.ceil(count / limit);
		if(page > pages){
			page = pages;
		}
		let list = [];

		for(let i = 1;i<=pages;i++){
			list.push(i);
		}
		
		let skip = (page - 1)*limit;

		blogModel.find({},'_id username isAdmin')
		.skip(skip)
		.limit(limit)
		.then((users)=>{
			res.render('admin/userlist',{
				userInfo:req.userInfo,
				users:users,
				page:page*1,
				list:list
			});			
		})
	})
*/
	let options = {
		page: req.query.page,
		model: blogModel,
		query :{},
		show: '_id username isAdmin',
		sort: {_id:1}
	}
	pagination(options)
	.then((data)=>{
		res.render('admin/userlist',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/admin/users'
		});	 
	})
})

router.post('/uploadImages',upload.single('upload'),(req,res)=>{
	let path = "/uploads/"+req.file.filename;

	// console.log(path);
	res.json({
		uploaded:true,
		url:path
	})
})

// 
router.get('/comments',(req,res)=>{
	commentModel.getPaginationComments(req)
	.then(data=>{
		res.render('admin/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list
		})
	})
})

router.get('/comment/delete/:id',(req,res)=>{
	let id = req.params.id;
	
	commentModel.remove({_id:id},(err,raw)=>{
		if (!err) {
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'删除评论成功',
				url:'/admin/comments'
			})
		} else {
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'删除评论失败',
			})
		}
		
	});
})

// 显示站点管理页面
router.get('/site',(req,res)=>{
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(!err){
			let site = JSON.parse(data);
			res.render('admin/site',{
					userInfo:req.userInfo,
					site:site
			});	
		}else{
			console.log(err)
		}
	})
	/*res.render('admin/site',{
		userInfo:req.userInfo
	})*/
})
//处理修改网站配置请求
router.post("/site",(req,res)=>{
	let body = req.body;
	// console.log(req.body)
	let site = {
		name:body.name,
		author:{
			name:body.authorName,
			intro:body.authorIntro,
			image:body.authorImage,
			wechat:body.authorWechat
		},
		icp:body.icp
	}
	site.carouseles = [];
	if (body.carouselUrl.length && (typeof body.carouselUrl == 'object')) {
		for (var i = 0; i < body.carouselUrl.length; i++) {
			site.carouseles.push({
				url:body.carouselUrl[i],
				path:body.carouselPath[i]
			})
		}
	} else {
		site.carouseles.push({
			url:body.carouselUrl,
			path:body.carouselPath
		})
	}
	site.ads = [];
	if (body.adUrl.length && (typeof body.adUrl == 'object')) {
		for (var i = 0; i < body.adUrl.length; i++) {
			site.ads.push({
				url:body.adUrl[i],
				path:body.adPath[i]
			})
		}
	} else {
		site.ads.push({
			url:body.adUrl,
			path:body.adPath
		})
	}
	// console.log(site);

	let siteContent = JSON.stringify(site);
	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(!err){
			fs.writeFile(filePath,siteContent,(err)=>{
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'站点管理成功',
					url:'/admin/site'
				});
			})
		}else{
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'站点管理失败，文件操作失败',
				url:'/admin/site'
			});	
		}
	})
})


// 显示修改密码页面
router.get('/password',(req,res)=>{
	res.render('admin/password',{
		userInfo:req.userInfo,
	});
})
router.post('/password',(req,res)=>{
	let obj = req.body;
	// console.log(obj.repassword);
	blogModel
	.findOneAndUpdate({_id:req.userInfo._id},{$set:{password:hmac(obj.repassword)}})
	// .update({_id:req.userInfo._id},{password:hmac(obj.password)})
	.then((user)=>{
		// console.log(user);
		if(user){
			req.session.destroy();
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'修改密码成功',
				url:'/'
			});
		}else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'修改密码失败，文件操作失败',
				url:'/'
			});	
		}
	})
})
module.exports = router;