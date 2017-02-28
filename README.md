這是我練習[co](https://github.com/tj/co)寫的一個小玩具。

# usage

```bash
yarn install

node index.js
# print 一個json
```

預設顯示2017/2/1~2017/2/27的資料，要改的話要編輯index.js的以下區域：

```js
co(function* () {
    var feb = [];
    for (var i = 1; i <= 27; i++) {
        feb.push(`2017-02-${i}`);
    }

    var a = yield feb.map(date => getNtdForDate(date));

    console.log(JSON.stringify(a));
});
```


打開`index.html`，把上面print的json複製到裡面：

```js
// 找到這行，把字串部分用剛剛print的json取代
var data = JSON.parse('PASTE JSON HERE');
```

用瀏覽器打開index.html