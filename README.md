# diRty-api
api 
api for diRty

diRty-api rely on [Binaryify/NeteaseCloudMusicApi.](https://github.com/Binaryify/NeteaseCloudMusicApi)
After you run diRty-api it will automatic install NeteaseCloudMusicApi and its deps.
``` bash
$ git clone https://github.com/Muzm/diRty-api.git
$ cd /diRty-api
$ npm install
$ npm start // node 10.13.0 or heighter
```
it will open api in prot 3001.

### notice
if your server IP not a china ip, you should add `X-Real-IP':'118.88.88.88'` in /NeteaseCloudMusicApi/util/requset.js
``` javascript
38 if (url.includes('music.163.com')) {
39   headers['Referer'] = 'https://music.163.com'
40   headers['X-Real-IP'] = '118.88.88.88'  
41 }
```
