模板fork from https://github.com/PanJiaChen/vue-element-admin

## 安装依赖
npm install --registry=https://registry.npm.taobao.org

## 启动服务（对应config/dev.env.js环境）
npm run dev

## 打包(对应config/prod.env.js)
npm run build:prod

## 放入ui-server里
打包完成后，将dist文件夹里的所有文件copy至ui-server/src/main/resources/public文件夹内即可