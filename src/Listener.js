/* eslint-disable no-console */
class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());
      const playlist = await this._playlistService.getPlaylist(playlistId);
      playlist.songs = await this._playlistService.getSongsInPlaylist(playlistId);

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
