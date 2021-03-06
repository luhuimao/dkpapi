/**
 * 描述: 初始化路由信息，自定义全局异常处理
 * 作者: Benjamin
 * 日期: 2021-08-30
*/

const express = require('express');
const { route } = require('./dkp');
const dkpRouter = require('./dkp'); // 引入dkp路由模块
const winRouter = require('./win'); // 引入win路由模块

const { jwtAuth, decode } = require('../utils/user-signed'); // 引入jwt认证函数
const router = express.Router(); // 注册路由 

router.use(decode); // 注入认证模块

router.use('/api/dkpool', dkpRouter); // 注入dkp路由模块
router.use('/api/win',winRouter)// 注入win路由模块
// 自定义统一异常处理中间件，需要放在代码最后
router.use((err, req, res, next) => {
  // 自定义用户认证失败的错误返回
  // console.log('err===', err);
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: 'token失效，请重新登录'
    })
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg = (output && output.payload && output.payload.error) || err.message;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg
    })
  }
})

module.exports = router;