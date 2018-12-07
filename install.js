const exec = require('child-process-promise').exec
const fs = require('fs')

const installNeteaseCloudMusicApi = async (packageTool = 'npm') => {
  const clone = (times = 0)=> {
    if(times > 2)
      console.log(`Try to clone 3 times all filed
      Please Manually clone https://github.com/Binaryify/NeteaseCloudMusicApi.git in / and run it in PORT 3002`)
    else {
      if(!fs.existsSync(__dirname + '/NeteaseCloudMusicApi') || times > 0) {
        return exec(`git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git`)
                .then(function (result) {
                    var stderr = result.stderr
                    console.log('stderr: ', stderr)
                    if(!result.error) {
                      console.log(`Installed NeteaseCloudMusicApi now install its deps`)
                      return true
                    }
                    console.log(`Install NeteaseCloudMusicApi failed retry`)
                    clone(times + 1)
                })
                .catch(err=> console.error("clone error:", err))
      } else console.log('NeteaseCloudMusicApi installed')
    }
  }

  const installDeps = (times, packageTool = 'npm')=> {
    if(times > 2) {
      console.log(`Try to install NeteaseCloudMusicApi's deps 3 times all filed
      Please Manually install in /NeteaseCloudMusicApi`)
    } else {
      if(!fs.existsSync(__dirname + '/NeteaseCloudMusicApi/node_modules') || times > 0) {
        return exec(`${packageTool} install`, {cwd: __dirname + '/NeteaseCloudMusicApi'})
                .then((result)=>{
                  if(!result.error) {
                    console.log("NeteaseCloudMusicApi's deps installed")
                    return true
                  } 
                  console.log(`NeteaseCloudMusicApi's deps install failed retry`)
                  installDeps(times + 1)
                })
                .catch(err => console.error('NeteaseCloudMusicApi install err:', err))
      } else console.log("NeteaseCloudMusicApi's deps installed")
    }
  }
  
  try {
    await clone()
    await installDeps()
    console.log('NeteaseCloudMusicApi run in port 3002')
    if(process.platform === 'win32') {
      exec('set PORT=3002 & node app.js', {cwd: __dirname + '/NeteaseCloudMusicApi'})
    } else {
      exec('PORT=3002 node app.js', {cwd: __dirname + '/NeteaseCloudMusicApi'})
    }
  } catch(e) {
    console.error('NeteaseCloudMusicApi error:', e)
  }
}

module.exports = installNeteaseCloudMusicApi