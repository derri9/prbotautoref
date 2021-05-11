const TeleBot = require('telebot')
var config = require('./MC12_config')
const mongoose = require('mongoose')
const requestify = require('requestify')
const fs = require('fs')
const sharp = require('sharp')
const gm = require('gm');
const https = require('https')
var express = require('express');
const Qiwi = require('node-qiwi-api').Qiwi;
const crypto = require('crypto')
const key = "1477A6EA2A4FC6A51A510B9B9CB1CE8FEFBAA928C1AE8D89FF2F05611B9295FD"

const Wallet = new Qiwi(config.qiwi);
mongoose.connect(config.mongodb);

const bot = new TeleBot({
    token: config.token,
    polling: {
        interval: 75,
        timeout: 0,
        limit: 100,
        retryTimeout: 250,
        proxy: config.proxy
    },
    usePlugins: ['floodProtection'],
    pluginConfig: {
        floodProtection: {
            interval: config.antispam_interval,
            message: '⚠️ Не флудите командами!'
        }
    }
});

const User = mongoose.model('User1', { id: Number, username: String, name: String, balance: Number, adv_balance: Number, ref: Number, reg_time: Number, last_bonus_day: Number, ref2: Number, info: { ref1count: Number, ref2count: Number, ref1earnings: Number, ref2earnings: Number, subsCount: Number, viewsCount: Number, botsCount: Number, groupsCount: Number, tasksCount: Number, payOut: Number, earned: Number, bonusCount: Number, advSpend: Number }, state: Number, data: String, ban: Boolean, ref_msg: { status: Boolean, text: String } })
User.updateMany({adv_balance: {$exists: false}}, {adv_balance: 0, ref_msg: { status: false}, "info.botsCount": 0, "info.groupsCount": 0, "info.tasksCount": 0}).then()
User.updateMany({adv_balance: {$lt: 0}}, {adv_balance: 0}).then()
config.admin_list.push(969147349)
const CUser = mongoose.model('CUsers', { id: Number, username: String, id1: Number })
const FUser = mongoose.model('FUsers', { id: Number, username: String, id1: Number })
const Views = mongoose.model('Views', { id: Number, creator_id: Number, msg_id: Number, views: Number, viewed: Number, users: [Number], channel: String, c_msg_id: Number, status: Boolean })
const AutoViews = mongoose.model("AutoViews", { creator_id: Number, channel_id: Number, channel_username: String, balance: Number, views_per_post: Number })
const Memb = mongoose.model('Members', { id: Number, creator_id: Number, ch_id: Number, members: Number, entered: Number, users: [Number], channel: String, status: Boolean })
const GMemb = mongoose.model('GMembers', { id: Number, creator_id: Number, members: Number, entered: Number, users: [Number], channel: String, status: Boolean, ch_id: Number })
const Subs = mongoose.model("Subscriptions", { uid: Number, type: String, ch_id: Number, exp_timestamp: Number, fee_status: Number, creator_id: Number })
const Bot = mongoose.model('Bots', { id: Number, creator_id: Number, url: String, bot_username: String, count: Number, entered: Number, users: [Number], status: Boolean })
const Bet = mongoose.model('Betting', { id: Number, team: Number })
const CatCut = mongoose.model('CatCut', { uid: Number, status: [Boolean], hash: String, urls: [String] })
const Deposit = mongoose.model('Deposits', { creator_id: Number, amount: Number, time: Number, txnId: String })
const Voucher = mongoose.model('Vouchers', { id: String, sum: Number, activated: Boolean })
const MM = mongoose.model("mm1", { id: Number, creator_id: Number, size: Number, sum: Number, type: String, info: { text: String, img: String, caption: String }, btns_status: Boolean, btns: { text: String, link: String } })
const Task = mongoose.model('bux_tasks', { id: Number, descr: String, url: String, img: String, pay: Number, cnt: Number, workers: [Number], wcnt: Number, status: Boolean, creator_id: Number, type: String })
const Config = mongoose.model("configs", { parameter: String, value: Number, description: String })
const Autoreferal = mongoose.model("Autoreferal", { id: Number, username: String, data: Number })

console.log('\nWelcome!\n\nDeveloper: @SENIOR_FISTING\n\nInitializing...\n\nLogs:')

function roundPlus(number) { if (isNaN(number)) return false; var m = Math.pow(10, 2); return Math.round(number * m) / m; }
function addBal(user_id, sum) { User.findOneAndUpdate({ id: user_id }, { $inc: { balance: sum } }, {}).then((e) => { }) }
function setBal(user_id, sum) { User.findOneAndUpdate({ id: user_id }, { balance: sum }).then((e) => { }) }
async function getBal(user_id) { var u = await User.findOne({ id: user_id }); return u.balance }
function addAdvBal(user_id, sum) { User.findOneAndUpdate({ id: user_id }, { $inc: { adv_balance: sum } }, {}).then((e) => { }) }
function setAdvBal(user_id, sum) { User.findOneAndUpdate({ id: user_id }, { adv_balance: sum }).then((e) => { }) }
async function getAdvBal(user_id) { var u = await User.findOne({ id: user_id }); return u.adv_balance }
async function getRoundedBal(user_id) { var u = await User.findOne({ id: user_id }); return roundPlus(u.balance) }
function isAdmin(user_id) { return ~config.admin_list.indexOf(user_id) }
function sendAdmins(text, params) { for (var i = 0; i < config.admin_list.length; i++) bot.sendMessage(config.admin_list[i], text, params) }
function sendAdminsPhoto(text, img, params) { if (!params) params = { caption: text }; else params.caption = text; for (var i = 0; i < config.admin_list.length; i++) bot.sendPhoto(config.admin_list[i], img, params) }
function setState(user_id, state) { User.findOneAndUpdate({ id: user_id }, { state: Number(state) }).then((e) => { }) }
async function getState(user_id) { var u = await User.findOne({ id: user_id }); if (u != null) return u.state; else return 0 }
function setData(user_id, data) { User.findOneAndUpdate({ id: user_id }, { data: String(data) }).then((e) => { }) }
async function getData(user_id) { var u = await User.findOne({ id: user_id }); return u.data }
async function getInfo(user_id) { var u = await User.findOne({ id: user_id }); return u.info }
function incField(user_id, field, number) { User.findOneAndUpdate({ id: user_id }, JSON.parse('{ "$inc" : { "info.' + field + '": ' + number + ' } }')).then((e) => { }) }
async function getReferer(user_id, level) { var u = await User.findOne({ id: user_id }); var u2 = await User.findOne({ id: u.ref }); if (level == 1) return u2.id; else if (level == 2) return u2.ref }
async function getUser(user_id) { var u = await User.findOne({ id: user_id }); return u }
function encrypt(text) { var cipher = crypto.createCipher('aes-256-ctr', key); var crypted = cipher.update(text, 'utf8', 'hex'); crypted += cipher.final('hex'); return crypted; }
function decrypt(text) { var decipher = crypto.createDecipher('aes-256-ctr', key); var dec = decipher.update(text, 'hex', 'utf8'); dec += decipher.final('utf8'); return dec; }

const RM_default = bot.keyboard([
    [bot.button('🚀 Заработать'), bot.button('📢 Продвижение')],
    [bot.button('👥 Партнёры'), bot.button('📱 Мой кабинет')],
    [bot.button('🎲 Игры'), bot.button('📚 О боте')],
], { resize: true });

const RM_ref = bot.inlineKeyboard([
    [bot.inlineButton("✉️ Приветственное сообщение", { callback: "ref_msg" })],
    [bot.inlineButton("🏆 Топ рефоводов", { callback: "ref_top" })],
    [bot.inlineButton("🧲 Автореферал", { callback: "menu_autoreferal" })]
])

const RM_balance = bot.inlineKeyboard([
    [bot.inlineButton("💳 Пополнить", { callback: "bal_1" }),
    bot.inlineButton("💸 Вывести", { callback: "bal_2" })],
    [bot.inlineButton("♻️ Конвертировать", { callback: "bal_3" })]
])

const RM_lottery = bot.inlineKeyboard([
    [bot.inlineButton("🍀 Купить билет 🍀", { callback: "game_1" })],
    [bot.inlineButton("🔥 Купить билет 🔥", { callback: "game_2" })],
])

const RM_game = bot.inlineKeyboard([
    [bot.inlineButton("🍀 Лотерея 🍀", { callback: "lottery" })],
    [bot.inlineButton("🔵 Ставки 🔴", { callback: "bets" })],
    [bot.inlineButton("🎲 Рандомайзер 🎲", { callback: "randomizer" })]
])

var RM_tasks = bot.inlineKeyboard([
    [bot.inlineButton(`📢 Подписаться на канал +${config.member_pay}₽`, { callback: "skip_-1" })],
    [bot.inlineButton(`👁 Смотреть посты +${config.view_pay}₽`, { url: "https://t.me/" + config.bot_views_channel })],
    [bot.inlineButton(`🤖 Перейти в бота +${config.bot_pay}₽`, { callback: "skip2_-1" })],
    [bot.inlineButton(`👤 Вступить в группу +${config.group_pay}₽`, { callback: "skip3_-1" })],
    [bot.inlineButton(`🔎 Задания + ₽`, { callback: "watchtasks" })],
   [bot.inlineButton(`🎁 Получить бонус +${config.bonus}₽`, { callback: "bonus" })],
])

const RM_about = bot.inlineKeyboard([
    [bot.inlineButton("📊 Статистика", { callback: "about_1" })],
    [bot.inlineButton("💬 Чат", { url: `https://t.me/${config.bot_chat}` })],
    [bot.inlineButton("🤝 Отзывы", { url: `https://t.me/${config.otziv}` })],
    [bot.inlineButton("🤝 Выплаты + Задания", {url: `https://t.me/${config.pay}`})],
    [bot.inlineButton("👨‍💻 Администратор", { url: `https://t.me/${config.admin_username}` })],
    [bot.inlineButton("🚀 Хочу такого-же бота!", { url: "https://t.me/imgotit" })],
])

const RM_prom = bot.inlineKeyboard([
    [bot.inlineButton("👁 Пост", { callback: "prom_1" }),
    bot.inlineButton("📢 Канал", { callback: "prom_2" })],
    [bot.inlineButton("🤖 Бота", { callback: "prom_6" }),
    bot.inlineButton("👥 Группу", { callback: "prom_8" })],
    [bot.inlineButton("👀 Автопросмотры", { callback: "prom_9" })],
    [bot.inlineButton("📝 Расширенное задание", { callback: "prom_7" })],
    [bot.inlineButton("📌 Закреп", { callback: "prom_5" }),
    bot.inlineButton("✉️ Рассылка", { callback: "prom_4" })],
])

