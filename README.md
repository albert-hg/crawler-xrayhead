# crawler-xrayhead

## TL;DR

這是一個擷取STANFORD提供的公開醫學資料的簡易爬蟲工具，主要解決的問題是同時擷取圖片以及由HTML渲染的資訊，並擷取成.PNG圖片檔。

此工具使用Selenium操作ChromeDriver，其中目前在專案中的ChromeDriver版本為 92.0.4515.159，請先參考下方「chrome的版本設定與下載」，以確保Driver與自己環境的Chrome版本相同。

## chrome的版本設定與下載

1. 先到下方網址確認你的chrome版本
chrome://settings/help

2. 到下方網址下載對應版本的driver
http://chromedriver.storage.googleapis.com/index.html

例如我的chrome版本為 92.0.4515.159，則driver的部分可以下載 92.0.4515.xxxx 的版本
其中 xxxx 為最新版。

3. 將下載的 chromedriver_win32.zip 解壓縮後放到 crawler-xrayhead 資料夾底下

## NodeJs下載與測試

 1. 下載NodeJs並安裝
 2. 打開cmd，輸入「node --version」，如果有成功安裝，則可以印出版本資訊
 3. 打開cmd，輸入「npm --version」，如果有成功安裝，則可以印出版本資訊

## 執行爬蟲程式

 1. 確保nodejs有下載好
 2. clone專案
 3. 確認chrome-driver的版本
 4. 打開crawler-xrayhead資料夾，並複製資料夾路徑
 5. 打開cmd，貼上「cd /d {資料夾路徑}」並執行(這裡的{}不用打出來，{}只是代表要在這個地方填入這個參數)
 6. 打開cmd，輸入「npm install」，這個動作是下載要執行程式的所需套件
 7. 打開cmd，輸入「node .\index.js」，就可以開始執行爬蟲工具了