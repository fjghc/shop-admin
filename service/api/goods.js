/**
 * Created by Administrator on 2016/11/11.
 */
'use strict';
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const GOODS_ATTRSKU = require('./../data/goods_attrsku');
const generateJSON = require('./../generate');

var goods = generateJSON({
  "abstracts": '@ctitle(1, 30)',
  "attrvalues": "1",
  'productid': '@id',
  "guid": '@id',
  'pskuid': '@id',
  'cateid': '@natural(10, 30)',
  'brandid': 1,
  'parentid': 2,
  'mainphoto|1': [
    "@image('240x130', '#FF6600', '#FFF', 'png')",
    "@image('200x100', '#4A7BF7', '#FFF', 'png')",
    "@image('500x300', '#50B347', '#FFF', 'png')",
    "@image('300x700', '#4A7BF7', '#FFF', 'png')",
    "@image('100x200', '#894FC4', '#FFF', 'png')",
    "@image('1000x800', '#c7254e', '#FFF', 'png')",
    "@image('1000x300', '#cccccc', '#FFF', 'png')"
  ],
  'status|0-1': 0,
  'productname': '@ctitle(10, 40)',
  'catename': '@ctitle(3, 10)',
  'cnname': '@ctitle(2, 7)',
  'motobrandids': '[{"brand":{"brand":"AC%20Schnitzer","firstletter":"A","id":1,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X5","isChecked":false},"series":[{"id":2,"seriesid":2,"brandid":1,"brand":"AC%20Schnitzer","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X5","series":"AC%20Schnitzer%20X5","isChecked":true},{"id":3,"seriesid":3,"brandid":1,"brand":"AC%20Schnitzer","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X6","series":"AC%20Schnitzer%20X6","isChecked":true}],"year":[{"id":12,"brandid":1,"seriesid":1,"series":"AC%20Schnitzer%207%E7%B3%BB","year":"2014","title":"AC%20Schnitzer%207%E7%B3%BB%202014","isChecked":true},{"id":13,"brandid":1,"seriesid":1,"series":"AC%20Schnitzer%207%E7%B3%BB","year":"2015","title":"AC%20Schnitzer%207%E7%B3%BB%202015","isChecked":true},{"id":14,"brandid":1,"seriesid":1,"series":"AC%20Schnitzer%207%E7%B3%BB","year":"2016","title":"AC%20Schnitzer%207%E7%B3%BB%202016","isChecked":true}],"output":[{"id":110,"brandid":1,"seriesid":1,"outputid":110,"year":"2013","title":"AC%20Schnitzer%207%E7%B3%BB%202013%202.0T","output":"2.0T","isChecked":true},{"id":111,"brandid":1,"seriesid":1,"outputid":111,"year":"2013","title":"AC%20Schnitzer%207%E7%B3%BB%202013%202.5T","output":"2.5T","isChecked":true}],"model":[{"id":11114,"modelid":11114,"brandid":1,"gearid":23,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","model":"AC%20Schnitzer%20%E8%BD%A6%E7%B3%BB1%20%E6%8E%92%E9%87%8F112%202013%20%E9%99%90%E9%87%8F%E7%89%88","title":"AC%20Schnitzer%20%E8%BD%A6%E7%B3%BB1%20%E6%8E%92%E9%87%8F112%202013%20%E9%99%90%E9%87%8F%E7%89%88","outputid":112,"seriesid":1,"structid":2,"year":"2013"},{"id":11115,"modelid":11115,"brandid":1,"gearid":23,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","model":"AC%20Schnitzer%20%E8%BD%A6%E7%B3%BB1%20%E6%8E%92%E9%87%8F112%202013%20%E9%9D%92%E6%98%A5%E7%89%88","title":"AC%20Schnitzer%20%E8%BD%A6%E7%B3%BB1%20%E6%8E%92%E9%87%8F112%202013%20%E9%9D%92%E6%98%A5%E7%89%88","outputid":112,"seriesid":1,"structid":2,"year":"2013"}]},{"brand":{"brand":"%E5%AE%89%E5%87%AF%E5%AE%A2%E8%BD%A6","firstletter":"A","id":6,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AnKaiKeChe.png","title":"%E5%AE%89%E5%87%AF%E5%AE%A2%E8%BD%A6","isChecked":true}},{"brand":{"brand":"%E5%B7%B4%E5%8D%9A%E6%96%AF","firstletter":"B","id":8,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaBoSi.png","title":"%E5%B7%B4%E5%8D%9A%E6%96%AF","isChecked":true}},{"brand":{"brand":"%E4%BF%9D%E6%97%B6%E6%8D%B7","firstletter":"B","id":13,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BaoShiJie.png","title":"%E4%BF%9D%E6%97%B6%E6%8D%B7","isChecked":true}},{"brand":{"brand":"%E5%8C%97%E6%B1%BD%E5%A8%81%E6%97%BA","firstletter":"B","id":17,"logo":"http://localhost:9090/shopservice/public/logo/motor/B_BeiQiWeiWang.png","title":"%E5%8C%97%E6%B1%BD%E5%A8%81%E6%97%BA","isChecked":true}}]',
  'unit|1': [
    "个", "桶", "毫米", "公斤", "件"
  ],
  'officialprice': '@float(0, 9999, 2)',
  'saleprice': '@float(0, 9999, 2)',
  'stock': '@float(0, 999, 0)',
  'skuvalues': '[{"guid":0,"id":12,"items":[{"guid":0,"id":57,"skuid":12,"skuvalue":"汽机油","sort":1}],"skuname":"机油类别","skutype":"text","sort":0},{"guid":0,"id":13,"items":[{"guid":0,"id":63,"skuid":13,"skuvalue":"半合成机油","sort":2}],"skuname":"机油分类","skutype":"text","sort":0},{"guid":0,"id":14,"items":[{"guid":0,"id":69,"skuid":14,"skuvalue":"5W-30","sort":1}],"skuname":"机油粘度","skutype":"text","sort":0}]',
  "transid": 1,
  "transname": "中通快递",
  "updatetime": '@date("yyyy-MM-dd HH:mm:ss")',
  "audit": "0",
  "benefitprice": 0,
  "costprice": 0,
  "createtime": '@date("yyyy-MM-dd HH:mm:ss")',
  "emsfee": 0,
  "expressfee": 0,
  "groupprice": 0,
  "integral": 0,
  "mailfee": 0,
  "parentcatename": "机油",
  "recommend": "0",
  "skusalenum": 0,
  "specialprice": 0,
  "storeid": 1,
  "tradeprice": 0
}, 100);