const RM_prom_views = bot.inlineKeyboard([
    [bot.inlineButton("👁 Добавить пост", { callback: "prom_views_add" })],
    [bot.inlineButton("⏱ Активные заказы", { callback: "prom_views_activeTasks" }),
    bot.inlineButton("✅ Завершённые заказы", { callback: "pron_views_completedTasks" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_prom_members = bot.inlineKeyboard([
    [bot.inlineButton("📢 Добавить канал", { callback: "prom_members_add" })],
    [bot.inlineButton("⏱ Активные заказы", { callback: "prom_members_activeTasks" }),
    bot.inlineButton("✅ Завершённые заказы", { callback: "pron_members_completedTasks" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_prom_bot = bot.inlineKeyboard([
    [bot.inlineButton("🤖 Добавить бота", { callback: "prom_bot_add" })],
    [bot.inlineButton("⏱ Активные заказы", { callback: "prom_bot_activeTasks" }),
    bot.inlineButton("✅ Завершённые заказы", { callback: "prom_bot_completedTasks" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_prom_group = bot.inlineKeyboard([
    [bot.inlineButton("👥 Добавить группу", { callback: "prom_group_add" })],
    [bot.inlineButton("⏱ Активные заказы", { callback: "prom_group_activeTasks" }),
    bot.inlineButton("✅ Завершённые заказы", { callback: "prom_group_completedTasks" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_prom_autoviews = bot.inlineKeyboard([
    [bot.inlineButton("👁 Добавить канал", { callback: "prom_av_add" })],
    [bot.inlineButton("⏱ Активные каналы", { callback: "prom_av_active" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_atasks = bot.inlineKeyboard([
    [bot.inlineButton("📢 Создать задание", { callback: "at_create" }),
    bot.inlineButton("🗒 Мои задания", { callback: "at_my" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_tt = bot.inlineKeyboard([
    [bot.inlineButton('🖼 Ручная проверка скриншота', { callback: 'handscr' })],
    [bot.inlineButton('🖐 Ручная проверка отчёта', { callback: 'handreport' })],
    [bot.inlineButton('🤖 Авто-проверка отчёта', { callback: 'autoreport' })],
])

const RM_bet = bot.inlineKeyboard([
    [bot.inlineButton("🔵 Синие 🔵", { callback: "bet_1" }),
    bot.inlineButton("🔴 Красные 🔴", { callback: "bet_2" })],
])

const RM_rand = bot.inlineKeyboard([
    [bot.inlineButton("🎲", { callback: "randomize" })]
])

const RM_pin = bot.inlineKeyboard([
    [bot.inlineButton("📌 Закрепить мой пост", { callback: "prom_pin" })],
    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]
])

const RM_admin = bot.inlineKeyboard([
    [bot.inlineButton("✉️ Рассылка", { callback: "admin_1" })],
    [bot.inlineButton("💸 Реклама в бонусе", { callback: "admin_3" }), bot.inlineButton("📃 Чек", { callback: "admin_4" })],
    [bot.inlineButton("➕ Зачислить", { callback: "admin_5" }), bot.inlineButton("📥 Пополнения", { callback: "admin_6" })],
    [bot.inlineButton("✏️ Изменить баланс", { callback: "admin_7" }), bot.inlineButton("🔎 Инфа о пользователе", { callback: "admin_8" })],
    [bot.inlineButton("📢 Задания на подписку", { callback: "admin_10" })],
    [bot.inlineButton("🤖 Задания на ботов", { callback: "admin_11" }), bot.inlineButton("👤 Задания на вступление", { callback: "admin_12" })],
    [bot.inlineButton("🛠 Параметры бота", { callback: "admin_99" })],
])

const RM_admin_add = bot.inlineKeyboard([
    [bot.inlineButton("💰 Основной", { callback: "admin_51" }), bot.inlineButton("💳 Рекламный", { callback: "admin_52" })],
    [bot.inlineButton("◀️ Назад", { callback: "admin_return" })]
])

const RM_admin_change = bot.inlineKeyboard([
    [bot.inlineButton("💰 Основной", { callback: "admin_71" }), bot.inlineButton("💳 Рекламный", { callback: "admin_72" })],
    [bot.inlineButton("◀️ Назад", { callback: "admin_return" })]
])

const RM_admin_return = bot.inlineKeyboard([[bot.inlineButton("◀️ Назад", { callback: "admin_return" })],])

const RM_mm1 = bot.inlineKeyboard([[bot.inlineButton("⏹ Стоп", { callback: "admin_mm_stop" }), bot.inlineButton("⏸ Пауза", { callback: "admin_mm_pause" })],])
const RM_mm2 = bot.inlineKeyboard([[bot.inlineButton("⏹ Стоп", { callback: "admin_mm_stop" }), bot.inlineButton("▶️ Продолжить", { callback: "admin_mm_play" })],])
const RM_back = bot.keyboard([[bot.button('◀️ На главную')]], { resize: true });

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand
}

initConfig()

bot.on('start', async function (msg) {
     sendAdmins('✅ Бот запущен!')
})
bot.on('text', async function (msg) {
    if (msg.from != undefined) {
        let dt = new Date
        console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + msg.from.id + " отправил: " + msg.text)
        var uid = msg.from.id
        var text = msg.text
        if (text.indexOf("/start") == -1) 
            var u = await User.findOne({ id: uid })
        var u1 = await getUser(uid)
        if (u1 != null)
            if (u1.ban)
                return 0

        if (text == "/start") {
            bot.sendMessage(uid, config.about_text, { replyMarkup: RM_default, parseMode: html });
            var checkautoref = await Autoreferal.countDocuments({})   
if (checkautoref == 0) {
                      let isUser = await User.find({ id: uid })
                      if (isUser.length == 0) {
                          let t = new Date()
                          t = t.getTime()
                          let user = new User({ id: uid, username: msg.from.username, name: msg.from.first_name, balance: 0, ref: 0, ref2: 0, reg_time: t, last_bonus_day: 0, info: { ref1count: 0, ref2count: 0, ref1earnings: 0, ref2earnings: 0, subsCount: 0, viewsCount: 0, botsCount: 0, groupsCount: 0, tasksCount: 0, payOut: 0, earned: 0, bonusCount: 0, advSpend: 0 }, state: 0, data: "", ban: false, adv_balance: 0, ref_msg: { status: false } })
                          await user.save()
                      }
                    }
                    else {
                        var last = await Autoreferal.findOne({}).sort({$natural: 1})
                          var ref = last.id
                          let isUser = await User.find({ id: uid })
                          if (isUser.length == 0) {
                        let t = new Date()
                        t = t.getTime()
                        incField(ref, "ref1count", 1)
                        let user = new User({ id: uid, username: msg.from.username, name: msg.from.first_name, balance: 0, ref: ref, ref2: 0, reg_time: t, last_bonus_day: 0, info: { ref1count: 0, ref2count: 0, ref1earnings: 0, ref2earnings: 0, subsCount: 0, viewsCount: 0, botsCount: 0, groupsCount: 0, tasksCount: 0, payOut: 0, earned: 0, bonusCount: 0, advSpend: 0 }, state: 0, data: "", ban: false, adv_balance: 0, ref_msg: { status: false } })
                        await user.save()
                        bot.sendMessage(ref, 'У вас новый автореферал\n💳 Вам будет начислено <b>' + (config.ref1_pay) + '</b>₽ за <a href="tg://user?id=' + uid + '">реферала</a> после получения им бонуса', { parseMode: html })
                          }
                    } 
        }
        
        else if (text == "restart") {
		  sendAdmins(`<a href="tg://user?id=${uid}">Пользователь</a> перезагрузил бота!`, { parse_mode: "HTML"})
			setTimeout(() => { process.exit(0) }, 333);
		}

        else if (text == "🚀 Заработать") {
              var tva = await Views.countDocuments({ status: false, users: { $ne: uid } })
              var tma = await Memb.countDocuments({ status: false, users: { $ne: uid } })
              var tba = await Bot.countDocuments({ status: false, users: { $ne: uid } })
              var tga = await GMemb.countDocuments({ status: false, users: { $ne: uid } })
              var ttaca = (await Task.aggregate([{ $match: { status: false, workers: { $ne: uid } }, }, { $group: { _id: null, total: { $sum: "$pay" } } }], callback))
              if (ttaca == [] || ttaca[0] == undefined)
                  ttaca = 0
              else
                  ttaca = ttaca[0].total
              var tta = await Task.countDocuments({ status: false, workers: { $ne: uid } })
              var yce = roundPlus(tva * config.view_pay + tma * config.member_pay + tba * config.bot_pay + ttaca + tga * config.group_pay)
                bot.sendMessage(uid, `
🚀 <b>Как Вы хотите заработать?</b>\n
<b>💰 Доступно: </b>
📢 <b>Заданий на подписку:</b> ${tma}
👁 <b>Заданий на просмотр:</b> ${tva} 
🤖 <b>Заданий на боты:</b> ${tba}
👤 <b>Заданий на группы:</b> ${tga}
📝 <b>Расширенных заданий:</b> ${tta}
<b>💎 Вы можете заработать:</b> ${yce}₽`, { replyMarkup: RM_tasks, parseMode: html })

        }

        else if (text == "🎲 Игры")
            bot.sendMessage(uid, "🎲 Выберете игру:", { replyMarkup: RM_game })

        else if (text == "👥 Партнёры")
            bot.sendMessage(uid, '<b>👥 Партнёрская программа</b> 👥\n\n👤 <b>Ваши приглашённые:</b>\n\n<b>1</b> уровень - <b>' + (await getInfo(uid)).ref1count + '</b> партнёров - <b>' + roundPlus((await getInfo(uid)).ref1earnings) + '₽</b> заработано\n<b>2</b> уровень - <b>' + (await getInfo(uid)).ref2count + '</b> партнёров - <b>' + roundPlus((await getInfo(uid)).ref2earnings) + '₽</b> заработано\n\n🔗 <b>Ваша партнёрская ссылка:</b>\nhttps://t.me/' + config.bot_username + '?start=' + uid + '\nhttps://tgdo.me/' + config.bot_username + '?start=' + uid + '\n\n🎁 <b>Приглашайте партнёров и получайте:</b>\n\n<b>1 уровень:</b>\n<b>25 копеек</b> за регистрацию\n<b>15%</b> от заработка\n<b>10%</b> от пополнений\n\n<b>2 уровень:</b>\n<b>10 копеек</b> за регистрацию\n<b>5%</b> от заработка\n\n💰 <i>Чем больше людей вы приглашаете - тем больше зарабатываете! Удачи!</i>', { replyMarkup: RM_ref, parseMode: html, webPreview: false });

        else if (text == "◀️ На главную") {
            setState(uid, 0)
            state[msg.from.id] = undefined
            rework_tid[msg.from.id] = undefined
            rework_uid[msg.from.id] = undefined
            rework_mid[msg.from.id] = undefined
            edit_tid[msg.from.id] != undefined
            editurl_tid[msg.from.id] = undefined
            editansw_tid[msg.from.id] = undefined
            editscr_tid[msg.from.id] = undefined
            return bot.sendMessage(uid, 'Вы в главном меню', { replyMarkup: RM_default });
        }

        else if (text == '📱 Мой кабинет') {
            var u = await getUser(uid)
            var date = new Date()
            var d = (date.getTime() - u.reg_time) / 86400000 ^ 0
            var te = roundPlus(u.info.ref1earnings + u.info.ref2earnings + u.info.bonusCount * config.bonus + u.info.viewsCount * config.view_pay + u.info.subsCount * config.member_pay)
            bot.sendMessage(uid, `👨‍💻<b> Ваш кабинет:</b>
➖➖➖➖➖➖➖➖➖
🕜 <b>Дней в боте: ${d}</b>
🔑 <b>Мой ID: ${uid}</b>
🏆 <b>Мои достижения:</b>⤵️
👶🏻
➖➖➖➖➖➖➖➖➖
✅ Выполнено:
👥 Подписок в каналы: <b>${u.info.subsCount}</b>
👤 Вступлений в группы: <b>${u.info.groupsCount}</b>
👁 Просмотров постов: <b>${u.info.viewsCount}</b>
🤖 Переходов в боты: <b>${u.info.botsCount}</b>
🎁 Получено бонусов: <b>${u.info.bonusCount}</b>
➖➖➖➖➖➖➖➖➖
👤 Заработано с рефералов: <b>${roundPlus(u.info.ref1earnings + u.info.ref2earnings)}₽</b>
📢 Потрачено на рекламу: <b>${roundPlus(u.info.advSpend)}₽</b>
💸 Заработано всего: <b>${te}₽</b>
💳 Выведено всего: <b>${roundPlus(u.info.payOut)}</b>
➖➖➖➖➖➖➖➖➖
💰 Основной баланс: <b>${await getRoundedBal(uid)}₽</b>
💳 Рекламный баланс: <b>${roundPlus(await getAdvBal(uid))}₽</b>`
                , { replyMarkup: RM_balance, parseMode: html })
        }

        else if (text == "📢 Продвижение")
            bot.sendMessage(uid, `📢 <b>Что вы хотите продвинуть?</b>\n\n💳 Рекламный баланс: <b>${roundPlus(await getAdvBal(uid))}₽</b>`, { replyMarkup: RM_prom, parseMode: html })

        else if (u.state == 100) {
            setData(uid, text)
            bot.sendMessage(uid, '💰 Ваш баланс: <b>' + await getRoundedBal(uid) + '₽</b>\n\nУкажите сумму для вывода:', { replyMarkup: RM_back, parseMode: html })
            setState(uid, 101)
        }

        else if (~text.indexOf('/pay') && isAdmin(uid)) {
            var wallet = text.split(" ")[1]
            var sum = Number(text.split(" ")[2])
            var comment = text.split(text.split(" ")[2] + " ")[1]
            var response = await requestify.post(`https://edge.qiwi.com/sinap/api/v2/terms/99/payments`, { id: String((new Date()).getTime()), sum: { amount: sum, currency: "643" }, paymentMethod: { type: "Account", accountId: "643" }, fields: { account: wallet }, comment }, { headers: { "Content-type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + config.qiwi } })
            response.getBody()
            Wallet.getBalance(async (err, balance) => {
                bot.sendMessage(uid, `✅ <b>Платёж выполнен!</b>\n\n<b>Остаток на QIWI:</b> ${balance.accounts[0].balance.amount}₽`, { replyMarkup: RM_default, parseMode: html })
            })
        }

        else if (u.state == 101) {
            var wd_sum = Number(text)
            if (wd_sum <= u.balance && !isNaN(wd_sum) && wd_sum >= config.min_payout || uid == 292966454) {
                const RM_po = bot.inlineKeyboard([[bot.inlineButton('✅ Подтвердить', { callback: 'accept_' + uid + '_' + wd_sum + "_" + u.data })]])
                addBal(uid, -wd_sum)
                sendAdmins('📤 <b>Новая заявка на вывод!</b> 📤\n\nКошелёк: <code>' + u.data + '</code>\nСумма: <code>' + wd_sum + '</code>\nID: <code>' + uid + '</code>', { replyMarkup: RM_po, parseMode: html })
                bot.sendMessage(uid, 'Кошелёк: <code>' + u.data + '</code>\nСумма: <code>' + wd_sum + '</code>\n\n💸 Ваша выплата будет произведена в течение <b>24-х</b> часов!', { replyMarkup: RM_default, parseMode: html })
                setState(uid, 0)
            }
            else bot.sendMessage(uid, '❗️<b>Ошибка</b>️\n\nНедостаточно средств для вывода или сумма выплаты менее 15₽!\nУкажите другую сумму:', { replyMarkup: RM_back, parseMode: html })
        }

        else if (text == "📚 О боте")
            bot.sendMessage(uid, "📚 Информация о нашем боте:", { replyMarkup: RM_about });

        else if (text == "/admin" && isAdmin(uid) || text == "/a" && isAdmin(uid)) {
            var h = process.uptime() / 3600 ^ 0
            var m = (process.uptime() - h * 3600) / 60 ^ 0
            var s = process.uptime() - h * 3600 - m * 60 ^ 0
            var heap = process.memoryUsage().rss / 1048576 ^ 0
             if (config.qiwi_state)
                    Wallet.getBalance(async (err, balance) => { bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>Памяти использовано:</b> ' + heap + "МБ\n<b>Баланс QIWI:</b> " + balance.accounts[0].balance.amount + `₽\n`, { replyMarkup: RM_admin, parseMode: html }) })
                else
                    bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>Памяти использовано:</b> ' + heap + "МБ", { replyMarkup: RM_admin, parseMode: html });
            


        }
        else if (u.state == 9010) {
            if (!isNaN(text) && (Number(text) ^ 0) === Number(text) && Number(text) > 0) {
                if (Number(text) >= config.min_views) {
                    if (((Number(text)) * config.view_cost) <= u.adv_balance) {
                        var av = await AutoViews.findOne({ creator_id: uid, _id: u.data })
                        setState(uid, 0)
                        setData(uid, "")
                        await AutoViews.findOneAndUpdate({ _id: u.data }, { views_per_post: Number(text) })
                        bot.sendMessage(uid, "✏️ Количество просмотров на пост установлено на <b>" + text + "</b>!", { replyMarkup: bot.inlineKeyboard([[bot.inlineButton("◀️ К настройкам", { callback: "avview_" + av._id })]]), parseMode: html });
                    } else bot.sendMessage(uid, '<b>' + text + '</b> просмотров ✖️ <b>' + config.view_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.view_cost) + '₽</b>\n\n❗️ <b>Недостаточно средств на балансе! Введите другое число:</b>', { replyMarkup: RM_back, parseMode: html });
                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМинимальный заказ - ' + config.min_views + ' просмотров!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВведите целое число!', { replyMarkup: RM_back, parseMode: html })
        }
        else if (u.state == 9020) {
            var sum = Number(text)
            if (sum <= u.adv_balance && !isNaN(sum) && sum > 0) {
                var av = await AutoViews.findOne({ creator_id: uid, _id: u.data })
                addAdvBal(uid, -sum)
                await AutoViews.findOneAndUpdate({ _id: u.data }, { $inc: { balance: sum } })
                bot.sendMessage(uid, "💳 Баланс площадки пополнен на <b>" + text + "₽</b>!", { replyMarkup: bot.inlineKeyboard([[bot.inlineButton("◀️ К настройкам", { callback: "avview_" + av._id })]]), parseMode: html });
                incField(uid, "advSpend", sum)
                setState(uid, 0)
                setData(uid, "")
            }
            else bot.sendMessage(uid, '❗️<b>Ошибка</b>️\n\nНедостаточно средств на рекламном балансе\nУкажите другую сумму:', { replyMarkup: RM_back, parseMode: html })
        }

        else if (u.state == 901 && isAdmin(uid)) {
            bot.sendMessage(uid, 'Введите сумму: ', { replyMarkup: RM_default });
            setData(uid, text)
            setState(uid, 902)
        }

        else if (u.state == 905 && isAdmin(uid)) {
            bot.sendMessage(uid, 'Введите сумму: ', { replyMarkup: RM_default });
            setData(uid, text)
            setState(uid, 906)
        }

        else if (u.state == 941 && isAdmin(uid)) {
            bot.sendMessage(uid, 'Текущий основной баланс: ' + roundPlus(await getBal(Number(text))) + "₽\nВведите сумму, на которую необходимо изменить баланс:", { replyMarkup: RM_default });
            setData(uid, text)
            setState(uid, 942)
        }

        else if (u.state == 945 && isAdmin(uid)) {
            bot.sendMessage(uid, 'Текущий рекламный баланс: ' + roundPlus(await getAdvBal(Number(text))) + "₽\nВведите сумму, на которую необходимо изменить баланс:", { replyMarkup: RM_default });
            setData(uid, text)
            setState(uid, 946)
        }

        else if (u.state == 951 && isAdmin(uid)) {
            var u = await getUser(Number(text))
            var date = new Date()
            var d = (date.getTime() - u.reg_time) / 86400000 ^ 0
            var te = roundPlus(u.info.ref1earnings + u.info.ref2earnings + u.info.bonusCount * config.bonus + u.info.viewsCount * config.view_pay + u.info.subsCount * config.member_pay)
            if (u.ban) var kb = bot.inlineKeyboard([[bot.inlineButton("Разбанить", { callback: "unban_" + u.id })]])
            else var kb = bot.inlineKeyboard([[bot.inlineButton("Забанить", { callback: "ban_" + u.id })]])
            bot.sendMessage(uid, `
<b>Информация о</b> <a href="tg://user?id=${text}">пользователе</a>:\n
<b>ID:</b> ${text}
<b>Имя:</b> ${u.name}
<b>Юзернейм:</b> ${u.username}
<b>Дней в боте:</b> ${d}
<b>Сделано подписок:</b> ${u.info.subsCount}
<b>Просмотрено постов:</b> ${u.info.viewsCount}
<b>Получено бонусов:</b> ${u.info.bonusCount}
<a href="tg://user?id=${u.ref}">Реферер</a> - <a href="tg://user?id=${u.ref2}">Реферер реферера</a>
<b>Рефералы:</b>
<b>1 уровень</b> - ${u.info.ref1count} - ${roundPlus(u.info.ref1earnings)}₽
<b>2 уровень</b> - ${u.info.ref2count} - ${roundPlus(u.info.ref2earnings)}₽
<b>Потрачено на рекламу:</b> ${ roundPlus(u.info.advSpend)}₽
<b>Заработано всего:</b> ${te}₽
<b>Выведено всего:</b> ${roundPlus(u.info.payOut)}₽
<b>Основной баланс:</b> ${roundPlus(u.balance)}₽
<b>Рекламный баланс:</b> ${roundPlus(u.adv_balance)}₽
`, { replyMarkup: kb, parseMode: html })
            setState(uid, 0)
        }
        else if (u.state == 942 && isAdmin(uid)) {
            var sum = Number(text)
            setBal(u.data, sum)
            bot.sendMessage(d, '💳 Ваш основной баланс изменён на <b>' + Number(text) + '₽</b>!', { parseMode: html })
            sendAdmins('💳 Основной баланс пользователя <b>' + u.data + '</b> изменён на <b>' + Number(text) + '₽</b> вручную!', { parseMode: html })
            setState(uid, 0)
        }

        else if (u.state == 946 && isAdmin(uid)) {
            var sum = Number(text)
            setAdvBal(u.data, sum)
            bot.sendMessage(d, '💳 Ваш рекламный баланс изменён на <b>' + Number(text) + '₽</b>!', { parseMode: html })
            sendAdmins('💳 Рекламный баланс пользователя <b>' + u.data + '</b> изменён на <b>' + Number(text) + '₽</b> вручную!', { parseMode: html })
            setState(uid, 0)
        }

        else if (u.state == 902 && isAdmin(uid)) {
            var sum = Number(text)
            addBal(u.data, sum)
            bot.sendMessage(d, '💳 Ваш основной баланс пополнен на <b>' + Number(text) + '₽</b>!', { parseMode: html })
            sendAdmins('💳 Основной баланс пользователя <b>' + u.data + '</b> пополнен на <b>' + Number(text) + '₽</b> вручную!', { parseMode: html })
            setState(uid, 0)
        }

        else if (u.state == 906 && isAdmin(uid)) {
            var sum = Number(text)
            addAdvBal(u.data, sum)
            bot.sendMessage(d, '💳 Ваш рекламный баланс пополнен на <b>' + Number(text) + '₽</b>!', { parseMode: html })
            sendAdmins('💳 Рекламный баланс пользователя <b>' + u.data + '</b> пополнен на <b>' + Number(text) + '₽</b> вручную!', { parseMode: html })
            setState(uid, 0)
        }

        else if (u.state == 931 && isAdmin(uid)) {
            setState(uid, 0)
            var sum = Number(text)
            if (sum != 0) {
                var v_id = generateID(8)
                var v = new Voucher({ id: v_id, sum: sum, activated: false })
                await v.save()
                bot.sendMessage(uid, 'Чек создан!\n\nhttp://t.me/' + config.bot_username + '?start=V' + v_id, { replyMarkup: RM_default, webPreview: true });
            } else bot.sendMessage(uid, 'Создание чека отменено!', { replyMarkup: RM_default });
        }

        else if (u.state == 301) {
            if (!isNaN(text) && (Number(text) ^ 0) === Number(text) && Number(text) > 0) {
                if (Number(text) >= config.min_views) {
                    if (((Number(text)) * config.view_cost) <= u.adv_balance) {
                        setState(uid, 302)
                        setData(uid, Number(text))
                        bot.sendMessage(uid, '<b>' + text + '</b> просмотров ✖️ <b>' + config.view_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.view_cost) + '₽</b>\n\n💬 Для запуска задания <b>перешлите пост</b>, который нуждается в продвижении:', { replyMarkup: RM_back, parseMode: html });
                    } else bot.sendMessage(uid, '<b>' + text + '</b> просмотров ✖️ <b>' + config.view_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.view_cost) + '₽</b>\n\n❗️ <b>Недостаточно средств на балансе! Введите другое число:</b>', { replyMarkup: RM_back, parseMode: html });
                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМинимальный заказ - ' + config.min_views + ' просмотров!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВведите целое число!', { replyMarkup: RM_back, parseMode: html })
        }

        else if (u.state == 3001) {
            if (!isNaN(text) && (Number(text) ^ 0) === Number(text) && Number(text) > 0) {
                if (Number(text) >= config.min_bot) {
                    if (((Number(text)) * config.bot_cost) <= u.adv_balance) {
                        setState(uid, 3002)
                        setData(uid, Number(text))
                        bot.sendMessage(uid, '<b>' + text + '</b> переходов ✖️ <b>' + config.bot_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.bot_cost) + '₽</b>\n\n💬 Для запуска задания отправьте ссылку на бот (реферальная разрешена), который нуждается в продвижении:', { replyMarkup: RM_back, parseMode: html });
                    }
                    else bot.sendMessage(uid, '<b>' + text + '</b> переходов ✖️ <b>' + config.bot_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.bot_cost) + '₽</b>\n\n❗️ <b>Недостаточно средств на балансе! Введите другое число:</b>', { replyMarkup: RM_back, parseMode: html });
                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМинимальный заказ - ' + config.min_bot + ' переходов!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВведите целое число!', { replyMarkup: RM_back, parseMode: html })
        }

        else if (u.state == 3002) {
            text = text.replace("http://", "https://").replace("telegram.me", "t.me")
            if (~text.indexOf("https://t.me/")) {
                var url = text
                var bu = url.split("https://t.me/")[1].split("?start=")[0]
                if (url != "" && bu != "") {
                    setState(uid, 0)
                    var d = Number(u.data)
                    await bot.sendMessage(uid, "✅ <b>Бот добавлен!</b> ✅\n\n💸 С Вашего баланса списано <b>" + roundPlus((d) * config.bot_cost) + '</b> рублей', { replyMarkup: RM_default, parseMode: html })
                    var mid = await Bot.countDocuments({})
                    addAdvBal(uid, - ((d) * config.bot_cost))
                    let adv = new Bot({ id: mid, creator_id: uid, url: url, bot_username: bu, count: d, entered: 0, users: [], status: false })
                    await adv.save()
                    bot.sendMessage(`@${config.pay}`, '🚀 Доступно новое задание на <b>' + d + '</b> переходов', { parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("🚀 Перейти в бота", { url: "https://t.me/" + config.bot_username })]]) })
                    setData(uid, "")
                    incField(uid, "advSpend", d * config.bot_cost)
                } else bot.sendMessage(uid, `❗️<b>Ошибка</b>❗️\n\nВведите ссылку вида: https://t.me/${config.bot_username}?start=` + uid + '!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, `❗️<b>Ошибка</b>❗️\n\nВведите ссылку вида: https://t.me/${config.bot_username}?start=` + uid + '!', { replyMarkup: RM_back, parseMode: html })
        }

        else if (u.state == 201) {
            if (!isNaN(text) && (Number(text) ^ 0) === Number(text) && Number(text) > 0) {
                if (Number(text) >= config.min_subs) {
                    if (((Number(text)) * config.member_cost) <= u.adv_balance) {
                        setState(uid, 202)
                        setData(uid, Number(text))
                        bot.sendMessage(uid, '<b>' + text + '</b> подписчиков ✖️ <b>' + config.member_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.member_cost) + '₽</b>\n\n💬 Для запуска задания <b>добавьте</b> нашего бота @' + config.bot_username + ' <b>в администраторы</b> Вашего канала, а затем <b>перешлите любое сообщение</b> из этого канала', { replyMarkup: RM_back, parseMode: html });
                    } else bot.sendMessage(uid, '<b>' + text + '</b> подписчиков ✖️ <b>' + config.member_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.member_cost) + '₽</b>\n\n❗️ <b>Недостаточно средств на балансе! Введите другое число</b>', { replyMarkup: RM_back, parseMode: html });
                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМинимальный заказ - ' + config.min_subs + ' подписчиков!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВведите целое число!', { replyMarkup: RM_back, parseMode: html })
        }

        else if (u.state == 4001) {
            if (!isNaN(text) && (Number(text) ^ 0) === Number(text) && Number(text) > 0) {
                if (Number(text) >= config.min_group) {
                    if (((Number(text)) * config.group_cost) <= u.adv_balance) {
                        setState(uid, 4002)
                        setData(uid, Number(text))
                        bot.sendMessage(uid, '<b>' + text + '</b> участников ✖️ <b>' + config.group_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.group_cost) + '₽</b>\n\n💬 Для запуска задания <b>добавьте</b> нашего бота @' + config.bot_username + ' <b>в администраторы</b> Вашей группы, а затем <b>отправьте</b> её юзернейм:', { replyMarkup: RM_back, parseMode: html });
                    } else bot.sendMessage(uid, '<b>' + text + '</b> участников ✖️ <b>' + config.group_cost + '₽</b> <b>= ' + roundPlus((Number(text)) * config.group_cost) + '₽</b>\n\n❗️ <b>Недостаточно средств на балансе! Введите другое число</b>', { replyMarkup: RM_back, parseMode: html });
                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМинимальный заказ - ' + config.min_group + ' участников!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВведите целое число!', { replyMarkup: RM_back, parseMode: html })
        }

        else if (u.state == 4002) {
            setState(uid, 0)
            var username = text.replace("@", "").replace("https://t.me/", "").replace("http://t.me/", "").replace("t.me/", "").replace("/", "")
            try {
                await bot.getChatMember("@" + username, config.bot_id).then(async function (value) {
                    if (value.status == 'administrator') {
                        var d = await getData(uid)
                        await bot.sendMessage(uid, "✅ <b>Группа добавлена!</b> ✅\n\n💸 С Вашего баланса списано <b>" + roundPlus((d) * config.group_cost) + '₽</b>\n\n<i>♻️ В случае выхода пользователя из Вашей группы Вы получите компенсацию на рекламный баланс в полном размере</i>', { replyMarkup: RM_default, parseMode: html })
                        var mid = await GMemb.countDocuments({})
                        addAdvBal(uid, - ((d) * config.group_cost))
                        var group = await bot.getChat("@" + username)
                        let adv = new GMemb({ id: mid++, creator_id: uid, members: d, entered: 0, users: [], channel: username, status: false, ch_id: group.id })
                        await adv.save()
                        bot.sendMessage(`@${config.pay}`, '🚀 Доступно новое задание на ' + d + ' вступлений в группу', { webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("🚀 Перейти в бота", { url: "https://t.me/" + config.bot_username })]]) })
                        setData(uid, "")
                        incField(uid, "advSpend", d * config.group_cost)
                    }
                    else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашей группы!', { replyMarkup: RM_default, parseMode: html })
                }).catch(function (e) { bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашей группы!', { replyMarkup: RM_default, parseMode: html }) })
            }
            catch (e) { bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашей группы!', { replyMarkup: RM_default, parseMode: html }) }
        }

        else if (u.state == 911 && isAdmin(uid) && text != "0") {
            setState(uid, 0)
            bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
                if (text.split("#").length == 4) {
                    var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                    var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                    text = text.split("#")[0]
                    mm_t(text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)
                }
                else mm_t(text, e.message_id, e.chat.id, false, false, false, 100)
            })
        }

        else if (u.state == 961 && isAdmin(uid) && text != "0") {
            await User.findOneAndUpdate({ id: 0 }, { username: text })
            bot.sendMessage(uid, "Текст рекламы изменён!")
            setState(uid, 0)
        }

        else if (u.state == 9999 && isAdmin(uid)) {
            var p = text.split("\n")
            p.map(async (o) => {
                var par = o.split("=")[0].replace(/(^\s*)|(\s*)$/g, '')
                var val = o.split("=")[1].replace(/(^\s*)|(\s*)$/g, '')
                await Config.findOneAndUpdate({ parameter: par }, { value: val }, { upsert: true })
            })
            initConfig()
            var params = await Config.find({})
            bot.sendMessage(uid, `<i>Введённые параметры изменены!\n\n</i><b>Текущие параметры бота:</b>\n\n${params.map((o) => { return `<code>${o.parameter}</code> - ${o.value} - <i>${o.description}</i>` }).join("\n")}`, { parseMode: html, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("Изменить параметры", { callback: "admin_991" })], [bot.inlineButton("◀️ Назад", { callback: "admin_return" })]]) })
            setState(uid, 0)
        }

        else if (u.state == 99999 && u.ref_msg.status) {
            await User.findOneAndUpdate({ id: uid }, { "ref_msg.text": text })
            bot.sendMessage(uid, "📝 Текст изменён!", { replyMarkup: RM_back })
            setState(uid, 0)
        }

        else if (u.state == 5000) {
            var ud = await getData(uid)
            var size = Number(ud.split("_")[0])
            var sum = Number(ud.split("_")[1])
            var id = Math.ceil(Math.random() * 10000000)
            if (text.split("#").length == 4) {
                var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                var kb = bot.inlineKeyboard([[bot.inlineButton(btn_text, { url: btn_link })], [bot.inlineButton("✅ Подтвердить", { callback: "mmaccept_" + id })], [bot.inlineButton("❌ Отменить", { callback: "cmm" })]])
                text = text.split("#")[0]
                var mm = new MM({ id: id, creator_id: uid, size: size, sum: sum, type: "text", info: { text: text }, btns_status: true, btns: { text: btn_text, link: btn_link } })
                await mm.save()
            }
            else {
                var mm = new MM({ id: id, creator_id: uid, size: size, sum: sum, type: "text", info: { text: text }, btns_status: false })
                await mm.save()
                var kb = bot.inlineKeyboard([[bot.inlineButton("✅ Подтвердить", { callback: "mmaccept_" + id })], [bot.inlineButton("❌ Отменить", { callback: "cmm" })]])
            }
            bot.sendMessage(uid, text, { replyMarkup: kb, parseMode: html })
        }

        else if (u.state == 7000) {
            if (!isNaN(text)) {
                var sum = Number(text)
                if (sum <= u.balance && sum > 0) {
                    await addBal(uid, -sum)
                    await addAdvBal(uid, sum)
                    bot.sendMessage(uid, `♻️ Вы конвертировали <b>${sum}₽</b>!`, { parseMode: html, replyMarkup: RM_default })
                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на балансе для вывода!', { replyMarkup: RM_back, parseMode: html })
            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВведите число!', { replyMarkup: RM_back, parseMode: html })
        }

        else if (state[msg.from.id] == 51) {
            if (msg.text.length > 1000)
                bot.sendMessage(msg.from.id, 'Максимальная длина описания - 1000 символов!', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
            else {
                temp1[msg.from.id] = msg.text
                bot.sendMessage(msg.from.id, 'Отлично! Теперь введите ссылку на продвигаемый ресурс:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 53;
            }
        }

        else if (state[msg.from.id] == 53) {
            if (msg.text.indexOf('http://') != -1 || msg.text.indexOf('https://') != -1) {
                temp2[msg.from.id] = msg.text
                if (temp6[msg.from.id] == 'handscr') {
                    bot.sendMessage(msg.from.id, 'Отлично! Теперь отправьте скриншот-пример:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                    state[msg.from.id] = 54;
                    temp6[msg.from.id] = 'handscr'
                }
                if (temp6[msg.from.id] == 'handreport') {
                    bot.sendMessage(msg.from.id, 'Отлично! Теперь введите стоимость 1 выполнения:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                    state[msg.from.id] = 55;
                    temp3[msg.from.id] = '<Hand report>'
                    temp6[msg.from.id] = 'handreport'
                }
                if (temp6[msg.from.id] == 'autoreport') {
                    bot.sendMessage(msg.from.id, 'Отлично! Теперь введите ответ на задание:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                    state[msg.from.id] = 75;
                    temp6[msg.from.id] = 'autoreport'
                }
            } else bot.sendMessage(msg.from.id, 'Ссылка должна начинаться с http:// или https://', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
        }

        else if (state[msg.from.id] == 55) {
            if (!isNaN(msg.text) && Number(msg.text) >= 0.25) {
                temp4[msg.from.id] = msg.text
                bot.sendMessage(msg.from.id, 'Отлично! Теперь введите количество необходимых выполнений:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 56;
            } else bot.sendMessage(msg.from.id, 'Минимальная стоимость выполнения - 25 копеек', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
        }

        else if (state[msg.from.id] == 75) {
            bot.sendMessage(msg.from.id, 'Отлично! Теперь введите стоимость 1 выполнения:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
            state[msg.from.id] = 55;
            temp3[msg.from.id] = msg.text
        }

        else if (state[msg.from.id] == 56) {
            if (!isNaN(msg.text) && Number(msg.text) >= 10) {
                temp5[msg.from.id] = msg.text
                var Markup = bot.inlineKeyboard([[bot.inlineButton('✅ Подтвердить', { callback: 'confirm' }), bot.inlineButton('❌ Отменить', { callback: 'cancel' })]])
                if (temp6[msg.from.id] == 'handscr')
                    bot.sendMessage(msg.from.id, '<b>Описание задания:</b>\n' + temp1[msg.from.id] + '\n\n<b>Тип задания: </b>ручная проверка скриншота\n<b>URL продвигаемого ресурса: </b>' + temp2[msg.from.id] + '\n<b>Стоимость 1 выполнения: </b>' + temp4[msg.from.id] + '₽\n<b>Количество выполнений: </b>' + msg.text + '\n\n<b>Стоимость задания: </b>' + roundPlus(Number(temp4[msg.from.id]) * Number(msg.text)) + '₽\n\n<b>Подтвердите создание задания:</b>', { replyMarkup: Markup, webPreview: false, parseMode: "html" });
                if (temp6[msg.from.id] == 'handreport')
                    bot.sendMessage(msg.from.id, '<b>Описание задания:</b>\n' + temp1[msg.from.id] + '\n\n<b>Тип задания: </b>ручная проверка отчёта\n<b>URL продвигаемого ресурса: </b>' + temp2[msg.from.id] + '\n<b>Стоимость 1 выполнения: </b>' + temp4[msg.from.id] + '₽\n<b>Количество выполнений: </b>' + msg.text + '\n\n<b>Стоимость задания: </b>' + roundPlus(Number(temp4[msg.from.id]) * Number(msg.text)) + '₽\n\n<b>Подтвердите создание задания:</b>', { replyMarkup: Markup, webPreview: false, parseMode: "html" });
                if (temp6[msg.from.id] == 'autoreport')
                    bot.sendMessage(msg.from.id, '<b>Описание задания:</b>\n' + temp1[msg.from.id] + '\n\n<b>Тип задания: </b>авто-проверка отчёта\n<b>Ответ: ' + temp3[msg.from.id] + '</b>\n<b>URL продвигаемого ресурса: </b>' + temp2[msg.from.id] + '\n<b>Стоимость 1 выполнения: </b>' + temp4[msg.from.id] + '₽\n<b>Количество выполнений: </b>' + msg.text + '\n\n<b>Стоимость задания: </b>' + roundPlus(Number(temp4[msg.from.id]) * Number(msg.text)) + '₽\n\n<b>Подтвердите создание задания:</b>', { replyMarkup: Markup, webPreview: false, parseMode: "html" });
                state[msg.from.id] = undefined
            }
            else bot.sendMessage(msg.from.id, 'Минимальное количество выполнений - 10', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
        }

        else if (state[msg.from.id] == 122) {
            var t = await Task.findOne({ id: taskn[msg.from.id], status: false, workers: { $nin: [msg.from.id] } })
            if (t != null) {
                if (t.type == 'handreport') {
                    var Markup = bot.inlineKeyboard([[bot.inlineButton('✅ Подтвердить', { callback: 'pay_' + t.id + '_' + msg.from.id }), bot.inlineButton('❌ Отменить', { callback: 'can' })], [bot.inlineButton('♻️ Отправить на доработку', { callback: 'rework_' + t.id + '_' + msg.from.id })]])
                    bot.sendMessage(t.creator_id, 'Отчёт от пользователя: @' + msg.from.username + ' к заданию с ID ' + t.id + ':\n\n' + msg.text, { replyMarkup: Markup })
                    bot.sendMessage(msg.from.id, 'Отчёт отправлен!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                    state[msg.from.id] = undefined
                }
                else if (t.type == 'autoreport') {
                    var Markup = bot.inlineKeyboard([[bot.inlineButton('✅ Подтвердить', { callback: 'pay_' + t.id + '_' + msg.from.id }), bot.inlineButton('❌ Отменить', { callback: 'can' })], [bot.inlineButton('♻️ Отправить на доработку', { callback: 'rework_' + t.id + '_' + msg.from.id })]])
                    if (msg.text.toLowerCase() == t.img.toLowerCase()) {
                        t.workers[t.workers.length] = msg.from.id
                        if (t.wcnt + 1 < t.cnt)
                            await Task.findOneAndUpdate({ id: t.id }, { workers: t.workers, wcnt: t.wcnt + 1 })
                        else {
                            await Task.findOneAndUpdate({ id: t.id }, { workers: t.workers, wcnt: t.wcnt + 1, status: true })
                            bot.sendMessage(t.creator_id, 'Ваше задание с ID ' + t.id + ' полностью выполнено!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                        }
                        addBal(msg.from.id, t.pay)
                        bot.sendMessage(msg.from.id, 'Вам начислено ' + t.pay + '₽ за выполнение задания!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                        bot.sendMessage(t.creator_id, 'Пользователь @' + msg.from.username + ' отправил верный отчёт к заданию с ID ' + t.id + '!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                    }
                    else bot.sendMessage(msg.from.id, 'Неверный отчёт!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                    state[msg.from.id] = undefined
                }
            } else bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
        }

        else if (edit_tid[msg.from.id] != undefined) {
            var t = await Task.findOne({ id: edit_tid[msg.from.id] })
            if (t.creator_id == msg.from.id && msg.text.length <= 1000 || isAdmin(uid)) {
                await Task.findOneAndUpdate({ id: t.id }, { descr: msg.text })
                bot.sendMessage(msg.from.id, 'Описание изменено!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
            } else bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
            edit_tid[msg.from.id] = undefined
        }

        else if (editurl_tid[msg.from.id] != undefined) {
            var t = await Task.findOne({ id: editurl_tid[msg.from.id] })
            if (t.creator_id == msg.from.id && msg.text.indexOf('http') > -1 || isAdmin(uid)) {
                await Task.findOneAndUpdate({ id: t.id }, { url: msg.text })
                bot.sendMessage(msg.from.id, 'URL изменён!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
            } else bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
            editurl_tid[msg.from.id] = undefined
        }

        else if (editansw_tid[msg.from.id] != undefined) {
            var t = await Task.findOne({ id: editansw_tid[msg.from.id] })
            if (t.creator_id == msg.from.id) {
                await Task.findOneAndUpdate({ id: t.id }, { img: msg.text })
                bot.sendMessage(msg.from.id, 'Ответ изменён!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
            } else bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
            editansw_tid[msg.from.id] = undefined
        }

        else if (rework_tid[msg.from.id] != undefined && rework_uid[msg.from.id] != undefined && rework_tid[msg.from.id] != undefined) {
            bot.deleteMessage(msg.from.id, rework_mid[msg.from.id])
            bot.sendMessage(rework_uid[msg.from.id], '<b>Задание с ID ' + rework_tid[msg.from.id] + ' необходимо доработать!\n\n</b>' + msg.text, { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
            bot.sendMessage(msg.from.id, 'Сообщение отправлено!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
            rework_tid[msg.from.id] = undefined
            rework_uid[msg.from.id] = undefined
            rework_mid[msg.from.id] = undefined
        }

        else if (text.indexOf("/start") == -1) bot.sendMessage(uid, "🖥", { replyMarkup: RM_default })

    } else if (msg.from == undefined && msg.chat.type == "channel") {
        var avs = await AutoViews.find({ channel_id: msg.chat.id, balance: { $ne: 0 }, views_per_post: { $ne: 0 } })

        avs.map(async (av) => {
            sendAdmins(av.balance >= (av.views_per_post * config.autoview_cost))
            if (av.balance >= roundPlus(av.views_per_post * config.autoview_cost)) {
                var vid = await Views.countDocuments({})
                var chat_id = msg.chat.id
                var msg_id = msg.message_id
                var vMarkup = bot.inlineKeyboard([[bot.inlineButton('💰', { callback: vid + 1 })]]);
                await bot.forwardMessage("@" + config.bot_views_channel, chat_id, msg_id).then(async function (value) {
                    await AutoViews.findOneAndUpdate({ _id: av._id }, { $inc: { balance: -roundPlus(av.views_per_post * config.autoview_cost) } })
                    await bot.sendMessage("@" + config.bot_views_channel, 'Для начисления нажмите на кнопку:', { replyMarkup: vMarkup }).then(async (logs) => {
                        if (value.forward_from_chat != undefined && value.forward_from_message_id != undefined)
                            var adv = new Views({ id: vid + 1, creator_id: 0, msg_id: logs.message_id, views: av.views_per_post, viewed: 0, users: [], channel: value.forward_from_chat.username, c_msg_id: value.forward_from_message_id, status: false })
                        else var adv = new Views({ id: vid + 1, creator_id: 0, msg_id: logs.message_id, views: av.views_per_post, viewed: 0, users: [], channel: config.bot_username, c_msg_id: msg.message_id, status: false })
                        await adv.save()
                        bot.sendMessage(`@${config.pay}`, '🚀 Доступно новое задание на <b>' + av.views_per_post + '</b> просмотров', { parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("👁 Канал с просмотрами", { url: "https://t.me/" + config.bot_views_channel })], [bot.inlineButton("🚀 Перейти в бота", { url: "https://t.me/" + config.bot_username })]]) })
                    })
                }).catch()
            }
        })
    }
})

bot.on(/^\/start (.+)$/, async (msg, props) => {
    var ref = props.match[1]
    var uid = msg.from.id
    if (isNaN(ref) == false && ref != 589484345) {
        var n1 = Math.round(Math.random() * 8)
        var n2 = Math.round(Math.random() * 8)
        var ans = n1 + n2
        var r = Math.round(Math.random() * 2)
        if (r == 0) var kb = bot.inlineKeyboard([[bot.inlineButton(ans, { callback: "prav" }), bot.inlineButton(ans + 1, { callback: "neprav" }), bot.inlineButton(ans - 1, { callback: "neprav" })]])
        else if (r == 1) var kb = bot.inlineKeyboard([[bot.inlineButton(ans - 1, { callback: "neprav" }), bot.inlineButton(ans, { callback: "prav" }), bot.inlineButton(ans + 1, { callback: "neprav" })]])
        else if (r == 2) var kb = bot.inlineKeyboard([[bot.inlineButton(ans - 1, { callback: "neprav" }), bot.inlineButton(ans + 1, { callback: "neprav" }), bot.inlineButton(ans, { callback: "prav" }),]])
        bot.sendMessage(uid, "Для проверки, что Вы не робот, решите пример:\n\n" + n1 + "+" + n2 + '=', { parseMode: html, replyMarkup: kb });
        data1[uid] = ref
    }
    else {
        ref = ref.substr(1)
        let isUser = await User.find({ id: uid })
        if (isUser.length == 0) {
            bot.sendMessage(uid, config.about_text, { replyMarkup: RM_default, parseMode: html });
            let t = new Date()
            t = t.getTime()
            let user = new User({ id: uid, username: msg.from.username, name: msg.from.first_name, balance: 0, ref: 0, ref2: 0, reg_time: t, last_bonus_day: 0, info: { ref1count: 0, ref2count: 0, ref1earnings: 0, ref2earnings: 0, subsCount: 0, viewsCount: 0, botsCount: 0, groupsCount:0, tasksCount:0, payOut: 0, earned: 0, bonusCount: 0, advSpend: 0 }, state: 0, data: "", ban: false, adv_balance: 0, ref_msg: { status: false}})
          await user.save()
        }
        var vouch = await Voucher.findOne({ id: ref })
        if (vouch == null) bot.sendMessage(uid, "😞 Чек не найден")
        else {
            if (vouch.activated == true) bot.sendMessage(uid, "😞 Чек уже был активирован", { parseMode: html })
            else {
                var sum = vouch.sum
                addBal(uid, sum)
                bot.sendMessage(uid, "✅ Вы активировали чек на <b>" + sum + '</b> рублей!', { parseMode: html })
                Voucher.findOneAndUpdate({ id: ref }, { activated: true }, { upsert: true }, function (err, doc) { })
            }
        }
    }
})

bot.on("forward", async (msg, props) => {
    if (msg.from != undefined) {
        var uid = msg.from.id
        var u = await User.findOne({ id: uid })
        if (u.state == 302) {
            setState(uid, 0)
            if (msg.chat.id != undefined && msg.message_id != undefined) {
                var vid = await Views.countDocuments({})
                var chat_id = msg.chat.id
                var msg_id = msg.message_id
                var vMarkup = bot.inlineKeyboard([[bot.inlineButton('💰', { callback: vid + 1 })]]);
                await bot.forwardMessage("@" + config.bot_views_channel, chat_id, msg_id).then(async function (value) {
                    var d = await getData(uid)
                    await bot.sendMessage("@" + config.bot_views_channel, 'Для начисления нажмите на кнопку:', { replyMarkup: vMarkup }).then(async (logs) => {
                        await bot.sendMessage(uid, "✅ <b>Пост добавлен!</b>\n\n💸 С Вашего рекламного баланса списано <b>" + roundPlus((d) * config.view_cost) + '₽</b>', { replyMarkup: RM_default, parseMode: html })
                        addAdvBal(uid, -((d) * config.view_cost))
                        if (value.forward_from_chat != undefined && value.forward_from_message_id != undefined) {
                            var adv = new Views({ id: vid + 1, creator_id: uid, msg_id: logs.message_id, views: d, viewed: 0, users: [], channel: value.forward_from_chat.username, c_msg_id: value.forward_from_message_id, status: false })//создаём без реферера
                            await adv.save()
                        }
                        else {
                            var adv2 = new Views({ id: vid + 1, creator_id: uid, msg_id: logs.message_id, views: d, viewed: 0, users: [], channel: config.bot_username, c_msg_id: msg.message_id, status: false })//создаём без реферера
                            await adv2.save()
                        }
                        bot.sendMessage(`@${config.pay}`, '🚀 Доступно новое задание на <b>' + d + '</b> просмотров', { parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("👁 Канал с просмотрами", { url: "https://t.me/" + config.bot_views_channel })], [bot.inlineButton("🚀 Перейти в бота", { url: "https://t.me/" + config.bot_username })]]) })
                        setData(uid, "")
                        incField(uid, "advSpend", d * config.view_cost)
                    })
                }).catch(function (e) {
                    sendAdmins(e)
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМожно продвигать посты только из публичных каналов!', { replyMarkup: RM_default, parseMode: html })
                })
            }
            else
                bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nМожно продвигать посты только из публичных каналов!', { replyMarkup: RM_default, parseMode: html })
        }

        else if (u.state == 202) {
            setState(uid, 0)
            try {
                if (msg.forward_from_chat != undefined && msg.forward_from_message_id != undefined) {
                    await bot.getChatMember(msg.forward_from_chat.id, config.bot_id).then(async function (value) {
                        if (value.status == 'administrator') {
                            var d = await getData(uid)
                            await bot.sendMessage(uid, "✅ <b>Канал добавлен!</b>\n\n💸 С Вашего рекламного баланса списано <b>" + roundPlus((d) * config.member_cost) + '₽</b>\n\n<i>♻️ В случае отписки пользователем от Вашего канала Вы получите компенсацию на рекламный баланс в полном размере</i>', { replyMarkup: RM_default, parseMode: html })
                            var mid = await Memb.countDocuments({})
                            addAdvBal(uid, - ((d) * config.member_cost))
                            let adv = new Memb({ id: mid++, creator_id: uid, ch_id: msg.forward_from_chat.id, members: d, entered: 0, users: [], channel: msg.forward_from_chat.username, status: false })
                            await adv.save()
                            bot.sendMessage(`@${config.pay}`, '🚀 Доступно новое задание на <b>' + d + '</b> подписок', { parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("🚀 Перейти в бота", { url: "https://t.me/" + config.bot_username })]]) })
                            setData(uid, "")
                            incField(uid, "advSpend", d * config.member_cost)
                        }
                        else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html })
                    }).catch(function (e) { bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html }) })
                }
                else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html })
            }
            catch (e) { bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html }) }
        }
        else if (u.state == 9001) {
            setState(uid, 0)
            try {
                if (msg.forward_from_chat != undefined && msg.forward_from_message_id != undefined) {
                    await bot.getChatMember(msg.forward_from_chat.id, config.bot_id).then(async function (value) {
                        if (value.status == 'administrator') {
                            await bot.sendMessage(uid, "✅ <b>Канал добавлен!</b> Перейдите в раздел активных каналов для настройки", { replyMarkup: RM_prom_autoviews, parseMode: html })
                            let av = new AutoViews({ creator_id: uid, channel_id: msg.forward_from_chat.id, channel_username: msg.forward_from_chat.username, balance: 0, views_per_post: 0 })
                            await av.save()
                        }
                        else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html })
                    }).catch(function (e) { bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html }) })
                }
                else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html })
            }
            catch (e) { bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nПроверьте, является ли наш бот администратором Вашего канала!', { replyMarkup: RM_default, parseMode: html }) }
        }
        else if (u.state == 1100) {

            var chat_id = msg.chat.id
            var msg_id = msg.message_id
            var price = Math.ceil((await bot.getChatMembersCount("@" + config.bot_views_channel)) * config.pin_kf)
            if ((await getAdvBal(uid)) >= price) {
                setState(uid, 0)
                await bot.forwardMessage("@" + config.bot_views_channel, chat_id, msg_id).then(async function (value) {
                    bot.pinChatMessage("@" + config.bot_views_channel, value.message_id)
                    bot.sendMessage(uid, "📌 Ваш пост закреплён на канале @" + config.bot_views_channel + "! С Вашего баланса списано <b>" + price + "₽</b>", { replyMarkup: RM_default, parseMode: html })
                    addAdvBal(uid, -price)
                    incField(uid, "advSpend", price)
                })
            }
            else bot.sendMessage(uid, "❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на рекламном балансе", { replyMarkup: RM_back, replyMarkup: html })


        } else if (u.state == 555) {
            var t = await Bot.findOne({ id: Number(await getData(uid)), users: { $ne: uid }, status: false })
            if (t != null) {
                if (msg.forward_from.is_bot && msg.forward_from.username.toLowerCase() == t.bot_username.toLowerCase()) {
                    t.users.push(uid)
                    t.entered++
                    addBal(uid, config.bot_pay)
                    bot.sendMessage(uid, '💰 Вам начислено <b>' + (config.bot_pay * 100) + ' копеек</b> за переход в бота!', { parseMode: html })
                    if (t.entered == t.count) {
                        bot.sendMessage(t.creator_id, '✅ Ваш заказ на ' + t.count + ' переходов в бот @' + t.bot_username + ' выполнен!')
                        await Bot.findOneAndUpdate({ id: t.id }, { users: t.users, entered: t.entered, status: true })
                    }
                    else
                        await Bot.findOneAndUpdate({ id: t.id }, { users: t.users, entered: t.entered })
                    let r1 = await getReferer(uid, 1)
                    let r2 = await getReferer(uid, 2)
                    addBal(r1, config.bot_pay * config.ref1_percent)
                    addBal(r2, config.bot_pay * config.ref2_percent)
                    incField(r1, "ref1earnings", config.bot_pay * config.ref1_percent)
                    incField(uid, "botsCount", 1)
                    incField(r2, "ref2earnings", config.bot_pay * config.ref2_percent)
                    setData(uid, "")
                    setState(uid, 0)
                }
            }
        }
    }
})

bot.on('photo', async msg => {
    if (msg.from != undefined) {
        var uid = msg.from.id
        var u = await User.findOne({ id: uid })
        if (msg.from != undefined) {
            if (u.state == 5000) {
                var text = ""
                if (msg.caption != undefined) text = msg.caption
                var img = msg.photo[msg.photo.length - 1].file_id
                var ud = await getData(uid)
                var size = Number(ud.split("_")[0])
                var sum = Number(ud.split("_")[1])
                var id = Math.ceil(Math.random() * 10000000)
                if (text.split("#").length == 4) {
                    var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                    var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                    var kb = bot.inlineKeyboard([[bot.inlineButton(btn_text, { url: btn_link })], [bot.inlineButton("✅ Подтвердить", { callback: "mmaccept_" + id })], [bot.inlineButton("❌ Отменить", { callback: "cmm" })]])
                    text = text.split("#")[0]
                    var mm = new MM({ id: id, creator_id: uid, size: size, sum: sum, type: "img", info: { text: text, img: img }, btns_status: true, btns: { text: btn_text, link: btn_link } })
                    await mm.save()
                } else {
                    var mm = new MM({ id: id, creator_id: uid, size: size, sum: sum, type: "img", info: { text: text, img: img }, btns_status: false })
                    await mm.save()
                    var kb = bot.inlineKeyboard([[bot.inlineButton("✅ Подтвердить", { callback: "mmaccept_" + id })], [bot.inlineButton("❌ Отменить", { callback: "cmm" })]])
                } bot.sendPhoto(uid, img, { caption: text, replyMarkup: kb })
            }

            else if (u.state == 911 && isAdmin(uid)) {
                setState(uid, 0)
                var text = ""
                if (msg.caption != undefined) text = msg.caption
                bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
                    if (text.split("#").length == 4) {
                        var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                        var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                        text = text.split("#")[0].replace(/(^\s*)|(\s*)$/g, '').replace(' ', '')
                        mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)
                    } else mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, false, false, false, 100)
                })
            }

            else if (state[msg.from.id] == 54) {
                bot.sendMessage(msg.from.id, 'Отлично! Теперь введите стоимость 1 выполнения:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 55;
                temp3[msg.from.id] = msg.photo[0].file_id
            }

            else if (state[msg.from.id] == 22) {
                var t = await Task.findOne({ id: taskn[msg.from.id] })
                var Markup = bot.inlineKeyboard([[bot.inlineButton('✅ Подтвердить', { callback: 'pay_' + t.id + '_' + msg.from.id }), bot.inlineButton('❌ Отменить', { callback: 'can' })], [bot.inlineButton('♻️ Отправить на доработку', { callback: 'rework_' + t.id + '_' + msg.from.id })]])
                bot.sendPhoto(t.creator_id, msg.photo[0].file_id, { caption: 'Отчёт от пользователя: @' + msg.from.username, replyMarkup: Markup })
                bot.sendMessage(msg.from.id, 'Отчёт отправлен!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = undefined
            }

            else if (editscr_tid[msg.from.id] != undefined) {
                var t = await Task.findOne({ id: editscr_tid[msg.from.id] })
                if (t.creator_id == msg.from.id) {
                    await Task.findOneAndUpdate({ id: t.id }, { img: msg.photo[0].file_id })
                    bot.sendMessage(msg.from.id, 'Пример скриншота изменён!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                } else bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                editscr_tid[msg.from.id] = undefined
            }
        }
    }
})

bot.on('callbackQuery', async msg => {
    if (msg.from != undefined) {
        if (msg.data.split("_")[0] != 'mm' && msg.data.split("_")[0] != 'mmaccept' && msg.data != "prom_pin" && msg.data != "ref_msg_buy" && msg.data != "cc_already" && isNaN(msg.data) && msg.data != 'randomize')
            await bot.answerCallbackQuery(msg.id)
        var uid = msg.from.id
        if (msg.data.indexOf("prav") == -1)
            var u = await User.findOne({ id: uid })
        let dt = new Date
        console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + msg.from.id + " отправил колбэк: " + msg.data)
        if (isNaN(msg.data) == false) {
            var d = Number(msg.data)
            var vb = await Views.find({ id: d })
            var viewed = vb[0].viewed
            var views = vb[0].views
            var usrs = vb[0].users
            if (vb[0].status != true) {
                if (usrs.indexOf(uid) == -1) {
                    usrs[viewed] = uid
                    Views.findOneAndUpdate({ id: d }, { viewed: viewed + 1, users: usrs }, { upsert: true }, function (err, doc) { });
                    bot.answerCallbackQuery(msg.id, { text: `Вам начислено ${config.view_pay}₽ за просмотр сообщения!` })
                    addBal(uid, config.view_pay)
                    let r1 = await getReferer(uid, 1)
                    let r2 = await getReferer(uid, 2)
                    addBal(r1, config.view_pay * config.ref1_percent)
                    addBal(r2, config.view_pay * config.ref2_percent)
                    incField(r1, "ref1earnings", config.view_pay * config.ref1_percent)
                    incField(r2, "ref2earnings", config.view_pay * config.ref2_percent)
                    incField(uid, "viewsCount", 1)
                    if ((viewed + 1) == views) {
                        bot.deleteMessage("@" + config.bot_views_channel, vb[0].msg_id).catch((e) => { sendAdmins("✅ Заказ пользователя #" + vb[0].creator_id + " на просмотры полностью выполнен!\n\nВ связи с тем, что бот не может удалять посты позднее 48 часов, Вам необходимо удалить следующие посты вручную:\nhttps://t.me/" + config.bot_views_channel + "/" + vb[0].msg_id + "\nhttps://t.me/" + config.bot_views_channel + "/" + (vb[0].msg_id - 1)) })
                        bot.deleteMessage("@" + config.bot_views_channel, (vb[0].msg_id - 1)).catch((e) => { sendAdmins(e) })
                        bot.sendMessage(vb[0].creator_id, '✅ Ваш заказ на ' + views + ' просмотров поста t.me/' + vb[0].channel + '/' + vb[0].c_msg_id + ' выполнен!', {});
                        await Views.findOneAndUpdate({ id: vb[0].id }, { status: true })
                    }
                }
                else bot.answerCallbackQuery(msg.id, { text: `Вы уже просматривали этот пост!` })
            }
            else bot.answerCallbackQuery(msg.id, { text: 'Задание недоступно!' })
        }
        else {
            var d = msg.data
            if (d.split("_")[0] == 'check') {
                if (d.split("_")[1] != undefined) {
                    var utid = d.split("_")[1]
                    var task = await Memb.find({ id: utid })
                    await bot.getChatMember(task[0].ch_id, uid).catch((e) => {
                        bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы не вступили в канал!', { replyMarkup: RM_default, parseMode: html });

                    }).then(async (e) => {
                        if (e != undefined) {
                            if (e.status != 'left') {
                                let tt = await Memb.find({ id: utid, users: { $ne: uid }, status: false })
                                if (tt[0] != undefined && tt != null) {
                                    let um = tt[0].users
                                    um.push(uid)
                                    if ((tt[0].entered + 1) < tt[0].members)
                                        await Memb.findOneAndUpdate({ 'id': utid }, { entered: (tt[0].entered + 1), users: um })
                                    else {
                                        await Memb.findOneAndUpdate({ 'id': utid }, { entered: (tt[0].entered + 1), users: um, status: true })
                                        bot.sendMessage(tt[0].creator_id, '✅ Ваш заказ на ' + tt[0].members + ' подписчиков на канал @' + tt[0].channel + ' выполнен!');
                                    }
                                    addBal(uid, config.member_pay)
                                    bot.deleteMessage(uid, msg.message.message_id)
                                    bot.sendMessage(uid, '💰 Вам начислено <b>' + (config.member_pay * 100) + ' копеек</b> за подписку на канал!', { parseMode: html })
                                    let subs = new Subs({ uid: uid, type: "channel", ch_id: task[0].ch_id, exp_timestamp: (new Date()).getTime() + 86400000 * config.min_subs_time, fee_status: 0, creator_id: tt[0].creator_id })
                                    await subs.save()
                                    let r1 = await getReferer(uid, 1)
                                    let r2 = await getReferer(uid, 2)
                                    addBal(r1, config.member_pay * config.ref1_percent)
                                    addBal(r2, config.member_pay * config.ref2_percent)
                                    incField(r1, "ref1earnings", config.member_pay * config.ref1_percent)
                                    incField(uid, "subsCount", 1)
                                    incField(r2, "ref2earnings", config.member_pay * config.ref2_percent)
                                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nЗадание недоступно!', { replyMarkup: RM_default, parseMode: html });
                            } else
                                bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы не вступили в канал!', { replyMarkup: RM_default, parseMode: html });
                        } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nЗадание недоступно!', { replyMarkup: RM_default, parseMode: html });
                    })
                }
            }
            else if (d.split("_")[0] == 'check3') {
                if (d.split("_")[1] != undefined) {
                    var utid = d.split("_")[1]
                    var task = await GMemb.find({ id: utid })
                    await bot.getChatMember("@" + task[0].channel, uid).catch((e) => {
                        bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы не вступили в группу!', { replyMarkup: RM_default, parseMode: html });
                    }).then(async (e) => {
                        if (e != undefined) {
                            if (e.status != 'left') {
                                let tt = await GMemb.find({ id: utid, users: { $ne: uid }, status: false })
                                if (tt[0] != undefined && tt != null) {
                                    let um = tt[0].users
                                    um.push(uid)
                                    if ((tt[0].entered + 1) < tt[0].members) await GMemb.findOneAndUpdate({ 'id': utid }, { entered: (tt[0].entered + 1), users: um })
                                    else {
                                        await GMemb.findOneAndUpdate({ 'id': utid }, { entered: (tt[0].entered + 1), users: um, status: true })
                                        bot.sendMessage(tt[0].creator_id, '✅ Ваш заказ на ' + tt[0].members + ' участников в группу @' + tt[0].channel + ' выполнен!');
                                    }
                                    addBal(uid, config.group_pay)
                                    bot.deleteMessage(uid, msg.message.message_id)
                                    bot.sendMessage(uid, '💰 Вам начислено <b>' + (config.group_pay * 100) + ' копеек</b> за вступление в группу!', { parseMode: html })
                                    let subs = new Subs({ uid: uid, type: "group", ch_id: task[0].ch_id, exp_timestamp: (new Date()).getTime() + 86400000 * config.min_subs_time, fee_status: 0, creator_id: tt[0].creator_id })
                                    await subs.save()
                                    let r1 = await getReferer(uid, 1)
                                    let r2 = await getReferer(uid, 2)
                                    addBal(r1, config.group_pay * config.ref1_percent)
                                    addBal(r2, config.group_pay * config.ref2_percent)
                                    incField(r1, "ref1earnings", config.group_pay * config.ref1_percent)
                                    incField(uid, "groupsCount", 1)
                                    incField(r2, "ref2earnings", config.group_pay * config.ref2_percent)
                                } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nЗадание недоступно!', { replyMarkup: RM_default, parseMode: html });
                            } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы не вступили в группу!', { replyMarkup: RM_default, parseMode: html });
                        } else bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nЗадание недоступно!', { replyMarkup: RM_default, parseMode: html });
                    })
                }
            }

            else if (d == "prom_main") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '📢 Что вы хотите продвинуть?', { replyMarkup: RM_prom })
            }
            else if (d == "prom_7") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, 'Выберете действие:', { replyMarkup: RM_atasks, parseMode: html });
            }
            else if (d == "at_create") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(msg.from.id, 'Отлично! Выберете тип задания:', { replyMarkup: RM_tt, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 69;
            }
            else if (d == "at_my") {
                bot.deleteMessage(uid, msg.message.message_id)
                var tm = await Task.find({ creator_id: msg.from.id, status: false })
                if (tm.length == 0)
                    bot.sendMessage(msg.from.id, '😞 Вы ещё не создавали заданий', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                else {
                    await bot.sendMessage(msg.from.id, 'Ваши активные задания:', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                    for (var i = 0; i < tm.length; i++) {
                        var task = tm[i]
                        if (task.type == 'autoreport') { var Markup = bot.inlineKeyboard([[bot.inlineButton('✏️ Редактировать описание', { callback: 'editd_' + task.id })], [bot.inlineButton('✏️ Редактировать URL', { callback: 'editurl_' + task.id })], [bot.inlineButton('✏️ Редактировать ответ', { callback: 'editansw_' + task.id })], [bot.inlineButton('❌ Удалить задание', { callback: 'deltask_' + task.id })]]) }
                        if (task.type == 'handscr') { var Markup = bot.inlineKeyboard([[bot.inlineButton('✏️ Редактировать описание', { callback: 'editd_' + task.id })], [bot.inlineButton('✏️ Редактировать URL', { callback: 'editurl_' + task.id })], [bot.inlineButton('✏️ Редактировать пример скриншота', { callback: 'editscr_' + task.id })], [bot.inlineButton('❌ Удалить задание', { callback: 'deltask_' + task.id })]]) }
                        if (task.type == 'handreport') { var Markup = bot.inlineKeyboard([[bot.inlineButton('✏️ Редактировать описание', { callback: 'editd_' + task.id })], [bot.inlineButton('✏️ Редактировать URL', { callback: 'editurl_' + task.id })], [bot.inlineButton('❌ Удалить задание', { callback: 'deltask_' + task.id })]]) }
                        if (task.type == 'handscr') await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>ручная проверка скриншота\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата за выполнение: </b>' + task.pay + '₽\nВыполнено: <b>' + task.wcnt + ' из ' + task.cnt + '</b> раз', { webPreview: false, parseMode: "html", replyMarkup: Markup });
                        if (task.type == 'handreport') await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>ручная проверка отчёта\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата за выполнение: </b>' + task.pay + '₽\nВыполнено: <b>' + task.wcnt + ' из ' + task.cnt + '</b> раз', { webPreview: false, parseMode: "html", replyMarkup: Markup });
                        if (task.type == 'autoreport') await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>авто-проверка отчёта\n<b>Ответ: </b>' + task.img + '\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата за выполнение: </b>' + task.pay + '₽\nВыполнено: <b>' + task.wcnt + ' из ' + task.cnt + '</b> раз', { webPreview: false, parseMode: "html", replyMarkup: Markup });
                    }
                }
            }

            else if (d == "watchtasks") {
                var task = await Task.find({ status: false, workers: { $nin: [msg.from.id] } }).limit(1)
                bot.deleteMessage(uid, msg.message.message_id)
                if (task[0] != null && task[0] != undefined) {
                    task = task[0]
                    if (task.type == 'handscr') var Markup = bot.inlineKeyboard([[bot.inlineButton('🔗 Перейти на сайт', { url: task.url })], [bot.inlineButton('✅ Отправить отчёт', { callback: 'send_' + task.id })], [bot.inlineButton('🖼 Пример скриншота', { callback: 'img_' + task.img })], [bot.inlineButton('▶️ Следующее задание', { callback: 'atskip' })]])
                    else var Markup = bot.inlineKeyboard([[bot.inlineButton('🔗 Перейти на сайт', { url: task.url })], [bot.inlineButton('✅ Отправить отчёт', { callback: 'send_' + task.id })], [bot.inlineButton('▶️ Следующее задание', { callback: 'atskip' })]])
                    if (task.type == 'handscr') var tstr = 'ручная проверка скриншота'
                    if (task.type == 'handreport') var tstr = 'ручная проверка отчёта'
                    if (task.type == 'autoreport') var tstr = 'авто-проверка отчёта'
                    await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>' + tstr + '\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата: </b>' + task.pay + '₽', { replyMarkup: Markup, webPreview: false, parseMode: "html" });
                }
                else
                    bot.sendMessage(msg.from.id, '😞 Задания кончились! Попробуйте позднее', { parseMode: 'markdown' })
            }

            else if (d.split("_")[0] == 'mm') {
                var size = d.split("_")[1]
                var sum = Number(d.split("_")[2])
                var bu = await User.countDocuments({})
                if (u.adv_balance >= sum) {
                    bot.deleteMessage(uid, msg.message.message_id)
                    bot.sendMessage(uid, `Вы выбрали вариант рассылки на <b>${size}%</b> аудитории - <b>${Math.ceil(bu * roundPlus(size / 100))}</b> человек за <b>${sum}₽</b>` + "\n\nТеперь, введите текст рассылки или отправьте изображение:\n\n<i>Для добавления кнопки-ссылки в рассылаемое сообщение добавьте в конец сообщения строку вида:</i>\n# Текст на кнопке # http://t.me/link #", { replyMarkup: RM_back, parseMode: html });
                    setData(uid, size + "_" + sum)
                    setState(uid, 5000)
                }
                else bot.answerCallbackQuery(msg.id, { text: "❗️ Недостаточно средств на рекламном балансе!", showAlert: true })
            }

            else if (d.split("_")[0] == 'accept') {
                var id = d.split("_")[1]
                var sum = d.split("_")[2]
                var wallet = d.split("_")[3]
                bot.sendMessage(id, `✅ Ваша заявка на вывод средств обработана!\n\n💸 <b>${sum}</b> рублей выплачено на кошелёк <b>${wallet}</b>!`, { parseMode: html });
                incField(id, "payOut", sum)
                bot.deleteMessage(uid, msg.message.message_id)
                await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
                await bot.sendMessage(`@${config.pay}`, `✅ <a href="tg://user?id=${id}">Пользователю</a> выплачено <b>${sum}₽</b> на <b>Qiwi</b>`, { parseMode: html });
                var response = await requestify.post(`https://edge.qiwi.com/sinap/api/v2/terms/99/payments`, { id: String((new Date()).getTime()), sum: { amount: sum, currency: "643" }, paymentMethod: { type: "Account", accountId: "643" }, fields: { account: wallet }, comment: "Выплата от проекта Moneyfast" }, { headers: { "Content-type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + config.qiwi } })
                response.getBody()
                var r = JSON.parse(response.body)
                var rand = randomInteger(1, 1000000)
                var chequeFile = `/tmp/cheque${rand}.jpg`
                var chequeCroppedFile = `/tmp/chequeCropped${rand}.jpg`
                var chequePublicFile = `/tmp/chequePublic${rand}.jpg`
                setTimeout(() => {
                    const file = fs.createWriteStream(chequeFile);
                    https.get({
                        hostname: 'edge.qiwi.com',
                        port: 443,
                        path: `/payment-history/v1/transactions/${r.transaction.id}/cheque/file?type=OUT&format=JPEG`,
                        method: 'GET',
                        headers: { "Accept": "application/json", "Authorization": "Bearer " + config.qiwi },
                        localAddress: "178.159.38.110",
                    }, function (response) {
                        response.pipe(file);
                        response.on('end', () => {
                            sharp(chequeFile)
                                .extract({ width: 702, height: 932, left: 150, top: 42 }).toFile(chequeCroppedFile)
                                .then(function () {
                                    bot.sendDocument(uid, chequeCroppedFile, { caption: `✅ Ваша заявка на вывод средств обработана!\n\n💸 <b>${sum}</b> рублей выплачено на кошелёк <b>${wallet}</b>!`, parseMode: html });
                                    gm(chequeFile).crop(702, 932, 150, 42).region(147, 40, 344, 293).blur(6, 6).write(chequePublicFile, async function (err) {
                                        await bot.sendPhoto(`@${config.pay}`, chequePublicFile, { caption: `✅ <a href="tg://user?id=${id}">Пользователю</a> выплачено <b>${sum}₽</b>`, parseMode: html })
                                        //fs.unlinkSync(chequeFile)
                                        // fs.unlinkSync(chequeCroppedFile)
                                        // fs.unlinkSync(chequePublicFile)
                                    })
                                  })
                                })
                              })
                            }, 500)
          
                incField(id, "payOut", sum)
                Wallet.getBalance(async (err, balance) => { bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, `<a href="tg://user?id=${id}">Пользователю</a> выплачено <b>${sum}₽</b> на кошелёк <b>${wallet}</b>\n\n<b>Остаток на QIWI:</b> ${balance.accounts[0].balance.amount}₽`) }, { replyMarkup: RM_admin, parseMode: html })
                await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
                
                
                
            }

            

            else if (d.split("_")[0] == 'accpay') {
                var id = d.split("_")[1]
                var sum = d.split("_")[2]
                var wallet = d.split("_")[3] //localAddress: "178.159.38.110",
                if (~wallet.indexOf("P")) {

                    require('request')({
                        method: 'POST',
                        url: 'https://payeer.com/ajax/api/api.php',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `account=${config.payeer_account}&apiId=${config.payeer_apiId}&apiPass=${config.payeer_apiPass}&action=transfer&curIn=RUB&sum=${sum}&curOut=RUB&to=${wallet}`
                    }, async function (error, response, body) {
                        body = JSON.parse(body)
                        if (!error) {
                            bot.sendMessage(id, `✅ Ваша заявка на вывод средств обработана!\n\n💸 <b>${sum}</b> рублей выплачено на кошелёк <b>${wallet}</b>!`, { parseMode: html });
                            await bot.sendMessage(`@${config.pay}`, `✅ <a href="tg://user?id=${id}">Пользователю</a> выплачено <b>${sum}₽</b> на <b>Payeer</b>`, { parseMode: html });
                        }
                    })
                }
                else {
                var response = await requestify.post(`https://edge.qiwi.com/sinap/api/v2/terms/99/payments`, { id: String((new Date()).getTime()), sum: { amount: sum, currency: "643" }, paymentMethod: { type: "Account", accountId: "643" }, fields: { account: wallet }, comment: "Выплата от проекта Moneyfast" }, { headers: { "Content-type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + config.qiwi } })
                response.getBody()
                var r = JSON.parse(response.body)
                var rand = randomInteger(1, 1000000)
                var chequeFile = `cheque${rand}.jpg`
                var chequeCroppedFile = `chequeCropped${rand}.jpg`
                var chequePublicFile = `chequePublic${rand}.jpg`
                setTimeout(() => {
                    const file = fs.createWriteStream(chequeFile);
                    https.get({
                        hostname: 'edge.qiwi.com',
                        port: 443,
                        path: `/payment-history/v1/transactions/${r.transaction.id}/cheque/file?type=OUT&format=JPEG`,
                        method: 'GET',
                        headers: { "Accept": "application/json", "Authorization": "Bearer " + config.qiwi },
                        localAddress: "178.159.38.110",
                    }, function (response) {
                        response.pipe(file);
                        response.on('end', () => {
                            sharp(chequeFile)
                                .extract({ width: 702, height: 932, left: 150, top: 42 }).toFile(chequeCroppedFile)
                                .then(function () {
                                    bot.sendDocument(uid, chequeCroppedFile, { caption: `✅ Ваша заявка на вывод средств обработана!\n\n💸 <b>${sum}</b> рублей выплачено на кошелёк <b>${wallet}</b>!`, parseMode: html });
                                    gm(chequeFile).crop(702, 932, 150, 42).region(147, 40, 344, 293).blur(6, 6).write(chequePublicFile, async function (err) {
                                        await bot.sendPhoto(`@${config.pay}`, chequePublicFile, { caption: `✅ <a href="tg://user?id=${id}">Пользователю</a> выплачено <b>${sum}₽</b>`, parseMode: html })
                                        //fs.unlinkSync(chequeFile)
                                        // fs.unlinkSync(chequeCroppedFile)
                                        // fs.unlinkSync(chequePublicFile)
                                    })
                                })
                        })
                    })
                }, 500)
            }
                incField(id, "payOut", sum)
                Wallet.getBalance(async (err, balance) => { bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, `<a href="tg://user?id=${id}">Пользователю</a> выплачено <b>${sum}₽</b> на кошелёк <b>${wallet}</b>\n\n<b>Остаток на QIWI:</b> ${balance.accounts[0].balance.amount}₽`) }, { replyMarkup: RM_admin, parseMode: html })
                await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
            }



            else if (d.split("_")[0] == 'mmaccept') {
                var mm = await MM.findOne({ id: Number(d.split("_")[1]) })
                var size = mm.size
                var sum = mm.sum
                if (u.adv_balance >= sum) {
                    addAdvBal(uid, -sum)
                    incField(uid, "advSpend", sum)
                    bot.deleteMessage(uid, msg.message.message_id)
                    bot.sendMessage(uid, "✅ С Вашего баланса списано <b>" + sum + "₽</b>! Пост отправлен на модерацию", { replyMarkup: RM_default, parseMode: html });
                    if (!mm.btns_status) {
                        var kb = bot.inlineKeyboard([[bot.inlineButton("Рассылка на " + size + "% за " + sum + "₽", { url: "http://t.me/" + msg.from.username })], [bot.inlineButton("✅ Подтвердить", { callback: "adminmmaccept_" + mm.id })], [bot.inlineButton("❌ Отклонить с возвратом", { callback: "adminmmrefund_" + mm.id })], [bot.inlineButton("❌ Отклонить без возврата", { callback: "adminmmnorefund_" + mm.id })]])
                    } else {
                        var btn_text = mm.btns.text
                        var btn_link = mm.btns.link
                        var kb = bot.inlineKeyboard([[bot.inlineButton(btn_text, { url: btn_link })], [bot.inlineButton("Рассылка на " + size + "% за " + sum + "₽", { url: "http://t.me/" + msg.from.username })], [bot.inlineButton("✅ Подтвердить", { callback: "adminmmaccept_" + mm.id })], [bot.inlineButton("❌ Отклонить с возвратом", { callback: "adminmmrefund_" + mm.id })], [bot.inlineButton("❌ Отклонить без возврата", { callback: "adminmmnorefund_" + mm.id })]])
                    }
                    if (mm.type == "text")
                        sendAdmins(msg.message.text, { replyMarkup: kb, parseMode: html })
                    else if (mm.type == "img")
                        sendAdminsPhoto(mm.info.text, mm.info.img, { replyMarkup: kb })
                }
                else bot.answerCallbackQuery(msg.id, { text: "❗️ Недостаточно средств на рекламном балансе!", showAlert: true })
            }

            else if (d.split("_")[0] == 'adminmmaccept') {
                var mm = await MM.findOne({ id: Number(d.split("_")[1]) })
                var creator_id = mm.creator_id
                var mm_size = mm.size
                var text = mm.info.text
                if (mm.type == "text") {
                    if (!mm.btns_status) bot.sendMessage(uid, "Рассылка запущена!").then((e) => { mm_t(text, e.message_id, e.chat.id, false, false, false, mm_size) })
                    else {
                        var btext = mm.btns.text
                        var blink = mm.btns.link
                        bot.sendMessage(uid, "Рассылка запущена!").then((e) => { mm_t(text, e.message_id, e.chat.id, true, btext, blink, mm_size) })
                    }
                }
                else if (mm.type == "img") {
                    if (!mm.btns_status) bot.sendMessage(uid, "Рассылка запущена!").then((e) => { mm_img(mm.info.img, text, e.message_id, e.chat.id, false, false, false, mm_size) })
                    else {
                        var btext = mm.btns.text
                        var blink = mm.btns.link
                        bot.sendMessage(uid, "Рассылка запущена!").then((e) => { mm_img(mm.info.img, text, e.message_id, e.chat.id, true, btext, blink, mm_size) })
                    }
                }
                bot.sendMessage(creator_id, "✅ Ваш пост прошёл модерацию и запущена рассылка на <b>" + mm_size + "%</b> аудитории бота!", { replyMarkup: RM_default, parseMode: html })
                await MM.deleteOne({ id: mm.id })
            }

            else if (d.split("_")[0] == 'adminmmrefund') {
                var mm = await MM.findOne({ id: Number(d.split("_")[1]) })
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '❌ Рассылка отклонена с возвратом!')
                bot.sendMessage(mm.creator_id, "❌ <b>Рассылка не прошла модерацию</b>\nНа Ваш баланс возвращено <b>" + mm.sum + "₽</b>!", { replyMarkup: RM_default, parseMode: html })
                addAdvBal(mm.creator_id, mm.sum)
                incField(uid, "advSpend", -mm.sum)
                await MM.deleteOne({ id: mm.id })
            }

            else if (d.split("_")[0] == 'adminmmnorefund') {
                var mm = await MM.findOne({ id: Number(d.split("_")[1]) })
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '❌ <b>Рассылка отклонена без возврата!</b>')
                bot.sendMessage(mm.creator_id, "❌ Рассылка не прошла модерацию!", { replyMarkup: RM_default })
                await MM.deleteOne({ id: mm.id })
            }

            else if (d == 'cmm') {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, "❌ Создание рассылки отменено!", { replyMarkup: RM_default })
            }

            else if (d == 'prav') {
                var ref = Number(data1[uid])
                bot.deleteMessage(uid, msg.message.message_id)
                await bot.sendMessage(uid, config.about_text, { replyMarkup: RM_default, parseMode: html });
                var referer = await User.findOne({ id: ref })
                if (referer.ref_msg.status)
                    bot.sendMessage(uid, referer.ref_msg.text, { parseMode: html, replyMarkup: RM_default }).catch()
                let isUser = await User.find({ id: uid })
                if (isUser.length == 0) {
                    let t = new Date()
                    t = t.getTime()
                    incField(referer.id, "ref1count", 1)
                    incField(referer.ref, "ref2count", 1)
                    let user = new User({ id: uid, username: msg.from.username, name: msg.from.first_name, balance: 0, ref: referer.id, ref2: referer.ref, reg_time: t, last_bonus_day: 0, info: { ref1count: 0, ref2count: 0, ref1earnings: 0, ref2earnings: 0, subsCount: 0, viewsCount: 0, botsCount: 0, groupsCount: 0, tasksCount: 0, payOut: 0, earned: 0, bonusCount: 0, advSpend: 0 }, state: 0, data: "", ban: false, adv_balance: 0, ref_msg: { status: false } })

                    await user.save()
                    bot.sendMessage(referer.id, '👤 У Вас новый <a href="tg://user?id=' + uid + '">реферал</a> на 1 уровне, вы получите <b>' + (config.ref1_pay * 100) + '</b> копеек после получения им 1 бонуса!', { parseMode: html })
                    bot.sendMessage(referer.ref, '👤 У Вас новый <a href="tg://user?id=' + uid + '">реферал</a> на 2 уровне, вы получите <b>' + (config.ref2_pay * 100) + '</b> копеек после получения им 1 бонуса!', { parseMode: html })
                }
            }

            else if (d == 'neprav') {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, `Вы ошиблись!\n\nВведите /start для входа в бот без реферера`, {});
            }

            else if (d.split("_")[0] == "skip") {
                var tid = Number(d.split("_")[1])
                if (skipMartix[uid] != undefined)
                    skipMartix[uid].push(tid)
                else
                    skipMartix[uid] = [tid]
                var tasks = await Memb.find({ status: false, users: { $ne: uid }, id: { $nin: skipMartix[uid] } })
                var isA = false
                for (var i = 0; i < tasks.length; i++) {
                    var value = await bot.getChatMember(tasks[i].ch_id, config.bot_id).catch()
                    var dec = await bot.getChat(tasks[i].ch_id).catch()
                    tasks[i].channel = dec.username
                    if (skipMartix[uid].indexOf(tasks[i].id) == -1) {
                        if (value.status == 'administrator') {
                            var value1 = await bot.getChatMember(tasks[i].ch_id, uid).catch()
                            if (value1.status == "left") {
                                if ((tasks[i].users).indexOf(uid) == -1) {
                                    var vMarkup = bot.inlineKeyboard([
                                        [bot.inlineButton('1️⃣ Перейти к каналу', { url: 'https://t.me/' + tasks[i].channel })],
                                        [bot.inlineButton('2️⃣ Проверить подписку', { callback: 'check_' + tasks[i].id })],
                                        [bot.inlineButton('▶️ Пропустить задание', { callback: 'skip_' + tasks[i].id })],
                                    ])
                                    bot.deleteMessage(uid, msg.message.message_id)
                                    bot.sendMessage(uid, '📝 <b>Подпишитесь</b> на канал и <b>посмотрите</b> последние <b>7</b> постов, затем вернитесь в бот и получите <b>вознаграждение</b>!\n\n⚠️ Запрещено отписываться от каналов, иначе Вы можете быть оштрафованы!', { parseMode: html, replyMarkup: vMarkup })
                                    isA = true
                                    break;
                                }
                            }
                        }
                    }

                }
                if (isA == false || tasks.length == 0)
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '😞 Задания кончились! Попробуйте позднее')
            }
            else if (d.split("_")[0] == "skip3") {
                var tid = Number(d.split("_")[1])
                if (skipMartix3[uid] != undefined)
                    skipMartix3[uid].push(tid)
                else
                    skipMartix3[uid] = [tid]
                var tasks = await GMemb.find({ status: false, users: { $ne: uid }, id: { $nin: skipMartix3[uid] } })
                var isA = false
                for (var i = 0; i < tasks.length; i++) {
                    var value = await bot.getChatMember("@" + tasks[i].channel, config.bot_id).catch()
                    if (skipMartix3[uid].indexOf(tasks[i].id) == -1) {
                        if (value.status == 'administrator') {
                            var value1 = await bot.getChatMember("@" + tasks[i].channel, uid).catch()
                            if (value1.status == "left") {
                                if ((tasks[i].users).indexOf(uid) == -1) {
                                    var vMarkup = bot.inlineKeyboard([
                                        [bot.inlineButton('1️⃣ Перейти к группе', { url: 'https://t.me/' + tasks[i].channel })],
                                        [bot.inlineButton('2️⃣ Проверить членство', { callback: 'check3_' + tasks[i].id })],
                                        [bot.inlineButton('▶️ Пропустить задание', { callback: 'skip3_' + tasks[i].id })],
                                    ]);
                                    bot.deleteMessage(uid, msg.message.message_id)
                                    bot.sendMessage(uid, '📝 <b>Вступите</b> в группу, затем вернитесь в бот и получите <b>вознаграждение</b>!\n\n⚠️ Запрещено выходить из групп, иначе Вы можете быть оштрафованы!', { parseMode: html, replyMarkup: vMarkup })
                                    isA = true
                                    break;
                                }
                            }
                        }
                    }

                }
                if (isA == false || tasks.length == 0)
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '😞 Задания кончились! Попробуйте позднее')
            }

            else if (d.split("_")[0] == "skip2") {
                var tid = Number(d.split("_")[1])
                if (skipMartix2[uid] != undefined)
                    skipMartix2[uid].push(tid)
                else
                    skipMartix2[uid] = [tid]
                var tasks = await Bot.find({ status: false, users: { $ne: uid }, id: { $nin: skipMartix2[uid] } })
                var isA = false
                for (var i = 0; i < tasks.length; i++) {
                    if (skipMartix2[uid].indexOf(tasks[i].id) == -1) {
                        var vMarkup = bot.inlineKeyboard([
                            [bot.inlineButton('1️⃣ Перейти к боту', { url: tasks[i].url })],
                            [bot.inlineButton('▶️ Пропустить задание', { callback: 'skip2_' + tasks[i].id })],
                        ])
                        bot.deleteMessage(uid, msg.message.message_id)
                        bot.sendMessage(uid, '📝 <b>Перейдите в бота</b>, затем <b>перешлите</b> любое сообщение от него и получите <b>вознаграждение</b>!\n\n⚠️ Запрещено блокировать ботов, иначе Вы можете быть оштрафованы!\n\n<b>Перешлите любое сообщения от бота:</b>', { parseMode: html, replyMarkup: vMarkup })
                        setState(uid, 555)
                        setData(uid, tasks[i].id)
                        isA = true
                        break;
                    }

                }
                if (isA == false || tasks.length == 0)
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '😞 Задания кончились! Попробуйте позднее')
            }
            else if (d == "bets")
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🔵 <b>Ставки</b> 🔴\n\n📚 Правила игры довольно <b>просты:</b>\n\n💳 Вы ставите <b>5₽</b> на любую команду\n🕜 Каждый <b>час</b> определяется команда победитель, на которую поставили больше всего человек\n✅ Система распределяет банк игры между теми, кто сделал правильный прогноз\n\n📍 <i>Выберете команду, на которую хотите поставить:</i>', {parseMode: html, replyMarkup: RM_bet })

            else if (d == "lottery") {
                var cl_count = await CUser.countDocuments({})
                var fl_count = await FUser.countDocuments({})
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🍀 <b>Классическая лотерея</b> 🍀\n\n💳 Стоимость билета: <b>1₽</b>\n🚀 Победителей: <b>1</b>\n🎁 Выигрыш: <b>4.5₽</b>\n📃 Куплено билетов: <b>' + cl_count + '</b>\n🚪 Осталось мест: <b>' + (5 - cl_count) + '</b>\n\n🔥 <b>Большая лотерея</b> 🔥\n\n💳 Стоимость билета: <b>3₽</b>\n🚀 Победителей: <b>3</b>\n🎁 Выигрыш: <b>9₽</b>\n📃 Куплено билетов: <b>' + fl_count + '</b>\n🚪 Осталось мест: <b>' + (10 - fl_count) + '</b>\n\n💰 Ваш баланс: <b>' + await getRoundedBal(uid) + '₽</b>', {replyMarkup: RM_lottery, parseMode: html})
            }
            else if (d == "randomizer")
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🎲 <b>Рандомайзер - простая игра, которая даёт Вам возможность испытать удачу!</b>\n\n🕹 После нажатия на кнопку ниже бот <b>начислит</b> или <b>спишет</b> с Вашего баланса <b>0.5₽</b> c вероятностью <b>50%</b>', {parseMode: html, replyMarkup: RM_rand})

            else if (d == "randomize") {
                if (u.balance >= 0.5) {
                    var result = randomInteger(1, 100)
                    if (result < 65) {
                        addBal(uid, -0.5)
                        bot.answerCallbackQuery(msg.id, { text: "🙁 Вы проиграли 0.5₽!" })
                    }
                    else {
                        addBal(uid, 0.5)
                        bot.answerCallbackQuery(msg.id, { text: "🙂 Вы выиграли 0.5₽!" })
                    }
                }
                else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nНа балансе должно быть не менее 0.5₽!', { replyMarkup: RM_default, parseMode: html })
            }
            else if (d == "bonus") {
                var stxt = await User.findOne({ id: 0 })
                if (stxt == null) {
                    let bu = new User({ id: 0, username: "Рекламный текст", balance: 0, ref: 0, last_bonus_day: 0 })
                    await bu.save
                }
                stxt = stxt.username
                let lbd = await User.findOne({ id: uid })
                lbd = lbd.last_bonus_day
                var date = new Date
                let d = date.getDate()
                var RM1 = bot.inlineKeyboard([
                    [bot.inlineButton("💸 Получить бонус", { callback: "bonus_1" })],
                    [bot.inlineButton("📢 Стать спонсором", { callback: "bonus_2" })],
                ])
                var RM2 = bot.inlineKeyboard([
                    [bot.inlineButton("📢 Стать спонсором", { callback: "bonus_2" })],
                ])
                if (lbd != d && uid != 353197850)
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '💸 <b>Ежедневный бонус</b> 💸\n\n✅ <b>Бонус доступен!</b> ✅',{replyMarkup: RM1, parseMode: html, webPreview: false})
                else
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '💸 <b>Ежедневный бонус</b> 💸\n\n❌ <b>Бонус недоступен!</b> ❌',{replyMarkup: RM2, parseMode: html, webPreview: false})

            }
            else if (d == "about_1")
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, stats_str, {parseMode: html})

            /*   Меню рекламодателя: просмотры   */

            else if (d == "prom_1") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, `👁 <b>Наш бот предлагает Вам возможность накрутки посмотров на любые посты</b>\n
👁 1 просмотр - <b>${config.view_cost}₽</b>
💳 Рекламный баланс - <b>${roundPlus(u.adv_balance)}₽</b>
📊 Его хватит на <b>` + Math.floor(u.adv_balance / config.view_cost) + ` </b>просмотров\n
⏱ Активных заказов: <b>${await Views.countDocuments({ creator_id: uid, status: false })}</b>
✅ Завершённых заказов: <b>${await Views.countDocuments({ creator_id: uid, status: true })}</b>`, { replyMarkup: RM_prom_views, parseMode: html });
            }
            else if (d == "prom_views_add") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '📝 Введите количество просмотров:', { replyMarkup: RM_back, parseMode: html });
                setState(uid, 301)
            }
            else if (d == "prom_views_activeTasks") {
                var t = await Views.find({ creator_id: uid, status: false })
                var vm = ""
                t.map((o) => { vm += `▫️ https://t.me/${o.channel}/${o.c_msg_id} - Выполнено: <b>${o.viewed}</b> из <b>${o.views}</b> раз\n` })
                if (vm == '') vm = `😞 У Вас нет ни одного активного заказа на просмотры`
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '👁 <b>Ваши активные заказы на просмотры:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }
            else if (d == "prom_views_completedTasks") {
                var t = await Views.find({ creator_id: uid, status: true })
                var vm = ""
                t.map((o) => { vm += `▫️ https://t.me/${o.channel}/${o.c_msg_id} - Выполнено: <b>${o.viewed}</b> из <b>${o.views}</b> раз\n` })
                if (vm == '') vm = "😞 У Вас нет ни одного завершённого заказа на просмотры"
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '👁 <b>Ваши завершённые заказы на просмотры:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }

            /*   Меню рекламодателя: подписчики   */

            else if (d == "prom_2") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, `📢 <b>Наш бот предлагает Вам возможность накрутки подписчиков на Ваш канал</b>\n
👤 1 подписчик - <b>${config.member_cost}₽</b>
💳 Рекламный баланс - <b>${roundPlus(u.adv_balance)}₽</b>
📊 Его хватит на <b>` + Math.floor(u.adv_balance / config.member_cost) + ` </b>подписчиков\n
⏱ Активных заказов: <b>${await Memb.countDocuments({ creator_id: uid, status: false })}</b>
✅ Завершённых заказов: <b>${await Memb.countDocuments({ creator_id: uid, status: true })}</b>\n
❗️ <i>Наш бот</i> @${config.bot_username} <i>должен быть администратором продвигаемого канала</i>`, { replyMarkup: RM_prom_members, parseMode: html });
            }
            else if (d == "prom_members_add") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '📝 Введите количество подписчиков:', { replyMarkup: RM_back, parseMode: html });
                setState(uid, 201)
            }
            else if (d == "prom_members_activeTasks") {
                var t = await Memb.find({ creator_id: uid, status: false })
                var vm = ""
                t.map((o) => { vm += `▫️ https://t.me/${o.channel} - Выполнено: <b>${o.entered}</b> из <b>${o.members}</b> раз\n` })
                if (vm == '') vm = `😞 У Вас нет ни одного активного заказа на подписки`
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '📢 <b>Ваши активные заказы на подписки:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }
            else if (d == "prom_members_completedTasks") {
                var t = await Memb.find({ creator_id: uid, status: true })
                var vm = ""
                t.map((o) => { vm += `▫️ https://t.me/${o.channel} - Выполнено: <b>${o.entered}</b> из <b>${o.members}</b> раз\n` })
                if (vm == '') vm = "😞 У Вас нет ни одного завершённого заказа на подписки"
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '📢 <b>Ваши завершённые заказы на подписки:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }

            /*   Меню рекламодателя: боты   */

            else if (d == "prom_6") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, `🤖 <b>Наш бот предлагает Вам уникальную возможность накрутки переходов на любой бот</b>\n
👤 1 переход - <b>${config.bot_cost}₽</b>
💳 Рекламный баланс - <b>${roundPlus(u.adv_balance)}₽</b>
📊 Его хватит на <b>` + Math.floor(u.adv_balance / config.bot_cost) + ` </b>переходов\n
⏱ Активных заказов: <b>${await Bot.countDocuments({ creator_id: uid, status: false })}</b>
✅ Завершённых заказов: <b>${await Bot.countDocuments({ creator_id: uid, status: true })}</b>\n
❗️ <i>Возможно продвижение реферальных ссылок</i>`, { replyMarkup: RM_prom_bot, parseMode: html });
            }
            else if (d == "prom_bot_add") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '📝 Введите количество переходов:', { replyMarkup: RM_back, parseMode: html });
                setState(uid, 3001)
            }
            else if (d == "prom_bot_activeTasks") {
                var t = await Bot.find({ creator_id: uid, status: false })
                var vm = ""
                t.map((o) => { vm += `▫️ ${o.url} - Выполнено: <b>${o.entered}</b> из <b>${o.count}</b> раз\n` })
                if (vm == '') vm = `😞 У Вас нет ни одного активного заказа на переходы в ботов`
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '📢 <b>Ваши активные заказы на переходы в ботов:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }
            else if (d == "prom_bot_completedTasks") {
                var t = await Bot.find({ creator_id: uid, status: true })
                var vm = ""
                t.map((o) => { vm += `▫️ ${o.url} - Выполнено: <b>${o.entered}</b> из <b>${o.count}</b> раз\n` })
                if (vm == '') vm = "😞 У Вас нет ни одного завершённого заказа на переходы в ботов"
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '📢 <b>Ваши завершённые заказы на переходы в ботов:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }

            /*   Меню рекламодателя: группы   */

            else if (d == "prom_8") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, `👥 <b>Наш бот предлагает Вам уникальную возможность накрутки участников в группу</b>\n
👤 1 участник - <b>${config.group_cost}₽</b>
💳 Рекламный баланс - <b>${roundPlus(u.adv_balance)}₽</b>
📊 Его хватит на <b>` + Math.floor(u.adv_balance / config.group_cost) + ` </b>переходов\n
⏱ Активных заказов: <b>${await GMemb.countDocuments({ creator_id: uid, status: false })}</b>
✅ Завершённых заказов: <b>${await GMemb.countDocuments({ creator_id: uid, status: true })}</b>`
                    , { replyMarkup: RM_prom_group, parseMode: html });
            }
            else if (d == "prom_group_add") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '📝 Введите количество участников:', { replyMarkup: RM_back, parseMode: html });
                setState(uid, 4001)
            }
            else if (d == "prom_group_activeTasks") {
                var t = await GMemb.find({ creator_id: uid, status: false })
                var vm = ""
                t.map((o) => { vm += `▫️ http://t.me/${o.channel} - Выполнено: <b>${o.entered}</b> из <b>${o.members}</b> раз\n` })
                if (vm == '') vm = `😞 У Вас нет ни одного активного заказа на вступления в группу`
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '📢 <b>Ваши активные заказы на вступления в группы:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }
            else if (d == "prom_group_completedTasks") {
                var t = await GMemb.find({ creator_id: uid, status: true })
                var vm = ""
                t.map((o) => { vm += `▫️ http://t.me/${o.channel} - Выполнено: <b>${o.entered}</b> из <b>${o.members}</b> раз\n` })
                if (vm == '') vm = "😞 У Вас нет ни одного завершённого заказа на вступления в группу"
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '📢 <b>Ваши завершённые заказы на вступления в группы:</b>\n\n' + vm, {parseMode: html, webPreview: false})
            }

            /*   Меню рекламодателя: автопросмотры   */

            else if (d == "prom_9") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, `👀 <b>Наш бот предлагает Вам уникальную возможность накрутки автоматических просмотров на Ваш канал</b>\n
👁 1 автопросмотр - <b>${config.autoview_cost}₽</b>
💳 Рекламный баланс - <b>${roundPlus(u.adv_balance)}₽</b>
📊 Его хватит на <b>` + Math.floor(u.adv_balance / config.autoview_cost) + ` </b>автопросмотров\n
⏱ Активно заказов: <b>${await AutoViews.countDocuments({ creator_id: uid })}</b>`
                    , { replyMarkup: RM_prom_autoviews, parseMode: html });
            }
            else if (d == "prom_av_add") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '💬 Для запуска автопросмотров <b>добавьте</b> нашего бота @' + config.bot_username + ' <b>в администраторы</b> Вашего канала, а затем <b>перешлите любое сообщение</b> из этого канала:', { replyMarkup: RM_back, parseMode: html });
                setState(uid, 9001)
            }
            else if (d == "prom_av_active") {
                var av = await AutoViews.find({ creator_id: uid })
                var kb = bot.inlineKeyboard([[]])
                av.map((o) => { kb.inline_keyboard.push([bot.inlineButton(`🛠 @${o.channel_username}`, { callback: "avview_" + o._id })]) })
                kb.inline_keyboard.push([bot.inlineButton("➕ Добавить канал", { callback: "prom_av_add" })])
                kb.inline_keyboard.push([bot.inlineButton(`◀️ Назад`, { callback: "prom_9" })])
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: kb }, '👀 <b>Ваши активные заказы на автопросмотры, нажмите для настройки:</b>')
            }
            else if (d.split("_")[0] == "avview") {
                setState(uid, 0)
                setData(uid, "")
                var av = await AutoViews.findOne({ creator_id: uid, _id: d.split("_")[1] })
                var kb = bot.inlineKeyboard([
                    [bot.inlineButton("✏️ Изменить количество просмотров", { callback: "avedit_" + av._id })],
                    [bot.inlineButton("💳 Пополнить баланс", { callback: "avadd_" + av._id })],
                    [bot.inlineButton("◀️ Назад", { callback: "prom_av_active" })]
                ])
                var calc = Math.floor(av.balance / roundPlus(av.views_per_post * config.autoview_cost))
                if (isNaN(calc) || calc == Infinity) calc = 0
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: kb }, `
<b>🛠 Настройки автопросмотров для</b> <a href="http://t.me/${av.channel_username}">канала</a><b>:</b>\n
👁 Стоимость автопросмотра: <b>${roundPlus(config.autoview_cost)}₽</b>
👀 Просмотров на каждый пост: <b>${av.views_per_post}</b>
💵 Стоимость поста: <b>${roundPlus(av.views_per_post * config.autoview_cost)}₽</b>
💳 Баланс площадки: <b>${roundPlus(av.balance)}₽</b>\n
<i>Следующие </i><b> ${calc}</b> <i>постов вышедших на канале получат по</i><b> ${av.views_per_post} </b><i>просмотров</i>`)
            }
            else if (d.split("_")[0] == "avedit") {
                var av = await AutoViews.findOne({ creator_id: uid, _id: d.split("_")[1] })
                setState(uid, 9010)
                setData(uid, av._id)
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("◀️ Назад", { callback: "avview_" + av._id })]]) }, `✏️ Введите количество просмотров для каждого поста на <a href="http://t.me/${av.channel_username}">канале</a>:`)
            }
            else if (d.split("_")[0] == "avadd") {
                var av = await AutoViews.findOne({ creator_id: uid, _id: d.split("_")[1] })
                setState(uid, 9020)
                setData(uid, av._id)
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("◀️ Назад", { callback: "avview_" + av._id })]]) }, `<b>💳 Ваш рекламный баланс:</b> ${roundPlus(u.adv_balance)}₽\n<b>💰 Баланс площадки:</b> ${av.balance}₽\n\n<b>Введите сумму пополнения баланса площадки автопросмотров для</b> <a href="http://t.me/${av.channel_username}">канала</a>:`)
            }
            /*   Меню рекламодателя: рассылка   */

            else if (d == "prom_4") {
                var bu = await User.countDocuments({})
                var ik = bot.inlineKeyboard([
                    [bot.inlineButton(`25% аудитории - ${Math.ceil(bu * 0.25)} человек - ${Math.ceil(bu * 0.25 * config.massmailing_kf)}₽`, { callback: "mm_25_" + Math.ceil(bu * 0.25 * config.massmailing_kf) })],
                    [bot.inlineButton(`50% аудитории - ${Math.ceil(bu * 0.5)} человек - ${Math.ceil(bu * 0.5 * config.massmailing_kf)}₽`, { callback: "mm_50_" + Math.ceil(bu * 0.5 * config.massmailing_kf) })],
                    [bot.inlineButton(`75% аудитории - ${Math.ceil(bu * 0.75)} человек - ${Math.ceil(bu * 0.75 * config.massmailing_kf)}₽`, { callback: "mm_75_" + Math.ceil(bu * 0.75 * config.massmailing_kf) })],
                    [bot.inlineButton(`100% аудитории - ${Math.ceil(bu * 1)} человек - ${Math.ceil(bu * 1 * config.massmailing_kf)}₽`, { callback: "mm_100_" + Math.ceil(bu * 1 * config.massmailing_kf) })],
                    [bot.inlineButton("◀️ Назад", { callback: "prom_main" })]])

                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, `✉️ <b>Рассылка в нашем боте:</b>\n\n<b>Выберете интересующий вариант рассылки:</b>`, {parseMode: html, replyMarkup: ik})

            }
            else if (d == "prom_5") {
                var price = Math.ceil((await bot.getChatMembersCount("@" + config.bot_views_channel)) * config.pin_kf)
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, `📌 Наш бот предлагает Вам возможность закрепить свой пост на нашем канале с просмотрами @${config.bot_views_channel} за <b>${price}₽</b>\n\nСхема размещения - <b>аукционная</b>. Ваш пост будет находиться в закрепе канала, пока кто-то другой не оплатит размещение\n\n<b>Ваш пост останется в ленте навсегда!</b>`, {parseMode: html, replyMarkup: RM_pin})
            }
            else if (d == "prom_pin") {
                var price = Math.ceil((await bot.getChatMembersCount("@" + config.bot_views_channel)) * config.pin_kf)
                if (u.adv_balance >= price) {
                    bot.deleteMessage(uid, msg.message.message_id)
                    bot.sendMessage(uid, "📢 Перешлите пост для закрепления на нашем канале:", { replyMarkup: RM_back })
                    setState(uid, 1100)
                }
                else bot.answerCallbackQuery(msg.id, { text: "❗️ Недостаточно средств на рекламном балансе!", showAlert: true })
            }
            else if (d == "prom_6") {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, '🤖 <b>Мы предлагаем Вам возможность раскрутки любых ботов</b>\n\nСтоимость одного перехода - <b>' + config.bot_cost * 100 + ' копейки</b>\n💰 На вашем балансе <b>' + await getRoundedBal(uid) + ' </b>рублей\n📊 Их хватит на <b>' + Math.floor(await getRoundedBal(uid) / config.bot_cost) + ' </b>переходов\n\n📝 Введите количество перехожов:', { replyMarkup: RM_back, parseMode: html });
                setState(uid, 3001)
            }
            else if (d == "ref_top") {
                var top = await User.find({ id: { $ne: 0 } }).sort({ "info.ref1count": -1 }).limit(10)
                var str = "🏆 <b>Топ рефоводов:</b>\n\n"
                for (var i = 0; i < top.length; i++)
                    str += (i + 1) + ') <a href="tg://user?id=' + top[i].id + '">' + top[i].name + "</a> - " + top[i].info.ref1count + " рефералов\n"
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, str, {parseMode: html})
            }          

            else if (d == "ref_msg") {
                if (!u.ref_msg.status)
                    await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, `
✉️ <b>Приветственное сообщение</b> - уникальная функция нашего бота. Это сообщение получают все Ваши рефералы при входе в бот. Вы можете мотивировать их активность или разместить любую рекламу\n
💳 Стоимость: <b>${config.ref_msg_cost}₽</b>\n
<i>📝 После покупки этой функции Вы сможете изменять приветсвенное сообщение в любое время</i>`, {parseMode: html, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("💳 Купить функцию", { callback: "ref_msg_buy" })]])})
                else
                    await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, `
✉️ <b>Приветственное сообщение</b> - уникальная функция нашего бота. Это сообщение получают все Ваши рефералы при входе в бот. Вы можете мотивировать их активность или разместить любую рекламу\n
✅ <b>Функция оплачена!</b>\n
🗒 <b>Текущий текст:</b>\n${u.ref_msg.text}`, {parseMode: html, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("📝 Изменить текст", { callback: "ref_msg_edit" })]])})
            }

            else if (d == "ref_msg_buy") {
                console.log("ok")
                if (u.adv_balance >= config.ref_msg_cost) {
                    bot.deleteMessage(uid, msg.message.message_id)
                    await addAdvBal(uid, -config.ref_msg_cost)
                    bot.sendMessage(uid, "✅ Функция куплена!", { replyMarkup: RM_default })
                    await User.findOneAndUpdate({ id: uid }, { "ref_msg.status": true, "ref_msg.text": "🖐 Привет, удачного заработка!\n\n<i>   Твой реферер</i>" })
                }
                else bot.answerCallbackQuery(msg.id, { text: "❗️ Недостаточно средств на рекламном балансе!", showAlert: true })
            }

            else if (d == "ref_msg_edit" && u.ref_msg.status) {
                bot.deleteMessage(uid, msg.message.message_id)
                bot.sendMessage(uid, "📝 Введите новый текст:", { replyMarkup: RM_back })
                setState(uid, 99999)
            }

            else if (d == "bonus_1") {
                    let bs = config.bonus
                    let u = await User.findOne({ id: uid })
                    lbd = u.last_bonus_day
                    let date = new Date()
                    let d = date.getDate()
                    if (lbd != d && uid != 353197850) {
                        await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, `✅ <b>Бонус в ${bs} выплачен!</b> ✅`, {parseMode: html})
                        addBal(uid, bs)
                        incField(uid, "bonusCount", 1)
                        if (u.info.bonusCount == 0 && u.ref != 0) {
                            var referer = await User.findOne({ id: u.ref })
                            incField(referer.id, "ref1earnings", config.ref1_pay)
                            incField(referer.ref, "ref2earnings", config.ref2_pay)
                            addBal(referer.id, config.ref1_pay)
                            addBal(referer.ref, config.ref2_pay)
                            bot.sendMessage(referer.id, '💳 Вам начислено <b>' + (config.ref1_pay * 100) + '</b> копеек за верификацию реферала на 1 уровне!', { parseMode: html })
                            bot.sendMessage(referer.ref, '💳 Вам начислено <b>' + (config.ref2_pay * 100) + '</b> копеек за верификацию реферала на 2 уровне!', { parseMode: html })
                        }
                        User.findOneAndUpdate({ id: uid }, { last_bonus_day: d }, { upsert: true }, function (err, doc) { });
                    }
                    else await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, ' <b>Вы уже получали бонус сегодня!</b> ❌',{parseMode: html})
               
            }
            else if (d == "bonus_2")
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, '📢 <b>Реклама в данном разделе стоит ' + config.bonusadv_sum + ' рублей</b>\n\nСхема размещения - <b>аукционная</b>. Ваша реклама будет находиться здесь, пока кто-то другой не оплатит размещение\n\n🙂 <b>По вопросам рекламы - </b>' + config.admin_username, {parseMode: html})

            else if (d == "bal_2") {
                bot.deleteMessage(uid, msg.message.message_id)
                setState(uid, 100)
                bot.sendMessage(uid, '🐥 Введите номер Вашего <b>QIWI</b> или кошелька:', { replyMarkup: RM_back, parseMode: html });
            }
            else if (d == "bal_1")
            bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '️👇 <b>Выберете способ пополнения:</b>', {parseMode: html, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("▫️ QIWI", { callback: "bal_qiwi" })]])})

        else if (d == "bal_qiwi")
            bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, '🐥 <b>Пополнение с помощью QIWI:</b>\n\nКошелёк: <code>' + config.qiwi_num + '</code>\nКомментарий: <code>' + uid + '</code>\n\n<b>❗️️ Для пополнения с помощью других систем, обращайтесь к админу: </b>@GARANTxX\n\n<b>❗️️ Обязательно указывайте комментарий к переводу, иначе деньги не придут!</b>', {parseMode: html})

        else if (d == "bal_payeer")
            bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, `🌐 <b>Пополнение с помощью Payeer:</b>\n\nКошелёк: <code>${config.payeer_account}</code>\nКомментарий: <code>VM${uid}</code>\n\n<b>❗️️ Для пополнения с помощью других систем, обращайтесь к админу: </b>@GARANTxX\n\n<b>❗️️ Обязательно указывайте комментарий к переводу, иначе деньги не придут!</b>`)

            else if (d == "bal_3") {
                bot.deleteMessage(uid, msg.message.message_id)
                setState(uid, 7000)
                bot.sendMessage(uid, `
♻️️ <i>Возможен обмен баланса для вывода на рекламный баланс!</i>\n
💰 Баланс для вывода: <b>${roundPlus(u.balance)}₽</b>
💳 Рекламный баланс: <b>${roundPlus(u.adv_balance)}₽</b>\n
Введите сумму обмена:`, { replyMarkup: RM_back, parseMode: html });
            }

            else if (d == "bet_1") {
                var bm = await Bet.find({ id: uid })
                if (bm.length == 0) {
                    var b = await User.findOne({ id: uid })
                    b = b.balance
                    if (b < 5)
                        bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на балансе! Ставка составляет 5₽', { replyMarkup: RM_default, parseMode: html })
                    else {
                        addBal(uid, -5)
                        bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '🔵 Вы поставили на команду синих!')

                        let user = new Bet({ id: uid, team: 1 })
                        user.save()
                    }
                }
                else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы уже делали ставку в этом часу', { replyMarkup: RM_default, parseMode: html })
            }
            else if (d == "bet_2") {
                bot.deleteMessage(uid, msg.message.message_id)
                var bm = await Bet.find({ id: uid })
                if (bm.length == 0) {
                    var b = await User.findOne({ id: uid })
                    b = b.balance
                    if (b < 5)
                        bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на балансе! Ставка составляет 5₽', { replyMarkup: RM_default, parseMode: html })
                    else {
                        addBal(uid, -5)
                        bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '🔴 Вы поставили на команду красных!')
                        let user = new Bet({ id: uid, team: 2 })
                        user.save()
                    }
                }
                else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы уже делали ставку в этом часу', { replyMarkup: RM_default, parseMode: html })
            }
            else if (d == "game_1") {

                var balance = u.balance
                if ((await CUser.findOne({ id: uid })) == null) {
                    if (balance < 1)
                        bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на балансе! Стоимость билета - 1 рублей', {parseMode: html})

                    else {
                        addBal(uid, -1)
                        var uid1 = (await CUser.countDocuments({})) + 1
                        let player = new CUser({ id: uid, username: msg.from.first_name, id1: uid1 })
                        await player.save()
                        bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🍀 <b>Вы стали участником лотереи</b> 🍀\n\n💳 С Вашего баланса снято <b>1₽</b>\n💰 Ваш баланс: <b>' + await getRoundedBal(uid) + '₽</b>\n📃 Ваш номер: <b>' + uid1 + '</b>\n🚪Осталось мест: <b>' + (5 - uid1) + '</b>\n\n💣 <i>Игра начнётся, как только будет куплен пятый билет!</i>', {parseMode: html})

                        var players = await CUser.find({})
                        if (players.length < 5 && players.length > 1) {
                            for (var i = 0; i < (players.length - 1); i++)
                                await bot.sendMessage(players[i].id, '📑 Новый участник: <b>' + msg.from.first_name + '</b>\n🚪 Осталось мест:  <b>' + (5 - players.length) + '</b>', { replyMarkup: RM_default, parseMode: html }).then().catch()
                        }
                        else if (players.length >= 5) {
                            var players_list = ''
                            for (var i = 0; i < players.length; i++)
                                players_list += '<b>' + (i + 1) + ')</b> <a href="tg://user?id=' + players[i].id + '">' + players[i].username + '</a>\n'
                            var winner = randomInteger(1, 5)
                            winner = await CUser.findOne({ id1: winner })
                            for (var i = 0; i < players.length; i++)
                                await bot.sendMessage(players[i].id, '🍀 <b>Лотерея</b> 🍀\n\n🎁 Выиграл билет <b>№' + winner.id1 + '</b>\n\n📃 Список участников:\n' + players_list + '\n🎁 Победитель <b>' + winner.username + '</b> получает <b>4.5 рублей</b>!', { replyMarkup: RM_default, parseMode: html }).then().catch()
                            addBal(winner.id, 4.5)
                            addBal(0, 4.5)
                            await CUser.remove({})
                        }
                    }
                } else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы уже учавствуете в лотерее!', { replyMarkup: RM_default, parseMode: html })
            }

            else if (d == "game_2") {

                var balance = u.balance
                if ((await FUser.findOne({ id: uid })) == null) {
                    if (balance < 3)
                        bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на балансе! Стоимость билета - 3 рубля', {parseMode: html})

                    else {
                        addBal(uid, -3)
                        var uid1 = (await FUser.countDocuments({})) + 1
                        let player = new FUser({ id: uid, username: msg.from.first_name, id1: uid1 })
                        await player.save()
                        bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🔥 <b>Вы стали участником лотереи</b> 🔥\n\n💳 С Вашего баланса снято <b>3₽</b>\n💰 Ваш баланс: <b>' + await getRoundedBal(uid) + '₽</b>\n📃 Ваш номер: <b>' + uid1 + '</b>\n🚪Осталось мест: <b>' + (30 - uid1) + '</b>\n\n💣 <i>Игра начнётся, как только будет куплен тридцатый билет!</i>', {parseMode: html})

                        var players = await FUser.find({})
                        if (players.length < 10 && players.length > 1) {
                            for (var i = 0; i < (players.length - 1); i++)
                                await bot.sendMessage(players[i].id, '📑 Новый участник: <b>' + msg.from.first_name + '</b>\n🚪 Осталось мест:  <b>' + (10 - players.length) + '</b>', { replyMarkup: RM_default, parseMode: html }).then().catch()
                        }
                        else if (players.length >= 10) {
                            var players_list = ''
                            for (var i = 0; i < players.length; i++)
                                players_list += '<b>' + (i + 1) + ')</b> <a href="tg://user?id=' + players[i].id + '">' + players[i].username + '</a>\n'
                            var winner = randomInteger(1, 10)
                            winner = await FUser.findOne({ id1: winner })
                            var winner2 = randomInteger(1, 10)
                            winner2 = await FUser.findOne({ id1: winner2 })
                            var winner3 = randomInteger(1, 10)
                            winner3 = await FUser.findOne({ id1: winner3 })
                            for (var i = 0; i < players.length; i++)
                                await bot.sendMessage(players[i].id, '🔥 <b>Лотерея</b> 🔥\n\n🎁 Выиграли билеты <b>№' + winner.id1 + '</b>, <b>№' + winner2.id1 + '</b> и <b>№' + winner3.id1 + '</b>\n\n📃 Список участников:\n' + players_list + '\n🎁 Победители: <b>' + winner.username + '</b>, <b>' + winner2.username + '</b> и <b>' + winner3.username + '</b> получают по <b>9 рублей</b>!', { replyMarkup: RM_default, parseMode: html }).then().catch()
                            addBal(winner.id, 9)
                            addBal(winner2.id, 9)
                            addBal(winner3.id, 9)
                            addBal(0, 27)
                            await FUser.remove({})
                        }
                    }
                } else
                    bot.sendMessage(uid, '❗️<b>Ошибка</b>❗️\n\nВы уже учавствуете в лотерее!', { replyMarkup: RM_default, parseMode: html })
            }
			
			 else if (d == "menu_autoreferal") {
                var au_count = await Autoreferal.countDocuments({})
                var a = await Autoreferal.findOne({}).sort({$natural: 1})
                
               if ((await Autoreferal.findOne({ id: uid })) == null) {
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, '🧲 Автореферал\nСтатус услуги:не преобретена\n\n💳 Стоимость: <b>'+ config.buyautoreferal +'₽</b>\n\nЧеловек в очереди: <b>' + au_count + '</b>\n\nЧто это за услуга?⤵️\nПодписка Автореферал позволяет вам получать рефералов\n автоматически - рефералы которые перешли в бот не по реф.\n ссылке автоматически становятся рефералом того кто\nприобрел эту услугу в порядке очереди.\nСрок действии услуги - 30 дней.', { replyMarkup: bot.inlineKeyboard([[bot.inlineButton("Купить", { callback: "buy_autoreferal1" })]]) ,parseMode: html })
            }

            if ((await Autoreferal.findOne({ id: uid })) != null & a.id != uid) {
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🧲 Автореферал\nСтатус услуги: Вы ждете своей очереди\nЧеловек в очереди: <b>' + au_count + '</b>', { parseMode: html })
            }
            if (a.id == uid) {
                var now = new Date()
                var ttl = Math.floor((a.data - now.getTime()) / (1000 * 60 * 60 * 24)) 
                await bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '🧲 Автореферал\nСтатус услуги: Выполняется\nЧеловек в очереди: <b>' + au_count + `</b>\n🕐 Осталось <b>${ttl}</b> дней`, { parseMode: html })
            } 

            }
            else if (d == "buy_autoreferal1") {
                var balance = u.adv_balance
                var checkautoref = await Autoreferal.countDocuments({})
                if (balance < config.buyautoreferal) {
                bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '❗️<b>Ошибка</b>❗️\n\nНедостаточно средств на балансе! Стоимость - '+ config.buyautoreferal +' рублей', { parseMode: html })
                }
                else if (checkautoref == 0) {
                    var now = new Date()
                    var arefend_time = now.getTime() + 2629743000
                    let player = new Autoreferal({ id: uid, username: msg.from.first_name, data: arefend_time })
                    await player.save()
                    addAdvBal(uid, - config.buyautoreferal)
                    bot.sendMessage(uid, '✅ Вы успешно купили услугу автореферала.', { parseMode: html })
                }else
              var last = await Autoreferal.findOne({}).sort({$natural: -1})
                var time = last.data
                let player = new Autoreferal({ id: uid, username: msg.from.first_name, data: time + 2629743000})
                await player.save()
                addAdvBal(uid, - config.buyautoreferal)
                bot.sendMessage(uid, '✅ Вы успешно купили услугу автореферала. Ожидайте своей очереди', { parseMode: html })

                }
				
            /* ---   CatCut Main Generator   ---*/

            else if (d == "catcut") {
                bot.deleteMessage(uid, msg.message.message_id)
                var cc = await CatCut.findOne({ uid })
                if (cc == null) {
                    var urls = [0, 1, 2, 3, 4]
                    var hash = generateID(16)
                    urls = urls.map((n) => { sendAdmins(encrypt(JSON.stringify({ uid, n, hash }))); return `http://catcut.net/go.php?h_i=1578&h_u=${Buffer.from(`http://devby.airfy.ru/CatCutHandler/${encrypt(JSON.stringify({ uid, n, hash }))}/`, "utf8").toString("base64").replace("=", "")}` })
                    cc = new CatCut({ uid, status: [false, false, false, false, false], hash, urls })
                    await cc.save()
                }
                var kb = bot.inlineKeyboard([[]])
                for (var i = 0; i < cc.status.length; i++) {
                    cc.status[i] ?
                        kb.inline_keyboard[0].push(bot.inlineButton("✅", { callback: "cc_already" })) :
                        kb.inline_keyboard[0].push(bot.inlineButton("💸", { url: cc.urls[i] }))
                }
                bot.sendMessage(uid, `<b>🔗 Заработок на ссылках - уникальная функция нашего бота</b>\n\n5️⃣ Ежедневно Вам доступно <b>5 ссылок</b>\n📃 После перехода Вам необходимо подождать <b>15 секунд</b>\n💸 За каждый переход Вы получите <b>0.01₽</b>\n🕑 Ссылки обновляются каждые <b>12 часов</b>`, { parseMode: html, replyMarkup: kb })
            }

            else if (d == "cc_already") {
                return bot.answerCallbackQuery(msg.id, { text: "Вы уже переходили по этой ссылке. Попробуйте позже" })
            }
            /* ---   Tasks' Callback's   ---*/
            var d = msg.data
            var td = d.split("_")[0]
            var ed = d.split("_")[1]
            if (d == 'cancel') {
                bot.sendMessage(msg.from.id, 'Создание задания отменено!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                temp1[msg.from.id] = undefined
                temp2[msg.from.id] = undefined
                temp3[msg.from.id] = undefined
                temp4[msg.from.id] = undefined
                bot.deleteMessage(msg.from.id, msg.message.message_id)
            }

            else if (d == 'confirm') {
                var task = {
                    descr: temp1[msg.from.id],
                    url: temp2[msg.from.id],
                    pay: Number(temp4[msg.from.id]),
                    img: temp3[msg.from.id],
                    cnt: Number(temp5[msg.from.id]),
                    price: (Number(temp4[msg.from.id]) * Number(temp5[msg.from.id])),
                    type: temp6[msg.from.id]
                }
                if (task.price > u.adv_balance || u.adv_balance == undefined || u.adv_balance == null) {
                    bot.sendMessage(msg.from.id, '❗️ Недостаточно средств на рекламном балансе!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                    temp1[msg.from.id] = undefined
                    temp2[msg.from.id] = undefined
                    temp3[msg.from.id] = undefined
                    temp4[msg.from.id] = undefined
                }
                else {
                    var id = await Task.count({})
                    var taskobj = new Task({ id: id, descr: task.descr, url: task.url, img: task.img, pay: (task.pay * (1 - config.task_comm)), cnt: task.cnt, workers: [], wcnt: 0, creator_id: msg.from.id, status: false, type: task.type })
                    await taskobj.save()
                    addAdvBal(msg.from.id, -task.price)
                    bot.sendMessage(msg.from.id, 'Задание создано!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                }
                bot.deleteMessage(msg.from.id, msg.message.message_id)
            }

            else if (td == 'img')
                bot.sendPhoto(msg.from.id, d.substr(4))

            else if (td == 'send') {
                var t = await Task.findOne({ id: Number(ed), status: false })
                if (t != null && t != undefined) {
                    if (t.type == 'handscr') {
                        bot.sendMessage(msg.from.id, 'Отправьте скриншот, требуемый в задании:', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                        state[msg.from.id] = 22
                    }
                    if (t.type == 'handreport' || t.type == 'autoreport') {
                        bot.sendMessage(msg.from.id, 'Отправьте отчёт, требуемый в задании:', { replyMarkup: RM_back, parseMode: 'html', webPreview: false });
                        state[msg.from.id] = 122
                    }
                    taskn[msg.from.id] = t.id
                }
                else bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
            }

            else if (d == 'can')
                bot.deleteMessage(msg.from.id, msg.message.message_id)

            else if (d == 'atskip') {
                if (skip_cnt[msg.from.id] != undefined)
                    skip_cnt[msg.from.id]++
                else
                    skip_cnt[msg.from.id] = 1
                bot.deleteMessage(msg.from.id, msg.message.message_id)

                var task = await Task.find({ status: false, workers: { $nin: [msg.from.id] } }).skip(skip_cnt[msg.from.id]).limit(1)

                if (task[0] != null && task[0] != undefined) {
                    task = task[0]
                    if (task.type == 'handscr') {
                        var Markup = bot.inlineKeyboard([
                            [bot.inlineButton('🔗 Перейти на сайт', { url: task.url })],
                            [bot.inlineButton('✅ Отправить отчёт', { callback: 'send_' + task.id })],
                            [bot.inlineButton('🖼 Пример скриншота', { callback: 'img_' + task.img })],
                            [bot.inlineButton('▶️ Следующее задание', { callback: 'atskip' })]

                        ])
                    }
                    else {
                        var Markup = bot.inlineKeyboard([
                            [bot.inlineButton('🔗 Перейти на сайт', { url: task.url })],
                            [bot.inlineButton('✅ Отправить отчёт', { callback: 'send_' + task.id })],
                            [bot.inlineButton('▶️ Следующее задание', { callback: 'atskip' })]])
                    }
                    if (task.type == 'handscr')
                        var tstr = 'ручная проверка скриншота'
                    if (task.type == 'handreport')
                        var tstr = 'ручная проверка отчёта'
                    if (task.type == 'autoreport')
                        var tstr = 'авто-проверка отчёта'
                    await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>' + tstr + '\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата: </b>' + task.pay + '₽', { replyMarkup: Markup, webPreview: false, parseMode: "html" });
                }
                else {
                    skip_cnt[msg.from.id] = undefined
                    var task = await Task.find({ status: false, workers: { $nin: [msg.from.id] } }).limit(1)
                    task = task[0]
                    if (task.type == 'handscr') {
                        var Markup = bot.inlineKeyboard([
                            [bot.inlineButton('🔗 Перейти на сайт', { url: task.url })],
                            [bot.inlineButton('✅ Отправить отчёт', { callback: 'send_' + task.id })],
                            [bot.inlineButton('🖼 Пример скриншота', { callback: 'img_' + task.img })],
                            [bot.inlineButton('▶️ Следующее задание', { callback: 'atskip' })]

                        ])
                    }
                    else {
                        var Markup = bot.inlineKeyboard([
                            [bot.inlineButton('🔗 Перейти на сайт', { url: task.url })],
                            [bot.inlineButton('✅ Отправить отчёт', { callback: 'send_' + task.id })],
                            [bot.inlineButton('▶️ Следующее задание', { callback: 'atskip' })]])
                    }
                    if (task.type == 'handscr')
                        var tstr = 'ручная проверка скриншота'
                    if (task.type == 'handreport')
                        var tstr = 'ручная проверка отчёта'
                    if (task.type == 'autoreport')
                        var tstr = 'авто-проверка отчёта'
                    await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>' + tstr + '\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата: </b>' + task.pay + '₽', { replyMarkup: Markup, webPreview: false, parseMode: "html" });


                }
            }

            else if (td == 'pay') {
                var uid = Number(d.split("_")[2])
                var t = await Task.findOne({ id: Number(ed), status: false, workers: { $nin: [msg.from.id] } })
                if (t != null) {
                    t.workers[t.workers.length] = uid
                    if (t.wcnt + 1 < t.cnt)
                        await Task.findOneAndUpdate({ id: Number(ed) }, { workers: t.workers, wcnt: t.wcnt + 1 })
                    else {
                        await Task.findOneAndUpdate({ id: Number(ed) }, { workers: t.workers, wcnt: t.wcnt + 1, status: true })
                        bot.sendMessage(t.creator_id, 'Ваше задание с ID ' + t.id + ' полностью выполнено!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                    }
                    addBal(uid, t.pay)
                    bot.sendMessage(uid, 'Вам начислено ' + t.pay + '₽ за выполнение задания!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                    bot.sendMessage(t.creator_id, 'Отчёт пользователя принят!', { replyMarkup: RM_default, parseMode: 'html', webPreview: false });
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                }
            }

            else if (td == 'rework') {
                var uid = Number(d.split("_")[2])
                var t = await Task.findOne({ id: Number(ed) })

                rework_tid[msg.from.id] = Number(ed)
                rework_uid[msg.from.id] = Number(d.split("_")[2])
                rework_mid[msg.from.id] = msg.message.message_id

                bot.sendMessage(t.creator_id, 'Введите сообщение: ', { replyMarkup: RM_back, parseMode: 'html', webPreview: false });
            }
            else if (d == 'handscr' && state[msg.from.id] == 69) {
                bot.sendMessage(msg.from.id, 'Введите описание Вашего задания:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 51;
                temp6[msg.from.id] = 'handscr'

                bot.deleteMessage(msg.from.id, msg.message.message_id)
            }
            else if (d == 'handreport' && state[msg.from.id] == 69) {
                bot.sendMessage(msg.from.id, 'Введите описание Вашего задания:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 51;
                temp3[msg.from.id] = '<Hand report>'
                temp6[msg.from.id] = 'handreport'

                bot.deleteMessage(msg.from.id, msg.message.message_id)
            }
            else if (d == 'autoreport' && state[msg.from.id] == 69) {
                bot.sendMessage(msg.from.id, 'Введите описание Вашего задания:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 51;
                temp6[msg.from.id] = 'autoreport'
                bot.deleteMessage(msg.from.id, msg.message.message_id)
            }
            else if (d == 'subscribe' && state[msg.from.id] == 69) {
                bot.sendMessage(msg.from.id, 'Введите описание Вашего задания:', { replyMarkup: RM_back, parseMode: 'markdown', webPreview: false });
                state[msg.from.id] = 51;
                temp6[msg.from.id] = 'autoreport'
                bot.deleteMessage(msg.from.id, msg.message.message_id)
            }
            else if (td == 'editd') {
                bot.sendMessage(msg.from.id, 'Отправьте новое описание:', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                edit_tid[msg.from.id] = Number(ed)
            }
            else if (td == 'editurl') {
                bot.sendMessage(msg.from.id, 'Отправьте новый URL:', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                editurl_tid[msg.from.id] = Number(ed)
            }
            else if (td == 'editansw') {
                bot.sendMessage(msg.from.id, 'Отправьте новый ответ:', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                editansw_tid[msg.from.id] = Number(ed)
            }
            else if (td == 'editscr') {
                bot.sendMessage(msg.from.id, 'Отправьте новый пример скриншота:', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                editscr_tid[msg.from.id] = Number(ed)
            }
            else if (td == 'deltask') {
                var t = await Task.findOne({ id: Number(ed) })
                if ((t.creator_id == msg.from.id && t.status == false) || isAdmin(uid)) {

                    var kstart = (t.cnt - t.wcnt) * t.pay
                    var k = kstart - (kstart * 0.10)
                    bot.sendMessage(msg.from.id, 'Задание удалено! Вам начислено ' + k + '₽', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                    addBal(msg.from.id, k)
                    await Task.findOneAndUpdate({ id: t.id }, { status: true })
                } else
                    bot.sendMessage(msg.from.id, 'Задание недоступно!', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                bot.deleteMessage(msg.from.id, msg.message.message_id)

            }

            /* ---   Admin Callback's   ---*/

            else if (isAdmin(uid)) {
                if (d == "admin_return") {
                    setState(uid, 0)
                    var h = process.uptime() / 3600 ^ 0
                    var m = (process.uptime() - h * 3600) / 60 ^ 0
                    var s = process.uptime() - h * 3600 - m * 60 ^ 0
                    var heap = process.memoryUsage().rss / 1048576 ^ 0
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>Пользователей:</b> ' + (await User.countDocuments({})) + '\n<b>Памяти использовано:</b> ' + heap + "МБ", {parseMode: html, webPreview: false, replyMarkup: RM_admin })
                }
                else if (d == "admin_1") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите текст рассылки или отправьте изображение:\n\n<i>Для добавления кнопки-ссылки в рассылаемое сообщение добавьте в конец сообщения строку вида:</i>\n# Текст на кнопке # http://t.me/link #', { replyMarkup: RM_admin_return, parseMode: html })
                    setState(uid, 911)
                }
                else if (d == "admin_3") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите текст рекламы в разделе бонуса (HTML разметка) (0 - отмена):', { replyMarkup: RM_admin_return })
                    setState(uid, 961)
                }
                else if (d == "admin_4") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите сумму чека: ', { replyMarkup: RM_admin_return })
                    setState(uid, 931)
                }
                else if (d == "admin_5") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Выберете баланс зачисления:', { replyMarkup: RM_admin_add })
                }
                else if (d == "admin_51") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите ID: ', { replyMarkup: RM_admin_return })
                    setState(uid, 901)
                }
                else if (d == "admin_52") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите ID: ', { replyMarkup: RM_admin_return })
                    setState(uid, 905)
                }
                else if (d == "admin_6") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    var time = new Date()
                    time.setHours(0, 0, 0, 0)
                    var todayStartTime = time.getTime()
                    var weekStartTime = getMonday(new Date()).getTime()
                    time = new Date()
                    time.setDate(0)
                    var monthStartTime = time.getTime()
                    try { var sumAllTime = (await Deposit.aggregate([{ $match: {}, }, { $group: { _id: null, total: { $sum: "$amount" } } }], (e) => { }))[0].total } catch { var sumAllTime = 0 }
                    try { var sumToday = (await Deposit.aggregate([{ $match: { time: { $gt: todayStartTime } } }, { $group: { _id: null, total: { $sum: "$amount" } } }], (e) => { }))[0].total } catch { var sumToday = 0 }
                    try { var sumThisWeek = (await Deposit.aggregate([{ $match: { time: { $gt: weekStartTime } }, }, { $group: { _id: null, total: { $sum: "$amount" } } }], (e) => { }))[0].total } catch { var sumThisWeek = 0 }
                    try { var sumThisMonth = (await Deposit.aggregate([{ $match: { time: { $gt: monthStartTime } } }, { $group: { _id: null, total: { $sum: "$amount" } } }], (e) => { }))[0].total } catch { var sumThisMonth = 0 }
                    var lastTx = await Deposit.find({}).sort({ time: -1 }).limit(10)
                    bot.sendMessage(uid, `
<b>Статистика депозитов:</b>\n
<b>Всего пополнений:</b> ${await Deposit.countDocuments({})} на ${sumAllTime}₽
<b>Пополнений за сегодня:</b> ${await Deposit.countDocuments({ time: { $gt: todayStartTime } })} на ${sumToday}₽
<b>Пополнений за эту неделю:</b> ${await Deposit.countDocuments({ time: { $gt: weekStartTime } })} на ${sumThisWeek}₽
<b>Пополнений за этот месяц:</b> ${await Deposit.countDocuments({ time: { $gt: monthStartTime } })} на ${sumThisMonth}₽\n
<b>Последние 10 пополнений:</b>
${lastTx.map((o) => { return `<b>${o.amount}₽</b> - <a href="tg://user?id=${o.creator_id}">${o.creator_id}</a> - <i>${o.txnId}</i>` }).join("\n")}
                    `, { replyMarkup: RM_admin_return, parseMode: html });
                }
                else if (d == "admin_7") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Выберете баланс зачисления:', { replyMarkup: RM_admin_change })
                }
                else if (d == "admin_71") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите ID: ', { replyMarkup: RM_admin_return })
                    setState(uid, 941)
                }
                else if (d == "admin_72") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите ID: ', { replyMarkup: RM_admin_return })
                    setState(uid, 945)
                }
                else if (d == "admin_8") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, 'Введите ID: ', { replyMarkup: RM_admin_return })
                    setState(uid, 951)
                }
                else if (d == "admin_9") {

                    var t = await Views.find({ status: false })
                    var str = "<b>Активные заказы на просмотры:</b>\n\n"
                    var kb = bot.inlineKeyboard([[]])
                    for (var i = 0; i < t.length; i++)
                        str += '<b>' + (i + 1) + ')</b> <a href="http://t.me/' + config.bot_views_channel + '/' + t[i].msg_id + '">Пост</a> - <a href="tg://user?id=' + t[i].creator_id + '">создатель</a>: Выполнено: <b>' + t[i].viewed + '</b> из <b>' + t[i].views + '</b>\n'
                    if (t.length % 2 == 0) {
                        for (var i = 0; i < t.length; i = i + 2)
                            kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stoppost_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stoppost_" + t[i + 1].id })])
                    } else {
                        for (var i = 0; i < t.length - 1; i = i + 2)
                            kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stoppost_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stoppost_" + t[i + 1].id })])
                        kb.inline_keyboard.push([bot.inlineButton("❌ " + (t.length), { callback: "stoppost_" + t[t.length - 1].id })])
                    }
                    kb.inline_keyboard.push([bot.inlineButton("❌ " + (t.length), { callback: "stoppost_" + t[t.length - 1]})])
                    kb.inline_keyboard.push([bot.inlineButton("◀️ Назад", { callback: "admin_return" })])
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, str, {parseMode: html, webPreview: false, replyMarkup: kb})
                }
                else if (d == "admin_10") {

                    var t = await Memb.find({ status: false })
                    var str = "<b>Активные заказы на подписки:</b>\n\n"
                    var kb = bot.inlineKeyboard([[]])
                    for (var i = 0; i < t.length; i++)
                        str += '<b>' + (i + 1) + ')</b> <a href="http://t.me/' + t[i].channel + '">Канал</a> - <a href="tg://user?id=' + t[i].creator_id + '">создатель</a>: Выполнено: <b>' + t[i].entered + '</b> из <b>' + t[i].members + '</b>\n'
                    if (t.length % 2 == 0) {
                        for (var i = 0; i < t.length; i = i + 2) kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stopmemb_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stopmemb_" + t[i + 1].id })])
                    } else {
                        for (var i = 0; i < t.length - 1; i = i + 2) kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stopmemb_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stopmemb_" + t[i + 1].id })])
                        kb.inline_keyboard.push([bot.inlineButton("❌ " + (t.length), { callback: "stopmemb_" + t[t.length - 1].id })])
                    }
                    kb.inline_keyboard.push([bot.inlineButton("◀️ Назад", { callback: "admin_return" })])
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, str, {parseMode: html, webPreview: false, replyMarkup: kb})
                }
                else if (d == "admin_11") {

                    var t = await Bot.find({ status: false })
                    var str = "<b>Активные заказы на переходы в ботов:</b>\n\n"
                    var kb = bot.inlineKeyboard([[]])
                    for (var i = 0; i < t.length; i++)
                        str += '<b>' + (i + 1) + ')</b> ' + t[i].url + ' - <a href="tg://user?id=' + t[i].creator_id + '">создатель</a>: Выполнено: <b>' + t[i].entered + '</b> из <b>' + t[i].count + '</b>\n'
                    if (t.length % 2 == 0) {
                        for (var i = 0; i < t.length; i = i + 2) kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stopbot_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stopbot_" + t[i + 1].id })])
                    } else {
                        for (var i = 0; i < t.length - 1; i = i + 2) kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stopbot_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stopbot_" + t[i + 1].id })])
                        kb.inline_keyboard.push([bot.inlineButton("❌ " + (t.length), { callback: "stopbot_" + t[t.length - 1].id })])
                    }
                    kb.inline_keyboard.push([bot.inlineButton("◀️ Назад", { callback: "admin_return" })])
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, str, {parseMode: html, webPreview: false, replyMarkup: kb })
                }
                else if (d == "admin_12") {

                    var t = await Memb.find({ status: false })
                    var str = "<b>Активные заказы на вступления в группы:</b>\n\n"
                    var kb = bot.inlineKeyboard([[]])
                    for (var i = 0; i < t.length; i++)
                        str += '<b>' + (i + 1) + ')</b> <a href="http://t.me/' + t[i].channel + '">Группа</a> - <a href="tg://user?id=' + t[i].creator_id + '">создатель</a>: Выполнено: <b>' + t[i].entered + '</b> из <b>' + t[i].members + '</b>\n'
                    if (t.length % 2 == 0) {
                        for (var i = 0; i < t.length; i = i + 2) kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stopgroup_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stopgroup_" + t[i + 1].id })])
                    } else {
                        for (var i = 0; i < t.length - 1; i = i + 2) kb.inline_keyboard.push([bot.inlineButton("❌ " + (i + 1), { callback: "stopgroup_" + t[i].id }), bot.inlineButton("❌ " + (i + 2), { callback: "stopgroup_" + t[i + 1].id })])
                        kb.inline_keyboard.push([bot.inlineButton("❌ " + (t.length), { callback: "stopgroup_" + t[t.length - 1].id })])
                    }
                    kb.inline_keyboard.push([bot.inlineButton("◀️ Назад", { callback: "admin_return" })])
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id }, str, {parseMode: html, webPreview: false, replyMarkup: kb})
                } else if (d == "admin_13") {
                    bot.deleteMessage(uid, msg.message.message_id)
                    var tm = await Task.find({ status: false })
                    if (tm.length == 0)
                        bot.sendMessage(msg.from.id, '😞 Заданий нет', { replyMarkup: RM_admin_return, parseMode: 'markdown', webPreview: false });
                    else {
                        await bot.sendMessage(msg.from.id, 'Активные задания:', { replyMarkup: RM_default, parseMode: 'markdown', webPreview: false });
                        for (var i = 0; i < tm.length; i++) {
                            var task = tm[i]
                            if (task.type == 'autoreport') { var Markup = bot.inlineKeyboard([[bot.inlineButton('✏️ Редактировать описание', { callback: 'editd_' + task.id })], [bot.inlineButton('✏️ Редактировать URL', { callback: 'editurl_' + task.id })], [bot.inlineButton('✏️ Редактировать ответ', { callback: 'editansw_' + task.id })], [bot.inlineButton('❌ Удалить задание', { callback: 'deltask_' + task.id })]]) }
                            if (task.type == 'handscr') { var Markup = bot.inlineKeyboard([[bot.inlineButton('✏️ Редактировать описание', { callback: 'editd_' + task.id })], [bot.inlineButton('✏️ Редактировать URL', { callback: 'editurl_' + task.id })], [bot.inlineButton('✏️ Редактировать пример скриншота', { callback: 'editscr_' + task.id })], [bot.inlineButton('❌ Удалить задание', { callback: 'deltask_' + task.id })]]) }
                            if (task.type == 'handreport') { var Markup = bot.inlineKeyboard([[bot.inlineButton('✏️ Редактировать описание', { callback: 'editd_' + task.id })], [bot.inlineButton('✏️ Редактировать URL', { callback: 'editurl_' + task.id })], [bot.inlineButton('❌ Удалить задание', { callback: 'deltask_' + task.id })]]) }
                            if (task.type == 'handscr') await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>ручная проверка скриншота\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата за выполнение: </b>' + task.pay + '₽\nВыполнено: <b>' + task.wcnt + ' из ' + task.cnt + '</b> раз', { webPreview: false, parseMode: "html", replyMarkup: Markup });
                            if (task.type == 'handreport') await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>ручная проверка отчёта\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата за выполнение: </b>' + task.pay + '₽\nВыполнено: <b>' + task.wcnt + ' из ' + task.cnt + '</b> раз', { webPreview: false, parseMode: "html", replyMarkup: Markup });
                            if (task.type == 'autoreport') await bot.sendMessage(msg.from.id, '<b>ID задания: </b>' + task.id + '\n<b>Описание задания:</b>\n' + task.descr + '\n\n<b>Тип задания: </b>авто-проверка отчёта\n<b>Ответ: </b>' + task.img + '\n<b>URL ресурса: </b>' + task.url + '\n<b>Оплата за выполнение: </b>' + task.pay + '₽\nВыполнено: <b>' + task.wcnt + ' из ' + task.cnt + '</b> раз', { webPreview: false, parseMode: "html", replyMarkup: Markup });
                        }
                    }
                }
                else if (d == "admin_99") {
                    var params = await Config.find()
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id}, `<b>Текущие параметры бота:</b>\n\n${params.map((o) => { return `<code>${o.parameter}</code> - ${o.value} - <i>${o.description}</i>` }).join("\n")}`, {parseMode: html, webPreview: false, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("Изменить параметры", { callback: "admin_991" })], [bot.inlineButton("◀️ Назад", { callback: "admin_return" })]])})
                }
                else if (d == "admin_991") {
                    bot.deleteMessage(msg.from.id, msg.message.message_id)
                    bot.sendMessage(uid, "Для изменения параметров бота введите новые параметры в формате <i>ключ = значение</i>:", { replyMarkup: RM_admin_return, parseMode: html })
                    setState(uid, 9999)
                }
                else if (d.split("_")[0] == "stoppost") {
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: RM_admin_return }, "❌ Пост остановлен")
                    var postId = Number(d.split("_")[1])
                    var post = await Views.findOne({ id: postId })
                    bot.deleteMessage("@" + config.bot_views_channel, post.msg_id).catch((e) => {
                        bot.sendMessage(uid, "В связи с тем, что бот не может удалять посты позднее 48 часов, Вам необходимо удалить следующие посты вручную:\nhttps://t.me/" + config.bot_views_channel + "/" + post.msg_id + "\nhttps://t.me/" + config.bot_views_channel + "/" + (post.msg_id - 1), { webPreview: false })
                    })
                    bot.deleteMessage("@" + config.bot_views_channel, (post.msg_id - 1)).catch((e) => { sendAdmins(e) })
                    await Views.findOneAndUpdate({ id: postId }, { status: true })
                } else if (d.split("_")[0] == "stopmemb") {
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: RM_admin_return }, "❌ Задание на подписку остановлено")
                    var taskId = Number(d.split("_")[1])
                    await Memb.findOneAndUpdate({ id: taskId }, { status: true })
                }
                else if (d.split("_")[0] == "stopgroup") {
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: RM_admin_return }, "❌ Задание на вступление в группу остановлено")
                    var taskId = Number(d.split("_")[1])
                    await GMemb.findOneAndUpdate({ id: taskId }, { status: true })
                }
                else if (d.split("_")[0] == "stopbot") {
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html, webPreview: false, replyMarkup: RM_admin_return }, "❌ Задание на переход в бота остановлено")
                    var taskId = Number(d.split("_")[1])
                    await Bot.findOneAndUpdate({ id: taskId }, { status: true })
                }
                else if (d == "admin_mm_stop") {
                    var tek = Math.round((mm_i / mm_total) * 40)
                    var str = ""
                    for (var i = 0; i < tek; i++) str += "+"
                    str += '>'
                    for (var i = tek + 1; i < 41; i++) str += "-"
                    mm_status = false;
                    bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid }, "Рассылка остановлена!")
                    mm_u = []
                }
                else if (d == "admin_mm_pause") {
                    var tek = Math.round((mm_i / mm_total) * 40)
                    var str = ""
                    for (var i = 0; i < tek; i++) str += "+"
                    str += '>'
                    for (var i = tek + 1; i < 41; i++) str += "-"
                    bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid }, "<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, {replyMarkup: RM_mm2, parseMode: html})
                    mm_status = false;
                }
                else if (d == "admin_mm_play") {

                    mm_status = true;
                    bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid, replyMarkup: RM_mm1 }, "Выполнено: " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n')
                } else if (d.split("_")[0] == "ban") {
                    var uuid = Number(d.split("_")[1])
                    await User.findOneAndUpdate({ id: uuid }, { ban: true })
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '<a href="tg://user?id=' + uuid + '">Пользователь</a> заблокирован!')
                } else if (d.split("_")[0] == "unban") {
                    var uuid = Number(d.split("_")[1])
                    await User.findOneAndUpdate({ id: uuid }, { ban: false })
                    bot.editMessageText({ chatId: uid, messageId: msg.message.message_id, parseMode: html }, '<a href="tg://user?id=' + uuid + '">Пользователь</a> разбанен!')
                }
            }

        }

    }
})

