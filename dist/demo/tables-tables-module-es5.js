function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tables-tables-module"], {
  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/tables/basic-tables/basic-tables.component.html":
  /*!*******************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/tables/basic-tables/basic-tables.component.html ***!
    \*******************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppTablesBasicTablesBasicTablesComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"az-content\">\n  <div class=\"container\">\n    <app-components-sidebar></app-components-sidebar>\n    <div class=\"az-content-body pd-lg-l-40 d-flex flex-column\">\n      <div class=\"az-content-breadcrumb\">\n        <span>Components</span>\n        <span>Tables</span>\n        <span>Basic Tables</span>\n      </div>\n      <h2 class=\"az-content-title\">Basic Tables</h2>\n\n      <div class=\"az-content-label mg-b-5\">Simple Table</div>\n      <p class=\"mg-b-20\">Using the most basic table markup.</p>\n\n      <div class=\"table-responsive\">\n        <table class=\"table mg-b-0\">\n          <thead>\n            <tr>\n              <th>ID</th>\n              <th>Name</th>\n              <th>Position</th>\n              <th>Salary</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <th scope=\"row\">1</th>\n              <td>Tiger Nixon</td>\n              <td>System Architect</td>\n              <td>$320,800</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">2</th>\n              <td>Garrett Winters</td>\n              <td>Accountant</td>\n              <td>$170,750</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">3</th>\n              <td>Ashton Cox</td>\n              <td>Junior Technical Author</td>\n              <td>$86,000</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">4</th>\n              <td>Cedric Kelly</td>\n              <td>Senior Javascript Developer</td>\n              <td>$433,060</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">5</th>\n              <td>Airi Satou</td>\n              <td>Accountant</td>\n              <td>$162,700</td>\n            </tr>\n          </tbody>\n        </table>\n      </div><!-- table-responsive -->\n\n      <hr class=\"mg-y-30\">\n\n      <div class=\"az-content-label mg-b-5\">Striped Rows</div>\n      <p class=\"mg-b-20\">Add zebra-striping to any table row.</p>\n\n      <div class=\"table-responsive\">\n        <table class=\"table table-striped mg-b-0\">\n          <thead>\n            <tr>\n              <th>ID</th>\n              <th>Name</th>\n              <th>Position</th>\n              <th>Salary</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <th scope=\"row\">1</th>\n              <td>Tiger Nixon</td>\n              <td>System Architect</td>\n              <td>$320,800</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">2</th>\n              <td>Garrett Winters</td>\n              <td>Accountant</td>\n              <td>$170,750</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">3</th>\n              <td>Ashton Cox</td>\n              <td>Junior Technical Author</td>\n              <td>$86,000</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">4</th>\n              <td>Cedric Kelly</td>\n              <td>Senior Javascript Developer</td>\n              <td>$433,060</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">5</th>\n              <td>Airi Satou</td>\n              <td>Accountant</td>\n              <td>$162,700</td>\n            </tr>\n          </tbody>\n        </table>\n      </div><!-- bd -->\n\n      <hr class=\"mg-y-30\">\n\n      <div class=\"az-content-label mg-b-5\">Bordered Table</div>\n      <p class=\"mg-b-20\">Add borders on all sides of the table and cells.</p>\n\n      <div class=\"table-responsive\">\n        <table class=\"table table-bordered mg-b-0\">\n          <thead>\n            <tr>\n              <th>ID</th>\n              <th>Name</th>\n              <th>Position</th>\n              <th>Salary</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <th scope=\"row\">1</th>\n              <td>Tiger Nixon</td>\n              <td>System Architect</td>\n              <td>$320,800</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">2</th>\n              <td>Garrett Winters</td>\n              <td>Accountant</td>\n              <td>$170,750</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">3</th>\n              <td>Ashton Cox</td>\n              <td>Junior Technical Author</td>\n              <td>$86,000</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">4</th>\n              <td>Cedric Kelly</td>\n              <td>Senior Javascript Developer</td>\n              <td>$433,060</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">5</th>\n              <td>Airi Satou</td>\n              <td>Accountant</td>\n              <td>$162,700</td>\n            </tr>\n          </tbody>\n        </table>\n      </div><!-- table-responsive -->\n\n      <hr class=\"mg-y-30\">\n\n      <div class=\"az-content-label mg-b-5\">Hoverable Rows Table</div>\n      <p class=\"mg-b-20\">To enable a hover state on table rows.</p>\n\n      <div class=\"table-responsive\">\n        <table class=\"table table-hover mg-b-0\">\n          <thead>\n            <tr>\n              <th>ID</th>\n              <th>Name</th>\n              <th>Position</th>\n              <th>Salary</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <th scope=\"row\">1</th>\n              <td>Tiger Nixon</td>\n              <td>System Architect</td>\n              <td>$320,800</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">2</th>\n              <td>Garrett Winters</td>\n              <td>Accountant</td>\n              <td>$170,750</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">3</th>\n              <td>Ashton Cox</td>\n              <td>Junior Technical Author</td>\n              <td>$86,000</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">4</th>\n              <td>Cedric Kelly</td>\n              <td>Senior Javascript Developer</td>\n              <td>$433,060</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">5</th>\n              <td>Airi Satou</td>\n              <td>Accountant</td>\n              <td>$162,700</td>\n            </tr>\n          </tbody>\n        </table>\n      </div><!-- table-responsive -->\n\n      <div class=\"ht-40\"></div>\n\n    </div><!-- az-content-body -->\n  </div><!-- container -->\n</div><!-- az-content -->";
    /***/
  },

  /***/
  "./src/app/tables/basic-tables/basic-tables.component.scss":
  /*!*****************************************************************!*\
    !*** ./src/app/tables/basic-tables/basic-tables.component.scss ***!
    \*****************************************************************/

  /*! exports provided: default */

  /***/
  function srcAppTablesBasicTablesBasicTablesComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RhYmxlcy9iYXNpYy10YWJsZXMvYmFzaWMtdGFibGVzLmNvbXBvbmVudC5zY3NzIn0= */";
    /***/
  },

  /***/
  "./src/app/tables/basic-tables/basic-tables.component.ts":
  /*!***************************************************************!*\
    !*** ./src/app/tables/basic-tables/basic-tables.component.ts ***!
    \***************************************************************/

  /*! exports provided: BasicTablesComponent */

  /***/
  function srcAppTablesBasicTablesBasicTablesComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "BasicTablesComponent", function () {
      return BasicTablesComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var BasicTablesComponent = /*#__PURE__*/function () {
      function BasicTablesComponent() {
        _classCallCheck(this, BasicTablesComponent);
      }

      _createClass(BasicTablesComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }]);

      return BasicTablesComponent;
    }();

    BasicTablesComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-basic-tables',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./basic-tables.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/tables/basic-tables/basic-tables.component.html"))["default"],
      styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! ./basic-tables.component.scss */
      "./src/app/tables/basic-tables/basic-tables.component.scss"))["default"]]
    })], BasicTablesComponent);
    /***/
  },

  /***/
  "./src/app/tables/tables.module.ts":
  /*!*****************************************!*\
    !*** ./src/app/tables/tables.module.ts ***!
    \*****************************************/

  /*! exports provided: TablesModule */

  /***/
  function srcAppTablesTablesModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TablesModule", function () {
      return TablesModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _basic_tables_basic_tables_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./basic-tables/basic-tables.component */
    "./src/app/tables/basic-tables/basic-tables.component.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../shared/shared.module */
    "./src/app/shared/shared.module.ts");
    /* harmony import */


    var angular_datatables__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! angular-datatables */
    "./node_modules/angular-datatables/__ivy_ngcc__/index.js");

    var routes = [{
      path: 'basic-tables',
      component: _basic_tables_basic_tables_component__WEBPACK_IMPORTED_MODULE_3__["BasicTablesComponent"]
    }];

    var TablesModule = function TablesModule() {
      _classCallCheck(this, TablesModule);
    };

    TablesModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      declarations: [_basic_tables_basic_tables_component__WEBPACK_IMPORTED_MODULE_3__["BasicTablesComponent"]],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild(routes), _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__["SharedModule"], angular_datatables__WEBPACK_IMPORTED_MODULE_6__["DataTablesModule"]]
    })], TablesModule);
    /***/
  }
}]);
//# sourceMappingURL=tables-tables-module-es5.js.map