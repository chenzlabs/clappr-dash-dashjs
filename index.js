import {HTML5Video, Log, Events} from 'clappr'

export default class DashDashjsPlayback extends HTML5Video {
  name() {return 'dash_dashjs_playback'}

  constructor(options) {
    super(options)
    this._embedScript()
  }

  _embedScript() {
    if (!window.Dash) {
      var script = document.createElement('script')
      script.setAttribute("type", "text/javascript")
      script.setAttribute("async", "async")
      script.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/dashjs/2.3.0/dash.all.min.js")
	// "https://sslplayers-vh.akamaihd.net/dash.js/latest/dash.all.js")
      script.onload = () => this._setup()
      script.onerror = (e) => this._onError(e)
      document.body.appendChild(script)
    } else {
      this._setup()
    }
  }

  _onError(error) {
    Log.error(error)
  }

  _setup() {
    var ccdiv, player = dashjs.MediaPlayer().create();
    player.getDebug().setLogToBrowserConsole(false);
    player.initialize(this.el,this.options.src,true);
    ccdiv=document.createElement('div');
    this.el.parentNode.appendChild(ccdiv);
    player.attachTTMLRenderingDiv(ccdiv);
    if (typeof this.options.dashjsProtectionData !== "undefined") {
      player.getProtectionController().setProtectionData(this.options.dashjsProtectionData);
    }
  }

}

DashDashjsPlayback.canPlay = function(resource, mimeType) {
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  return "mpd" === resourceParts[1]
    || mimeType === "application/dash+xml"
    || mimeType === "video/vnd.mpeg.dash.mpd"
// /* hack... still CORS issues with videoplayback... */ ||resourceParts[1].indexOf("//manifest.")>=0
// /* hack... */ ||resourceParts[1].indexOf(".ism/manifest")>=0
// /* hack... */ ||resourceParts[1].indexOf("/mpds/")>=0
}