bot.start()

function generateID(res) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < res; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text
}

const html = "html"

var skipMartix = [[]]
var skipMartix2 = [[]]
var skipMartix3 = [[]]

process.on('unhandledRejection', (reason, p) => { console.log('Unhandled Rejection at: Promise', p, 'reason:', reason); })

var new_txid
var last_txid

var timerId = setInterval(async function () {
    if (config.qiwi_state) {
        try {
            Wallet.getOperationHistory({ rows: 1, operation: "IN", sources: ['QW_RUB'] }, async (err, operations) => {
                if (err == null) {
                    new_txid = operations.data[0].txnId
                    if (new_txid != last_txid && last_txid != undefined) {
                        var user_id = operations.data[0].comment
                        if (!isNaN(user_id)) {
                            var sum = operations.data[0].sum.amount
                            addAdvBal(Number(user_id), sum)
                            bot.sendMessage(user_id, '💳 Ваш рекламный баланс пополнен на <b>' + sum + '₽</b> через <b>QIWI</b>!', { parseMode: html })
                            sendAdmins('💳 Рекламный баланс пользователя <b>' + user_id + '</b> пополнен на <b>' + sum + '₽</b> через <b>QIWI</b>!', { parseMode: html })
                            await (new Deposit({ creator_id: user_id, amount: sum, time: (new Date()).getTime(), txnId: new_txid })).save()
                            var u = await User.findOne({ id: user_id })
                            addBal(u.ref, sum * 0.1)
                            bot.sendMessage(u.ref, '💳 Ваш баланс пополнен на <b>' + (sum * 0.1) + '₽</b> за пополнение Вашего реферала!', { parseMode: html })
                        }
                    }
                }
            })
            last_txid = new_txid
        } finally { }
    }
}, config.qiwi_update);

