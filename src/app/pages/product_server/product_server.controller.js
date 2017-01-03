/**
 * Created by Administrator on 2016/10/15.
 */
(function() {
    'use strict';

    angular
        .module('shopApp')
        .controller('ProductServerListController', ProductServerListController)
        .controller('ProductServerAddGoodsController', ProductServerAddGoodsController)
        .controller('ProductServerChangeController', ProductServerChangeController);

    /** @ngInject */
    function ProductServerListController($state, $log, $timeout,  productServer, productServerConfig, cbAlert) {
      var vm = this;
      var currentState = $state.current;
      var currentStateName = currentState.name;
      var currentParams = angular.extend({}, $state.params, {pageSize: 5});
      var total = 0;
      /**
       * 记录当前子项
       * @type {string}
       */
      var recordChild = "";
      /**
       * 表格配置
       */
      vm.gridModel = {
        requestParams: {
          params: currentParams,
          request: "product,server,excelServer",
          permission: "chebian:store:product:goods:export"
        },
        columns: angular.copy(productServerConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(productServerConfig.DEFAULT_GRID.config),
        loadingState: true,      // 加载数据
        pageChanged: function (data) {    // 监听分页
          var page = angular.extend({}, currentParams, {page: data});
          $state.go(currentStateName, page);
        },
        sortChanged: function (data) {
          var orders = [];
          angular.forEach(data.data, function (item, key) {
            orders.push({
              "field": key,
              "direction": item
            });
          });
          var order = angular.extend({}, currentParams, {orders: JSON.stringify(orders)});
          vm.gridModel.requestParams.params = order;
          getList(order);
        },
        selectHandler: function (item) {
          // 拦截用户恶意点击
          recordChild != item.guid && getServerSkus(item.guid);
        }
      };

      /**
       * 组件数据交互
       *
       */
      vm.gridModel.config.propsParams = {
        currentStatus: currentParams.status,
        removeItem: function (data) {
          if (data.status == 0) {
            /**
             * 删除单页
             */
            var item = null;
            if(data.removal.length == 1){
              item = {
                serverid: data.removal[0].serverid
              }
            }
            productServer.removeServer(item).then(function (data) {
              if(data.data.status === '0'){
                cbAlert.tips("删除成功");
              }else{
                cbAlert.error(data.data.rtnInfo);
              }
              getList(currentParams);
            });
          }
          // if(data.list.length <= 5 && total > 10){
          //     vm.gridModel.loadingState = true;
          //     $timeout(function (){
          //         getList();
          //     }, 3000);
          // }
          //vm.gridModel.itemList = data.list;
        },
        statusItem: function (data) {
          if (data.status == 0) {
            var message = data.type === 'removeServers' ? "服务下架修改成功" : "服务上架修改成功";
            productServer[data.type](data.transmit).then(function (results) {
              if(results.data.status === '0'){
                cbAlert.tips(message);
              }else{
                cbAlert.error(results.data.data);
              }
              getList(currentParams);
            });
          }
        }
      };

      /**
       * 搜索操作
       *
       */
      vm.searchModel = {
        'config': {
          placeholder: "请输入服务编码、服务名称、服务属性",
          searchDirective: [
            {
              label: "服务类目",
              all: true,
              list: [
                {
                  id: 0,
                  label: "汽车内饰"
                },
                {
                  id: 1,
                  label: "电子导航"
                },
                {
                  id: 2,
                  label: "轮胎"
                },
                {
                  id: 3,
                  label: "保养配件"
                },
                {
                  id: 4,
                  label: "工具"
                }
              ],
              type: "list",
              name: "pcateid1"
            },
            {
              label: "销量",
              name: "salenums",
              all: true,
              custom: true,
              type: "int",
              start: {
                name: "salenums0"
              },
              end: {
                name: "salenums1"
              }
            },
            {
              label: "库存",
              all: true,
              custom: true,
              type: "int",
              name: "stock",
              start: {
                name: "stock0",
                placeholder: ""
              },
              end: {
                name: "stock1",
                placeholder: ""
              }
            },
            {
              label: "价格",
              all: true,
              custom: true,
              type: "money",
              name: "saleprice",
              start: {
                name: "saleprice0",
                placeholder: ""
              },
              end: {
                name: "saleprice1",
                placeholder: ""
              }
            },
            {
              label: "保质期",
              all: true,
              custom: true,
              type: "int",
              name: "shelflife",
              start: {
                name: "shelflife0",
                placeholder: ""
              },
              end: {
                name: "shelflife1",
                placeholder: ""
              }
            }
          ]
        },
        'handler': function (data) {
          $log.debug(data)
        }
      };


      function getServerSkus(id) {
        productServer.getServerSkus({id: id}).then(function (results) {
          if (results.data.status == 0) {
            recordChild = id;
            vm.items = results.data.data;
          } else {
            cbAlert.error(results.data.data);
          }
        });
      }

      /**
       * 表格配置
       */
      vm.gridModel2 = {
        editorhandler: function (data, item, type) {
          console.log(data, item);
          item[type] = data;
          productServer.updateServerSku(angular.copy(item)).then(function (results) {
            console.log(results);
            if (results.data.status == '0') {
              cbAlert.tips('修改成功');
              getList(currentParams);
            } else {
              cbAlert.error(results.data.data);
            }
          });
        },
        statusItem: function (item) {
          console.log(JSON.stringify(item));
          var tips = item.status === "0" ? '是否确认启用该服务SKU？' : '是否确认禁用该服务SKU？';
          cbAlert.ajax(tips, function (isConfirm) {
            if (isConfirm) {
              item.status = item.status === "0" ? "1" : "0";
              productServer.updateServerSku(item).then(function (results) {
                if (results.data.status == '0') {
                  cbAlert.success('修改成功');
                  var statusTime = $timeout(function(){
                    cbAlert.close();
                    $timeout.cancel(statusTime);
                    statusTime = null;
                  }, 1200, false);
                  getList(currentParams);
                } else {
                  cbAlert.error(results.data.data);
                }
              });
            } else {
              cbAlert.close();
            }
          }, "", 'warning');
        }
      };

      // 获取服务列表
      function getList(params) {
        /**
         * 路由分页跳转重定向有几次跳转，先把空的选项过滤
         */
        if (!params.page) {
          return;
        }
        productServer.list(params).then(function (data) {
          if (data.data.status == 0) {
            if (!data.data.data.length && params.page != 1) {
              $state.go(params, {page: 1});
            }
            total = data.data.totalCount;
            vm.gridModel.itemList = [];
            angular.forEach(data.data.data, function (item) {
              vm.gridModel.itemList.push(item);
            });
            console.log(vm.gridModel.itemList);

            vm.gridModel.paginationinfo = {
              page: params.page * 1,
              pageSize: params.pageSize,
              total: total
            };
            vm.gridModel.loadingState = false;
            !vm.gridModel.itemList.length && (vm.items = undefined);
            vm.gridModel.itemList[0] && getServerSkus(vm.gridModel.itemList[0].guid);
          }
        });
      }
      getList(currentParams);
    }

    /** @ngInject */
    function ProductServerChangeController($state, $log, $window, categoryServer, productServer, productServerAddGoods, productServerChangeConfig,preferencenav, cbAlert) {
      var vm = this;
      var currentParams = $state.params;
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      /**
       * 清除报价添加
       */
      productServerAddGoods.remove();
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      $log.debug('isChange', vm.isChange);
      categoryServer.storeserver().then(function (data) {
        angular.forEach(data.data.data, function(item){
          vm.selectModel.store.push(item);
        });
      });
      /**
       * 基本信息数据
       * @type {{}}
       * 保存数据有规格， 服务状态，商品简介
       */
      var diffData = null;

      /**
       * 验证基本信息是否修改
       * 1，如果修改 需要提交数据给后台
       * 2，如果没有修改，什么都不需要做
       * @param newData
       * @param oldData
       */
      function compareDiff(newData, oldData){
        if(oldData.serverstatus != newData.serverstatus || oldData.abstracts != newData.abstracts){
          productServer.saveServer(getDataBase(newData)).then(function(results){});
        }
      }
      /**
       * 基本信息数据
       * @type {{}}
       */
      vm.dataBase = {

      };





      /**
       * 报价表格配置
       */
      vm.gridModel = {
        columns: angular.copy(productServerChangeConfig.DEFAULT_GRID.columns),
        itemList: [],
        config: angular.copy(productServerChangeConfig.DEFAULT_GRID.config),
        loadingState: vm.isChange,      // 加载数据
        pageChanged: function (data) {    // 监听分页
          //var page = angular.extend({}, currentParams, {page: data});
          //$state.go(currentStateName, page);
        }
      };

      /**
       * 组件数据交互
       *
       */
      vm.gridModel.config.propsParams = {
        serverid: "",
        removeItem: function (data) {
          if (data.status == '0') {
            /**
             * 删除单页
             */
            var item = null;
            if(data.removal.length == 1){
              item = {
                offerid: data.removal[0].offerid
              }
            }
            if(vm.gridModel.itemList.length === 1){
              cbAlert.tips('至少要有一条报价规格');
              return ;
            }
            productServer.removeOfferprice(item).then(function (results) {
              console.log('saveOfferprice', results);
              if(results.data.status == 0) {
                cbAlert.tips('删除成功');
                /**
                 * 修改某一项
                 */
                getOfferpriceList();
              }
            });
          }
        },
        addItem: function (data) {
          if(data.status == '1'){
            cbAlert.alert(data.data);
          }
          if (data.status == '0') {
            console.log(data.data);
            productServer.saveOfferprice(data.data).then(function (results) {
              console.log('saveOfferprice', results);
              if(results.data.status == 0) {
                getOfferpriceList();
                //vm.gridModel.itemList.push(getOfferprice(results.data.data));
              }
            });
          }
        },
        statusItem: function (data) {
          $log.debug('statusItem', data);
          if (data.status == '0') {
            var item = null;
            if(data.removal.length == 1){
              item = {
                offerid: data.removal[0].offerid
              }
            }
            productServer[data.type](item).then(function (data) {
              getOfferpriceList();
            }, function (data) {
              $log.debug('statusItem', data);
            });
          }
        },
        goAddGoods: function (item) {
          var data = {
            'serverid': item.serverid,
            'offerid': item.offerid,
            'edit': angular.isUndefined(item.pskuids) ? "0" : "1"
          };
          compareDiff(vm.dataBase, diffData);
          productServerAddGoods.set(data);
          $state.go('product.server.addGoods' ,data);
        }
      };
      /**
       * 是否是添加服务
       * 来分步保存数据
       * @type {boolean}
       */
      vm.isAddData = !vm.isChange;
      if (vm.isChange) {
        productServer.edit(currentParams).then(function (results) {
          var edit = results.data.data;
          diffData = angular.extend({}, edit.server);
          vm.dataBase = setDataBase(edit);
          vm.isLoadData = true;
          vm.gridModel.config.propsParams.serverid = edit.server.serverid;
          /*getAttrsku(edit.server.scateid2, function(data){

           console.log(diffData , vm.dataBase);
           vm.isAttributesetLoad = true;

           console.log(data);
           });*/
        });
      } else {
        vm.isLoadData = true;
        vm.dataBase.serverstatus = 1;
        vm.dataBase.mainphoto = [];
        vm.dataBase.items = [

        ];
      }

      function setSkuvalues(obj){
        return {

        }
      }


      vm.addSkuvalues = function(){
        vm.dataBase.items = [];
      }

      function getOfferpriceList(){
        productServer.edit({serverid: vm.gridModel.config.propsParams.serverid}).then(function (results) {
          var data = [];
          angular.forEach(results.data.data.offerList, function (item) {
            data.push(getOfferprice(item));
          });
          vm.gridModel.itemList = data;
          diffData = angular.extend({}, results.data.data.server);
        });
      }

      /**
       * 格式化报价数据，
       * 因为撤了品牌是一个字符串数组，需要先解码在转换成数组
       * @param data
       * @returns {{}}
       */
      function getOfferprice(data){
        var result = {};
        angular.forEach(data, function (item, key) {
          if(key === 'motorbrandids' && angular.isString(item)){
            result[key] = $window.eval(decodeURI(item));
          }else{
            result[key] = item;
          }
        });
        return result;
      }


      /**
       * 保存基本信息到服务器
       */
      vm.save = function(){
        /*if(!vm.sizeModel.data.length){
          cbAlert.alert('您要至少选择一项规格');
          return ;
        }
        if(!vm.sizeModel.every){
          cbAlert.alert('规格对应的值没有选择');
          return ;
        }*/
        productServer.saveServer(getDataBase(vm.dataBase)).then(function (data) {
          console.log('saveServer', data);
          if(data.data.status == 0) {
            /**
             * 返回新增服务id，供添加报价使用
             */
            vm.gridModel.config.propsParams.serverid = data.data.data;
            vm.isAddData = false;
          }else{
            cbAlert.error(data.data.rtnInfo);
          }
        });
      };



      /**
       * 格式化 vm.dataBase数据供提交使用
       * @param data
       * @returns {{}}
       */
      function getDataBase(data) {
        var result = angular.extend({}, data);
        result.abstracts = encodeURI(result.abstracts);
       /* angular.forEach(result.sku, function (item) {
          item.skuname = encodeURI(item.skuname);
          item.items[0].skuvalue = encodeURI(item.items[0].skuvalue);
        });*/
        /**
         * 防止后台数据出bug
         */
        /*result.sku.push({});*/
        /**
         * 防止后台数据出bug
         */
        if(vm.isChange){
          delete result.parentid;
          delete result.brandname;
          delete result.productcategory;
        }
        return result;
      }

      vm.selectModel = {
        store: [],
        handler: function (data) {
          console.log('selectModel', data);
          setTwoCategorie(data);
          vm.isAttributesetLoad = false;
        }
      };
      vm.selectModel2 = {
        store: [],
        handler: function (data) {
          console.log('selectModel2', data);
          console.log(getData(vm.selectModel2.store, data));
          //vm.dataBase.cateid = data;
          getAttrsku(data);
        }
      };
      vm.sizeModel = {
        store: [],
        data: [],
        every: undefined,
        handler: function (data) {
          console.log('sizeModel', data);
          this.every = data.every;
          this.data = data.data;
        }
      };
      /**
       * 在数组里面根据value参数获取数组中对应的数据
       * @param arr      数据
       * @param id       查询id
       * @param value    比较的字段 默认id
       */
      var getData = function (arr, id, value) {
        value = value || 'id';
        return _.find(arr, function (item) {
          return item[value] == id;
        });
      };
      function setTwoCategorie(id){
        if (!!getData(vm.selectModel.store, id)) {
          vm.selectModel2.store = getData(vm.selectModel.store, id).items;
        } else {
          vm.selectModel2.store = [];
        }
        console.log(vm.selectModel2.store);
      }
      function getAttrsku(id, callback){
        console.log(id);
        productServer.attrsku({id: id}).then(function (data) {
          /*vm.sizeModel.store = angular.copy(data.data.data.sku);
          vm.dataBase.attrvalues = data.data.data.attributeset[0].id;*/
          console.log(data);

          if(!callback){
            vm.isAttributesetLoad = true;
          }
          callback && callback(data.data.data);
        });
      }

      /**
       * 获取编辑数据，生成vm.dataBase数据格式
       * @param data
       * @returns {{}}
       */
      function setDataBase(data) {
        var result = angular.extend({}, data), results = {};
        results = result.server;
        results.serverstatus = result.server.status;
        results.sku = result.skuList;
        angular.forEach(result.offerList, function (item) {
          vm.gridModel.itemList.push(getOfferprice(item));
        });
        vm.gridModel.loadingState = false;
        //setTwoCategorie(result.parentid, result.cateid, result.unit);
        return results;
      }

      /**
       * 表单提交
       */
      vm.submit = function () {
        if(!vm.gridModel.itemList.length){
          cbAlert.tips('至少要有一条报价规格');
          return ;
        }
        compareDiff(vm.dataBase, diffData);
        goto();
      };
      function goto() {
        preferencenav.removePreference($state.current);
        $state.go('product.server.list', {'page': 1});
      }

    }

    /** @ngInject */
    function ProductServerAddGoodsController($state, $filter, $log, utils, productServer, categoryGoods, productServerAddGoods, productServerChangeConfig,preferencenav, cbAlert) {
      var vm = this;
      var currentParams = $state.params;
      //verificationURL();
      vm.attributeset = [];
      vm.isLoadData = false;
      vm.isAttributesetLoad = false;
      vm.items = [];
      //  是否是编辑
      vm.isChange = !_.isEmpty(currentParams);
      $log.debug('isChange', vm.isChange);
      console.log('productServerAddGoods', productServerAddGoods.get());
      var dataLists = [];
      var searchData = undefined;
      var currentPage = 1;
      /**
       * 效验URL是不是对的，
       * 如果是错的，就直接返回到列表
       */
      function verificationURL(){
        var regular = /^\d{18}$/;
        /**
         * 如果刷新页面，只能靠当前url来检查了，
         */
        if(_.isEmpty(productServerAddGoods.get())){
          if(!(currentParams.serverid && regular.test(currentParams.serverid))){
            goto();
          }
          if(!(currentParams.offerid && regular.test(currentParams.offerid))){
            goto();
          }
          if(!(currentParams.edit && (currentParams.edit == 0 || currentParams.edit == 1))){
            goto();
          }
        }else{
          if(!angular.equals(currentParams, productServerAddGoods.get())){
            goto();
          }
        }
      }

      categoryGoods.goods().then(function (data) {
        vm.selectModel.search1.store = data.data.data;
      });

      /**
      * 搜索配置
      */
      vm.selectModel = {
        search1: {
          handler: function (data) {
            if(angular.isObject(utils.getData(this.store, data))){
              vm.selectModel.search2.store = utils.getData(this.store, data).items;
            }else{
              vm.selectModel.search2.store = [];
            }
          }
        },
        search2: {},
        searchText: "",
        searchHandler: function () {
          searchData = {
            "pcateid1": this.search1.select,
            "pcateid2": this.search2.select,
            "productname": this.searchText
          };
          getList(currentPage, searchData);
        },
        resetHandler: function(){
          searchData = undefined;
          this.search1.select = undefined;
          this.search2.select = undefined;
          this.searchText = undefined;
          this.search2.store = [];
          getList(currentPage, searchData);
        }
      };

      /**
      * 表格配置
      */
      vm.gridModel = {
        columns: angular.copy(productServerChangeConfig.DEFAULT_GRID_GOODS.columns),
        itemList: [],
        config: angular.copy(productServerChangeConfig.DEFAULT_GRID_GOODS.config),
        loadingState: true,      // 加载数据
        pageChanged: function (page) {    // 监听分页
          currentPage = page;
          getList(currentPage, searchData);
        }
      };

      /**
      * 组件数据交互
      */
      vm.gridModel.config.propsParams = {
        addItem: function (data) {
          if(!data){
            return ;
          }
          if(!!_.find(vm.items, {pskuid: data.pskuid})){
            return ;
          }
          var item = _.remove(dataLists, {pskuid: data.pskuid});
          if(item.length){
            item[0].numbers = 1;
            item[0].subtotal = item[0].saleprice;
            console.log(item);
            vm.items.push(item[0]);
            getTotalprice();
            getList(currentPage, searchData);
          }
        }
      };

      /**
       * 第一次添加
       */
      if(currentParams.edit === "0") {
        productServer.allpskulist().then(function (data) {
          dataLists = data.data.data;
          getList(1);
          vm.gridModel.loadingState = false;
        });
      }
      /**
       * 编辑效果
       */
      if(currentParams.edit === "1"){
        productServer.pskulist({offerid: currentParams.offerid}).then(function(data){
          vm.items = angular.copy(data.data.data.pskulist);
          angular.forEach(vm.items, function (item) {
            vm.compute(item);
          });
          dataLists = filterData(data.data.data.allpskulist, data.data.data.pskulist, "pskuid");
          getList(1);
          vm.gridModel.loadingState = false;
        })
      }

      /**
       * 格式化显示数据
       * 依赖_.remove方法
       * @param all     全部数据
       * @param list    已经选中的数据
       * @return {[]}   返回数组 格式化数据
       */
      function filterData(all, list, id){
        /**
         * 强制让all和list变成数组形式，如果不是数组直接返回空数组
         */
        if(!angular.isArray(all) || !angular.isArray(list)){
          return [];
        }
        /**
         * 如果all和list长度一样，表示list已经把all全部选择，返回空数组
         */
        if(all.length === list.length){
          return [];
        }
        /**
         * 如果没有填id，就动态赋值一个id
         * @type {*}
         */
        id = id || "id";
        /**
         * 拷贝数组，防止对原数组进行操作
         */
        all = all.concat([]);
        /**
         * 循环list，用list的item去删除all里面对应的item
         */
        angular.forEach(list, function (key) {
          _.remove(all, function(value){
            return value[id] === key[id];
          });
        });
        return all;
      }

      /**
       * 获取所有列表，本地分页，和过滤
       */
      function getList(page, search){
        if(angular.isUndefined(search)){
          vm.gridModel.itemList = _.chunk(dataLists, 10)[page - 1] || [];
          console.log(vm.gridModel.itemList);
          vm.gridModel.paginationinfo = {
            page: page,
            pageSize: 10,
            total: dataLists.length
          };
        }else{
          //console.log(search, $filter('filter')(dataLists, search), dataLists);
          var results = $filter('filter')(dataLists, search);
          vm.gridModel.itemList = _.chunk(results, 10)[page - 1] || [];
          vm.gridModel.paginationinfo = {
            page: page,
            pageSize: 10,
            total: results.length
          };
        }
      }

      vm.remove = function (data) {
        dataLists.push(_.remove(vm.items, {pskuid: data.pskuid})[0]);
        getList(currentPage, searchData);
        getTotalprice();
      };
      /**
      * 失去焦点，计算小计
      * @param index
      * @param item
      */
      vm.compute = function (item) {
        item.subtotal = item.saleprice * 100 * item.numbers / 100;
        getTotalprice();
      };

      /**
      * 计算商品总计
      */
      function getTotalprice(){
        var price = 0;
        angular.forEach(vm.items, function (item) {
          price += item.subtotal;
        });
        vm.totalprice = price;
      }
      /**
      * 初始化获取商品总计
      */
      getTotalprice();

      /**
       * 格式化数据
       */
      function getDataBase(){
        var result = {
          serverid: currentParams.serverid,
          offerid: currentParams.offerid,
          productcost: vm.totalprice,
          psku: [],
          clear: 0
        };
        angular.forEach(vm.items, function(item){
          result.psku.push({
            pskuid: item.pskuid,
            numbers: item.numbers
          });
        });
        result.clear = vm.items.length === 0 ? 1 : 0;
        result.psku.push({});
        return result;
      }
      /**
       * 表单提交
       */
      vm.goBack = function (save) {
        if(save){
          productServer.saveProduct(getDataBase()).then(function (data) {
            console.log('save', data);
            if(data.data.status == 0){
              preferencenav.removePreference($state.current);
              $state.go('product.server.edit', {'serverid': currentParams.serverid});
            }
          });
        }else{
          preferencenav.removePreference($state.current);
          $state.go('product.server.edit', {'serverid': currentParams.serverid});
        }
      };

      function goto() {
        preferencenav.removePreference($state.current);
        $state.go('product.server.list', {'page': 1});
      }

    }
})();
