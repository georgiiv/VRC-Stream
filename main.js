const express = require('express');
const serveStatic = require('serve-static');
const NodeMediaServer = require('node-media-server');
const ffmpeg = require("fluent-ffmpeg");
const tunnelmole = require('tunnelmole/cjs');

const rtmpConfig = require("./config/rtmp-config");
const HTTPport = 45372;

const app = express();
const nms = new NodeMediaServer(rtmpConfig)
ffmpeg.setFfmpegPath("ffmpeg.exe");

app.use(serveStatic('./public'));
app.get("/", (req, res) => {
    res.status(200).redirect("/stream.m3u8")
})

async function startRemux(source) {
	var command = ffmpeg(source)
		.on('start', function() {
			console.log('Stream Started');
		})
		.on('end', function () {
			console.log('Stream Ended');
		})
		.outputOptions([
			'-c:v copy',
			'-c:a copy',
			'-f hls',
			'-hls_time 2',
			'-hls_flags delete_segments'
		]);
	command.save("./public/" + "stream.m3u8");
}

const getStreamKeyFromStreamPath = (path) => {
	let parts = path.split('/');
	return parts[parts.length - 1];
};

nms.on('prePublish', (id, StreamPath, args) => {	
	let session = nms.getSession(id);
	let streamKey = getStreamKeyFromStreamPath(StreamPath);

	// Can put a streamKey check here
	if(1){
		startRemux("rtmp://localhost:"+rtmpConfig.rtmp.port+"/"+StreamPath);
	}
	else{
		session.sendStatusMessage(session.publishStreamId, "error", "NetStream.publish.Unauthorized", "Authorization required.");
		session.reject();
	}
});

app.listen(HTTPport, function () {
	//console.log('HTTP Server started on localhost:', HTTPport);
})
nms.run();

tunnelmole({
    port: HTTPport
});