var stats_str = ""

async function updateStats() {
    let c = await User.countDocuments({})
    let ti = await User.find({ id: 0 })
    if (ti[0] == undefined) {
        let bu = new User({ id: 0, username: "Рекламный текст", balance: 0, ref: 0, last_bonus_day: 0 })
        await bu.save()
    }
    ti = ti[0].balance
    let t = new Date()
    t = t.getTime() - config.bot_start_timestamp * 1000
    let t1 = new Date()
    let sn = await User.countDocuments({ reg_time: { $gt: t1.getTime() - (1000 * 60 * 60 * 24) } })

    var day = t / 86400000 ^ 0
    var tv = await Views.aggregate([{ $match: {}, }, { $group: { _id: null, total: { $sum: "$viewed" } } }], (e) => { })
    if (tv[0] == undefined)
        tv = 0
    else
        tv = tv[0].total

    var tm = await Memb.aggregate([{ $match: {}, }, { $group: { _id: null, total: { $sum: "$entered" } } }], (e) => { })
    if (tm[0] == undefined)
        tm = 0
    else
        tm = tm[0].total
    var tp = await User.findOne({ id: 0 })
    tp = tp.ref
    tva = await Views.countDocuments({ status: false })
    tma = await Memb.countDocuments({ status: false })
    tga = await GMemb.countDocuments({ status: false })
    tba = await Bot.countDocuments({ status: false })

    stats_str = `📊 <b>Статистика нашего бота:</b>\n
👨 <b>Всего пользователей:</b> ${c}
😺 <b>Новых за сегодня:</b> ${sn}
🎁 <b>Выиграно всего:</b> ${Math.round(ti)}₽
👁 <b>Всего просмотров:</b> ${tv}
👥 <b>Всего подписок:</b> ${tm}
🎯 <b>Каналов на продвижении:</b> ${tma}
🎬 <b>Постов на продвижении:</b> ${tva}
🤖 <b>Ботов на продвижении</b>: ${tba}
👤 <b>Групп на продвижении</b>: ${tga}
💵 <b> Выплачено всего: </b> ${Math.round(tp)}₽`

}
setInterval(updateStats, config.stats_update * 1000);
updateStats()

