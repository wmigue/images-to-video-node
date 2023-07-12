// var videoshow = require('videoshow')
// const jimp = require("jimp")
import Videoshow from 'videoshow'
import { resizeImages, renameFiles, getWorkdir, convertToJpg, resizeOneImage } from './functions.js'
import fs from "fs"
import path from "path"
import { URL } from 'url'

const inputPath = 'G:/_NODEJS/imagenes-a-video-converter/imagenes_input/'
//const outputPath = 'G:/_NODEJS/imagenes-a-video-converter/imagenes_output/video.avi'
const logoPath = 'G:/_NODEJS/imagenes-a-video-converter/'

const workdir = await getWorkdir()


const tratamiento = async () => {
  await resizeImages(inputPath, 640, 480)
  await resizeOneImage(logoPath,'logo.png', 250, 100)
  await convertToJpg(inputPath)
  await renameFiles(inputPath, 'image')
  return 
}

tratamiento().then(x => {
  const files = fs.readdirSync(inputPath)
  const images = []
  for (const x of files) {
    const path = `${inputPath}${x}`
    images.push({ path: path })
  }
  console.log(images)


  var logoParams = {
    start: 1,
   // end: 199,
    xAxis: 640 - 250 - 10, //video width, imagewidth, - 10
    yAxis: 20
  }

  var videoOptions = {
    fps: 25,
    loop: 6, // seconds
    transition: true,
    transitionDuration: 3,
    fade: true,
    captionDelay: 1000,
    useSubRipSubtitles: false,
    subtitleStyle: null,
    videoBitrate: 512,
    videoCodec: 'mpeg4',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4'
  }


  Videoshow(images, videoOptions)
    .audio('song.mp3')
    .logo('logo.png', logoParams)
    .subtitles('subtitles.srt')
    .save(path.join(workdir, '/imagenes_output/video.mp4'))
    .on('start', function (command) {
      console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
      console.error('Video created in:', output)
    })



})

