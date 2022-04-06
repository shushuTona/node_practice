const path = require('path');
const log4js = require('log4js');
const logFilePath = path.join(__dirname, '../server/log4js_setting.json');

// 設定ファイル読み込み
log4js.configure(logFilePath);

const logger = log4js.getLogger("server");

exports.logDebug = (message) => {
    logger.debug(message)
}