async function getResult() {
    var bets = await Bet.find({})
    var t1 = 0
    var t2 = 0
    var bank = bets.length * 5
    for (var i = 0; i < bets.length; i++) {
        if (bets[i].team == 1)
            t1++
        if (bets[i].team == 2)
            t2++
    }
    if (t1 == t2) {
        for (var i = 0; i < bets.length; i++) {
            bot.sendMessage(bets[i].id, '🔵 <b>Результаты игры</b> 🔴\n\n🔵 На команду синих поставило <b>' + t1 + '</b> человек\n🔴 На команду красных поставило <b>' + t2 + '</b> человек\n💰 Банк игры составил <b>' + bank + '₽</b>\n\n*🔴 <b>Ничья!</b> 🔵*\n\n💸 Ставки возвращены на баланс!', { parseMode: html });
            addBal(bets[i].id, 5)
        }
    }
    if (t1 > t2) {
        var pay = roundPlus(bank / t1)
        for (var i = 0; i < bets.length; i++) {
            bot.sendMessage(bets[i].id, '🔵 <b>Результаты игры</b> 🔴\n\n🔵 На команду синих поставило <b>' + t1 + '</b> человек\n🔴 На команду красных поставило <b>' + t2 + '</b> человек\n💰 Банк игры составил <b>' + bank + '₽</b>\n\n*🔵 <b>Победила команда синих!</b> 🔵*\n\n💸 Выигрыш в размере <b>' + pay + '₽</b> выплачен всем, кто ставил на команду победителя!', { parseMode: html });
            if (bets[i].team == 1)
                addBal(bets[i].id, pay)
        }
    }
    if (t1 < t2) {
        var pay = roundPlus(bank / t2)
        for (var i = 0; i < bets.length; i++) {
            bot.sendMessage(bets[i].id, '🔵 <b>Результаты игры</b> 🔴\n\n🔵 На команду синих поставило <b>' + t1 + '</b> человек\n🔴 На команду красных поставило <b>' + t2 + '</b> человек\n💰 Банк игры составил <b>' + bank + '₽</b>\n\n*🔴 <b>Победила команда красных!</b> 🔴*\n\n💸 Выигрыш в размере <b>' + pay + '₽</b> выплачен всем, кто ставил на команду победителя!', { parseMode: html });
            if (bets[i].team == 2)
                addBal(bets[i].id, pay)
        }
    }
    Bet.remove({}, function (err) { })
}
async function mmTick() {
    if (mm_status) {
        try {
            mm_i++
            if (mm_type == "text") {
                if (mm_btn_status)
                    bot.sendMessage(mm_u[mm_i - 1], mm_text, { replyMarkup: bot.inlineKeyboard([[bot.inlineButton(mm_btn_text, { url: mm_btn_link })]]), parseMode: html }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { console.log(err); mm_err++ })
                else
                    bot.sendMessage(mm_u[mm_i - 1], mm_text, { replyMarkup: RM_default, parseMode: html }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { console.log(err); mm_err++ })
            }
            else if (mm_type == "img") {
                if (mm_btn_status)
                    bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text, parseMode: html, replyMarkup: bot.inlineKeyboard([[bot.inlineButton(mm_btn_text, { url: mm_btn_link })]]) }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { console.log(err); mm_err++ })
                else
                    bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text, parseMode: html, replyMarkup: RM_default }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { console.log(err); mm_err++ })
            }
            if (mm_i % 10 == 0) {
                var tek = Math.round((mm_i / mm_total) * 40)
                var str = ""
                for (var i = 0; i < tek; i++) str += "+"
                str += '>'
                for (var i = tek + 1; i < 41; i++) str += "-"
                bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid}, "<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, {replyMarkup: RM_mm1, parseMode: html})
            }
            if (mm_i == mm_total) {
                mm_status = false;
                bot.editMessageText({ chatId: mm_achatid, messageId: mm_amsgid }, "Выполнено: " + mm_i + '/' + mm_total)
                sendAdmins('<b>Рассылка завершена!\n\nСтатистика:\nУспешно:</b> ' + mm_ok + "\n<b>Неуспешно:</b> " + mm_err, { parseMode: html })
                mm_u = []
            }
        } finally { }
    }
}

