# diRty-api
Api for diRty

diRty-api rely on [Binaryify/NeteaseCloudMusicApi.](https://github.com/Binaryify/NeteaseCloudMusicApi)
After you run diRty-api it will automatic install NeteaseCloudMusicApi and its deps.
``` bash
git clone https://github.com/Muzm/diRty-api.git
cd /diRty-api
npm install
$ npm start // node 10.13.0 or heighter
```
it will open api in prot 3001.

### Notice
If your server IP not a china ip, you should add `X-Real-IP':'118.88.88.88'` in /NeteaseCloudMusicApi/util/requset.js
``` javascript
38 if (url.includes('music.163.com')) {
39   headers['Referer'] = 'https://music.163.com'
40   headers['X-Real-IP'] = '118.88.88.88'  
41 }
```
### Dockerize
``` bash 
cd diRty-api
# Dockerize in Centos 7
# First open ports on your system
dokcer image build -t dirty:0.0.1 .
docker container run -p 3001:3001 -p 3002:3002 -it dirty:0.0.1
# *OR* just pull the image from dockerhub
docker pull gazingcandy/dirty-api:0.0.1
```

