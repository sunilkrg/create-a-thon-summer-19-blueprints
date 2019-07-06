import React, { Component } from "react";
import "../css/chat.scss";
import * as actions from "../actions";
import socketIOClient from "socket.io-client";
import SocketIOFileUpload from "socketio-file-upload";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Speech-to-Text",
      record: false,
      messages: [],
      error: "",
      typeing: false,
      loading: false
    };

    this.socket = socketIOClient(actions.baseUri);
    this.uploader = new SocketIOFileUpload(this.socket);
    this.socket.on("message", data => {
      this.error = "";
      if (data.message !== undefined) {
        if (data.message.length === 0) {
          this.setState({
            error: "Can't understand you properly!! Could you please repeat.",
            loading: false
          });
        } else {
          this.setState({
            messages: [...this.state.messages, data],
            error: "",
            loading: false
          });
        }
      } else {
        this.setState({ error: "Server Error", loading: false });
      }
    });
  }
  pulseInterval = null;
  messagesEndRef = null;
  chunks = [];
  mediaRecorder = null;
  myStream = null;
  recording = false;
  encoder = null;
  audio_context = null;
  node = null;
  input = null;
  stream = null;
  textInputref = null;

  scrollToBottom = () => {
    this.messagesEndRef &&
      this.messagesEndRef.scrollIntoView({ behavior: "smooth" });
  };
  componentDidUpdate = () => {
    this.scrollToBottom();
    let target = document.getElementById("record-btn");
    if (this.state.record) {
      this.pulseInterval =
        target &&
        setInterval(() => {
          target.classList.toggle("pulse");
        }, 700);
    } else {
      this.pulseInterval && clearInterval(this.pulseInterval);
    }
  };
  sendTextMsg = e => {
    if (this.textInputref) {
      let data = this.textInputref.value || "";
      this.textInputref.value = "";
      console.log(data);
      data && this.socket.emit("message_recieved", { data });
    }
  };
  componentWillMount = () => {
    window.testMessage = data => {
      this.socket.emit("message_recieved", { data });
    };
    this.encoder = new Worker("encoder.js");
    //this.encoder.postMessage({ cmd: "init" });
    this.encoder.onmessage = e => {
      if (e.data.cmd === "end") {
        console.log(e.data.buf);
        window.b = e.data.buf;
        const formData = new FormData();
        formData.append("blob", e.data.buf, "temp.flac");
        this.uploader.submitFiles([new File([e.data.buf], "temp.flac")]);
        this.setState({ loading: true });
        //this.props.dispachVoice(formData);
        //this.encoder.terminate();
        //window.encoder = null;
      } else {
        console.error(
          'Unknown event from encoder (WebWorker): "' + e.data.cmd + '"!'
        );
      }
    };
    this.encoder.postMessage({
      cmd: "init",
      config: { samplerate: 44100, bps: 16, channels: 1, compression: 5 }
    });
  };

  gotUserMedia = stream => {
    //    var mstream = new MediaStream(stream);
    this.stream = stream;
    if (typeof webkitAudioContext !== "undefined") {
      this.audio_context = new window.webkitAudioContext();
    } else if (typeof AudioContext !== "undefined") {
      this.audio_context = new window.AudioContext();
    }
    this.input = this.audio_context.createMediaStreamSource(stream);
    if (this.input.context.createJavaScriptNode)
      this.node = this.input.context.createJavaScriptNode(4096, 1, 1);
    else if (this.input.context.createScriptProcessor)
      this.node = this.input.context.createScriptProcessor(4096, 1, 1);
    this.encoder.postMessage({
      cmd: "init",
      config: { samplerate: 44100, bps: 16, channels: 1, compression: 5 }
    });
    this.node.onaudioprocess = e => {
      //if (this.recording) return;
      // see also: http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
      var channelLeft = e.inputBuffer.getChannelData(0);
      // var channelRight = e.inputBuffer.getChannelData(1);
      this.encoder.postMessage({ cmd: "encode", buf: channelLeft });
    };
    this.input && this.input.connect(this.node);
    this.node && this.node.connect(this.audio_context.destination);
  };
  error = err => {
    console.log("err", err);
  };
  getUserMedia = () => {
    this.recording = true;
    console.log("getUserMedia supported.");
    // if (navigator.webkitGetUserMedia)
    //   navigator.webkitGetUserMedia(
    //     { video: false, audio: true },
    //     this.gotUserMedia,
    //     this.error
    //   );
    // else if (navigator.mozGetUserMedia)
    //   navigator.mozGetUserMedia(
    //     { video: false, audio: true },
    //     this.gotUserMedia,
    //     this.error
    //   );
    // else
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(this.gotUserMedia)
      .catch(this.error);
  };
  stopMedia = () => {
    if (this.recording) {
      this.recording = false;
      console.log("stop recording");
      if (!this.stream) {
        console.log("error");
        return;
      }
      var tracks = this.stream.getAudioTracks();
      for (var i = tracks.length - 1; i >= 0; --i) {
        tracks[i].stop();
      }
      this.encoder.postMessage({ cmd: "finish" });

      this.input && this.input.disconnect();
      this.node && this.node.disconnect();
      this.input = this.node = null;
    }
  };

  render() {
    return (
      <div className="content">
        <div className="contact-profile">
          <img src="/harveyspecter.png" alt="" />
          <p className="mx-auto">{this.state.title}</p>
        </div>
        <div className="messages">
          <ul>
            {this.state.messages.length > 0 &&
              this.state.messages.map((msg, index) => {
                return (
                  (msg.from === "me" && (
                    <li
                      key={index}
                      className="replies"
                      ref={el => {
                        this.messagesEndRef = el;
                      }}
                    >
                      <img src="/mikeross.png" alt="" />
                      <p>{msg.message}</p>
                    </li>
                  )) || (
                    <li
                      key={index}
                      className="sent"
                      ref={el => {
                        this.messagesEndRef = el;
                      }}
                    >
                      <img src="/harveyspecter.png" alt="" />
                      <p>{msg.message}</p>
                    </li>
                  )
                );
              })}
          </ul>
        </div>
        <div className="message-input mb-3">
          <div className="wrap">
            {this.state.error && this.state.error.length > 0 && (
              <div className="error-msg">
                <div className="my-4 btn btn-outline-danger disabled error-msg">
                  {this.state.error}
                </div>
              </div>
            )}
            <div className="recordcontainer">
              {this.state.typeing ? (
                <div className="tempdiv">
                  <span className="textInputSpan ml-2">
                    <input
                      className="textInput"
                      ref={el => (this.textInputref = el)}
                      placeholder="start typing here"
                      onKeyUp={e => {
                        if (e.which === 13) {
                          this.sendTextMsg();
                        }
                      }}
                    />
                  </span>
                  <button
                    id="msg-send-btn"
                    className="buttonSend"
                    onClick={this.sendTextMsg}
                  >
                    <i className="fa fa-angle-double-up fa-10x" />
                  </button>
                </div>
              ) : this.state.record ? (
                <button
                  id="record-btn"
                  className="buttonMic"
                  onClick={e => {
                    this.setState({ record: !this.state.record });
                    setTimeout(this.stopMedia, 1000);
                  }}
                >
                  <i className="fa fa-stop fa-10x" />
                </button>
              ) : (
                <button
                  id="record-btn"
                  className="buttonMic"
                  onClick={e => {
                    this.setState({ record: !this.state.record });
                    this.getUserMedia();
                  }}
                >
                  {this.state.loading ? (
                    <img src={actions.loading} alt="" />
                  ) : (
                    <i className="fa fa-microphone fa-10x" />
                  )}
                </button>
              )}

              <button
                id="type-btn"
                className="mr-2 buttonType"
                title={this.state.typeing ? "Speek Instead" : "Type Instead"}
                onClick={e => {
                  this.setState({ typeing: !this.state.typeing });
                }}
              >
                {this.state.typeing ? (
                  <i className="fa fa-microphone fa-10x" />
                ) : (
                  <i className="fa fa-pencil fa-10x" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