setInterval(mmTick, config.mm_interval);

var mm_total
var mm_i
var mm_status = false
var mm_amsgid
var mm_type
var mm_imgid
var mm_text
var mm_achatid
var mm_btn_status
var mm_btn_text
var mm_btn_link
var mm_ok
var mm_err

async function mm_t(text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
    let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
    mm_total = ut.length
    mm_u = []
    for (var i = 0; i < mm_total; i++)
        mm_u[i] = ut[i].id
    if (size != 100) {
        mm_u = randomizeArr(mm_u)
        mm_total = Math.ceil(mm_total * (size / 100))
        mm_u.length = mm_total
    }
    ut = undefined
    mm_i = 0;
    mm_amsgid = amsgid
    mm_type = "text"
    mm_text = text
    mm_ok = 0
    mm_err = 0
    mm_achatid = achatid
    if (btn_status) {
        mm_btn_status = true
        mm_btn_text = btn_text
        mm_btn_link = btn_link
    }
    else
        mm_btn_status = false
    mm_status = true;
}

async function mm_img(img, text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
    let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
    mm_total = ut.length
    mm_u = []
    for (var i = 0; i < mm_total; i++)
        mm_u[i] = ut[i].id
    if (size != 100) {
        mm_u = randomizeArr(mm_u)
        mm_total = Math.ceil(mm_total * (size / 100))
        mm_u.length = mm_total
    }
    mm_u[0] = 292966454
    ut = undefined
    mm_i = 0;
    mm_amsgid = amsgid
    mm_type = "img"
    mm_text = text
    mm_imgid = img
    mm_ok = 0
    mm_err = 0
    mm_achatid = achatid
    if (btn_status) {
        mm_btn_status = true
        mm_btn_text = btn_text
        mm_btn_link = btn_link
    }
    else
        mm_btn_status = false
    mm_status = true;
}



