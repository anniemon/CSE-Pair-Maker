const express = require("express");
const app = express();
const port = process.env.PORT || 80;
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { WebClient, ErrorCode } = require("@slack/web-api");
const schedule = require("node-schedule");

const cseChannelId = "C026MQ2GV2T";
const agoraChannelId = "C01TALAJ7QU";
const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());

app.get("/", (req, res, next) => {
  res.send("server running ");
});

let excluded = [];

const getUserList = async () => {
  try {
    const users = await web.conversations.members({
      channel: cseChannelId,
      token: token,
    });
    const userIds = users.members;
    const usernames = [];

    for (let i = 0; i < userIds.length; i++) {
      const username = await web.users.info({ token: token, user: userIds[i] });
      if (
        username.user.tz.includes("Asia") &&
        !excluded.includes(username.user.real_name)
      ) {
        usernames.push(username.user.real_name);
      }
    }
    return usernames;
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data, cseChannelId);
    } else {
      console.log(error);
    }
  }
};

// prettier-ignore
const emojis = [
	'😄','😃','😀','😊','🙂','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','⬆','⬇','⬅','➡','🔠','🔡','🔤','↗','↖','↘','↙','↔','↕','🔄','◀','▶','🔼','🔽','↩','↪','ℹ','⏪','⏩','⏫','⏬','⤵','⤴','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🅿','♿','🚭','🈷','🈸','🈂','Ⓜ','🛂','🛄','🛅','🛃','🉑','㊙','㊗','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','❎','✅','✴','💟','🆚','📳','📴','🅰','🅱','🆎','🅾','💠','➿','♻','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🔯','🏧','💹','💲','💱','©','®','™','〽','〰','🔝','🔚','🔙','🔛','🔜','❌','⭕','❗','❓','❕','❔','🔃','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕖','🕗','🕘','🕙','🕚','🕡','🕢','🕣','🕤','🕥','🕦','✖','➕','➖','➗','♠','♥','♣','♦','💮','💯','✔','☑','🔘','🔗','➰','🔱','🔲','🔳','◼','◻','◾','◽','▪','▫','🔺','⬜','⬛','⚫','⚪','🔴','🔵','🔻','🔶','🔷','🔸','🔹'
];

function randomEmojis() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

const makePair = (usernames) => {
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
};

getUserList()
  .then((userList) => {
    const pairList = makePair(userList);

    app.post("/", (req, res) => {
      if (req.body.command.split("/")[1] === "페어") {
        res.send(`금주의 아고라 페어는 \n${pairList}\n입니다`);
      } else if (req.body.command.split("/")[1] === "제외") {
        excluded.push(req.body.text);
        const rest = userList.filter((user) => !excluded.includes(user));
        res.send(
          `${req.body.text}(은/는) 제외되었습니다. \n전체 명단은 [${rest}]입니다`
        );
      } else {
        res.end("해당하는 명령어가 없습니다");
      }
    });

    const noticePair = async () => {
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
    };
    schedule.scheduleJob("50 01 * * mon", noticePair);
  })
  .catch((err) => {
    console.log(err);
  });

const resetExcluded = () => {
  excluded = [];
};

//  1. 월요일 아침 9시에 페어 매칭하기  => done
// * 1-1. 일단 현재 채널에 있는 구성원 목록 가져오기
// * 1-2. 가져온 사람이 홀수면 한 조는 3인으로 짝을 짓고, 짝수면 2인씩 짝짓는다.
// * 1-3. 매주 월요일 아침 9시에 공지한다
// todo: 2. 명령어 '/페어' 입력 시 페어 목록 출력하기
// 2-1. 명령어 '/페어ㅇㅇㅇ제외' 입력 시 특정 유저 페어 목록에서 제거하기
// 2-2. 제거한 상태에서 페어 재매칭해서 공지
// todo: 3 배포

// ! refactor
// ! 페어 명단 받아오는 건 1주일 주기, 메시지 보내는 주기도 마찬가지
// ! 이 배열을 일주일간 in-memory caching한다.
// ! 그 사이에 변화는 /제거 명령어 통해 트래킹한다.

// 1. /페어 치면 직전에 보내준거 그대로 보내줘야 함
// 2. /제외 는 1주일만 제외 시킴
// 3. optional /추가 제외 된 구성원을 다시 추가

schedule.scheduleJob("10 02 * * mon", resetExcluded);

app.listen(port, () => console.log(`server is running at ${port}`));
