const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const buttons = [];
const close = document.getElementById("close");
const daido = document.getElementById("daido");
const pc = document.getElementById("pc");
for (let i = 1; i <= 5; i++) {
    buttons[i] = document.getElementById("B" + i);
}

const title = new Image();
title.src = "img/title.png";

const screenWidth = window.innerWidth;

// 横幅は画面幅に合わせる（最大300px）
canvas.width = (screenWidth < 600) ? screenWidth : 400;

// 高さは固定（例: 500px）
canvas.height = 1000;

// 表示サイズも一致させる
canvas.style.width  = canvas.width + "px";
canvas.style.height = canvas.height + "px";

if (screenWidth > 600){
    for (let i = 1; i <= 5; i++) {
        buttons[i].style.left = (36 + 4 * i) + "%";
    }
    close.style.left = 40 + "%";
    daido.style.left = 40 + "%";
    pc.style.left = 40 + "%";
}else {
    for (let i = 1; i <= 5; i++) {
        buttons[i].style.left = (-24 + 60 * i) + "px";
    }
    close.style.left = 44 + "px";
    daido.style.left = 44 + "px";
    pc.style.left = 44 + "px";
}

for (let i = 1; i <= 5; i++) {
  buttons[i].style.top = 250 + "px";
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('SW Registered!', reg))
    .catch(err => console.error('SW Registration Failed', err));
}

function drawSquare(scrollY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 一度消す

    const rectY = 30 - scrollY;

    ctx.drawImage(title, 0, rectY, canvas.width, canvas.width / 2.475);
}

// 初期描画
title.addEventListener('load', () => {
  drawSquare(window.scrollY);
});

// スクロールイベントで再描画
window.addEventListener("scroll", () => {
  drawSquare(window.scrollY);
});

const scheduleDiv = document.getElementById("schedule");

createSchedule("monday", 1);
createSchedule("tuesday", 2);
createSchedule("wednesday", 3);
createSchedule("thursday", 4);
createSchedule("friday", 5);

close.addEventListener('click', () => {
  scheduleDiv.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    buttons[i].style.top = 250 + "px";
  }
  close.style.top = 305 + "px";
});

