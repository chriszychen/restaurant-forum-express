# README

## 初始化
### Initialize
```
git clone https://github.com/your_github_name/forum-express-2020
cd forum-express
git remote add upstream https://github.com/ALPHACamp/forum-express-2020.git  # 建立上游連線
npm install
```

### 設定資料庫
需要與 config/config.json 一致

```
create database forum;
create database forum_test;
```

### 切換環境

```
export NODE_ENV=test   # 切換到測試環境，如果在等號後加其他的字串，則會切到其他的環境
echo $NODE_ENV         # 印出目前使用的環境
```

### 執行測試
```
npm run test
```

## 下載作業規格
以 A17 為例

```
git checkout -b A17           # 開新分支
git merge origin/A17-test     # 下載作業規格
npm run test                  # 直到綠燈全亮

git add .
git commit -m "...."
```

## 繳交作業

```
git push origin A17           # 上傳本地進度
```

接著改成到 GitHub 來發 PR。

## 共用帳號
請一律設定一個共用的 root user
root@example.com，登入密碼 12345678
