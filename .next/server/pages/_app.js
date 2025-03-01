/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"@supabase/auth-helpers-nextjs\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/auth-helpers-react */ \"@supabase/auth-helpers-react\");\n/* harmony import */ var _supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _utils_healthCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/healthCheck */ \"./utils/healthCheck.ts\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [supabase] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(()=>(0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__.createClientComponentClient)());\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        // Ping a cada 5 minutos\n        const interval = setInterval(_utils_healthCheck__WEBPACK_IMPORTED_MODULE_4__.pingHealthCheck, 300000);\n        return ()=>clearInterval(interval);\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        // Debug para verificar caminhos das imagens\n        console.log(\"Verificando caminhos das imagens:\");\n        const images = [\n            \"/images/logo.png\",\n            \"/images/favicon.ico\",\n            \"/images/favicon-32x32.png\",\n            \"/images/favicon-16x16.png\",\n            \"/images/apple-touch-icon.png\"\n        ];\n        images.forEach((path)=>{\n            const img = new Image();\n            img.src = path;\n            img.onload = ()=>console.log(`✅ Imagem carregada: ${path}`);\n            img.onerror = ()=>console.error(`❌ Erro ao carregar: ${path}`);\n        });\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_2__.SessionContextProvider, {\n        supabaseClient: supabase,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_6___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"shortcut icon\",\n                        href: \"/images/favicon.ico\"\n                    }, void 0, false, {\n                        fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n                        lineNumber: 40,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        type: \"image/png\",\n                        sizes: \"32x32\",\n                        href: \"/images/favicon-32x32.png\"\n                    }, void 0, false, {\n                        fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n                        lineNumber: 41,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        type: \"image/png\",\n                        sizes: \"16x16\",\n                        href: \"/images/favicon-16x16.png\"\n                    }, void 0, false, {\n                        fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n                        lineNumber: 47,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Sistema Igreja\"\n                    }, void 0, false, {\n                        fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n                        lineNumber: 53,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n                lineNumber: 39,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n                lineNumber: 55,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"H:\\\\sistema_igreja\\\\sistema_igreja\\\\pages\\\\_app.tsx\",\n        lineNumber: 38,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBNEU7QUFDTjtBQUMxQjtBQUNXO0FBRXhCO0FBQ0Y7QUFFN0IsU0FBU00sTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUMvQyxNQUFNLENBQUNDLFNBQVMsR0FBR1AsK0NBQVFBLENBQUMsSUFBTUYsMEZBQTJCQTtJQUU3REcsZ0RBQVNBLENBQUM7UUFDUix3QkFBd0I7UUFDeEIsTUFBTU8sV0FBV0MsWUFBWVAsK0RBQWVBLEVBQUU7UUFDOUMsT0FBTyxJQUFNUSxjQUFjRjtJQUM3QixHQUFHLEVBQUU7SUFFTFAsZ0RBQVNBLENBQUM7UUFDUiw0Q0FBNEM7UUFDNUNVLFFBQVFDLEdBQUcsQ0FBQztRQUNaLE1BQU1DLFNBQVM7WUFDYjtZQUNBO1lBQ0E7WUFDQTtZQUNBO1NBQ0Q7UUFFREEsT0FBT0MsT0FBTyxDQUFDLENBQUNDO1lBQ2QsTUFBTUMsTUFBTSxJQUFJQztZQUNoQkQsSUFBSUUsR0FBRyxHQUFHSDtZQUNWQyxJQUFJRyxNQUFNLEdBQUcsSUFBTVIsUUFBUUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLEVBQUVHLEtBQUssQ0FBQztZQUM1REMsSUFBSUksT0FBTyxHQUFHLElBQU1ULFFBQVFVLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixFQUFFTixLQUFLLENBQUM7UUFDakU7SUFDRixHQUFHLEVBQUU7SUFFTCxxQkFDRSw4REFBQ2hCLGdGQUFzQkE7UUFBQ3VCLGdCQUFnQmY7OzBCQUN0Qyw4REFBQ0osa0RBQUlBOztrQ0FDSCw4REFBQ29CO3dCQUFLQyxLQUFJO3dCQUFnQkMsTUFBSzs7Ozs7O2tDQUMvQiw4REFBQ0Y7d0JBQ0NDLEtBQUk7d0JBQ0pFLE1BQUs7d0JBQ0xDLE9BQU07d0JBQ05GLE1BQUs7Ozs7OztrQ0FFUCw4REFBQ0Y7d0JBQ0NDLEtBQUk7d0JBQ0pFLE1BQUs7d0JBQ0xDLE9BQU07d0JBQ05GLE1BQUs7Ozs7OztrQ0FFUCw4REFBQ0c7a0NBQU07Ozs7Ozs7Ozs7OzswQkFFVCw4REFBQ3ZCO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lzdGVtYV9pZ3JlamEvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCB9IGZyb20gXCJAc3VwYWJhc2UvYXV0aC1oZWxwZXJzLW5leHRqc1wiO1xyXG5pbXBvcnQgeyBTZXNzaW9uQ29udGV4dFByb3ZpZGVyIH0gZnJvbSBcIkBzdXBhYmFzZS9hdXRoLWhlbHBlcnMtcmVhY3RcIjtcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBwaW5nSGVhbHRoQ2hlY2sgfSBmcm9tIFwiLi4vdXRpbHMvaGVhbHRoQ2hlY2tcIjtcclxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gXCJuZXh0L2FwcFwiO1xyXG5pbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcclxuaW1wb3J0IEhlYWQgZnJvbSBcIm5leHQvaGVhZFwiO1xyXG5cclxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIGNvbnN0IFtzdXBhYmFzZV0gPSB1c2VTdGF0ZSgoKSA9PiBjcmVhdGVDbGllbnRDb21wb25lbnRDbGllbnQoKSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAvLyBQaW5nIGEgY2FkYSA1IG1pbnV0b3NcclxuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwocGluZ0hlYWx0aENoZWNrLCAzMDAwMDApO1xyXG4gICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIERlYnVnIHBhcmEgdmVyaWZpY2FyIGNhbWluaG9zIGRhcyBpbWFnZW5zXHJcbiAgICBjb25zb2xlLmxvZyhcIlZlcmlmaWNhbmRvIGNhbWluaG9zIGRhcyBpbWFnZW5zOlwiKTtcclxuICAgIGNvbnN0IGltYWdlcyA9IFtcclxuICAgICAgXCIvaW1hZ2VzL2xvZ28ucG5nXCIsXHJcbiAgICAgIFwiL2ltYWdlcy9mYXZpY29uLmljb1wiLFxyXG4gICAgICBcIi9pbWFnZXMvZmF2aWNvbi0zMngzMi5wbmdcIixcclxuICAgICAgXCIvaW1hZ2VzL2Zhdmljb24tMTZ4MTYucG5nXCIsXHJcbiAgICAgIFwiL2ltYWdlcy9hcHBsZS10b3VjaC1pY29uLnBuZ1wiLFxyXG4gICAgXTtcclxuXHJcbiAgICBpbWFnZXMuZm9yRWFjaCgocGF0aCkgPT4ge1xyXG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgaW1nLnNyYyA9IHBhdGg7XHJcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiBjb25zb2xlLmxvZyhg4pyFIEltYWdlbSBjYXJyZWdhZGE6ICR7cGF0aH1gKTtcclxuICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiBjb25zb2xlLmVycm9yKGDinYwgRXJybyBhbyBjYXJyZWdhcjogJHtwYXRofWApO1xyXG4gICAgfSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPFNlc3Npb25Db250ZXh0UHJvdmlkZXIgc3VwYWJhc2VDbGllbnQ9e3N1cGFiYXNlfT5cclxuICAgICAgPEhlYWQ+XHJcbiAgICAgICAgPGxpbmsgcmVsPVwic2hvcnRjdXQgaWNvblwiIGhyZWY9XCIvaW1hZ2VzL2Zhdmljb24uaWNvXCIgLz5cclxuICAgICAgICA8bGlua1xyXG4gICAgICAgICAgcmVsPVwiaWNvblwiXHJcbiAgICAgICAgICB0eXBlPVwiaW1hZ2UvcG5nXCJcclxuICAgICAgICAgIHNpemVzPVwiMzJ4MzJcIlxyXG4gICAgICAgICAgaHJlZj1cIi9pbWFnZXMvZmF2aWNvbi0zMngzMi5wbmdcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGxpbmtcclxuICAgICAgICAgIHJlbD1cImljb25cIlxyXG4gICAgICAgICAgdHlwZT1cImltYWdlL3BuZ1wiXHJcbiAgICAgICAgICBzaXplcz1cIjE2eDE2XCJcclxuICAgICAgICAgIGhyZWY9XCIvaW1hZ2VzL2Zhdmljb24tMTZ4MTYucG5nXCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDx0aXRsZT5TaXN0ZW1hIElncmVqYTwvdGl0bGU+XHJcbiAgICAgIDwvSGVhZD5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9TZXNzaW9uQ29udGV4dFByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE15QXBwO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Q29tcG9uZW50Q2xpZW50IiwiU2Vzc2lvbkNvbnRleHRQcm92aWRlciIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwicGluZ0hlYWx0aENoZWNrIiwiSGVhZCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwic3VwYWJhc2UiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImNvbnNvbGUiLCJsb2ciLCJpbWFnZXMiLCJmb3JFYWNoIiwicGF0aCIsImltZyIsIkltYWdlIiwic3JjIiwib25sb2FkIiwib25lcnJvciIsImVycm9yIiwic3VwYWJhc2VDbGllbnQiLCJsaW5rIiwicmVsIiwiaHJlZiIsInR5cGUiLCJzaXplcyIsInRpdGxlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./utils/healthCheck.ts":
/*!******************************!*\
  !*** ./utils/healthCheck.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pingHealthCheck: () => (/* binding */ pingHealthCheck)\n/* harmony export */ });\nasync function pingHealthCheck() {\n    try {\n        const response = await fetch(\"/api/health\");\n        const data = await response.json();\n        console.log(\"Health check:\", data.status);\n    } catch (error) {\n        console.error(\"Health check failed:\", error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi91dGlscy9oZWFsdGhDaGVjay50cyIsIm1hcHBpbmdzIjoiOzs7O0FBQU8sZUFBZUE7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUMsTUFBTTtRQUM3QixNQUFNQyxPQUFPLE1BQU1GLFNBQVNHLElBQUk7UUFDaENDLFFBQVFDLEdBQUcsQ0FBQyxpQkFBaUJILEtBQUtJLE1BQU07SUFDMUMsRUFBRSxPQUFPQyxPQUFPO1FBQ2RILFFBQVFHLEtBQUssQ0FBQyx3QkFBd0JBO0lBQ3hDO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXN0ZW1hX2lncmVqYS8uL3V0aWxzL2hlYWx0aENoZWNrLnRzP2U2ODIiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBpbmdIZWFsdGhDaGVjaygpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvaGVhbHRoXCIpO1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGNvbnNvbGUubG9nKFwiSGVhbHRoIGNoZWNrOlwiLCBkYXRhLnN0YXR1cyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJIZWFsdGggY2hlY2sgZmFpbGVkOlwiLCBlcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJwaW5nSGVhbHRoQ2hlY2siLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YSIsImpzb24iLCJjb25zb2xlIiwibG9nIiwic3RhdHVzIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./utils/healthCheck.ts\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/auth-helpers-nextjs":
/*!************************************************!*\
  !*** external "@supabase/auth-helpers-nextjs" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/auth-helpers-nextjs");

/***/ }),

/***/ "@supabase/auth-helpers-react":
/*!***********************************************!*\
  !*** external "@supabase/auth-helpers-react" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/auth-helpers-react");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();