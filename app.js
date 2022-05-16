require("dotenv").config();
const { App } = require("@slack/bolt");
const { WebClient, ErrorCode } = require("@slack/web-api");
const schedule = require("node-schedule");
const token = process.env.SLACK_BOT_TOKEN;

const cseChannelId = "C026MQ2GV2T";
const agoraChannelId = "C01TALAJ7QU";
const web = new WebClient(token);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  scopes: [
    "channels:history",
    "chat:write",
    "commands",
    "channels:join",
    "channels:read",
    "users:read",
  ],
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

let excluded = [];
let isShuffled = false;
let pairList = [];
let userList = [];

// prettier-ignore
const emojis = [
	'😄','😃','😀','😊','🙂','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','⬆','⬇','⬅','➡','🔠','🔡','🔤','↗','↖','↘','↙','↔','↕','🔄','◀','▶','🔼','🔽','↩','↪','ℹ','⏪','⏩','⏫','⏬','⤵','⤴','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🅿','♿','🚭','🈷','🈸','🈂','Ⓜ','🛂','🛄','🛅','🛃','🉑','㊙','㊗','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','❎','✅','✴','💟','🆚','📳','📴','🅰','🅱','🆎','🅾','💠','➿','♻','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🔯','🏧','💹','💲','💱','©','®','™','〽','〰','🔝','🔚','🔙','🔛','🔜','❌','⭕','❗','❓','❕','❔','🔃','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕖','🕗','🕘','🕙','🕚','🕡','🕢','🕣','🕤','🕥','🕦','✖','➕','➖','➗','♠','♥','♣','♦','💮','💯','✔','☑','🔘','🔗','➰','🔱','🔲','🔳','◼','◻','◾','◽','▪','▫','🔺','⬜','⬛','⚫','⚪','🔴','🔵','🔻','🔶','🔷','🔸','🔹'
];

function randomEmojis() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

const makePair = async function () {
  console.log(isShuffled, "isShuffled");
  console.log(excluded, "excluded");
  if (!isShuffled) {
    userList = await getUserList();
    pairList = shuffleUsernames(userList);
    isShuffled = true;
    return pairList;
  } else {
    return pairList;
  }
};

makePair();

async function getUserList() {
  try {
    const users = await web.conversations.members({
      channel: cseChannelId,
      token: token,
    });
    const userIds = users.members;
    const usernames = [];

    for (let i = 0; i < userIds.length; i++) {
      const username = await web.users.info({
        token: token,
        user: userIds[i],
      });
      if (
        username.user.tz.includes("Asia") &&
        !excluded.includes(username.user.real_name)
      ) {
        usernames.push(username.user.real_name);
      }
    }
    return usernames;
  } catch (error) {
    console.log(error);
  }
}

function shuffleUsernames(usernames) {
  try {
    const shuffle = (usernames) => {
      const copyUsernames = usernames.slice();
      return copyUsernames.sort(() => Math.random() - 0.5);
    };
    const shuffledUsernames = shuffle(usernames);

    let pairs = "";
    for (let i = 0; i < shuffledUsernames.length; i += 2) {
      let pair = shuffledUsernames.slice(i, i + 2);

      if (i === shuffledUsernames.length - 3) {
        pair = shuffledUsernames.slice(-3);
        pairs += `${randomEmojis()} ${pair}\n`;
        break;
      }
      pairs += `${randomEmojis()} ${pair}\n`;
    }
    return pairs.slice(0, pairs.length - 1);
  } catch (error) {
    console.log(error);
  }
}

async function noticePair() {
  const pairList = await makePair();
  try {
    await web.chat.postMessage({
      channel: cseChannelId,
      text: `이번 주 아고라 페어 명단입니다!\n${pairList}\n서로 힘을 모아 좋은 답변을 해주세요.`,
    });
    await web.chat.postMessage({
      channel: agoraChannelId,
      text: `이번 주 아고라 페어 명단입니다!\n${pairList}\n서로 힘을 모아 좋은 답변을 해주세요.`,
    });
  } catch (err) {
    console.log(err);
  }
}

function excludeUser(user) {
  if (userList.includes(user)) {
    excluded.push(user);
    const rest = userList.filter((user) => !excluded.includes(user));
    return rest;
  } else {
    return null;
  }
}

app.command("/제외", async ({ command, ack, respond }) => {
  await ack();

  const rest = excludeUser(command.text);
  //!TODO: 여러 명 한 번에 제외 기능 추가
  if (rest) {
    await respond(
      `${command.text}(은/는) 제외되었습니다. \n전체 명단은 [${rest}]입니다`
    );
  } else {
    await respond(`${command.text}(은/는) 존재하지 않는 사용자입니다`);
  }
});

app.command("/페어", async ({ command, ack, respond }) => {
  await ack();
  const pairList = await makePair();
  await respond(`금주의 아고라 페어는 \n${pairList}\n입니다`);
});

app.command("/", async ({ command, ack, respond }) => {
  await ack();

  await respond(`유효하지 않은 명령어입니다`);
});

app.error((error) => {
  console.error(error);
});

const resetExcluded = () => {
  excluded = [];
};

const resetIsShuffled = () => {
  isShuffled = false;
};

schedule.scheduleJob("49 01 * * mon", resetIsShuffled);
schedule.scheduleJob("50 01 * * mon", noticePair);
schedule.scheduleJob("51 01 * * mon", resetExcluded);

(async () => {
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();

//  1. 월요일 아침 10시 50분에 페어 매칭하기
//  1-1. 현재 채널에 있는 구성원 목록 가져오기
//  1-2. 가져온 사람이 홀수면 한 조는 3인으로 짝을 짓고, 짝수면 2인씩 짝짓는다.
//  1-3. 매주 월요일 아침 10시 50분에 공지한다
//  2. slashCommands
//  2-1.명령어 '/페어' 입력 시 금주 페어 목록 출력하기
//  2-2. 명령어 '/제외 ㅇㅇㅇ' 입력 시 특정 유저 차주 페어 목록에서 제거하기
//  2-3. 제외 배열을 일주일간 in-memory caching한다. 페어 공지 후 빈 배열로 리셋한다.
//  todo: /추가 제외 된 구성원을 다시 추가
//  todo: db에 캐싱
//  4. 배포