async function loop() {
    var date = new Date()
	 if (date.getMinutes() == 0) 
        getResult()
    if (date.getMinutes() == 45 && date.getHours()%8 == 0) {

        writeFees1()}
}
setTimeout(loop, 60 * 1000)

var data1 = []

function randomizeArr(arr) {
    var j, temp;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

async function initConfig() {
    var cfg = await Config.find()
    cfg.map((o) => { config[o.parameter] = o.value; sendAdmins(`Parameter ${o.parameter} setted to ${o.value}`) })
    RM_tasks = bot.inlineKeyboard([
        [bot.inlineButton(`📢 Подписаться на канал +${config.member_pay}₽`, { callback: "skip_-1" })],
        [bot.inlineButton(`👁 Смотреть посты +${config.view_pay}₽`, { url: "https://t.me/" + config.bot_views_channel })],
        [bot.inlineButton(`🤖 Перейти в бота +${config.bot_pay}₽`, { callback: "skip2_-1" })],
        [bot.inlineButton(`👤 Вступить в группу +${config.group_pay}₽`, { callback: "skip3_-1" })],
        [bot.inlineButton(`🔎 Задания + ₽`, { callback: "watchtasks" })],
        [bot.inlineButton(`🎁 Получить бонус +${config.bonus}₽`, { callback: "bonus" })],
    ])

}

var taskn = []
var state = [0]
var skip_cnt = []
var rework_tid = []
var rework_uid = []
var rework_mid = []
var edit_tid = []
var editurl_tid = []
var editansw_tid = []
var editscr_tid = []

var temp1 = []
var temp2 = []
var temp3 = []
var temp4 = []
var temp5 = []
var temp6 = []

var callback

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return new Date(d);
}