function createSchedule(dayKey, buttonIndex) {
  const btn = buttons[buttonIndex];
  // 教科の予測候補リストを作成（まだなければ作成）
  const datalistId = "subject-list-options";
  if (!document.getElementById(datalistId)) {
    const datalist = document.createElement("datalist");
    datalist.id = datalistId;
    const subjects = ["国語", "数学", "英語", "理科", "社会", "体育", "音楽", "美術", "技術・家庭", "道徳", "ホームルーム"];
    subjects.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub;
      datalist.appendChild(option);
    });
    document.body.appendChild(datalist);
  }

  btn.addEventListener("click", () => {
    for (let i = 1; i <= 5; i++) {
      buttons[i].style.top = 650 + "px";
    }
    close.style.top = 705 + "px";
    scheduleDiv.innerHTML = "";

    // ★ 画面幅に合わせてDIVの幅を設定
    const screenWidth = window.innerWidth;
    const canvasWidth = (screenWidth < 600) ? screenWidth : 400;
    
    scheduleDiv.style.width = `${canvasWidth}px`; // 幅を適用
    scheduleDiv.style.position = "absolute";
    scheduleDiv.style.left = "50%";
    scheduleDiv.style.top = "23%";
    scheduleDiv.style.transform = "translateX(-50%)";
    scheduleDiv.style.boxSizing = "border-box"; // パディングを含めた幅計算にする
    scheduleDiv.style.padding = "0 10px";       // スマホ端でくっつきすぎないように余白

    for (let i = 1; i <= 7; i++) {
      const row = document.createElement("div");
      row.style.margin = "8px 0";
      row.style.display = "flex";        // 横並びにする
      row.style.alignItems = "center";   // 上下中央揃え

      // --- ラベル (1限: など) ---
      const label = document.createElement("span");
      label.textContent = `${i}限:`;
      label.style.width = "35px";        // ラベル幅を固定して揃える
      label.style.fontSize = "14px";
      label.style.flexShrink = "0";      // 縮まないようにする

      // --- 教科入力欄 ---
      const subjectInput = document.createElement("input");
      subjectInput.type = "text";
      subjectInput.placeholder = "教科";
      subjectInput.setAttribute("list", datalistId); // ★ 予測リストと紐付け
      subjectInput.style.height = "30px";
      subjectInput.style.fontSize = "16px";
      subjectInput.style.width = "80px"; // 幅を少し狭めに固定（持ち物欄を広くするため）
      subjectInput.style.marginRight = "5px";

      // --- 持ち物エリア（コンテナ） ---
      // チェックボックスを左上に置くため、relativeな親要素を作る
      const itemContainer = document.createElement("div");
      itemContainer.style.position = "relative"; 
      itemContainer.style.flex = "1";    // 残りの幅を全部使う
      itemContainer.style.height = "50px"; // ★ 持ち物欄のエリアを縦に大きく確保

      // --- チェックボックス ---
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.position = "absolute";
      checkbox.style.top = "2px";        // ★ 左上に配置
      checkbox.style.left = "2px";
      checkbox.style.zIndex = "10";      // 入力欄より手前に表示
      checkbox.style.transform = "scale(1.2)"; // 少し大きくする

      // --- 持ち物入力欄 ---
      const itemInput = document.createElement("input");
      itemInput.type = "text";
      itemInput.placeholder = "持ち物";
      itemInput.style.width = "100%";
      itemInput.style.height = "100%";   // コンテナいっぱいの高さ（50px）
      itemInput.style.fontSize = "16px";
      itemInput.style.boxSizing = "border-box";
      itemInput.style.paddingLeft = "25px"; // ★ 左に余白を作ってチェックボックスと被らないようにする

      // --- 要素の組み立て ---
      itemContainer.appendChild(checkbox);
      itemContainer.appendChild(itemInput);

      row.appendChild(label);
      row.appendChild(subjectInput);
      row.appendChild(itemContainer); // rowにコンテナを追加
      scheduleDiv.appendChild(row);

      // --- イベント保存処理 ---
      // 教科
      // subjectInput.addEventListener("change", () => {
      //   localStorage.setItem(`${dayKey}${i}_subject`, subjectInput.value);
      // });
      
      // 持ち物
      // itemInput.addEventListener("change", () => {
      //   localStorage.setItem(`${dayKey}${i}_item`, itemInput.value);
      // });

// 3.js の createSchedule 内 (例)
subjectInput.addEventListener("change", () => {
  localStorage.setItem(`${dayKey}${i}_subject`, subjectInput.value);
  onScheduleChange(); // 追加：通知を再計算
});

itemInput.addEventListener("change", () => {
  localStorage.setItem(`${dayKey}${i}_item`, itemInput.value);
  onScheduleChange(); // 追加：通知を再計算
});

      // チェックボックス（完了状態などを保存したい場合）
      checkbox.addEventListener("change", () => {
        localStorage.setItem(`${dayKey}${i}_check`, checkbox.checked);
      });

      // --- データの復元 ---
      subjectInput.value = localStorage.getItem(`${dayKey}${i}_subject`) || "";
      itemInput.value = localStorage.getItem(`${dayKey}${i}_item`) || "";
      // チェックボックスの状態を復元 ("true" という文字列で保存されるため比較が必要)
      checkbox.checked = (localStorage.getItem(`${dayKey}${i}_check`) === "true");
    }
  });
}

// --- 1. 通知の準備と予約の実行 ---
// 3.js
// 3.js
// 3.js
// 3.js
// async function setupDailyNotifications() {
//   const registration = await navigator.serviceWorker.ready;
//   const now = new Date();
//   const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

