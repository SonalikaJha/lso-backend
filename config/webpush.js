const webpush = require('web-push');

webpush.setVapidDetails('mailto:sonalika.jha@kritivity.com', process.env.VAPID_PUBLICKEY || '', process.env.VAPID_PRIVATEKEY || '');

module.exports = webpush;