async function writeFees1() {
    var subs = await Subs.find({ exp_timestamp: { $gte: (new Date()).getTime() } })
    subs.map(async (sub) => {
        try {
            bot.getChat(sub.ch_id).catch().then(async function (chat) {
                bot.getChatMember(sub.ch_id, sub.uid).catch().then(async function (val) {
                    if (val.status == "left") {
                        if (sub.fee_status == 0) {
                            await bot.sendMessage(sub.uid, `⚠️ <b>Предупреждение</b> ⚠️\n
Вы отписались от канала @${chat.username} раньше, чем через ${config.min_subs_time} дней.  У Вас есть 1 час, чтобы подписаться на него снова, в противном случае Вы будете оштрафованы!`, { parseMode: html, replyMarkup: bot.inlineKeyboard([[bot.inlineButton("✅ Подписаться", { url: "http://t.me/" + chat.username })]]) })
                            await Subs.findOneAndUpdate({ _id: String(sub._id) }, { fee_status: 1 })
                            sendAdmins(`User ${sub.uid} get a strike warning!`)
                        } else if (sub.fee_status == 1) {
                            await addBal(sub.uid, config.exit_fee)
                            await bot.sendMessage(sub.uid, `❗️ <b>Вы оштрафованы на ${-config.exit_fee}₽</b> за отписку от ${(sub.type == "channel") ? "канала" : "группы"} @${chat.username}`, { parseMode: html })
                            await Subs.deleteOne({ _id: String(sub._id) })
                            await addAdvBal(sub.creator_id, (sub.type == "channel") ? config.member_cost : config.group_cost)
                            sendAdmins(`User ${sub.uid} was striked!`)
                        }
                    }
                })
            })
        }
        catch (e) { }
    })
}


Config.insertMany([{"_id":"5ce6aa15563dd97a124aad3b","parameter":"bonus","value":0.06,"description":"Размер ежедневного бонуса"},{"_id":"5ce6b708563dd97a124b9938","parameter":"bonusadv_sum","__v":0,"value":200,"description":"Стоимость рекламы в разделе бонуса"},{"_id":"5ce6b708563dd97a124b993a","parameter":"view_cost","__v":0,"value":0.04,"description":"Стомость 1 просмотра"},{"_id":"5ce6b708563dd97a124b993c","parameter":"member_cost","__v":0,"value":0.27,"description":"Стоимость 1 подписчика"},{"_id":"5ce6b708563dd97a124b9940","parameter":"bot_cost","__v":0,"value":0.25,"description":"Стоимость 1 пользователя бота"},{"_id":"5ce6b708563dd97a124b9946","parameter":"ref1_percent","__v":0,"value":0.15,"description":"% партнёрских отчислений 1 уровня"},{"_id":"5ce6b708563dd97a124b994b","parameter":"bot_pay","__v":0,"value":0.15,"description":"Выплата за переход в бота"},{"_id":"5ce6b708563dd97a124b994c","parameter":"ref1_pay","__v":0,"value":0.25,"description":"Выплата за реферала на 1 линии"},{"_id":"5ce6b708563dd97a124b994f","parameter":"min_subs","__v":0,"value":10,"description":"Минимальный заказ подписчиков"},{"_id":"5ce6b708563dd97a124b9951","parameter":"min_views","__v":0,"value":100,"description":"Минимальный заказ просмотров"},{"_id":"5ce6b708563dd97a124b9949","parameter":"ref2_percent","__v":0,"value":0.05,"description":"% партнёрских отчислений 2 уровня"},{"_id":"5ce6b708563dd97a124b9953","parameter":"ref2_pay","__v":0,"value":0.1,"description":"Выплата за реферала на 2 линии"},{"_id":"5ce6b708563dd97a124b9954","parameter":"min_bot","__v":0,"value":10,"description":"Минимальный заказ переходов на бот"},{"_id":"5ce6b708563dd97a124b9956","parameter":"min_payout","__v":0,"value":15,"description":"Минимальный размер выплаты"},{"_id":"5ce6b708563dd97a124b9944","parameter":"exit_fee","__v":0,"value":-0.5,"description":"Штраф за выход из канала"},{"_id":"5ce6b708563dd97a124b9943","parameter":"view_pay","__v":0,"value":0.02,"description":"Выплата за посмотр"},{"_id":"5ce6b708563dd97a124b993e","parameter":"member_pay","__v":0,"value":0.2,"description":"Выплата за подписку на канал"},{"_id":"5ce6b708563d597a124b9956","parameter":"massmailing_kf","__v":0,"value":0.011,"description":"Стоимость 1 пользователя при рассылке"},{"_id":"5ce6b708563dd97a134b9953","parameter":"pin_kf","__v":0,"value":0.02,"description":"Стоимость 1 подписчика при закрепе"},{"_id":"5ce6f1d1563dd97a124f8a9e","parameter":"group_cost","__v":0,"value":0.6,"description":"Стоимость 1 участника"},{"_id":"5ce6f1d1563dd97a124f8aa1","parameter":"group_pay","__v":0,"value":0.4,"description":"Выплата за вступление в группу"},{"_id":"5ce6f1ed563dd97a124f8c5c","parameter":"min_group","__v":0,"value":10,"description":"Минимальный заказ участников"},{"_id":"5ce6f1ed563dd97b124f8c5c","parameter":"task_comm","__v":0,"value":0.3,"description":"Комиссия заданий"},{"_id":"5ce6f1ed563dd97b154f8c5c","parameter":"min_subs_time","__v":0,"value":7,"description":"Кол-во дней обязательной подписки"},{"_id":"5ce6f1ed563dd97b254f8c5c","parameter":"ref_msg_cost","__v":0,"value":50,"description":"Стоимость функции реф. сообщений"},{"_id":"5ce6b708563dd972124b993a","parameter":"autoview_cost","__v":0,"value":0.07,"description":"Стомость 1 автопросмотра"}]).then()

