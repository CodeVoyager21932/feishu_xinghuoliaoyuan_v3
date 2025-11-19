/**
 * 微信小程序 CI 自动上传脚本
 * 
 * 使用前需要：
 * 1. 安装依赖：npm install miniprogram-ci --save-dev
 * 2. 在微信公众平台获取上传密钥
 * 3. 配置 appid 和密钥路径
 */

const ci = require('miniprogram-ci');
const path = require('path');

// 配置信息
const config = {
  appid: 'your-appid-here',  // 替换为你的小程序 AppID
  privateKeyPath: path.join(__dirname, '../private.key'),  // 上传密钥路径
  projectPath: path.join(__dirname, '../miniprogram'),  // 项目路径
  version: '1.0.0',  // 版本号
  desc: '自动上传测试版本'  // 版本描述
};

async function upload() {
  console.log('========================================');
  console.log('开始上传小程序...');
  console.log('========================================');
  console.log('AppID:', config.appid);
  console.log('项目路径:', config.projectPath);
  console.log('版本号:', config.version);
  console.log('');

  try {
    // 创建项目实例
    const project = new ci.Project({
      appid: config.appid,
      type: 'miniProgram',
      projectPath: config.projectPath,
      privateKeyPath: config.privateKeyPath,
      ignores: ['node_modules/**/*']
    });

    // 上传代码
    const uploadResult = await ci.upload({
      project,
      version: config.version,
      desc: config.desc,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: false,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: (info) => {
        console.log('上传进度:', info);
      }
    });

    console.log('');
    console.log('========================================');
    console.log('上传成功！');
    console.log('========================================');
    console.log('上传结果:', uploadResult);

  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('上传失败！');
    console.error('========================================');
    console.error('错误信息:', error);
    process.exit(1);
  }
}

async function preview() {
  console.log('========================================');
  console.log('生成预览二维码...');
  console.log('========================================');

  try {
    const project = new ci.Project({
      appid: config.appid,
      type: 'miniProgram',
      projectPath: config.projectPath,
      privateKeyPath: config.privateKeyPath,
      ignores: ['node_modules/**/*']
    });

    const previewResult = await ci.preview({
      project,
      desc: '预览版本',
      setting: {
        es6: true,
        es7: true,
        minify: false
      },
      qrcodeFormat: 'terminal',  // 在终端显示二维码
      qrcodeOutputDest: path.join(__dirname, '../preview-qrcode.jpg'),
      onProgressUpdate: (info) => {
        console.log('生成进度:', info);
      }
    });

    console.log('');
    console.log('========================================');
    console.log('预览二维码生成成功！');
    console.log('========================================');
    console.log('二维码路径:', path.join(__dirname, '../preview-qrcode.jpg'));
    console.log('使用微信扫描二维码即可预览');

  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('生成预览失败！');
    console.error('========================================');
    console.error('错误信息:', error);
    process.exit(1);
  }
}

// 根据命令行参数执行不同操作
const command = process.argv[2];

if (command === 'upload') {
  upload();
} else if (command === 'preview') {
  preview();
} else {
  console.log('用法:');
  console.log('  node ci-upload.js upload   # 上传代码');
  console.log('  node ci-upload.js preview  # 生成预览二维码');
}