/**
 * 获取商品管理列表
 */
router.get('/product/goods', function (req, res, next) {
  var data = goods.data.concat([]);
  var page = req.query.page || 1;
  var total = data ? data.length : 0;
  data = _.chunk(data, 10)[page*1 - 1] || [];
  res.json({
    "status": "0",
    "data": data,
    "count": total
  });
});


/**
 * 获取获取商品类目
 */
router.post('/product/goods/category', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": GOODS_ATTRSKU.category,
    "status": "0"
  });
});

/**
 * 获得与商品类目关联的品牌、属性集及其SKU
 */
router.post('/product/goods/attrsku', function (req, res, next) {
  res.json({
    "data": {
      "sku": GOODS_ATTRSKU.sku,
      "brand": GOODS_ATTRSKU.brand,
      "attributeset": GOODS_ATTRSKU.attributeset
    },
    "status": "0"
  });
});

/**
 * 保存商品
 */
router.post('/product/goods/save', function (req, res, next) {
  console.log(req.query);
  res.json({
    "data": "",
    "status": "0"
  });
});
module.exports = router;

/**
 * 编辑商品
 */
router.post('/product/goods/edit', function (req, res, next) {
  console.log(req.query.skuid);

  var data = _.find(goods.data, {skuid: req.query.skuid});
  res.json({
    "data": {
      "abstracts": "专用于奥迪A4L后备箱垫 奥迪Q3 奥迪Q5 奥迪A6L 奥迪A3汽",
      "attrvalues": "1",
      "audit": "0",
      "benefitprice": 0,
      "brandid": 22,
      "cateid": 8,
      "catename": "维修保养",
      "cnname": "昆仑天润",
      "costprice": 0,
      "createtime": 1479225600000,
      "emsfee": 0,
      "expressfee": 0,
      "groupprice": 0,
      "guid": '798836069972865000',
      "integral": 0,
      "mailfee": 0,
      "mainphoto": "http://audit-oss-chebian.oss-cn-shenzhen.aliyuncs.com/1479292233802_CASE2",
      "officialprice": 0,
      "parentcatename": "机油",
      "parentid": 2,
      "productid": "798835425786482688",
      "productname": "测试王企鹅完全",
      "recommend": "0",
      "saleprice": 1,
      "skusalenum": 0,
      "motobrandids": '[{"brand":{"brand":"AC%20Schnitzer","firstletter":"A","id":1,"logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer","isChecked":false},"series":[{"id":1,"seriesid":1,"brandid":1,"brand":"AC%20Schnitzer","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%207%E7%B3%BB","series":"AC%20Schnitzer%207%E7%B3%BB","isChecked":true},{"id":2,"seriesid":2,"brandid":1,"brand":"AC%20Schnitzer","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X5","series":"AC%20Schnitzer%20X5","isChecked":true},{"id":3,"seriesid":3,"brandid":1,"brand":"AC%20Schnitzer","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X6","series":"AC%20Schnitzer%20X6","isChecked":false}],"year":[{"id":13,"brandid":1,"brand":"AC%20Schnitzer","firstletter":"A","seriesid":3,"series":"AC%20Schnitzer%20X6","year":"2013","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X6%202013","isChecked":true},{"id":14,"brandid":1,"brand":"AC%20Schnitzer","firstletter":"A","seriesid":3,"series":"AC%20Schnitzer%20X6","year":"2014","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X6%202014","isChecked":true},{"id":15,"brandid":1,"brand":"AC%20Schnitzer","firstletter":"A","seriesid":3,"series":"AC%20Schnitzer%20X6","year":"2015","logo":"http://localhost:9090/shopservice/public/logo/motor/A_AC-Schnitzer.png","title":"AC%20Schnitzer%20X6%202015","isChecked":true}]}]',
      "skuvalues": '[{"guid":0,"id":12,"items":[{"guid":0,"id":57,"skuid":12,"skuvalue":"汽机油","sort":1}],"skuname":"机油类别","skutype":"text","sort":0},{"guid":0,"id":13,"items":[{"guid":0,"id":63,"skuid":13,"skuvalue":"半合成机油","sort":2}],"skuname":"机油分类","skutype":"text","sort":0},{"guid":0,"id":14,"items":[{"guid":0,"id":69,"skuid":14,"skuvalue":"5W-30","sort":1}],"skuname":"机油粘度","skutype":"text","sort":0}]',
      "specialprice": 0,
      "stock": 2,
      "status": 1,
      "storeid": 1,
      "tradeprice": 0,
      "transid": 1,
      "transname": "中通快递",
      "unit": "升",
      "updatetime": 1479225600000
    },
    "status": "0"
  });
});


/**
 * 删除商品
 */
router.post('/product/goods/remove', function (req, res, next) {
  console.log(req.query.productid);
  _.remove(goods.data, {productid: req.query.productid});
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 调整价格
 */
router.post('/product/goods/price', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {skuid: req.query.skuid});
  goods.data[index].saleprice = req.query.saleprice;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品上架
 */
router.post('/product/goods/putup', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {skuid: req.query.skuid});
  goods.data[index].status = 1;
  res.json({
    "data": "",
    "status": "0"
  });
});

/**
 * 商品下架
 */
router.post('/product/goods/putdown', function (req, res, next) {
  console.log(req.query.productid);

  var index = _.findIndex(goods.data, {skuid: req.query.skuid});
  goods.data[index].status = 0;
  res.json({
    "data": "",
    "status": "0"
  });
});
module.exports = router;