//   // 既存の通知をクリア
//   const notifications = await registration.getNotifications();
//   notifications.forEach(n => n.close());

//   // --- 本番用：明日から7日分の予約 ---
//   for (let i = 0; i < 7; i++) {
//     const targetDate = new Date();
//     targetDate.setDate(now.getDate() + i);
    
//     // ★ ここを朝の 7:30 に設定（テスト時は今の1分後に書き換えてください）
//     targetDate.setHours(22, 31, 0, 0); 

//     if (targetDate <= now) continue;

//     const dayKey = days[targetDate.getDay()];
//     if (dayKey === "sunday" || dayKey === "saturday") continue; 

//     const summary = getDaySummary(dayKey);
//     if (!summary) continue;

//     // A. 閉じている時用の予約（TimestampTrigger）
//     registration.showNotification(`今日の時間割`, {
//       body: summary,
//       tag: `daily-${dayKey}`, //
//       showTrigger: new TimestampTrigger(targetDate.getTime()), //
//       // ★ 追加：開いているときでも音やバイブ、バナーを出すための設定
//       renotify: true,    // 同じタグでも新しい通知として扱う
//       silent: false,     // 必ず音やバイブを鳴らす
//       requireInteraction: true // ユーザーが閉じるまで通知を出しっぱなしにする
//     });

//     // B. 開いている時用の即時タイマー（追加）
//     const msUntilNotification = targetDate.getTime() - now.getTime();
    
//     // もし通知まで24時間以内ならタイマーをセット
//     if (msUntilNotification > 0 && msUntilNotification < 86400000) {
//       setTimeout(() => {
//         // 実際に表示する
//         registration.showNotification(`今日の時間割`, {
//           body: summary,
//           tag: `daily-${dayKey}`, //
//           renotify: true,
//           silent: false,
//           requireInteraction: true
//         });
//       }, msUntilNotification);
//     }
//   }
// }

// 3.js
async function setupDailyNotifications() {
  if (!('serviceWorker' in navigator) || !('showTrigger' in Notification.prototype)) {
    console.log("このブラウザは予約通知(Trigger)に未対応です。");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const now = new Date();
  
  // ★ テスト用：今この瞬間の「1分後」を計算
  const targetDate = new Date(now.getTime() + 60 * 1000); 

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayKey = days[targetDate.getDay()];
  const summary = getDaySummary(dayKey) || "テストデータ: 持ち物を確認してください";

  // 既存の同じタグの通知を一度消す
  const notifications = await registration.getNotifications();
  notifications.forEach(n => {
    if(n.tag === 'test-trigger') n.close();
  });

  // 通知を予約
  await registration.showNotification(`【自動予約】1分後テスト`, {
    body: summary,
    tag: 'test-trigger',
    showTrigger: new TimestampTrigger(targetDate.getTime()),
    renotify: true,
    silent: false,
    requireInteraction: true
  });

  // 予約時間をアラートで出して、カウントダウンしやすくする
  alert(targetDate.toLocaleTimeString() + " に予約しました。即座にブラウザを閉じてください！");
}

// --- 2. 特定の日の全教科・持ち物をまとめる関数 ---
function getDaySummary(dayKey) {
  let text = "";
  for (let i = 1; i <= 7; i++) {
    const subject = localStorage.getItem(`${dayKey}${i}_subject`);
    const item = localStorage.getItem(`${dayKey}${i}_item`);
    if (subject) {
      text += `${i}限: ${subject} ${item ? `[${item}]` : ""}\n`;
    }
  }
  return text.trim();
}

// --- 3. データの更新時に予約を更新する ---
// 既存の createSchedule 内の保存処理の後にこれを呼ぶようにします
function onScheduleChange() {
  setupDailyNotifications();
}

// ページ読み込み時にも実行
window.addEventListener('load', setupDailyNotifications);