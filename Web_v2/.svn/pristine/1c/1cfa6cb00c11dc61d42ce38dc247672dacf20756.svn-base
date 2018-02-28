/**
 * Controller: Audio of the controller.
 * @author Sean
 * @date 2017-6-6 21:23:33
 * @param {String} fp Sound file path.
 * @param {string} el Element id
 * @param {boolean} isAutoPlay Whether auto play.
 * @param {boolean} isLoop Whether loop play.
 * @constructor
 */
function AudioController (fp, el = 'sean.' + Math.random() * 1000000, isAutoPlay = false, isLoop = false) {
  let m = this;
  let s = null;
  m.fp = fp;
  m.el = el;
  m.autoplay = isAutoPlay ? 'autoplay' : '';
  m.loop = isLoop ? 'loop' : '';
  m.__createDOM__(m);
  s = document.getElementById(m.el);
  
  /**
   * Start playing the sound.
   */
  this.play = () => { s.play(); };
  
  /**
   * Pause playing the sound.
   */
  this.pause = () => { s.paused ? s.play() : s.pause() };
  
  /**
   * Stop playing the sound.
   */
  this.stop = () => {
    s.pause();
    s.currentTime = 0;
  };
  
  /**
   * Setting attributes.
   * @param {boolean} autoplay
   * @param {boolean} loop
   */
  this.setAttr = (autoplay, loop) => {
    s.autoplay = autoplay ? 'autoplay' : '';
    s.loop = loop ? 'loop' : '';
  }
}

/**
 * Create element DOM node.
 * @param m
 * @private
 */
AudioController.prototype.__createDOM__ = (m) => {
  let audioTag = document.createElement('audio');
  audioTag.id = m.el;
  audioTag.src = m.fp;
  audioTag.autoplay = m.autoplay;
  audioTag.loop = m.loop;
  document.getElementsByTagName('body')[0].appendChild(audioTag);
};