function unityFramework(Module) {
var Module=typeof Module!=="undefined"?Module:{};(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.adapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */

    'use strict';

    var _adapter_factory = require('./adapter_factory.js');

    var adapter = (0, _adapter_factory.adapterFactory)({ window: typeof window === 'undefined' ? undefined : window });
    module.exports = adapter; // this is the difference from adapter_core.

  },{"./adapter_factory.js":2}],2:[function(require,module,exports){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.adapterFactory = adapterFactory;

    var _utils = require('./utils');

    var utils = _interopRequireWildcard(_utils);

    var _chrome_shim = require('./chrome/chrome_shim');

    var chromeShim = _interopRequireWildcard(_chrome_shim);

    var _firefox_shim = require('./firefox/firefox_shim');

    var firefoxShim = _interopRequireWildcard(_firefox_shim);

    var _safari_shim = require('./safari/safari_shim');

    var safariShim = _interopRequireWildcard(_safari_shim);

    var _common_shim = require('./common_shim');

    var commonShim = _interopRequireWildcard(_common_shim);

    var _sdp = require('sdp');

    var sdp = _interopRequireWildcard(_sdp);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Shimming starts here.
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    function adapterFactory() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        window = _ref.window;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        shimChrome: true,
        shimFirefox: true,
        shimSafari: true
      };

      // Utils.
      var logging = utils.log;
      var browserDetails = utils.detectBrowser(window);

      var adapter = {
        browserDetails: browserDetails,
        commonShim: commonShim,
        extractVersion: utils.extractVersion,
        disableLog: utils.disableLog,
        disableWarnings: utils.disableWarnings,
        // Expose sdp as a convenience. For production apps include directly.
        sdp: sdp
      };

      // Shim browser if found.
      switch (browserDetails.browser) {
        case 'chrome':
          if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
            logging('Chrome shim is not included in this adapter release.');
            return adapter;
          }
          if (browserDetails.version === null) {
            logging('Chrome shim can not determine version, not shimming.');
            return adapter;
          }
          logging('adapter.js shimming chrome.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = chromeShim;

          // Must be called before shimPeerConnection.
          commonShim.shimAddIceCandidateNullOrEmpty(window, browserDetails);

          chromeShim.shimGetUserMedia(window, browserDetails);
          chromeShim.shimMediaStream(window, browserDetails);
          chromeShim.shimPeerConnection(window, browserDetails);
          chromeShim.shimOnTrack(window, browserDetails);
          chromeShim.shimAddTrackRemoveTrack(window, browserDetails);
          chromeShim.shimGetSendersWithDtmf(window, browserDetails);
          chromeShim.shimGetStats(window, browserDetails);
          chromeShim.shimSenderReceiverGetStats(window, browserDetails);
          chromeShim.fixNegotiationNeeded(window, browserDetails);

          commonShim.shimRTCIceCandidate(window, browserDetails);
          commonShim.shimConnectionState(window, browserDetails);
          commonShim.shimMaxMessageSize(window, browserDetails);
          commonShim.shimSendThrowTypeError(window, browserDetails);
          commonShim.removeExtmapAllowMixed(window, browserDetails);
          break;
        case 'firefox':
          if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
            logging('Firefox shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming firefox.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = firefoxShim;

          // Must be called before shimPeerConnection.
          commonShim.shimAddIceCandidateNullOrEmpty(window, browserDetails);

          firefoxShim.shimGetUserMedia(window, browserDetails);
          firefoxShim.shimPeerConnection(window, browserDetails);
          firefoxShim.shimOnTrack(window, browserDetails);
          firefoxShim.shimRemoveStream(window, browserDetails);
          firefoxShim.shimSenderGetStats(window, browserDetails);
          firefoxShim.shimReceiverGetStats(window, browserDetails);
          firefoxShim.shimRTCDataChannel(window, browserDetails);
          firefoxShim.shimAddTransceiver(window, browserDetails);
          firefoxShim.shimGetParameters(window, browserDetails);
          firefoxShim.shimCreateOffer(window, browserDetails);
          firefoxShim.shimCreateAnswer(window, browserDetails);

          commonShim.shimRTCIceCandidate(window, browserDetails);
          commonShim.shimConnectionState(window, browserDetails);
          commonShim.shimMaxMessageSize(window, browserDetails);
          commonShim.shimSendThrowTypeError(window, browserDetails);
          break;
        case 'safari':
          if (!safariShim || !options.shimSafari) {
            logging('Safari shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming safari.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = safariShim;

          // Must be called before shimCallbackAPI.
          commonShim.shimAddIceCandidateNullOrEmpty(window, browserDetails);

          safariShim.shimRTCIceServerUrls(window, browserDetails);
          safariShim.shimCreateOfferLegacy(window, browserDetails);
          safariShim.shimCallbacksAPI(window, browserDetails);
          safariShim.shimLocalStreamsAPI(window, browserDetails);
          safariShim.shimRemoteStreamsAPI(window, browserDetails);
          safariShim.shimTrackEventTransceiver(window, browserDetails);
          safariShim.shimGetUserMedia(window, browserDetails);
          safariShim.shimAudioContext(window, browserDetails);

          commonShim.shimRTCIceCandidate(window, browserDetails);
          commonShim.shimMaxMessageSize(window, browserDetails);
          commonShim.shimSendThrowTypeError(window, browserDetails);
          commonShim.removeExtmapAllowMixed(window, browserDetails);
          break;
        default:
          logging('Unsupported browser!');
          break;
      }

      return adapter;
    }

// Browser shims.

  },{"./chrome/chrome_shim":3,"./common_shim":6,"./firefox/firefox_shim":7,"./safari/safari_shim":10,"./utils":11,"sdp":12}],3:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var _getusermedia = require('./getusermedia');

    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });

    var _getdisplaymedia = require('./getdisplaymedia');

    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimMediaStream = shimMediaStream;
    exports.shimOnTrack = shimOnTrack;
    exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
    exports.shimGetStats = shimGetStats;
    exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
    exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
    exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.fixNegotiationNeeded = fixNegotiationNeeded;

    var _utils = require('../utils.js');

    var utils = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function shimMediaStream(window) {
      window.MediaStream = window.MediaStream || window.webkitMediaStream;
    }

    function shimOnTrack(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
          get: function get() {
            return this._ontrack;
          },
          set: function set(f) {
            if (this._ontrack) {
              this.removeEventListener('track', this._ontrack);
            }
            this.addEventListener('track', this._ontrack = f);
          },

          enumerable: true,
          configurable: true
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var _this = this;

          if (!this._ontrackpoly) {
            this._ontrackpoly = function (e) {
              // onaddstream does not fire when a track is added to an existing
              // stream. But stream.onaddtrack is implemented so we use that.
              e.stream.addEventListener('addtrack', function (te) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function (r) {
                    return r.track && r.track.id === te.track.id;
                  });
                } else {
                  receiver = { track: te.track };
                }

                var event = new Event('track');
                event.track = te.track;
                event.receiver = receiver;
                event.transceiver = { receiver: receiver };
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
              e.stream.getTracks().forEach(function (track) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function (r) {
                    return r.track && r.track.id === track.id;
                  });
                } else {
                  receiver = { track: track };
                }
                var event = new Event('track');
                event.track = track;
                event.receiver = receiver;
                event.transceiver = { receiver: receiver };
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
            };
            this.addEventListener('addstream', this._ontrackpoly);
          }
          return origSetRemoteDescription.apply(this, arguments);
        };
      } else {
        // even if RTCRtpTransceiver is in window, it is only used and
        // emitted in unified-plan. Unfortunately this means we need
        // to unconditionally wrap the event.
        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
          if (!e.transceiver) {
            Object.defineProperty(e, 'transceiver', { value: { receiver: e.receiver } });
          }
          return e;
        });
      }
    }

    function shimGetSendersWithDtmf(window) {
      // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
        var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
          return {
            track: track,
            get dtmf() {
              if (this._dtmf === undefined) {
                if (track.kind === 'audio') {
                  this._dtmf = pc.createDTMFSender(track);
                } else {
                  this._dtmf = null;
                }
              }
              return this._dtmf;
            },
            _pc: pc
          };
        };

        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            this._senders = this._senders || [];
            return this._senders.slice(); // return a copy of the internal state.
          };
          var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
          window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
            var sender = origAddTrack.apply(this, arguments);
            if (!sender) {
              sender = shimSenderWithDtmf(this, track);
              this._senders.push(sender);
            }
            return sender;
          };

          var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
          window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
            origRemoveTrack.apply(this, arguments);
            var idx = this._senders.indexOf(sender);
            if (idx !== -1) {
              this._senders.splice(idx, 1);
            }
          };
        }
        var origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this2 = this;

          this._senders = this._senders || [];
          origAddStream.apply(this, [stream]);
          stream.getTracks().forEach(function (track) {
            _this2._senders.push(shimSenderWithDtmf(_this2, track));
          });
        };

        var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this3 = this;

          this._senders = this._senders || [];
          origRemoveStream.apply(this, [stream]);

          stream.getTracks().forEach(function (track) {
            var sender = _this3._senders.find(function (s) {
              return s.track === track;
            });
            if (sender) {
              // remove sender
              _this3._senders.splice(_this3._senders.indexOf(sender), 1);
            }
          });
        };
      } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          var _this4 = this;

          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this4;
          });
          return senders;
        };

        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get: function get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = this._pc.createDTMFSender(this.track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
    }

    function shimGetStats(window) {
      if (!window.RTCPeerConnection) {
        return;
      }

      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _this5 = this;

        var _arguments = Array.prototype.slice.call(arguments),
          selector = _arguments[0],
          onSucc = _arguments[1],
          onErr = _arguments[2];

        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.


        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats.apply(this, arguments);
        }

        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) {
          return origGetStats.apply(this, []);
        }

        var fixChromeStats_ = function fixChromeStats_(response) {
          var standardReport = {};
          var reports = response.result();
          reports.forEach(function (report) {
            var standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: {
                localcandidate: 'local-candidate',
                remotecandidate: 'remote-candidate'
              }[report.type] || report.type
            };
            report.names().forEach(function (name) {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });

          return standardReport;
        };

        // shim getStats with maplike support
        var makeMapStats = function makeMapStats(stats) {
          return new Map(Object.keys(stats).map(function (key) {
            return [key, stats[key]];
          }));
        };

        if (arguments.length >= 2) {
          var successCallbackWrapper_ = function successCallbackWrapper_(response) {
            onSucc(makeMapStats(fixChromeStats_(response)));
          };

          return origGetStats.apply(this, [successCallbackWrapper_, selector]);
        }

        // promise-support
        return new Promise(function (resolve, reject) {
          origGetStats.apply(_this5, [function (response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
        }).then(onSucc, onErr);
      };
    }

    function shimSenderReceiverGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
      }

      // shim sender stats.
      if (!('getStats' in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            var _this6 = this;

            var senders = origGetSenders.apply(this, []);
            senders.forEach(function (sender) {
              return sender._pc = _this6;
            });
            return senders;
          };
        }

        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
          window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            var sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
          };
        }
        window.RTCRtpSender.prototype.getStats = function getStats() {
          var sender = this;
          return this._pc.getStats().then(function (result) {
            return (
              /* Note: this will include stats of all senders that
               *   send a track with the same id as sender.track as
               *   it is not possible to identify the RTCRtpSender.
               */
              utils.filterStats(result, sender.track, true)
            );
          });
        };
      }

      // shim receiver stats.
      if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
          window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
            var _this7 = this;

            var receivers = origGetReceivers.apply(this, []);
            receivers.forEach(function (receiver) {
              return receiver._pc = _this7;
            });
            return receivers;
          };
        }
        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
          e.receiver._pc = e.srcElement;
          return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
          var receiver = this;
          return this._pc.getStats().then(function (result) {
            return utils.filterStats(result, receiver.track, false);
          });
        };
      }

      if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
        return;
      }

      // shim RTCPeerConnection.getStats(track).
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
          var track = arguments[0];
          var sender = void 0;
          var receiver = void 0;
          var err = void 0;
          this.getSenders().forEach(function (s) {
            if (s.track === track) {
              if (sender) {
                err = true;
              } else {
                sender = s;
              }
            }
          });
          this.getReceivers().forEach(function (r) {
            if (r.track === track) {
              if (receiver) {
                err = true;
              } else {
                receiver = r;
              }
            }
            return r.track === track;
          });
          if (err || sender && receiver) {
            return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
          } else if (sender) {
            return sender.getStats();
          } else if (receiver) {
            return receiver.getStats();
          }
          return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
      };
    }

    function shimAddTrackRemoveTrackWithNative(window) {
      // shim addTrack/removeTrack with native variants in order to make
      // the interactions with legacy getLocalStreams behave as in other browsers.
      // Keeps a mapping stream.id => [stream, rtpsenders...]
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this8 = this;

        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
          return _this8._shimmedLocalStreams[streamId][0];
        });
      };

      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (!stream) {
          return origAddTrack.apply(this, arguments);
        }
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

        var sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) {
          this._shimmedLocalStreams[stream.id] = [stream, sender];
        } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
          this._shimmedLocalStreams[stream.id].push(sender);
        }
        return sender;
      };

      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this9 = this;

        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

        stream.getTracks().forEach(function (track) {
          var alreadyExists = _this9.getSenders().find(function (s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
          }
        });
        var existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        var newSenders = this.getSenders().filter(function (newSender) {
          return existingSenders.indexOf(newSender) === -1;
        });
        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
      };

      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
      };

      var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this10 = this;

        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) {
          Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
            var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) {
              _this10._shimmedLocalStreams[streamId].splice(idx, 1);
            }
            if (_this10._shimmedLocalStreams[streamId].length === 1) {
              delete _this10._shimmedLocalStreams[streamId];
            }
          });
        }
        return origRemoveTrack.apply(this, arguments);
      };
    }

    function shimAddTrackRemoveTrack(window, browserDetails) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // shim addTrack and removeTrack.
      if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
      }

      // also shim pc.getLocalStreams when addTrack is shimmed
      // to return the original streams.
      var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this11 = this;

        var nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map(function (stream) {
          return _this11._reverseStreams[stream.id];
        });
      };

      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this12 = this;

        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};

        stream.getTracks().forEach(function (track) {
          var alreadyExists = _this12.getSenders().find(function (s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
          }
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
          var newStream = new window.MediaStream(stream.getTracks());
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          stream = newStream;
        }
        origAddStream.apply(this, [stream]);
      };

      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};

        origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
      };

      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        var _this13 = this;

        if (this.signalingState === 'closed') {
          throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        var streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
          return t === track;
        })) {
          // this is not fully correct but all we can manage without
          // [[associated MediaStreams]] internal slot.
          throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
        }

        var alreadyExists = this.getSenders().find(function (s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.', 'InvalidAccessError');
        }

        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        var oldStream = this._streams[stream.id];
        if (oldStream) {
          // this is using odd Chrome behaviour, use with caution:
          // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
          // Note: we rely on the high-level addTrack/dtmf shim to
          // create the sender with a dtmf sender.
          oldStream.addTrack(track);

          // Trigger ONN async.
          Promise.resolve().then(function () {
            _this13.dispatchEvent(new Event('negotiationneeded'));
          });
        } else {
          var newStream = new window.MediaStream([track]);
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          this.addStream(newStream);
        }
        return this.getSenders().find(function (s) {
          return s.track === track;
        });
      };

      // replace the internal stream id with the external one and
      // vice versa.
      function replaceInternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp: sdp
        });
      }
      function replaceExternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp: sdp
        });
      }
      ['createOffer', 'createAnswer'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = _defineProperty({}, method, function () {
          var _this14 = this;

          var args = arguments;
          var isLegacyCall = arguments.length && typeof arguments[0] === 'function';
          if (isLegacyCall) {
            return nativeMethod.apply(this, [function (description) {
              var desc = replaceInternalStreamId(_this14, description);
              args[0].apply(null, [desc]);
            }, function (err) {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]]);
          }
          return nativeMethod.apply(this, arguments).then(function (description) {
            return replaceInternalStreamId(_this14, description);
          });
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });

      var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) {
          return origSetLocalDescription.apply(this, arguments);
        }
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
      };

      // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

      var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
      Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
        get: function get() {
          var description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });

      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this15 = this;

        if (this.signalingState === 'closed') {
          throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) {
          throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
        }
        var isLocal = sender._pc === this;
        if (!isLocal) {
          throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
        }

        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        var stream = void 0;
        Object.keys(this._streams).forEach(function (streamid) {
          var hasTrack = _this15._streams[streamid].getTracks().find(function (track) {
            return sender.track === track;
          });
          if (hasTrack) {
            stream = _this15._streams[streamid];
          }
        });

        if (stream) {
          if (stream.getTracks().length === 1) {
            // if this is the last track of the stream, remove the stream. This
            // takes care of any shimmed _senders.
            this.removeStream(this._reverseStreams[stream.id]);
          } else {
            // relying on the same odd chrome behaviour as above.
            stream.removeTrack(sender.track);
          }
          this.dispatchEvent(new Event('negotiationneeded'));
        }
      };
    }

    function shimPeerConnection(window, browserDetails) {
      if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
      }
      if (!window.RTCPeerConnection) {
        return;
      }

      // shim implicit creation of RTCSessionDescription/RTCIceCandidate
      if (browserDetails.version < 53) {
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          var methodObj = _defineProperty({}, method, function () {
            arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          });
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
      }
    }

// Attempt to fix ONN in plan-b mode.
    function fixNegotiationNeeded(window, browserDetails) {
      utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function (e) {
        var pc = e.target;
        if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
          if (pc.signalingState !== 'stable') {
            return;
          }
        }
        return e;
      });
    }

  },{"../utils.js":11,"./getdisplaymedia":4,"./getusermedia":5}],4:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, getSourceId) {
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      // getSourceId is a function that returns a promise resolving with
      // the sourceId of the screen/window/tab to be shared.
      if (typeof getSourceId !== 'function') {
        console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        return getSourceId(constraints).then(function (sourceId) {
          var widthSpecified = constraints.video && constraints.video.width;
          var heightSpecified = constraints.video && constraints.video.height;
          var frameRateSpecified = constraints.video && constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
      };
    }

  },{}],5:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    exports.shimGetUserMedia = shimGetUserMedia;

    var _utils = require('../utils.js');

    var utils = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

    var logging = utils.log;

    function shimGetUserMedia(window, browserDetails) {
      var navigator = window && window.navigator;

      if (!navigator.mediaDevices) {
        return;
      }

      var constraintsToChrome_ = function constraintsToChrome_(c) {
        if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
          return c;
        }
        var cc = {};
        Object.keys(c).forEach(function (key) {
          if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
            return;
          }
          var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
          if (r.exact !== undefined && typeof r.exact === 'number') {
            r.min = r.max = r.exact;
          }
          var oldname_ = function oldname_(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return name === 'deviceId' ? 'sourceId' : name;
          };
          if (r.ideal !== undefined) {
            cc.optional = cc.optional || [];
            var oc = {};
            if (typeof r.ideal === 'number') {
              oc[oldname_('min', key)] = r.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_('max', key)] = r.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_('', key)] = r.ideal;
              cc.optional.push(oc);
            }
          }
          if (r.exact !== undefined && typeof r.exact !== 'number') {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_('', key)] = r.exact;
          } else {
            ['min', 'max'].forEach(function (mix) {
              if (r[mix] !== undefined) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r[mix];
              }
            });
          }
        });
        if (c.advanced) {
          cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
      };

      var shimConstraints_ = function shimConstraints_(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && _typeof(constraints.audio) === 'object') {
          var remap = function remap(obj, a, b) {
            if (a in obj && !(b in obj)) {
              obj[b] = obj[a];
              delete obj[a];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
          remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && _typeof(constraints.video) === 'object') {
          // Shim facingMode for mobile & surface pro.
          var face = constraints.video.facingMode;
          face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : { ideal: face });
          var getSupportedFacingModeLies = browserDetails.version < 66;

          if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            var matches = void 0;
            if (face.exact === 'environment' || face.ideal === 'environment') {
              matches = ['back', 'rear'];
            } else if (face.exact === 'user' || face.ideal === 'user') {
              matches = ['front'];
            }
            if (matches) {
              // Look for matches in label, or use last cam for back (typical).
              return navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices = devices.filter(function (d) {
                  return d.kind === 'videoinput';
                });
                var dev = devices.find(function (d) {
                  return matches.some(function (match) {
                    return d.label.toLowerCase().includes(match);
                  });
                });
                if (!dev && devices.length && matches.includes('back')) {
                  dev = devices[devices.length - 1]; // more likely the back cam
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging('chrome: ' + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
      };

      var shimError_ = function shimError_(e) {
        if (browserDetails.version >= 64) {
          return e;
        }
        return {
          name: {
            PermissionDeniedError: 'NotAllowedError',
            PermissionDismissedError: 'NotAllowedError',
            InvalidStateError: 'NotAllowedError',
            DevicesNotFoundError: 'NotFoundError',
            ConstraintNotSatisfiedError: 'OverconstrainedError',
            TrackStartError: 'NotReadableError',
            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
            MediaDeviceKillSwitchOn: 'NotAllowedError',
            TabCaptureError: 'AbortError',
            ScreenCaptureError: 'AbortError',
            DeviceCaptureError: 'AbortError'
          }[e.name] || e.name,
          message: e.message,
          constraint: e.constraint || e.constraintName,
          toString: function toString() {
            return this.name + (this.message && ': ') + this.message;
          }
        };
      };

      var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
        shimConstraints_(constraints, function (c) {
          navigator.webkitGetUserMedia(c, onSuccess, function (e) {
            if (onError) {
              onError(shimError_(e));
            }
          });
        });
      };
      navigator.getUserMedia = getUserMedia_.bind(navigator);

      // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
      // function which returns a Promise, it does not accept spec-style
      // constraints.
      if (navigator.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function (cs) {
          return shimConstraints_(cs, function (c) {
            return origGetUserMedia(c).then(function (stream) {
              if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                stream.getTracks().forEach(function (track) {
                  track.stop();
                });
                throw new DOMException('', 'NotFoundError');
              }
              return stream;
            }, function (e) {
              return Promise.reject(shimError_(e));
            });
          });
        };
      }
    }

  },{"../utils.js":11}],6:[function(require,module,exports){
    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    exports.shimRTCIceCandidate = shimRTCIceCandidate;
    exports.shimMaxMessageSize = shimMaxMessageSize;
    exports.shimSendThrowTypeError = shimSendThrowTypeError;
    exports.shimConnectionState = shimConnectionState;
    exports.removeExtmapAllowMixed = removeExtmapAllowMixed;
    exports.shimAddIceCandidateNullOrEmpty = shimAddIceCandidateNullOrEmpty;

    var _sdp = require('sdp');

    var _sdp2 = _interopRequireDefault(_sdp);

    var _utils = require('./utils');

    var utils = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function shimRTCIceCandidate(window) {
      // foundation is arbitrarily chosen as an indicator for full support for
      // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
      if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
        return;
      }

      var NativeRTCIceCandidate = window.RTCIceCandidate;
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
          args = JSON.parse(JSON.stringify(args));
          args.candidate = args.candidate.substr(2);
        }

        if (args.candidate && args.candidate.length) {
          // Augment the native candidate with the parsed fields.
          var nativeCandidate = new NativeRTCIceCandidate(args);
          var parsedCandidate = _sdp2.default.parseCandidate(args.candidate);
          var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);

          // Add a serializer that does not serialize the extra attributes.
          augmentedCandidate.toJSON = function toJSON() {
            return {
              candidate: augmentedCandidate.candidate,
              sdpMid: augmentedCandidate.sdpMid,
              sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
              usernameFragment: augmentedCandidate.usernameFragment
            };
          };
          return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
      };
      window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

      // Hook up the augmented candidate in onicecandidate and
      // addEventListener('icecandidate', ...)
      utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
        if (e.candidate) {
          Object.defineProperty(e, 'candidate', {
            value: new window.RTCIceCandidate(e.candidate),
            writable: 'false'
          });
        }
        return e;
      });
    }

    function shimMaxMessageSize(window, browserDetails) {
      if (!window.RTCPeerConnection) {
        return;
      }

      if (!('sctp' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
          get: function get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          }
        });
      }

      var sctpInDescription = function sctpInDescription(description) {
        if (!description || !description.sdp) {
          return false;
        }
        var sections = _sdp2.default.splitSections(description.sdp);
        sections.shift();
        return sections.some(function (mediaSection) {
          var mLine = _sdp2.default.parseMLine(mediaSection);
          return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
        });
      };

      var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
        // TODO: Is there a better solution for detecting Firefox?
        var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
          return -1;
        }
        var version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
      };

      var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        var canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
          if (browserDetails.version < 57) {
            if (remoteIsFirefox === -1) {
              // FF < 57 will send in 16 KiB chunks using the deprecated PPID
              // fragmentation.
              canSendMaxMessageSize = 16384;
            } else {
              // However, other FF (and RAWRTC) can reassemble PPID-fragmented
              // messages. Thus, supporting ~2 GiB when sending.
              canSendMaxMessageSize = 2147483637;
            }
          } else if (browserDetails.version < 60) {
            // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
          } else {
            // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
          }
        }
        return canSendMaxMessageSize;
      };

      var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        var maxMessageSize = 65536;

        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
          maxMessageSize = 65535;
        }

        var match = _sdp2.default.matchPrefix(description.sdp, 'a=max-message-size:');
        if (match.length > 0) {
          maxMessageSize = parseInt(match[0].substr(19), 10);
        } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
          // If the maximum message size is not present in the remote SDP and
          // both local and remote are Firefox, the remote peer can receive
          // ~2 GiB.
          maxMessageSize = 2147483637;
        }
        return maxMessageSize;
      };

      var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        this._sctp = null;
        // Chrome decided to not expose .sctp in plan-b mode.
        // As usual, adapter.js has to do an 'ugly worakaround'
        // to cover up the mess.
        if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
          var _getConfiguration = this.getConfiguration(),
            sdpSemantics = _getConfiguration.sdpSemantics;

          if (sdpSemantics === 'plan-b') {
            Object.defineProperty(this, 'sctp', {
              get: function get() {
                return typeof this._sctp === 'undefined' ? null : this._sctp;
              },

              enumerable: true,
              configurable: true
            });
          }
        }

        if (sctpInDescription(arguments[0])) {
          // Check if the remote is FF.
          var isFirefox = getRemoteFirefoxVersion(arguments[0]);

          // Get the maximum message size the local peer is capable of sending
          var canSendMMS = getCanSendMaxMessageSize(isFirefox);

          // Get the maximum message size of the remote peer.
          var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

          // Determine final maximum message size
          var maxMessageSize = void 0;
          if (canSendMMS === 0 && remoteMMS === 0) {
            maxMessageSize = Number.POSITIVE_INFINITY;
          } else if (canSendMMS === 0 || remoteMMS === 0) {
            maxMessageSize = Math.max(canSendMMS, remoteMMS);
          } else {
            maxMessageSize = Math.min(canSendMMS, remoteMMS);
          }

          // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
          // attribute.
          var sctp = {};
          Object.defineProperty(sctp, 'maxMessageSize', {
            get: function get() {
              return maxMessageSize;
            }
          });
          this._sctp = sctp;
        }

        return origSetRemoteDescription.apply(this, arguments);
      };
    }

    function shimSendThrowTypeError(window) {
      if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
        return;
      }

      // Note: Although Firefox >= 57 has a native implementation, the maximum
      //       message size can be reset for all data channels at a later stage.
      //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

      function wrapDcSend(dc, pc) {
        var origDataChannelSend = dc.send;
        dc.send = function send() {
          var data = arguments[0];
          var length = data.length || data.size || data.byteLength;
          if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
            throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
          }
          return origDataChannelSend.apply(dc, arguments);
        };
      }
      var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
      window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
        var dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
      };
      utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
        wrapDcSend(e.channel, e.target);
        return e;
      });
    }

    /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
     * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
     * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
     * since DTLS failures would be hidden. See
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
     * for the Firefox tracking bug.
     */
    function shimConnectionState(window) {
      if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      Object.defineProperty(proto, 'connectionState', {
        get: function get() {
          return {
            completed: 'connected',
            checking: 'connecting'
          }[this.iceConnectionState] || this.iceConnectionState;
        },

        enumerable: true,
        configurable: true
      });
      Object.defineProperty(proto, 'onconnectionstatechange', {
        get: function get() {
          return this._onconnectionstatechange || null;
        },
        set: function set(cb) {
          if (this._onconnectionstatechange) {
            this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
            delete this._onconnectionstatechange;
          }
          if (cb) {
            this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
          }
        },

        enumerable: true,
        configurable: true
      });

      ['setLocalDescription', 'setRemoteDescription'].forEach(function (method) {
        var origMethod = proto[method];
        proto[method] = function () {
          if (!this._connectionstatechangepoly) {
            this._connectionstatechangepoly = function (e) {
              var pc = e.target;
              if (pc._lastConnectionState !== pc.connectionState) {
                pc._lastConnectionState = pc.connectionState;
                var newEvent = new Event('connectionstatechange', e);
                pc.dispatchEvent(newEvent);
              }
              return e;
            };
            this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
          }
          return origMethod.apply(this, arguments);
        };
      });
    }

    function removeExtmapAllowMixed(window, browserDetails) {
      /* remove a=extmap-allow-mixed for webrtc.org < M71 */
      if (!window.RTCPeerConnection) {
        return;
      }
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
        return;
      }
      if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
        return;
      }
      var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
          var sdp = desc.sdp.split('\n').filter(function (line) {
            return line.trim() !== 'a=extmap-allow-mixed';
          }).join('\n');
          // Safari enforces read-only-ness of RTCSessionDescription fields.
          if (window.RTCSessionDescription && desc instanceof window.RTCSessionDescription) {
            arguments[0] = new window.RTCSessionDescription({
              type: desc.type,
              sdp: sdp
            });
          } else {
            desc.sdp = sdp;
          }
        }
        return nativeSRD.apply(this, arguments);
      };
    }

    function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
      // Support for addIceCandidate(null or undefined)
      // as well as addIceCandidate({candidate: "", ...})
      // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
      // Note: must be called before other polyfills which change the signature.
      if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
        return;
      }
      var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
      if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
        return;
      }
      window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        // Native support for ignoring exists for Chrome M77+.
        // Safari ignores as well, exact version unknown but works in the same
        // version that also ignores addIceCandidate(null).
        if ((browserDetails.browser === 'chrome' && browserDetails.version < 78 || browserDetails.browser === 'firefox' && browserDetails.version < 68 || browserDetails.browser === 'safari') && arguments[0] && arguments[0].candidate === '') {
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
    }

  },{"./utils":11,"sdp":12}],7:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var _getusermedia = require('./getusermedia');

    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });

    var _getdisplaymedia = require('./getdisplaymedia');

    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimOnTrack = shimOnTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.shimSenderGetStats = shimSenderGetStats;
    exports.shimReceiverGetStats = shimReceiverGetStats;
    exports.shimRemoveStream = shimRemoveStream;
    exports.shimRTCDataChannel = shimRTCDataChannel;
    exports.shimAddTransceiver = shimAddTransceiver;
    exports.shimGetParameters = shimGetParameters;
    exports.shimCreateOffer = shimCreateOffer;
    exports.shimCreateAnswer = shimCreateAnswer;

    var _utils = require('../utils');

    var utils = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function shimOnTrack(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get: function get() {
            return { receiver: this.receiver };
          }
        });
      }
    }

    function shimPeerConnection(window, browserDetails) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return; // probably media.peerconnection.enabled=false in about:config
      }
      if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.mozRTCPeerConnection;
      }

      if (browserDetails.version < 53) {
        // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          var methodObj = _defineProperty({}, method, function () {
            arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          });
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
      }

      var modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      };

      var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _arguments = Array.prototype.slice.call(arguments),
          selector = _arguments[0],
          onSucc = _arguments[1],
          onErr = _arguments[2];

        return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function (stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function (stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        }).then(onSucc, onErr);
      };
    }

    function shimSenderGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
        return;
      }
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          var _this = this;

          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this;
          });
          return senders;
        };
      }

      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          var sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
      };
    }

    function shimReceiverGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
        return;
      }
      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          var _this2 = this;

          var receivers = origGetReceivers.apply(this, []);
          receivers.forEach(function (receiver) {
            return receiver._pc = _this2;
          });
          return receivers;
        };
      }
      utils.wrapPeerConnectionEvent(window, 'track', function (e) {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
      };
    }

    function shimRemoveStream(window) {
      if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
        return;
      }
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this3 = this;

        utils.deprecated('removeStream', 'removeTrack');
        this.getSenders().forEach(function (sender) {
          if (sender.track && stream.getTracks().includes(sender.track)) {
            _this3.removeTrack(sender);
          }
        });
      };
    }

    function shimRTCDataChannel(window) {
      // rename DataChannel to RTCDataChannel (native fix in FF60):
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
      if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
      }
    }

    function shimAddTransceiver(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
        return;
      }
      var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
      if (origAddTransceiver) {
        window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
          this.setParametersPromises = [];
          var initParameters = arguments[1];
          var shouldPerformCheck = initParameters && 'sendEncodings' in initParameters;
          if (shouldPerformCheck) {
            // If sendEncodings params are provided, validate grammar
            initParameters.sendEncodings.forEach(function (encodingParam) {
              if ('rid' in encodingParam) {
                var ridRegex = /^[a-z0-9]{0,16}$/i;
                if (!ridRegex.test(encodingParam.rid)) {
                  throw new TypeError('Invalid RID value provided.');
                }
              }
              if ('scaleResolutionDownBy' in encodingParam) {
                if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                  throw new RangeError('scale_resolution_down_by must be >= 1.0');
                }
              }
              if ('maxFramerate' in encodingParam) {
                if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                  throw new RangeError('max_framerate must be >= 0.0');
                }
              }
            });
          }
          var transceiver = origAddTransceiver.apply(this, arguments);
          if (shouldPerformCheck) {
            // Check if the init options were applied. If not we do this in an
            // asynchronous way and save the promise reference in a global object.
            // This is an ugly hack, but at the same time is way more robust than
            // checking the sender parameters before and after the createOffer
            // Also note that after the createoffer we are not 100% sure that
            // the params were asynchronously applied so we might miss the
            // opportunity to recreate offer.
            var sender = transceiver.sender;

            var params = sender.getParameters();
            if (!('encodings' in params) ||
              // Avoid being fooled by patched getParameters() below.
              params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
              params.encodings = initParameters.sendEncodings;
              sender.sendEncodings = initParameters.sendEncodings;
              this.setParametersPromises.push(sender.setParameters(params).then(function () {
                delete sender.sendEncodings;
              }).catch(function () {
                delete sender.sendEncodings;
              }));
            }
          }
          return transceiver;
        };
      }
    }

    function shimGetParameters(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCRtpSender)) {
        return;
      }
      var origGetParameters = window.RTCRtpSender.prototype.getParameters;
      if (origGetParameters) {
        window.RTCRtpSender.prototype.getParameters = function getParameters() {
          var params = origGetParameters.apply(this, arguments);
          if (!('encodings' in params)) {
            params.encodings = [].concat(this.sendEncodings || [{}]);
          }
          return params;
        };
      }
    }

    function shimCreateOffer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
        return;
      }
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        var _this4 = this,
          _arguments2 = arguments;

        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises).then(function () {
            return origCreateOffer.apply(_this4, _arguments2);
          }).finally(function () {
            _this4.setParametersPromises = [];
          });
        }
        return origCreateOffer.apply(this, arguments);
      };
    }

    function shimCreateAnswer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
        return;
      }
      var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
      window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        var _this5 = this,
          _arguments3 = arguments;

        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises).then(function () {
            return origCreateAnswer.apply(_this5, _arguments3);
          }).finally(function () {
            _this5.setParametersPromises = [];
          });
        }
        return origCreateAnswer.apply(this, arguments);
      };
    }

  },{"../utils":11,"./getdisplaymedia":8,"./getusermedia":9}],8:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, preferredMediaSource) {
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
          var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
          err.name = 'NotFoundError';
          // from https://heycam.github.io/webidl/#idl-DOMException-error-names
          err.code = 8;
          return Promise.reject(err);
        }
        if (constraints.video === true) {
          constraints.video = { mediaSource: preferredMediaSource };
        } else {
          constraints.video.mediaSource = preferredMediaSource;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
      };
    }

  },{}],9:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    exports.shimGetUserMedia = shimGetUserMedia;

    var _utils = require('../utils');

    var utils = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

    function shimGetUserMedia(window, browserDetails) {
      var navigator = window && window.navigator;
      var MediaStreamTrack = window && window.MediaStreamTrack;

      navigator.getUserMedia = function (constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };

      if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        var remap = function remap(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };

        var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function (c) {
          if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeGetUserMedia(c);
        };

        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function () {
            var obj = nativeGetSettings.apply(this, arguments);
            remap(obj, 'mozAutoGainControl', 'autoGainControl');
            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
            return obj;
          };
        }

        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function (c) {
            if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
              c = JSON.parse(JSON.stringify(c));
              remap(c, 'autoGainControl', 'mozAutoGainControl');
              remap(c, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeApplyConstraints.apply(this, [c]);
          };
        }
      }
    }

  },{"../utils":11}],10:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
    exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
    exports.shimCallbacksAPI = shimCallbacksAPI;
    exports.shimGetUserMedia = shimGetUserMedia;
    exports.shimConstraints = shimConstraints;
    exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
    exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
    exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
    exports.shimAudioContext = shimAudioContext;

    var _utils = require('../utils');

    var utils = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

    function shimLocalStreamsAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          return this._localStreams;
        };
      }
      if (!('addStream' in window.RTCPeerConnection.prototype)) {
        var _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this = this;

          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          // Try to emulate Chrome's behaviour of adding in audio-video order.
          // Safari orders by track id.
          stream.getAudioTracks().forEach(function (track) {
            return _addTrack.call(_this, track, stream);
          });
          stream.getVideoTracks().forEach(function (track) {
            return _addTrack.call(_this, track, stream);
          });
        };

        window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
          var _this2 = this;

          for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            streams[_key - 1] = arguments[_key];
          }

          if (streams) {
            streams.forEach(function (stream) {
              if (!_this2._localStreams) {
                _this2._localStreams = [stream];
              } else if (!_this2._localStreams.includes(stream)) {
                _this2._localStreams.push(stream);
              }
            });
          }
          return _addTrack.apply(this, arguments);
        };
      }
      if (!('removeStream' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this3 = this;

          if (!this._localStreams) {
            this._localStreams = [];
          }
          var index = this._localStreams.indexOf(stream);
          if (index === -1) {
            return;
          }
          this._localStreams.splice(index, 1);
          var tracks = stream.getTracks();
          this.getSenders().forEach(function (sender) {
            if (tracks.includes(sender.track)) {
              _this3.removeTrack(sender);
            }
          });
        };
      }
    }

    function shimRemoteStreamsAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
          return this._remoteStreams ? this._remoteStreams : [];
        };
      }
      if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
          get: function get() {
            return this._onaddstream;
          },
          set: function set(f) {
            var _this4 = this;

            if (this._onaddstream) {
              this.removeEventListener('addstream', this._onaddstream);
              this.removeEventListener('track', this._onaddstreampoly);
            }
            this.addEventListener('addstream', this._onaddstream = f);
            this.addEventListener('track', this._onaddstreampoly = function (e) {
              e.streams.forEach(function (stream) {
                if (!_this4._remoteStreams) {
                  _this4._remoteStreams = [];
                }
                if (_this4._remoteStreams.includes(stream)) {
                  return;
                }
                _this4._remoteStreams.push(stream);
                var event = new Event('addstream');
                event.stream = stream;
                _this4.dispatchEvent(event);
              });
            });
          }
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var pc = this;
          if (!this._onaddstreampoly) {
            this.addEventListener('track', this._onaddstreampoly = function (e) {
              e.streams.forEach(function (stream) {
                if (!pc._remoteStreams) {
                  pc._remoteStreams = [];
                }
                if (pc._remoteStreams.indexOf(stream) >= 0) {
                  return;
                }
                pc._remoteStreams.push(stream);
                var event = new Event('addstream');
                event.stream = stream;
                pc.dispatchEvent(event);
              });
            });
          }
          return origSetRemoteDescription.apply(pc, arguments);
        };
      }
    }

    function shimCallbacksAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      var prototype = window.RTCPeerConnection.prototype;
      var origCreateOffer = prototype.createOffer;
      var origCreateAnswer = prototype.createAnswer;
      var setLocalDescription = prototype.setLocalDescription;
      var setRemoteDescription = prototype.setRemoteDescription;
      var addIceCandidate = prototype.addIceCandidate;

      prototype.createOffer = function createOffer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateOffer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };

      prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateAnswer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };

      var withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;

      withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;

      withCallback = function withCallback(candidate, successCallback, failureCallback) {
        var promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }

    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        var mediaDevices = navigator.mediaDevices;
        var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = function (constraints) {
          return _getUserMedia(shimConstraints(constraints));
        };
      }

      if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
        }.bind(navigator);
      }
    }

    function shimConstraints(constraints) {
      if (constraints && constraints.video !== undefined) {
        return Object.assign({}, constraints, { video: utils.compactObject(constraints.video) });
      }

      return constraints;
    }

    function shimRTCIceServerUrls(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
              utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              delete server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if ('generateCertificate' in OrigPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function get() {
            return OrigPeerConnection.generateCertificate;
          }
        });
      }
    }

    function shimTrackEventTransceiver(window) {
      // Add event.transceiver member over deprecated event.receiver
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get: function get() {
            return { receiver: this.receiver };
          }
        });
      }
    }

    function shimCreateOfferLegacy(window) {
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
          if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
          }
          var audioTransceiver = this.getTransceivers().find(function (transceiver) {
            return transceiver.receiver.track.kind === 'audio';
          });
          if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
            if (audioTransceiver.direction === 'sendrecv') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('sendonly');
              } else {
                audioTransceiver.direction = 'sendonly';
              }
            } else if (audioTransceiver.direction === 'recvonly') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('inactive');
              } else {
                audioTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
            this.addTransceiver('audio');
          }

          if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
          }
          var videoTransceiver = this.getTransceivers().find(function (transceiver) {
            return transceiver.receiver.track.kind === 'video';
          });
          if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
            if (videoTransceiver.direction === 'sendrecv') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('sendonly');
              } else {
                videoTransceiver.direction = 'sendonly';
              }
            } else if (videoTransceiver.direction === 'recvonly') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('inactive');
              } else {
                videoTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
            this.addTransceiver('video');
          }
        }
        return origCreateOffer.apply(this, arguments);
      };
    }

    function shimAudioContext(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || window.AudioContext) {
        return;
      }
      window.AudioContext = window.webkitAudioContext;
    }

  },{"../utils":11}],11:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    exports.extractVersion = extractVersion;
    exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
    exports.disableLog = disableLog;
    exports.disableWarnings = disableWarnings;
    exports.log = log;
    exports.deprecated = deprecated;
    exports.detectBrowser = detectBrowser;
    exports.compactObject = compactObject;
    exports.walkStats = walkStats;
    exports.filterStats = filterStats;

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    var logDisabled_ = true;
    var deprecationWarnings_ = true;

    /**
     * Extract browser version out of the provided user agent string.
     *
     * @param {!string} uastring userAgent string.
     * @param {!string} expr Regular expression used as match criteria.
     * @param {!number} pos position in the version string to be returned.
     * @return {!number} browser version.
     */
    function extractVersion(uastring, expr, pos) {
      var match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
    function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      var nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function (nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        var wrappedCallback = function wrappedCallback(e) {
          var modifiedEvent = wrapper(e);
          if (modifiedEvent) {
            if (cb.handleEvent) {
              cb.handleEvent(modifiedEvent);
            } else {
              cb(modifiedEvent);
            }
          }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) {
          this._eventMap[eventNameToWrap] = new Map();
        }
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
      };

      var nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function (nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        if (!this._eventMap[eventNameToWrap].has(cb)) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap].delete(cb);
        if (this._eventMap[eventNameToWrap].size === 0) {
          delete this._eventMap[eventNameToWrap];
        }
        if (Object.keys(this._eventMap).length === 0) {
          delete this._eventMap;
        }
        return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
      };

      Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get: function get() {
          return this['_on' + eventNameToWrap];
        },
        set: function set(cb) {
          if (this['_on' + eventNameToWrap]) {
            this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
            delete this['_on' + eventNameToWrap];
          }
          if (cb) {
            this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
          }
        },

        enumerable: true,
        configurable: true
      });
    }

    function disableLog(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
      }
      logDisabled_ = bool;
      return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
    }

    /**
     * Disable or enable deprecation warnings
     * @param {!boolean} bool set to true to disable warnings.
     */
    function disableWarnings(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
      }
      deprecationWarnings_ = !bool;
      return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
    }

    function log() {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log.apply(console, arguments);
        }
      }
    }

    /**
     * Shows a deprecation warning suggesting the modern and spec-compatible API.
     */
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
    }

    /**
     * Browser detector.
     *
     * @return {object} result containing browser and version
     *     properties.
     */
    function detectBrowser(window) {
      // Returned result object.
      var result = { browser: null, version: null };

      // Fail early if it's not a browser
      if (typeof window === 'undefined' || !window.navigator) {
        result.browser = 'Not a browser.';
        return result;
      }

      var navigator = window.navigator;


      if (navigator.mozGetUserMedia) {
        // Firefox.
        result.browser = 'firefox';
        result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
      } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
      } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari.
        result.browser = 'safari';
        result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window.RTCRtpTransceiver && 'currentDirection' in window.RTCRtpTransceiver.prototype;
      } else {
        // Default fallthrough: not supported.
        result.browser = 'Not a supported browser.';
        return result;
      }

      return result;
    }

    /**
     * Checks if something is an object.
     *
     * @param {*} val The something you want to check.
     * @return true if val is an object, false otherwise.
     */
    function isObject(val) {
      return Object.prototype.toString.call(val) === '[object Object]';
    }

    /**
     * Remove all empty objects and undefined values
     * from a nested object -- an enhanced and vanilla version
     * of Lodash's `compact`.
     */
    function compactObject(data) {
      if (!isObject(data)) {
        return data;
      }

      return Object.keys(data).reduce(function (accumulator, key) {
        var isObj = isObject(data[key]);
        var value = isObj ? compactObject(data[key]) : data[key];
        var isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
          return accumulator;
        }
        return Object.assign(accumulator, _defineProperty({}, key, value));
      }, {});
    }

    /* iterates the stats graph recursively. */
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(function (name) {
        if (name.endsWith('Id')) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith('Ids')) {
          base[name].forEach(function (id) {
            walkStats(stats, stats.get(id), resultSet);
          });
        }
      });
    }

    /* filter getStats for a sender/receiver track. */
    function filterStats(result, track, outbound) {
      var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
      var filteredResult = new Map();
      if (track === null) {
        return filteredResult;
      }
      var trackStats = [];
      result.forEach(function (value) {
        if (value.type === 'track' && value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(function (trackStat) {
        result.forEach(function (stats) {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }

  },{}],12:[function(require,module,exports){
    /* eslint-env node */
    'use strict';

// SDP helpers.

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
    SDPUtils.generateIdentifier = function () {
      return Math.random().toString(36).substr(2, 10);
    };

// The RTCP CNAME used by all peerconnections from the same JS.
    SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
    SDPUtils.splitLines = function (blob) {
      return blob.trim().split('\n').map(function (line) {
        return line.trim();
      });
    };
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
    SDPUtils.splitSections = function (blob) {
      var parts = blob.split('\nm=');
      return parts.map(function (part, index) {
        return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
      });
    };

// returns the session description.
    SDPUtils.getDescription = function (blob) {
      var sections = SDPUtils.splitSections(blob);
      return sections && sections[0];
    };

// returns the individual media sections.
    SDPUtils.getMediaSections = function (blob) {
      var sections = SDPUtils.splitSections(blob);
      sections.shift();
      return sections;
    };

// Returns lines that start with a certain prefix.
    SDPUtils.matchPrefix = function (blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function (line) {
        return line.indexOf(prefix) === 0;
      });
    };

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
    SDPUtils.parseCandidate = function (line) {
      var parts = void 0;
      // Parse both variants.
      if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
      } else {
        parts = line.substring(10).split(' ');
      }

      var candidate = {
        foundation: parts[0],
        component: { 1: 'rtp', 2: 'rtcp' }[parts[1]],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4], // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };

      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
          case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
          case 'ufrag':
            candidate.ufrag = parts[i + 1]; // for backward compatibility.
            candidate.usernameFragment = parts[i + 1];
            break;
          default:
            // extension handling, in particular ufrag. Don't overwrite.
            if (candidate[parts[i]] === undefined) {
              candidate[parts[i]] = parts[i + 1];
            }
            break;
        }
      }
      return candidate;
    };

// Translates a candidate object into SDP candidate attribute.
    SDPUtils.writeCandidate = function (candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);

      var component = candidate.component;
      if (component === 'rtp') {
        sdp.push(1);
      } else if (component === 'rtcp') {
        sdp.push(2);
      } else {
        sdp.push(component);
      }
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.address || candidate.ip);
      sdp.push(candidate.port);

      var type = candidate.type;
      sdp.push('typ');
      sdp.push(type);
      if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
      }
      return 'candidate:' + sdp.join(' ');
    };

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
    SDPUtils.parseIceOptions = function (line) {
      return line.substr(14).split(' ');
    };

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
    SDPUtils.parseRtpMap = function (line) {
      var parts = line.substr(9).split(' ');
      var parsed = {
        payloadType: parseInt(parts.shift(), 10) // was: id
      };

      parts = parts[0].split('/');

      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      // legacy alias, got renamed back to channels in ORTC.
      parsed.numChannels = parsed.channels;
      return parsed;
    };

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
    SDPUtils.writeRtpMap = function (codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      var channels = codec.channels || codec.numChannels || 1;
      return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
    };

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
    SDPUtils.parseExtmap = function (line) {
      var parts = line.substr(9).split(' ');
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1]
      };
    };

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
    SDPUtils.writeExtmap = function (headerExtension) {
      return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + '\r\n';
    };

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
    SDPUtils.parseFmtp = function (line) {
      var parsed = {};
      var kv = void 0;
      var parts = line.substr(line.indexOf(' ') + 1).split(';');
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeFmtp = function (codec) {
      var line = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function (param) {
          if (codec.parameters[param]) {
            params.push(param + '=' + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
      }
      return line;
    };

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
    SDPUtils.parseRtcpFb = function (line) {
      var parts = line.substr(line.indexOf(' ') + 1).split(' ');
      return {
        type: parts.shift(),
        parameter: parts.join(' ')
      };
    };
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtcpFb = function (codec) {
      var lines = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach(function (fb) {
          lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
        });
      }
      return lines;
    };

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
    SDPUtils.parseSsrcMedia = function (line) {
      var sp = line.indexOf(' ');
      var parts = {
        ssrc: parseInt(line.substr(7, sp - 7), 10)
      };
      var colon = line.indexOf(':', sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };

    SDPUtils.parseSsrcGroup = function (line) {
      var parts = line.substr(13).split(' ');
      return {
        semantics: parts.shift(),
        ssrcs: parts.map(function (ssrc) {
          return parseInt(ssrc, 10);
        })
      };
    };

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
    SDPUtils.getMid = function (mediaSection) {
      var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
      if (mid) {
        return mid.substr(6);
      }
    };

    SDPUtils.parseFingerprint = function (line) {
      var parts = line.substr(14).split(' ');
      return {
        algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
        value: parts[1]
      };
    };

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
    SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:');
      // Note: a=setup line is ignored since we use the 'auto' role.
      // Note2: 'algorithm' is not case sensitive except in Edge.
      return {
        role: 'auto',
        fingerprints: lines.map(SDPUtils.parseFingerprint)
      };
    };

// Serializes DTLS parameters to SDP.
    SDPUtils.writeDtlsParameters = function (params, setupType) {
      var sdp = 'a=setup:' + setupType + '\r\n';
      params.fingerprints.forEach(function (fp) {
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
      });
      return sdp;
    };

// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
    SDPUtils.parseCryptoLine = function (line) {
      var parts = line.substr(9).split(' ');
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
      };
    };

    SDPUtils.writeCryptoLine = function (parameters) {
      return 'a=crypto:' + parameters.tag + ' ' + parameters.cryptoSuite + ' ' + (_typeof(parameters.keyParams) === 'object' ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') + '\r\n';
    };

// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
    SDPUtils.parseCryptoKeyParams = function (keyParams) {
      if (keyParams.indexOf('inline:') !== 0) {
        return null;
      }
      var parts = keyParams.substr(7).split('|');
      return {
        keyMethod: 'inline',
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(':')[1] : undefined
      };
    };

    SDPUtils.writeCryptoKeyParams = function (keyParams) {
      return keyParams.keyMethod + ':' + keyParams.keySalt + (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') + (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
    };

// Extracts all SDES parameters.
    SDPUtils.getCryptoParameters = function (mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
      return lines.map(SDPUtils.parseCryptoLine);
    };

// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
    SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
      var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
      var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substr(12),
        password: pwd.substr(10)
      };
    };

// Serializes ICE parameters to SDP.
    SDPUtils.writeIceParameters = function (params) {
      var sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
      if (params.iceLite) {
        sdp += 'a=ice-lite\r\n';
      }
      return sdp;
    };

// Parses the SDP media section and returns RTCRtpParameters.
    SDPUtils.parseRtpParameters = function (mediaSection) {
      var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      for (var i = 3; i < mline.length; i++) {
        // find all codecs from mline[3..]
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
          // Only the first a=fmtp:<pt> is considered.
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
          // parse FEC mechanisms from rtpmap lines.
          switch (codec.name.toUpperCase()) {
            case 'RED':
            case 'ULPFEC':
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
            default:
              // only RED and ULPFEC are recognized as FEC mechanisms.
              break;
          }
        }
      }
      SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
      });
      // FIXME: parse rtcp.
      return description;
    };

// Generates parts of the SDP media section describing the capabilities /
// parameters.
    SDPUtils.writeRtpDescription = function (kind, caps) {
      var sdp = '';

      // Build the mline.
      sdp += 'm=' + kind + ' ';
      sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
      sdp += ' UDP/TLS/RTP/SAVPF ';
      sdp += caps.codecs.map(function (codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(' ') + '\r\n';

      sdp += 'c=IN IP4 0.0.0.0\r\n';
      sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

      // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
      caps.codecs.forEach(function (codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      var maxptime = 0;
      caps.codecs.forEach(function (codec) {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp += 'a=maxptime:' + maxptime + '\r\n';
      }

      if (caps.headerExtensions) {
        caps.headerExtensions.forEach(function (extension) {
          sdp += SDPUtils.writeExtmap(extension);
        });
      }
      // FIXME: write fecMechanisms.
      return sdp;
    };

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
    SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
      var encodingParameters = [];
      var description = SDPUtils.parseRtpParameters(mediaSection);
      var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
      var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

      // filter a=ssrc:... cname:, ignore PlanB-msid
      var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function (parts) {
        return parts.attribute === 'cname';
      });
      var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      var secondarySsrc = void 0;

      var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
        var parts = line.substr(17).split(' ');
        return parts.map(function (part) {
          return parseInt(part, 10);
        });
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }

      description.codecs.forEach(function (codec) {
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
          var encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = { ssrc: secondarySsrc };
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }

      // we support both b=AS and b=TIAS but interpret AS as TIAS.
      var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
      if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) {
          bandwidth = parseInt(bandwidth[0].substr(7), 10);
        } else if (bandwidth[0].indexOf('b=AS:') === 0) {
          // use formula from JSEP to convert b=AS to TIAS value.
          bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
        } else {
          bandwidth = undefined;
        }
        encodingParameters.forEach(function (params) {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };

// parses http://draft.ortc.org/#rtcrtcpparameters*
    SDPUtils.parseRtcpParameters = function (mediaSection) {
      var rtcpParameters = {};

      // Gets the first SSRC. Note that with RTX there might be multiple
      // SSRCs.
      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function (obj) {
        return obj.attribute === 'cname';
      })[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }

      // Edge uses the compound attribute instead of reducedSize
      // compound is !reducedSize
      var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;

      // parses the rtcp-mux attrіbute.
      // Note that Edge does not support unmuxed RTCP.
      var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
      rtcpParameters.mux = mux.length > 0;

      return rtcpParameters;
    };

    SDPUtils.writeRtcpParameters = function (rtcpParameters) {
      var sdp = '';
      if (rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
      if (rtcpParameters.mux) {
        sdp += 'a=rtcp-mux\r\n';
      }
      if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) {
        sdp += 'a=ssrc:' + rtcpParameters.ssrc + ' cname:' + rtcpParameters.cname + '\r\n';
      }
      return sdp;
    };

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
    SDPUtils.parseMsid = function (mediaSection) {
      var parts = void 0;
      var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
      if (spec.length === 1) {
        parts = spec[0].substr(7).split(' ');
        return { stream: parts[0], track: parts[1] };
      }
      var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function (msidParts) {
        return msidParts.attribute === 'msid';
      });
      if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return { stream: parts[0], track: parts[1] };
      }
    };

// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
    SDPUtils.parseSctpDescription = function (mediaSection) {
      var mline = SDPUtils.parseMLine(mediaSection);
      var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
      var maxMessageSize = void 0;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substr(12), 10),
          protocol: mline.fmt,
          maxMessageSize: maxMessageSize
        };
      }
      var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
      if (sctpMapLines.length > 0) {
        var parts = sctpMapLines[0].substr(10).split(' ');
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize: maxMessageSize
        };
      }
    };

// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
    SDPUtils.writeSctpDescription = function (media, sctp) {
      var output = [];
      if (media.protocol !== 'DTLS/SCTP') {
        output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctp-port:' + sctp.port + '\r\n'];
      } else {
        output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'];
      }
      if (sctp.maxMessageSize !== undefined) {
        output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
      }
      return output.join('');
    };

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
    SDPUtils.generateSessionId = function () {
      return Math.random().toString().substr(2, 21);
    };

// Write boiler plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
    SDPUtils.writeSessionBoilerplate = function (sessId, sessVer, sessUser) {
      var sessionId = void 0;
      var version = sessVer !== undefined ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils.generateSessionId();
      }
      var user = sessUser || 'thisisadapterortc';
      // FIXME: sess-id should be an NTP timestamp.
      return 'v=0\r\n' + 'o=' + user + ' ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
    };

// Gets the direction from the mediaSection or the sessionpart.
    SDPUtils.getDirection = function (mediaSection, sessionpart) {
      // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case 'a=sendrecv':
          case 'a=sendonly':
          case 'a=recvonly':
          case 'a=inactive':
            return lines[i].substr(2);
          default:
          // FIXME: What should happen here?
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return 'sendrecv';
    };

    SDPUtils.getKind = function (mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      return mline[0].substr(2);
    };

    SDPUtils.isRejected = function (mediaSection) {
      return mediaSection.split(' ', 2)[1] === '0';
    };

    SDPUtils.parseMLine = function (mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var parts = lines[0].substr(2).split(' ');
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
      };
    };

    SDPUtils.parseOLine = function (mediaSection) {
      var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
      var parts = line.substr(2).split(' ');
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };

// a very naive interpretation of a valid SDP.
    SDPUtils.isValidSDP = function (blob) {
      if (typeof blob !== 'string' || blob.length === 0) {
        return false;
      }
      var lines = SDPUtils.splitLines(blob);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
          return false;
        }
        // TODO: check the modifier a bit more.
      }
      return true;
    };

// Expose public methods.
    if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object') {
      module.exports = SDPUtils;
    }
  },{}]},{},[1])(1)
});
Module['WebXR'] = Module['WebXR'] || {};

setTimeout(function () {
    if (GL && GL.createContext)
    {
        GL.createContextOld = GL.createContext;
        GL.createContext = function (canvas, webGLContextAttributes)
        {
            var contextAttributes = {
                xrCompatible: true
            };

            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute];
                }
            }
            
            return GL.createContextOld(canvas, contextAttributes);
        }
    }


    (function () {
      'use strict';
    
      function XRData() {
        this.leftViewRotation =  [0, 0, 0, 1];
        this.rightViewRotation = [0, 0, 0, 1];
        this.leftViewPosition =  [0, 0, 0];
        this.rightViewPosition = [0, 0, 0];
        this.gamepads = [];
        this.controllerA = new XRControllerData();
        this.controllerB = new XRControllerData();
        this.handLeft = new XRHandData();
        this.handRight = new XRHandData();
        this.viewerHitTestPose = new XRHitPoseData();
        this.frameNumber = 0;
        this.touchIDs = [];
        this.touches = [];
        this.eventsNamesToIDs = {};
        this.CreateTouch = function (pageElement, xPercentage, yPercentage) {
          var touchID = 0;
          while (this.touchIDs.includes(touchID))
          {
            touchID++;
          }
          var touch = new XRTouch(touchID, pageElement, xPercentage, yPercentage);
          this.touchIDs.push(touchID);
          this.touches.push(touch);
          return touch;
        }
        this.RemoveTouch = function (touch) {
          touch.ended = true;
          this.touchIDs = this.touchIDs.filter(function(item) {
            return item !== touch.identifier
          });
          this.touches = this.touches.filter(function(item) {
            return item !== touch
          });
        }
        this.SendTouchEvent = function(JSEventsObject, eventName, target, changedTouches) {
          var touchEvent = new XRTouchEvent(eventName, target, this.touches, this.touches, changedTouches);
          JSEventsObject.eventHandlers[this.eventsNamesToIDs[eventName]].eventListenerFunc(touchEvent);
        }
      }
      
      function XRControllerData() {
        this.frameIndex = 0;
        this.enabledIndex = 0;
        this.handIndex = 0;
        this.positionXIndex = 0;
        this.positionYIndex = 0;
        this.positionZIndex = 0;
        this.rotationXIndex = 0;
        this.rotationYIndex = 0;
        this.rotationZIndex = 0;
        this.rotationWIndex = 0;
        this.gripPositionXIndex = 0;
        this.gripPositionYIndex = 0;
        this.gripPositionZIndex = 0;
        this.gripRotationXIndex = 0;
        this.gripRotationYIndex = 0;
        this.gripRotationZIndex = 0;
        this.gripRotationWIndex = 0;
        this.triggerIndex = 0;
        this.squeezeIndex = 0;
        this.thumbstickIndex = 0;
        this.thumbstickXIndex = 0;
        this.thumbstickYIndex = 0;
        this.touchpadIndex = 0;
        this.touchpadXIndex = 0;
        this.touchpadYIndex = 0;
        this.buttonAIndex = 0;
        this.buttonBIndex = 0;
        this.updatedGripIndex = 0;
        this.gamepad = null;
        this.profiles = [];
        this.updatedProfiles = 0;

        this.setIndices = function(index) {
          this.frameIndex = index++;
          this.enabledIndex = index++;
          this.handIndex = index++;
          this.positionXIndex = index++;
          this.positionYIndex = index++;
          this.positionZIndex = index++;
          this.rotationXIndex = index++;
          this.rotationYIndex = index++;
          this.rotationZIndex = index++;
          this.rotationWIndex = index++;
          this.triggerIndex = index++;
          this.squeezeIndex = index++;
          this.thumbstickIndex = index++;
          this.thumbstickXIndex = index++;
          this.thumbstickYIndex = index++;
          this.touchpadIndex = index++;
          this.touchpadXIndex = index++;
          this.touchpadYIndex = index++;
          this.buttonAIndex = index++;
          this.buttonBIndex = index++;
          this.updatedGripIndex = index++;
          this.gripPositionXIndex = index++;
          this.gripPositionYIndex = index++;
          this.gripPositionZIndex = index++;
          this.gripRotationXIndex = index++;
          this.gripRotationYIndex = index++;
          this.gripRotationZIndex = index++;
          this.gripRotationWIndex = index;
        }
      }
    
      function XRHandData() {
        this.frameIndex = 0;
        this.enabledIndex = 0;
        this.handIndex = 0;
        this.triggerIndex = 0;
        this.squeezeIndex = 0;
        this.jointsStartIndex = 0;
        this.poses = new Float32Array(16 * 25);
        this.radii = new Float32Array(25);
        this.jointQuaternion = new Float32Array(4);
        this.jointIndex = 0;
        this.bufferJointIndex = 0;
        this.handValuesType = 0;
        this.hasRadii = false;

        this.setIndices = function(index) {
          this.frameIndex = index++;
          this.enabledIndex = index++;
          this.handIndex = index++;
          this.triggerIndex = index++;
          this.squeezeIndex = index++;
          this.jointsStartIndex = index;
        }
      }
    
      function XRHitPoseData() {
        this.frameIndex = 0;
        this.availableIndex = 0;
        this.positionIndices = [0, 0, 0];
        this.rotationIndices = [0, 0, 0, 0];

        this.setIndices = function(index) {
          this.frameIndex = index++;
          this.availableIndex = index++;
          this.positionIndices[0] = index++;
          this.positionIndices[1] = index++;
          this.positionIndices[2] = index++;
          this.rotationIndices[0] = index++;
          this.rotationIndices[1] = index++;
          this.rotationIndices[2] = index++;
          this.rotationIndices[3] = index;
        }
      }
    
      function lerp(start, end, percentage)
      {
        return start + (end - start) * percentage;
      }
    
      function XRTouch(touchID, pageElement, xPercentage, yPercentage) {
        this.identifier = touchID;
        this.ended = false;
        var rect = pageElement.getBoundingClientRect();
        // It was pageElement.size / window.devicePixelRatio, but now we treat devicePixelRatio in XR session as 1
        this.clientX = lerp(rect.left, rect.left + pageElement.width / 1, xPercentage);
        this.clientY = lerp(rect.top, rect.top + pageElement.height / 1, yPercentage);
        this.layerX = this.clientX;
        this.layerY = this.clientY;
        this.offsetX = this.clientX;
        this.offsetY = this.clientY;
        this.pageX = this.clientX;
        this.pageY = this.clientY;
        this.x = this.clientX;
        this.y = this.clientY;
        this.screenX = this.clientX;
        this.screenY = this.clientY;
        this.movementX = 0; // diff between movements
        this.movementY = 0; // diff between movements
        this.UpdateTouch = function (pageElement, xPercentage, yPercentage) {
          var rect = pageElement.getBoundingClientRect();
          var newClientX = lerp(rect.left, rect.left + pageElement.width / 1, xPercentage);
          var newClientY = lerp(rect.top, rect.top + pageElement.height / 1, yPercentage);
          this.movementX = newClientX-this.clientX;
          this.movementY = newClientY-this.clientY;
          this.clientX = newClientX;
          this.clientY = newClientY;
          this.layerX = this.clientX;
          this.layerY = this.clientY;
          this.offsetX = this.clientX;
          this.offsetY = this.clientY;
          this.pageX = this.clientX;
          this.pageY = this.clientY;
          this.x = this.clientX;
          this.y = this.clientY;
          this.screenX = this.clientX;
          this.screenY = this.clientY;
        }
        this.HasMovement = function () {
          return (this.movementX != 0 || this.movementY != 0);
        }
        this.ResetMovement = function () {
          this.movementX = 0;
          this.movementY = 0;
        }
      }
      
      function XRTouchEvent(eventName, target, touches, targetTouchs, changedTouches) {
        this.type = eventName;
        this.target = target;
        this.touches = touches;
        this.targetTouches = targetTouchs;
        this.changedTouches = changedTouches;
        this.ctrlKey = false;
        this.altKey = false;
        this.metaKey = false;
        this.shiftKey = false;
        this.preventDefault = function () {};
      }
    
      function XRManager() {
        this.xrSession = null;
        this.viewerSpace = null;
        this.viewerHitTestSource = null;
        this.xrData = new XRData();
        this.canvas = null;
        this.ctx = null;
        this.gameModule = null;
        this.polyfill = null;
        this.didNotifyUnity = false;
        this.isARSupported = false;
        this.isVRSupported = false;
        this.onInputEvent = null;
        this.onSessionVisibilityEvent = null;
        this.BrowserObject = null;
        this.JSEventsObject = null;
        this.init();
      }
    
      XRManager.prototype.init = function () {
        if (window.WebXRPolyfill) {
          if (window.WebXRPolyfillConfig) {
            // Configuration options can be found at https://github.com/immersive-web/webxr-polyfill#new-webxrpolyfillconfig
            // Added WebXR Polyfill Config option in the WebGLTemplates setting.
            // Can add there "window.WebXRPolyfillConfig = {...}" with the desired configuration.
            this.polyfill = new WebXRPolyfill(window.WebXRPolyfillConfig);
          } else {
            this.polyfill = new WebXRPolyfill();
          }
        }
        
        this.attachEventListeners();
        var thisXRMananger = this;
        navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
          thisXRMananger.isVRSupported = supported;
          if (Module.WebXR.unityLoaded)
          {
            document.dispatchEvent(new CustomEvent('onVRSupportedCheck', { detail:{supported:thisXRMananger.isVRSupported} }));
            thisXRMananger.UpdateXRCapabilities();
          }
        });
    
        navigator.xr.isSessionSupported('immersive-ar').then(function (supported) {
          thisXRMananger.isARSupported = supported;
          if (Module.WebXR.unityLoaded)
          {
            document.dispatchEvent(new CustomEvent('onARSupportedCheck', { detail:{supported:thisXRMananger.isARSupported} }));
            thisXRMananger.UpdateXRCapabilities();
          }
        });
      }
    
    
      XRManager.prototype.attachEventListeners = function () {
        var onToggleAr = this.toggleAr.bind(this);
        var onToggleVr = this.toggleVr.bind(this);
        var onUnityLoaded = this.unityLoaded.bind(this);
        var onToggleHitTest = this.toggleHitTest.bind(this);
        var onCallHapticPulse = this.hapticPulse.bind(this);

        Module.WebXR.onUnityLoaded = onUnityLoaded;
        Module.WebXR.toggleAR = onToggleAr;
        Module.WebXR.toggleVR = onToggleVr;
        Module.WebXR.toggleHitTest = onToggleHitTest;
        Module.WebXR.callHapticPulse = onCallHapticPulse;
      }
    
      XRManager.prototype.onRequestARSession = function () {
        if (!this.isARSupported) return;
        if (this.BrowserObject.pauseAsyncCallbacks) {
          this.BrowserObject.pauseAsyncCallbacks();
        }
        this.BrowserObject.mainLoop.pause();
        var thisXRMananger = this;
        var tempRender = function () {
          thisXRMananger.ctx.clearColor(0, 0, 0, 0);
          thisXRMananger.ctx.clear(thisXRMananger.ctx.COLOR_BUFFER_BIT | thisXRMananger.ctx.DEPTH_BUFFER_BIT);
        }
        window.requestAnimationFrame( tempRender );
        navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: thisXRMananger.gameModule.WebXR.Settings.ARRequiredReferenceSpace,
          optionalFeatures: thisXRMananger.gameModule.WebXR.Settings.AROptionalFeatures
        }).then(function (session) {
          session.isImmersive = true;
          session.isInSession = true;
          session.isAR = true;
          thisXRMananger.xrSession = session;
          thisXRMananger.onSessionStarted(session);
        }).catch(function (error) {
          if (thisXRMananger.BrowserObject.resumeAsyncCallbacks) {
            thisXRMananger.BrowserObject.resumeAsyncCallbacks();
          }
          thisXRMananger.BrowserObject.mainLoop.resume();
        });
      }
    
      XRManager.prototype.onRequestVRSession = function () {
        if (!this.isVRSupported) return;
        if (this.BrowserObject.pauseAsyncCallbacks) {
          this.BrowserObject.pauseAsyncCallbacks();
        }
        this.BrowserObject.mainLoop.pause();
        var thisXRMananger = this;
        var tempRender = function () {
          thisXRMananger.ctx.clearColor(0, 0, 0, 0);
          thisXRMananger.ctx.clear(thisXRMananger.ctx.COLOR_BUFFER_BIT | thisXRMananger.ctx.DEPTH_BUFFER_BIT);
        }
        window.requestAnimationFrame( tempRender );
        navigator.xr.requestSession('immersive-vr', {
          requiredFeatures: thisXRMananger.gameModule.WebXR.Settings.VRRequiredReferenceSpace,
          optionalFeatures: thisXRMananger.gameModule.WebXR.Settings.VROptionalFeatures
        }).then(function (session) {
          session.isImmersive = true;
          session.isInSession = true;
          session.isAR = false;
          thisXRMananger.xrSession = session;
          thisXRMananger.onSessionStarted(session);
        }).catch(function (error) {
          if (thisXRMananger.BrowserObject.resumeAsyncCallbacks) {
            thisXRMananger.BrowserObject.resumeAsyncCallbacks();
          }
          thisXRMananger.BrowserObject.mainLoop.resume();
        });
      }
    
      XRManager.prototype.exitXRSession = function () {
        if (!this.xrSession || !this.xrSession.isInSession) {
          console.warn('No XR display to exit XR mode');
          return;
        }
    
        this.xrSession.end();
      }
    
      XRManager.prototype.onEndSession = function (xrSessionEvent) {
        if (xrSessionEvent.session) {
          xrSessionEvent.session.isInSession = false;
          xrSessionEvent.session.removeEventListener('select', this.onInputEvent);
          xrSessionEvent.session.removeEventListener('selectstart', this.onInputEvent);
          xrSessionEvent.session.removeEventListener('selectend', this.onInputEvent);
          xrSessionEvent.session.removeEventListener('squeeze', this.onInputEvent);
          xrSessionEvent.session.removeEventListener('squeezestart', this.onInputEvent);
          xrSessionEvent.session.removeEventListener('squeezeend', this.onInputEvent);
          xrSessionEvent.session.removeEventListener('visibilitychange', this.onSessionVisibilityEvent);
        }
    
        if (this.viewerHitTestSource) {
          this.viewerHitTestSource.cancel();
          this.viewerHitTestSource = null;
        }
        
        this.removeRemainingTouches();

        Module.HEAPF32[this.xrData.controllerA.frameIndex] = -1; // XRControllerData.frame
        Module.HEAPF32[this.xrData.controllerB.frameIndex] = -1; // XRControllerData.frame
        Module.HEAPF32[this.xrData.controllerA.enabledIndex] = 0; // XRControllerData.enabled
        Module.HEAPF32[this.xrData.controllerB.enabledIndex] = 0; // XRControllerData.enabled

        Module.HEAPF32[this.xrData.handLeft.frameIndex] = -1; // XRHandData.frame
        Module.HEAPF32[this.xrData.handRight.frameIndex] = -1; // XRHandData.frame
        Module.HEAPF32[this.xrData.handLeft.enabledIndex] = 0; // XRHandData.enabled
        Module.HEAPF32[this.xrData.handRight.enabledIndex] = 0; // XRHandData.enabled

        this.gameModule.WebXR.OnEndXR();
        this.didNotifyUnity = false;
        var pixelRatio = Module.devicePixelRatio || window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.parentElement.clientWidth * pixelRatio;
        this.canvas.height = this.canvas.parentElement.clientHeight * pixelRatio;

        if (this.BrowserObject.pauseAsyncCallbacks) {
          this.BrowserObject.pauseAsyncCallbacks();
        }
        this.BrowserObject.mainLoop.pause();
        this.ctx.dontClearAlphaOnly = false;
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER);
        var thisXRMananger = this;
        window.setTimeout(function () {
          if (thisXRMananger.BrowserObject.resumeAsyncCallbacks) {
            thisXRMananger.BrowserObject.resumeAsyncCallbacks();
          }
          thisXRMananger.BrowserObject.mainLoop.resume();
        });
      }
      
      XRManager.prototype.removeRemainingTouches = function () {
        while (this.xrData.touches.length > 0)
        {
          var touch = this.xrData.touches[0];
          this.xrData.RemoveTouch(touch);
          this.xrData.SendTouchEvent(this.JSEventsObject, "touchend", this.canvas, [touch]);
        }
      }
      
      XRManager.prototype.onInputSourceEvent = function (xrInputSourceEvent) {
        if (xrInputSourceEvent.type && xrInputSourceEvent.inputSource
            && xrInputSourceEvent.inputSource.handedness != 'none') {
          var hand = 0;
          var inputSource = xrInputSourceEvent.inputSource;
          var xrData = this.xrData;
          var controller = this.xrData.controllerA;
          if (inputSource.handedness == 'left') {
              hand = 1;
              controller = this.xrData.controllerB;
          } else if (inputSource.handedness == 'right') {
              hand = 2;
          }
          
          Module.HEAPF32[controller.enabledIndex] = 1; // XRControllerData.enabled
          Module.HEAPF32[controller.handIndex] = hand; // XRControllerData.hand
          
          switch (xrInputSourceEvent.type) {
            case "select":
              Module.HEAPF32[controller.triggerIndex] = 1; // XRControllerData.trigger
              break;
            case "selectstart":
              Module.HEAPF32[controller.triggerIndex] = 1; // XRControllerData.trigger
              break;
            case "selectend":
              Module.HEAPF32[controller.triggerIndex] = 0; // XRControllerData.trigger
              break;
            case "squeeze":
              Module.HEAPF32[controller.squeezeIndex] = 1; // XRControllerData.squeeze
              break;
            case "squeezestart":
              Module.HEAPF32[controller.squeezeIndex] = 1; // XRControllerData.squeeze
              break;
            case "squeezeend":
              Module.HEAPF32[controller.squeezeIndex] = 0; // XRControllerData.squeeze
              break;
          }
          
          if (hand == 0 || hand == 2) {
            Module.HEAPF32[xrData.handRight.triggerIndex] = Module.HEAPF32[controller.triggerIndex]; // XRHandData.trigger
            Module.HEAPF32[xrData.handRight.squeezeIndex] = Module.HEAPF32[controller.squeezeIndex]; // XRHandData.squeeze
          } else {
            Module.HEAPF32[xrData.handLeft.triggerIndex] = Module.HEAPF32[controller.triggerIndex]; // XRHandData.trigger
            Module.HEAPF32[xrData.handLeft.squeezeIndex] = Module.HEAPF32[controller.squeezeIndex]; // XRHandData.squeeze
          }
        } else {
          var xPercentage = 0.5;
          var yPercentage = 0.5;
          var inputSource = xrInputSourceEvent.inputSource;
          if (inputSource) {
            if (inputSource.gamepad &&
                inputSource.gamepad.axes) {
              xPercentage = (inputSource.gamepad.axes[0] + 1.0) * 0.5;
              yPercentage = (inputSource.gamepad.axes[1] + 1.0) * 0.5;
            }
            switch (xrInputSourceEvent.type) {
              case "select": // 9 touchmove
                // no need to call touchmove here
                break;
              case "selectstart": // 7 touchstart
                inputSource.xrTouchObject = this.xrData.CreateTouch(this.canvas, xPercentage, yPercentage);
                this.xrData.SendTouchEvent(this.JSEventsObject, "touchstart", this.canvas, [inputSource.xrTouchObject])
                break;
              case "selectend": // 8 touchend
                this.xrData.RemoveTouch(inputSource.xrTouchObject);
                this.xrData.SendTouchEvent(this.JSEventsObject, "touchend", this.canvas, [inputSource.xrTouchObject]);
                inputSource.xrTouchObject = null;
                break;
            }
          }
        }
      }

      XRManager.prototype.onVisibilityChange = function (event) {
        this.gameModule.WebXR.OnVisibilityChange(this.xrSession.visibilityState);
      }

      XRManager.prototype.toggleAr = function () {
        if (!this.gameModule)
        {
          return;
        }
        if (this.xrSession && this.xrSession.isInSession) {
          this.exitXRSession();
        } else {
          this.onRequestARSession();
        }
      }
    
      XRManager.prototype.toggleVr = function () {
        if (!this.gameModule)
        {
          return;
        }
        if (this.xrSession && this.xrSession.isInSession) {
          this.exitXRSession();
        } else {
          this.onRequestVRSession();
        }
      }
    
      XRManager.prototype.toggleHitTest = function () {
        if (!this.gameModule)
        {
          return;
        }
        if (this.xrSession && this.xrSession.isInSession && this.xrSession.isAR) {
          if (this.viewerHitTestSource) {
            this.viewerHitTestSource.cancel();
            this.viewerHitTestSource = null;
          } else {
            var thisXRMananger = this;
            this.xrSession.requestReferenceSpace('local').then(function (refSpace) {
              thisXRMananger.xrSession.localRefSpace = refSpace;
            });
            this.xrSession.requestReferenceSpace('viewer').then(function (refSpace) {
              thisXRMananger.viewerSpace = refSpace;
              thisXRMananger.xrSession.requestHitTestSource({space: thisXRMananger.viewerSpace}).then(function (hitTestSource) {
                thisXRMananger.viewerHitTestSource = hitTestSource;
              });
            });
          }
        }
      }
      
      XRManager.prototype.hapticPulse = function (hapticPulseAction) {
        var controller = null;
        switch(hapticPulseAction.detail.controller)
        {
          case 0:
          case 2:
            controller = this.xrData.controllerA;
            break;
          case 1:
            controller = this.xrData.controllerB;
            break;
        }
        if (controller && Module.HEAPF32[controller.enabledIndex] == 1 && controller.gamepad && controller.gamepad.hapticActuators && controller.gamepad.hapticActuators.length > 0)
        {
          controller.gamepad.hapticActuators[0].pulse(hapticPulseAction.detail.intensity, hapticPulseAction.detail.duration);
        }
      }
    
      XRManager.prototype.setGameModule = function (gameModule) {
        if (gameModule && !this.gameModule) {
          this.gameModule = gameModule;
          this.canvas = this.gameModule.canvas;
          this.ctx = this.gameModule.ctx;
    
          var thisXRMananger = this;
          this.JSEventsObject = this.gameModule.WebXR.GetJSEventsObject();
          for (var i = 0; i < this.JSEventsObject.eventHandlers.length; i++) {
            this.xrData.eventsNamesToIDs[this.JSEventsObject.eventHandlers[i].eventTypeString] = i;
          }
          this.BrowserObject = this.gameModule.WebXR.GetBrowserObject();
          this.BrowserObject.requestAnimationFrame = function (func) {
            if (thisXRMananger.xrSession && thisXRMananger.xrSession.isInSession) {
              return thisXRMananger.xrSession.requestAnimationFrame(function (time, xrFrame) {
                thisXRMananger.animate(xrFrame);
                func(time);
              });
            } else {
              window.requestAnimationFrame(func);
            }
          };
    
          // bindFramebuffer frameBufferObject null in XRSession should use XRWebGLLayer FBO instead
          thisXRMananger.ctx.oldBindFramebuffer = thisXRMananger.ctx.bindFramebuffer;
          thisXRMananger.ctx.bindFramebuffer = function (target, fbo) {
            if (!fbo) {
              if (thisXRMananger.xrSession && thisXRMananger.xrSession.isInSession) {
                if (thisXRMananger.xrSession.renderState.baseLayer) {
                  fbo = thisXRMananger.xrSession.renderState.baseLayer.framebuffer
                }
              }
            }
            return thisXRMananger.ctx.oldBindFramebuffer(target, fbo)
          };
        }
      }
    
      XRManager.prototype.unityLoaded = function (event) {
        Module.WebXR.unityLoaded = 'true';
    
        this.setGameModule(event.detail.module);
    
        document.dispatchEvent(new CustomEvent('onARSupportedCheck', { detail:{supported:this.isARSupported} }));
        document.dispatchEvent(new CustomEvent('onVRSupportedCheck', { detail:{supported:this.isVRSupported} }));
    
        this.UpdateXRCapabilities();
        
        this.onInputEvent = this.onInputSourceEvent.bind(this);
        this.onSessionVisibilityEvent = this.onVisibilityChange.bind(this);
      }
    
      XRManager.prototype.UpdateXRCapabilities = function() {
        // Send browser capabilities to Unity.
        this.gameModule.WebXR.OnXRCapabilities(this.isARSupported, this.isVRSupported);
      }
      
      // http://answers.unity.com/answers/11372/view.html
      XRManager.prototype.quaternionFromMatrix = function(offset, matrix, quaternion) {
        quaternion[3] = Math.sqrt( Math.max( 0, 1 + matrix[offset+0] + matrix[offset+5] + matrix[offset+10] ) ) / 2; 
        quaternion[0] = Math.sqrt( Math.max( 0, 1 + matrix[offset+0] - matrix[offset+5] - matrix[offset+10] ) ) / 2; 
        quaternion[1] = Math.sqrt( Math.max( 0, 1 - matrix[offset+0] + matrix[offset+5] - matrix[offset+10] ) ) / 2; 
        quaternion[2] = Math.sqrt( Math.max( 0, 1 - matrix[offset+0] - matrix[offset+5] + matrix[offset+10] ) ) / 2; 
        quaternion[0] *= Math.sign( quaternion[0] * ( matrix[offset+6] - matrix[offset+9] ) );
        quaternion[1] *= Math.sign( quaternion[1] * ( matrix[offset+8] - matrix[offset+2] ) );
        quaternion[2] *= Math.sign( quaternion[2] * ( matrix[offset+1] - matrix[offset+4] ) );
      }
      
      XRManager.prototype.getXRControllersData = function(frame, inputSources, refSpace, xrData) {
        Module.HEAPF32[xrData.handLeft.frameIndex] = xrData.frameNumber; // XRHandData.frame
        Module.HEAPF32[xrData.handRight.frameIndex] = xrData.frameNumber; // XRHandData.frame
        Module.HEAPF32[xrData.handLeft.enabledIndex] = 0; // XRHandData.enabled
        Module.HEAPF32[xrData.handRight.enabledIndex] = 0; // XRHandData.enabled
        Module.HEAPF32[xrData.controllerA.frameIndex] = xrData.frameNumber; // XRControllerData.frame
        Module.HEAPF32[xrData.controllerB.frameIndex] = xrData.frameNumber; // XRControllerData.frame
        Module.HEAPF32[xrData.controllerA.enabledIndex] = 0; // XRControllerData.enabled
        Module.HEAPF32[xrData.controllerB.enabledIndex] = 0; // XRControllerData.enabled
        if (!inputSources || !inputSources.length || inputSources.length == 0) {
          this.removeRemainingTouches();
          return;
        }
        var touchesToSend = [];
        for (var i = 0; i < inputSources.length; i++) {
          var inputSource = inputSources[i];
          // Show the input source if it has a grip space
          if (inputSource.hand) {
            var xrHand = xrData.handLeft;
            Module.HEAPF32[xrHand.handIndex] = 1; // XRHandData.hand
            if (inputSource.handedness == 'right') {
              xrHand = xrData.handRight;
              Module.HEAPF32[xrHand.handIndex] = 2; // XRHandData.hand
            }
            Module.HEAPF32[xrHand.enabledIndex] = 1; // XRHandData.enabled

            if (xrHand.handValuesType == 0) {
              if (inputSource.hand.values) {
                xrHand.handValuesType = 1
              } else {
                xrHand.handValuesType = 2
              }
            }
            if (!frame.fillPoses(
                xrHand.handValuesType == 1 ? inputSource.hand.values() : inputSource.hand,
                refSpace,
                xrHand.poses)) {
              Module.HEAPF32[xrHand.enabledIndex] = 0; // XRHandData.enabled
              continue;
            }
            if (!xrHand.hasRadii)
            {
              xrHand.hasRadii = frame.fillJointRadii(
                xrHand.handValuesType == 1 ? inputSource.hand.values() : inputSource.hand,
                xrHand.radii);
            }
            xrHand.bufferJointIndex = xrHand.jointsStartIndex;
            for (var j = 0; j < 25; j++) {
              xrHand.jointIndex = j*16;
              if (!isNaN(xrHand.poses[xrHand.jointIndex])) {
                Module.HEAPF32[xrHand.bufferJointIndex++] = xrHand.poses[xrHand.jointIndex+12]; // XRJointData.position.x
                Module.HEAPF32[xrHand.bufferJointIndex++] = xrHand.poses[xrHand.jointIndex+13]; // XRJointData.position.y
                Module.HEAPF32[xrHand.bufferJointIndex++] = -xrHand.poses[xrHand.jointIndex+14]; // XRJointData.position.z
                this.quaternionFromMatrix(xrHand.jointIndex, xrHand.poses, xrHand.jointQuaternion);
                Module.HEAPF32[xrHand.bufferJointIndex++] = -xrHand.jointQuaternion[0]; // XRJointData.rotation.x
                Module.HEAPF32[xrHand.bufferJointIndex++] = -xrHand.jointQuaternion[1]; // XRJointData.rotation.y
                Module.HEAPF32[xrHand.bufferJointIndex++] = xrHand.jointQuaternion[2]; // XRJointData.rotation.z
                Module.HEAPF32[xrHand.bufferJointIndex++] = xrHand.jointQuaternion[3]; // XRJointData.rotation.w
                if (!isNaN(xrHand.radii[j])) {
                  Module.HEAPF32[xrHand.bufferJointIndex] = xrHand.radii[j]; // XRJointData.radius
                }
                xrHand.bufferJointIndex++;
              }
            }
          } else if (inputSource.gripSpace) {
            var inputRayPose = frame.getPose(inputSource.targetRaySpace, refSpace);
            if (inputRayPose) {
              var position = inputRayPose.transform.position;
              var orientation = inputRayPose.transform.orientation;
              var hand = 0;
              var controller = xrData.controllerA;
              if (inputSource.handedness == 'left') {
                hand = 1;
                controller = xrData.controllerB;
              } else if (inputSource.handedness == 'right') {
                hand = 2;
              }
              
              Module.HEAPF32[controller.enabledIndex] = 1; // XRControllerData.enabled
              Module.HEAPF32[controller.handIndex] = hand; // XRControllerData.hand

              if (controller.updatedProfiles == 0) {
                controller.profiles = inputSource.profiles;
                controller.updatedProfiles = 1;
              }
              
              Module.HEAPF32[controller.positionXIndex] = position.x; // XRControllerData.positionX
              Module.HEAPF32[controller.positionYIndex] = position.y; // XRControllerData.positionY
              Module.HEAPF32[controller.positionZIndex] = -position.z; // XRControllerData.positionZ
              
              Module.HEAPF32[controller.rotationXIndex] = -orientation.x; // XRControllerData.rotationX
              Module.HEAPF32[controller.rotationYIndex] = -orientation.y; // XRControllerData.rotationY
              Module.HEAPF32[controller.rotationZIndex] = orientation.z; // XRControllerData.rotationZ
              Module.HEAPF32[controller.rotationWIndex] = orientation.w; // XRControllerData.rotationW

              if (Module.HEAPF32[controller.updatedGripIndex] == 0 && inputSource.gripSpace) { // XRControllerData.updatedGrip
                var inputPose = frame.getPose(inputSource.gripSpace, refSpace);
                if (inputPose) {
                  var gripPosition = inputPose.transform.position;
                  var gripOrientation = inputPose.transform.orientation;

                  Module.HEAPF32[controller.gripPositionXIndex] = gripPosition.x; // XRControllerData.gripPositionX
                  Module.HEAPF32[controller.gripPositionYIndex] = gripPosition.y; // XRControllerData.gripPositionY
                  Module.HEAPF32[controller.gripPositionZIndex] = -gripPosition.z; // XRControllerData.gripPositionZ

                  Module.HEAPF32[controller.gripRotationXIndex] = -gripOrientation.x; // XRControllerData.gripRotationX
                  Module.HEAPF32[controller.gripRotationYIndex] = -gripOrientation.y; // XRControllerData.gripRotationY
                  Module.HEAPF32[controller.gripRotationZIndex] = gripOrientation.z; // XRControllerData.gripRotationZ
                  Module.HEAPF32[controller.gripRotationWIndex] = gripOrientation.w; // XRControllerData.gripRotationW

                  Module.HEAPF32[controller.updatedGripIndex] = 1; // XRControllerData.updatedGrip
                }
              }
              
              // if there's gamepad, use the xr-standard mapping
              if (inputSource.gamepad) {
                for (var j = 0; j < inputSource.gamepad.buttons.length; j++) {
                  switch (j) {
                    case 0:
                      Module.HEAPF32[controller.triggerIndex] = inputSource.gamepad.buttons[j].value; // XRControllerData.trigger
                      break;
                    case 1:
                      Module.HEAPF32[controller.squeezeIndex] = inputSource.gamepad.buttons[j].value; // XRControllerData.squeeze
                      break;
                    case 2:
                      Module.HEAPF32[controller.touchpadIndex] = inputSource.gamepad.buttons[j].value; // XRControllerData.touchpad
                      break;
                    case 3:
                      Module.HEAPF32[controller.thumbstickIndex] = inputSource.gamepad.buttons[j].value; // XRControllerData.thumbstick
                      break;
                    case 4:
                      Module.HEAPF32[controller.buttonAIndex] = inputSource.gamepad.buttons[j].value; // XRControllerData.buttonA
                      break;
                    case 5:
                      Module.HEAPF32[controller.buttonBIndex] = inputSource.gamepad.buttons[j].value; // XRControllerData.buttonB
                      break;
                  }
                }
                
                if (Module.HEAPF32[controller.triggerIndex] <= 0.02) {
                  Module.HEAPF32[controller.triggerIndex] = 0;
                } else if (Module.HEAPF32[controller.triggerIndex] >= 0.98) {
                  Module.HEAPF32[controller.triggerIndex] = 1;
                }
                
                if (Module.HEAPF32[controller.squeezeIndex] <= 0.02) {
                  Module.HEAPF32[controller.squeezeIndex] = 0;
                } else if (Module.HEAPF32[controller.squeezeIndex] >= 0.98) {
                  Module.HEAPF32[controller.squeezeIndex] = 1;
                }
                
                for (var j = 0; j < inputSource.gamepad.axes.length; j++) {
                  switch (j) {
                    case 0:
                      Module.HEAPF32[controller.touchpadXIndex] = inputSource.gamepad.axes[j]; // XRControllerData.touchpadX
                      break;
                    case 1:
                      Module.HEAPF32[controller.touchpadYIndex] = -inputSource.gamepad.axes[j]; // XRControllerData.touchpadY
                      break;
                    case 2:
                      Module.HEAPF32[controller.thumbstickXIndex] = inputSource.gamepad.axes[j]; // XRControllerData.thumbstickX
                      break;
                    case 3:
                      Module.HEAPF32[controller.thumbstickYIndex] = -inputSource.gamepad.axes[j]; // XRControllerData.thumbstickY
                      break;
                  }
                }
              }
              controller.gamepad = inputSource.gamepad;
            }
          } else if (inputSource.xrTouchObject && !inputSource.xrTouchObject.ended && inputSource.gamepad && inputSource.gamepad.axes) {
            inputSource.xrTouchObject.UpdateTouch( this.canvas,
                                                   (inputSource.gamepad.axes[0] + 1.0) * 0.5,
                                                   (inputSource.gamepad.axes[1] + 1.0) * 0.5);
            if (inputSource.xrTouchObject.HasMovement()) {
              touchesToSend.push(inputSource.xrTouchObject);
            }
          }
        }
        if (touchesToSend.length > 0) {
          this.xrData.SendTouchEvent(this.JSEventsObject, "touchmove", this.canvas, touchesToSend);
          for (var i = 0; i < touchesToSend.length; i++) {
            touchesToSend[i].ResetMovement();
          }
        }
      }
    
      XRManager.prototype.onSessionStarted = function (session) {
        var glLayer = new XRWebGLLayer(session, this.ctx);
        session.updateRenderState({ baseLayer: glLayer });
        
        var refSpaceType = 'viewer';
        if (session.isImmersive) {
          refSpaceType = this.gameModule.WebXR.Settings.VRRequiredReferenceSpace[0];
          if (session.isAR) {
            refSpaceType = this.gameModule.WebXR.Settings.ARRequiredReferenceSpace[0];
            this.ctx.dontClearAlphaOnly = true;
          }
    
          var onSessionEnded = this.onEndSession.bind(this);
          session.addEventListener('end', onSessionEnded);
    
          this.canvas.width = glLayer.framebufferWidth;
          this.canvas.height = glLayer.framebufferHeight;
          
          session.addEventListener('select', this.onInputEvent);
          session.addEventListener('selectstart', this.onInputEvent);
          session.addEventListener('selectend', this.onInputEvent);
          session.addEventListener('squeeze', this.onInputEvent);
          session.addEventListener('squeezestart', this.onInputEvent);
          session.addEventListener('squeezeend', this.onInputEvent);
          session.addEventListener('visibilitychange', this.onSessionVisibilityEvent);
    
          this.xrData.controllerA.setIndices(Module.ControllersArrayOffset);
          this.xrData.controllerB.setIndices(Module.ControllersArrayOffset + 28);
          this.xrData.handLeft.setIndices(Module.HandsArrayOffset);
          this.xrData.handRight.setIndices(Module.HandsArrayOffset + 205);
          this.xrData.viewerHitTestPose.setIndices(Module.ViewerHitTestPoseArrayOffset);
          this.xrData.controllerA.updatedProfiles = 0;
          this.xrData.controllerB.updatedProfiles = 0;
          this.xrData.controllerA.profiles = [];
          this.xrData.controllerB.profiles = [];
          Module.HEAPF32[this.xrData.controllerA.updatedGripIndex] = 0; // XRControllerData.updatedGrip
          Module.HEAPF32[this.xrData.controllerB.updatedGripIndex] = 0; // XRControllerData.updatedGrip
          Module.HEAPF32[this.xrData.viewerHitTestPose.frameIndex] = -1; // XRHitPoseData.frame
          Module.HEAPF32[this.xrData.viewerHitTestPose.availableIndex] = 0; // XRHitPoseData.available
        }
        var thisXRMananger = this;
        session.requestReferenceSpace(refSpaceType).then(function (refSpace) {
          session.refSpace = refSpace;
          var tempRaf = function (time, xrFrame) {
            if (thisXRMananger.animate(xrFrame))
            {
              if (thisXRMananger.BrowserObject.resumeAsyncCallbacks) {
                thisXRMananger.BrowserObject.resumeAsyncCallbacks();
              }
              thisXRMananger.BrowserObject.mainLoop.resume();
            } else {
              // No XR session yet
              session.requestAnimationFrame(tempRaf);
            }
          }
          session.requestAnimationFrame(tempRaf);
        });
      }
    
      XRManager.prototype.animate = function (frame) {
        var session = frame.session;
        if (!session) {
          return this.didNotifyUnity;
        }
        
        var glLayer = session.renderState.baseLayer;
        
        if (this.canvas.width != glLayer.framebufferWidth ||
            this.canvas.height != glLayer.framebufferHeight)
        {
          this.canvas.width = glLayer.framebufferWidth;
          this.canvas.height = glLayer.framebufferHeight;
        }
        
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, glLayer.framebuffer);
        if (session.isAR) {
          // Workaround for Chromium depth bug https://bugs.chromium.org/p/chromium/issues/detail?id=1167450#c21
          this.ctx.depthMask(false);
          this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT);
          this.ctx.depthMask(true);
        } else {
          this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
        }
        
        var pose = frame.getViewerPose(session.refSpace);
        if (!pose) {
          return this.didNotifyUnity;
        }
    
        if (!session.isImmersive)
        {
          return this.didNotifyUnity;
        }
    
        var xrData = this.xrData;
        xrData.frameNumber++;
    
        for (var i = 0; i < pose.views.length; i++) {
          var view = pose.views[i];
          var transformMatrix = view.transform.matrix;
          if (view.eye === "left" || view.eye === "none") {
            Module.HEAPF32.set(view.projectionMatrix, Module.XRSharedArrayOffset); // leftProjectionMatrix
            this.quaternionFromMatrix(0, transformMatrix, xrData.leftViewRotation);
            xrData.leftViewRotation[0] = -xrData.leftViewRotation[0];
            xrData.leftViewRotation[1] = -xrData.leftViewRotation[1];
            xrData.leftViewPosition[0] = transformMatrix[12];
            xrData.leftViewPosition[1] = transformMatrix[13];
            xrData.leftViewPosition[2] = -transformMatrix[14];
            Module.HEAPF32.set(xrData.leftViewRotation, Module.XRSharedArrayOffset + 32); // leftViewRotation
            Module.HEAPF32.set(xrData.leftViewPosition, Module.XRSharedArrayOffset + 40); // leftViewPosition
          } else if (view.eye === 'right') {
            Module.HEAPF32.set(view.projectionMatrix, Module.XRSharedArrayOffset + 16); // rightProjectionMatrix
            this.quaternionFromMatrix(0, transformMatrix, xrData.rightViewRotation);
            xrData.rightViewRotation[0] = -xrData.rightViewRotation[0];
            xrData.rightViewRotation[1] = -xrData.rightViewRotation[1];
            xrData.rightViewPosition[0] = transformMatrix[12];
            xrData.rightViewPosition[1] = transformMatrix[13];
            xrData.rightViewPosition[2] = -transformMatrix[14];
            Module.HEAPF32.set(xrData.rightViewRotation, Module.XRSharedArrayOffset + 36); // rightViewRotation
            Module.HEAPF32.set(xrData.rightViewPosition, Module.XRSharedArrayOffset + 43); // rightViewPosition
          }
        }
    
        this.getXRControllersData(frame, session.inputSources, session.refSpace, xrData);
    
        if (session.isAR && this.viewerHitTestSource) {
          Module.HEAPF32[xrData.viewerHitTestPose.frameIndex] = xrData.frameNumber; // XRHitPoseData.frame
          var viewerHitTestResults = frame.getHitTestResults(this.viewerHitTestSource);
          if (viewerHitTestResults.length > 0) {
            var hitTestPose = viewerHitTestResults[0].getPose(session.localRefSpace);
            Module.HEAPF32[xrData.viewerHitTestPose.availableIndex] = 1; // XRHitPoseData.available
            Module.HEAPF32[xrData.viewerHitTestPose.positionIndices[0]] = hitTestPose.transform.position.x; // XRHitPoseData.position[0]
            var hitTestPoseBase = viewerHitTestResults[0].getPose(session.refSpace); // Ugly hack for y position on Samsung Internet
            Module.HEAPF32[xrData.viewerHitTestPose.positionIndices[1]] = hitTestPose.transform.position.y + Math.abs(hitTestPose.transform.position.y - hitTestPoseBase.transform.position.y); // XRHitPoseData.position[1]
            Module.HEAPF32[xrData.viewerHitTestPose.positionIndices[2]] = -hitTestPose.transform.position.z; // XRHitPoseData.position[2]
            Module.HEAPF32[xrData.viewerHitTestPose.rotationIndices[0]] = -hitTestPose.transform.orientation.x; // XRHitPoseData.rotation[0]
            Module.HEAPF32[xrData.viewerHitTestPose.rotationIndices[1]] = -hitTestPose.transform.orientation.y; // XRHitPoseData.rotation[1]
            Module.HEAPF32[xrData.viewerHitTestPose.rotationIndices[2]] = hitTestPose.transform.orientation.z; // XRHitPoseData.rotation[2]
            Module.HEAPF32[xrData.viewerHitTestPose.rotationIndices[3]] = hitTestPose.transform.orientation.w; // XRHitPoseData.rotation[3]
          } else {
            Module.HEAPF32[xrData.viewerHitTestPose.availableIndex] = 0; // XRHitPoseData.available
          }
        }
    
        if (xrData.controllerA.updatedProfiles == 1 || xrData.controllerB.updatedProfiles == 1)
        {
          var inputProfiles = {};
          inputProfiles.conrtoller1 = xrData.controllerA.profiles;
          inputProfiles.conrtoller2 = xrData.controllerB.profiles;
          if (xrData.controllerA.updatedProfiles == 1)
          {
            xrData.controllerA.updatedProfiles = 2;
          }
          if (xrData.controllerB.updatedProfiles == 1)
          {
            xrData.controllerB.updatedProfiles = 2;
          }
          this.gameModule.WebXR.OnInputProfiles(JSON.stringify(inputProfiles));
        }
        
        if (!this.didNotifyUnity)
        {
          var eyeCount = 1;
          var leftRect = {
            x:0,
            y:0,
            w:1,
            h:1
          }
          var rightRect = {
            x:0.5,
            y:0,
            w:0.5,
            h:1
          }
          for (var i = 0; i < pose.views.length; i++) {
            var view = pose.views[i];
            var viewport = session.renderState.baseLayer.getViewport(view);
            if (view.eye === 'left') {
              if (viewport) {
                leftRect.x = (viewport.x / glLayer.framebufferWidth) * (glLayer.framebufferWidth / this.canvas.width);
                leftRect.y = (viewport.y / glLayer.framebufferHeight) * (glLayer.framebufferHeight / this.canvas.height);
                leftRect.w = (viewport.width / glLayer.framebufferWidth) * (glLayer.framebufferWidth / this.canvas.width);
                leftRect.h = (viewport.height / glLayer.framebufferHeight) * (glLayer.framebufferHeight / this.canvas.height);
              }
            } else if (view.eye === 'right' && viewport.width != 0 && viewport.height != 0) {
              eyeCount = 2;
              if (viewport) {
                rightRect.x = (viewport.x / glLayer.framebufferWidth) * (glLayer.framebufferWidth / this.canvas.width);
                rightRect.y = (viewport.y / glLayer.framebufferHeight) * (glLayer.framebufferHeight / this.canvas.height);
                rightRect.w = (viewport.width / glLayer.framebufferWidth) * (glLayer.framebufferWidth / this.canvas.width);
                rightRect.h = (viewport.height / glLayer.framebufferHeight) * (glLayer.framebufferHeight / this.canvas.height);
              }
            }
          }
          if (session.isAR)
          {
            this.gameModule.WebXR.OnStartAR(eyeCount, leftRect, rightRect);
          } else {
            this.gameModule.WebXR.OnStartVR(eyeCount, leftRect, rightRect);
          }
          this.gameModule.WebXR.OnVisibilityChange(session.visibilityState);
          this.didNotifyUnity = true;
        }
        return this.didNotifyUnity;
      }

      function initWebXRManager () {
        var xrManager = window.xrManager = new XRManager();
        return xrManager;
      }
    
      function init() {
        if (typeof(navigator.xr) == 'undefined') {
          var script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/webxr-polyfill@latest/build/webxr-polyfill.js';
          document.getElementsByTagName('head')[0].appendChild(script);
    
          script.addEventListener('load', function () {
            initWebXRManager();
          });
    
          script.addEventListener('error', function (err) {
            console.warn('Could not load the WebXR Polyfill script:', err);
          });
        }
        else
        {
          initWebXRManager();
        }
      }

      init();
    })();

}, 0);

Module['WebXR'].GetBrowserObject = function () {
  return Browser;
}

Module['WebXR'].GetJSEventsObject = function () {
  return JSEvents;
}

Module['WebXR'].OnStartAR = function (views_count, left_rect, right_rect) {
  Module.WebXR.isInXR = true;
  Module.dynCall_viffffffff(Module.WebXR.onStartARPtr, views_count,
                          left_rect.x, left_rect.y, left_rect.w, left_rect.h,
                          right_rect.x, right_rect.y, right_rect.w, right_rect.h);
}

Module['WebXR'].OnStartVR = function (views_count, left_rect, right_rect) {
  Module.WebXR.isInXR = true;
  Module.dynCall_viffffffff(Module.WebXR.onStartVRPtr, views_count,
                          left_rect.x, left_rect.y, left_rect.w, left_rect.h,
                          right_rect.x, right_rect.y, right_rect.w, right_rect.h);
}

Module['WebXR'].OnVisibilityChange = function (visibility_state) {
  var visibility_state_int = 0;
  if (visibility_state == "visible-blurred") {
    visibility_state_int = 1;
  } else if (visibility_state == "hidden") {
    visibility_state_int = 2;
  }
  Module.dynCall_vi(Module.WebXR.onVisibilityChangePtr, visibility_state_int);
}

Module['WebXR'].OnEndXR = function () {
  Module.WebXR.isInXR = false;
  Module.dynCall_v(Module.WebXR.onEndXRPtr);
}

Module['WebXR'].OnXRCapabilities = function (isARSupported, isVRSupported) {
  Module.dynCall_vii(Module.WebXR.onXRCapabilitiesPtr, isARSupported, isVRSupported);
}

Module['WebXR'].OnInputProfiles = function (input_profiles) {
  var strBufferSize = lengthBytesUTF8(input_profiles) + 1;
  var strBuffer = Module._malloc(strBufferSize);
  stringToUTF8(input_profiles, strBuffer, strBufferSize);
  Module.dynCall_vi(Module.WebXR.onInputProfilesPtr, strBuffer);
  Module._free(strBuffer);
};var stackTraceReference="(^|\\n)(\\s+at\\s+|)jsStackTrace(\\s+\\(|@)([^\\n]+):\\d+:\\d+(\\)|)(\\n|$)";var stackTraceReferenceMatch=jsStackTrace().match(new RegExp(stackTraceReference));if(stackTraceReferenceMatch)Module.stackTraceRegExp=new RegExp(stackTraceReference.replace("([^\\n]+)",stackTraceReferenceMatch[4].replace(/[\\^${}[\]().*+?|]/g,"\\$&")).replace("jsStackTrace","[^\\n]+"));var abort=(function(what){if(ABORT)return;ABORT=true;EXITSTATUS=1;if(typeof ENVIRONMENT_IS_PTHREAD!=="undefined"&&ENVIRONMENT_IS_PTHREAD)console.error("Pthread aborting at "+(new Error).stack);if(what!==undefined){out(what);err(what);what=JSON.stringify(what)}else{what=""}var message="abort("+what+") at "+stackTrace();if(Module.abortHandler&&Module.abortHandler(message))return;throw message});if(typeof ENVIRONMENT_IS_PTHREAD==="undefined"||!ENVIRONMENT_IS_PTHREAD){Module["preRun"].push((function(){var unityFileSystemInit=Module["unityFileSystemInit"]||(function(){FS.mkdir("/idbfs");FS.mount(IDBFS,{},"/idbfs");Module.addRunDependency("JS_FileSystem_Mount");FS.syncfs(true,(function(err){if(err)console.log("IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved.");Module.removeRunDependency("JS_FileSystem_Mount")}))});unityFileSystemInit()}))}Module["SetFullscreen"]=(function(fullscreen){if(typeof runtimeInitialized==="undefined"||!runtimeInitialized){console.log("Runtime not initialized yet.")}else if(typeof JSEvents==="undefined"){console.log("Player not loaded yet.")}else{var tmp=JSEvents.canPerformEventHandlerRequests;JSEvents.canPerformEventHandlerRequests=(function(){return 1});Module.ccall("SetFullscreen",null,["number"],[fullscreen]);JSEvents.canPerformEventHandlerRequests=tmp}});var MediaDevices=[];if(typeof ENVIRONMENT_IS_PTHREAD==="undefined"||!ENVIRONMENT_IS_PTHREAD){Module["preRun"].push((function(){var enumerateMediaDevices=(function(){var getMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;if(!getMedia)return;function addDevice(label){label=label?label:"device #"+MediaDevices.length;var device={deviceName:label,refCount:0,video:null};MediaDevices.push(device)}if(!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices){if(typeof MediaStreamTrack=="undefined"||typeof MediaStreamTrack.getSources=="undefined"){console.log("Media Devices cannot be enumerated on this browser.");return}function gotSources(sourceInfos){for(var i=0;i!==sourceInfos.length;++i){var sourceInfo=sourceInfos[i];if(sourceInfo.kind==="video")addDevice(sourceInfo.label)}}MediaStreamTrack.getSources(gotSources)}navigator.mediaDevices.enumerateDevices().then((function(devices){devices.forEach((function(device){if(device.kind=="videoinput")addDevice(device.label)}))})).catch((function(err){console.log(err.name+": "+error.message)}))});enumerateMediaDevices()}))}function SendMessage(gameObject,func,param){if(param===undefined)Module.ccall("SendMessage",null,["string","string"],[gameObject,func]);else if(typeof param==="string")Module.ccall("SendMessageString",null,["string","string","string"],[gameObject,func,param]);else if(typeof param==="number")Module.ccall("SendMessageFloat",null,["string","string","number"],[gameObject,func,param]);else throw""+param+" is does not have a type which is supported by SendMessage."}Module["SendMessage"]=SendMessage;var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=(function(status,toThrow){throw toThrow});Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}else{return scriptDirectory+path}}if(ENVIRONMENT_IS_NODE){scriptDirectory=__dirname+"/";var nodeFS;var nodePath;Module["read"]=function shell_read(filename,binary){var ret;if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);ret=nodeFS["readFileSync"](filename);return binary?ret:ret.toString()};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}Module["arguments"]=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",(function(ex){if(!(ex instanceof ExitStatus)){throw ex}}));process["on"]("unhandledRejection",(function(reason,p){process["exit"](1)}));Module["quit"]=(function(status){process["exit"](status)});Module["inspect"]=(function(){return"[Emscripten Module object]"})}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){Module["read"]=function shell_read(f){return read(f)}}Module["readBinary"]=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof quit==="function"){Module["quit"]=(function(status){quit(status)})}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WEB){if(document.currentScript){scriptDirectory=document.currentScript.src}}else{scriptDirectory=self.location.href}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.split("/").slice(0,-1).join("/")+"/"}else{scriptDirectory=""}Module["read"]=function shell_read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)};Module["setWindowTitle"]=(function(title){document.title=title})}else{}var out=Module["print"]||(typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null);var err=Module["printErr"]||(typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||out);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=undefined;var STACK_ALIGN=16;function staticAlloc(size){var ret=STATICTOP;STATICTOP=STATICTOP+size+15&-16;return ret}function dynamicAlloc(size){var ret=HEAP32[DYNAMICTOP_PTR>>2];var end=ret+size+15&-16;HEAP32[DYNAMICTOP_PTR>>2]=end;if(end>=TOTAL_MEMORY){var success=enlargeMemory();if(!success){HEAP32[DYNAMICTOP_PTR>>2]=ret;return 0}}return ret}function alignMemory(size,factor){if(!factor)factor=STACK_ALIGN;var ret=size=Math.ceil(size/factor)*factor;return ret}function getNativeTypeSize(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return 4}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0);return bits/8}else{return 0}}}}function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}var asm2wasmImports={"f64-rem":(function(x,y){return x%y}),"debugger":(function(){debugger})};var jsCallStartIndex=1;var functionPointers=new Array(0);function addFunction(func,sig){var base=0;for(var i=base;i<base+0;i++){if(!functionPointers[i]){functionPointers[i]=func;return jsCallStartIndex+i}}throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."}var funcWrappers={};function getFuncWrapper(func,sig){if(!func)return;assert(sig);if(!funcWrappers[sig]){funcWrappers[sig]={}}var sigCache=funcWrappers[sig];if(!sigCache[func]){if(sig.length===1){sigCache[func]=function dynCall_wrapper(){return dynCall(sig,func)}}else if(sig.length===2){sigCache[func]=function dynCall_wrapper(arg){return dynCall(sig,func,[arg])}}else{sigCache[func]=function dynCall_wrapper(){return dynCall(sig,func,Array.prototype.slice.call(arguments))}}}return sigCache[func]}function makeBigInt(low,high,unsigned){return unsigned?+(low>>>0)+ +(high>>>0)*4294967296:+(low>>>0)+ +(high|0)*4294967296}function dynCall(sig,ptr,args){if(args&&args.length){return Module["dynCall_"+sig].apply(null,[ptr].concat(args))}else{return Module["dynCall_"+sig].call(null,ptr)}}var GLOBAL_BASE=1024;var ABORT=0;var EXITSTATUS=0;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}var JSfuncs={"stackSave":(function(){stackSave()}),"stackRestore":(function(){stackRestore()}),"arrayToC":(function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}),"stringToC":(function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret})};var toC={"string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]};function ccall(ident,returnType,argTypes,args,opts){function convertReturnValue(ret){if(returnType==="string")return Pointer_stringify(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every((function(type){return type==="number"}));var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(function(){return ccall(ident,returnType,argTypes,arguments,opts)})}function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=1?tempDouble>0?(Math_min(+Math_floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}var ALLOC_NORMAL=0;var ALLOC_STACK=1;var ALLOC_STATIC=2;var ALLOC_NONE=4;function allocate(slab,types,allocator,ptr){var zeroinit,size;if(typeof slab==="number"){zeroinit=true;size=slab}else{zeroinit=false;size=slab.length}var singleType=typeof types==="string"?types:null;var ret;if(allocator==ALLOC_NONE){ret=ptr}else{ret=[typeof _malloc==="function"?_malloc:staticAlloc,stackAlloc,staticAlloc,dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))}if(zeroinit){var stop;ptr=ret;assert((ret&3)==0);stop=ret+(size&~3);for(;ptr<stop;ptr+=4){HEAP32[ptr>>2]=0}stop=ret+size;while(ptr<stop){HEAP8[ptr++>>0]=0}return ret}if(singleType==="i8"){if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var i=0,type,typeSize,previousType;while(i<size){var curr=slab[i];type=singleType||types[i];if(type===0){i++;continue}if(type=="i64")type="i32";setValue(ret+i,curr,type);if(previousType!==type){typeSize=getNativeTypeSize(type);previousType=type}i+=typeSize}return ret}function getMemory(size){if(!staticSealed)return staticAlloc(size);if(!runtimeInitialized)return dynamicAlloc(size);return _malloc(size)}function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=0;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];hasUtf|=t;if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(hasUtf<128){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}return UTF8ToString(ptr)}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx){var endPtr=idx;while(u8Array[endPtr])++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var u0,u1,u2,u3,u4,u5;var str="";while(1){u0=u8Array[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u3=u8Array[idx++]&63;if((u0&248)==240){u0=(u0&7)<<18|u1<<12|u2<<6|u3}else{u4=u8Array[idx++]&63;if((u0&252)==248){u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4}else{u5=u8Array[idx++]&63;u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5}}}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}}function UTF8ToString(ptr){return UTF8ArrayToString(HEAPU8,ptr)}function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=2097151){if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=67108863){if(outIdx+4>=endIdx)break;outU8Array[outIdx++]=248|u>>24;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+5>=endIdx)break;outU8Array[outIdx++]=252|u>>30;outU8Array[outIdx++]=128|u>>24&63;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){++len}else if(u<=2047){len+=2}else if(u<=65535){len+=3}else if(u<=2097151){len+=4}else if(u<=67108863){len+=5}else{len+=6}}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function allocateUTF8OnStack(str){var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8Array(str,HEAP8,ret,size);return ret}function demangle(func){return func}function demangleAll(text){var regex=/__Z[\w\d_]+/g;return text.replace(regex,(function(x){var y=demangle(x);return x===y?x:x+" ["+y+"]"}))}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}function stackTrace(){var js=jsStackTrace();if(Module["extraStackTrace"])js+="\n"+Module["extraStackTrace"]();return demangleAll(js)}var PAGE_SIZE=16384;var WASM_PAGE_SIZE=65536;var ASMJS_PAGE_SIZE=16777216;var MIN_TOTAL_MEMORY=16777216;function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBuffer(buf){Module["buffer"]=buffer=buf}function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer)}var STATIC_BASE,STATICTOP,staticSealed;var STACK_BASE,STACKTOP,STACK_MAX;var DYNAMIC_BASE,DYNAMICTOP_PTR;STATIC_BASE=STATICTOP=STACK_BASE=STACKTOP=STACK_MAX=DYNAMIC_BASE=DYNAMICTOP_PTR=0;staticSealed=false;function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}if(!Module["reallocBuffer"])Module["reallocBuffer"]=(function(size){var ret;try{if(ArrayBuffer.transfer){ret=ArrayBuffer.transfer(buffer,size)}else{var oldHEAP8=HEAP8;ret=new ArrayBuffer(size);var temp=new Int8Array(ret);temp.set(oldHEAP8)}}catch(e){return false}var success=_emscripten_replace_memory(ret);if(!success)return false;return ret});function enlargeMemory(){var PAGE_MULTIPLE=Module["usingWasm"]?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE;var LIMIT=2147483648-PAGE_MULTIPLE;if(HEAP32[DYNAMICTOP_PTR>>2]>LIMIT){return false}var OLD_TOTAL_MEMORY=TOTAL_MEMORY;TOTAL_MEMORY=Math.max(TOTAL_MEMORY,MIN_TOTAL_MEMORY);while(TOTAL_MEMORY<HEAP32[DYNAMICTOP_PTR>>2]){if(TOTAL_MEMORY<=536870912){TOTAL_MEMORY=alignUp(2*TOTAL_MEMORY,PAGE_MULTIPLE)}else{TOTAL_MEMORY=Math.min(alignUp((3*TOTAL_MEMORY+2147483648)/4,PAGE_MULTIPLE),LIMIT)}}var replacement=Module["reallocBuffer"](TOTAL_MEMORY);if(!replacement||replacement.byteLength!=TOTAL_MEMORY){TOTAL_MEMORY=OLD_TOTAL_MEMORY;return false}updateGlobalBuffer(replacement);updateGlobalBufferViews();return true}var byteLength;try{byteLength=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get);byteLength(new ArrayBuffer(4))}catch(e){byteLength=(function(buffer){return buffer.byteLength})}var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||33554432;if(TOTAL_MEMORY<TOTAL_STACK)err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");if(Module["buffer"]){buffer=Module["buffer"]}else{if(typeof WebAssembly==="object"&&typeof WebAssembly.Memory==="function"){Module["wasmMemory"]=new WebAssembly.Memory({"initial":TOTAL_MEMORY/WASM_PAGE_SIZE});buffer=Module["wasmMemory"].buffer}else{buffer=new ArrayBuffer(TOTAL_MEMORY)}Module["buffer"]=buffer}updateGlobalBufferViews();function getTotalMemory(){return TOTAL_MEMORY}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}function unSign(value,bits,ignore){if(value>=0){return value}return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value}function reSign(value,bits,ignore){if(value<=0){return value}var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);if(value>=half&&(bits<=32||value>half)){value=-2*half+value}return value}var Math_abs=Math.abs;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_pow=Math.pow;var Math_min=Math.min;var Math_clz32=Math.clz32;var Math_trunc=Math.trunc;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}function integrateWasmJS(){var wasmTextFile="build.wast";var wasmBinaryFile="build.wasm";var asmjsCodeFile="build.temp.asm.js";if(!isDataURI(wasmTextFile)){wasmTextFile=locateFile(wasmTextFile)}if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}if(!isDataURI(asmjsCodeFile)){asmjsCodeFile=locateFile(asmjsCodeFile)}var wasmPageSize=64*1024;var info={"global":null,"env":null,"asm2wasm":asm2wasmImports,"parent":Module};var exports=null;function mergeMemory(newBuffer){var oldBuffer=Module["buffer"];if(newBuffer.byteLength<oldBuffer.byteLength){err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")}var oldView=new Int8Array(oldBuffer);var newView=new Int8Array(newBuffer);newView.set(oldView);updateGlobalBuffer(newBuffer);updateGlobalBufferViews()}function fixImports(imports){return imports}function getBinary(){try{if(Module["wasmBinary"]){return new Uint8Array(Module["wasmBinary"])}if(Module["readBinary"]){return Module["readBinary"](wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!Module["wasmBinary"]&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then((function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()})).catch((function(){return getBinary()}))}return new Promise((function(resolve,reject){resolve(getBinary())}))}function doNativeWasm(global,env,providedBuffer){if(typeof WebAssembly!=="object"){err("no native wasm support detected");return false}if(!(Module["wasmMemory"]instanceof WebAssembly.Memory)){err("no native wasm Memory in use");return false}env["memory"]=Module["wasmMemory"];info["global"]={"NaN":NaN,"Infinity":Infinity};info["global.Math"]=Math;info["env"]=env;function receiveInstance(instance,module){exports=instance.exports;if(exports.memory)mergeMemory(exports.memory);Module["asm"]=exports;Module["usingWasm"]=true;removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}function receiveInstantiatedSource(output){receiveInstance(output["instance"],output["module"])}function instantiateArrayBuffer(receiver){getBinaryPromise().then((function(binary){return WebAssembly.instantiate(binary,info)})).then(receiver).catch((function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)}))}if(!Module["wasmBinary"]&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){WebAssembly.instantiateStreaming(fetch(wasmBinaryFile,{credentials:"same-origin"}),info).then(receiveInstantiatedSource).catch((function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource)}))}else{instantiateArrayBuffer(receiveInstantiatedSource)}return{}}Module["asmPreload"]=Module["asm"];var asmjsReallocBuffer=Module["reallocBuffer"];var wasmReallocBuffer=(function(size){var PAGE_MULTIPLE=Module["usingWasm"]?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE;size=alignUp(size,PAGE_MULTIPLE);var old=Module["buffer"];var oldSize=old.byteLength;if(Module["usingWasm"]){try{var result=Module["wasmMemory"].grow((size-oldSize)/wasmPageSize);if(result!==(-1|0)){return Module["buffer"]=Module["wasmMemory"].buffer}else{return null}}catch(e){return null}}});Module["reallocBuffer"]=(function(size){if(finalMethod==="asmjs"){return asmjsReallocBuffer(size)}else{return wasmReallocBuffer(size)}});var finalMethod="";Module["asm"]=(function(global,env,providedBuffer){env=fixImports(env);if(!env["table"]){var TABLE_SIZE=Module["wasmTableSize"];if(TABLE_SIZE===undefined)TABLE_SIZE=1024;var MAX_TABLE_SIZE=Module["wasmMaxTableSize"];if(typeof WebAssembly==="object"&&typeof WebAssembly.Table==="function"){if(MAX_TABLE_SIZE!==undefined){env["table"]=new WebAssembly.Table({"initial":TABLE_SIZE,"maximum":MAX_TABLE_SIZE,"element":"anyfunc"})}else{env["table"]=new WebAssembly.Table({"initial":TABLE_SIZE,element:"anyfunc"})}}else{env["table"]=new Array(TABLE_SIZE)}Module["wasmTable"]=env["table"]}if(!env["memoryBase"]){env["memoryBase"]=Module["STATIC_BASE"]}if(!env["tableBase"]){env["tableBase"]=0}var exports;exports=doNativeWasm(global,env,providedBuffer);assert(exports,"no binaryen method succeeded.");return exports});}integrateWasmJS();var ASM_CONSTS=[(function(){return Module.webglContextAttributes.premultipliedAlpha}),(function(){return Module.webglContextAttributes.preserveDrawingBuffer}),(function(){return typeof Module.shouldQuit!="undefined"}),(function(){for(var id in Module.intervals){window.clearInterval(id)}Module.intervals={};for(var i=0;i<Module.deinitializers.length;i++){Module.deinitializers[i]()}Module.deinitializers=[];if(typeof Module.onQuit=="function")Module.onQuit()})];function _emscripten_asm_const_i(code){return ASM_CONSTS[code]()}function _emscripten_asm_const_sync_on_main_thread_i(code){return ASM_CONSTS[code]()}STATIC_BASE=GLOBAL_BASE;STATICTOP=STATIC_BASE+4037472;__ATINIT__.push({func:(function(){__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_AIScriptingClasses_cpp()})},{func:(function(){___cxx_global_var_init_192()})},{func:(function(){__GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_AnimationScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Animation_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Animation_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Animation_7_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Animation_Constraints_0_cpp()})},{func:(function(){__GLOBAL__sub_I_AnimationClip_cpp()})},{func:(function(){__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_AudioScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Video_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Audio_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Audio_Public_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Audio_Public_3_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp()})},{func:(function(){__GLOBAL__sub_I_ClothScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Cloth_0_cpp()})},{func:(function(){___cxx_global_var_init_18_1119()})},{func:(function(){__GLOBAL__sub_I_nvcloth_src_0_cpp()})},{func:(function(){__GLOBAL__sub_I_nvcloth_src_1_cpp()})},{func:(function(){__GLOBAL__sub_I_SwInterCollision_cpp()})},{func:(function(){__GLOBAL__sub_I_SwSolverKernel_cpp()})},{func:(function(){__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Input_0_cpp()})},{func:(function(){__GLOBAL__sub_I_GfxDeviceNull_cpp()})},{func:(function(){__GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_2D_Renderer_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Allocator_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Application_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Burst_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_6_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_7_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_8_cpp()})},{func:(function(){__GLOBAL__sub_I_Shadows_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp()})},{func:(function(){__GLOBAL__sub_I_GUITexture_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Containers_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_File_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Geometry_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_0_cpp()})},{func:(function(){___cxx_global_var_init_104_1218()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_4_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_6_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_8_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_9_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_10_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_11_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_12_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_CommandBuffer_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Interfaces_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Interfaces_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Interfaces_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Jobs_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Jobs_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Jobs_Internal_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Math_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Math_Random_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Misc_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Misc_2_cpp()})},{func:(function(){___cxx_global_var_init_131_1219()})},{func:(function(){__GLOBAL__sub_I_Runtime_Misc_3_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Misc_4_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Misc_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Profiler_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Profiler_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Profiler_ExternalGPUProfiler_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Profiler_ScriptBindings_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_SceneManager_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_2_cpp()})},{func:(function(){___cxx_global_var_init_61()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_4_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_GpuPrograms_0_cpp()})},{func:(function(){___cxx_global_var_init_9_9268()})},{func:(function(){__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_2_cpp()})},{func:(function(){___cxx_global_var_init_9469()})},{func:(function(){__GLOBAL__sub_I_Runtime_Transform_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Transform_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Utilities_2_cpp()})},{func:(function(){___cxx_global_var_init_9905()})},{func:(function(){__GLOBAL__sub_I_Runtime_Utilities_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Utilities_6_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Utilities_7_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Utilities_9_cpp()})},{func:(function(){__GLOBAL__sub_I_AssetBundleFileSystem_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Modules_0_cpp()})},{func:(function(){___cxx_global_var_init_18_10258()})},{func:(function(){___cxx_global_var_init_19_10259()})},{func:(function(){___cxx_global_var_init_20_10260()})},{func:(function(){__GLOBAL__sub_I_Modules_Profiler_Public_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Profiler_Runtime_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Export_Unsafe_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_GfxDevice_4_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_GfxDevice_5_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Director_Core_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Scripting_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Scripting_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Scripting_3_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Mono_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Mono_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp()})},{func:(function(){__GLOBAL__sub_I_TemplateInstantiations_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Serialize_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Serialize_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp()})},{func:(function(){__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp()})},{func:(function(){__GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Mesh_cpp()})},{func:(function(){__GLOBAL__sub_I_LogAssert_cpp()})},{func:(function(){__GLOBAL__sub_I_Shader_cpp()})},{func:(function(){__GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Source_0_cpp()})},{func:(function(){__GLOBAL__sub_I_DirectorScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp()})},{func:(function(){__GLOBAL__sub_I_GridScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Grid_Public_0_cpp()})},{func:(function(){___cxx_global_var_init_3915()})},{func:(function(){__GLOBAL__sub_I_IMGUIScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_IMGUI_0_cpp()})},{func:(function(){___cxx_global_var_init_23_16()})},{func:(function(){__GLOBAL__sub_I_Modules_IMGUI_1_cpp()})},{func:(function(){__GLOBAL__sub_I_InputLegacyScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_InputScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Input_Private_0_cpp()})},{func:(function(){__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_ParticleSystem_0_cpp()})},{func:(function(){__GLOBAL__sub_I_ParticleSystemGeometryJob_cpp()})},{func:(function(){__GLOBAL__sub_I_NoiseModule_cpp()})},{func:(function(){__GLOBAL__sub_I_ShapeModule_cpp()})},{func:(function(){__GLOBAL__sub_I_UVModule_cpp()})},{func:(function(){__GLOBAL__sub_I_Physics2DScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp()})},{func:(function(){__GLOBAL__sub_I_PhysicsScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Physics_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Physics_2_cpp()})},{func:(function(){__GLOBAL__sub_I_PhysicsQuery_cpp()})},{func:(function(){__GLOBAL__sub_I_physx_source_physxextensions_src_2_cpp()})},{func:(function(){__GLOBAL__sub_I_SubsystemsScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Subsystems_0_cpp()})},{func:(function(){__GLOBAL__sub_I_TerrainScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp()})},{func:(function(){___cxx_global_var_init_89_7069()})},{func:(function(){__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Terrain_Public_3_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp()})},{func:(function(){__GLOBAL__sub_I_TextCoreScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp()})},{func:(function(){__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_TilemapScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Tilemap_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_UIElementsNativeScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp()})},{func:(function(){__GLOBAL__sub_I_UIScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_UI_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_UI_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_UI_2_cpp()})},{func:(function(){__GLOBAL__sub_I_umbra_cpp()})},{func:(function(){__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_UnityAdsSettings_cpp()})},{func:(function(){__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_VFXScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_VFX_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_VFX_Public_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_VFX_Public_Systems_0_cpp()})},{func:(function(){__GLOBAL__sub_I_VisualEffectAsset_cpp()})},{func:(function(){__GLOBAL__sub_I_VideoScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Video_Public_Base_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_Video_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_VideoYUV420Convert_cpp()})},{func:(function(){__GLOBAL__sub_I_VRScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_VR_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_VR_1_cpp()})},{func:(function(){__GLOBAL__sub_I_PluginInterfaceVR_cpp()})},{func:(function(){__GLOBAL__sub_I_Wind_cpp()})},{func:(function(){__GLOBAL__sub_I_XRScriptingClasses_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_0_cpp()})},{func:(function(){__GLOBAL__sub_I_XRAudio_cpp()})},{func:(function(){__GLOBAL__sub_I_XRPreInit_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Stats_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Subsystems_Display_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Subsystems_Meshing_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Modules_XR_Tracing_0_cpp()})},{func:(function(){__GLOBAL__sub_I_XRWindowsLocatableCamera_cpp()})},{func:(function(){__GLOBAL__sub_I_External_il2cpp_builds_external_baselib_Platforms_WebGL_Source_0_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_os_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_icalls_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_vm_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_utils_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_vm_utils_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_mono_cpp()})},{func:(function(){__GLOBAL__sub_I_Lump_libil2cpp_gc_cpp()})},{func:(function(){___emscripten_environ_constructor()})});var STATIC_BUMP=4037472;Module["STATIC_BASE"]=STATIC_BASE;Module["STATIC_BUMP"]=STATIC_BUMP;var tempDoublePtr=STATICTOP;STATICTOP+=16;function UWContextGetCapabilities(senderReceiver,kindIdx){var kind=UWMediaStreamTrackKind[kindIdx];var capabilities={codecs:[],headerExtensions:[]};const supportsSetCodecPreferences=window.RTCRtpTransceiver&&"setCodecPreferences"in window.RTCRtpTransceiver.prototype;if(supportsSetCodecPreferences)capabilities=senderReceiver.getCapabilities(kind);var capabilitiesJson=JSON.stringify(capabilities);var capabilitiesJsonPtr=uwcom_strToPtr(capabilitiesJson);return capabilitiesJsonPtr}function _ContextAddRefPtr(ptr){}var UWRTCErrorType=["None","UnsupportedOperation","UnsupportedParameter","InvalidParameter","InvalidRange","SyntaxError","InvalidState","InvalidModification","NetworkError","ResourceExhausted","InternalError","OperationErrorWithData"];var UWRTCPriorityType=["very-low","low","medium","high"];var UWRTCStatsIceCandidatePairState=["frozen","waiting","in-progress","failed","succeeded"];var UWRTCQualityLimitationReason=["none","cpu","bandwidth","other"];var UWRTCCodecType=["encode","decode"];var UWRTCStatsType=["codec","inbound-rtp","outbound-rtp","remote-inbound-rtp","remote-outbound-rtp","media-source","csrc","peer-connection","data-channel","stream","track","transceiver","sender","receiver","transport","sctp-transport","candidate-pair","local-candidate","remote-candidate","certificate","ice-server"];var UWMediaStreamTrackKind=["audio","video"];var UWRTCDataChannelState=["connecting","open","closing","closed"];var UWRTCIceComponent=["none","rtp","rtcp"];var UWRTCIceRole=["unknown","controlling","controlled"];var UWRTCIceTransportState=["new","checking","connected","completed","disconnected","failed","closed"];var UWRTCDtlsTransportState=["new","connecting","connected","closed","failed"];var UWRTCIceCandidateType=["host","srflx","prflx","relay"];var UWRTCSdpType=["offer","pranswer","answer","rollback"];var UWRTCIceConnectionState=["new","checking","connected","completed","failed","disconnected","closed","max"];var UWRTCPeerConnectionState=["new","connecting","connected","disconnected","failed","closed"];var UWRTCIceGatheringState=["new","gathering","complete"];var UWRTCBundlePolicy=["balanced","max-compat","max-bundle"];var UWRTCIceTransportPolicy=["","relay","","all"];var UWRTCIceCredentialType=["password","oauth"];var UWEncoderType=["software","hardware"];function _ContextCreate(uid,encodeType){var context={id:uid,encodeType:UWEncoderType[encodeType]};uwcom_addManageObj(context);return context.managePtr}function _ContextCreateAudioTrack(contextPtr,labelPtr,sourcePtr){if(!uwcom_existsCheck(contextPtr,"ContextCreateAudioTrack","context"))return;return _CreateAudioTrack(labelPtr,sourcePtr)}function _ContextCreateAudioTrackSource(contextPtr){if(!uwcom_existsCheck(contextPtr,"ContextCreateAudioTrackSource","context"))return;const audioTrackSource={};uwcom_addManageObj(audioTrackSource);return audioTrackSource.managePtr}function _ContextCreateMediaStream(contextPtr,labelPtr){if(!uwcom_existsCheck(contextPtr,"ContextCreateMediaStream","context"))return;return _CreateMediaStream(labelPtr)}function _ContextCreatePeerConnection(contextPtr,conf){if(!uwcom_existsCheck(contextPtr,"ContextCreatePeerConnection","context"))return;return _CreatePeerConnection(conf)}function _ContextCreatePeerConnectionWithConfig(contextPtr,confPtr){if(!uwcom_existsCheck(contextPtr,"ContextCreatePeerConnectionWithConfig","context"))return;return _CreatePeerConnectionWithConfig(confPtr)}function _ContextCreateVideoTrackSource(contextPtr){if(!uwcom_existsCheck(contextPtr,"ContextCreateVideoTrackSource","context"))return;const videoTrackSource={};uwcom_addManageObj(videoTrackSource);return videoTrackSource.managePtr}function _ContextDeleteDataChannel(contextPtr,dataChannelPtr){if(!uwcom_existsCheck(dataChannelPtr,"ContextDeleteDataChannel","dataChannel"))return;delete UWManaged[dataChannelPtr]}function _ContextDeletePeerConnection(contextPtr,peerPtr){if(!uwcom_existsCheck(peerPtr,"ContextDeletePeerConnection","peer"))return;var peer=UWManaged[peerPtr];if(peer.readyState!=="closed"||peer.signalingState!=="closed")peer.close();delete UWManaged[peerPtr]}function _ContextDeleteRefPtr(ptr){}function _ContextDestroy(uid){var contextPtrs=Object.keys(UWManaged).filter((function(contextPtr){if("id"in UWManaged[contextPtr]){return UWManaged[contextPtr].id===uid}else return false}));if(contextPtrs.length>1){console.error("ContextDestroy: multiple Contexts with the same id")}else if(!contextPtrs.length){console.error("ContextDestroy: There is no context with id = "+uid.toString())}contextPtrs.forEach((function(contextPtr){delete UWManaged[contextPtr]}))}function _ContextRegisterAudioReceiveCallback(contextPtr,trackPtr,AudioTrackOnReceive){}function _ContextRegisterMediaStreamObserver(contextPtr,streamPtr){if(!uwcom_existsCheck(contextPtr,"MediaStreamRegisterOnAddTrack","context"))return;if(!uwcom_existsCheck(streamPtr,"MediaStreamRegisterOnAddTrack","stream"))return;var stream=UWManaged[streamPtr];stream.onaddtrack=(function(evt){uwcom_addManageObj(evt.track);Module.dynCall_vii(uwevt_MSOnAddTrack,stream.managePtr,evt.track.managePtr)});stream.onremovetrack=(function(evt){if(!uwcom_existsCheck(evt.track.managePtr,"stream.onremovetrack","track"))return;Module.dynCall_vii(uwevt_MSOnRemoveTrack,stream.managePtr,evt.track.managePtr)})}function _ContextUnregisterAudioReceiveCallback(contextPtr,trackPtr){}function _ControllerPulse(controller,intensity,duration){Module.WebXR.callHapticPulse({detail:{"controller":controller,"intensity":intensity,"duration":duration}})}function _CreateAudioTrack(labelPtr,sourcePtr){if(!uwcom_audioContext){uwcom_audioContext=new AudioContext}var dest=uwcom_audioContext.createMediaStreamDestination();var audioTrack=dest.stream.getAudioTracks()[0];uwcom_addManageObj(audioTrack);audioTrack.guid=UTF8ToString(labelPtr);return audioTrack.managePtr}function _CreateDataChannel(peerPtr,labelPtr,optionsJsonPtr){var peer=UWManaged[peerPtr];var label=UTF8ToString(labelPtr);var optionsJson=UTF8ToString(optionsJsonPtr);var options=JSON.parse(optionsJson);if(options.ordered.hasValue)options.ordered=options.ordered.value;else delete options.ordered;if(options.maxRetransmits.hasValue)options.maxRetransmits=options.maxRetransmits.value;else delete options.maxRetransmits;if(options.maxRetransmitTime.hasValue)options.maxRetransmitTime=options.maxRetransmitTime.value;else delete options.maxRetransmitTime;if(options.negotiated.hasValue)options.negotiated=options.negotiated.value;else delete options.negotiated;if(options.id.hasValue)options.id=options.id.value;else delete options.id;if(options.maxRetransmits&&options.maxRetransmitTime)return 0;try{var dataChannel=peer.createDataChannel(label,options)}catch(err){console.log(err);return 0}dataChannel.onmessage=(function(evt){if(typeof evt.data==="string"){var msgPtr=uwcom_strToPtr(evt.data);Module.dynCall_vii(uwevt_DCOnTextMessage,this.managePtr,msgPtr)}else{var msgPtr=uwcom_arrayToReturnPtr(evt.data,Uint8Array);Module.dynCall_viii(uwevt_DCOnBinaryMessage,this.managePtr,msgPtr+4,evt.data.byteLength)}});dataChannel.onopen=(function(evt){if(!uwcom_existsCheck(this.managePtr,"onopen","dataChannel"))return;Module.dynCall_vi(uwevt_DCOnOpen,this.managePtr)});dataChannel.onclose=(function(evt){if(!uwcom_existsCheck(this.managePtr,"onclose","dataChannel"))return;Module.dynCall_vi(uwevt_DCOnClose,this.managePtr)});uwcom_addManageObj(dataChannel);return dataChannel.managePtr}function _CreateMediaStream(labelPtr){var label=UTF8ToString(labelPtr);var stream=new MediaStream;stream.guid=label;stream.onaddtrack=(function(evt){uwcom_addManageObj(evt.track);console.log("stream.ontrack"+evt.track.managePtr);Module.dynCall_vii(uwevt_MSOnAddTrack,this.managePtr,evt.track.managePtr)});stream.onremovetrack=(function(evt){if(!evt.track.managePtr){console.warn("track does not own managePtr");return}if(!uwcom_existsCheck(evt.track.managePtr,"stream.onremovetrack","track"))return;Module.dynCall_vii(uwevt_MSOnRemoveTrack,this.managePtr,evt.track.managePtr)});uwcom_addManageObj(stream);uwcom_debugLog("log","RTCPeerConnection.jslib","CreateMediaStream",stream.managePtr);return stream.managePtr}function _CreateNativeRTCIceCandidate(candPtr,sdpMidPtr,sdpMLineIndex){var cand=UTF8ToString(candPtr);var sdpMid=UTF8ToString(sdpMidPtr);var candidate=new RTCIceCandidate({candidate:cand,sdpMid:sdpMid,sdpMLineIndex:sdpMLineIndex});uwcom_addManageObj(candidate);return candidate.managePtr}function _CreateNativeTexture(){var texPtr=0;for(var texPtr=0;texPtr<GL.textures.length;texPtr++){if(GL.textures[texPtr]===undefined)break}var tex=GLctx.createTexture();tex.name=texPtr;GL.textures[texPtr]=tex;return texPtr}function _CreatePeerConnection(conf){var label="";if(conf){label=conf.label;delete conf.label}conf=conf||{};try{var peer=new RTCPeerConnection(conf)}catch(err){return 0}peer.label=label;uwcom_debugLog("log","RTCPeerConnection.jslib","CreatePeerConnection","create peer: "+peer.label);peer.onicecandidate=(function(evt){var cnd=evt.candidate;if(cnd){uwcom_debugLog("log","RTCPeerConnection.jslib","onicecandidate",JSON.stringify(evt.candidate.toJSON()));uwcom_addManageObj(cnd);var candidatePtr=uwcom_strToPtr(cnd.candidate);var sdpMidPtr=uwcom_strToPtr(cnd.sdpMid);Module.dynCall_viiiii(uwevt_PCOnIceCandidate,peer.managePtr,cnd.managePtr,candidatePtr,sdpMidPtr,cnd.sdpMLineIndex)}});peer.oniceconnectionstatechange=(function(evt){uwcom_debugLog("log","RTCPeerConnection.jslib","oniceconnectionstatechange",this.label+":"+this.iceConnectionState);var idx=UWRTCIceConnectionState.indexOf(this.iceConnectionState);if(idx===-1){console.error('unknown iceConnectionState: "'+this.iceConnectionState+'"')}Module.dynCall_vii(uwevt_PCOnIceConnectionChange,peer.managePtr,idx)});peer.onconnectionstatechange=(function(evt){uwcom_debugLog("log","RTCPeerConnection.jslib","onconnectionstatechange",this.label+":"+this.connectionState);var idx=UWRTCPeerConnectionState.indexOf(this.connectionState);Module.dynCall_vii(uwevt_PCOnConnectionStateChange,peer.managePtr,idx)});peer.onicegatheringstatechange=(function(evt){uwcom_debugLog("log","RTCPeerConnection.jslib","onicegatheringstatechange",this.label+":"+this.iceGatheringState);var idx=UWRTCIceGatheringState.indexOf(this.iceGatheringState);if(idx===-1){console.error('unknown iceGatheringState: "'+this.iceGatheringState+'"')}Module.dynCall_vii(uwevt_PCOnIceGatheringChange,peer.managePtr,idx)});peer.onnegotiationneeded=(function(evt){uwcom_debugLog("log","RTCPeerConnection.jslib","onnegotiationneeded",this.label);Module.dynCall_vi(uwevt_PCOnNegotiationNeeded,peer.managePtr)});peer.ondatachannel=(function(evt){uwcom_debugLog("log","RTCPeerConnection.jslib","ondatachannel",this.label+":"+evt.channel.label);var channel=evt.channel;channel.onmessage=(function(evt){if(typeof evt.data==="string"){var msgPtr=uwcom_strToPtr(evt.data);Module.dynCall_vii(uwevt_DCOnTextMessage,channel.managePtr,msgPtr)}else{var msgPtr=uwcom_arrayToReturnPtr(evt.data,Uint8Array);Module.dynCall_viii(uwevt_DCOnBinaryMessage,channel.managePtr,msgPtr+4,evt.data.byteLength)}});channel.onopen=(function(evt){if(!uwcom_existsCheck(channel.managePtr,"onopen","dataChannel"))return;Module.dynCall_vi(uwevt_DCOnOpen,channel.managePtr)});channel.onclose=(function(evt){if(!uwcom_existsCheck(channel.managePtr,"onclose","dataChannel"))return;Module.dynCall_vi(uwevt_DCOnClose,channel.managePtr)});uwcom_addManageObj(channel);Module.dynCall_vii(uwevt_PCOnDataChannel,peer.managePtr,channel.managePtr)});peer.ontrack=(function(evt){uwcom_debugLog("log","RTCPeerConnection.jslib","ontrack",this.label+":"+evt.track.kind);var receiver=evt.receiver;var transceiver=evt.transceiver;var track=evt.track;if(evt.streams[0])evt.streams[0].removeTrack(track);uwcom_addManageObj(receiver);uwcom_addManageObj(transceiver);uwcom_addManageObj(track);var stream=new MediaStream;stream.addTrack(track);if(track.kind==="audio"){var audio=document.createElement("audio");audio.id="audio_remote_"+track.managePtr.toString();audio.style.display="none";audio.srcObject=stream;audio.play();uwcom_remoteAudioTracks[track.managePtr]={track:track,audio:audio};Module.dynCall_vii(uwevt_PCOnTrack,peer.managePtr,transceiver.managePtr)}else if(track.kind==="video"){var video=document.createElement("video");video.id="video_receive_"+track.managePtr.toString();video.muted=true;video.srcObject=stream;video.style.width="300px";video.style.height="200px";video.style.position="absolute";video.style.left=video.style.top=0;uwcom_remoteVideoTracks[track.managePtr]={track:track,video:video};video.play();video.onloadedmetadata=(function(evt){Module.dynCall_vii(uwevt_PCOnTrack,peer.managePtr,transceiver.managePtr)})}});uwcom_addManageObj(peer);return peer.managePtr}function _CreatePeerConnectionWithConfig(confPtr){var confJson=UTF8ToString(confPtr);var conf=JSON.parse(confJson);var iceIdx=0;for(var iceIdx=0;iceIdx<conf.iceServers.length;iceIdx++){var idx=conf.iceServers[iceIdx].credentialType;conf.iceServers[iceIdx].credentialType=UWRTCIceCredentialType[idx]}if(conf.iceTransportPolicy){if(conf.iceTransportPolicy.hasValye)conf.iceTransportPolicy=UWRTCIceTransportPolicy[conf.iceTransportPolicy.value];else delete conf.iceTransportPolicy}if(conf.iceCandidatePoolSize){if(conf.iceCandidatePoolSize.hasValue)conf.iceCandidatePoolSize=conf.iceCandidatePoolSize.value;else delete conf.iceCandidatePoolSize}if(conf.bundlePolicy){if(conf.bundlePolicy.hasValue)conf.bundlePolicy=UWRTCBundlePolicy[conf.bundlePolicy.value];else delete conf.bundlePolicy}if(conf.enableDtlsSrtp){if(conf.enableDtlsSrtp.hasValue)conf.enableDtlsSrtp=conf.enableDtlsSrtp.value;else delete conf.enableDtlsSrtp}uwcom_debugLog("log","RTCPeerConnection.jslib","CreatePeerConnectionWithConfig",JSON.stringify(conf));var ptr=_CreatePeerConnection(conf);return ptr}function _CreateVideoTrack(srcPtr,dstPtr,width,height){var cnv=document.createElement("canvas");cnv.width=width;cnv.height=height;var ctx=cnv.getContext("2d");var imgData=ctx.createImageData(width,height);var stream=cnv.captureStream();var track=stream.getVideoTracks()[0];var srcTexture=GL.textures[srcPtr];var dstTexture=GL.textures[dstPtr];var frameBuffer=GLctx.createFramebuffer();GLctx.bindFramebuffer(GLctx.FRAMEBUFFER,frameBuffer);GLctx.framebufferTexture2D(GLctx.FRAMEBUFFER,GLctx.COLOR_ATTACHMENT0,GLctx.TEXTURE_2D,srcTexture,0);var canRead=GLctx.checkFramebufferStatus(GLctx.FRAMEBUFFER)===GLctx.FRAMEBUFFER_COMPLETE;GLctx.bindFramebuffer(GLctx.FRAMEBUFFER,null);var localVideoData={cnv:cnv,ctx:ctx,imgData:imgData,width:width,height:height,dstTexture:dstTexture,stream:stream,canRead:canRead,buffer:new Uint8Array(width*height*4),lineBuffer:new Uint8Array(width*4),frameBuffer:frameBuffer};uwcom_addManageObj(track);uwcom_localVideoTracks[track.managePtr]=localVideoData;return track.managePtr}function _DataChannelClose(dataChannelPtr){if(!uwcom_existsCheck(dataChannelPtr,"DataChannelClose","dataChannel"))return;var dataChannel=UWManaged[dataChannelPtr];dataChannel.close()}function _DataChannelRegisterOnClose(dataChannelPtr,DataChannelNativeOnClose){if(!uwcom_existsCheck(dataChannelPtr,"DataChannelRegisterOnClose","dataChannel"))return;uwevt_DCOnClose=DataChannelNativeOnClose}function _DataChannelRegisterOnMessage(dataChannelPtr,DataChannelNativeOnMessage){if(!uwcom_existsCheck(dataChannelPtr,"DataChannelRegisterOnMessage","dataChannel"))return;uwevt_DCOnBinaryMessage=DataChannelNativeOnMessage}function _DataChannelRegisterOnOpen(dataChannelPtr,DataChannelNativeOnOpen){if(!uwcom_existsCheck(dataChannelPtr,"DataChannelRegisterOnOpen","dataChannel"))return;uwevt_DCOnOpen=DataChannelNativeOnOpen}function _DataChannelRegisterOnTextMessage(dataChannelPtr,DataChannelNativeOnTextMessage){if(!uwcom_existsCheck(dataChannelPtr,"DataChannelRegisterOnTextMessage","dataChannel"))return;uwevt_DCOnTextMessage=DataChannelNativeOnTextMessage}function _DeleteIceCandidate(candidatePtr){if(!uwcom_existsCheck(candidatePtr,"DeleteIceCandidate","iceCandidate"))return;delete UWManaged[candidatePtr]}function _DeleteMediaStream(streamPtr){var stream=UWManaged[streamPtr];stream.getTracks().forEach((function(track){track.stop();stream.removeTrack(track);track=null}));stream=null;delete UWManaged[streamPtr]}function _DeleteReceiver(receiverPtr){if(!uwcom_existsCheck(receiverPtr,"DeleteReceiver","receiver"))return;delete UWManaged[receiverPtr]}function _DeleteSender(senderPtr){if(!uwcom_existsCheck(senderPtr,"DeleteSender","sender"))return;delete UWManaged[senderPtr]}function _DeleteTransceiver(transceiverPtr){if(!uwcom_existsCheck(transceiverPtr,"DeleteTransceiver","transceiver"))return;delete UWManaged[transceiverPtr]}function _GetHardwareEncoderSupport(){return true}function _IceCandidateGetCandidate(candPtr){if(!uwcom_existsCheck(candPtr,"IceCandidateGetCandidate","iceCandidate"))return;var candidate=UWManaged[candPtr];var ret={};ret.candidate=candidate.candidate;ret.component=UWRTCIceComponent.indexOf(candidate.component);ret.foundation=candidate.foundation;ret.ip=candidate.ip;ret.port=candidate.port;ret.priority=candidate.priority;ret.address=candidate.address;ret.protocol=candidate.protocol;ret.relatedAddress=candidate.relatedAddress;ret.sdpMid=candidate.sdpMid;ret.sdpMLineIndex=candidate.sdpMLineIndex;ret.tcpType=candidate.tcpType;ret.type=candidate.type;ret.usernameFragment=candidate.usernameFragment;var json=JSON.stringify(ret);return uwcom_strToPtr(json)}function _IceCandidateGetSdp(candidatePtr){if(!uwcom_existsCheck(candidatePtr,"IceCandidateGetSdp","iceCandidate"))return;candidate=UWManaged[candidatePtr];return uwcom_strToPtr(candidate.candidate)}function _IceCandidateGetSdpLineIndex(candidatePtr){if(!uwcom_existsCheck(candidatePtr,"IceCandidateGetSdpMid","iceCandidate"))return;return candidate.sdpMLineIndex}function _IceCandidateGetSdpMid(candidatePtr){if(!uwcom_existsCheck(candidatePtr,"IceCandidateGetSdpMid","iceCandidate"))return;return uwcom_strToPtr(candidate.sdpMid)}function _InitControllersArray(byteOffset){Module.ControllersArrayOffset=byteOffset/4}function _InitHandsArray(byteOffset){Module.HandsArrayOffset=byteOffset/4}function _InitViewerHitTestPoseArray(byteOffset){Module.ViewerHitTestPoseArrayOffset=byteOffset/4}function _InitXRSharedArray(byteOffset){Module.XRSharedArrayOffset=byteOffset/4;Module.WebXR.onUnityLoaded({detail:{state:"Ready",module:Module}})}function _JS_Cursor_SetImage(ptr,length){var binary="";for(var i=0;i<length;i++)binary+=String.fromCharCode(HEAPU8[ptr+i]);Module.canvas.style.cursor="url(data:image/cur;base64,"+btoa(binary)+"),default"}function _JS_Cursor_SetShow(show){Module.canvas.style.cursor=show?"default":"none"}function _JS_Eval_ClearInterval(id){window.clearInterval(id)}function _JS_Eval_SetInterval(func,arg,millis){Module["noExitRuntime"]=true;function wrapper(){getFuncWrapper(func,"vi")(arg)}return Browser.safeSetInterval(wrapper,millis)}var fs={numPendingSync:0,syncInternal:1e3,syncInProgress:false,sync:(function(onlyPendingSync){if(onlyPendingSync){if(fs.numPendingSync==0)return}else if(fs.syncInProgress){fs.numPendingSync++;return}fs.syncInProgress=true;FS.syncfs(false,(function(err){fs.syncInProgress=false}));fs.numPendingSync=0})};function _JS_FileSystem_Initialize(){Module.setInterval((function(){fs.sync(true)}),fs.syncInternal)}function _JS_FileSystem_Sync(){fs.sync(false)}function _JS_Log_Dump(ptr,type){var str=Pointer_stringify(ptr);if(typeof dump=="function")dump(str);switch(type){case 0:case 1:case 4:console.error(str);return;case 2:console.warn(str);return;case 3:case 5:console.log(str);return;default:console.error("Unknown console message type!");console.error(str)}}function _JS_Log_StackTrace(buffer,bufferSize){var trace=stackTrace();if(buffer)stringToUTF8(trace,buffer,bufferSize);return lengthBytesUTF8(trace)}var WEBAudio={audioInstances:[],audioContext:{},audioWebEnabled:0};function _JS_Sound_Create_Channel(callback,userData){if(WEBAudio.audioWebEnabled==0)return;var channel={gain:WEBAudio.audioContext.createGain(),panner:WEBAudio.audioContext.createPanner(),threeD:false,playBuffer:(function(delay,buffer,offset){this.source.buffer=buffer;var chan=this;this.source.onended=(function(){if(callback)dynCall("vi",callback,[userData]);chan.setup()});this.source.start(delay,offset)}),setup:(function(){this.source=WEBAudio.audioContext.createBufferSource();this.setupPanning()}),setupPanning:(function(){if(this.threeD){this.source.disconnect();this.source.connect(this.panner);this.panner.connect(this.gain)}else{this.panner.disconnect();this.source.connect(this.gain)}})};channel.panner.rolloffFactor=0;channel.gain.connect(WEBAudio.audioContext.destination);channel.setup();return WEBAudio.audioInstances.push(channel)-1}function _JS_Sound_GetLength(bufferInstance){if(WEBAudio.audioWebEnabled==0)return 0;var sound=WEBAudio.audioInstances[bufferInstance];var sampleRateRatio=44100/sound.buffer.sampleRate;return sound.buffer.length*sampleRateRatio}function _JS_Sound_GetLoadState(bufferInstance){if(WEBAudio.audioWebEnabled==0)return 2;var sound=WEBAudio.audioInstances[bufferInstance];if(sound.error)return 2;if(sound.buffer)return 0;return 1}function _JS_Sound_Init(){try{window.AudioContext=window.AudioContext||window.webkitAudioContext;WEBAudio.audioContext=new AudioContext;var tryToResumeAudioContext=(function(){if(WEBAudio.audioContext.state==="suspended")WEBAudio.audioContext.resume();else Module.clearInterval(resumeInterval)});var resumeInterval=Module.setInterval(tryToResumeAudioContext,400);WEBAudio.audioWebEnabled=1}catch(e){alert("Web Audio API is not supported in this browser")}}function _JS_Sound_Load(ptr,length){if(WEBAudio.audioWebEnabled==0)return 0;var sound={buffer:null,error:false};var instance=WEBAudio.audioInstances.push(sound)-1;var audioData=HEAPU8.buffer.slice(ptr,ptr+length);WEBAudio.audioContext.decodeAudioData(audioData,(function(buffer){sound.buffer=buffer}),(function(){sound.error=true;console.log("Decode error.")}));return instance}function _JS_Sound_Load_PCM(channels,length,sampleRate,ptr){if(WEBAudio.audioWebEnabled==0)return 0;var sound={buffer:WEBAudio.audioContext.createBuffer(channels,length,sampleRate),error:false};for(var i=0;i<channels;i++){var offs=(ptr>>2)+length*i;var buffer=sound.buffer;var copyToChannel=buffer["copyToChannel"]||(function(source,channelNumber,startInChannel){var clipped=source.subarray(0,Math.min(source.length,this.length-(startInChannel|0)));this.getChannelData(channelNumber|0).set(clipped,startInChannel|0)});copyToChannel.apply(buffer,[HEAPF32.subarray(offs,offs+length),i,0])}var instance=WEBAudio.audioInstances.push(sound)-1;return instance}function _JS_Sound_Play(bufferInstance,channelInstance,offset,delay){_JS_Sound_Stop(channelInstance,0);if(WEBAudio.audioWebEnabled==0)return;var sound=WEBAudio.audioInstances[bufferInstance];var channel=WEBAudio.audioInstances[channelInstance];if(sound.buffer){try{channel.playBuffer(WEBAudio.audioContext.currentTime+delay,sound.buffer,offset)}catch(e){console.error("playBuffer error. Exception: "+e)}}else console.log("Trying to play sound which is not loaded.")}function _JS_Sound_ReleaseInstance(instance){WEBAudio.audioInstances[instance]=null}function _JS_Sound_ResumeIfNeeded(){if(WEBAudio.audioWebEnabled==0)return;if(WEBAudio.audioContext.state==="suspended")WEBAudio.audioContext.resume()}function _JS_Sound_Set3D(channelInstance,threeD){var channel=WEBAudio.audioInstances[channelInstance];if(channel.threeD!=threeD){channel.threeD=threeD;channel.setupPanning()}}function _JS_Sound_SetListenerOrientation(x,y,z,xUp,yUp,zUp){if(WEBAudio.audioWebEnabled==0)return;if(WEBAudio.audioContext.listener.forwardX){WEBAudio.audioContext.listener.forwardX.setValueAtTime(-x,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.forwardY.setValueAtTime(-y,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.forwardZ.setValueAtTime(-z,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.upX.setValueAtTime(xUp,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.upY.setValueAtTime(yUp,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.upZ.setValueAtTime(zUp,WEBAudio.audioContext.currentTime)}else{WEBAudio.audioContext.listener.setOrientation(-x,-y,-z,xUp,yUp,zUp)}}function _JS_Sound_SetListenerPosition(x,y,z){if(WEBAudio.audioWebEnabled==0)return;if(WEBAudio.audioContext.listener.positionX){WEBAudio.audioContext.listener.positionX.setValueAtTime(x,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.positionY.setValueAtTime(y,WEBAudio.audioContext.currentTime);WEBAudio.audioContext.listener.positionZ.setValueAtTime(z,WEBAudio.audioContext.currentTime)}else{WEBAudio.audioContext.listener.setPosition(x,y,z)}}function _JS_Sound_SetLoop(channelInstance,loop){if(WEBAudio.audioWebEnabled==0)return;WEBAudio.audioInstances[channelInstance].source.loop=loop}function _JS_Sound_SetLoopPoints(channelInstance,loopStart,loopEnd){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];channel.source.loopStart=loopStart;channel.source.loopEnd=loopEnd}function _JS_Sound_SetPitch(channelInstance,v){if(WEBAudio.audioWebEnabled==0)return;try{WEBAudio.audioInstances[channelInstance].source.playbackRate.setValueAtTime(v,WEBAudio.audioContext.currentTime)}catch(e){console.error("Invalid audio pitch "+v+" specified to WebAudio backend!")}}function _JS_Sound_SetPosition(channelInstance,x,y,z){if(WEBAudio.audioWebEnabled==0)return;WEBAudio.audioInstances[channelInstance].panner.setPosition(x,y,z)}function _JS_Sound_SetVolume(channelInstance,v){if(WEBAudio.audioWebEnabled==0)return;try{WEBAudio.audioInstances[channelInstance].gain.gain.setValueAtTime(v,WEBAudio.audioContext.currentTime)}catch(e){console.error("Invalid audio volume "+v+" specified to WebAudio backend!")}}function _JS_Sound_Stop(channelInstance,delay){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];if(channel.source.buffer){try{channel.source.stop(WEBAudio.audioContext.currentTime+delay)}catch(e){channel.source.disconnect()}if(delay==0){channel.source.onended=(function(){});channel.setup()}}}function _JS_SystemInfo_GetBrowserName(buffer,bufferSize){var browser=Module.SystemInfo.browser;if(buffer)stringToUTF8(browser,buffer,bufferSize);return lengthBytesUTF8(browser)}function _JS_SystemInfo_GetBrowserVersionString(buffer,bufferSize){var browserVer=Module.SystemInfo.browserVersion;if(buffer)stringToUTF8(browserVer,buffer,bufferSize);return lengthBytesUTF8(browserVer)}function _JS_SystemInfo_GetCanvasClientSize(domElementSelector,outWidth,outHeight){var selector=UTF8ToString(domElementSelector);var canvas=selector=="#canvas"?Module["canvas"]:document.querySelector(selector);if(Module.WebXR&&Module.WebXR.isInXR){HEAPF64[outWidth>>3]=canvas?canvas.width:0;HEAPF64[outHeight>>3]=canvas?canvas.height:0;return}HEAPF64[outWidth>>3]=canvas?canvas.clientWidth:0;HEAPF64[outHeight>>3]=canvas?canvas.clientHeight:0}function _JS_SystemInfo_GetDocumentURL(buffer,bufferSize){if(buffer)stringToUTF8(document.URL,buffer,bufferSize);return lengthBytesUTF8(document.URL)}function _JS_SystemInfo_GetGPUInfo(buffer,bufferSize){var gpuinfo=Module.SystemInfo.gpu;if(buffer)stringToUTF8(gpuinfo,buffer,bufferSize);return lengthBytesUTF8(gpuinfo)}function _JS_SystemInfo_GetLanguage(buffer,bufferSize){var language=Module.SystemInfo.language;if(buffer)stringToUTF8(language,buffer,bufferSize);return lengthBytesUTF8(language)}function _JS_SystemInfo_GetMatchWebGLToCanvasSize(){return Module.matchWebGLToCanvasSize||Module.matchWebGLToCanvasSize===undefined}function _JS_SystemInfo_GetMemory(){return TOTAL_MEMORY/(1024*1024)}function _JS_SystemInfo_GetOS(buffer,bufferSize){var browser=Module.SystemInfo.os+" "+Module.SystemInfo.osVersion;if(buffer)stringToUTF8(browser,buffer,bufferSize);return lengthBytesUTF8(browser)}function _JS_SystemInfo_GetPreferredDevicePixelRatio(){if(Module.WebXR&&Module.WebXR.isInXR){return 1}return Module.devicePixelRatio||window.devicePixelRatio||1}function _JS_SystemInfo_GetScreenSize(outWidth,outHeight){HEAPF64[outWidth>>3]=Module.SystemInfo.width;HEAPF64[outHeight>>3]=Module.SystemInfo.height}function _JS_SystemInfo_HasCursorLock(){return Module.SystemInfo.hasCursorLock}function _JS_SystemInfo_HasFullscreen(){return Module.SystemInfo.hasFullscreen}function _JS_SystemInfo_HasWebGL(){return Module.SystemInfo.hasWebGL}var wr={requestInstances:{},nextRequestId:1};function _JS_WebRequest_Abort(request){wr.requestInstances[request].abort()}function _JS_WebRequest_Create(url,method){var _url=Pointer_stringify(url);var _method=Pointer_stringify(method);var http=Module.companyName&&Module.productName&&Module.XMLHttpRequest?new Module.XMLHttpRequest({companyName:Module.companyName,productName:Module.productName,cacheControl:Module.cacheControl(_url)}):new XMLHttpRequest;http.open(_method,_url,true);http.responseType="arraybuffer";wr.requestInstances[wr.nextRequestId]=http;return wr.nextRequestId++}function _JS_WebRequest_GetResponseHeaders(request,buffer,bufferSize){var headers=wr.requestInstances[request].getAllResponseHeaders();if(buffer)stringToUTF8(headers,buffer,bufferSize);return lengthBytesUTF8(headers)}function _JS_WebRequest_Release(request){var http=wr.requestInstances[request];http.onload=null;http.onerror=null;http.ontimeout=null;http.onabort=null;delete http;wr.requestInstances[request]=null}function _JS_WebRequest_Send(request,ptr,length){var http=wr.requestInstances[request];try{if(length>0){var postData=HEAPU8.subarray(ptr,ptr+length);http.send(postData)}else http.send()}catch(e){console.error(e.name+": "+e.message)}}function _JS_WebRequest_SetProgressHandler(request,arg,onprogress){var http=wr.requestInstances[request];http.onprogress=function http_onprogress(e){if(onprogress){if(e.lengthComputable)dynCall("viii",onprogress,[arg,e.loaded,e.total])}}}function _JS_WebRequest_SetRequestHeader(request,header,value){var _header=Pointer_stringify(header);var _value=Pointer_stringify(value);wr.requestInstances[request].setRequestHeader(_header,_value)}function _JS_WebRequest_SetResponseHandler(request,arg,onresponse){var http=wr.requestInstances[request];http.onload=function http_onload(e){if(onresponse){var kWebRequestOK=0;var byteArray=new Uint8Array(http.response);if(byteArray.length!=0){var buffer=_malloc(byteArray.length);HEAPU8.set(byteArray,buffer);dynCall("viiiiii",onresponse,[arg,http.status,buffer,byteArray.length,0,kWebRequestOK])}else{dynCall("viiiiii",onresponse,[arg,http.status,0,0,0,kWebRequestOK])}}};function HandleError(err,code){if(onresponse){var len=lengthBytesUTF8(err)+1;var buffer=_malloc(len);stringToUTF8(err,buffer,len);dynCall("viiiiii",onresponse,[arg,http.status,0,0,buffer,code]);_free(buffer)}}http.onerror=function http_onerror(e){var kWebErrorUnknown=2;HandleError("Unknown error.",kWebErrorUnknown)};http.ontimeout=function http_onerror(e){var kWebErrorTimeout=14;HandleError("Connection timed out.",kWebErrorTimeout)};http.onabort=function http_onerror(e){var kWebErrorAborted=17;HandleError("Aborted.",kWebErrorAborted)}}function _JS_WebRequest_SetTimeout(request,timeout){wr.requestInstances[request].timeout=timeout}function _MediaStreamAddTrack(streamPtr,trackPtr){if(!uwcom_existsCheck(streamPtr,"MediaStreamAddTrack","stream"))return;if(!uwcom_existsCheck(trackPtr,"MediaStreamAddTrack","track"))return;var stream=UWManaged[streamPtr];var track=UWManaged[trackPtr];try{stream.addTrack(track);Module.dynCall_vii(uwevt_MSOnAddTrack,stream.managePtr,track.managePtr);return true}catch(err){return false}}function _MediaStreamRegisterOnAddTrack(contextPtr,streamPtr,MediaStreamOnAddTrack){if(!uwcom_existsCheck(contextPtr,"MediaStreamRegisterOnAddTrack","context"))return;if(!uwcom_existsCheck(streamPtr,"MediaStreamRegisterOnAddTrack","stream"))return;uwevt_MSOnAddTrack=MediaStreamOnAddTrack}function _MediaStreamRegisterOnRemoveTrack(contextPtr,streamPtr,MediaStreamOnRemoveTrack){if(!uwcom_existsCheck(contextPtr,"MediaStreamRegisterOnRemoveTrack","context"))return;if(!uwcom_existsCheck(streamPtr,"MediaStreamRegisterOnRemoveTrack","stream"))return;uwevt_MSOnRemoveTrack=MediaStreamOnRemoveTrack}function _MediaStreamTrackGetID(trackPtr){if(!uwcom_existsCheck(trackPtr,"MediaStreamTrackGetID","track"))return;var track=UWManaged[trackPtr];var id=track.guid||track.id;var idPtr=uwcom_strToPtr(id);return idPtr}function _MediaStreamTrackGetKind(trackPtr){if(!uwcom_existsCheck(trackPtr,"MediaStreamTrackGetKind","track"))return;var track=UWManaged[trackPtr];return UWMediaStreamTrackKind.indexOf(track.kind)}function _PeerConnectionAddIceCandidate(peerPtr,candidatePtr){if(!uwcom_existsCheck(peerPtr,"PeerConnectionAddIceCandidate","peer"))return;if(!uwcom_existsCheck(candidatePtr,"PeerConnectionAddIceCandidate","candidate"))return;var peer=UWManaged[peerPtr];var candidate=UWManaged[candidatePtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionAddIceCandidate",peer.label+":"+JSON.stringify(candidate));setTimeout((function(){peer.addIceCandidate(candidate).then((function(){})).catch((function(err){console.error(err.message,peerPtr)}))}),1e3);return true}function _PeerConnectionClose(peerPtr){if(!uwcom_existsCheck(peerPtr,"PeerConnectionClose","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionClose",peer.label);peer.close()}function _PeerConnectionCreateAnswer(peerPtr,optionsPtr){if(!uwcom_existsCheck(peerPtr,"PeerConnectionCreateAnswer","peer"))return;var peer=UWManaged[peerPtr];var options=UTF8ToString(optionsPtr);var options=JSON.parse(options);peer.createAnswer(options).then((function(answer){uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionCreateAnswer",peer.label+":"+JSON.stringify(options)+":"+answer.type);uwcom_addManageObj(answer);var sdpPtr=uwcom_strToPtr(answer.sdp);Module.dynCall_viii(uwevt_OnSuccessCreateSessionDesc,peerPtr,2,sdpPtr)})).catch((function(err){uwcom_debugLog("error","RTCPeerConnection.jslib","PeerConnectionCreateAnswer",peer.label+":"+err.message);var errorNo=uwcom_errorNo(err);var errMsgPtr=uwcom_strToPtr(err.message);Module.dynCall_viii(uwevt_OnFailureCreateSessionDesc,peerPtr,errorNo,errMsgPtr)}))}function _PeerConnectionGetTransceivers(contextPtr,peerPtr){if(!uwcom_existsCheck(contextPtr,"PeerConnectionGetTransceivers","context"))return;if(!uwcom_existsCheck(peerPtr,"PeerConnectionGetTransceivers","peer"))return;var peer=UWManaged[peerPtr];var transceivers=peer.getTransceivers();uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionGetTransceivers",peer.label+": transceivers="+transceivers.length);var ptrs=[];transceivers.forEach((function(transceiver){uwcom_addManageObj(transceiver);ptrs.push(transceiver.managePtr)}));var ptr=uwcom_arrayToReturnPtr(ptrs,Int32Array);return ptr}function _PeerConnectionRegisterCallbackCollectStats(peerPtr,OnStatsDeliveredCallback){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterCallbackCollectStats","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterCallbackCollectStats",peer.label);uwevt_OnStatsDeliveredCallback=OnStatsDeliveredCallback}function _PeerConnectionRegisterCallbackCreateSD(peerPtr,OnSuccessCreateSessionDesc,OnFailureCreateSessionDesc){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterCallbackCreateSD","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterCallbackCreateSD",peer.label);uwevt_OnSuccessCreateSessionDesc=OnSuccessCreateSessionDesc;uwevt_OnFailureCreateSessionDesc=OnFailureCreateSessionDesc}function _PeerConnectionRegisterConnectionStateChange(peerPtr,PCOnConnectionStateChange){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterConnectionStateChange","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterConnectionStateChange",peer.label);uwevt_PCOnConnectionStateChange=PCOnConnectionStateChange}function _PeerConnectionRegisterIceConnectionChange(peerPtr,PCOnIceConnectionChange){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterIceConnectionChange","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterIceConnectionChange",peer.label);uwevt_PCOnIceConnectionChange=PCOnIceConnectionChange}function _PeerConnectionRegisterIceGatheringChange(peerPtr,PCOnIceGatheringChange){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterIceGatheringChange","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterIceGatheringChange",peer.label);uwevt_PCOnIceGatheringChange=PCOnIceGatheringChange}function _PeerConnectionRegisterOnDataChannel(peerPtr,PCOnDataChannel){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnDataChannel","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterOnDataChannel",peer.label);uwevt_PCOnDataChannel=PCOnDataChannel}function _PeerConnectionRegisterOnIceCandidate(peerPtr,PCOnIceCandidate){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnIceCandidate","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterOnIceCandidate",peer.label);uwevt_PCOnIceCandidate=PCOnIceCandidate}function _PeerConnectionRegisterOnRemoveTrack(peerPtr,PCOnRemoveTrack){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnRemoveTrack","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterOnRemoveTrack",peer.label);uwevt_PCOnRemoveTrack=PCOnRemoveTrack}function _PeerConnectionRegisterOnRenegotiationNeeded(peerPtr,PCOnNegotiationNeeded){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnRenegotiationNeeded","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterOnRenegotiationNeeded",peer.label);uwevt_PCOnNegotiationNeeded=PCOnNegotiationNeeded}function _PeerConnectionRegisterOnSetSessionDescFailure(contextPtr,peerPtr,OnSetSessionDescFailure){if(!uwcom_existsCheck(contextPtr,"PeerConnectionRegisterOnSetSessionDescFailure","context"))return;if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnSetSessionDescFailure","peer"))return;uwevt_OnSetSessionDescFailure=OnSetSessionDescFailure}function _PeerConnectionRegisterOnSetSessionDescSuccess(contextPtr,peerPtr,OnSetSessionDescSuccess){if(!uwcom_existsCheck(contextPtr,"PeerConnectionRegisterOnSetSessionDescSuccess","context"))return;if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnSetSessionDescSuccess","peer"))return;uwevt_OnSetSessionDescSuccess=OnSetSessionDescSuccess}function _PeerConnectionRegisterOnTrack(peerPtr,PCOnTrack){if(!uwcom_existsCheck(peerPtr,"PeerConnectionRegisterOnTrack","peer"))return;var peer=UWManaged[peerPtr];uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionRegisterOnTrack",peer.label);uwevt_PCOnTrack=PCOnTrack}function _PeerConnectionSetDescription(peerPtr,typeIdx,sdpPtr,side){var peer=UWManaged[peerPtr];var type=UWRTCSdpType[typeIdx];var sdp=UTF8ToString(sdpPtr);peer["set"+side+"Description"]({type:type,sdp:sdp}).then((function(){uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionSetDescription",peer.label+":"+side+":"+type+":");Module.dynCall_vi(uwevt_OnSetSessionDescSuccess,peer.managePtr)})).catch((function(err){uwcom_debugLog("error","RTCPeerConnection.jslib","PeerConnectionSetDescription",peer.label+":"+side+":"+err.message);var errorNo=uwcom_errorNo(err);var errMsgPtr=uwcom_strToPtr(err.message);Module.dynCall_viii(uwevt_OnSetSessionDescFailure,peer.managePtr,errorNo,errMsgPtr)}));return uwcom_arrayToReturnPtr([UWRTCErrorType.indexOf("None"),uwcom_strToPtr("no error")],Int32Array)}function _PeerConnectionSetDescriptionWithoutDescription(peerPtr){var peer=UWManaged[peerPtr];peer.setLocalDescription().then((function(){uwcom_debugLog("log","RTCPeerConnection.jslib","PeerConnectionSetDescription",peer.label);Module.dynCall_vi(uwevt_OnSetSessionDescSuccess,peer.managePtr)})).catch((function(err){uwcom_debugLog("error","RTCPeerConnection.jslib","PeerConnectionSetDescription",peer.label+":"+err.message);var errorNo=uwcom_errorNo(err);var errMsgPtr=uwcom_strToPtr(err.message);Module.dynCall_viii(uwevt_OnSetSessionDescFailure,peer.managePtr,errorNo,errMsgPtr)}));return uwcom_arrayToReturnPtr([UWRTCErrorType.indexOf("None"),uwcom_strToPtr("no error")],Int32Array)}function _PeerConnectionSetLocalDescription(contextPtr,peerPtr,typeIdx,sdpPtr){if(!uwcom_existsCheck(contextPtr,"PeerConnectionSetLocalDescription","context"))return 11;if(!uwcom_existsCheck(peerPtr,"PeerConnectionSetLocalDescription","peer"))return 11;return _PeerConnectionSetDescription(peerPtr,typeIdx,sdpPtr,"Local")}function _PeerConnectionSetRemoteDescription(contextPtr,peerPtr,typeIdx,sdpPtr){if(!uwcom_existsCheck(contextPtr,"PeerConnectionSetRemoteDescription","context"))return 11;if(!uwcom_existsCheck(peerPtr,"PeerConnectionSetRemoteDescription","peer"))return 11;return _PeerConnectionSetDescription(peerPtr,typeIdx,sdpPtr,"Remote")}function _ProcessAudio(data,size){}function _ReceiverGetTrack(receiverPtr){if(!uwcom_existsCheck(receiverPtr,"ReceiverGetTrack","receiver"))return;var receiver=UWManaged[receiverPtr];uwcom_addManageObj(receiver.track);return receiver.track.managePtr}function uwcom_existsCheck(ptr,funcName,typeName){var obj=UWManaged[ptr];if(obj)return true;console.error("[jslib] "+funcName+": Unmanaged "+typeName+". Ptr: "+ptr);return false}function uwcom_statsSerialize(stats){var statsJsons=[];stats.forEach((function(stat){if(uwcom_fixStatEnumValue(stat))statsJsons.push(stat)}));var statsDataJson=JSON.stringify(statsJsons);var statsDataJsonPtr=uwcom_strToPtr(statsDataJson);return statsDataJsonPtr}function uwcom_fixStatEnumValue(stat){if(stat.type==="codec"){if(stat.codecType){stat.codecType=UWRTCCodecType.indexOf(stat.codecType);if(stat.codecType===-1)return false}}if(stat.type==="outbound-rtp"){if(stat.qualityLimitationReason){stat.qualityLimitationReason=UWRTCQualityLimitationReason.indexOf(stat.qualityLimitationReason);if(stat.qualityLimitationReason===-1)return false}if(stat.priority){stat.priority=UWRTCPriorityType.indexOf(stat.priority);if(stat.priority===-1)return false}}if(stat.type==="media-source"){if(stat.kind){stat.kind=UWMediaStreamTrackKind.indexOf(stat.kind);if(stat.kind===-1)return false}}if(stat.type==="data-channel"){if(stat.state){stat.state=UWRTCDataChannelState.indexOf(stat.state);if(stat.state===-1)return false}}if(stat.type==="transport"){if(stat.iceRole){stat.iceRole=UWRTCIceRole.indexOf(stat.iceRole);if(stat.iceRole===-1)return false}if(stat.dtlsState){stat.dtlsState=UWRTCDtlsTransportState.indexOf(stat.dtlsState);if(stat.dtlsState===-1)return false}if(stat.iceState){stat.iceState=UWRTCIceTransportState.indexOf(stat.iceState);if(stat.iceState===-1)return false}}if(stat.type==="local-candidate"||stat.type==="remote-candidate"){if(stat.candidateType){stat.candidateType=UWRTCIceCandidateType.indexOf(stat.candidateType);if(stat.candidateType===-1)return false}}if(stat.type==="candidate-pair"){if(stat.state){stat.state=UWRTCStatsIceCandidatePairState.indexOf(stat.state);if(stat.state===-1)return false}}stat.type=UWRTCStatsType.indexOf(stat.type);return true}function uwcom_errorNo(err){var errNo=UWRTCErrorType.indexOf(err.name);if(errNo===-1)errNo=0;return errNo}function uwcom_arrayToReturnPtr(arr,type){var buf=(new type(arr)).buffer;var ui8a=new Uint8Array(buf);var ptr=_malloc(ui8a.byteLength+4);HEAP32.set([arr.length],ptr>>2);HEAPU8.set(ui8a,ptr+4);setTimeout((function(){_free(ptr)}),0);return ptr}function uwcom_strToPtr(str){var len=lengthBytesUTF8(str)+1;var ptr=_malloc(len);stringToUTF8(str,ptr,len);return ptr}function uwcom_addManageObj(obj){if(!obj.managePtr){uwcom_managePtr++;obj.managePtr=uwcom_managePtr;UWManaged[obj.managePtr]=obj}else if(!UWManaged[obj.managePtr]){UWManaged[obj.managePtr]=obj}}var uwevt_OnStatsDeliveredCallback=null;var uwevt_OnFailureCreateSessionDesc=null;var uwevt_OnSuccessCreateSessionDesc=null;var uwevt_OnSetSessionDescFailure=null;var uwevt_OnSetSessionDescSuccess=null;var uwevt_DCOnClose=null;var uwevt_DCOnOpen=null;var uwevt_DCOnBinaryMessage=null;var uwevt_DCOnTextMessage=null;var uwevt_MSOnRemoveTrack=null;var uwevt_MSOnAddTrack=null;var uwevt_PCOnRemoveTrack=null;var uwevt_PCOnTrack=null;var uwevt_PCOnDataChannel=null;var uwevt_PCOnNegotiationNeeded=null;var uwevt_PCOnIceGatheringChange=null;var uwevt_PCOnConnectionStateChange=null;var uwevt_PCOnIceConnectionChange=null;var uwevt_PCOnIceCandidate=null;var uwevt_DebugLog=null;var UWManaged={};var uwcom_audioContext=null;var uwcom_remoteVideoTracks={};var uwcom_remoteAudioTracks={};var uwcom_localVideoTracks={};var uwcom_managePtr=0;function uwcom_debugLog(level,fileName,member,msg){if(!level)return;var levelNo=["","","","","","","","error","warning","log"].indexOf(level);if(levelNo===-1)return;if(uwcom_logLevel>0&&uwcom_logLevel<=3&&levelNo>0&&levelNo-6<=uwcom_logLevel||uwcom_logLevel>6&&uwcom_logLevel<=9&&levelNo>6&&levelNo<=uwcom_logLevel){msg="[JSLIB] "+fileName+" : "+member+" : "+msg;var levelPtr=uwcom_strToPtr(level);var msgPtr=uwcom_strToPtr(msg);Module.dynCall_vii(uwevt_DebugLog,level,msgPtr);_free(levelPtr);_free(msgPtr)}}var uwcom_logLevel=0;function _RegisterDebugLog(level,debugLogPtr){uwcom_logLevel=level;uwevt_DebugLog=debugLogPtr}function readPixelsAsync(data){var w=data.width;var h=data.height;var buffer=data.buffer;var lineBuffer=data.lineBuffer;var frameBuffer=data.frameBuffer;var imgData=data.imgData;var cnv=data.cnv;var ctx=data.ctx;var dstTexture=data.dstTexture;var buf=GLctx.createBuffer();GLctx.bindTexture(GLctx.TEXTURE_2D,dstTexture);GLctx.texImage2D(GLctx.TEXTURE_2D,0,GLctx.RGBA,GLctx.RGBA,GLctx.UNSIGNED_BYTE,cnv);GLctx.bindBuffer(GLctx.PIXEL_PACK_BUFFER,buf);GLctx.bufferData(GLctx.PIXEL_PACK_BUFFER,buffer.byteLength,GLctx.STREAM_READ);GLctx.readPixels(0,0,w,h,GLctx.RGBA,GLctx.UNSIGNED_BYTE,0);GLctx.bindBuffer(GLctx.PIXEL_PACK_BUFFER,null);var sync=GLctx.fenceSync(GLctx.SYNC_GPU_COMMANDS_COMPLETE,0);if(!sync){return null}GLctx.flush();return clientWaitAsync(sync,0,10).then((function(){GLctx.deleteSync(sync);GLctx.bindBuffer(GLctx.PIXEL_PACK_BUFFER,buf);GLctx.getBufferSubData(GLctx.PIXEL_PACK_BUFFER,0,buffer);GLctx.bindBuffer(GLctx.PIXEL_PACK_BUFFER,null);GLctx.deleteBuffer(buf);imgData.data.set(buffer);ctx.putImageData(imgData,0,0);GLctx.bindTexture(GLctx.TEXTURE_2D,dstTexture);GLctx.texImage2D(GLctx.TEXTURE_2D,0,GLctx.RGBA,GLctx.RGBA,GLctx.UNSIGNED_BYTE,cnv);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_MAG_FILTER,GLctx.LINEAR);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_MIN_FILTER,GLctx.LINEAR);GLctx.generateMipmap(GLctx.TEXTURE_2D);GLctx.bindTexture(GLctx.TEXTURE_2D,null)}))}function clientWaitAsync(sync,flags,interval_ms){return new Promise((function(resolve,reject){var check=(function(){var res=GLctx.clientWaitSync(sync,flags,0);if(res===GLctx.WAIT_FAILED){reject();return}if(res===GLctx.TIMEOUT_EXPIRED){setTimeout(check,interval_ms);return}resolve()});check()}))}function _RenderLocalVideotrack(trackPtr,needFlip){var data=uwcom_localVideoTracks[trackPtr];if(!data)return;var w=data.width;var h=data.height;var buffer=data.buffer;var lineBuffer=data.lineBuffer;var frameBuffer=data.frameBuffer;var imgData=data.imgData;var cnv=data.cnv;var ctx=data.ctx;var dstTexture=data.dstTexture;if(data.canRead){GLctx.bindFramebuffer(GLctx.FRAMEBUFFER,frameBuffer);GLctx.readPixels(0,0,w,h,GLctx.RGBA,GLctx.UNSIGNED_BYTE,buffer);GLctx.bindFramebuffer(GLctx.FRAMEBUFFER,null);imgData.data.set(buffer);ctx.putImageData(imgData,0,0);ctx.globalCompositeOperation="copy";ctx.scale(1,-1);ctx.translate(0,-imgData.height);ctx.drawImage(cnv,0,0);ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation="source-over";GLctx.bindTexture(GLctx.TEXTURE_2D,dstTexture);GLctx.texImage2D(GLctx.TEXTURE_2D,0,GLctx.RGBA,GLctx.RGBA,GLctx.UNSIGNED_BYTE,cnv);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_MAG_FILTER,GLctx.LINEAR);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_MIN_FILTER,GLctx.LINEAR);GLctx.generateMipmap(GLctx.TEXTURE_2D);GLctx.bindTexture(GLctx.TEXTURE_2D,null)}}function _SetWebXREvents(onStartARPtr,onStartVRPtr,onVisibilityChangePtr,onEndXRPtr,onXRCapabilitiesPtr,onInputProfilesPtr){Module.WebXR.onStartARPtr=onStartARPtr;Module.WebXR.onStartVRPtr=onStartVRPtr;Module.WebXR.onVisibilityChangePtr=onVisibilityChangePtr;Module.WebXR.onEndXRPtr=onEndXRPtr;Module.WebXR.onXRCapabilitiesPtr=onXRCapabilitiesPtr;Module.WebXR.onInputProfilesPtr=onInputProfilesPtr}function _SetWebXRSettings(strJson){Module.WebXR.Settings=JSON.parse(UTF8ToString(strJson));console.log(Module.WebXR.Settings)}function _ToggleAR(){Module.WebXR.toggleAR()}function _ToggleVR(){Module.WebXR.toggleVR()}function _ToggleViewerHitTest(){Module.WebXR.toggleHitTest()}function _TransceiverGetReceiver(transceiverPtr){if(!uwcom_existsCheck(transceiverPtr,"TransceiverGetReceiver","transceiver"))return;var transceiver=UWManaged[transceiverPtr];uwcom_addManageObj(transceiver.receiver);return transceiver.receiver.managePtr}function _TransceiverGetSender(transceiverPtr){if(!uwcom_existsCheck(transceiverPtr,"TransceiverGetSender","transceiver"))return;var transceiver=UWManaged[transceiverPtr];uwcom_addManageObj(transceiver.sender);return transceiver.sender.managePtr}function _TransceiverStop(transceiverPtr){if(!uwcom_existsCheck(transceiverPtr,"TransceiverStop","transceiver"))return;try{var transceiver=UWManaged[transceiverPtr];transceiver.stop();return true}catch(err){return false}}function _UnityWebRTCInit(logLevel){}function _UpdateRendererTexture(trackPtr,renderTexturePtr,needFlip){if(!uwcom_existsCheck(trackPtr,"UpdateRendererTexture","track"))return;if(!uwcom_remoteVideoTracks[trackPtr])return;var video=uwcom_remoteVideoTracks[trackPtr].video;var tex=GL.textures[renderTexturePtr];GLctx.bindTexture(GLctx.TEXTURE_2D,tex);if(!!needFlip){}GLctx.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);GLctx.texImage2D(GLctx.TEXTURE_2D,0,GLctx.RGBA,GLctx.RGBA,GLctx.UNSIGNED_BYTE,video);GLctx.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_MAG_FILTER,GLctx.LINEAR);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_MIN_FILTER,GLctx.LINEAR);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_WRAP_S,GLctx.CLAMP_TO_EDGE);GLctx.texParameteri(GLctx.TEXTURE_2D,GLctx.TEXTURE_WRAP_T,GLctx.CLAMP_TO_EDGE);GLctx.bindTexture(GLctx.TEXTURE_2D,null)}var webSocketState={instances:{},lastId:0,onOpen:null,onMesssage:null,onError:null,onClose:null,debug:false};function _WebSocketAllocate(url){var urlStr=UTF8ToString(url);var id=webSocketState.lastId++;webSocketState.instances[id]={subprotocols:[],url:urlStr,ws:null};return id}function _WebSocketClose(instanceId,code,reasonPtr){var instance=webSocketState.instances[instanceId];if(!instance)return-1;if(!instance.ws)return-3;if(instance.ws.readyState===2)return-4;if(instance.ws.readyState===3)return-5;var reason=reasonPtr?UTF8ToString(reasonPtr):undefined;try{instance.ws.close(code,reason)}catch(err){return-7}return 0}function _WebSocketConnect(instanceId){var instance=webSocketState.instances[instanceId];if(!instance)return-1;if(instance.ws!==null)return-2;instance.ws=new WebSocket(instance.url,instance.subprotocols);instance.ws.binaryType="arraybuffer";instance.ws.onopen=(function(){if(webSocketState.debug)console.log("[JSLIB WebSocket] Connected.");if(webSocketState.onOpen)Module.dynCall_vi(webSocketState.onOpen,instanceId)});instance.ws.onmessage=(function(ev){if(webSocketState.debug)console.log("[JSLIB WebSocket] Received message:",ev.data);if(webSocketState.onMessage===null)return;if(ev.data instanceof ArrayBuffer){var dataBuffer=new Uint8Array(ev.data);var buffer=_malloc(dataBuffer.length);HEAPU8.set(dataBuffer,buffer);try{Module.dynCall_viii(webSocketState.onMessage,instanceId,buffer,dataBuffer.length)}finally{_free(buffer)}}else{var dataBuffer=(new TextEncoder).encode(ev.data);var buffer=_malloc(dataBuffer.length);HEAPU8.set(dataBuffer,buffer);try{Module.dynCall_viii(webSocketState.onMessage,instanceId,buffer,dataBuffer.length)}finally{_free(buffer)}}});instance.ws.onerror=(function(ev){if(webSocketState.debug)console.log("[JSLIB WebSocket] Error occured.");if(webSocketState.onError){var msg="WebSocket error.";var length=lengthBytesUTF8(msg)+1;var buffer=_malloc(length);stringToUTF8(msg,buffer,length);try{Module.dynCall_vii(webSocketState.onError,instanceId,buffer)}finally{_free(buffer)}}});instance.ws.onclose=(function(ev){if(webSocketState.debug)console.log("[JSLIB WebSocket] Closed.");if(webSocketState.onClose)Module.dynCall_vii(webSocketState.onClose,instanceId,ev.code);delete instance.ws});return 0}function _WebSocketFree(instanceId){var instance=webSocketState.instances[instanceId];if(!instance)return 0;if(instance.ws&&instance.ws.readyState<2)instance.ws.close();delete webSocketState.instances[instanceId];return 0}function _WebSocketGetState(instanceId){var instance=webSocketState.instances[instanceId];if(!instance)return-1;if(instance.ws)return instance.ws.readyState;else return 3}function _WebSocketSend(instanceId,bufferPtr,length){var instance=webSocketState.instances[instanceId];if(!instance)return-1;if(!instance.ws)return-3;if(instance.ws.readyState!==1)return-6;instance.ws.send(HEAPU8.buffer.slice(bufferPtr,bufferPtr+length));return 0}function _WebSocketSendText(instanceId,message){var instance=webSocketState.instances[instanceId];if(!instance)return-1;if(!instance.ws)return-3;if(instance.ws.readyState!==1)return-6;instance.ws.send(UTF8ToString(message));return 0}function _WebSocketSetOnClose(callback){webSocketState.onClose=callback}function _WebSocketSetOnError(callback){webSocketState.onError=callback}function _WebSocketSetOnMessage(callback){webSocketState.onMessage=callback}function _WebSocketSetOnOpen(callback){webSocketState.onOpen=callback}function ___atomic_compare_exchange_8(ptr,expected,desiredl,desiredh,weak,success_memmodel,failure_memmodel){var pl=HEAP32[ptr>>2];var ph=HEAP32[ptr+4>>2];var el=HEAP32[expected>>2];var eh=HEAP32[expected+4>>2];if(pl===el&&ph===eh){HEAP32[ptr>>2]=desiredl;HEAP32[ptr+4>>2]=desiredh;return 1}else{HEAP32[expected>>2]=pl;HEAP32[expected+4>>2]=ph;return 0}}function ___atomic_fetch_add_8(ptr,vall,valh,memmodel){var l=HEAP32[ptr>>2];var h=HEAP32[ptr+4>>2];HEAP32[ptr>>2]=_i64Add(l,h,vall,valh);HEAP32[ptr+4>>2]=getTempRet0();return(setTempRet0(h),l)|0}var ENV={};function ___buildEnvironment(environ){var MAX_ENV_VALUES=64;var TOTAL_ENV_SIZE=1024;var poolPtr;var envPtr;if(!___buildEnvironment.called){___buildEnvironment.called=true;ENV["USER"]=ENV["LOGNAME"]="web_user";ENV["PATH"]="/";ENV["PWD"]="/";ENV["HOME"]="/home/web_user";ENV["LANG"]="C.UTF-8";ENV["_"]=Module["thisProgram"];poolPtr=getMemory(TOTAL_ENV_SIZE);envPtr=getMemory(MAX_ENV_VALUES*4);HEAP32[envPtr>>2]=poolPtr;HEAP32[environ>>2]=envPtr}else{envPtr=HEAP32[environ>>2];poolPtr=HEAP32[envPtr>>2]}var strings=[];var totalSize=0;for(var key in ENV){if(typeof ENV[key]==="string"){var line=key+"="+ENV[key];strings.push(line);totalSize+=line.length}}if(totalSize>TOTAL_ENV_SIZE){throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")}var ptrSize=4;for(var i=0;i<strings.length;i++){var line=strings[i];writeAsciiToMemory(line,poolPtr);HEAP32[envPtr+i*ptrSize>>2]=poolPtr;poolPtr+=line.length+1}HEAP32[envPtr+strings.length*ptrSize>>2]=0}function ___cxa_allocate_exception(size){return _malloc(size)}function __ZSt18uncaught_exceptionv(){return!!__ZSt18uncaught_exceptionv.uncaught_exception}var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:(function(adjusted){if(!adjusted||EXCEPTIONS.infos[adjusted])return adjusted;for(var key in EXCEPTIONS.infos){var ptr=+key;var info=EXCEPTIONS.infos[ptr];if(info.adjusted===adjusted){return ptr}}return adjusted}),addRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount++}),decRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];assert(info.refcount>0);info.refcount--;if(info.refcount===0&&!info.rethrown){if(info.destructor){Module["dynCall_vi"](info.destructor,ptr)}delete EXCEPTIONS.infos[ptr];___cxa_free_exception(ptr)}}),clearRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount=0})};function ___cxa_begin_catch(ptr){var info=EXCEPTIONS.infos[ptr];if(info&&!info.caught){info.caught=true;__ZSt18uncaught_exceptionv.uncaught_exception--}if(info)info.rethrown=false;EXCEPTIONS.caught.push(ptr);EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));return ptr}function ___cxa_free_exception(ptr){try{return _free(ptr)}catch(e){}}function ___cxa_end_catch(){Module["setThrew"](0);var ptr=EXCEPTIONS.caught.pop();if(ptr){EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(ptr));EXCEPTIONS.last=0}}function ___cxa_find_matching_catch_2(){return ___cxa_find_matching_catch.apply(null,arguments)}function ___cxa_find_matching_catch_3(){return ___cxa_find_matching_catch.apply(null,arguments)}function ___cxa_find_matching_catch_4(){return ___cxa_find_matching_catch.apply(null,arguments)}function ___cxa_pure_virtual(){ABORT=true;throw"Pure virtual function called!"}function ___cxa_rethrow(){var ptr=EXCEPTIONS.caught.pop();ptr=EXCEPTIONS.deAdjust(ptr);if(!EXCEPTIONS.infos[ptr].rethrown){EXCEPTIONS.caught.push(ptr);EXCEPTIONS.infos[ptr].rethrown=true}EXCEPTIONS.last=ptr;throw ptr}function ___resumeException(ptr){if(!EXCEPTIONS.last){EXCEPTIONS.last=ptr}throw ptr}function ___cxa_find_matching_catch(){var thrown=EXCEPTIONS.last;if(!thrown){return(setTempRet0(0),0)|0}var info=EXCEPTIONS.infos[thrown];var throwntype=info.type;if(!throwntype){return(setTempRet0(0),thrown)|0}var typeArray=Array.prototype.slice.call(arguments);var pointer=Module["___cxa_is_pointer_type"](throwntype);if(!___cxa_find_matching_catch.buffer)___cxa_find_matching_catch.buffer=_malloc(4);HEAP32[___cxa_find_matching_catch.buffer>>2]=thrown;thrown=___cxa_find_matching_catch.buffer;for(var i=0;i<typeArray.length;i++){if(typeArray[i]&&Module["___cxa_can_catch"](typeArray[i],throwntype,thrown)){thrown=HEAP32[thrown>>2];info.adjusted=thrown;return(setTempRet0(typeArray[i]),thrown)|0}}thrown=HEAP32[thrown>>2];return(setTempRet0(throwntype),thrown)|0}function ___cxa_throw(ptr,type,destructor){EXCEPTIONS.infos[ptr]={ptr:ptr,adjusted:ptr,type:type,destructor:destructor,refcount:0,caught:false,rethrown:false};EXCEPTIONS.last=ptr;if(!("uncaught_exception"in __ZSt18uncaught_exceptionv)){__ZSt18uncaught_exceptionv.uncaught_exception=1}else{__ZSt18uncaught_exceptionv.uncaught_exception++}throw ptr}function ___gxx_personality_v0(){}function ___lock(){}var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}function ___map_file(pathname,size){___setErrNo(ERRNO_CODES.EPERM);return-1}var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};var PATH={splitPath:(function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)}),normalizeArray:(function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts}),normalize:(function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter((function(p){return!!p})),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path}),dirname:(function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir}),basename:(function(path){if(path==="/")return"/";var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)}),extname:(function(path){return PATH.splitPath(path)[3]}),join:(function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))}),join2:(function(l,r){return PATH.normalize(l+"/"+r)}),resolve:(function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:FS.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/"}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter((function(p){return!!p})),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."}),relative:(function(from,to){from=PATH.resolve(from).substr(1);to=PATH.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")})};var TTY={ttys:[],init:(function(){}),shutdown:(function(){}),register:(function(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)}),stream_ops:{open:(function(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}stream.tty=tty;stream.seekable=false}),close:(function(stream){stream.tty.ops.flush(stream.tty)}),flush:(function(stream){stream.tty.ops.flush(stream.tty)}),read:(function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(ERRNO_CODES.ENXIO)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead}),write:(function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(ERRNO_CODES.ENXIO)}for(var i=0;i<length;i++){try{stream.tty.ops.put_char(stream.tty,buffer[offset+i])}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}}if(length){stream.node.timestamp=Date.now()}return i})},default_tty_ops:{get_char:(function(tty){if(!tty.input.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=new Buffer(BUFSIZE);var bytesRead=0;var isPosixPlatform=process.platform!="win32";var fd=process.stdin.fd;if(isPosixPlatform){var usingDevice=false;try{fd=fs.openSync("/dev/stdin","r");usingDevice=true}catch(e){}}try{bytesRead=fs.readSync(fd,buf,0,BUFSIZE,null)}catch(e){if(e.toString().indexOf("EOF")!=-1)bytesRead=0;else throw e}if(usingDevice){fs.closeSync(fd)}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}else{result=null}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else if(typeof readline=="function"){result=readline();if(result!==null){result+="\n"}}if(!result){return null}tty.input=intArrayFromString(result,true)}return tty.input.shift()}),put_char:(function(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}}),flush:(function(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}})},default_tty1_ops:{put_char:(function(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}}),flush:(function(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}})}};var MEMFS={ops_table:null,mount:(function(mount){return MEMFS.createNode(null,"/",16384|511,0)}),createNode:(function(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(!MEMFS.ops_table){MEMFS.ops_table={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}}}var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node}return node}),getFileDataAsRegularArray:(function(node){if(node.contents&&node.contents.subarray){var arr=[];for(var i=0;i<node.usedBytes;++i)arr.push(node.contents[i]);return arr}return node.contents}),getFileDataAsTypedArray:(function(node){if(!node.contents)return new Uint8Array;if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)}),expandFileStorage:(function(node,newCapacity){if(node.contents&&node.contents.subarray&&newCapacity>node.contents.length){node.contents=MEMFS.getFileDataAsRegularArray(node);node.usedBytes=node.contents.length}if(!node.contents||node.contents.subarray){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)|0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0);return}if(!node.contents&&newCapacity>0)node.contents=[];while(node.contents.length<newCapacity)node.contents.push(0)}),resizeFileStorage:(function(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0;return}if(!node.contents||node.contents.subarray){var oldContents=node.contents;node.contents=new Uint8Array(new ArrayBuffer(newSize));if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize;return}if(!node.contents)node.contents=[];if(node.contents.length>newSize)node.contents.length=newSize;else while(node.contents.length<newSize)node.contents.push(0);node.usedBytes=newSize}),node_ops:{getattr:(function(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr}),setattr:(function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}}),lookup:(function(parent,name){throw FS.genericErrors[ERRNO_CODES.ENOENT]}),mknod:(function(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)}),rename:(function(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)}}}delete old_node.parent.contents[old_node.name];old_node.name=new_name;new_dir.contents[new_name]=old_node;old_node.parent=new_dir}),unlink:(function(parent,name){delete parent.contents[name]}),rmdir:(function(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)}delete parent.contents[name]}),readdir:(function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries}),symlink:(function(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node}),readlink:(function(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return node.link})},stream_ops:{read:(function(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);assert(size>=0);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size}),write:(function(stream,buffer,offset,length,position,canOwn){if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=new Uint8Array(buffer.subarray(offset,offset+length));node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray)node.contents.set(buffer.subarray(offset,offset+length),position);else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length}),llseek:(function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return position}),allocate:(function(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)}),mmap:(function(stream,buffer,offset,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&(contents.buffer===buffer||contents.buffer===buffer.buffer)){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<stream.node.usedBytes){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;var fromHeap=buffer.buffer==HEAP8.buffer;ptr=_malloc(length);if(!ptr){throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)}(fromHeap?HEAP8:buffer).set(contents,ptr)}return{ptr:ptr,allocated:allocated}}),msync:(function(stream,buffer,offset,length,mmapFlags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}if(mmapFlags&2){return 0}var bytesWritten=MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0})}};var IDBFS={dbs:{},indexedDB:(function(){if(typeof indexedDB!=="undefined")return indexedDB;var ret=null;if(typeof window==="object")ret=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;assert(ret,"IDBFS used, but indexedDB not supported");return ret}),DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:(function(mount){return MEMFS.mount.apply(null,arguments)}),syncfs:(function(mount,populate,callback){IDBFS.getLocalSet(mount,(function(err,local){if(err)return callback(err);IDBFS.getRemoteSet(mount,(function(err,remote){if(err)return callback(err);var src=populate?remote:local;var dst=populate?local:remote;IDBFS.reconcile(src,dst,callback)}))}))}),getDB:(function(name,callback){var db=IDBFS.dbs[name];if(db){return callback(null,db)}var req;try{req=IDBFS.indexedDB().open(name,IDBFS.DB_VERSION)}catch(e){return callback(e)}if(!req){return callback("Unable to connect to IndexedDB")}req.onupgradeneeded=(function(e){var db=e.target.result;var transaction=e.target.transaction;var fileStore;if(db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)){fileStore=transaction.objectStore(IDBFS.DB_STORE_NAME)}else{fileStore=db.createObjectStore(IDBFS.DB_STORE_NAME)}if(!fileStore.indexNames.contains("timestamp")){fileStore.createIndex("timestamp","timestamp",{unique:false})}});req.onsuccess=(function(){db=req.result;IDBFS.dbs[name]=db;callback(null,db)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),getLocalSet:(function(mount,callback){var entries={};function isRealDir(p){return p!=="."&&p!==".."}function toAbsolute(root){return(function(p){return PATH.join2(root,p)})}var check=FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));while(check.length){var path=check.pop();var stat;try{stat=FS.stat(path)}catch(e){return callback(e)}if(FS.isDir(stat.mode)){check.push.apply(check,FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))}entries[path]={timestamp:stat.mtime}}return callback(null,{type:"local",entries:entries})}),getRemoteSet:(function(mount,callback){var entries={};IDBFS.getDB(mount.mountpoint,(function(err,db){if(err)return callback(err);try{var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readonly");transaction.onerror=(function(e){callback(this.error);e.preventDefault()});var store=transaction.objectStore(IDBFS.DB_STORE_NAME);var index=store.index("timestamp");index.openKeyCursor().onsuccess=(function(event){var cursor=event.target.result;if(!cursor){return callback(null,{type:"remote",db:db,entries:entries})}entries[cursor.primaryKey]={timestamp:cursor.key};cursor.continue()})}catch(e){return callback(e)}}))}),loadLocalEntry:(function(path,callback){var stat,node;try{var lookup=FS.lookupPath(path);node=lookup.node;stat=FS.stat(path)}catch(e){return callback(e)}if(FS.isDir(stat.mode)){return callback(null,{timestamp:stat.mtime,mode:stat.mode})}else if(FS.isFile(stat.mode)){node.contents=MEMFS.getFileDataAsTypedArray(node);return callback(null,{timestamp:stat.mtime,mode:stat.mode,contents:node.contents})}else{return callback(new Error("node type not supported"))}}),storeLocalEntry:(function(path,entry,callback){try{if(FS.isDir(entry.mode)){FS.mkdir(path,entry.mode)}else if(FS.isFile(entry.mode)){FS.writeFile(path,entry.contents,{canOwn:true})}else{return callback(new Error("node type not supported"))}FS.chmod(path,entry.mode);FS.utime(path,entry.timestamp,entry.timestamp)}catch(e){return callback(e)}callback(null)}),removeLocalEntry:(function(path,callback){try{var lookup=FS.lookupPath(path);var stat=FS.stat(path);if(FS.isDir(stat.mode)){FS.rmdir(path)}else if(FS.isFile(stat.mode)){FS.unlink(path)}}catch(e){return callback(e)}callback(null)}),loadRemoteEntry:(function(store,path,callback){var req=store.get(path);req.onsuccess=(function(event){callback(null,event.target.result)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),storeRemoteEntry:(function(store,path,entry,callback){var req=store.put(entry,path);req.onsuccess=(function(){callback(null)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),removeRemoteEntry:(function(store,path,callback){var req=store.delete(path);req.onsuccess=(function(){callback(null)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),reconcile:(function(src,dst,callback){var total=0;var create=[];Object.keys(src.entries).forEach((function(key){var e=src.entries[key];var e2=dst.entries[key];if(!e2||e.timestamp>e2.timestamp){create.push(key);total++}}));var remove=[];Object.keys(dst.entries).forEach((function(key){var e=dst.entries[key];var e2=src.entries[key];if(!e2){remove.push(key);total++}}));if(!total){return callback(null)}var completed=0;var db=src.type==="remote"?src.db:dst.db;var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readwrite");var store=transaction.objectStore(IDBFS.DB_STORE_NAME);function done(err){if(err){if(!done.errored){done.errored=true;return callback(err)}return}if(++completed>=total){return callback(null)}}transaction.onerror=(function(e){done(this.error);e.preventDefault()});create.sort().forEach((function(path){if(dst.type==="local"){IDBFS.loadRemoteEntry(store,path,(function(err,entry){if(err)return done(err);IDBFS.storeLocalEntry(path,entry,done)}))}else{IDBFS.loadLocalEntry(path,(function(err,entry){if(err)return done(err);IDBFS.storeRemoteEntry(store,path,entry,done)}))}}));remove.sort().reverse().forEach((function(path){if(dst.type==="local"){IDBFS.removeLocalEntry(path,done)}else{IDBFS.removeRemoteEntry(store,path,done)}}))})};var NODEFS={isWindows:false,staticInit:(function(){NODEFS.isWindows=!!process.platform.match(/^win/);var flags=process["binding"]("constants");if(flags["fs"]){flags=flags["fs"]}NODEFS.flagsForNodeMap={"1024":flags["O_APPEND"],"64":flags["O_CREAT"],"128":flags["O_EXCL"],"0":flags["O_RDONLY"],"2":flags["O_RDWR"],"4096":flags["O_SYNC"],"512":flags["O_TRUNC"],"1":flags["O_WRONLY"]}}),bufferFrom:(function(arrayBuffer){return Buffer.alloc?Buffer.from(arrayBuffer):new Buffer(arrayBuffer)}),mount:(function(mount){assert(ENVIRONMENT_IS_NODE);return NODEFS.createNode(null,"/",NODEFS.getMode(mount.opts.root),0)}),createNode:(function(parent,name,mode,dev){if(!FS.isDir(mode)&&!FS.isFile(mode)&&!FS.isLink(mode)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var node=FS.createNode(parent,name,mode);node.node_ops=NODEFS.node_ops;node.stream_ops=NODEFS.stream_ops;return node}),getMode:(function(path){var stat;try{stat=fs.lstatSync(path);if(NODEFS.isWindows){stat.mode=stat.mode|(stat.mode&292)>>2}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}return stat.mode}),realPath:(function(node){var parts=[];while(node.parent!==node){parts.push(node.name);node=node.parent}parts.push(node.mount.opts.root);parts.reverse();return PATH.join.apply(null,parts)}),flagsForNode:(function(flags){flags&=~2097152;flags&=~2048;flags&=~32768;flags&=~524288;var newFlags=0;for(var k in NODEFS.flagsForNodeMap){if(flags&k){newFlags|=NODEFS.flagsForNodeMap[k];flags^=k}}if(!flags){return newFlags}else{throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}}),node_ops:{getattr:(function(node){var path=NODEFS.realPath(node);var stat;try{stat=fs.lstatSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}if(NODEFS.isWindows&&!stat.blksize){stat.blksize=4096}if(NODEFS.isWindows&&!stat.blocks){stat.blocks=(stat.size+stat.blksize-1)/stat.blksize|0}return{dev:stat.dev,ino:stat.ino,mode:stat.mode,nlink:stat.nlink,uid:stat.uid,gid:stat.gid,rdev:stat.rdev,size:stat.size,atime:stat.atime,mtime:stat.mtime,ctime:stat.ctime,blksize:stat.blksize,blocks:stat.blocks}}),setattr:(function(node,attr){var path=NODEFS.realPath(node);try{if(attr.mode!==undefined){fs.chmodSync(path,attr.mode);node.mode=attr.mode}if(attr.timestamp!==undefined){var date=new Date(attr.timestamp);fs.utimesSync(path,date,date)}if(attr.size!==undefined){fs.truncateSync(path,attr.size)}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),lookup:(function(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);var mode=NODEFS.getMode(path);return NODEFS.createNode(parent,name,mode)}),mknod:(function(parent,name,mode,dev){var node=NODEFS.createNode(parent,name,mode,dev);var path=NODEFS.realPath(node);try{if(FS.isDir(node.mode)){fs.mkdirSync(path,node.mode)}else{fs.writeFileSync(path,"",{mode:node.mode})}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}return node}),rename:(function(oldNode,newDir,newName){var oldPath=NODEFS.realPath(oldNode);var newPath=PATH.join2(NODEFS.realPath(newDir),newName);try{fs.renameSync(oldPath,newPath)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),unlink:(function(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);try{fs.unlinkSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),rmdir:(function(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);try{fs.rmdirSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),readdir:(function(node){var path=NODEFS.realPath(node);try{return fs.readdirSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),symlink:(function(parent,newName,oldPath){var newPath=PATH.join2(NODEFS.realPath(parent),newName);try{fs.symlinkSync(oldPath,newPath)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),readlink:(function(node){var path=NODEFS.realPath(node);try{path=fs.readlinkSync(path);path=NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root),path);return path}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}})},stream_ops:{open:(function(stream){var path=NODEFS.realPath(stream.node);try{if(FS.isFile(stream.node.mode)){stream.nfd=fs.openSync(path,NODEFS.flagsForNode(stream.flags))}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),close:(function(stream){try{if(FS.isFile(stream.node.mode)&&stream.nfd){fs.closeSync(stream.nfd)}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),read:(function(stream,buffer,offset,length,position){if(length===0)return 0;try{return fs.readSync(stream.nfd,NODEFS.bufferFrom(buffer.buffer),offset,length,position)}catch(e){throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),write:(function(stream,buffer,offset,length,position){try{return fs.writeSync(stream.nfd,NODEFS.bufferFrom(buffer.buffer),offset,length,position)}catch(e){throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),llseek:(function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){try{var stat=fs.fstatSync(stream.nfd);position+=stat.size}catch(e){throw new FS.ErrnoError(ERRNO_CODES[e.code])}}}if(position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return position})}};var WORKERFS={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:(function(mount){assert(ENVIRONMENT_IS_WORKER);if(!WORKERFS.reader)WORKERFS.reader=new FileReaderSync;var root=WORKERFS.createNode(null,"/",WORKERFS.DIR_MODE,0);var createdParents={};function ensureParent(path){var parts=path.split("/");var parent=root;for(var i=0;i<parts.length-1;i++){var curr=parts.slice(0,i+1).join("/");if(!createdParents[curr]){createdParents[curr]=WORKERFS.createNode(parent,parts[i],WORKERFS.DIR_MODE,0)}parent=createdParents[curr]}return parent}function base(path){var parts=path.split("/");return parts[parts.length-1]}Array.prototype.forEach.call(mount.opts["files"]||[],(function(file){WORKERFS.createNode(ensureParent(file.name),base(file.name),WORKERFS.FILE_MODE,0,file,file.lastModifiedDate)}));(mount.opts["blobs"]||[]).forEach((function(obj){WORKERFS.createNode(ensureParent(obj["name"]),base(obj["name"]),WORKERFS.FILE_MODE,0,obj["data"])}));(mount.opts["packages"]||[]).forEach((function(pack){pack["metadata"].files.forEach((function(file){var name=file.filename.substr(1);WORKERFS.createNode(ensureParent(name),base(name),WORKERFS.FILE_MODE,0,pack["blob"].slice(file.start,file.end))}))}));return root}),createNode:(function(parent,name,mode,dev,contents,mtime){var node=FS.createNode(parent,name,mode);node.mode=mode;node.node_ops=WORKERFS.node_ops;node.stream_ops=WORKERFS.stream_ops;node.timestamp=(mtime||new Date).getTime();assert(WORKERFS.FILE_MODE!==WORKERFS.DIR_MODE);if(mode===WORKERFS.FILE_MODE){node.size=contents.size;node.contents=contents}else{node.size=4096;node.contents={}}if(parent){parent.contents[name]=node}return node}),node_ops:{getattr:(function(node){return{dev:1,ino:undefined,mode:node.mode,nlink:1,uid:0,gid:0,rdev:undefined,size:node.size,atime:new Date(node.timestamp),mtime:new Date(node.timestamp),ctime:new Date(node.timestamp),blksize:4096,blocks:Math.ceil(node.size/4096)}}),setattr:(function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}}),lookup:(function(parent,name){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}),mknod:(function(parent,name,mode,dev){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),rename:(function(oldNode,newDir,newName){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),unlink:(function(parent,name){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),rmdir:(function(parent,name){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),readdir:(function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries}),symlink:(function(parent,newName,oldPath){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),readlink:(function(node){throw new FS.ErrnoError(ERRNO_CODES.EPERM)})},stream_ops:{read:(function(stream,buffer,offset,length,position){if(position>=stream.node.size)return 0;var chunk=stream.node.contents.slice(position,position+length);var ab=WORKERFS.reader.readAsArrayBuffer(chunk);buffer.set(new Uint8Array(ab),offset);return chunk.size}),write:(function(stream,buffer,offset,length,position){throw new FS.ErrnoError(ERRNO_CODES.EIO)}),llseek:(function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.size}}if(position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return position})}};STATICTOP+=16;STATICTOP+=16;STATICTOP+=16;var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:(function(e){if(!(e instanceof FS.ErrnoError))throw e+" : "+stackTrace();return ___setErrNo(e.errno)}),lookupPath:(function(path,opts){path=PATH.resolve(FS.cwd(),path);opts=opts||{};if(!path)return{path:"",node:null};var defaults={follow_mount:true,recurse_count:0};for(var key in defaults){if(opts[key]===undefined){opts[key]=defaults[key]}}if(opts.recurse_count>8){throw new FS.ErrnoError(ERRNO_CODES.ELOOP)}var parts=PATH.normalizeArray(path.split("/").filter((function(p){return!!p})),false);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count});current=lookup.node;if(count++>40){throw new FS.ErrnoError(ERRNO_CODES.ELOOP)}}}}return{path:current_path,node:current}}),getPath:(function(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?mount+"/"+path:mount+path}path=path?node.name+"/"+path:node.name;node=node.parent}}),hashName:(function(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length}),hashAddNode:(function(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node}),hashRemoveNode:(function(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}}),lookupNode:(function(parent,name){var err=FS.mayLookup(parent);if(err){throw new FS.ErrnoError(err,parent)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)}),createNode:(function(parent,name,mode,rdev){if(!FS.FSNode){FS.FSNode=(function(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev});FS.FSNode.prototype={};var readMode=292|73;var writeMode=146;Object.defineProperties(FS.FSNode.prototype,{read:{get:(function(){return(this.mode&readMode)===readMode}),set:(function(val){val?this.mode|=readMode:this.mode&=~readMode})},write:{get:(function(){return(this.mode&writeMode)===writeMode}),set:(function(val){val?this.mode|=writeMode:this.mode&=~writeMode})},isFolder:{get:(function(){return FS.isDir(this.mode)})},isDevice:{get:(function(){return FS.isChrdev(this.mode)})}})}var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node}),destroyNode:(function(node){FS.hashRemoveNode(node)}),isRoot:(function(node){return node===node.parent}),isMountpoint:(function(node){return!!node.mounted}),isFile:(function(mode){return(mode&61440)===32768}),isDir:(function(mode){return(mode&61440)===16384}),isLink:(function(mode){return(mode&61440)===40960}),isChrdev:(function(mode){return(mode&61440)===8192}),isBlkdev:(function(mode){return(mode&61440)===24576}),isFIFO:(function(mode){return(mode&61440)===4096}),isSocket:(function(mode){return(mode&49152)===49152}),flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:(function(str){var flags=FS.flagModes[str];if(typeof flags==="undefined"){throw new Error("Unknown file open mode: "+str)}return flags}),flagsToPermissionString:(function(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms}),nodePermissions:(function(node,perms){if(FS.ignorePermissions){return 0}if(perms.indexOf("r")!==-1&&!(node.mode&292)){return ERRNO_CODES.EACCES}else if(perms.indexOf("w")!==-1&&!(node.mode&146)){return ERRNO_CODES.EACCES}else if(perms.indexOf("x")!==-1&&!(node.mode&73)){return ERRNO_CODES.EACCES}return 0}),mayLookup:(function(dir){var err=FS.nodePermissions(dir,"x");if(err)return err;if(!dir.node_ops.lookup)return ERRNO_CODES.EACCES;return 0}),mayCreate:(function(dir,name){try{var node=FS.lookupNode(dir,name);return ERRNO_CODES.EEXIST}catch(e){}return FS.nodePermissions(dir,"wx")}),mayDelete:(function(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var err=FS.nodePermissions(dir,"wx");if(err){return err}if(isdir){if(!FS.isDir(node.mode)){return ERRNO_CODES.ENOTDIR}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return ERRNO_CODES.EBUSY}}else{if(FS.isDir(node.mode)){return ERRNO_CODES.EISDIR}}return 0}),mayOpen:(function(node,flags){if(!node){return ERRNO_CODES.ENOENT}if(FS.isLink(node.mode)){return ERRNO_CODES.ELOOP}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return ERRNO_CODES.EISDIR}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))}),MAX_OPEN_FDS:4096,nextfd:(function(fd_start,fd_end){fd_start=fd_start||0;fd_end=fd_end||FS.MAX_OPEN_FDS;for(var fd=fd_start;fd<=fd_end;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(ERRNO_CODES.EMFILE)}),getStream:(function(fd){return FS.streams[fd]}),createStream:(function(stream,fd_start,fd_end){if(!FS.FSStream){FS.FSStream=(function(){});FS.FSStream.prototype={};Object.defineProperties(FS.FSStream.prototype,{object:{get:(function(){return this.node}),set:(function(val){this.node=val})},isRead:{get:(function(){return(this.flags&2097155)!==1})},isWrite:{get:(function(){return(this.flags&2097155)!==0})},isAppend:{get:(function(){return this.flags&1024})}})}var newStream=new FS.FSStream;for(var p in stream){newStream[p]=stream[p]}stream=newStream;var fd=FS.nextfd(fd_start,fd_end);stream.fd=fd;FS.streams[fd]=stream;return stream}),closeStream:(function(fd){FS.streams[fd]=null}),chrdev_stream_ops:{open:(function(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;if(stream.stream_ops.open){stream.stream_ops.open(stream)}}),llseek:(function(){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)})},major:(function(dev){return dev>>8}),minor:(function(dev){return dev&255}),makedev:(function(ma,mi){return ma<<8|mi}),registerDevice:(function(dev,ops){FS.devices[dev]={stream_ops:ops}}),getDevice:(function(dev){return FS.devices[dev]}),getMounts:(function(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push.apply(check,m.mounts)}return mounts}),syncfs:(function(populate,callback){if(typeof populate==="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){console.log("warning: "+FS.syncFSRequests+" FS.syncfs operations in flight at once, probably just doing extra work")}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(err){assert(FS.syncFSRequests>0);FS.syncFSRequests--;return callback(err)}function done(err){if(err){if(!done.errored){done.errored=true;return doCallback(err)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach((function(mount){if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)}))}),mount:(function(type,opts,mountpoint){var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot}),unmount:(function(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach((function(hash){var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.indexOf(current.mount)!==-1){FS.destroyNode(current)}current=next}}));node.mounted=null;var idx=node.mount.mounts.indexOf(mount);assert(idx!==-1);node.mount.mounts.splice(idx,1)}),lookup:(function(parent,name){return parent.node_ops.lookup(parent,name)}),mknod:(function(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var err=FS.mayCreate(parent,name);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}return parent.node_ops.mknod(parent,name,mode,dev)}),create:(function(path,mode){mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)}),mkdir:(function(path,mode){mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)}),mkdirTree:(function(path,mode){var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=ERRNO_CODES.EEXIST)throw e}}}),mkdev:(function(path,mode,dev){if(typeof dev==="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)}),symlink:(function(oldpath,newpath){if(!PATH.resolve(oldpath)){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}var newname=PATH.basename(newpath);var err=FS.mayCreate(parent,newname);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}return parent.node_ops.symlink(parent,newname,oldpath)}),rename:(function(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;try{lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}if(!old_dir||!new_dir)throw new FS.ErrnoError(ERRNO_CODES.ENOENT);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(ERRNO_CODES.EXDEV)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}relative=PATH.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var err=FS.mayDelete(old_dir,old_name,isdir);if(err){throw new FS.ErrnoError(err)}err=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(err){throw new FS.ErrnoError(err)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}if(new_dir!==old_dir){err=FS.nodePermissions(old_dir,"w");if(err){throw new FS.ErrnoError(err)}}try{if(FS.trackingDelegate["willMovePath"]){FS.trackingDelegate["willMovePath"](old_path,new_path)}}catch(e){console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}try{if(FS.trackingDelegate["onMovePath"])FS.trackingDelegate["onMovePath"](old_path,new_path)}catch(e){console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)}}),rmdir:(function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var err=FS.mayDelete(parent,name,true);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}try{if(FS.trackingDelegate["willDeletePath"]){FS.trackingDelegate["willDeletePath"](path)}}catch(e){console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node);try{if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)}catch(e){console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)}}),readdir:(function(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}return node.node_ops.readdir(node)}),unlink:(function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var err=FS.mayDelete(parent,name,false);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}try{if(FS.trackingDelegate["willDeletePath"]){FS.trackingDelegate["willDeletePath"](path)}}catch(e){console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)}parent.node_ops.unlink(parent,name);FS.destroyNode(node);try{if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)}catch(e){console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)}}),readlink:(function(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(!link.node_ops.readlink){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return PATH.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))}),stat:(function(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(!node.node_ops.getattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}return node.node_ops.getattr(node)}),lstat:(function(path){return FS.stat(path,true)}),chmod:(function(path,mode,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})}),lchmod:(function(path,mode){FS.chmod(path,mode,true)}),fchmod:(function(fd,mode){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}FS.chmod(stream.node,mode)}),chown:(function(path,uid,gid,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}node.node_ops.setattr(node,{timestamp:Date.now()})}),lchown:(function(path,uid,gid){FS.chown(path,uid,gid,true)}),fchown:(function(fd,uid,gid){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}FS.chown(stream.node,uid,gid)}),truncate:(function(path,len){if(len<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EISDIR)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var err=FS.nodePermissions(node,"w");if(err){throw new FS.ErrnoError(err)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})}),ftruncate:(function(fd,len){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}FS.truncate(stream.node,len)}),utime:(function(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})}),open:(function(path,flags,mode,fd_start,fd_end){if(path===""){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}flags=typeof flags==="string"?FS.modeStringToFlags(flags):flags;mode=typeof mode==="undefined"?438:mode;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path==="object"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(ERRNO_CODES.EEXIST)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}if(!created){var err=FS.mayOpen(node,flags);if(err){throw new FS.ErrnoError(err)}}if(flags&512){FS.truncate(node,0)}flags&=~(128|512);var stream=FS.createStream({node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false},fd_start,fd_end);if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1;err("read file: "+path)}}try{if(FS.trackingDelegate["onOpenFile"]){var trackingFlags=0;if((flags&2097155)!==1){trackingFlags|=FS.tracking.openFlags.READ}if((flags&2097155)!==0){trackingFlags|=FS.tracking.openFlags.WRITE}FS.trackingDelegate["onOpenFile"](path,trackingFlags)}}catch(e){console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: "+e.message)}return stream}),close:(function(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null}),isClosed:(function(stream){return stream.fd===null}),llseek:(function(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position}),read:(function(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EISDIR)}if(!stream.stream_ops.read){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead}),write:(function(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EISDIR)}if(!stream.stream_ops.write){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if(stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;try{if(stream.path&&FS.trackingDelegate["onWriteToFile"])FS.trackingDelegate["onWriteToFile"](stream.path)}catch(e){console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: "+e.message)}return bytesWritten}),allocate:(function(stream,offset,length){if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(offset<0||length<=0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}stream.stream_ops.allocate(stream,offset,length)}),mmap:(function(stream,buffer,offset,length,position,prot,flags){if((stream.flags&2097155)===1){throw new FS.ErrnoError(ERRNO_CODES.EACCES)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}return stream.stream_ops.mmap(stream,buffer,offset,length,position,prot,flags)}),msync:(function(stream,buffer,offset,length,mmapFlags){if(!stream||!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)}),munmap:(function(stream){return 0}),ioctl:(function(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)}return stream.stream_ops.ioctl(stream,cmd,arg)}),readFile:(function(path,opts){opts=opts||{};opts.flags=opts.flags||"r";opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error('Invalid encoding type "'+opts.encoding+'"')}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret}),writeFile:(function(path,data,opts){opts=opts||{};opts.flags=opts.flags||"w";var stream=FS.open(path,opts.flags,opts.mode);if(typeof data==="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)}),cwd:(function(){return FS.currentPath}),chdir:(function(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}var err=FS.nodePermissions(lookup.node,"x");if(err){throw new FS.ErrnoError(err)}FS.currentPath=lookup.path}),createDefaultDirectories:(function(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")}),createDefaultDevices:(function(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:(function(){return 0}),write:(function(stream,buffer,offset,length,pos){return length})});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var random_device;if(typeof crypto!=="undefined"){var randomBuffer=new Uint8Array(1);random_device=(function(){crypto.getRandomValues(randomBuffer);return randomBuffer[0]})}else if(ENVIRONMENT_IS_NODE){random_device=(function(){return require("crypto")["randomBytes"](1)[0]})}else{random_device=(function(){return Math.random()*256|0})}FS.createDevice("/dev","random",random_device);FS.createDevice("/dev","urandom",random_device);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")}),createSpecialDirectories:(function(){FS.mkdir("/proc");FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount:(function(){var node=FS.createNode("/proc/self","fd",16384|511,73);node.node_ops={lookup:(function(parent,name){var fd=+name;var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:(function(){return stream.path})}};ret.parent=ret;return ret})};return node})},{},"/proc/self/fd")}),createStandardStreams:(function(){if(Module["stdin"]){FS.createDevice("/dev","stdin",Module["stdin"])}else{FS.symlink("/dev/tty","/dev/stdin")}if(Module["stdout"]){FS.createDevice("/dev","stdout",null,Module["stdout"])}else{FS.symlink("/dev/tty","/dev/stdout")}if(Module["stderr"]){FS.createDevice("/dev","stderr",null,Module["stderr"])}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin","r");assert(stdin.fd===0,"invalid handle for stdin ("+stdin.fd+")");var stdout=FS.open("/dev/stdout","w");assert(stdout.fd===1,"invalid handle for stdout ("+stdout.fd+")");var stderr=FS.open("/dev/stderr","w");assert(stderr.fd===2,"invalid handle for stderr ("+stderr.fd+")")}),ensureErrnoError:(function(){if(FS.ErrnoError)return;FS.ErrnoError=function ErrnoError(errno,node){this.node=node;this.setErrno=(function(errno){this.errno=errno;for(var key in ERRNO_CODES){if(ERRNO_CODES[key]===errno){this.code=key;break}}});this.setErrno(errno);this.message=ERRNO_MESSAGES[errno];if(this.stack)Object.defineProperty(this,"stack",{value:(new Error).stack,writable:true})};FS.ErrnoError.prototype=new Error;FS.ErrnoError.prototype.constructor=FS.ErrnoError;[ERRNO_CODES.ENOENT].forEach((function(code){FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack="<generic error, no stack>"}))}),staticInit:(function(){FS.ensureErrnoError();FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={"MEMFS":MEMFS,"IDBFS":IDBFS,"NODEFS":NODEFS,"WORKERFS":WORKERFS}}),init:(function(input,output,error){assert(!FS.init.initialized,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");FS.init.initialized=true;FS.ensureErrnoError();Module["stdin"]=input||Module["stdin"];Module["stdout"]=output||Module["stdout"];Module["stderr"]=error||Module["stderr"];FS.createStandardStreams()}),quit:(function(){FS.init.initialized=false;var fflush=Module["_fflush"];if(fflush)fflush(0);for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}}),getMode:(function(canRead,canWrite){var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode}),joinPath:(function(parts,forceRelative){var path=PATH.join.apply(null,parts);if(forceRelative&&path[0]=="/")path=path.substr(1);return path}),absolutePath:(function(relative,base){return PATH.resolve(base,relative)}),standardizePath:(function(path){return PATH.normalize(path)}),findObject:(function(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(ret.exists){return ret.object}else{___setErrNo(ret.error);return null}}),analyzePath:(function(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret}),createFolder:(function(parent,name,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.mkdir(path,mode)}),createPath:(function(parent,path,canRead,canWrite){parent=typeof parent==="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current}),createFile:(function(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.create(path,mode)}),createDataFile:(function(parent,name,data,canRead,canWrite,canOwn){var path=name?PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name):parent;var mode=FS.getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data==="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,"w");FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}return node}),createDevice:(function(parent,name,input,output){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open:(function(stream){stream.seekable=false}),close:(function(stream){if(output&&output.buffer&&output.buffer.length){output(10)}}),read:(function(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead}),write:(function(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}}if(length){stream.node.timestamp=Date.now()}return i})});return FS.mkdev(path,mode,dev)}),createLink:(function(parent,name,target,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);return FS.symlink(target,path)}),forceLoadFile:(function(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;var success=true;if(typeof XMLHttpRequest!=="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else if(Module["read"]){try{obj.contents=intArrayFromString(Module["read"](obj.url),true);obj.usedBytes=obj.contents.length}catch(e){success=false}}else{throw new Error("Cannot load without read() or XMLHttpRequest.")}if(!success)___setErrNo(ERRNO_CODES.EIO);return success}),createLazyFile:(function(parent,name,url,canRead,canWrite){function LazyUint8Array(){this.lengthKnown=false;this.chunks=[]}LazyUint8Array.prototype.get=function LazyUint8Array_get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]};LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter){this.getter=getter};LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(function(from,to){if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);if(typeof Uint8Array!="undefined")xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}else{return intArrayFromString(xhr.responseText||"",true)}});var lazyArray=this;lazyArray.setDataGetter((function(chunkNum){var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]==="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]==="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]}));if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;console.log("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true};if(typeof XMLHttpRequest!=="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;Object.defineProperties(lazyArray,{length:{get:(function(){if(!this.lengthKnown){this.cacheLength()}return this._length})},chunkSize:{get:(function(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize})}});var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:(function(){return this.contents.length})}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach((function(key){var fn=node.stream_ops[key];stream_ops[key]=function forceLoadLazyFile(){if(!FS.forceLoadFile(node)){throw new FS.ErrnoError(ERRNO_CODES.EIO)}return fn.apply(null,arguments)}}));stream_ops.read=function stream_ops_read(stream,buffer,offset,length,position){if(!FS.forceLoadFile(node)){throw new FS.ErrnoError(ERRNO_CODES.EIO)}var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);assert(size>=0);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size};node.stream_ops=stream_ops;return node}),createPreloadedFile:(function(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish){Browser.init();var fullname=name?PATH.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency("cp "+fullname);function processData(byteArray){function finish(byteArray){if(preFinish)preFinish();if(!dontCreateFile){FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}if(onload)onload();removeRunDependency(dep)}var handled=false;Module["preloadPlugins"].forEach((function(plugin){if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,(function(){if(onerror)onerror();removeRunDependency(dep)}));handled=true}}));if(!handled)finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){Browser.asyncLoad(url,(function(byteArray){processData(byteArray)}),onerror)}else{processData(url)}}),indexedDB:(function(){return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB}),DB_NAME:(function(){return"EM_FS_"+window.location.pathname}),DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:(function(paths,onload,onerror){onload=onload||(function(){});onerror=onerror||(function(){});var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=function openRequest_onupgradeneeded(){console.log("creating db");var db=openRequest.result;db.createObjectStore(FS.DB_STORE_NAME)};openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;var transaction=db.transaction([FS.DB_STORE_NAME],"readwrite");var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach((function(path){var putRequest=files.put(FS.analyzePath(path).object.contents,path);putRequest.onsuccess=function putRequest_onsuccess(){ok++;if(ok+fail==total)finish()};putRequest.onerror=function putRequest_onerror(){fail++;if(ok+fail==total)finish()}}));transaction.onerror=onerror};openRequest.onerror=onerror}),loadFilesFromDB:(function(paths,onload,onerror){onload=onload||(function(){});onerror=onerror||(function(){});var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=onerror;openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;try{var transaction=db.transaction([FS.DB_STORE_NAME],"readonly")}catch(e){onerror(e);return}var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach((function(path){var getRequest=files.get(path);getRequest.onsuccess=function getRequest_onsuccess(){if(FS.analyzePath(path).exists){FS.unlink(path)}FS.createDataFile(PATH.dirname(path),PATH.basename(path),getRequest.result,true,true,true);ok++;if(ok+fail==total)finish()};getRequest.onerror=function getRequest_onerror(){fail++;if(ok+fail==total)finish()}}));transaction.onerror=onerror};openRequest.onerror=onerror})};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:(function(dirfd,path){if(path[0]!=="/"){var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=FS.getStream(dirfd);if(!dirstream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);dir=dirstream.path}path=PATH.join2(dir,path)}return path}),doStat:(function(func,path,buf){try{var stat=func(path)}catch(e){if(e&&e.node&&PATH.normalize(path)!==PATH.normalize(FS.getPath(e.node))){return-ERRNO_CODES.ENOTDIR}throw e}HEAP32[buf>>2]=stat.dev;HEAP32[buf+4>>2]=0;HEAP32[buf+8>>2]=stat.ino;HEAP32[buf+12>>2]=stat.mode;HEAP32[buf+16>>2]=stat.nlink;HEAP32[buf+20>>2]=stat.uid;HEAP32[buf+24>>2]=stat.gid;HEAP32[buf+28>>2]=stat.rdev;HEAP32[buf+32>>2]=0;HEAP32[buf+36>>2]=stat.size;HEAP32[buf+40>>2]=4096;HEAP32[buf+44>>2]=stat.blocks;HEAP32[buf+48>>2]=stat.atime.getTime()/1e3|0;HEAP32[buf+52>>2]=0;HEAP32[buf+56>>2]=stat.mtime.getTime()/1e3|0;HEAP32[buf+60>>2]=0;HEAP32[buf+64>>2]=stat.ctime.getTime()/1e3|0;HEAP32[buf+68>>2]=0;HEAP32[buf+72>>2]=stat.ino;return 0}),doMsync:(function(addr,stream,len,flags){var buffer=new Uint8Array(HEAPU8.subarray(addr,addr+len));FS.msync(stream,buffer,0,len,flags)}),doMkdir:(function(path,mode){path=PATH.normalize(path);if(path[path.length-1]==="/")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0}),doMknod:(function(path,mode,dev){switch(mode&61440){case 32768:case 8192:case 24576:case 4096:case 49152:break;default:return-ERRNO_CODES.EINVAL}FS.mknod(path,mode,dev);return 0}),doReadlink:(function(path,buf,bufsize){if(bufsize<=0)return-ERRNO_CODES.EINVAL;var ret=FS.readlink(path);var len=Math.min(bufsize,lengthBytesUTF8(ret));var endChar=HEAP8[buf+len];stringToUTF8(ret,buf,bufsize+1);HEAP8[buf+len]=endChar;return len}),doAccess:(function(path,amode){if(amode&~7){return-ERRNO_CODES.EINVAL}var node;var lookup=FS.lookupPath(path,{follow:true});node=lookup.node;var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-ERRNO_CODES.EACCES}return 0}),doDup:(function(path,flags,suggestFD){var suggest=FS.getStream(suggestFD);if(suggest)FS.close(suggest);return FS.open(path,flags,0,suggestFD,suggestFD).fd}),doReadv:(function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break}return ret}),doWritev:(function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr}return ret}),varargs:0,get:(function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret}),getStr:(function(){var ret=Pointer_stringify(SYSCALLS.get());return ret}),getStreamFromFD:(function(){var stream=FS.getStream(SYSCALLS.get());if(!stream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);return stream}),getSocketFromFD:(function(){var socket=SOCKFS.getSocket(SYSCALLS.get());if(!socket)throw new FS.ErrnoError(ERRNO_CODES.EBADF);return socket}),getSocketAddress:(function(allowNull){var addrp=SYSCALLS.get(),addrlen=SYSCALLS.get();if(allowNull&&addrp===0)return null;var info=__read_sockaddr(addrp,addrlen);if(info.errno)throw new FS.ErrnoError(info.errno);info.addr=DNS.lookup_addr(info.addr)||info.addr;return info}),get64:(function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low}),getZero:(function(){assert(SYSCALLS.get()===0)})};function ___syscall10(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr();FS.unlink(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var SOCKFS={mount:(function(mount){Module["websocket"]=Module["websocket"]&&"object"===typeof Module["websocket"]?Module["websocket"]:{};Module["websocket"]._callbacks={};Module["websocket"]["on"]=(function(event,callback){if("function"===typeof callback){this._callbacks[event]=callback}return this});Module["websocket"].emit=(function(event,param){if("function"===typeof this._callbacks[event]){this._callbacks[event].call(this,param)}});return FS.createNode(null,"/",16384|511,0)}),createSocket:(function(family,type,protocol){var streaming=type==1;if(protocol){assert(streaming==(protocol==6))}var sock={family:family,type:type,protocol:protocol,server:null,error:null,peers:{},pending:[],recv_queue:[],sock_ops:SOCKFS.websocket_sock_ops};var name=SOCKFS.nextname();var node=FS.createNode(SOCKFS.root,name,49152,0);node.sock=sock;var stream=FS.createStream({path:name,node:node,flags:FS.modeStringToFlags("r+"),seekable:false,stream_ops:SOCKFS.stream_ops});sock.stream=stream;return sock}),getSocket:(function(fd){var stream=FS.getStream(fd);if(!stream||!FS.isSocket(stream.node.mode)){return null}return stream.node.sock}),stream_ops:{poll:(function(stream){var sock=stream.node.sock;return sock.sock_ops.poll(sock)}),ioctl:(function(stream,request,varargs){var sock=stream.node.sock;return sock.sock_ops.ioctl(sock,request,varargs)}),read:(function(stream,buffer,offset,length,position){var sock=stream.node.sock;var msg=sock.sock_ops.recvmsg(sock,length);if(!msg){return 0}buffer.set(msg.buffer,offset);return msg.buffer.length}),write:(function(stream,buffer,offset,length,position){var sock=stream.node.sock;return sock.sock_ops.sendmsg(sock,buffer,offset,length)}),close:(function(stream){var sock=stream.node.sock;sock.sock_ops.close(sock)})},nextname:(function(){if(!SOCKFS.nextname.current){SOCKFS.nextname.current=0}return"socket["+SOCKFS.nextname.current++ +"]"}),websocket_sock_ops:{createPeer:(function(sock,addr,port){var ws;if(typeof addr==="object"){ws=addr;addr=null;port=null}if(ws){if(ws._socket){addr=ws._socket.remoteAddress;port=ws._socket.remotePort}else{var result=/ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);if(!result){throw new Error("WebSocket URL must be in the format ws(s)://address:port")}addr=result[1];port=parseInt(result[2],10)}}else{try{var runtimeConfig=Module["websocket"]&&"object"===typeof Module["websocket"];var url="ws:#".replace("#","//");if(runtimeConfig){if("string"===typeof Module["websocket"]["url"]){url=Module["websocket"]["url"]}}if(url==="ws://"||url==="wss://"){var parts=addr.split("/");url=url+parts[0]+":"+port+"/"+parts.slice(1).join("/")}var subProtocols="binary";if(runtimeConfig){if("string"===typeof Module["websocket"]["subprotocol"]){subProtocols=Module["websocket"]["subprotocol"]}}subProtocols=subProtocols.replace(/^ +| +$/g,"").split(/ *, */);var opts=ENVIRONMENT_IS_NODE?{"protocol":subProtocols.toString()}:subProtocols;if(runtimeConfig&&null===Module["websocket"]["subprotocol"]){subProtocols="null";opts=undefined}var WebSocketConstructor;if(ENVIRONMENT_IS_NODE){WebSocketConstructor=require("ws")}else if(ENVIRONMENT_IS_WEB){WebSocketConstructor=window["WebSocket"]}else{WebSocketConstructor=WebSocket}ws=new WebSocketConstructor(url,opts);ws.binaryType="arraybuffer"}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH)}}var peer={addr:addr,port:port,socket:ws,dgram_send_queue:[]};SOCKFS.websocket_sock_ops.addPeer(sock,peer);SOCKFS.websocket_sock_ops.handlePeerEvents(sock,peer);if(sock.type===2&&typeof sock.sport!=="undefined"){peer.dgram_send_queue.push(new Uint8Array([255,255,255,255,"p".charCodeAt(0),"o".charCodeAt(0),"r".charCodeAt(0),"t".charCodeAt(0),(sock.sport&65280)>>8,sock.sport&255]))}return peer}),getPeer:(function(sock,addr,port){return sock.peers[addr+":"+port]}),addPeer:(function(sock,peer){sock.peers[peer.addr+":"+peer.port]=peer}),removePeer:(function(sock,peer){delete sock.peers[peer.addr+":"+peer.port]}),handlePeerEvents:(function(sock,peer){var first=true;var handleOpen=(function(){Module["websocket"].emit("open",sock.stream.fd);try{var queued=peer.dgram_send_queue.shift();while(queued){peer.socket.send(queued);queued=peer.dgram_send_queue.shift()}}catch(e){peer.socket.close()}});function handleMessage(data){assert(typeof data!=="string"&&data.byteLength!==undefined);if(data.byteLength==0){return}data=new Uint8Array(data);var wasfirst=first;first=false;if(wasfirst&&data.length===10&&data[0]===255&&data[1]===255&&data[2]===255&&data[3]===255&&data[4]==="p".charCodeAt(0)&&data[5]==="o".charCodeAt(0)&&data[6]==="r".charCodeAt(0)&&data[7]==="t".charCodeAt(0)){var newport=data[8]<<8|data[9];SOCKFS.websocket_sock_ops.removePeer(sock,peer);peer.port=newport;SOCKFS.websocket_sock_ops.addPeer(sock,peer);return}sock.recv_queue.push({addr:peer.addr,port:peer.port,data:data});Module["websocket"].emit("message",sock.stream.fd)}if(ENVIRONMENT_IS_NODE){peer.socket.on("open",handleOpen);peer.socket.on("message",(function(data,flags){if(!flags.binary){return}handleMessage((new Uint8Array(data)).buffer)}));peer.socket.on("close",(function(){Module["websocket"].emit("close",sock.stream.fd)}));peer.socket.on("error",(function(error){sock.error=ERRNO_CODES.ECONNREFUSED;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])}))}else{peer.socket.onopen=handleOpen;peer.socket.onclose=(function(){Module["websocket"].emit("close",sock.stream.fd)});peer.socket.onmessage=function peer_socket_onmessage(event){handleMessage(event.data)};peer.socket.onerror=(function(error){sock.error=ERRNO_CODES.ECONNREFUSED;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])})}}),poll:(function(sock){if(sock.type===1&&sock.server){return sock.pending.length?64|1:0}var mask=0;var dest=sock.type===1?SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport):null;if(sock.recv_queue.length||!dest||dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=64|1}if(!dest||dest&&dest.socket.readyState===dest.socket.OPEN){mask|=4}if(dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=16}return mask}),ioctl:(function(sock,request,arg){switch(request){case 21531:var bytes=0;if(sock.recv_queue.length){bytes=sock.recv_queue[0].data.length}HEAP32[arg>>2]=bytes;return 0;default:return ERRNO_CODES.EINVAL}}),close:(function(sock){if(sock.server){try{sock.server.close()}catch(e){}sock.server=null}var peers=Object.keys(sock.peers);for(var i=0;i<peers.length;i++){var peer=sock.peers[peers[i]];try{peer.socket.close()}catch(e){}SOCKFS.websocket_sock_ops.removePeer(sock,peer)}return 0}),bind:(function(sock,addr,port){if(typeof sock.saddr!=="undefined"||typeof sock.sport!=="undefined"){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}sock.saddr=addr;sock.sport=port;if(sock.type===2){if(sock.server){sock.server.close();sock.server=null}try{sock.sock_ops.listen(sock,0)}catch(e){if(!(e instanceof FS.ErrnoError))throw e;if(e.errno!==ERRNO_CODES.EOPNOTSUPP)throw e}}}),connect:(function(sock,addr,port){if(sock.server){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}if(typeof sock.daddr!=="undefined"&&typeof sock.dport!=="undefined"){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(dest){if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(ERRNO_CODES.EALREADY)}else{throw new FS.ErrnoError(ERRNO_CODES.EISCONN)}}}var peer=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port);sock.daddr=peer.addr;sock.dport=peer.port;throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS)}),listen:(function(sock,backlog){if(!ENVIRONMENT_IS_NODE){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}if(sock.server){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var WebSocketServer=require("ws").Server;var host=sock.saddr;sock.server=new WebSocketServer({host:host,port:sock.sport});Module["websocket"].emit("listen",sock.stream.fd);sock.server.on("connection",(function(ws){if(sock.type===1){var newsock=SOCKFS.createSocket(sock.family,sock.type,sock.protocol);var peer=SOCKFS.websocket_sock_ops.createPeer(newsock,ws);newsock.daddr=peer.addr;newsock.dport=peer.port;sock.pending.push(newsock);Module["websocket"].emit("connection",newsock.stream.fd)}else{SOCKFS.websocket_sock_ops.createPeer(sock,ws);Module["websocket"].emit("connection",sock.stream.fd)}}));sock.server.on("closed",(function(){Module["websocket"].emit("close",sock.stream.fd);sock.server=null}));sock.server.on("error",(function(error){sock.error=ERRNO_CODES.EHOSTUNREACH;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"EHOSTUNREACH: Host is unreachable"])}))}),accept:(function(listensock){if(!listensock.server){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var newsock=listensock.pending.shift();newsock.stream.flags=listensock.stream.flags;return newsock}),getname:(function(sock,peer){var addr,port;if(peer){if(sock.daddr===undefined||sock.dport===undefined){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}addr=sock.daddr;port=sock.dport}else{addr=sock.saddr||0;port=sock.sport||0}return{addr:addr,port:port}}),sendmsg:(function(sock,buffer,offset,length,addr,port){if(sock.type===2){if(addr===undefined||port===undefined){addr=sock.daddr;port=sock.dport}if(addr===undefined||port===undefined){throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ)}}else{addr=sock.daddr;port=sock.dport}var dest=SOCKFS.websocket_sock_ops.getPeer(sock,addr,port);if(sock.type===1){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}else if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}if(ArrayBuffer.isView(buffer)){offset+=buffer.byteOffset;buffer=buffer.buffer}var data;data=buffer.slice(offset,offset+length);if(sock.type===2){if(!dest||dest.socket.readyState!==dest.socket.OPEN){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){dest=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port)}dest.dgram_send_queue.push(data);return length}}try{dest.socket.send(data);return length}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}}),recvmsg:(function(sock,length){if(sock.type===1&&sock.server){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}var queued=sock.recv_queue.shift();if(!queued){if(sock.type===1){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(!dest){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}else if(dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){return null}else{throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}else{throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}var queuedLength=queued.data.byteLength||queued.data.length;var queuedOffset=queued.data.byteOffset||0;var queuedBuffer=queued.data.buffer||queued.data;var bytesRead=Math.min(length,queuedLength);var res={buffer:new Uint8Array(queuedBuffer,queuedOffset,bytesRead),addr:queued.addr,port:queued.port};if(sock.type===1&&bytesRead<queuedLength){var bytesRemaining=queuedLength-bytesRead;queued.data=new Uint8Array(queuedBuffer,queuedOffset+bytesRead,bytesRemaining);sock.recv_queue.unshift(queued)}return res})}};function __inet_pton4_raw(str){var b=str.split(".");for(var i=0;i<4;i++){var tmp=Number(b[i]);if(isNaN(tmp))return null;b[i]=tmp}return(b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0}function __inet_pton6_raw(str){var words;var w,offset,z;var valid6regx=/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;var parts=[];if(!valid6regx.test(str)){return null}if(str==="::"){return[0,0,0,0,0,0,0,0]}if(str.indexOf("::")===0){str=str.replace("::","Z:")}else{str=str.replace("::",":Z:")}if(str.indexOf(".")>0){str=str.replace(new RegExp("[.]","g"),":");words=str.split(":");words[words.length-4]=parseInt(words[words.length-4])+parseInt(words[words.length-3])*256;words[words.length-3]=parseInt(words[words.length-2])+parseInt(words[words.length-1])*256;words=words.slice(0,words.length-2)}else{words=str.split(":")}offset=0;z=0;for(w=0;w<words.length;w++){if(typeof words[w]==="string"){if(words[w]==="Z"){for(z=0;z<8-words.length+1;z++){parts[w+z]=0}offset=z-1}else{parts[w+offset]=_htons(parseInt(words[w],16))}}else{parts[w+offset]=words[w]}}return[parts[1]<<16|parts[0],parts[3]<<16|parts[2],parts[5]<<16|parts[4],parts[7]<<16|parts[6]]}var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:(function(name){var res=__inet_pton4_raw(name);if(res!==null){return name}res=__inet_pton6_raw(name);if(res!==null){return name}var addr;if(DNS.address_map.addrs[name]){addr=DNS.address_map.addrs[name]}else{var id=DNS.address_map.id++;assert(id<65535,"exceeded max address mappings of 65535");addr="172.29."+(id&255)+"."+(id&65280);DNS.address_map.names[addr]=name;DNS.address_map.addrs[name]=addr}return addr}),lookup_addr:(function(addr){if(DNS.address_map.names[addr]){return DNS.address_map.names[addr]}return null})};function __inet_ntop4_raw(addr){return(addr&255)+"."+(addr>>8&255)+"."+(addr>>16&255)+"."+(addr>>24&255)}function __inet_ntop6_raw(ints){var str="";var word=0;var longest=0;var lastzero=0;var zstart=0;var len=0;var i=0;var parts=[ints[0]&65535,ints[0]>>16,ints[1]&65535,ints[1]>>16,ints[2]&65535,ints[2]>>16,ints[3]&65535,ints[3]>>16];var hasipv4=true;var v4part="";for(i=0;i<5;i++){if(parts[i]!==0){hasipv4=false;break}}if(hasipv4){v4part=__inet_ntop4_raw(parts[6]|parts[7]<<16);if(parts[5]===-1){str="::ffff:";str+=v4part;return str}if(parts[5]===0){str="::";if(v4part==="0.0.0.0")v4part="";if(v4part==="0.0.0.1")v4part="1";str+=v4part;return str}}for(word=0;word<8;word++){if(parts[word]===0){if(word-lastzero>1){len=0}lastzero=word;len++}if(len>longest){longest=len;zstart=word-longest+1}}for(word=0;word<8;word++){if(longest>1){if(parts[word]===0&&word>=zstart&&word<zstart+longest){if(word===zstart){str+=":";if(zstart===0)str+=":"}continue}}str+=Number(_ntohs(parts[word]&65535)).toString(16);str+=word<7?":":""}return str}function __read_sockaddr(sa,salen){var family=HEAP16[sa>>1];var port=_ntohs(HEAP16[sa+2>>1]);var addr;switch(family){case 2:if(salen!==16){return{errno:ERRNO_CODES.EINVAL}}addr=HEAP32[sa+4>>2];addr=__inet_ntop4_raw(addr);break;case 10:if(salen!==28){return{errno:ERRNO_CODES.EINVAL}}addr=[HEAP32[sa+8>>2],HEAP32[sa+12>>2],HEAP32[sa+16>>2],HEAP32[sa+20>>2]];addr=__inet_ntop6_raw(addr);break;default:return{errno:ERRNO_CODES.EAFNOSUPPORT}}return{family:family,addr:addr,port:port}}function __write_sockaddr(sa,family,addr,port){switch(family){case 2:addr=__inet_pton4_raw(addr);HEAP16[sa>>1]=family;HEAP32[sa+4>>2]=addr;HEAP16[sa+2>>1]=_htons(port);break;case 10:addr=__inet_pton6_raw(addr);HEAP32[sa>>2]=family;HEAP32[sa+8>>2]=addr[0];HEAP32[sa+12>>2]=addr[1];HEAP32[sa+16>>2]=addr[2];HEAP32[sa+20>>2]=addr[3];HEAP16[sa+2>>1]=_htons(port);HEAP32[sa+4>>2]=0;HEAP32[sa+24>>2]=0;break;default:return{errno:ERRNO_CODES.EAFNOSUPPORT}}return{}}function ___syscall102(which,varargs){SYSCALLS.varargs=varargs;try{var call=SYSCALLS.get(),socketvararg=SYSCALLS.get();SYSCALLS.varargs=socketvararg;switch(call){case 1:{var domain=SYSCALLS.get(),type=SYSCALLS.get(),protocol=SYSCALLS.get();var sock=SOCKFS.createSocket(domain,type,protocol);assert(sock.stream.fd<64);return sock.stream.fd};case 2:{var sock=SYSCALLS.getSocketFromFD(),info=SYSCALLS.getSocketAddress();sock.sock_ops.bind(sock,info.addr,info.port);return 0};case 3:{var sock=SYSCALLS.getSocketFromFD(),info=SYSCALLS.getSocketAddress();sock.sock_ops.connect(sock,info.addr,info.port);return 0};case 4:{var sock=SYSCALLS.getSocketFromFD(),backlog=SYSCALLS.get();sock.sock_ops.listen(sock,backlog);return 0};case 5:{var sock=SYSCALLS.getSocketFromFD(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();var newsock=sock.sock_ops.accept(sock);if(addr){var res=__write_sockaddr(addr,newsock.family,DNS.lookup_name(newsock.daddr),newsock.dport);assert(!res.errno)}return newsock.stream.fd};case 6:{var sock=SYSCALLS.getSocketFromFD(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();var res=__write_sockaddr(addr,sock.family,DNS.lookup_name(sock.saddr||"0.0.0.0"),sock.sport);assert(!res.errno);return 0};case 7:{var sock=SYSCALLS.getSocketFromFD(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();if(!sock.daddr){return-ERRNO_CODES.ENOTCONN}var res=__write_sockaddr(addr,sock.family,DNS.lookup_name(sock.daddr),sock.dport);assert(!res.errno);return 0};case 11:{var sock=SYSCALLS.getSocketFromFD(),message=SYSCALLS.get(),length=SYSCALLS.get(),flags=SYSCALLS.get(),dest=SYSCALLS.getSocketAddress(true);if(!dest){return FS.write(sock.stream,HEAP8,message,length)}else{return sock.sock_ops.sendmsg(sock,HEAP8,message,length,dest.addr,dest.port)}};case 12:{var sock=SYSCALLS.getSocketFromFD(),buf=SYSCALLS.get(),len=SYSCALLS.get(),flags=SYSCALLS.get(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();var msg=sock.sock_ops.recvmsg(sock,len);if(!msg)return 0;if(addr){var res=__write_sockaddr(addr,sock.family,DNS.lookup_name(msg.addr),msg.port);assert(!res.errno)}HEAPU8.set(msg.buffer,buf);return msg.buffer.byteLength};case 14:{return-ERRNO_CODES.ENOPROTOOPT};case 15:{var sock=SYSCALLS.getSocketFromFD(),level=SYSCALLS.get(),optname=SYSCALLS.get(),optval=SYSCALLS.get(),optlen=SYSCALLS.get();if(level===1){if(optname===4){HEAP32[optval>>2]=sock.error;HEAP32[optlen>>2]=4;sock.error=null;return 0}}return-ERRNO_CODES.ENOPROTOOPT};case 16:{var sock=SYSCALLS.getSocketFromFD(),message=SYSCALLS.get(),flags=SYSCALLS.get();var iov=HEAP32[message+8>>2];var num=HEAP32[message+12>>2];var addr,port;var name=HEAP32[message>>2];var namelen=HEAP32[message+4>>2];if(name){var info=__read_sockaddr(name,namelen);if(info.errno)return-info.errno;port=info.port;addr=DNS.lookup_addr(info.addr)||info.addr}var total=0;for(var i=0;i<num;i++){total+=HEAP32[iov+(8*i+4)>>2]}var view=new Uint8Array(total);var offset=0;for(var i=0;i<num;i++){var iovbase=HEAP32[iov+(8*i+0)>>2];var iovlen=HEAP32[iov+(8*i+4)>>2];for(var j=0;j<iovlen;j++){view[offset++]=HEAP8[iovbase+j>>0]}}return sock.sock_ops.sendmsg(sock,view,0,total,addr,port)};case 17:{var sock=SYSCALLS.getSocketFromFD(),message=SYSCALLS.get(),flags=SYSCALLS.get();var iov=HEAP32[message+8>>2];var num=HEAP32[message+12>>2];var total=0;for(var i=0;i<num;i++){total+=HEAP32[iov+(8*i+4)>>2]}var msg=sock.sock_ops.recvmsg(sock,total);if(!msg)return 0;var name=HEAP32[message>>2];if(name){var res=__write_sockaddr(name,sock.family,DNS.lookup_name(msg.addr),msg.port);assert(!res.errno)}var bytesRead=0;var bytesRemaining=msg.buffer.byteLength;for(var i=0;bytesRemaining>0&&i<num;i++){var iovbase=HEAP32[iov+(8*i+0)>>2];var iovlen=HEAP32[iov+(8*i+4)>>2];if(!iovlen){continue}var length=Math.min(iovlen,bytesRemaining);var buf=msg.buffer.subarray(bytesRead,bytesRead+length);HEAPU8.set(buf,iovbase+bytesRead);bytesRead+=length;bytesRemaining-=length}return bytesRead};default:abort("unsupported socketcall syscall "+call)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall122(which,varargs){SYSCALLS.varargs=varargs;try{var buf=SYSCALLS.get();if(!buf)return-ERRNO_CODES.EFAULT;var layout={"sysname":0,"nodename":65,"domainname":325,"machine":260,"version":195,"release":130,"__size__":390};function copyString(element,value){var offset=layout[element];writeAsciiToMemory(value,buf+offset)}copyString("sysname","Emscripten");copyString("nodename","emscripten");copyString("release","1.0");copyString("version","#1");copyString("machine","x86-JS");return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();var offset=offset_low;FS.llseek(stream,offset,whence);HEAP32[result>>2]=stream.position;if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall142(which,varargs){SYSCALLS.varargs=varargs;try{var nfds=SYSCALLS.get(),readfds=SYSCALLS.get(),writefds=SYSCALLS.get(),exceptfds=SYSCALLS.get(),timeout=SYSCALLS.get();assert(nfds<=64,"nfds must be less than or equal to 64");assert(!exceptfds,"exceptfds not supported");var total=0;var srcReadLow=readfds?HEAP32[readfds>>2]:0,srcReadHigh=readfds?HEAP32[readfds+4>>2]:0;var srcWriteLow=writefds?HEAP32[writefds>>2]:0,srcWriteHigh=writefds?HEAP32[writefds+4>>2]:0;var srcExceptLow=exceptfds?HEAP32[exceptfds>>2]:0,srcExceptHigh=exceptfds?HEAP32[exceptfds+4>>2]:0;var dstReadLow=0,dstReadHigh=0;var dstWriteLow=0,dstWriteHigh=0;var dstExceptLow=0,dstExceptHigh=0;var allLow=(readfds?HEAP32[readfds>>2]:0)|(writefds?HEAP32[writefds>>2]:0)|(exceptfds?HEAP32[exceptfds>>2]:0);var allHigh=(readfds?HEAP32[readfds+4>>2]:0)|(writefds?HEAP32[writefds+4>>2]:0)|(exceptfds?HEAP32[exceptfds+4>>2]:0);function check(fd,low,high,val){return fd<32?low&val:high&val}for(var fd=0;fd<nfds;fd++){var mask=1<<fd%32;if(!check(fd,allLow,allHigh,mask)){continue}var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);var flags=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){flags=stream.stream_ops.poll(stream)}if(flags&1&&check(fd,srcReadLow,srcReadHigh,mask)){fd<32?dstReadLow=dstReadLow|mask:dstReadHigh=dstReadHigh|mask;total++}if(flags&4&&check(fd,srcWriteLow,srcWriteHigh,mask)){fd<32?dstWriteLow=dstWriteLow|mask:dstWriteHigh=dstWriteHigh|mask;total++}if(flags&2&&check(fd,srcExceptLow,srcExceptHigh,mask)){fd<32?dstExceptLow=dstExceptLow|mask:dstExceptHigh=dstExceptHigh|mask;total++}}if(readfds){HEAP32[readfds>>2]=dstReadLow;HEAP32[readfds+4>>2]=dstReadHigh}if(writefds){HEAP32[writefds>>2]=dstWriteLow;HEAP32[writefds+4>>2]=dstWriteHigh}if(exceptfds){HEAP32[exceptfds>>2]=dstExceptLow;HEAP32[exceptfds+4>>2]=dstExceptHigh}return total}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall145(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();return SYSCALLS.doReadv(stream,iov,iovcnt)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();return SYSCALLS.doWritev(stream,iov,iovcnt)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall15(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),mode=SYSCALLS.get();FS.chmod(path,mode);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall168(which,varargs){SYSCALLS.varargs=varargs;try{var fds=SYSCALLS.get(),nfds=SYSCALLS.get(),timeout=SYSCALLS.get();var nonzero=0;for(var i=0;i<nfds;i++){var pollfd=fds+8*i;var fd=HEAP32[pollfd>>2];var events=HEAP16[pollfd+4>>1];var mask=32;var stream=FS.getStream(fd);if(stream){mask=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){mask=stream.stream_ops.poll(stream)}}mask&=events|8|16;if(mask)nonzero++;HEAP16[pollfd+6>>1]=mask}return nonzero}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall183(which,varargs){SYSCALLS.varargs=varargs;try{var buf=SYSCALLS.get(),size=SYSCALLS.get();if(size===0)return-ERRNO_CODES.EINVAL;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd);if(size<cwdLengthInBytes+1)return-ERRNO_CODES.ERANGE;stringToUTF8(cwd,buf,size);return buf}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall192(which,varargs){SYSCALLS.varargs=varargs;try{var addr=SYSCALLS.get(),len=SYSCALLS.get(),prot=SYSCALLS.get(),flags=SYSCALLS.get(),fd=SYSCALLS.get(),off=SYSCALLS.get();off<<=12;var ptr;var allocated=false;if(fd===-1){ptr=_memalign(PAGE_SIZE,len);if(!ptr)return-ERRNO_CODES.ENOMEM;_memset(ptr,0,len);allocated=true}else{var info=FS.getStream(fd);if(!info)return-ERRNO_CODES.EBADF;var res=FS.mmap(info,HEAPU8,addr,len,off,prot,flags);ptr=res.ptr;allocated=res.allocated}SYSCALLS.mappings[ptr]={malloc:ptr,len:len,allocated:allocated,fd:fd,flags:flags};return ptr}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall193(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),zero=SYSCALLS.getZero(),length=SYSCALLS.get64();FS.truncate(path,length);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall195(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),buf=SYSCALLS.get();return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall196(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),buf=SYSCALLS.get();return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall197(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get();return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall202(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall199(){return ___syscall202.apply(null,arguments)}function ___syscall220(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),dirp=SYSCALLS.get(),count=SYSCALLS.get();if(!stream.getdents){stream.getdents=FS.readdir(stream.path)}var pos=0;while(stream.getdents.length>0&&pos+268<=count){var id;var type;var name=stream.getdents.pop();if(name[0]==="."){id=1;type=4}else{var child=FS.lookupNode(stream.node,name);id=child.id;type=FS.isChrdev(child.mode)?2:FS.isDir(child.mode)?4:FS.isLink(child.mode)?10:8}HEAP32[dirp+pos>>2]=id;HEAP32[dirp+pos+4>>2]=stream.position;HEAP16[dirp+pos+8>>1]=268;HEAP8[dirp+pos+10>>0]=type;stringToUTF8(name,dirp+pos+11,256);pos+=268}return pos}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall221(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),cmd=SYSCALLS.get();switch(cmd){case 0:{var arg=SYSCALLS.get();if(arg<0){return-ERRNO_CODES.EINVAL}var newStream;newStream=FS.open(stream.path,stream.flags,0,arg);return newStream.fd};case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=SYSCALLS.get();stream.flags|=arg;return 0};case 12:case 12:{var arg=SYSCALLS.get();var offset=0;HEAP16[arg+offset>>1]=2;return 0};case 13:case 14:case 13:case 14:return 0;case 16:case 8:return-ERRNO_CODES.EINVAL;case 9:___setErrNo(ERRNO_CODES.EINVAL);return-1;default:{return-ERRNO_CODES.EINVAL}}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall268(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),size=SYSCALLS.get(),buf=SYSCALLS.get();assert(size===64);HEAP32[buf+4>>2]=4096;HEAP32[buf+40>>2]=4096;HEAP32[buf+8>>2]=1e6;HEAP32[buf+12>>2]=5e5;HEAP32[buf+16>>2]=5e5;HEAP32[buf+20>>2]=FS.nextInode;HEAP32[buf+24>>2]=1e6;HEAP32[buf+28>>2]=42;HEAP32[buf+44>>2]=2;HEAP32[buf+36>>2]=255;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall3(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get(),count=SYSCALLS.get();return FS.read(stream,HEAP8,buf,count)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall33(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),amode=SYSCALLS.get();return SYSCALLS.doAccess(path,amode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall38(which,varargs){SYSCALLS.varargs=varargs;try{var old_path=SYSCALLS.getStr(),new_path=SYSCALLS.getStr();FS.rename(old_path,new_path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall39(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),mode=SYSCALLS.get();return SYSCALLS.doMkdir(path,mode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall4(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get(),count=SYSCALLS.get();return FS.write(stream,HEAP8,buf,count)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall40(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr();FS.rmdir(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var PIPEFS={BUCKET_BUFFER_SIZE:8192,mount:(function(mount){return FS.createNode(null,"/",16384|511,0)}),createPipe:(function(){var pipe={buckets:[]};pipe.buckets.push({buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:0,roffset:0});var rName=PIPEFS.nextname();var wName=PIPEFS.nextname();var rNode=FS.createNode(PIPEFS.root,rName,4096,0);var wNode=FS.createNode(PIPEFS.root,wName,4096,0);rNode.pipe=pipe;wNode.pipe=pipe;var readableStream=FS.createStream({path:rName,node:rNode,flags:FS.modeStringToFlags("r"),seekable:false,stream_ops:PIPEFS.stream_ops});rNode.stream=readableStream;var writableStream=FS.createStream({path:wName,node:wNode,flags:FS.modeStringToFlags("w"),seekable:false,stream_ops:PIPEFS.stream_ops});wNode.stream=writableStream;return{readable_fd:readableStream.fd,writable_fd:writableStream.fd}}),stream_ops:{poll:(function(stream){var pipe=stream.node.pipe;if((stream.flags&2097155)===1){return 256|4}else{if(pipe.buckets.length>0){for(var i=0;i<pipe.buckets.length;i++){var bucket=pipe.buckets[i];if(bucket.offset-bucket.roffset>0){return 64|1}}}}return 0}),ioctl:(function(stream,request,varargs){return ERRNO_CODES.EINVAL}),read:(function(stream,buffer,offset,length,position){var pipe=stream.node.pipe;var currentLength=0;for(var i=0;i<pipe.buckets.length;i++){var bucket=pipe.buckets[i];currentLength+=bucket.offset-bucket.roffset}assert(buffer instanceof ArrayBuffer||ArrayBuffer.isView(buffer));var data=buffer.subarray(offset,offset+length);if(length<=0){return 0}if(currentLength==0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}var toRead=Math.min(currentLength,length);var totalRead=toRead;var toRemove=0;for(var i=0;i<pipe.buckets.length;i++){var currBucket=pipe.buckets[i];var bucketSize=currBucket.offset-currBucket.roffset;if(toRead<=bucketSize){var tmpSlice=currBucket.buffer.subarray(currBucket.roffset,currBucket.offset);if(toRead<bucketSize){tmpSlice=tmpSlice.subarray(0,toRead);currBucket.roffset+=toRead}else{toRemove++}data.set(tmpSlice);break}else{var tmpSlice=currBucket.buffer.subarray(currBucket.roffset,currBucket.offset);data.set(tmpSlice);data=data.subarray(tmpSlice.byteLength);toRead-=tmpSlice.byteLength;toRemove++}}if(toRemove&&toRemove==pipe.buckets.length){toRemove--;pipe.buckets[toRemove].offset=0;pipe.buckets[toRemove].roffset=0}pipe.buckets.splice(0,toRemove);return totalRead}),write:(function(stream,buffer,offset,length,position){var pipe=stream.node.pipe;assert(buffer instanceof ArrayBuffer||ArrayBuffer.isView(buffer));var data=buffer.subarray(offset,offset+length);var dataLen=data.byteLength;if(dataLen<=0){return 0}var currBucket=null;if(pipe.buckets.length==0){currBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:0,roffset:0};pipe.buckets.push(currBucket)}else{currBucket=pipe.buckets[pipe.buckets.length-1]}assert(currBucket.offset<=PIPEFS.BUCKET_BUFFER_SIZE);var freeBytesInCurrBuffer=PIPEFS.BUCKET_BUFFER_SIZE-currBucket.offset;if(freeBytesInCurrBuffer>=dataLen){currBucket.buffer.set(data,currBucket.offset);currBucket.offset+=dataLen;return dataLen}else if(freeBytesInCurrBuffer>0){currBucket.buffer.set(data.subarray(0,freeBytesInCurrBuffer),currBucket.offset);currBucket.offset+=freeBytesInCurrBuffer;data=data.subarray(freeBytesInCurrBuffer,data.byteLength)}var numBuckets=data.byteLength/PIPEFS.BUCKET_BUFFER_SIZE|0;var remElements=data.byteLength%PIPEFS.BUCKET_BUFFER_SIZE;for(var i=0;i<numBuckets;i++){var newBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:PIPEFS.BUCKET_BUFFER_SIZE,roffset:0};pipe.buckets.push(newBucket);newBucket.buffer.set(data.subarray(0,PIPEFS.BUCKET_BUFFER_SIZE));data=data.subarray(PIPEFS.BUCKET_BUFFER_SIZE,data.byteLength)}if(remElements>0){var newBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:data.byteLength,roffset:0};pipe.buckets.push(newBucket);newBucket.buffer.set(data)}return dataLen}),close:(function(stream){var pipe=stream.node.pipe;pipe.buckets=null})},nextname:(function(){if(!PIPEFS.nextname.current){PIPEFS.nextname.current=0}return"pipe["+PIPEFS.nextname.current++ +"]"})};function ___syscall42(which,varargs){SYSCALLS.varargs=varargs;try{var fdPtr=SYSCALLS.get();if(fdPtr==0){throw new FS.ErrnoError(ERRNO_CODES.EFAULT)}var res=PIPEFS.createPipe();HEAP32[fdPtr>>2]=res.readable_fd;HEAP32[fdPtr+4>>2]=res.writable_fd;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall5(which,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(),flags=SYSCALLS.get(),mode=SYSCALLS.get();var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),op=SYSCALLS.get();switch(op){case 21509:case 21505:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};case 21519:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;var argp=SYSCALLS.get();HEAP32[argp>>2]=0;return 0};case 21520:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return-ERRNO_CODES.EINVAL};case 21531:{var argp=SYSCALLS.get();return FS.ioctl(stream,op,argp)};case 21523:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};case 21524:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};default:abort("bad ioctl syscall "+op)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall63(which,varargs){SYSCALLS.varargs=varargs;try{var old=SYSCALLS.getStreamFromFD(),suggestFD=SYSCALLS.get();if(old.fd===suggestFD)return suggestFD;return SYSCALLS.doDup(old.path,old.flags,suggestFD)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall77(which,varargs){SYSCALLS.varargs=varargs;try{var who=SYSCALLS.get(),usage=SYSCALLS.get();_memset(usage,0,136);HEAP32[usage>>2]=1;HEAP32[usage+4>>2]=2;HEAP32[usage+8>>2]=3;HEAP32[usage+12>>2]=4;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall85(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),buf=SYSCALLS.get(),bufsize=SYSCALLS.get();return SYSCALLS.doReadlink(path,buf,bufsize)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall91(which,varargs){SYSCALLS.varargs=varargs;try{var addr=SYSCALLS.get(),len=SYSCALLS.get();var info=SYSCALLS.mappings[addr];if(!info)return 0;if(len===info.len){var stream=FS.getStream(info.fd);SYSCALLS.doMsync(addr,stream,len,info.flags);FS.munmap(stream);SYSCALLS.mappings[addr]=null;if(info.allocated){_free(info.malloc)}}return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___unlock(){}function _abort(){Module["abort"]()}function _atexit(func,arg){__ATEXIT__.unshift({func:func,arg:arg})}function _clock(){if(_clock.start===undefined)_clock.start=Date.now();return(Date.now()-_clock.start)*(1e6/1e3)|0}function _emscripten_get_now_res(){if(ENVIRONMENT_IS_NODE){return 1}else if(typeof dateNow!=="undefined"||(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&self["performance"]&&self["performance"]["now"]){return 1e3}else{return 1e3*1e3}}function _emscripten_get_now(){abort()}function _emscripten_get_now_is_monotonic(){return ENVIRONMENT_IS_NODE||typeof dateNow!=="undefined"||(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&self["performance"]&&self["performance"]["now"]}function _clock_getres(clk_id,res){var nsec;if(clk_id===0){nsec=1e3*1e3}else if(clk_id===1&&_emscripten_get_now_is_monotonic()){nsec=_emscripten_get_now_res()}else{___setErrNo(ERRNO_CODES.EINVAL);return-1}HEAP32[res>>2]=nsec/1e9|0;HEAP32[res+4>>2]=nsec;return 0}function _clock_gettime(clk_id,tp){var now;if(clk_id===0){now=Date.now()}else if(clk_id===1&&_emscripten_get_now_is_monotonic()){now=_emscripten_get_now()}else{___setErrNo(ERRNO_CODES.EINVAL);return-1}HEAP32[tp>>2]=now/1e3|0;HEAP32[tp+4>>2]=now%1e3*1e3*1e3|0;return 0}function _difftime(time1,time0){return time1-time0}var DLFCN={error:null,errorMsg:null,loadedLibs:{},loadedLibNames:{}};function _dlclose(handle){if(!DLFCN.loadedLibs[handle]){DLFCN.errorMsg="Tried to dlclose() unopened handle: "+handle;return 1}else{var lib_record=DLFCN.loadedLibs[handle];if(--lib_record.refcount==0){if(lib_record.module.cleanups){lib_record.module.cleanups.forEach((function(cleanup){cleanup()}))}delete DLFCN.loadedLibNames[lib_record.name];delete DLFCN.loadedLibs[handle]}return 0}}function _dlopen(filename,flag){abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/kripken/emscripten/wiki/Linking");var searchpaths=[];if(filename===0){filename="__self__"}else{var strfilename=Pointer_stringify(filename);var isValidFile=(function(filename){var target=FS.findObject(filename);return target&&!target.isFolder&&!target.isDevice});if(isValidFile(strfilename)){filename=strfilename}else{if(ENV["LD_LIBRARY_PATH"]){searchpaths=ENV["LD_LIBRARY_PATH"].split(":")}for(var ident in searchpaths){var searchfile=PATH.join2(searchpaths[ident],strfilename);if(isValidFile(searchfile)){filename=searchfile;break}}}}if(DLFCN.loadedLibNames[filename]){var handle=DLFCN.loadedLibNames[filename];DLFCN.loadedLibs[handle].refcount++;return handle}var lib_module;if(filename==="__self__"){var handle=-1;lib_module=Module}else{if(Module["preloadedWasm"]!==undefined&&Module["preloadedWasm"][filename]!==undefined){lib_module=Module["preloadedWasm"][filename]}else{var target=FS.findObject(filename);if(!target||target.isFolder||target.isDevice){DLFCN.errorMsg="Could not find dynamic lib: "+filename;return 0}FS.forceLoadFile(target);try{var lib_data=FS.readFile(filename,{encoding:"binary"});if(!(lib_data instanceof Uint8Array))lib_data=new Uint8Array(lib_data);lib_module=loadWebAssemblyModule(lib_data)}catch(e){DLFCN.errorMsg="Could not evaluate dynamic lib: "+filename+"\n"+e;return 0}}var handle=1;for(var key in DLFCN.loadedLibs){if(DLFCN.loadedLibs.hasOwnProperty(key))handle++}if(flag&256){for(var ident in lib_module){if(lib_module.hasOwnProperty(ident)){if(ident[0]=="_"){Module[ident]=lib_module[ident]}}}}}DLFCN.loadedLibs[handle]={refcount:1,name:filename,module:lib_module};DLFCN.loadedLibNames[filename]=handle;return handle}function _dlsym(handle,symbol){symbol=Pointer_stringify(symbol);if(!DLFCN.loadedLibs[handle]){DLFCN.errorMsg="Tried to dlsym() from an unopened handle: "+handle;return 0}else{var lib=DLFCN.loadedLibs[handle];symbol="_"+symbol;if(!lib.module.hasOwnProperty(symbol)){DLFCN.errorMsg='Tried to lookup unknown symbol "'+symbol+'" in dynamic lib: '+lib.name;return 0}else{var result=lib.module[symbol];if(typeof result==="function"){return addFunction(result)}return result}}}function _emscripten_set_main_loop_timing(mode,value){Browser.mainLoop.timingMode=mode;Browser.mainLoop.timingValue=value;if(!Browser.mainLoop.func){return 1}if(mode==0){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setTimeout(){var timeUntilNextTick=Math.max(0,Browser.mainLoop.tickStartTime+value-_emscripten_get_now())|0;setTimeout(Browser.mainLoop.runner,timeUntilNextTick)};Browser.mainLoop.method="timeout"}else if(mode==1){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_rAF(){Browser.requestAnimationFrame(Browser.mainLoop.runner)};Browser.mainLoop.method="rAF"}else if(mode==2){if(typeof setImmediate==="undefined"){var setImmediates=[];var emscriptenMainLoopMessageId="setimmediate";function Browser_setImmediate_messageHandler(event){if(event.data===emscriptenMainLoopMessageId||event.data.target===emscriptenMainLoopMessageId){event.stopPropagation();setImmediates.shift()()}}addEventListener("message",Browser_setImmediate_messageHandler,true);setImmediate=function Browser_emulated_setImmediate(func){setImmediates.push(func);if(ENVIRONMENT_IS_WORKER){if(Module["setImmediates"]===undefined)Module["setImmediates"]=[];Module["setImmediates"].push(func);postMessage({target:emscriptenMainLoopMessageId})}else postMessage(emscriptenMainLoopMessageId,"*")}}Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setImmediate(){setImmediate(Browser.mainLoop.runner)};Browser.mainLoop.method="immediate"}return 0}function _emscripten_set_main_loop(func,fps,simulateInfiniteLoop,arg,noSetTiming){Module["noExitRuntime"]=true;assert(!Browser.mainLoop.func,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");Browser.mainLoop.func=func;Browser.mainLoop.arg=arg;var browserIterationFunc;if(typeof arg!=="undefined"){browserIterationFunc=(function(){Module["dynCall_vi"](func,arg)})}else{browserIterationFunc=(function(){Module["dynCall_v"](func)})}var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;Browser.mainLoop.runner=function Browser_mainLoop_runner(){if(ABORT)return;if(Browser.mainLoop.queue.length>0){var start=Date.now();var blocker=Browser.mainLoop.queue.shift();blocker.func(blocker.arg);if(Browser.mainLoop.remainingBlockers){var remaining=Browser.mainLoop.remainingBlockers;var next=remaining%1==0?remaining-1:Math.floor(remaining);if(blocker.counted){Browser.mainLoop.remainingBlockers=next}else{next=next+.5;Browser.mainLoop.remainingBlockers=(8*remaining+next)/9}}console.log('main loop blocker "'+blocker.name+'" took '+(Date.now()-start)+" ms");Browser.mainLoop.updateStatus();if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;setTimeout(Browser.mainLoop.runner,0);return}if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0){Browser.mainLoop.scheduler();return}else if(Browser.mainLoop.timingMode==0){Browser.mainLoop.tickStartTime=_emscripten_get_now()}if(Browser.mainLoop.method==="timeout"&&Module.ctx){err("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");Browser.mainLoop.method=""}Browser.mainLoop.runIter(browserIterationFunc);if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;if(typeof SDL==="object"&&SDL.audio&&SDL.audio.queueNewAudioData)SDL.audio.queueNewAudioData();Browser.mainLoop.scheduler()};if(!noSetTiming){if(fps&&fps>0)_emscripten_set_main_loop_timing(0,1e3/fps);else _emscripten_set_main_loop_timing(1,1);Browser.mainLoop.scheduler()}if(simulateInfiniteLoop){throw"SimulateInfiniteLoop"}}var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:(function(){Browser.mainLoop.scheduler=null;Browser.mainLoop.currentlyRunningMainloop++}),resume:(function(){Browser.mainLoop.currentlyRunningMainloop++;var timingMode=Browser.mainLoop.timingMode;var timingValue=Browser.mainLoop.timingValue;var func=Browser.mainLoop.func;Browser.mainLoop.func=null;_emscripten_set_main_loop(func,0,false,Browser.mainLoop.arg,true);_emscripten_set_main_loop_timing(timingMode,timingValue);Browser.mainLoop.scheduler()}),updateStatus:(function(){if(Module["setStatus"]){var message=Module["statusMessage"]||"Please wait...";var remaining=Browser.mainLoop.remainingBlockers;var expected=Browser.mainLoop.expectedBlockers;if(remaining){if(remaining<expected){Module["setStatus"](message+" ("+(expected-remaining)+"/"+expected+")")}else{Module["setStatus"](message)}}else{Module["setStatus"]("")}}}),runIter:(function(func){if(ABORT)return;if(Module["preMainLoop"]){var preRet=Module["preMainLoop"]();if(preRet===false){return}}try{func()}catch(e){if(e instanceof ExitStatus){return}else{if(e&&typeof e==="object"&&e.stack)err("exception thrown: "+[e,e.stack]);throw e}}if(Module["postMainLoop"])Module["postMainLoop"]()})},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:(function(){if(!Module["preloadPlugins"])Module["preloadPlugins"]=[];if(Browser.initted)return;Browser.initted=true;try{new Blob;Browser.hasBlobConstructor=true}catch(e){Browser.hasBlobConstructor=false;console.log("warning: no blob constructor, cannot create blobs with mimetypes")}Browser.BlobBuilder=typeof MozBlobBuilder!="undefined"?MozBlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:!Browser.hasBlobConstructor?console.log("warning: no BlobBuilder"):null;Browser.URLObject=typeof window!="undefined"?window.URL?window.URL:window.webkitURL:undefined;if(!Module.noImageDecoding&&typeof Browser.URLObject==="undefined"){console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");Module.noImageDecoding=true}var imagePlugin={};imagePlugin["canHandle"]=function imagePlugin_canHandle(name){return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)};imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror){var b=null;if(Browser.hasBlobConstructor){try{b=new Blob([byteArray],{type:Browser.getMimetype(name)});if(b.size!==byteArray.length){b=new Blob([(new Uint8Array(byteArray)).buffer],{type:Browser.getMimetype(name)})}}catch(e){warnOnce("Blob constructor present but fails: "+e+"; falling back to blob builder")}}if(!b){var bb=new Browser.BlobBuilder;bb.append((new Uint8Array(byteArray)).buffer);b=bb.getBlob()}var url=Browser.URLObject.createObjectURL(b);var img=new Image;img.onload=function img_onload(){assert(img.complete,"Image "+name+" could not be decoded");var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);Module["preloadedImages"][name]=canvas;Browser.URLObject.revokeObjectURL(url);if(onload)onload(byteArray)};img.onerror=function img_onerror(event){console.log("Image "+url+" could not be decoded");if(onerror)onerror()};img.src=url};Module["preloadPlugins"].push(imagePlugin);var audioPlugin={};audioPlugin["canHandle"]=function audioPlugin_canHandle(name){return!Module.noAudioDecoding&&name.substr(-4)in{".ogg":1,".wav":1,".mp3":1}};audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror){var done=false;function finish(audio){if(done)return;done=true;Module["preloadedAudios"][name]=audio;if(onload)onload(byteArray)}function fail(){if(done)return;done=true;Module["preloadedAudios"][name]=new Audio;if(onerror)onerror()}if(Browser.hasBlobConstructor){try{var b=new Blob([byteArray],{type:Browser.getMimetype(name)})}catch(e){return fail()}var url=Browser.URLObject.createObjectURL(b);var audio=new Audio;audio.addEventListener("canplaythrough",(function(){finish(audio)}),false);audio.onerror=function audio_onerror(event){if(done)return;console.log("warning: browser could not fully decode audio "+name+", trying slower base64 approach");function encode64(data){var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var PAD="=";var ret="";var leftchar=0;var leftbits=0;for(var i=0;i<data.length;i++){leftchar=leftchar<<8|data[i];leftbits+=8;while(leftbits>=6){var curr=leftchar>>leftbits-6&63;leftbits-=6;ret+=BASE[curr]}}if(leftbits==2){ret+=BASE[(leftchar&3)<<4];ret+=PAD+PAD}else if(leftbits==4){ret+=BASE[(leftchar&15)<<2];ret+=PAD}return ret}audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);finish(audio)};audio.src=url;Browser.safeSetTimeout((function(){finish(audio)}),1e4)}else{return fail()}};Module["preloadPlugins"].push(audioPlugin);function pointerLockChange(){Browser.pointerLock=document["pointerLockElement"]===Module["canvas"]||document["mozPointerLockElement"]===Module["canvas"]||document["webkitPointerLockElement"]===Module["canvas"]||document["msPointerLockElement"]===Module["canvas"]}var canvas=Module["canvas"];if(canvas){canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||(function(){});canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||(function(){});canvas.exitPointerLock=canvas.exitPointerLock.bind(document);document.addEventListener("pointerlockchange",pointerLockChange,false);document.addEventListener("mozpointerlockchange",pointerLockChange,false);document.addEventListener("webkitpointerlockchange",pointerLockChange,false);document.addEventListener("mspointerlockchange",pointerLockChange,false);if(Module["elementPointerLock"]){canvas.addEventListener("click",(function(ev){if(!Browser.pointerLock&&Module["canvas"].requestPointerLock){Module["canvas"].requestPointerLock();ev.preventDefault()}}),false)}}}),createContext:(function(canvas,useWebGL,setInModule,webGLContextAttributes){if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;var ctx;var contextHandle;if(useWebGL){var contextAttributes={antialias:false,alpha:false};if(webGLContextAttributes){for(var attribute in webGLContextAttributes){contextAttributes[attribute]=webGLContextAttributes[attribute]}}contextHandle=GL.createContext(canvas,contextAttributes);if(contextHandle){ctx=GL.getContext(contextHandle).GLctx}}else{ctx=canvas.getContext("2d")}if(!ctx)return null;if(setInModule){if(!useWebGL)assert(typeof GLctx==="undefined","cannot set in module if GLctx is used, but we are a non-GL context that would replace it");Module.ctx=ctx;if(useWebGL)GL.makeContextCurrent(contextHandle);Module.useWebGL=useWebGL;Browser.moduleContextCreatedCallbacks.forEach((function(callback){callback()}));Browser.init()}return ctx}),destroyContext:(function(canvas,useWebGL,setInModule){}),fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:(function(lockPointer,resizeCanvas,vrDevice){Browser.lockPointer=lockPointer;Browser.resizeCanvas=resizeCanvas;Browser.vrDevice=vrDevice;if(typeof Browser.lockPointer==="undefined")Browser.lockPointer=true;if(typeof Browser.resizeCanvas==="undefined")Browser.resizeCanvas=false;if(typeof Browser.vrDevice==="undefined")Browser.vrDevice=null;var canvas=Module["canvas"];function fullscreenChange(){Browser.isFullscreen=false;var canvasContainer=canvas.parentNode;if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer){canvas.exitFullscreen=document["exitFullscreen"]||document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["msExitFullscreen"]||document["webkitCancelFullScreen"]||(function(){});canvas.exitFullscreen=canvas.exitFullscreen.bind(document);if(Browser.lockPointer)canvas.requestPointerLock();Browser.isFullscreen=true;if(Browser.resizeCanvas){Browser.setFullscreenCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}else{canvasContainer.parentNode.insertBefore(canvas,canvasContainer);canvasContainer.parentNode.removeChild(canvasContainer);if(Browser.resizeCanvas){Browser.setWindowedCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}if(Module["onFullScreen"])Module["onFullScreen"](Browser.isFullscreen);if(Module["onFullscreen"])Module["onFullscreen"](Browser.isFullscreen)}if(!Browser.fullscreenHandlersInstalled){Browser.fullscreenHandlersInstalled=true;document.addEventListener("fullscreenchange",fullscreenChange,false);document.addEventListener("mozfullscreenchange",fullscreenChange,false);document.addEventListener("webkitfullscreenchange",fullscreenChange,false);document.addEventListener("MSFullscreenChange",fullscreenChange,false)}var canvasContainer=document.createElement("div");canvas.parentNode.insertBefore(canvasContainer,canvas);canvasContainer.appendChild(canvas);canvasContainer.requestFullscreen=canvasContainer["requestFullscreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullscreen"]?(function(){canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])}):null)||(canvasContainer["webkitRequestFullScreen"]?(function(){canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])}):null);if(vrDevice){canvasContainer.requestFullscreen({vrDisplay:vrDevice})}else{canvasContainer.requestFullscreen()}}),requestFullScreen:(function(lockPointer,resizeCanvas,vrDevice){err("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");Browser.requestFullScreen=(function(lockPointer,resizeCanvas,vrDevice){return Browser.requestFullscreen(lockPointer,resizeCanvas,vrDevice)});return Browser.requestFullscreen(lockPointer,resizeCanvas,vrDevice)}),nextRAF:0,fakeRequestAnimationFrame:(function(func){var now=Date.now();if(Browser.nextRAF===0){Browser.nextRAF=now+1e3/60}else{while(now+2>=Browser.nextRAF){Browser.nextRAF+=1e3/60}}var delay=Math.max(Browser.nextRAF-now,0);setTimeout(func,delay)}),requestAnimationFrame:function requestAnimationFrame(func){if(typeof window==="undefined"){Browser.fakeRequestAnimationFrame(func)}else{if(!window.requestAnimationFrame){window.requestAnimationFrame=window["requestAnimationFrame"]||window["mozRequestAnimationFrame"]||window["webkitRequestAnimationFrame"]||window["msRequestAnimationFrame"]||window["oRequestAnimationFrame"]||Browser.fakeRequestAnimationFrame}window.requestAnimationFrame(func)}},safeCallback:(function(func){return(function(){if(!ABORT)return func.apply(null,arguments)})}),allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:(function(){Browser.allowAsyncCallbacks=false}),resumeAsyncCallbacks:(function(){Browser.allowAsyncCallbacks=true;if(Browser.queuedAsyncCallbacks.length>0){var callbacks=Browser.queuedAsyncCallbacks;Browser.queuedAsyncCallbacks=[];callbacks.forEach((function(func){func()}))}}),safeRequestAnimationFrame:(function(func){return Browser.requestAnimationFrame((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}else{Browser.queuedAsyncCallbacks.push(func)}}))}),safeSetTimeout:(function(func,timeout){Module["noExitRuntime"]=true;return setTimeout((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}else{Browser.queuedAsyncCallbacks.push(func)}}),timeout)}),safeSetInterval:(function(func,timeout){Module["noExitRuntime"]=true;return setInterval((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}}),timeout)}),getMimetype:(function(name){return{"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","bmp":"image/bmp","ogg":"audio/ogg","wav":"audio/wav","mp3":"audio/mpeg"}[name.substr(name.lastIndexOf(".")+1)]}),getUserMedia:(function(func){if(!window.getUserMedia){window.getUserMedia=navigator["getUserMedia"]||navigator["mozGetUserMedia"]}window.getUserMedia(func)}),getMovementX:(function(event){return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0}),getMovementY:(function(event){return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0}),getMouseWheelDelta:(function(event){var delta=0;switch(event.type){case"DOMMouseScroll":delta=event.detail;break;case"mousewheel":delta=event.wheelDelta;break;case"wheel":delta=event["deltaY"];break;default:throw"unrecognized mouse wheel event: "+event.type}return delta}),mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:(function(event){if(Browser.pointerLock){if(event.type!="mousemove"&&"mozMovementX"in event){Browser.mouseMovementX=Browser.mouseMovementY=0}else{Browser.mouseMovementX=Browser.getMovementX(event);Browser.mouseMovementY=Browser.getMovementY(event)}if(typeof SDL!="undefined"){Browser.mouseX=SDL.mouseX+Browser.mouseMovementX;Browser.mouseY=SDL.mouseY+Browser.mouseMovementY}else{Browser.mouseX+=Browser.mouseMovementX;Browser.mouseY+=Browser.mouseMovementY}}else{var rect=Module["canvas"].getBoundingClientRect();var cw=Module["canvas"].width;var ch=Module["canvas"].height;var scrollX=typeof window.scrollX!=="undefined"?window.scrollX:window.pageXOffset;var scrollY=typeof window.scrollY!=="undefined"?window.scrollY:window.pageYOffset;if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove"){var touch=event.touch;if(touch===undefined){return}var adjustedX=touch.pageX-(scrollX+rect.left);var adjustedY=touch.pageY-(scrollY+rect.top);adjustedX=adjustedX*(cw/rect.width);adjustedY=adjustedY*(ch/rect.height);var coords={x:adjustedX,y:adjustedY};if(event.type==="touchstart"){Browser.lastTouches[touch.identifier]=coords;Browser.touches[touch.identifier]=coords}else if(event.type==="touchend"||event.type==="touchmove"){var last=Browser.touches[touch.identifier];if(!last)last=coords;Browser.lastTouches[touch.identifier]=last;Browser.touches[touch.identifier]=coords}return}var x=event.pageX-(scrollX+rect.left);var y=event.pageY-(scrollY+rect.top);x=x*(cw/rect.width);y=y*(ch/rect.height);Browser.mouseMovementX=x-Browser.mouseX;Browser.mouseMovementY=y-Browser.mouseY;Browser.mouseX=x;Browser.mouseY=y}}),asyncLoad:(function(url,onload,onerror,noRunDep){var dep=!noRunDep?getUniqueRunDependency("al "+url):"";Module["readAsync"](url,(function(arrayBuffer){assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)}),(function(event){if(onerror){onerror()}else{throw'Loading data file "'+url+'" failed.'}}));if(dep)addRunDependency(dep)}),resizeListeners:[],updateResizeListeners:(function(){var canvas=Module["canvas"];Browser.resizeListeners.forEach((function(listener){listener(canvas.width,canvas.height)}))}),setCanvasSize:(function(width,height,noUpdates){var canvas=Module["canvas"];Browser.updateCanvasDimensions(canvas,width,height);if(!noUpdates)Browser.updateResizeListeners()}),windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:(function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags|8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()}),setWindowedCanvasSize:(function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags&~8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()}),updateCanvasDimensions:(function(canvas,wNative,hNative){if(wNative&&hNative){canvas.widthNative=wNative;canvas.heightNative=hNative}else{wNative=canvas.widthNative;hNative=canvas.heightNative}var w=wNative;var h=hNative;if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0){if(w/h<Module["forcedAspectRatio"]){w=Math.round(h*Module["forcedAspectRatio"])}else{h=Math.round(w/Module["forcedAspectRatio"])}}if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined"){var factor=Math.min(screen.width/w,screen.height/h);w=Math.round(w*factor);h=Math.round(h*factor)}if(Browser.resizeCanvas){if(canvas.width!=w)canvas.width=w;if(canvas.height!=h)canvas.height=h;if(typeof canvas.style!="undefined"){canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}else{if(canvas.width!=wNative)canvas.width=wNative;if(canvas.height!=hNative)canvas.height=hNative;if(typeof canvas.style!="undefined"){if(w!=wNative||h!=hNative){canvas.style.setProperty("width",w+"px","important");canvas.style.setProperty("height",h+"px","important")}else{canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}}}),wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:(function(){var handle=Browser.nextWgetRequestHandle;Browser.nextWgetRequestHandle++;return handle})};function _emscripten_cancel_main_loop(){Browser.mainLoop.pause();Browser.mainLoop.func=null}function _emscripten_set_canvas_element_size(target,width,height){var canvas=JSEvents.findCanvasEventTarget(target);if(!canvas)return-4;canvas.width=width;canvas.height=height;return 0}function emscripten_set_canvas_element_size_js(target,width,height){if(typeof target==="string"){var stackTop=stackSave();var targetInt=stackAlloc(target.length+1);stringToUTF8(target,targetInt,target.length+1);var ret=_emscripten_set_canvas_element_size(targetInt,width,height);stackRestore(stackTop);return ret}else{return _emscripten_set_canvas_element_size(target,width,height)}}function _emscripten_get_canvas_element_size_calling_thread(target,width,height){var canvas=JSEvents.findCanvasEventTarget(target);if(!canvas)return-4;if(canvas.canvasSharedPtr){var w=HEAP32[canvas.canvasSharedPtr>>2];var h=HEAP32[canvas.canvasSharedPtr+4>>2];HEAP32[width>>2]=w;HEAP32[height>>2]=h}else if(canvas.offscreenCanvas){HEAP32[width>>2]=canvas.offscreenCanvas.width;HEAP32[height>>2]=canvas.offscreenCanvas.height}else if(!canvas.controlTransferredOffscreen){HEAP32[width>>2]=canvas.width;HEAP32[height>>2]=canvas.height}else{return-4}return 0}function _emscripten_get_canvas_element_size_main_thread(target,width,height){return _emscripten_get_canvas_element_size_calling_thread(target,width,height)}function _emscripten_get_canvas_element_size(target,width,height){var canvas=JSEvents.findCanvasEventTarget(target);if(canvas)return _emscripten_get_canvas_element_size_calling_thread(target,width,height);else return _emscripten_get_canvas_element_size_main_thread(target,width,height)}function emscripten_get_canvas_element_size_js(target){var stackTop=stackSave();var w=stackAlloc(8);var h=w+4;if(typeof target==="string"){var targetInt=stackAlloc(target.length+1);stringToUTF8(target,targetInt,target.length+1);target=targetInt}var ret=_emscripten_get_canvas_element_size(target,w,h);var size=[HEAP32[w>>2],HEAP32[h>>2]];stackRestore(stackTop);return size}var JSEvents={keyEvent:0,mouseEvent:0,wheelEvent:0,uiEvent:0,focusEvent:0,deviceOrientationEvent:0,deviceMotionEvent:0,fullscreenChangeEvent:0,pointerlockChangeEvent:0,visibilityChangeEvent:0,touchEvent:0,lastGamepadState:null,lastGamepadStateFrame:null,numGamepadsConnected:0,previousFullscreenElement:null,previousScreenX:null,previousScreenY:null,removeEventListenersRegistered:false,_onGamepadConnected:(function(){++JSEvents.numGamepadsConnected}),_onGamepadDisconnected:(function(){--JSEvents.numGamepadsConnected}),staticInit:(function(){if(typeof window!=="undefined"){window.addEventListener("gamepadconnected",JSEvents._onGamepadConnected);window.addEventListener("gamepaddisconnected",JSEvents._onGamepadDisconnected);var firstState=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():null;if(firstState){JSEvents.numGamepadsConnected=firstState.length}}}),removeAllEventListeners:(function(){for(var i=JSEvents.eventHandlers.length-1;i>=0;--i){JSEvents._removeHandler(i)}JSEvents.eventHandlers=[];JSEvents.deferredCalls=[];window.removeEventListener("gamepadconnected",JSEvents._onGamepadConnected);window.removeEventListener("gamepaddisconnected",JSEvents._onGamepadDisconnected)}),registerRemoveEventListeners:(function(){if(!JSEvents.removeEventListenersRegistered){__ATEXIT__.push(JSEvents.removeAllEventListeners);JSEvents.removeEventListenersRegistered=true}}),findEventTarget:(function(target){try{if(!target)return window;if(typeof target==="number")target=Pointer_stringify(target);if(target==="#window")return window;else if(target==="#document")return document;else if(target==="#screen")return window.screen;else if(target==="#canvas")return Module["canvas"];return typeof target==="string"?document.getElementById(target):target}catch(e){return null}}),findCanvasEventTarget:(function(target){if(typeof target==="number")target=Pointer_stringify(target);if(!target||target==="#canvas"){if(typeof GL!=="undefined"&&GL.offscreenCanvases["canvas"])return GL.offscreenCanvases["canvas"];return Module["canvas"]}if(typeof GL!=="undefined"&&GL.offscreenCanvases[target])return GL.offscreenCanvases[target];return JSEvents.findEventTarget(target)}),deferredCalls:[],deferCall:(function(targetFunction,precedence,argsList){function arraysHaveEqualContent(arrA,arrB){if(arrA.length!=arrB.length)return false;for(var i in arrA){if(arrA[i]!=arrB[i])return false}return true}for(var i in JSEvents.deferredCalls){var call=JSEvents.deferredCalls[i];if(call.targetFunction==targetFunction&&arraysHaveEqualContent(call.argsList,argsList)){return}}JSEvents.deferredCalls.push({targetFunction:targetFunction,precedence:precedence,argsList:argsList});JSEvents.deferredCalls.sort((function(x,y){return x.precedence<y.precedence}))}),removeDeferredCalls:(function(targetFunction){for(var i=0;i<JSEvents.deferredCalls.length;++i){if(JSEvents.deferredCalls[i].targetFunction==targetFunction){JSEvents.deferredCalls.splice(i,1);--i}}}),canPerformEventHandlerRequests:(function(){return JSEvents.inEventHandler&&JSEvents.currentEventHandler.allowsDeferredCalls}),runDeferredCalls:(function(){if(!JSEvents.canPerformEventHandlerRequests()){return}for(var i=0;i<JSEvents.deferredCalls.length;++i){var call=JSEvents.deferredCalls[i];JSEvents.deferredCalls.splice(i,1);--i;call.targetFunction.apply(this,call.argsList)}}),inEventHandler:0,currentEventHandler:null,eventHandlers:[],isInternetExplorer:(function(){return navigator.userAgent.indexOf("MSIE")!==-1||navigator.appVersion.indexOf("Trident/")>0}),removeAllHandlersOnTarget:(function(target,eventTypeString){for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==target&&(!eventTypeString||eventTypeString==JSEvents.eventHandlers[i].eventTypeString)){JSEvents._removeHandler(i--)}}}),_removeHandler:(function(i){var h=JSEvents.eventHandlers[i];h.target.removeEventListener(h.eventTypeString,h.eventListenerFunc,h.useCapture);JSEvents.eventHandlers.splice(i,1)}),registerOrRemoveHandler:(function(eventHandler){var jsEventHandler=function jsEventHandler(event){++JSEvents.inEventHandler;JSEvents.currentEventHandler=eventHandler;JSEvents.runDeferredCalls();eventHandler.handlerFunc(event);JSEvents.runDeferredCalls();--JSEvents.inEventHandler};if(eventHandler.callbackfunc){eventHandler.eventListenerFunc=jsEventHandler;eventHandler.target.addEventListener(eventHandler.eventTypeString,jsEventHandler,eventHandler.useCapture);JSEvents.eventHandlers.push(eventHandler);JSEvents.registerRemoveEventListeners()}else{for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==eventHandler.target&&JSEvents.eventHandlers[i].eventTypeString==eventHandler.eventTypeString){JSEvents._removeHandler(i--)}}}}),registerKeyEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.keyEvent)JSEvents.keyEvent=_malloc(164);var keyEventHandlerFunc=(function(event){var e=event||window.event;var keyEventData=JSEvents.keyEvent;stringToUTF8(e.key?e.key:"",keyEventData+0,32);stringToUTF8(e.code?e.code:"",keyEventData+32,32);HEAP32[keyEventData+64>>2]=e.location;HEAP32[keyEventData+68>>2]=e.ctrlKey;HEAP32[keyEventData+72>>2]=e.shiftKey;HEAP32[keyEventData+76>>2]=e.altKey;HEAP32[keyEventData+80>>2]=e.metaKey;HEAP32[keyEventData+84>>2]=e.repeat;stringToUTF8(e.locale?e.locale:"",keyEventData+88,32);stringToUTF8(e.char?e.char:"",keyEventData+120,32);HEAP32[keyEventData+152>>2]=e.charCode;HEAP32[keyEventData+156>>2]=e.keyCode;HEAP32[keyEventData+160>>2]=e.which;if(Module["dynCall_iiii"](callbackfunc,eventTypeId,keyEventData,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:JSEvents.isInternetExplorer()?false:true,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:keyEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),getBoundingClientRectOrZeros:(function(target){return target.getBoundingClientRect?target.getBoundingClientRect():{left:0,top:0}}),fillMouseEventData:(function(eventStruct,e,target){HEAPF64[eventStruct>>3]=JSEvents.tick();HEAP32[eventStruct+8>>2]=e.screenX;HEAP32[eventStruct+12>>2]=e.screenY;HEAP32[eventStruct+16>>2]=e.clientX;HEAP32[eventStruct+20>>2]=e.clientY;HEAP32[eventStruct+24>>2]=e.ctrlKey;HEAP32[eventStruct+28>>2]=e.shiftKey;HEAP32[eventStruct+32>>2]=e.altKey;HEAP32[eventStruct+36>>2]=e.metaKey;HEAP16[eventStruct+40>>1]=e.button;HEAP16[eventStruct+42>>1]=e.buttons;HEAP32[eventStruct+44>>2]=e["movementX"];HEAP32[eventStruct+48>>2]=e["movementY"];if(Module["canvas"]){var rect=Module["canvas"].getBoundingClientRect();HEAP32[eventStruct+60>>2]=e.clientX-rect.left;HEAP32[eventStruct+64>>2]=e.clientY-rect.top}else{HEAP32[eventStruct+60>>2]=0;HEAP32[eventStruct+64>>2]=0}if(target){var rect=JSEvents.getBoundingClientRectOrZeros(target);HEAP32[eventStruct+52>>2]=e.clientX-rect.left;HEAP32[eventStruct+56>>2]=e.clientY-rect.top}else{HEAP32[eventStruct+52>>2]=0;HEAP32[eventStruct+56>>2]=0}if(e.type!=="wheel"&&e.type!=="mousewheel"){JSEvents.previousScreenX=e.screenX;JSEvents.previousScreenY=e.screenY}}),registerMouseEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.mouseEvent)JSEvents.mouseEvent=_malloc(72);target=JSEvents.findEventTarget(target);var mouseEventHandlerFunc=(function(event){var e=event||window.event;JSEvents.fillMouseEventData(JSEvents.mouseEvent,e,target);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,JSEvents.mouseEvent,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:eventTypeString!="mousemove"&&eventTypeString!="mouseenter"&&eventTypeString!="mouseleave",eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:mouseEventHandlerFunc,useCapture:useCapture};if(JSEvents.isInternetExplorer()&&eventTypeString=="mousedown")eventHandler.allowsDeferredCalls=false;JSEvents.registerOrRemoveHandler(eventHandler)}),registerWheelEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.wheelEvent)JSEvents.wheelEvent=_malloc(104);target=JSEvents.findEventTarget(target);var wheelHandlerFunc=(function(event){var e=event||window.event;var wheelEvent=JSEvents.wheelEvent;JSEvents.fillMouseEventData(wheelEvent,e,target);HEAPF64[wheelEvent+72>>3]=e["deltaX"];HEAPF64[wheelEvent+80>>3]=e["deltaY"];HEAPF64[wheelEvent+88>>3]=e["deltaZ"];HEAP32[wheelEvent+96>>2]=e["deltaMode"];if(Module["dynCall_iiii"](callbackfunc,eventTypeId,wheelEvent,userData))e.preventDefault()});var mouseWheelHandlerFunc=(function(event){var e=event||window.event;JSEvents.fillMouseEventData(JSEvents.wheelEvent,e,target);HEAPF64[JSEvents.wheelEvent+72>>3]=e["wheelDeltaX"]||0;HEAPF64[JSEvents.wheelEvent+80>>3]=-(e["wheelDeltaY"]?e["wheelDeltaY"]:e["wheelDelta"]);HEAPF64[JSEvents.wheelEvent+88>>3]=0;HEAP32[JSEvents.wheelEvent+96>>2]=0;var shouldCancel=Module["dynCall_iiii"](callbackfunc,eventTypeId,JSEvents.wheelEvent,userData);if(shouldCancel){e.preventDefault()}});var eventHandler={target:target,allowsDeferredCalls:true,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:eventTypeString=="wheel"?wheelHandlerFunc:mouseWheelHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),pageScrollPos:(function(){if(window.pageXOffset>0||window.pageYOffset>0){return[window.pageXOffset,window.pageYOffset]}if(typeof document.documentElement.scrollLeft!=="undefined"||typeof document.documentElement.scrollTop!=="undefined"){return[document.documentElement.scrollLeft,document.documentElement.scrollTop]}return[document.body.scrollLeft|0,document.body.scrollTop|0]}),registerUiEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.uiEvent)JSEvents.uiEvent=_malloc(36);if(eventTypeString=="scroll"&&!target){target=document}else{target=JSEvents.findEventTarget(target)}var uiEventHandlerFunc=(function(event){var e=event||window.event;if(e.target!=target){return}var scrollPos=JSEvents.pageScrollPos();var uiEvent=JSEvents.uiEvent;HEAP32[uiEvent>>2]=e.detail;HEAP32[uiEvent+4>>2]=document.body.clientWidth;HEAP32[uiEvent+8>>2]=document.body.clientHeight;HEAP32[uiEvent+12>>2]=window.innerWidth;HEAP32[uiEvent+16>>2]=window.innerHeight;HEAP32[uiEvent+20>>2]=window.outerWidth;HEAP32[uiEvent+24>>2]=window.outerHeight;HEAP32[uiEvent+28>>2]=scrollPos[0];HEAP32[uiEvent+32>>2]=scrollPos[1];if(Module["dynCall_iiii"](callbackfunc,eventTypeId,uiEvent,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:uiEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),getNodeNameForTarget:(function(target){if(!target)return"";if(target==window)return"#window";if(target==window.screen)return"#screen";return target&&target.nodeName?target.nodeName:""}),registerFocusEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.focusEvent)JSEvents.focusEvent=_malloc(256);var focusEventHandlerFunc=(function(event){var e=event||window.event;var nodeName=JSEvents.getNodeNameForTarget(e.target);var id=e.target.id?e.target.id:"";var focusEvent=JSEvents.focusEvent;stringToUTF8(nodeName,focusEvent+0,128);stringToUTF8(id,focusEvent+128,128);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,focusEvent,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:focusEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),tick:(function(){if(window["performance"]&&window["performance"]["now"])return window["performance"]["now"]();else return Date.now()}),fillDeviceOrientationEventData:(function(eventStruct,e,target){HEAPF64[eventStruct>>3]=JSEvents.tick();HEAPF64[eventStruct+8>>3]=e.alpha;HEAPF64[eventStruct+16>>3]=e.beta;HEAPF64[eventStruct+24>>3]=e.gamma;HEAP32[eventStruct+32>>2]=e.absolute}),registerDeviceOrientationEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.deviceOrientationEvent)JSEvents.deviceOrientationEvent=_malloc(40);var deviceOrientationEventHandlerFunc=(function(event){var e=event||window.event;JSEvents.fillDeviceOrientationEventData(JSEvents.deviceOrientationEvent,e,target);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,JSEvents.deviceOrientationEvent,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:deviceOrientationEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),fillDeviceMotionEventData:(function(eventStruct,e,target){HEAPF64[eventStruct>>3]=JSEvents.tick();HEAPF64[eventStruct+8>>3]=e.acceleration.x;HEAPF64[eventStruct+16>>3]=e.acceleration.y;HEAPF64[eventStruct+24>>3]=e.acceleration.z;HEAPF64[eventStruct+32>>3]=e.accelerationIncludingGravity.x;HEAPF64[eventStruct+40>>3]=e.accelerationIncludingGravity.y;HEAPF64[eventStruct+48>>3]=e.accelerationIncludingGravity.z;HEAPF64[eventStruct+56>>3]=e.rotationRate.alpha;HEAPF64[eventStruct+64>>3]=e.rotationRate.beta;HEAPF64[eventStruct+72>>3]=e.rotationRate.gamma}),registerDeviceMotionEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.deviceMotionEvent)JSEvents.deviceMotionEvent=_malloc(80);var deviceMotionEventHandlerFunc=(function(event){var e=event||window.event;JSEvents.fillDeviceMotionEventData(JSEvents.deviceMotionEvent,e,target);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,JSEvents.deviceMotionEvent,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:deviceMotionEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),screenOrientation:(function(){if(!window.screen)return undefined;return window.screen.orientation||window.screen.mozOrientation||window.screen.webkitOrientation||window.screen.msOrientation}),fillOrientationChangeEventData:(function(eventStruct,e){var orientations=["portrait-primary","portrait-secondary","landscape-primary","landscape-secondary"];var orientations2=["portrait","portrait","landscape","landscape"];var orientationString=JSEvents.screenOrientation();var orientation=orientations.indexOf(orientationString);if(orientation==-1){orientation=orientations2.indexOf(orientationString)}HEAP32[eventStruct>>2]=1<<orientation;HEAP32[eventStruct+4>>2]=window.orientation}),registerOrientationChangeEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.orientationChangeEvent)JSEvents.orientationChangeEvent=_malloc(8);if(!target){target=window.screen}else{target=JSEvents.findEventTarget(target)}var orientationChangeEventHandlerFunc=(function(event){var e=event||window.event;var orientationChangeEvent=JSEvents.orientationChangeEvent;JSEvents.fillOrientationChangeEventData(orientationChangeEvent,e);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,orientationChangeEvent,userData))e.preventDefault()});if(eventTypeString=="orientationchange"&&window.screen.mozOrientation!==undefined){eventTypeString="mozorientationchange"}var eventHandler={target:target,allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:orientationChangeEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),fullscreenEnabled:(function(){return document.fullscreenEnabled||document.mozFullScreenEnabled||document.webkitFullscreenEnabled||document.msFullscreenEnabled}),fillFullscreenChangeEventData:(function(eventStruct,e){var fullscreenElement=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;var isFullscreen=!!fullscreenElement;HEAP32[eventStruct>>2]=isFullscreen;HEAP32[eventStruct+4>>2]=JSEvents.fullscreenEnabled();var reportedElement=isFullscreen?fullscreenElement:JSEvents.previousFullscreenElement;var nodeName=JSEvents.getNodeNameForTarget(reportedElement);var id=reportedElement&&reportedElement.id?reportedElement.id:"";stringToUTF8(nodeName,eventStruct+8,128);stringToUTF8(id,eventStruct+136,128);HEAP32[eventStruct+264>>2]=reportedElement?reportedElement.clientWidth:0;HEAP32[eventStruct+268>>2]=reportedElement?reportedElement.clientHeight:0;HEAP32[eventStruct+272>>2]=screen.width;HEAP32[eventStruct+276>>2]=screen.height;if(isFullscreen){JSEvents.previousFullscreenElement=fullscreenElement}}),registerFullscreenChangeEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.fullscreenChangeEvent)JSEvents.fullscreenChangeEvent=_malloc(280);if(!target)target=document;else target=JSEvents.findEventTarget(target);var fullscreenChangeEventhandlerFunc=(function(event){var e=event||window.event;var fullscreenChangeEvent=JSEvents.fullscreenChangeEvent;JSEvents.fillFullscreenChangeEventData(fullscreenChangeEvent,e);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,fullscreenChangeEvent,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:fullscreenChangeEventhandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),resizeCanvasForFullscreen:(function(target,strategy){var restoreOldStyle=__registerRestoreOldStyle(target);var cssWidth=strategy.softFullscreen?window.innerWidth:screen.width;var cssHeight=strategy.softFullscreen?window.innerHeight:screen.height;var rect=target.getBoundingClientRect();var windowedCssWidth=rect.right-rect.left;var windowedCssHeight=rect.bottom-rect.top;var canvasSize=emscripten_get_canvas_element_size_js(target.id);var windowedRttWidth=canvasSize[0];var windowedRttHeight=canvasSize[1];if(strategy.scaleMode==3){__setLetterbox(target,(cssHeight-windowedCssHeight)/2,(cssWidth-windowedCssWidth)/2);cssWidth=windowedCssWidth;cssHeight=windowedCssHeight}else if(strategy.scaleMode==2){if(cssWidth*windowedRttHeight<windowedRttWidth*cssHeight){var desiredCssHeight=windowedRttHeight*cssWidth/windowedRttWidth;__setLetterbox(target,(cssHeight-desiredCssHeight)/2,0);cssHeight=desiredCssHeight}else{var desiredCssWidth=windowedRttWidth*cssHeight/windowedRttHeight;__setLetterbox(target,0,(cssWidth-desiredCssWidth)/2);cssWidth=desiredCssWidth}}if(!target.style.backgroundColor)target.style.backgroundColor="black";if(!document.body.style.backgroundColor)document.body.style.backgroundColor="black";target.style.width=cssWidth+"px";target.style.height=cssHeight+"px";if(strategy.filteringMode==1){target.style.imageRendering="optimizeSpeed";target.style.imageRendering="-moz-crisp-edges";target.style.imageRendering="-o-crisp-edges";target.style.imageRendering="-webkit-optimize-contrast";target.style.imageRendering="optimize-contrast";target.style.imageRendering="crisp-edges";target.style.imageRendering="pixelated"}var dpiScale=strategy.canvasResolutionScaleMode==2?window.devicePixelRatio:1;if(strategy.canvasResolutionScaleMode!=0){var newWidth=cssWidth*dpiScale|0;var newHeight=cssHeight*dpiScale|0;if(!target.controlTransferredOffscreen){target.width=newWidth;target.height=newHeight}else{emscripten_set_canvas_element_size_js(target.id,newWidth,newHeight)}if(target.GLctxObject)target.GLctxObject.GLctx.viewport(0,0,newWidth,newHeight)}return restoreOldStyle}),requestFullscreen:(function(target,strategy){if(strategy.scaleMode!=0||strategy.canvasResolutionScaleMode!=0){JSEvents.resizeCanvasForFullscreen(target,strategy)}if(target.requestFullscreen){target.requestFullscreen()}else if(target.msRequestFullscreen){target.msRequestFullscreen()}else if(target.mozRequestFullScreen){target.mozRequestFullScreen()}else if(target.mozRequestFullscreen){target.mozRequestFullscreen()}else if(target.webkitRequestFullscreen){target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)}else{if(typeof JSEvents.fullscreenEnabled()==="undefined"){return-1}else{return-3}}if(strategy.canvasResizedCallback){Module["dynCall_iiii"](strategy.canvasResizedCallback,37,0,strategy.canvasResizedCallbackUserData)}return 0}),fillPointerlockChangeEventData:(function(eventStruct,e){var pointerLockElement=document.pointerLockElement||document.mozPointerLockElement||document.webkitPointerLockElement||document.msPointerLockElement;var isPointerlocked=!!pointerLockElement;HEAP32[eventStruct>>2]=isPointerlocked;var nodeName=JSEvents.getNodeNameForTarget(pointerLockElement);var id=pointerLockElement&&pointerLockElement.id?pointerLockElement.id:"";stringToUTF8(nodeName,eventStruct+4,128);stringToUTF8(id,eventStruct+132,128)}),registerPointerlockChangeEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.pointerlockChangeEvent)JSEvents.pointerlockChangeEvent=_malloc(260);if(!target)target=document;else target=JSEvents.findEventTarget(target);var pointerlockChangeEventHandlerFunc=(function(event){var e=event||window.event;var pointerlockChangeEvent=JSEvents.pointerlockChangeEvent;JSEvents.fillPointerlockChangeEventData(pointerlockChangeEvent,e);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,pointerlockChangeEvent,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:pointerlockChangeEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),registerPointerlockErrorEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString){if(!target)target=document;else target=JSEvents.findEventTarget(target);var pointerlockErrorEventHandlerFunc=(function(event){var e=event||window.event;if(Module["dynCall_iiii"](callbackfunc,eventTypeId,0,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:pointerlockErrorEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),requestPointerLock:(function(target){if(target.requestPointerLock){target.requestPointerLock()}else if(target.mozRequestPointerLock){target.mozRequestPointerLock()}else if(target.webkitRequestPointerLock){target.webkitRequestPointerLock()}else if(target.msRequestPointerLock){target.msRequestPointerLock()}else{if(document.body.requestPointerLock||document.body.mozRequestPointerLock||document.body.webkitRequestPointerLock||document.body.msRequestPointerLock){return-3}else{return-1}}return 0}),fillVisibilityChangeEventData:(function(eventStruct,e){var visibilityStates=["hidden","visible","prerender","unloaded"];var visibilityState=visibilityStates.indexOf(document.visibilityState);HEAP32[eventStruct>>2]=document.hidden;HEAP32[eventStruct+4>>2]=visibilityState}),registerVisibilityChangeEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.visibilityChangeEvent)JSEvents.visibilityChangeEvent=_malloc(8);if(!target)target=document;else target=JSEvents.findEventTarget(target);var visibilityChangeEventHandlerFunc=(function(event){var e=event||window.event;var visibilityChangeEvent=JSEvents.visibilityChangeEvent;JSEvents.fillVisibilityChangeEventData(visibilityChangeEvent,e);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,visibilityChangeEvent,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:visibilityChangeEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),registerTouchEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.touchEvent)JSEvents.touchEvent=_malloc(1684);target=JSEvents.findEventTarget(target);var touchEventHandlerFunc=(function(event){var e=event||window.event;var touches={};for(var i=0;i<e.touches.length;++i){var touch=e.touches[i];touches[touch.identifier]=touch}for(var i=0;i<e.changedTouches.length;++i){var touch=e.changedTouches[i];touches[touch.identifier]=touch;touch.changed=true}for(var i=0;i<e.targetTouches.length;++i){var touch=e.targetTouches[i];touches[touch.identifier].onTarget=true}var touchEvent=JSEvents.touchEvent;var ptr=touchEvent;HEAP32[ptr+4>>2]=e.ctrlKey;HEAP32[ptr+8>>2]=e.shiftKey;HEAP32[ptr+12>>2]=e.altKey;HEAP32[ptr+16>>2]=e.metaKey;ptr+=20;var canvasRect=Module["canvas"]?Module["canvas"].getBoundingClientRect():undefined;var targetRect=JSEvents.getBoundingClientRectOrZeros(target);var numTouches=0;for(var i in touches){var t=touches[i];HEAP32[ptr>>2]=t.identifier;HEAP32[ptr+4>>2]=t.screenX;HEAP32[ptr+8>>2]=t.screenY;HEAP32[ptr+12>>2]=t.clientX;HEAP32[ptr+16>>2]=t.clientY;HEAP32[ptr+20>>2]=t.pageX;HEAP32[ptr+24>>2]=t.pageY;HEAP32[ptr+28>>2]=t.changed;HEAP32[ptr+32>>2]=t.onTarget;if(canvasRect){HEAP32[ptr+44>>2]=t.clientX-canvasRect.left;HEAP32[ptr+48>>2]=t.clientY-canvasRect.top}else{HEAP32[ptr+44>>2]=0;HEAP32[ptr+48>>2]=0}HEAP32[ptr+36>>2]=t.clientX-targetRect.left;HEAP32[ptr+40>>2]=t.clientY-targetRect.top;ptr+=52;if(++numTouches>=32){break}}HEAP32[touchEvent>>2]=numTouches;if(Module["dynCall_iiii"](callbackfunc,eventTypeId,touchEvent,userData))e.preventDefault()});var eventHandler={target:target,allowsDeferredCalls:eventTypeString=="touchstart"||eventTypeString=="touchend",eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:touchEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),fillGamepadEventData:(function(eventStruct,e){HEAPF64[eventStruct>>3]=e.timestamp;for(var i=0;i<e.axes.length;++i){HEAPF64[eventStruct+i*8+16>>3]=e.axes[i]}for(var i=0;i<e.buttons.length;++i){if(typeof e.buttons[i]==="object"){HEAPF64[eventStruct+i*8+528>>3]=e.buttons[i].value}else{HEAPF64[eventStruct+i*8+528>>3]=e.buttons[i]}}for(var i=0;i<e.buttons.length;++i){if(typeof e.buttons[i]==="object"){HEAP32[eventStruct+i*4+1040>>2]=e.buttons[i].pressed}else{HEAP32[eventStruct+i*4+1040>>2]=e.buttons[i]==1}}HEAP32[eventStruct+1296>>2]=e.connected;HEAP32[eventStruct+1300>>2]=e.index;HEAP32[eventStruct+8>>2]=e.axes.length;HEAP32[eventStruct+12>>2]=e.buttons.length;stringToUTF8(e.id,eventStruct+1304,64);stringToUTF8(e.mapping,eventStruct+1368,64)}),registerGamepadEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.gamepadEvent)JSEvents.gamepadEvent=_malloc(1432);var gamepadEventHandlerFunc=(function(event){var e=event||window.event;var gamepadEvent=JSEvents.gamepadEvent;JSEvents.fillGamepadEventData(gamepadEvent,e.gamepad);if(Module["dynCall_iiii"](callbackfunc,eventTypeId,gamepadEvent,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:true,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:gamepadEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),registerBeforeUnloadEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString){var beforeUnloadEventHandlerFunc=(function(event){var e=event||window.event;var confirmationMessage=Module["dynCall_iiii"](callbackfunc,eventTypeId,0,userData);if(confirmationMessage){confirmationMessage=Pointer_stringify(confirmationMessage)}if(confirmationMessage){e.preventDefault();e.returnValue=confirmationMessage;return confirmationMessage}});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:beforeUnloadEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),battery:(function(){return navigator.battery||navigator.mozBattery||navigator.webkitBattery}),fillBatteryEventData:(function(eventStruct,e){HEAPF64[eventStruct>>3]=e.chargingTime;HEAPF64[eventStruct+8>>3]=e.dischargingTime;HEAPF64[eventStruct+16>>3]=e.level;HEAP32[eventStruct+24>>2]=e.charging}),registerBatteryEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.batteryEvent)JSEvents.batteryEvent=_malloc(32);var batteryEventHandlerFunc=(function(event){var e=event||window.event;var batteryEvent=JSEvents.batteryEvent;JSEvents.fillBatteryEventData(batteryEvent,JSEvents.battery());if(Module["dynCall_iiii"](callbackfunc,eventTypeId,batteryEvent,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:batteryEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}),registerWebGlEventCallback:(function(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!target)target=Module["canvas"];var webGlEventHandlerFunc=(function(event){var e=event||window.event;if(Module["dynCall_iiii"](callbackfunc,eventTypeId,0,userData))e.preventDefault()});var eventHandler={target:JSEvents.findEventTarget(target),allowsDeferredCalls:false,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:webGlEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)})};var __currentFullscreenStrategy={};function _emscripten_exit_fullscreen(){if(typeof JSEvents.fullscreenEnabled()==="undefined")return-1;JSEvents.removeDeferredCalls(JSEvents.requestFullscreen);if(document.exitFullscreen){document.exitFullscreen()}else if(document.msExitFullscreen){document.msExitFullscreen()}else if(document.mozCancelFullScreen){document.mozCancelFullScreen()}else if(document.webkitExitFullscreen){document.webkitExitFullscreen()}else{return-1}if(__currentFullscreenStrategy.canvasResizedCallback){Module["dynCall_iiii"](__currentFullscreenStrategy.canvasResizedCallback,37,0,__currentFullscreenStrategy.canvasResizedCallbackUserData)}return 0}function _emscripten_exit_pointerlock(){JSEvents.removeDeferredCalls(JSEvents.requestPointerLock);if(document.exitPointerLock){document.exitPointerLock()}else if(document.msExitPointerLock){document.msExitPointerLock()}else if(document.mozExitPointerLock){document.mozExitPointerLock()}else if(document.webkitExitPointerLock){document.webkitExitPointerLock()}else{return-1}return 0}function _emscripten_get_fullscreen_status(fullscreenStatus){if(typeof JSEvents.fullscreenEnabled()==="undefined")return-1;JSEvents.fillFullscreenChangeEventData(fullscreenStatus);return 0}function __emscripten_sample_gamepad_data(){if(!JSEvents.numGamepadsConnected)return;if(Browser.mainLoop.currentFrameNumber!==JSEvents.lastGamepadStateFrame||!Browser.mainLoop.currentFrameNumber){JSEvents.lastGamepadState=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads:null;JSEvents.lastGamepadStateFrame=Browser.mainLoop.currentFrameNumber}}function _emscripten_get_gamepad_status(index,gamepadState){__emscripten_sample_gamepad_data();if(!JSEvents.lastGamepadState)return-1;if(index<0||index>=JSEvents.lastGamepadState.length)return-5;if(!JSEvents.lastGamepadState[index])return-7;JSEvents.fillGamepadEventData(gamepadState,JSEvents.lastGamepadState[index]);return 0}function _emscripten_get_main_loop_timing(mode,value){if(mode)HEAP32[mode>>2]=Browser.mainLoop.timingMode;if(value)HEAP32[value>>2]=Browser.mainLoop.timingValue}function _emscripten_get_num_gamepads(){if(!JSEvents.numGamepadsConnected)return 0;__emscripten_sample_gamepad_data();if(!JSEvents.lastGamepadState)return-1;return JSEvents.lastGamepadState.length}function _emscripten_has_threading_support(){return 0}function _emscripten_html5_remove_all_event_listeners(){JSEvents.removeAllEventListeners()}function _emscripten_is_webgl_context_lost(target){if(!Module.ctx)return true;return Module.ctx.isContextLost()}function __reallyNegative(x){return x<0||x===0&&1/x===-Infinity}function __formatString(format,varargs){assert((varargs&3)===0);var textIndex=format;var argIndex=varargs;function prepVararg(ptr,type){if(type==="double"||type==="i64"){if(ptr&7){assert((ptr&7)===4);ptr+=4}}else{assert((ptr&3)===0)}return ptr}function getNextArg(type){var ret;argIndex=prepVararg(argIndex,type);if(type==="double"){ret=HEAPF64[argIndex>>3];argIndex+=8}else if(type=="i64"){ret=[HEAP32[argIndex>>2],HEAP32[argIndex+4>>2]];argIndex+=8}else{assert((argIndex&3)===0);type="i32";ret=HEAP32[argIndex>>2];argIndex+=4}return ret}var ret=[];var curr,next,currArg;while(1){var startTextIndex=textIndex;curr=HEAP8[textIndex>>0];if(curr===0)break;next=HEAP8[textIndex+1>>0];if(curr==37){var flagAlwaysSigned=false;var flagLeftAlign=false;var flagAlternative=false;var flagZeroPad=false;var flagPadSign=false;flagsLoop:while(1){switch(next){case 43:flagAlwaysSigned=true;break;case 45:flagLeftAlign=true;break;case 35:flagAlternative=true;break;case 48:if(flagZeroPad){break flagsLoop}else{flagZeroPad=true;break};case 32:flagPadSign=true;break;default:break flagsLoop}textIndex++;next=HEAP8[textIndex+1>>0]}var width=0;if(next==42){width=getNextArg("i32");textIndex++;next=HEAP8[textIndex+1>>0]}else{while(next>=48&&next<=57){width=width*10+(next-48);textIndex++;next=HEAP8[textIndex+1>>0]}}var precisionSet=false,precision=-1;if(next==46){precision=0;precisionSet=true;textIndex++;next=HEAP8[textIndex+1>>0];if(next==42){precision=getNextArg("i32");textIndex++}else{while(1){var precisionChr=HEAP8[textIndex+1>>0];if(precisionChr<48||precisionChr>57)break;precision=precision*10+(precisionChr-48);textIndex++}}next=HEAP8[textIndex+1>>0]}if(precision<0){precision=6;precisionSet=false}var argSize;switch(String.fromCharCode(next)){case"h":var nextNext=HEAP8[textIndex+2>>0];if(nextNext==104){textIndex++;argSize=1}else{argSize=2}break;case"l":var nextNext=HEAP8[textIndex+2>>0];if(nextNext==108){textIndex++;argSize=8}else{argSize=4}break;case"L":case"q":case"j":argSize=8;break;case"z":case"t":case"I":argSize=4;break;default:argSize=null}if(argSize)textIndex++;next=HEAP8[textIndex+1>>0];switch(String.fromCharCode(next)){case"d":case"i":case"u":case"o":case"x":case"X":case"p":{var signed=next==100||next==105;argSize=argSize||4;currArg=getNextArg("i"+argSize*8);var origArg=currArg;var argText;if(argSize==8){currArg=makeBigInt(currArg[0],currArg[1],next==117)}if(argSize<=4){var limit=Math.pow(256,argSize)-1;currArg=(signed?reSign:unSign)(currArg&limit,argSize*8)}var currAbsArg=Math.abs(currArg);var prefix="";if(next==100||next==105){if(argSize==8&&typeof i64Math==="object")argText=i64Math.stringify(origArg[0],origArg[1],null);else argText=reSign(currArg,8*argSize,1).toString(10)}else if(next==117){if(argSize==8&&typeof i64Math==="object")argText=i64Math.stringify(origArg[0],origArg[1],true);else argText=unSign(currArg,8*argSize,1).toString(10);currArg=Math.abs(currArg)}else if(next==111){argText=(flagAlternative?"0":"")+currAbsArg.toString(8)}else if(next==120||next==88){prefix=flagAlternative&&currArg!=0?"0x":"";if(argSize==8&&typeof i64Math==="object"){if(origArg[1]){argText=(origArg[1]>>>0).toString(16);var lower=(origArg[0]>>>0).toString(16);while(lower.length<8)lower="0"+lower;argText+=lower}else{argText=(origArg[0]>>>0).toString(16)}}else if(currArg<0){currArg=-currArg;argText=(currAbsArg-1).toString(16);var buffer=[];for(var i=0;i<argText.length;i++){buffer.push((15-parseInt(argText[i],16)).toString(16))}argText=buffer.join("");while(argText.length<argSize*2)argText="f"+argText}else{argText=currAbsArg.toString(16)}if(next==88){prefix=prefix.toUpperCase();argText=argText.toUpperCase()}}else if(next==112){if(currAbsArg===0){argText="(nil)"}else{prefix="0x";argText=currAbsArg.toString(16)}}if(precisionSet){while(argText.length<precision){argText="0"+argText}}if(currArg>=0){if(flagAlwaysSigned){prefix="+"+prefix}else if(flagPadSign){prefix=" "+prefix}}if(argText.charAt(0)=="-"){prefix="-"+prefix;argText=argText.substr(1)}while(prefix.length+argText.length<width){if(flagLeftAlign){argText+=" "}else{if(flagZeroPad){argText="0"+argText}else{prefix=" "+prefix}}}argText=prefix+argText;argText.split("").forEach((function(chr){ret.push(chr.charCodeAt(0))}));break};case"f":case"F":case"e":case"E":case"g":case"G":{currArg=getNextArg("double");var argText;if(isNaN(currArg)){argText="nan";flagZeroPad=false}else if(!isFinite(currArg)){argText=(currArg<0?"-":"")+"inf";flagZeroPad=false}else{var isGeneral=false;var effectivePrecision=Math.min(precision,20);if(next==103||next==71){isGeneral=true;precision=precision||1;var exponent=parseInt(currArg.toExponential(effectivePrecision).split("e")[1],10);if(precision>exponent&&exponent>=-4){next=(next==103?"f":"F").charCodeAt(0);precision-=exponent+1}else{next=(next==103?"e":"E").charCodeAt(0);precision--}effectivePrecision=Math.min(precision,20)}if(next==101||next==69){argText=currArg.toExponential(effectivePrecision);if(/[eE][-+]\d$/.test(argText)){argText=argText.slice(0,-1)+"0"+argText.slice(-1)}}else if(next==102||next==70){argText=currArg.toFixed(effectivePrecision);if(currArg===0&&__reallyNegative(currArg)){argText="-"+argText}}var parts=argText.split("e");if(isGeneral&&!flagAlternative){while(parts[0].length>1&&parts[0].indexOf(".")!=-1&&(parts[0].slice(-1)=="0"||parts[0].slice(-1)==".")){parts[0]=parts[0].slice(0,-1)}}else{if(flagAlternative&&argText.indexOf(".")==-1)parts[0]+=".";while(precision>effectivePrecision++)parts[0]+="0"}argText=parts[0]+(parts.length>1?"e"+parts[1]:"");if(next==69)argText=argText.toUpperCase();if(currArg>=0){if(flagAlwaysSigned){argText="+"+argText}else if(flagPadSign){argText=" "+argText}}}while(argText.length<width){if(flagLeftAlign){argText+=" "}else{if(flagZeroPad&&(argText[0]=="-"||argText[0]=="+")){argText=argText[0]+"0"+argText.slice(1)}else{argText=(flagZeroPad?"0":" ")+argText}}}if(next<97)argText=argText.toUpperCase();argText.split("").forEach((function(chr){ret.push(chr.charCodeAt(0))}));break};case"s":{var arg=getNextArg("i8*");var argLength=arg?_strlen(arg):"(null)".length;if(precisionSet)argLength=Math.min(argLength,precision);if(!flagLeftAlign){while(argLength<width--){ret.push(32)}}if(arg){for(var i=0;i<argLength;i++){ret.push(HEAPU8[arg++>>0])}}else{ret=ret.concat(intArrayFromString("(null)".substr(0,argLength),true))}if(flagLeftAlign){while(argLength<width--){ret.push(32)}}break};case"c":{if(flagLeftAlign)ret.push(getNextArg("i8"));while(--width>0){ret.push(32)}if(!flagLeftAlign)ret.push(getNextArg("i8"));break};case"n":{var ptr=getNextArg("i32*");HEAP32[ptr>>2]=ret.length;break};case"%":{ret.push(curr);break};default:{for(var i=startTextIndex;i<textIndex+2;i++){ret.push(HEAP8[i>>0])}}}textIndex+=2}else{ret.push(curr);textIndex+=1}}return ret}function __emscripten_traverse_stack(args){if(!args||!args.callee||!args.callee.name){return[null,"",""]}var funstr=args.callee.toString();var funcname=args.callee.name;var str="(";var first=true;for(var i in args){var a=args[i];if(!first){str+=", "}first=false;if(typeof a==="number"||typeof a==="string"){str+=a}else{str+="("+typeof a+")"}}str+=")";var caller=args.callee.caller;args=caller?caller.arguments:[];if(first)str="";return[args,funcname,str]}function _emscripten_get_callstack_js(flags){var callstack=jsStackTrace();var iThisFunc=callstack.lastIndexOf("_emscripten_log");var iThisFunc2=callstack.lastIndexOf("_emscripten_get_callstack");var iNextLine=callstack.indexOf("\n",Math.max(iThisFunc,iThisFunc2))+1;callstack=callstack.slice(iNextLine);if(flags&8&&typeof emscripten_source_map==="undefined"){warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');flags^=8;flags|=16}var stack_args=null;if(flags&128){stack_args=__emscripten_traverse_stack(arguments);while(stack_args[1].indexOf("_emscripten_")>=0)stack_args=__emscripten_traverse_stack(stack_args[0])}var lines=callstack.split("\n");callstack="";var newFirefoxRe=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");var firefoxRe=new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");var chromeRe=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var l in lines){var line=lines[l];var jsSymbolName="";var file="";var lineno=0;var column=0;var parts=chromeRe.exec(line);if(parts&&parts.length==5){jsSymbolName=parts[1];file=parts[2];lineno=parts[3];column=parts[4]}else{parts=newFirefoxRe.exec(line);if(!parts)parts=firefoxRe.exec(line);if(parts&&parts.length>=4){jsSymbolName=parts[1];file=parts[2];lineno=parts[3];column=parts[4]|0}else{callstack+=line+"\n";continue}}var cSymbolName=flags&32?demangle(jsSymbolName):jsSymbolName;if(!cSymbolName){cSymbolName=jsSymbolName}var haveSourceMap=false;if(flags&8){var orig=emscripten_source_map.originalPositionFor({line:lineno,column:column});haveSourceMap=orig&&orig.source;if(haveSourceMap){if(flags&64){orig.source=orig.source.substring(orig.source.replace(/\\/g,"/").lastIndexOf("/")+1)}callstack+="    at "+cSymbolName+" ("+orig.source+":"+orig.line+":"+orig.column+")\n"}}if(flags&16||!haveSourceMap){if(flags&64){file=file.substring(file.replace(/\\/g,"/").lastIndexOf("/")+1)}callstack+=(haveSourceMap?"     = "+jsSymbolName:"    at "+cSymbolName)+" ("+file+":"+lineno+":"+column+")\n"}if(flags&128&&stack_args[0]){if(stack_args[1]==jsSymbolName&&stack_args[2].length>0){callstack=callstack.replace(/\s+$/,"");callstack+=" with values: "+stack_args[1]+stack_args[2]+"\n"}stack_args=__emscripten_traverse_stack(stack_args[0])}}callstack=callstack.replace(/\s+$/,"");return callstack}function _emscripten_log_js(flags,str){if(flags&24){str=str.replace(/\s+$/,"");str+=(str.length>0?"\n":"")+_emscripten_get_callstack_js(flags)}if(flags&1){if(flags&4){console.error(str)}else if(flags&2){console.warn(str)}else{console.log(str)}}else if(flags&6){err(str)}else{out(str)}}function _emscripten_log(flags,varargs){var format=HEAP32[varargs>>2];varargs+=4;var str="";if(format){var result=__formatString(format,varargs);for(var i=0;i<result.length;++i){str+=String.fromCharCode(result[i])}}_emscripten_log_js(flags,str)}function _longjmp(env,value){Module["setThrew"](env,value||1);throw"longjmp"}function _emscripten_longjmp(env,value){_longjmp(env,value)}function _emscripten_num_logical_cores(){return 1}function __setLetterbox(element,topBottom,leftRight){if(JSEvents.isInternetExplorer()){element.style.marginLeft=element.style.marginRight=leftRight+"px";element.style.marginTop=element.style.marginBottom=topBottom+"px"}else{element.style.paddingLeft=element.style.paddingRight=leftRight+"px";element.style.paddingTop=element.style.paddingBottom=topBottom+"px"}}function __emscripten_do_request_fullscreen(target,strategy){if(typeof JSEvents.fullscreenEnabled()==="undefined")return-1;if(!JSEvents.fullscreenEnabled())return-3;if(!target)target="#canvas";target=JSEvents.findEventTarget(target);if(!target)return-4;if(!target.requestFullscreen&&!target.msRequestFullscreen&&!target.mozRequestFullScreen&&!target.mozRequestFullscreen&&!target.webkitRequestFullscreen){return-3}var canPerformRequests=JSEvents.canPerformEventHandlerRequests();if(!canPerformRequests){if(strategy.deferUntilInEventHandler){JSEvents.deferCall(JSEvents.requestFullscreen,1,[target,strategy]);return 1}else{return-2}}return JSEvents.requestFullscreen(target,strategy)}function _emscripten_request_fullscreen(target,deferUntilInEventHandler){var strategy={};strategy.scaleMode=0;strategy.canvasResolutionScaleMode=0;strategy.filteringMode=0;strategy.deferUntilInEventHandler=deferUntilInEventHandler;strategy.canvasResizedCallbackTargetThread=2;return __emscripten_do_request_fullscreen(target,strategy)}function _emscripten_request_pointerlock(target,deferUntilInEventHandler){if(!target)target="#canvas";target=JSEvents.findEventTarget(target);if(!target)return-4;if(!target.requestPointerLock&&!target.mozRequestPointerLock&&!target.webkitRequestPointerLock&&!target.msRequestPointerLock){return-1}var canPerformRequests=JSEvents.canPerformEventHandlerRequests();if(!canPerformRequests){if(deferUntilInEventHandler){JSEvents.deferCall(JSEvents.requestPointerLock,2,[target]);return 1}else{return-2}}return JSEvents.requestPointerLock(target)}function _emscripten_set_blur_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerFocusEventCallback(target,userData,useCapture,callbackfunc,12,"blur",targetThread);return 0}function _emscripten_set_dblclick_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerMouseEventCallback(target,userData,useCapture,callbackfunc,7,"dblclick",targetThread);return 0}function _emscripten_set_devicemotion_callback_on_thread(userData,useCapture,callbackfunc,targetThread){JSEvents.registerDeviceMotionEventCallback(window,userData,useCapture,callbackfunc,17,"devicemotion",targetThread);return 0}function _emscripten_set_deviceorientation_callback_on_thread(userData,useCapture,callbackfunc,targetThread){JSEvents.registerDeviceOrientationEventCallback(window,userData,useCapture,callbackfunc,16,"deviceorientation",targetThread);return 0}function _emscripten_set_focus_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerFocusEventCallback(target,userData,useCapture,callbackfunc,13,"focus",targetThread);return 0}function _emscripten_set_fullscreenchange_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){if(typeof JSEvents.fullscreenEnabled()==="undefined")return-1;if(!target)target=document;else{target=JSEvents.findEventTarget(target);if(!target)return-4}JSEvents.registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,19,"fullscreenchange",targetThread);JSEvents.registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,19,"mozfullscreenchange",targetThread);JSEvents.registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,19,"webkitfullscreenchange",targetThread);JSEvents.registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,19,"msfullscreenchange",targetThread);return 0}function _emscripten_set_gamepadconnected_callback_on_thread(userData,useCapture,callbackfunc,targetThread){if(!navigator.getGamepads&&!navigator.webkitGetGamepads)return-1;JSEvents.registerGamepadEventCallback(window,userData,useCapture,callbackfunc,26,"gamepadconnected",targetThread);return 0}function _emscripten_set_gamepaddisconnected_callback_on_thread(userData,useCapture,callbackfunc,targetThread){if(!navigator.getGamepads&&!navigator.webkitGetGamepads)return-1;JSEvents.registerGamepadEventCallback(window,userData,useCapture,callbackfunc,27,"gamepaddisconnected",targetThread);return 0}function _emscripten_set_keydown_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerKeyEventCallback(target,userData,useCapture,callbackfunc,2,"keydown",targetThread);return 0}function _emscripten_set_keypress_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerKeyEventCallback(target,userData,useCapture,callbackfunc,1,"keypress",targetThread);return 0}function _emscripten_set_keyup_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerKeyEventCallback(target,userData,useCapture,callbackfunc,3,"keyup",targetThread);return 0}function _emscripten_set_mousedown_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerMouseEventCallback(target,userData,useCapture,callbackfunc,5,"mousedown",targetThread);return 0}function _emscripten_set_mousemove_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerMouseEventCallback(target,userData,useCapture,callbackfunc,8,"mousemove",targetThread);return 0}function _emscripten_set_mouseup_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerMouseEventCallback(target,userData,useCapture,callbackfunc,6,"mouseup",targetThread);return 0}function _emscripten_set_touchcancel_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerTouchEventCallback(target,userData,useCapture,callbackfunc,25,"touchcancel",targetThread);return 0}function _emscripten_set_touchend_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerTouchEventCallback(target,userData,useCapture,callbackfunc,23,"touchend",targetThread);return 0}function _emscripten_set_touchmove_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerTouchEventCallback(target,userData,useCapture,callbackfunc,24,"touchmove",targetThread);return 0}function _emscripten_set_touchstart_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){JSEvents.registerTouchEventCallback(target,userData,useCapture,callbackfunc,22,"touchstart",targetThread);return 0}function _emscripten_set_wheel_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){target=JSEvents.findEventTarget(target);if(typeof target.onwheel!=="undefined"){JSEvents.registerWheelEventCallback(target,userData,useCapture,callbackfunc,9,"wheel",targetThread);return 0}else if(typeof target.onmousewheel!=="undefined"){JSEvents.registerWheelEventCallback(target,userData,useCapture,callbackfunc,9,"mousewheel",targetThread);return 0}else{return-1}}var GL={counter:1,lastError:0,buffers:[],mappedBuffers:{},programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],currentContext:null,offscreenCanvases:{},timerQueriesEXT:[],queries:[],samplers:[],transformFeedbacks:[],syncs:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},stringiCache:{},tempFixedLengthArray:[],packAlignment:4,unpackAlignment:4,init:(function(){GL.miniTempBuffer=new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);for(var i=0;i<GL.MINI_TEMP_BUFFER_SIZE;i++){GL.miniTempBufferViews[i]=GL.miniTempBuffer.subarray(0,i+1)}for(var i=0;i<32;i++){GL.tempFixedLengthArray.push(new Array(i))}}),recordError:function recordError(errorCode){if(!GL.lastError){GL.lastError=errorCode}},getNewId:(function(table){var ret=GL.counter++;for(var i=table.length;i<ret;i++){table[i]=null}return ret}),MINI_TEMP_BUFFER_SIZE:256,miniTempBuffer:null,miniTempBufferViews:[0],getSource:(function(shader,count,string,length){var source="";for(var i=0;i<count;++i){var frag;if(length){var len=HEAP32[length+i*4>>2];if(len<0){frag=Pointer_stringify(HEAP32[string+i*4>>2])}else{frag=Pointer_stringify(HEAP32[string+i*4>>2],len)}}else{frag=Pointer_stringify(HEAP32[string+i*4>>2])}source+=frag}return source}),createContext:(function(canvas,webGLContextAttributes){if(typeof webGLContextAttributes["majorVersion"]==="undefined"&&typeof webGLContextAttributes["minorVersion"]==="undefined"){if(typeof WebGL2RenderingContext!=="undefined")webGLContextAttributes["majorVersion"]=2;else webGLContextAttributes["majorVersion"]=1;webGLContextAttributes["minorVersion"]=0}var ctx;var errorInfo="?";function onContextCreationError(event){errorInfo=event.statusMessage||errorInfo}webGLContextAttributes["powerPreference"]="high-performance";try{canvas.addEventListener("webglcontextcreationerror",onContextCreationError,false);try{if(webGLContextAttributes["majorVersion"]==1&&webGLContextAttributes["minorVersion"]==0){ctx=canvas.getContext("webgl",webGLContextAttributes)||canvas.getContext("experimental-webgl",webGLContextAttributes)}else if(webGLContextAttributes["majorVersion"]==2&&webGLContextAttributes["minorVersion"]==0){ctx=canvas.getContext("webgl2",webGLContextAttributes)}else{throw"Unsupported WebGL context version "+majorVersion+"."+minorVersion+"!"}}finally{canvas.removeEventListener("webglcontextcreationerror",onContextCreationError,false)}if(!ctx)throw":("}catch(e){out("Could not create canvas: "+[errorInfo,e,JSON.stringify(webGLContextAttributes)]);return 0}if(!ctx)return 0;var context=GL.registerContext(ctx,webGLContextAttributes);return context}),registerContext:(function(ctx,webGLContextAttributes){var handle=_malloc(8);HEAP32[handle>>2]=webGLContextAttributes["explicitSwapControl"];var context={handle:handle,attributes:webGLContextAttributes,version:webGLContextAttributes["majorVersion"],GLctx:ctx};function getChromeVersion(){var raw=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);return raw?parseInt(raw[2],10):false}context.supportsWebGL2EntryPoints=context.version>=2&&(getChromeVersion()===false||getChromeVersion()>=58);if(ctx.canvas)ctx.canvas.GLctxObject=context;GL.contexts[handle]=context;if(typeof webGLContextAttributes["enableExtensionsByDefault"]==="undefined"||webGLContextAttributes["enableExtensionsByDefault"]){GL.initExtensions(context)}if(webGLContextAttributes["renderViaOffscreenBackBuffer"]){return 0}return handle}),makeContextCurrent:(function(contextHandle){if(!contextHandle){GLctx=Module.ctx=GL.currentContext=null;return true}var context=GL.contexts[contextHandle];if(!context){return false}GLctx=Module.ctx=context.GLctx;GL.currentContext=context;return true}),getContext:(function(contextHandle){return GL.contexts[contextHandle]}),deleteContext:(function(contextHandle){if(!contextHandle)return;if(GL.currentContext===GL.contexts[contextHandle])GL.currentContext=null;if(typeof JSEvents==="object")JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);if(GL.contexts[contextHandle]&&GL.contexts[contextHandle].GLctx.canvas)GL.contexts[contextHandle].GLctx.canvas.GLctxObject=undefined;_free(GL.contexts[contextHandle]);GL.contexts[contextHandle]=null}),initExtensions:(function(context){if(!context)context=GL.currentContext;if(context.initExtensionsDone)return;context.initExtensionsDone=true;var GLctx=context.GLctx;context.maxVertexAttribs=GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);if(context.version<2){var instancedArraysExt=GLctx.getExtension("ANGLE_instanced_arrays");if(instancedArraysExt){GLctx["vertexAttribDivisor"]=(function(index,divisor){instancedArraysExt["vertexAttribDivisorANGLE"](index,divisor)});GLctx["drawArraysInstanced"]=(function(mode,first,count,primcount){instancedArraysExt["drawArraysInstancedANGLE"](mode,first,count,primcount)});GLctx["drawElementsInstanced"]=(function(mode,count,type,indices,primcount){instancedArraysExt["drawElementsInstancedANGLE"](mode,count,type,indices,primcount)})}var vaoExt=GLctx.getExtension("OES_vertex_array_object");if(vaoExt){GLctx["createVertexArray"]=(function(){return vaoExt["createVertexArrayOES"]()});GLctx["deleteVertexArray"]=(function(vao){vaoExt["deleteVertexArrayOES"](vao)});GLctx["bindVertexArray"]=(function(vao){vaoExt["bindVertexArrayOES"](vao)});GLctx["isVertexArray"]=(function(vao){return vaoExt["isVertexArrayOES"](vao)})}var drawBuffersExt=GLctx.getExtension("WEBGL_draw_buffers");if(drawBuffersExt){GLctx["drawBuffers"]=(function(n,bufs){drawBuffersExt["drawBuffersWEBGL"](n,bufs)})}}GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query");var automaticallyEnabledExtensions=["OES_texture_float","OES_texture_half_float","OES_standard_derivatives","OES_vertex_array_object","WEBGL_compressed_texture_s3tc","WEBGL_depth_texture","OES_element_index_uint","EXT_texture_filter_anisotropic","EXT_frag_depth","WEBGL_draw_buffers","ANGLE_instanced_arrays","OES_texture_float_linear","OES_texture_half_float_linear","EXT_blend_minmax","EXT_shader_texture_lod","EXT_texture_norm16","WEBGL_compressed_texture_pvrtc","EXT_color_buffer_half_float","WEBGL_color_buffer_float","EXT_sRGB","WEBGL_compressed_texture_etc1","EXT_disjoint_timer_query","WEBGL_compressed_texture_etc","WEBGL_compressed_texture_astc","EXT_color_buffer_float","WEBGL_compressed_texture_s3tc_srgb","EXT_disjoint_timer_query_webgl2","WEBKIT_WEBGL_compressed_texture_pvrtc"];var exts=GLctx.getSupportedExtensions();if(exts&&exts.length>0){GLctx.getSupportedExtensions().forEach((function(ext){if(automaticallyEnabledExtensions.indexOf(ext)!=-1){GLctx.getExtension(ext)}}))}}),populateUniformTable:(function(program){var p=GL.programs[program];GL.programInfos[program]={uniforms:{},maxUniformLength:0,maxAttributeLength:-1,maxUniformBlockNameLength:-1};var ptable=GL.programInfos[program];var utable=ptable.uniforms;var numUniforms=GLctx.getProgramParameter(p,GLctx.ACTIVE_UNIFORMS);for(var i=0;i<numUniforms;++i){var u=GLctx.getActiveUniform(p,i);var name=u.name;ptable.maxUniformLength=Math.max(ptable.maxUniformLength,name.length+1);if(name.indexOf("]",name.length-1)!==-1){var ls=name.lastIndexOf("[");name=name.slice(0,ls)}var loc=GLctx.getUniformLocation(p,name);if(loc!=null){var id=GL.getNewId(GL.uniforms);utable[name]=[u.size,id];GL.uniforms[id]=loc;for(var j=1;j<u.size;++j){var n=name+"["+j+"]";loc=GLctx.getUniformLocation(p,n);id=GL.getNewId(GL.uniforms);GL.uniforms[id]=loc}}}})};function _emscripten_webgl_do_create_context(target,attributes){var contextAttributes={};contextAttributes["alpha"]=!!HEAP32[attributes>>2];contextAttributes["depth"]=!!HEAP32[attributes+4>>2];contextAttributes["stencil"]=!!HEAP32[attributes+8>>2];contextAttributes["antialias"]=!!HEAP32[attributes+12>>2];contextAttributes["premultipliedAlpha"]=!!HEAP32[attributes+16>>2];contextAttributes["preserveDrawingBuffer"]=!!HEAP32[attributes+20>>2];contextAttributes["preferLowPowerToHighPerformance"]=!!HEAP32[attributes+24>>2];contextAttributes["failIfMajorPerformanceCaveat"]=!!HEAP32[attributes+28>>2];contextAttributes["majorVersion"]=HEAP32[attributes+32>>2];contextAttributes["minorVersion"]=HEAP32[attributes+36>>2];contextAttributes["explicitSwapControl"]=HEAP32[attributes+44>>2];contextAttributes["proxyContextToMainThread"]=HEAP32[attributes+48>>2];contextAttributes["renderViaOffscreenBackBuffer"]=HEAP32[attributes+52>>2];target=Pointer_stringify(target);var canvas;if((!target||target==="#canvas")&&Module["canvas"]){canvas=Module["canvas"].id&&GL.offscreenCanvases[Module["canvas"].id]?GL.offscreenCanvases[Module["canvas"].id].offscreenCanvas||JSEvents.findEventTarget(Module["canvas"].id):Module["canvas"]}else{canvas=GL.offscreenCanvases[target]?GL.offscreenCanvases[target].offscreenCanvas:JSEvents.findEventTarget(target)}if(!canvas){return 0}if(contextAttributes["explicitSwapControl"]){return 0}var contextHandle=GL.createContext(canvas,contextAttributes);return contextHandle}function _emscripten_webgl_create_context(){return _emscripten_webgl_do_create_context.apply(null,arguments)}function _emscripten_webgl_destroy_context_calling_thread(contextHandle){GL.deleteContext(contextHandle)}function _emscripten_webgl_destroy_context(){return _emscripten_webgl_destroy_context_calling_thread.apply(null,arguments)}function _emscripten_webgl_enable_extension_calling_thread(contextHandle,extension){var context=GL.getContext(contextHandle);var extString=Pointer_stringify(extension);if(extString.indexOf("GL_")==0)extString=extString.substr(3);var ext=context.GLctx.getExtension(extString);return ext?1:0}function _emscripten_webgl_enable_extension(){return _emscripten_webgl_enable_extension_calling_thread.apply(null,arguments)}function _emscripten_webgl_do_get_current_context(){return GL.currentContext?GL.currentContext.handle:0}function _emscripten_webgl_get_current_context(){return _emscripten_webgl_do_get_current_context.apply(null,arguments)}function _emscripten_webgl_init_context_attributes(attributes){HEAP32[attributes>>2]=1;HEAP32[attributes+4>>2]=1;HEAP32[attributes+8>>2]=0;HEAP32[attributes+12>>2]=1;HEAP32[attributes+16>>2]=1;HEAP32[attributes+20>>2]=0;HEAP32[attributes+24>>2]=0;HEAP32[attributes+28>>2]=0;HEAP32[attributes+32>>2]=1;HEAP32[attributes+36>>2]=0;HEAP32[attributes+40>>2]=1;HEAP32[attributes+44>>2]=0;HEAP32[attributes+48>>2]=0;HEAP32[attributes+52>>2]=0}function _emscripten_webgl_make_context_current(contextHandle){var success=GL.makeContextCurrent(contextHandle);return success?0:-5}function __exit(status){exit(status)}function _exit(status){__exit(status)}function _flock(fd,operation){return 0}function _getaddrinfo(node,service,hint,out){var addr=0;var port=0;var flags=0;var family=0;var type=0;var proto=0;var ai;function allocaddrinfo(family,type,proto,canon,addr,port){var sa,salen,ai;var res;salen=family===10?28:16;addr=family===10?__inet_ntop6_raw(addr):__inet_ntop4_raw(addr);sa=_malloc(salen);res=__write_sockaddr(sa,family,addr,port);assert(!res.errno);ai=_malloc(32);HEAP32[ai+4>>2]=family;HEAP32[ai+8>>2]=type;HEAP32[ai+12>>2]=proto;HEAP32[ai+24>>2]=canon;HEAP32[ai+20>>2]=sa;if(family===10){HEAP32[ai+16>>2]=28}else{HEAP32[ai+16>>2]=16}HEAP32[ai+28>>2]=0;return ai}if(hint){flags=HEAP32[hint>>2];family=HEAP32[hint+4>>2];type=HEAP32[hint+8>>2];proto=HEAP32[hint+12>>2]}if(type&&!proto){proto=type===2?17:6}if(!type&&proto){type=proto===17?2:1}if(proto===0){proto=6}if(type===0){type=1}if(!node&&!service){return-2}if(flags&~(1|2|4|1024|8|16|32)){return-1}if(hint!==0&&HEAP32[hint>>2]&2&&!node){return-1}if(flags&32){return-2}if(type!==0&&type!==1&&type!==2){return-7}if(family!==0&&family!==2&&family!==10){return-6}if(service){service=Pointer_stringify(service);port=parseInt(service,10);if(isNaN(port)){if(flags&1024){return-2}return-8}}if(!node){if(family===0){family=2}if((flags&1)===0){if(family===2){addr=_htonl(2130706433)}else{addr=[0,0,0,1]}}ai=allocaddrinfo(family,type,proto,null,addr,port);HEAP32[out>>2]=ai;return 0}node=Pointer_stringify(node);addr=__inet_pton4_raw(node);if(addr!==null){if(family===0||family===2){family=2}else if(family===10&&flags&8){addr=[0,0,_htonl(65535),addr];family=10}else{return-2}}else{addr=__inet_pton6_raw(node);if(addr!==null){if(family===0||family===10){family=10}else{return-2}}}if(addr!=null){ai=allocaddrinfo(family,type,proto,node,addr,port);HEAP32[out>>2]=ai;return 0}if(flags&4){return-2}node=DNS.lookup_name(node);addr=__inet_pton4_raw(node);if(family===0){family=2}else if(family===10){addr=[0,0,_htonl(65535),addr]}ai=allocaddrinfo(family,type,proto,null,addr,port);HEAP32[out>>2]=ai;return 0}function _getenv(name){if(name===0)return 0;name=Pointer_stringify(name);if(!ENV.hasOwnProperty(name))return 0;if(_getenv.ret)_free(_getenv.ret);_getenv.ret=allocateUTF8(ENV[name]);return _getenv.ret}function _gethostbyname(name){name=Pointer_stringify(name);var ret=_malloc(20);var nameBuf=_malloc(name.length+1);stringToUTF8(name,nameBuf,name.length+1);HEAP32[ret>>2]=nameBuf;var aliasesBuf=_malloc(4);HEAP32[aliasesBuf>>2]=0;HEAP32[ret+4>>2]=aliasesBuf;var afinet=2;HEAP32[ret+8>>2]=afinet;HEAP32[ret+12>>2]=4;var addrListBuf=_malloc(12);HEAP32[addrListBuf>>2]=addrListBuf+8;HEAP32[addrListBuf+4>>2]=0;HEAP32[addrListBuf+8>>2]=__inet_pton4_raw(DNS.lookup_name(name));HEAP32[ret+16>>2]=addrListBuf;return ret}function _gethostbyaddr(addr,addrlen,type){if(type!==2){___setErrNo(ERRNO_CODES.EAFNOSUPPORT);return null}addr=HEAP32[addr>>2];var host=__inet_ntop4_raw(addr);var lookup=DNS.lookup_addr(host);if(lookup){host=lookup}var hostp=allocate(intArrayFromString(host),"i8",ALLOC_STACK);return _gethostbyname(hostp)}function _getnameinfo(sa,salen,node,nodelen,serv,servlen,flags){var info=__read_sockaddr(sa,salen);if(info.errno){return-6}var port=info.port;var addr=info.addr;var overflowed=false;if(node&&nodelen){var lookup;if(flags&1||!(lookup=DNS.lookup_addr(addr))){if(flags&8){return-2}}else{addr=lookup}var numBytesWrittenExclNull=stringToUTF8(addr,node,nodelen);if(numBytesWrittenExclNull+1>=nodelen){overflowed=true}}if(serv&&servlen){port=""+port;var numBytesWrittenExclNull=stringToUTF8(port,serv,servlen);if(numBytesWrittenExclNull+1>=servlen){overflowed=true}}if(overflowed){return-12}return 0}function _getpagesize(){return PAGE_SIZE}function _getpwuid(uid){return 0}function _gettimeofday(ptr){var now=Date.now();HEAP32[ptr>>2]=now/1e3|0;HEAP32[ptr+4>>2]=now%1e3*1e3|0;return 0}function _glActiveTexture(x0){GLctx["activeTexture"](x0)}function _glAttachShader(program,shader){GLctx.attachShader(GL.programs[program],GL.shaders[shader])}function _glBeginQuery(target,id){GLctx["beginQuery"](target,id?GL.queries[id]:null)}function _glBeginTransformFeedback(x0){GLctx["beginTransformFeedback"](x0)}function _glBindAttribLocation(program,index,name){name=Pointer_stringify(name);GLctx.bindAttribLocation(GL.programs[program],index,name)}function _glBindBuffer(target,buffer){var bufferObj=buffer?GL.buffers[buffer]:null;if(target==35051){GLctx.currentPixelPackBufferBinding=buffer}else if(target==35052){GLctx.currentPixelUnpackBufferBinding=buffer}GLctx.bindBuffer(target,bufferObj)}function _glBindBufferBase(target,index,buffer){var bufferObj=buffer?GL.buffers[buffer]:null;GLctx["bindBufferBase"](target,index,bufferObj)}function _glBindBufferRange(target,index,buffer,offset,ptrsize){var bufferObj=buffer?GL.buffers[buffer]:null;GLctx["bindBufferRange"](target,index,bufferObj,offset,ptrsize)}function _glBindFramebuffer(target,framebuffer){GLctx.bindFramebuffer(target,framebuffer?GL.framebuffers[framebuffer]:null)}function _glBindRenderbuffer(target,renderbuffer){GLctx.bindRenderbuffer(target,renderbuffer?GL.renderbuffers[renderbuffer]:null)}function _glBindSampler(unit,sampler){GLctx["bindSampler"](unit,sampler?GL.samplers[sampler]:null)}function _glBindTexture(target,texture){GLctx.bindTexture(target,texture?GL.textures[texture]:null)}function _glBindTransformFeedback(target,id){var transformFeedback=id?GL.transformFeedbacks[id]:null;if(id&&!transformFeedback){GL.recordError(1282);return}GLctx["bindTransformFeedback"](target,transformFeedback)}function _glBindVertexArray(vao){GLctx["bindVertexArray"](GL.vaos[vao])}function _glBlendEquation(x0){GLctx["blendEquation"](x0)}function _glBlendEquationSeparate(x0,x1){GLctx["blendEquationSeparate"](x0,x1)}function _glBlendFuncSeparate(x0,x1,x2,x3){GLctx["blendFuncSeparate"](x0,x1,x2,x3)}function _glBlitFramebuffer(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9){GLctx["blitFramebuffer"](x0,x1,x2,x3,x4,x5,x6,x7,x8,x9)}function _glBufferData(target,size,data,usage){if(!data){GLctx.bufferData(target,size,usage)}else{if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.bufferData(target,HEAPU8,usage,data,size);return}GLctx.bufferData(target,HEAPU8.subarray(data,data+size),usage)}}function _glBufferSubData(target,offset,size,data){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.bufferSubData(target,offset,HEAPU8,data,size);return}GLctx.bufferSubData(target,offset,HEAPU8.subarray(data,data+size))}function _glCheckFramebufferStatus(x0){return GLctx["checkFramebufferStatus"](x0)}function _glClear(mask){if(mask==16384&&GLctx.dontClearAlphaOnly){var v=GLctx.getParameter(GLctx.COLOR_WRITEMASK);if(!v[0]&&!v[1]&&!v[2]&&v[3])return}GLctx.clear(mask)}function _glClearBufferfi(x0,x1,x2,x3){GLctx["clearBufferfi"](x0,x1,x2,x3)}function _glClearBufferfv(buffer,drawbuffer,value){GLctx["clearBufferfv"](buffer,drawbuffer,HEAPF32,value>>2)}function _glClearBufferuiv(buffer,drawbuffer,value){GLctx["clearBufferuiv"](buffer,drawbuffer,HEAPU32,value>>2)}function _glClearColor(x0,x1,x2,x3){GLctx["clearColor"](x0,x1,x2,x3)}function _glClearDepthf(x0){GLctx["clearDepth"](x0)}function _glClearStencil(x0){GLctx["clearStencil"](x0)}function _glClientWaitSync(sync,flags,timeoutLo,timeoutHi){timeoutLo=timeoutLo>>>0;timeoutHi=timeoutHi>>>0;var timeout=timeoutLo==4294967295&&timeoutHi==4294967295?-1:makeBigInt(timeoutLo,timeoutHi,true);return GLctx.clientWaitSync(GL.syncs[sync],flags,timeout)}function _glColorMask(red,green,blue,alpha){GLctx.colorMask(!!red,!!green,!!blue,!!alpha)}function _glCompileShader(shader){GLctx.compileShader(GL.shaders[shader])}function _glCompressedTexImage2D(target,level,internalFormat,width,height,border,imageSize,data){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,HEAPU8,data,imageSize);return}GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,data?HEAPU8.subarray(data,data+imageSize):null)}function _glCompressedTexImage3D(target,level,internalFormat,width,height,depth,border,imageSize,data){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx["compressedTexImage3D"](target,level,internalFormat,width,height,depth,border,HEAPU8,data,imageSize)}else{GLctx["compressedTexImage3D"](target,level,internalFormat,width,height,depth,border,data?HEAPU8.subarray(data,data+imageSize):null)}}function _glCompressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,imageSize,data){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,HEAPU8,data,imageSize);return}GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,data?HEAPU8.subarray(data,data+imageSize):null)}function _glCompressedTexSubImage3D(target,level,xoffset,yoffset,zoffset,width,height,depth,format,imageSize,data){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx["compressedTexSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,HEAPU8,data,imageSize)}else{GLctx["compressedTexSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,data?HEAPU8.subarray(data,data+imageSize):null)}}function _glCopyBufferSubData(x0,x1,x2,x3,x4){GLctx["copyBufferSubData"](x0,x1,x2,x3,x4)}function _glCopyTexImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _glCopyTexSubImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexSubImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _glCreateProgram(){var id=GL.getNewId(GL.programs);var program=GLctx.createProgram();program.name=id;GL.programs[id]=program;return id}function _glCreateShader(shaderType){var id=GL.getNewId(GL.shaders);GL.shaders[id]=GLctx.createShader(shaderType);return id}function _glCullFace(x0){GLctx["cullFace"](x0)}function _glDeleteBuffers(n,buffers){for(var i=0;i<n;i++){var id=HEAP32[buffers+i*4>>2];var buffer=GL.buffers[id];if(!buffer)continue;GLctx.deleteBuffer(buffer);buffer.name=0;GL.buffers[id]=null;if(id==GL.currArrayBuffer)GL.currArrayBuffer=0;if(id==GL.currElementArrayBuffer)GL.currElementArrayBuffer=0}}function _glDeleteFramebuffers(n,framebuffers){for(var i=0;i<n;++i){var id=HEAP32[framebuffers+i*4>>2];var framebuffer=GL.framebuffers[id];if(!framebuffer)continue;GLctx.deleteFramebuffer(framebuffer);framebuffer.name=0;GL.framebuffers[id]=null}}function _glDeleteProgram(id){if(!id)return;var program=GL.programs[id];if(!program){GL.recordError(1281);return}GLctx.deleteProgram(program);program.name=0;GL.programs[id]=null;GL.programInfos[id]=null}function _glDeleteQueries(n,ids){for(var i=0;i<n;i++){var id=HEAP32[ids+i*4>>2];var query=GL.queries[id];if(!query)continue;GLctx["deleteQuery"](query);GL.queries[id]=null}}function _glDeleteRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var id=HEAP32[renderbuffers+i*4>>2];var renderbuffer=GL.renderbuffers[id];if(!renderbuffer)continue;GLctx.deleteRenderbuffer(renderbuffer);renderbuffer.name=0;GL.renderbuffers[id]=null}}function _glDeleteSamplers(n,samplers){for(var i=0;i<n;i++){var id=HEAP32[samplers+i*4>>2];var sampler=GL.samplers[id];if(!sampler)continue;GLctx["deleteSampler"](sampler);sampler.name=0;GL.samplers[id]=null}}function _glDeleteShader(id){if(!id)return;var shader=GL.shaders[id];if(!shader){GL.recordError(1281);return}GLctx.deleteShader(shader);GL.shaders[id]=null}function _glDeleteSync(id){if(!id)return;var sync=GL.syncs[id];if(!sync){GL.recordError(1281);return}GLctx.deleteSync(sync);sync.name=0;GL.syncs[id]=null}function _glDeleteTextures(n,textures){for(var i=0;i<n;i++){var id=HEAP32[textures+i*4>>2];var texture=GL.textures[id];if(!texture)continue;GLctx.deleteTexture(texture);texture.name=0;GL.textures[id]=null}}function _glDeleteTransformFeedbacks(n,ids){for(var i=0;i<n;i++){var id=HEAP32[ids+i*4>>2];var transformFeedback=GL.transformFeedbacks[id];if(!transformFeedback)continue;GLctx["deleteTransformFeedback"](transformFeedback);transformFeedback.name=0;GL.transformFeedbacks[id]=null}}function _glDeleteVertexArrays(n,vaos){for(var i=0;i<n;i++){var id=HEAP32[vaos+i*4>>2];GLctx["deleteVertexArray"](GL.vaos[id]);GL.vaos[id]=null}}function _glDepthFunc(x0){GLctx["depthFunc"](x0)}function _glDepthMask(flag){GLctx.depthMask(!!flag)}function _glDetachShader(program,shader){GLctx.detachShader(GL.programs[program],GL.shaders[shader])}function _glDisable(x0){GLctx["disable"](x0)}function _glDisableVertexAttribArray(index){GLctx.disableVertexAttribArray(index)}function _glDrawArrays(mode,first,count){GLctx.drawArrays(mode,first,count)}function _glDrawArraysInstanced(mode,first,count,primcount){GLctx["drawArraysInstanced"](mode,first,count,primcount)}function _glDrawBuffers(n,bufs){var bufArray=GL.tempFixedLengthArray[n];for(var i=0;i<n;i++){bufArray[i]=HEAP32[bufs+i*4>>2]}GLctx["drawBuffers"](bufArray)}function _glDrawElements(mode,count,type,indices){GLctx.drawElements(mode,count,type,indices)}function _glDrawElementsInstanced(mode,count,type,indices,primcount){GLctx["drawElementsInstanced"](mode,count,type,indices,primcount)}function _glEnable(x0){GLctx["enable"](x0)}function _glEnableVertexAttribArray(index){GLctx.enableVertexAttribArray(index)}function _glEndQuery(x0){GLctx["endQuery"](x0)}function _glEndTransformFeedback(){GLctx["endTransformFeedback"]()}function _glFenceSync(condition,flags){var sync=GLctx.fenceSync(condition,flags);if(sync){var id=GL.getNewId(GL.syncs);sync.name=id;GL.syncs[id]=sync;return id}else{return 0}}function _glFinish(){GLctx["finish"]()}function _glFlush(){GLctx["flush"]()}function emscriptenWebGLGetBufferBinding(target){switch(target){case 34962:target=34964;break;case 34963:target=34965;break;case 35051:target=35053;break;case 35052:target=35055;break;case 35982:target=35983;break;case 36662:target=36662;break;case 36663:target=36663;break;case 35345:target=35368;break}var buffer=GLctx.getParameter(target);if(buffer)return buffer.name|0;else return 0}function emscriptenWebGLValidateMapBufferTarget(target){switch(target){case 34962:case 34963:case 36662:case 36663:case 35051:case 35052:case 35882:case 35982:case 35345:return true;default:return false}}function _glFlushMappedBufferRange(target,offset,length){if(!emscriptenWebGLValidateMapBufferTarget(target)){GL.recordError(1280);err("GL_INVALID_ENUM in glFlushMappedBufferRange");return}var mapping=GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];if(!mapping){GL.recordError(1282);Module.printError("buffer was never mapped in glFlushMappedBufferRange");return}if(!(mapping.access&16)){GL.recordError(1282);Module.printError("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");return}if(offset<0||length<0||offset+length>mapping.length){GL.recordError(1281);Module.printError("invalid range in glFlushMappedBufferRange");return}GLctx.bufferSubData(target,mapping.offset,HEAPU8.subarray(mapping.mem+offset,mapping.mem+offset+length))}function _glFramebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer){GLctx.framebufferRenderbuffer(target,attachment,renderbuffertarget,GL.renderbuffers[renderbuffer])}function _glFramebufferTexture2D(target,attachment,textarget,texture,level){GLctx.framebufferTexture2D(target,attachment,textarget,GL.textures[texture],level)}function _glFramebufferTextureLayer(target,attachment,texture,level,layer){GLctx.framebufferTextureLayer(target,attachment,GL.textures[texture],level,layer)}function _glFrontFace(x0){GLctx["frontFace"](x0)}function _glGenBuffers(n,buffers){for(var i=0;i<n;i++){var buffer=GLctx.createBuffer();if(!buffer){GL.recordError(1282);while(i<n)HEAP32[buffers+i++*4>>2]=0;return}var id=GL.getNewId(GL.buffers);buffer.name=id;GL.buffers[id]=buffer;HEAP32[buffers+i*4>>2]=id}}function _glGenFramebuffers(n,ids){for(var i=0;i<n;++i){var framebuffer=GLctx.createFramebuffer();if(!framebuffer){GL.recordError(1282);while(i<n)HEAP32[ids+i++*4>>2]=0;return}var id=GL.getNewId(GL.framebuffers);framebuffer.name=id;GL.framebuffers[id]=framebuffer;HEAP32[ids+i*4>>2]=id}}function _glGenQueries(n,ids){for(var i=0;i<n;i++){var query=GLctx["createQuery"]();if(!query){GL.recordError(1282);while(i<n)HEAP32[ids+i++*4>>2]=0;return}var id=GL.getNewId(GL.queries);query.name=id;GL.queries[id]=query;HEAP32[ids+i*4>>2]=id}}function _glGenRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var renderbuffer=GLctx.createRenderbuffer();if(!renderbuffer){GL.recordError(1282);while(i<n)HEAP32[renderbuffers+i++*4>>2]=0;return}var id=GL.getNewId(GL.renderbuffers);renderbuffer.name=id;GL.renderbuffers[id]=renderbuffer;HEAP32[renderbuffers+i*4>>2]=id}}function _glGenSamplers(n,samplers){for(var i=0;i<n;i++){var sampler=GLctx["createSampler"]();if(!sampler){GL.recordError(1282);while(i<n)HEAP32[samplers+i++*4>>2]=0;return}var id=GL.getNewId(GL.samplers);sampler.name=id;GL.samplers[id]=sampler;HEAP32[samplers+i*4>>2]=id}}function _glGenTextures(n,textures){for(var i=0;i<n;i++){var texture=GLctx.createTexture();if(!texture){GL.recordError(1282);while(i<n)HEAP32[textures+i++*4>>2]=0;return}var id=GL.getNewId(GL.textures);texture.name=id;GL.textures[id]=texture;HEAP32[textures+i*4>>2]=id}}function _glGenTransformFeedbacks(n,ids){for(var i=0;i<n;i++){var transformFeedback=GLctx["createTransformFeedback"]();if(!transformFeedback){GL.recordError(1282);while(i<n)HEAP32[ids+i++*4>>2]=0;return}var id=GL.getNewId(GL.transformFeedbacks);transformFeedback.name=id;GL.transformFeedbacks[id]=transformFeedback;HEAP32[ids+i*4>>2]=id}}function _glGenVertexArrays(n,arrays){for(var i=0;i<n;i++){var vao=GLctx["createVertexArray"]();if(!vao){GL.recordError(1282);while(i<n)HEAP32[arrays+i++*4>>2]=0;return}var id=GL.getNewId(GL.vaos);vao.name=id;GL.vaos[id]=vao;HEAP32[arrays+i*4>>2]=id}}function _glGenerateMipmap(x0){GLctx["generateMipmap"](x0)}function _glGetActiveAttrib(program,index,bufSize,length,size,type,name){program=GL.programs[program];var info=GLctx.getActiveAttrib(program,index);if(!info)return;if(bufSize>0&&name){var numBytesWrittenExclNull=stringToUTF8(info.name,name,bufSize);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}if(size)HEAP32[size>>2]=info.size;if(type)HEAP32[type>>2]=info.type}function _glGetActiveUniform(program,index,bufSize,length,size,type,name){program=GL.programs[program];var info=GLctx.getActiveUniform(program,index);if(!info)return;if(bufSize>0&&name){var numBytesWrittenExclNull=stringToUTF8(info.name,name,bufSize);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}if(size)HEAP32[size>>2]=info.size;if(type)HEAP32[type>>2]=info.type}function _glGetActiveUniformBlockName(program,uniformBlockIndex,bufSize,length,uniformBlockName){program=GL.programs[program];var result=GLctx["getActiveUniformBlockName"](program,uniformBlockIndex);if(!result)return;if(uniformBlockName&&bufSize>0){var numBytesWrittenExclNull=stringToUTF8(result,uniformBlockName,bufSize);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetActiveUniformBlockiv(program,uniformBlockIndex,pname,params){if(!params){GL.recordError(1281);return}program=GL.programs[program];switch(pname){case 35393:var name=GLctx["getActiveUniformBlockName"](program,uniformBlockIndex);HEAP32[params>>2]=name.length+1;return;default:var result=GLctx["getActiveUniformBlockParameter"](program,uniformBlockIndex,pname);if(!result)return;if(typeof result=="number"){HEAP32[params>>2]=result}else{for(var i=0;i<result.length;i++){HEAP32[params+i*4>>2]=result[i]}}}}function _glGetActiveUniformsiv(program,uniformCount,uniformIndices,pname,params){if(!params){GL.recordError(1281);return}if(uniformCount>0&&uniformIndices==0){GL.recordError(1281);return}program=GL.programs[program];var ids=[];for(var i=0;i<uniformCount;i++){ids.push(HEAP32[uniformIndices+i*4>>2])}var result=GLctx["getActiveUniforms"](program,ids,pname);if(!result)return;var len=result.length;for(var i=0;i<len;i++){HEAP32[params+i*4>>2]=result[i]}}function _glGetAttribLocation(program,name){return GLctx.getAttribLocation(GL.programs[program],Pointer_stringify(name))}function _glGetError(){if(GL.lastError){var error=GL.lastError;GL.lastError=0;return error}else{return GLctx.getError()}}function _glGetFramebufferAttachmentParameteriv(target,attachment,pname,params){var result=GLctx.getFramebufferAttachmentParameter(target,attachment,pname);if(result instanceof WebGLRenderbuffer||result instanceof WebGLTexture){result=result.name|0}HEAP32[params>>2]=result}function emscriptenWebGLGetIndexed(target,index,data,type){if(!data){GL.recordError(1281);return}var result=GLctx["getIndexedParameter"](target,index);var ret;switch(typeof result){case"boolean":ret=result?1:0;break;case"number":ret=result;break;case"object":if(result===null){switch(target){case 35983:case 35368:ret=0;break;default:{GL.recordError(1280);return}}}else if(result instanceof WebGLBuffer){ret=result.name|0}else{GL.recordError(1280);return}break;default:GL.recordError(1280);return}switch(type){case"Integer64":tempI64=[ret>>>0,(tempDouble=ret,+Math_abs(tempDouble)>=1?tempDouble>0?(Math_min(+Math_floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[data>>2]=tempI64[0],HEAP32[data+4>>2]=tempI64[1];break;case"Integer":HEAP32[data>>2]=ret;break;case"Float":HEAPF32[data>>2]=ret;break;case"Boolean":HEAP8[data>>0]=ret?1:0;break;default:throw"internal emscriptenWebGLGetIndexed() error, bad type: "+type}}function _glGetIntegeri_v(target,index,data){emscriptenWebGLGetIndexed(target,index,data,"Integer")}function emscriptenWebGLGet(name_,p,type){if(!p){GL.recordError(1281);return}var ret=undefined;switch(name_){case 36346:ret=1;break;case 36344:if(type!=="Integer"&&type!=="Integer64"){GL.recordError(1280)}return;case 34814:case 36345:ret=0;break;case 34466:var formats=GLctx.getParameter(34467);ret=formats.length;break;case 33309:if(GLctx.canvas.GLctxObject.version<2){GL.recordError(1282);return}var exts=GLctx.getSupportedExtensions();ret=2*exts.length;break;case 33307:case 33308:if(GLctx.canvas.GLctxObject.version<2){GL.recordError(1280);return}ret=name_==33307?3:0;break}if(ret===undefined){var result=GLctx.getParameter(name_);switch(typeof result){case"number":ret=result;break;case"boolean":ret=result?1:0;break;case"string":GL.recordError(1280);return;case"object":if(result===null){switch(name_){case 34964:case 35725:case 34965:case 36006:case 36007:case 32873:case 34229:case 35097:case 36389:case 34068:{ret=0;break};default:{GL.recordError(1280);return}}}else if(result instanceof Float32Array||result instanceof Uint32Array||result instanceof Int32Array||result instanceof Array){for(var i=0;i<result.length;++i){switch(type){case"Integer":HEAP32[p+i*4>>2]=result[i];break;case"Float":HEAPF32[p+i*4>>2]=result[i];break;case"Boolean":HEAP8[p+i>>0]=result[i]?1:0;break;default:throw"internal glGet error, bad type: "+type}}return}else if(result instanceof WebGLBuffer||result instanceof WebGLProgram||result instanceof WebGLFramebuffer||result instanceof WebGLRenderbuffer||result instanceof WebGLQuery||result instanceof WebGLSampler||result instanceof WebGLSync||result instanceof WebGLTransformFeedback||result instanceof WebGLVertexArrayObject||result instanceof WebGLTexture){ret=result.name|0}else{GL.recordError(1280);return}break;default:GL.recordError(1280);return}}switch(type){case"Integer64":tempI64=[ret>>>0,(tempDouble=ret,+Math_abs(tempDouble)>=1?tempDouble>0?(Math_min(+Math_floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[p>>2]=tempI64[0],HEAP32[p+4>>2]=tempI64[1];break;case"Integer":HEAP32[p>>2]=ret;break;case"Float":HEAPF32[p>>2]=ret;break;case"Boolean":HEAP8[p>>0]=ret?1:0;break;default:throw"internal glGet error, bad type: "+type}}function _glGetIntegerv(name_,p){emscriptenWebGLGet(name_,p,"Integer")}function _glGetInternalformativ(target,internalformat,pname,bufSize,params){if(bufSize<0){GL.recordError(1281);return}var samples=GLctx["getInternalformatParameter"](target,internalformat,32937);if(!samples){GL.recordError(1280);return}switch(pname){case 32937:var n=Math.min(bufSize,samples.length);for(var i=0;i<n;i++){var v=samples[i];HEAP32[params+i*4>>2]=v}break;case 37760:if(bufSize>1){var v=samples.length;HEAP32[params>>2]=v}break;default:GL.recordError(1280)}}function _glGetProgramBinary(program,bufSize,length,binaryFormat,binary){GL.recordError(1282)}function _glGetProgramInfoLog(program,maxLength,length,infoLog){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";if(maxLength>0&&infoLog){var numBytesWrittenExclNull=stringToUTF8(log,infoLog,maxLength);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetProgramiv(program,pname,p){if(!p){GL.recordError(1281);return}if(program>=GL.counter){GL.recordError(1281);return}var ptable=GL.programInfos[program];if(!ptable){GL.recordError(1282);return}if(pname==35716){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";HEAP32[p>>2]=log.length+1}else if(pname==35719){HEAP32[p>>2]=ptable.maxUniformLength}else if(pname==35722){if(ptable.maxAttributeLength==-1){program=GL.programs[program];var numAttribs=GLctx.getProgramParameter(program,GLctx.ACTIVE_ATTRIBUTES);ptable.maxAttributeLength=0;for(var i=0;i<numAttribs;++i){var activeAttrib=GLctx.getActiveAttrib(program,i);ptable.maxAttributeLength=Math.max(ptable.maxAttributeLength,activeAttrib.name.length+1)}}HEAP32[p>>2]=ptable.maxAttributeLength}else if(pname==35381){if(ptable.maxUniformBlockNameLength==-1){program=GL.programs[program];var numBlocks=GLctx.getProgramParameter(program,GLctx.ACTIVE_UNIFORM_BLOCKS);ptable.maxUniformBlockNameLength=0;for(var i=0;i<numBlocks;++i){var activeBlockName=GLctx.getActiveUniformBlockName(program,i);ptable.maxUniformBlockNameLength=Math.max(ptable.maxUniformBlockNameLength,activeBlockName.length+1)}}HEAP32[p>>2]=ptable.maxUniformBlockNameLength}else{HEAP32[p>>2]=GLctx.getProgramParameter(GL.programs[program],pname)}}function _glGetQueryObjectuiv(id,pname,params){if(!params){GL.recordError(1281);return}var query=GL.queries[id];var param=GLctx["getQueryParameter"](query,pname);var ret;if(typeof param=="boolean"){ret=param?1:0}else{ret=param}HEAP32[params>>2]=ret}function _glGetQueryiv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>2]=GLctx["getQuery"](target,pname)}function _glGetRenderbufferParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>2]=GLctx.getRenderbufferParameter(target,pname)}function _glGetShaderInfoLog(shader,maxLength,length,infoLog){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";if(maxLength>0&&infoLog){var numBytesWrittenExclNull=stringToUTF8(log,infoLog,maxLength);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetShaderPrecisionFormat(shaderType,precisionType,range,precision){var result=GLctx.getShaderPrecisionFormat(shaderType,precisionType);HEAP32[range>>2]=result.rangeMin;HEAP32[range+4>>2]=result.rangeMax;HEAP32[precision>>2]=result.precision}function _glGetShaderSource(shader,bufSize,length,source){var result=GLctx.getShaderSource(GL.shaders[shader]);if(!result)return;if(bufSize>0&&source){var numBytesWrittenExclNull=stringToUTF8(result,source,bufSize);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetShaderiv(shader,pname,p){if(!p){GL.recordError(1281);return}if(pname==35716){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";HEAP32[p>>2]=log.length+1}else if(pname==35720){var source=GLctx.getShaderSource(GL.shaders[shader]);var sourceLength=source===null||source.length==0?0:source.length+1;HEAP32[p>>2]=sourceLength}else{HEAP32[p>>2]=GLctx.getShaderParameter(GL.shaders[shader],pname)}}function _glGetString(name_){if(GL.stringCache[name_])return GL.stringCache[name_];var ret;switch(name_){case 7936:case 7937:case 37445:case 37446:ret=allocate(intArrayFromString(GLctx.getParameter(name_)),"i8",ALLOC_NORMAL);break;case 7938:var glVersion=GLctx.getParameter(GLctx.VERSION);if(GLctx.canvas.GLctxObject.version>=2)glVersion="OpenGL ES 3.0 ("+glVersion+")";else{glVersion="OpenGL ES 2.0 ("+glVersion+")"}ret=allocate(intArrayFromString(glVersion),"i8",ALLOC_NORMAL);break;case 7939:var exts=GLctx.getSupportedExtensions();var gl_exts=[];for(var i=0;i<exts.length;++i){gl_exts.push(exts[i]);gl_exts.push("GL_"+exts[i])}ret=allocate(intArrayFromString(gl_exts.join(" ")),"i8",ALLOC_NORMAL);break;case 35724:var glslVersion=GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);var ver_re=/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;var ver_num=glslVersion.match(ver_re);if(ver_num!==null){if(ver_num[1].length==3)ver_num[1]=ver_num[1]+"0";glslVersion="OpenGL ES GLSL ES "+ver_num[1]+" ("+glslVersion+")"}ret=allocate(intArrayFromString(glslVersion),"i8",ALLOC_NORMAL);break;default:GL.recordError(1280);return 0}GL.stringCache[name_]=ret;return ret}function _glGetStringi(name,index){if(GLctx.canvas.GLctxObject.version<2){GL.recordError(1282);return 0}var stringiCache=GL.stringiCache[name];if(stringiCache){if(index<0||index>=stringiCache.length){GL.recordError(1281);return 0}return stringiCache[index]}switch(name){case 7939:var exts=GLctx.getSupportedExtensions();var gl_exts=[];for(var i=0;i<exts.length;++i){gl_exts.push(allocate(intArrayFromString(exts[i]),"i8",ALLOC_NORMAL));gl_exts.push(allocate(intArrayFromString("GL_"+exts[i]),"i8",ALLOC_NORMAL))}stringiCache=GL.stringiCache[name]=gl_exts;if(index<0||index>=stringiCache.length){GL.recordError(1281);return 0}return stringiCache[index];default:GL.recordError(1280);return 0}}function _glGetTexParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>2]=GLctx.getTexParameter(target,pname)}function _glGetUniformBlockIndex(program,uniformBlockName){program=GL.programs[program];uniformBlockName=Pointer_stringify(uniformBlockName);return GLctx["getUniformBlockIndex"](program,uniformBlockName)}function _glGetUniformIndices(program,uniformCount,uniformNames,uniformIndices){if(!uniformIndices){GL.recordError(1281);return}if(uniformCount>0&&(uniformNames==0||uniformIndices==0)){GL.recordError(1281);return}program=GL.programs[program];var names=[];for(var i=0;i<uniformCount;i++)names.push(Pointer_stringify(HEAP32[uniformNames+i*4>>2]));var result=GLctx["getUniformIndices"](program,names);if(!result)return;var len=result.length;for(var i=0;i<len;i++){HEAP32[uniformIndices+i*4>>2]=result[i]}}function _glGetUniformLocation(program,name){name=Pointer_stringify(name);var arrayOffset=0;if(name.indexOf("]",name.length-1)!==-1){var ls=name.lastIndexOf("[");var arrayIndex=name.slice(ls+1,-1);if(arrayIndex.length>0){arrayOffset=parseInt(arrayIndex);if(arrayOffset<0){return-1}}name=name.slice(0,ls)}var ptable=GL.programInfos[program];if(!ptable){return-1}var utable=ptable.uniforms;var uniformInfo=utable[name];if(uniformInfo&&arrayOffset<uniformInfo[0]){return uniformInfo[1]+arrayOffset}else{return-1}}function emscriptenWebGLGetUniform(program,location,params,type){if(!params){GL.recordError(1281);return}var data=GLctx.getUniform(GL.programs[program],GL.uniforms[location]);if(typeof data=="number"||typeof data=="boolean"){switch(type){case"Integer":HEAP32[params>>2]=data;break;case"Float":HEAPF32[params>>2]=data;break;default:throw"internal emscriptenWebGLGetUniform() error, bad type: "+type}}else{for(var i=0;i<data.length;i++){switch(type){case"Integer":HEAP32[params+i*4>>2]=data[i];break;case"Float":HEAPF32[params+i*4>>2]=data[i];break;default:throw"internal emscriptenWebGLGetUniform() error, bad type: "+type}}}}function _glGetUniformiv(program,location,params){emscriptenWebGLGetUniform(program,location,params,"Integer")}function emscriptenWebGLGetVertexAttrib(index,pname,params,type){if(!params){GL.recordError(1281);return}var data=GLctx.getVertexAttrib(index,pname);if(pname==34975){HEAP32[params>>2]=data["name"]}else if(typeof data=="number"||typeof data=="boolean"){switch(type){case"Integer":HEAP32[params>>2]=data;break;case"Float":HEAPF32[params>>2]=data;break;case"FloatToInteger":HEAP32[params>>2]=Math.fround(data);break;default:throw"internal emscriptenWebGLGetVertexAttrib() error, bad type: "+type}}else{for(var i=0;i<data.length;i++){switch(type){case"Integer":HEAP32[params+i*4>>2]=data[i];break;case"Float":HEAPF32[params+i*4>>2]=data[i];break;case"FloatToInteger":HEAP32[params+i*4>>2]=Math.fround(data[i]);break;default:throw"internal emscriptenWebGLGetVertexAttrib() error, bad type: "+type}}}}function _glGetVertexAttribiv(index,pname,params){emscriptenWebGLGetVertexAttrib(index,pname,params,"FloatToInteger")}function _glInvalidateFramebuffer(target,numAttachments,attachments){var list=GL.tempFixedLengthArray[numAttachments];for(var i=0;i<numAttachments;i++){list[i]=HEAP32[attachments+i*4>>2]}GLctx["invalidateFramebuffer"](target,list)}function _glIsEnabled(x0){return GLctx["isEnabled"](x0)}function _glIsVertexArray(array){var vao=GL.vaos[array];if(!vao)return 0;return GLctx["isVertexArray"](vao)}function _glLinkProgram(program){GLctx.linkProgram(GL.programs[program]);GL.programInfos[program]=null;GL.populateUniformTable(program)}function _glMapBufferRange(target,offset,length,access){if(access!=26&&access!=10){err("glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER");return 0}if(!emscriptenWebGLValidateMapBufferTarget(target)){GL.recordError(1280);err("GL_INVALID_ENUM in glMapBufferRange");return 0}var mem=_malloc(length);if(!mem)return 0;GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)]={offset:offset,length:length,mem:mem,access:access};return mem}function _glPixelStorei(pname,param){if(pname==3333){GL.packAlignment=param}else if(pname==3317){GL.unpackAlignment=param}GLctx.pixelStorei(pname,param)}function _glPolygonOffset(x0,x1){GLctx["polygonOffset"](x0,x1)}function _glProgramBinary(program,binaryFormat,binary,length){GL.recordError(1280)}function _glProgramParameteri(program,pname,value){GL.recordError(1280)}function _glReadBuffer(x0){GLctx["readBuffer"](x0)}function emscriptenWebGLComputeImageSize(width,height,sizePerPixel,alignment){function roundedToNextMultipleOf(x,y){return Math.floor((x+y-1)/y)*y}var plainRowSize=width*sizePerPixel;var alignedRowSize=roundedToNextMultipleOf(plainRowSize,alignment);return height<=0?0:(height-1)*alignedRowSize+plainRowSize}function emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat){var sizePerPixel;var numChannels;switch(format){case 6406:case 6409:case 6402:case 6403:case 36244:numChannels=1;break;case 6410:case 33319:case 33320:numChannels=2;break;case 6407:case 35904:case 36248:numChannels=3;break;case 6408:case 35906:case 36249:numChannels=4;break;default:GL.recordError(1280);return null}switch(type){case 5121:case 5120:sizePerPixel=numChannels*1;break;case 5123:case 36193:case 5131:case 5122:sizePerPixel=numChannels*2;break;case 5125:case 5126:case 5124:sizePerPixel=numChannels*4;break;case 34042:case 35902:case 33640:case 35899:case 34042:sizePerPixel=4;break;case 33635:case 32819:case 32820:sizePerPixel=2;break;default:GL.recordError(1280);return null}var bytes=emscriptenWebGLComputeImageSize(width,height,sizePerPixel,GL.unpackAlignment);switch(type){case 5120:return HEAP8.subarray(pixels,pixels+bytes);case 5121:return HEAPU8.subarray(pixels,pixels+bytes);case 5122:return HEAP16.subarray(pixels>>1,pixels+bytes>>1);case 5124:return HEAP32.subarray(pixels>>2,pixels+bytes>>2);case 5126:return HEAPF32.subarray(pixels>>2,pixels+bytes>>2);case 5125:case 34042:case 35902:case 33640:case 35899:case 34042:return HEAPU32.subarray(pixels>>2,pixels+bytes>>2);case 5123:case 33635:case 32819:case 32820:case 36193:case 5131:return HEAPU16.subarray(pixels>>1,pixels+bytes>>1);default:GL.recordError(1280);return null}}function emscriptenWebGLGetHeapForType(type){switch(type){case 5120:return HEAP8;case 5121:return HEAPU8;case 5122:return HEAP16;case 5123:case 33635:case 32819:case 32820:case 36193:case 5131:return HEAPU16;case 5124:return HEAP32;case 5125:case 34042:case 35902:case 33640:case 35899:case 34042:return HEAPU32;case 5126:return HEAPF32;default:return null}}function emscriptenWebGLGetShiftForType(type){switch(type){case 5120:case 5121:return 0;case 5122:case 5123:case 33635:case 32819:case 32820:case 36193:case 5131:return 1;case 5124:case 5126:case 5125:case 34042:case 35902:case 33640:case 35899:case 34042:return 2;default:return 0}}function _glReadPixels(x,y,width,height,format,type,pixels){if(GL.currentContext.supportsWebGL2EntryPoints){if(GLctx.currentPixelPackBufferBinding){GLctx.readPixels(x,y,width,height,format,type,pixels)}else{GLctx.readPixels(x,y,width,height,format,type,emscriptenWebGLGetHeapForType(type),pixels>>emscriptenWebGLGetShiftForType(type))}return}var pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,format);if(!pixelData){GL.recordError(1280);return}GLctx.readPixels(x,y,width,height,format,type,pixelData)}function _glRenderbufferStorage(x0,x1,x2,x3){GLctx["renderbufferStorage"](x0,x1,x2,x3)}function _glRenderbufferStorageMultisample(x0,x1,x2,x3,x4){GLctx["renderbufferStorageMultisample"](x0,x1,x2,x3,x4)}function _glSamplerParameteri(sampler,pname,param){GLctx["samplerParameteri"](sampler?GL.samplers[sampler]:null,pname,param)}function _glScissor(x0,x1,x2,x3){GLctx["scissor"](x0,x1,x2,x3)}function _glShaderSource(shader,count,string,length){var source=GL.getSource(shader,count,string,length);GLctx.shaderSource(GL.shaders[shader],source)}function _glStencilFuncSeparate(x0,x1,x2,x3){GLctx["stencilFuncSeparate"](x0,x1,x2,x3)}function _glStencilMask(x0){GLctx["stencilMask"](x0)}function _glStencilOpSeparate(x0,x1,x2,x3){GLctx["stencilOpSeparate"](x0,x1,x2,x3)}function _glTexImage2D(target,level,internalFormat,width,height,border,format,type,pixels){if(GL.currentContext.supportsWebGL2EntryPoints){if(GLctx.currentPixelUnpackBufferBinding){GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixels)}else if(pixels!=0){GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,emscriptenWebGLGetHeapForType(type),pixels>>emscriptenWebGLGetShiftForType(type))}else{GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,null)}return}var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat);GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixelData)}function _glTexImage3D(target,level,internalFormat,width,height,depth,border,format,type,pixels){if(GLctx.currentPixelUnpackBufferBinding){GLctx["texImage3D"](target,level,internalFormat,width,height,depth,border,format,type,pixels)}else if(pixels!=0){GLctx["texImage3D"](target,level,internalFormat,width,height,depth,border,format,type,emscriptenWebGLGetHeapForType(type),pixels>>emscriptenWebGLGetShiftForType(type))}else{GLctx["texImage3D"](target,level,internalFormat,width,height,depth,border,format,type,null)}}function _glTexParameterf(x0,x1,x2){GLctx["texParameterf"](x0,x1,x2)}function _glTexParameteri(x0,x1,x2){GLctx["texParameteri"](x0,x1,x2)}function _glTexParameteriv(target,pname,params){var param=HEAP32[params>>2];GLctx.texParameteri(target,pname,param)}function _glTexStorage2D(x0,x1,x2,x3,x4){GLctx["texStorage2D"](x0,x1,x2,x3,x4)}function _glTexStorage3D(x0,x1,x2,x3,x4,x5){GLctx["texStorage3D"](x0,x1,x2,x3,x4,x5)}function _glTexSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels){if(GL.currentContext.supportsWebGL2EntryPoints){if(GLctx.currentPixelUnpackBufferBinding){GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels)}else if(pixels!=0){GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,emscriptenWebGLGetHeapForType(type),pixels>>emscriptenWebGLGetShiftForType(type))}else{GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,null)}return}var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,0);GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixelData)}function _glTexSubImage3D(target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,pixels){if(GLctx.currentPixelUnpackBufferBinding){GLctx["texSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,pixels)}else if(pixels!=0){GLctx["texSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,emscriptenWebGLGetHeapForType(type),pixels>>emscriptenWebGLGetShiftForType(type))}else{GLctx["texSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,null)}}function _glTransformFeedbackVaryings(program,count,varyings,bufferMode){program=GL.programs[program];var vars=[];for(var i=0;i<count;i++)vars.push(Pointer_stringify(HEAP32[varyings+i*4>>2]));GLctx["transformFeedbackVaryings"](program,vars,bufferMode)}function _glUniform1fv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform1fv(GL.uniforms[location],HEAPF32,value>>2,count);return}var view;if(count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[count-1];for(var i=0;i<count;++i){view[i]=HEAPF32[value+4*i>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*4>>2)}GLctx.uniform1fv(GL.uniforms[location],view)}function _glUniform1i(location,v0){GLctx.uniform1i(GL.uniforms[location],v0)}function _glUniform1iv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform1iv(GL.uniforms[location],HEAP32,value>>2,count);return}GLctx.uniform1iv(GL.uniforms[location],HEAP32.subarray(value>>2,value+count*4>>2))}function _glUniform1uiv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform1uiv(GL.uniforms[location],HEAPU32,value>>2,count)}else{GLctx.uniform1uiv(GL.uniforms[location],HEAPU32.subarray(value>>2,value+count*4>>2))}}function _glUniform2fv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform2fv(GL.uniforms[location],HEAPF32,value>>2,count*2);return}var view;if(2*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*8>>2)}GLctx.uniform2fv(GL.uniforms[location],view)}function _glUniform2iv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform2iv(GL.uniforms[location],HEAP32,value>>2,count*2);return}GLctx.uniform2iv(GL.uniforms[location],HEAP32.subarray(value>>2,value+count*8>>2))}function _glUniform2uiv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform2uiv(GL.uniforms[location],HEAPU32,value>>2,count*2)}else{GLctx.uniform2uiv(GL.uniforms[location],HEAPU32.subarray(value>>2,value+count*8>>2))}}function _glUniform3fv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform3fv(GL.uniforms[location],HEAPF32,value>>2,count*3);return}var view;if(3*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*12>>2)}GLctx.uniform3fv(GL.uniforms[location],view)}function _glUniform3iv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform3iv(GL.uniforms[location],HEAP32,value>>2,count*3);return}GLctx.uniform3iv(GL.uniforms[location],HEAP32.subarray(value>>2,value+count*12>>2))}function _glUniform3uiv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform3uiv(GL.uniforms[location],HEAPU32,value>>2,count*3)}else{GLctx.uniform3uiv(GL.uniforms[location],HEAPU32.subarray(value>>2,value+count*12>>2))}}function _glUniform4fv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform4fv(GL.uniforms[location],HEAPF32,value>>2,count*4);return}var view;if(4*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2];view[i+3]=HEAPF32[value+(4*i+12)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*16>>2)}GLctx.uniform4fv(GL.uniforms[location],view)}function _glUniform4iv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform4iv(GL.uniforms[location],HEAP32,value>>2,count*4);return}GLctx.uniform4iv(GL.uniforms[location],HEAP32.subarray(value>>2,value+count*16>>2))}function _glUniform4uiv(location,count,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniform4uiv(GL.uniforms[location],HEAPU32,value>>2,count*4)}else{GLctx.uniform4uiv(GL.uniforms[location],HEAPU32.subarray(value>>2,value+count*16>>2))}}function _glUniformBlockBinding(program,uniformBlockIndex,uniformBlockBinding){program=GL.programs[program];GLctx["uniformBlockBinding"](program,uniformBlockIndex,uniformBlockBinding)}function _glUniformMatrix3fv(location,count,transpose,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniformMatrix3fv(GL.uniforms[location],!!transpose,HEAPF32,value>>2,count*9);return}var view;if(9*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[9*count-1];for(var i=0;i<9*count;i+=9){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2];view[i+3]=HEAPF32[value+(4*i+12)>>2];view[i+4]=HEAPF32[value+(4*i+16)>>2];view[i+5]=HEAPF32[value+(4*i+20)>>2];view[i+6]=HEAPF32[value+(4*i+24)>>2];view[i+7]=HEAPF32[value+(4*i+28)>>2];view[i+8]=HEAPF32[value+(4*i+32)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*36>>2)}GLctx.uniformMatrix3fv(GL.uniforms[location],!!transpose,view)}function _glUniformMatrix4fv(location,count,transpose,value){if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.uniformMatrix4fv(GL.uniforms[location],!!transpose,HEAPF32,value>>2,count*16);return}var view;if(16*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[16*count-1];for(var i=0;i<16*count;i+=16){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2];view[i+3]=HEAPF32[value+(4*i+12)>>2];view[i+4]=HEAPF32[value+(4*i+16)>>2];view[i+5]=HEAPF32[value+(4*i+20)>>2];view[i+6]=HEAPF32[value+(4*i+24)>>2];view[i+7]=HEAPF32[value+(4*i+28)>>2];view[i+8]=HEAPF32[value+(4*i+32)>>2];view[i+9]=HEAPF32[value+(4*i+36)>>2];view[i+10]=HEAPF32[value+(4*i+40)>>2];view[i+11]=HEAPF32[value+(4*i+44)>>2];view[i+12]=HEAPF32[value+(4*i+48)>>2];view[i+13]=HEAPF32[value+(4*i+52)>>2];view[i+14]=HEAPF32[value+(4*i+56)>>2];view[i+15]=HEAPF32[value+(4*i+60)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*64>>2)}GLctx.uniformMatrix4fv(GL.uniforms[location],!!transpose,view)}function _glUnmapBuffer(target){if(!emscriptenWebGLValidateMapBufferTarget(target)){GL.recordError(1280);err("GL_INVALID_ENUM in glUnmapBuffer");return 0}var buffer=emscriptenWebGLGetBufferBinding(target);var mapping=GL.mappedBuffers[buffer];if(!mapping){GL.recordError(1282);Module.printError("buffer was never mapped in glUnmapBuffer");return 0}GL.mappedBuffers[buffer]=null;if(!(mapping.access&16))if(GL.currentContext.supportsWebGL2EntryPoints){GLctx.bufferSubData(target,mapping.offset,HEAPU8,mapping.mem,mapping.length)}else{GLctx.bufferSubData(target,mapping.offset,HEAPU8.subarray(mapping.mem,mapping.mem+mapping.length))}_free(mapping.mem);return 1}function _glUseProgram(program){GLctx.useProgram(program?GL.programs[program]:null)}function _glValidateProgram(program){GLctx.validateProgram(GL.programs[program])}function _glVertexAttrib4f(x0,x1,x2,x3,x4){GLctx["vertexAttrib4f"](x0,x1,x2,x3,x4)}function _glVertexAttrib4fv(index,v){GLctx.vertexAttrib4f(index,HEAPF32[v>>2],HEAPF32[v+4>>2],HEAPF32[v+8>>2],HEAPF32[v+12>>2])}function _glVertexAttribIPointer(index,size,type,stride,ptr){var cb=GL.currentContext.clientBuffers[index];if(!GL.currArrayBuffer){cb.size=size;cb.type=type;cb.normalized=false;cb.stride=stride;cb.ptr=ptr;cb.clientside=true;return}cb.clientside=false;GLctx.vertexAttribIPointer(index,size,type,stride,ptr)}function _glVertexAttribPointer(index,size,type,normalized,stride,ptr){GLctx.vertexAttribPointer(index,size,type,!!normalized,stride,ptr)}function _glViewport(x0,x1,x2,x3){GLctx["viewport"](x0,x1,x2,x3)}var ___tm_current=STATICTOP;STATICTOP+=48;var ___tm_timezone=allocate(intArrayFromString("GMT"),"i8",ALLOC_STATIC);function _gmtime_r(time,tmPtr){var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getUTCSeconds();HEAP32[tmPtr+4>>2]=date.getUTCMinutes();HEAP32[tmPtr+8>>2]=date.getUTCHours();HEAP32[tmPtr+12>>2]=date.getUTCDate();HEAP32[tmPtr+16>>2]=date.getUTCMonth();HEAP32[tmPtr+20>>2]=date.getUTCFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getUTCDay();HEAP32[tmPtr+36>>2]=0;HEAP32[tmPtr+32>>2]=0;var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+40>>2]=___tm_timezone;return tmPtr}function _gmtime(time){return _gmtime_r(time,___tm_current)}function _inet_addr(ptr){var addr=__inet_pton4_raw(Pointer_stringify(ptr));if(addr===null){return-1}return addr}var _llvm_ceil_f32=Math_ceil;var _llvm_ceil_f64=Math_ceil;function _llvm_copysign_f64(x,y){return y<0||y===0&&1/y<0?-Math_abs(x):Math_abs(x)}function _llvm_cttz_i32(x){x=x|0;return(x?31-(Math_clz32(x^x-1)|0)|0:32)|0}function _llvm_eh_typeid_for(type){return type}function _llvm_exp2_f32(x){return Math.pow(2,x)}var _llvm_fabs_f32=Math_abs;var _llvm_fabs_f64=Math_abs;var _llvm_floor_f32=Math_floor;var _llvm_floor_f64=Math_floor;function _llvm_log10_f32(x){return Math.log(x)/Math.LN10}function _llvm_log2_f32(x){return Math.log(x)/Math.LN2}var _llvm_pow_f64=Math_pow;function _llvm_trap(){abort("trap!")}var _llvm_trunc_f32=Math_trunc;function _tzset(){if(_tzset.called)return;_tzset.called=true;HEAP32[__get_timezone()>>2]=(new Date).getTimezoneOffset()*60;var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);HEAP32[__get_daylight()>>2]=Number(winter.getTimezoneOffset()!=summer.getTimezoneOffset());function extractZone(date){var match=date.toTimeString().match(/\(([A-Za-z ]+)\)$/);return match?match[1]:"GMT"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=allocate(intArrayFromString(winterName),"i8",ALLOC_NORMAL);var summerNamePtr=allocate(intArrayFromString(summerName),"i8",ALLOC_NORMAL);if(summer.getTimezoneOffset()<winter.getTimezoneOffset()){HEAP32[__get_tzname()>>2]=winterNamePtr;HEAP32[__get_tzname()+4>>2]=summerNamePtr}else{HEAP32[__get_tzname()>>2]=summerNamePtr;HEAP32[__get_tzname()+4>>2]=winterNamePtr}}function _localtime_r(time,tmPtr){_tzset();var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var start=new Date(date.getFullYear(),0,1);var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var summerOffset=(new Date(date.getFullYear(),6,1)).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst;var zonePtr=HEAP32[__get_tzname()+(dst?4:0)>>2];HEAP32[tmPtr+40>>2]=zonePtr;return tmPtr}function _localtime(time){return _localtime_r(time,___tm_current)}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}function _mktime(tmPtr){_tzset();var date=new Date(HEAP32[tmPtr+20>>2]+1900,HEAP32[tmPtr+16>>2],HEAP32[tmPtr+12>>2],HEAP32[tmPtr+8>>2],HEAP32[tmPtr+4>>2],HEAP32[tmPtr>>2],0);var dst=HEAP32[tmPtr+32>>2];var guessedOffset=date.getTimezoneOffset();var start=new Date(date.getFullYear(),0,1);var summerOffset=(new Date(date.getFullYear(),6,1)).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dstOffset=Math.min(winterOffset,summerOffset);if(dst<0){HEAP32[tmPtr+32>>2]=Number(summerOffset!=winterOffset&&dstOffset==guessedOffset)}else if(dst>0!=(dstOffset==guessedOffset)){var nonDstOffset=Math.max(winterOffset,summerOffset);var trueOffset=dst>0?dstOffset:nonDstOffset;date.setTime(date.getTime()+(trueOffset-guessedOffset)*6e4)}HEAP32[tmPtr+24>>2]=date.getDay();var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;return date.getTime()/1e3|0}function _usleep(useconds){var msec=useconds/1e3;if((ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&self["performance"]&&self["performance"]["now"]){var start=self["performance"]["now"]();while(self["performance"]["now"]()-start<msec){}}else{var start=Date.now();while(Date.now()-start<msec){}}return 0}function _nanosleep(rqtp,rmtp){var seconds=HEAP32[rqtp>>2];var nanoseconds=HEAP32[rqtp+4>>2];if(rmtp!==0){HEAP32[rmtp>>2]=0;HEAP32[rmtp+4>>2]=0}return _usleep(seconds*1e6+nanoseconds/1e3)}function _pthread_cond_destroy(){return 0}function _pthread_cond_init(){return 0}function _pthread_cond_timedwait(){return 0}function _pthread_cond_wait(){return 0}var PTHREAD_SPECIFIC={};function _pthread_getspecific(key){return PTHREAD_SPECIFIC[key]||0}var PTHREAD_SPECIFIC_NEXT_KEY=1;function _pthread_key_create(key,destructor){if(key==0){return ERRNO_CODES.EINVAL}HEAP32[key>>2]=PTHREAD_SPECIFIC_NEXT_KEY;PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY]=0;PTHREAD_SPECIFIC_NEXT_KEY++;return 0}function _pthread_key_delete(key){if(key in PTHREAD_SPECIFIC){delete PTHREAD_SPECIFIC[key];return 0}return ERRNO_CODES.EINVAL}function _pthread_mutex_destroy(){}function _pthread_mutex_init(){}function _pthread_mutexattr_destroy(){}function _pthread_mutexattr_init(){}function _pthread_mutexattr_setprotocol(){}function _pthread_mutexattr_settype(){}function _pthread_once(ptr,func){if(!_pthread_once.seen)_pthread_once.seen={};if(ptr in _pthread_once.seen)return;Module["dynCall_v"](func);_pthread_once.seen[ptr]=1}function _pthread_setspecific(key,value){if(!(key in PTHREAD_SPECIFIC)){return ERRNO_CODES.EINVAL}PTHREAD_SPECIFIC[key]=value;return 0}function _sched_yield(){return 0}function _setenv(envname,envval,overwrite){if(envname===0){___setErrNo(ERRNO_CODES.EINVAL);return-1}var name=Pointer_stringify(envname);var val=Pointer_stringify(envval);if(name===""||name.indexOf("=")!==-1){___setErrNo(ERRNO_CODES.EINVAL);return-1}if(ENV.hasOwnProperty(name)&&!overwrite)return 0;ENV[name]=val;___buildEnvironment(__get_environ());return 0}function _sigaction(signum,act,oldact){return 0}function _sigemptyset(set){HEAP32[set>>2]=0;return 0}function __isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}function __arraySum(array,index){var sum=0;for(var i=0;i<=index;sum+=array[i++]);return sum}var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date,days){var newDate=new Date(date.getTime());while(days>0){var leap=__isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate}function _strftime(s,maxsize,format,tm){var tm_zone=HEAP32[tm+40>>2];var date={tm_sec:HEAP32[tm>>2],tm_min:HEAP32[tm+4>>2],tm_hour:HEAP32[tm+8>>2],tm_mday:HEAP32[tm+12>>2],tm_mon:HEAP32[tm+16>>2],tm_year:HEAP32[tm+20>>2],tm_wday:HEAP32[tm+24>>2],tm_yday:HEAP32[tm+28>>2],tm_isdst:HEAP32[tm+32>>2],tm_gmtoff:HEAP32[tm+36>>2],tm_zone:tm_zone?Pointer_stringify(tm_zone):""};var pattern=Pointer_stringify(format);var EXPANSION_RULES_1={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_1[rule])}var WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];function leadingSomething(value,digits,character){var str=typeof value==="number"?value.toString():value||"";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,"0")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}else{return thisDate.getFullYear()}}else{return thisDate.getFullYear()-1}}var EXPANSION_RULES_2={"%a":(function(date){return WEEKDAYS[date.tm_wday].substring(0,3)}),"%A":(function(date){return WEEKDAYS[date.tm_wday]}),"%b":(function(date){return MONTHS[date.tm_mon].substring(0,3)}),"%B":(function(date){return MONTHS[date.tm_mon]}),"%C":(function(date){var year=date.tm_year+1900;return leadingNulls(year/100|0,2)}),"%d":(function(date){return leadingNulls(date.tm_mday,2)}),"%e":(function(date){return leadingSomething(date.tm_mday,2," ")}),"%g":(function(date){return getWeekBasedYear(date).toString().substring(2)}),"%G":(function(date){return getWeekBasedYear(date)}),"%H":(function(date){return leadingNulls(date.tm_hour,2)}),"%I":(function(date){var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)}),"%j":(function(date){return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900)?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,date.tm_mon-1),3)}),"%m":(function(date){return leadingNulls(date.tm_mon+1,2)}),"%M":(function(date){return leadingNulls(date.tm_min,2)}),"%n":(function(){return"\n"}),"%p":(function(date){if(date.tm_hour>=0&&date.tm_hour<12){return"AM"}else{return"PM"}}),"%S":(function(date){return leadingNulls(date.tm_sec,2)}),"%t":(function(){return"\t"}),"%u":(function(date){var day=new Date(date.tm_year+1900,date.tm_mon+1,date.tm_mday,0,0,0,0);return day.getDay()||7}),"%U":(function(date){var janFirst=new Date(date.tm_year+1900,0,1);var firstSunday=janFirst.getDay()===0?janFirst:__addDays(janFirst,7-janFirst.getDay());var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstSunday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstSundayUntilEndJanuary=31-firstSunday.getDate();var days=firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstSunday,janFirst)===0?"01":"00"}),"%V":(function(date){var janFourthThisYear=new Date(date.tm_year+1900,0,4);var janFourthNextYear=new Date(date.tm_year+1901,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);var endDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);if(compareByDay(endDate,firstWeekStartThisYear)<0){return"53"}if(compareByDay(firstWeekStartNextYear,endDate)<=0){return"01"}var daysDifference;if(firstWeekStartThisYear.getFullYear()<date.tm_year+1900){daysDifference=date.tm_yday+32-firstWeekStartThisYear.getDate()}else{daysDifference=date.tm_yday+1-firstWeekStartThisYear.getDate()}return leadingNulls(Math.ceil(daysDifference/7),2)}),"%w":(function(date){var day=new Date(date.tm_year+1900,date.tm_mon+1,date.tm_mday,0,0,0,0);return day.getDay()}),"%W":(function(date){var janFirst=new Date(date.tm_year,0,1);var firstMonday=janFirst.getDay()===1?janFirst:__addDays(janFirst,janFirst.getDay()===0?1:7-janFirst.getDay()+1);var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstMonday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstMondayUntilEndJanuary=31-firstMonday.getDate();var days=firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstMonday,janFirst)===0?"01":"00"}),"%y":(function(date){return(date.tm_year+1900).toString().substring(2)}),"%Y":(function(date){return date.tm_year+1900}),"%z":(function(date){var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?"+":"-")+String("0000"+off).slice(-4)}),"%Z":(function(date){return date.tm_zone}),"%%":(function(){return"%"})};for(var rule in EXPANSION_RULES_2){if(pattern.indexOf(rule)>=0){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_2[rule](date))}}var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1}function _sysconf(name){switch(name){case 30:return PAGE_SIZE;case 85:var maxHeapSize=2*1024*1024*1024-65536;return maxHeapSize/PAGE_SIZE;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 79:return 0;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}___setErrNo(ERRNO_CODES.EINVAL);return-1}function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}function _unityMultiplayerStarted(){window.dispatchReactUnityEvent("unityMultiplayerStarted")}function _unityPresentationNextSlide(){window.dispatchReactUnityEvent("unityPresentationNextSlide")}function _unityPresentationPreviousSlide(){window.dispatchReactUnityEvent("unityPresentationPreviousSlide")}function _unityPresentationSendCursor(xPercent,yPercent){window.dispatchReactUnityEvent("unityPresentationSendCursor",xPercent,yPercent)}function _unityScreenShareStarted(){window.dispatchReactUnityEvent("unityScreenShareStarted")}function _unityScreenShareWSConnected(){window.dispatchReactUnityEvent("unityScreenShareWSConnected")}function _unsetenv(name){if(name===0){___setErrNo(ERRNO_CODES.EINVAL);return-1}name=Pointer_stringify(name);if(name===""||name.indexOf("=")!==-1){___setErrNo(ERRNO_CODES.EINVAL);return-1}if(ENV.hasOwnProperty(name)){delete ENV[name];___buildEnvironment(__get_environ())}return 0}function _utime(path,times){var time;if(times){var offset=4;time=HEAP32[times+offset>>2];time*=1e3}else{time=Date.now()}path=Pointer_stringify(path);try{FS.utime(path,time,time);return 0}catch(e){FS.handleFSError(e);return-1}}FS.staticInit();__ATINIT__.unshift((function(){if(!Module["noFSInit"]&&!FS.init.initialized)FS.init()}));__ATMAIN__.push((function(){FS.ignorePermissions=false}));__ATEXIT__.push((function(){FS.quit()}));Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;__ATINIT__.unshift((function(){TTY.init()}));__ATEXIT__.push((function(){TTY.shutdown()}));if(ENVIRONMENT_IS_NODE){var fs=require("fs");var NODEJS_PATH=require("path");NODEFS.staticInit()}__ATINIT__.push((function(){SOCKFS.root=FS.mount(SOCKFS,{},null)}));__ATINIT__.push((function(){PIPEFS.root=FS.mount(PIPEFS,{},null)}));if(ENVIRONMENT_IS_NODE){_emscripten_get_now=function _emscripten_get_now_actual(){var t=process["hrtime"]();return t[0]*1e3+t[1]/1e6}}else if(typeof dateNow!=="undefined"){_emscripten_get_now=dateNow}else if(typeof self==="object"&&self["performance"]&&typeof self["performance"]["now"]==="function"){_emscripten_get_now=(function(){return self["performance"]["now"]()})}else if(typeof performance==="object"&&typeof performance["now"]==="function"){_emscripten_get_now=(function(){return performance["now"]()})}else{_emscripten_get_now=Date.now}Module["requestFullScreen"]=function Module_requestFullScreen(lockPointer,resizeCanvas,vrDevice){err("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");Module["requestFullScreen"]=Module["requestFullscreen"];Browser.requestFullScreen(lockPointer,resizeCanvas,vrDevice)};Module["requestFullscreen"]=function Module_requestFullscreen(lockPointer,resizeCanvas,vrDevice){Browser.requestFullscreen(lockPointer,resizeCanvas,vrDevice)};Module["requestAnimationFrame"]=function Module_requestAnimationFrame(func){Browser.requestAnimationFrame(func)};Module["setCanvasSize"]=function Module_setCanvasSize(width,height,noUpdates){Browser.setCanvasSize(width,height,noUpdates)};Module["pauseMainLoop"]=function Module_pauseMainLoop(){Browser.mainLoop.pause()};Module["resumeMainLoop"]=function Module_resumeMainLoop(){Browser.mainLoop.resume()};Module["getUserMedia"]=function Module_getUserMedia(){Browser.getUserMedia()};Module["createContext"]=function Module_createContext(canvas,useWebGL,setInModule,webGLContextAttributes){return Browser.createContext(canvas,useWebGL,setInModule,webGLContextAttributes)};JSEvents.staticInit();var GLctx;GL.init();DYNAMICTOP_PTR=staticAlloc(4);STACK_BASE=STACKTOP=alignMemory(STATICTOP);STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=alignMemory(STACK_MAX);HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;staticSealed=true;function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}Module["wasmTableSize"]=146471;Module["wasmMaxTableSize"]=146471;function invoke_d(index){var sp=stackSave();try{return Module["dynCall_d"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_dddi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_dddi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ddi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_ddi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_dfi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_dfi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_di(index,a1){var sp=stackSave();try{return Module["dynCall_di"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_did(index,a1,a2){var sp=stackSave();try{return Module["dynCall_did"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_didd(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_didd"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diddi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_diddi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_didi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_didi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_didii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_didii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_dii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_dii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diidi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_diidi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_diii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_diiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diij(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_diij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_diiji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_diji(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_diji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_dji(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_dji"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_f(index){var sp=stackSave();try{return Module["dynCall_f"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fdi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_fdi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ff(index,a1){var sp=stackSave();try{return Module["dynCall_ff"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fff(index,a1,a2){var sp=stackSave();try{return Module["dynCall_fff"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fffffi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_fffffi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ffffi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_ffffi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fffi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fffi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fffifffi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_fffifffi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ffi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_ffi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fi(index,a1){var sp=stackSave();try{return Module["dynCall_fi"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fidi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fidi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fif(index,a1,a2){var sp=stackSave();try{return Module["dynCall_fif"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiff(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fiff"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiffi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_fiffi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fifi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fifi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fifii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_fifii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_fii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiid(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fiid"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiifi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_fiifi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiifii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_fiifii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fiii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_fiiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiiif(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_fiiiif"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_fiiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_fiiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiiiiifiifif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return Module["dynCall_fiiiiiifiifif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiiiiifiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return Module["dynCall_fiiiiiifiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_fiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fji(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fji"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_i(index){var sp=stackSave();try{return Module["dynCall_i"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iddi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iddi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_idi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_idi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_idii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_idii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_idiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_idiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_idiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_idiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_idiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_idiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ifffi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_ifffi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iffi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iffi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ifi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_ifi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ifiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_ifiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ifiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_ifiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ii(index,a1){var sp=stackSave();try{return Module["dynCall_ii"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiddi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiddi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiddiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiddiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iidi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iidi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iidii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iidii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iidiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iidiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iif(index,a1,a2){var sp=stackSave();try{return Module["dynCall_iif"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iifff(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iifff"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iifffi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iifffi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiffi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiffi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiffiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiffiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iifi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iifi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iifii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iifii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iifiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iifiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iifiiiijii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iifiiiijii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_iii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiid(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiid"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidd(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiidd"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiidi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiidii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiidiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiidiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidijiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiidijiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiidjiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiidjiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiif(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiif"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiff(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiiff"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiifff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiifff"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiffffffffiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return Module["dynCall_iiiffffffffiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiifi(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiifi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiifii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiifii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiifiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiifiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiifiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiifiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiid(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiiid"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiidd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiidd"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiidi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiidi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiidii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiidii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiif(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiiif"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiiff"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiifffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifffffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiiifffffii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifffiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiifffiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiifi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiifii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiifiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiifiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiifiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiidi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiidi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiff(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiiff"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiifi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiifi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiiifiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiifiiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return Module["dynCall_iiiiifiiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiifff(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiiiifff"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiifffiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return Module["dynCall_iiiiiifffiiifiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiffiiiiiiiiiffffiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23){var sp=stackSave();try{return Module["dynCall_iiiiiiffiiiiiiiiiffffiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiffiiiiiiiiiffffiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24){var sp=stackSave();try{return Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiffiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{return Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiifi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiiiifi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiifiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiiiifiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiiiifiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiiiiidii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiifiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiiiiiifiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiij(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiiiij"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiijji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiiiiijji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiiiji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiijji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiiijji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiij(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiij"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiijii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiijii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiijiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiijiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiijj(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiijj"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiijjii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiijjii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiijjiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return Module["dynCall_iiiijjiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiij(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiijii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiijii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiijiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiijiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiijj(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiijj"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiijji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiijji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiijjii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiijjii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiijjiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiijjiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iij(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iij"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiji(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iijii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iijiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iijji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijjii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iijjii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijjiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iijjiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijjj(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iijjj"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijjji(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iijjji"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ij(index,a1,a2){var sp=stackSave();try{return Module["dynCall_ij"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iji(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iji"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_ijii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_ijiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_ijiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijj(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_ijj"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_ijji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijjjf(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_ijjjf"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijjjfi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_ijjjfi"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijjji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_ijjji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijjjii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_ijjjii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijjjji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_ijjjji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ijjjjii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_ijjjjii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_j(index){var sp=stackSave();try{return Module["dynCall_j"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jdi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_jdi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jdii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jdii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jfi(index,a1,a2){var sp=stackSave();try{return Module["dynCall_jfi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ji(index,a1){var sp=stackSave();try{return Module["dynCall_ji"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jidi(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jidi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jidii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jidii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_jii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiid(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jiid"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jiii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jiiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_jiiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_jiiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_jiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_jiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiij(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jiij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_jiiji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jij(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jij"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiji(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jiji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_jijii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_jijiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijj(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_jijj"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_jijji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jji(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jji"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jjii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jjii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jjji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_jjji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jjjji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_jjjji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_v(index){var sp=stackSave();try{Module["dynCall_v"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vd(index,a1){var sp=stackSave();try{Module["dynCall_vd"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vdiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vdiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vf(index,a1){var sp=stackSave();try{Module["dynCall_vf"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vff(index,a1,a2){var sp=stackSave();try{Module["dynCall_vff"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vffff(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_vffff"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vffi(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vffi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vfi(index,a1,a2){var sp=stackSave();try{Module["dynCall_vfi"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vi(index,a1){var sp=stackSave();try{Module["dynCall_vi"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vid(index,a1,a2){var sp=stackSave();try{Module["dynCall_vid"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidd(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vidd"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidi(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vidi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidii(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_vidii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_vidiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_vidiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidiji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vidiji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vidjii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vidjii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vif(index,a1,a2){var sp=stackSave();try{Module["dynCall_vif"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viff(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viff"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifff(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_vifff"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viffff"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffffffff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viffffffff"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viffffffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifffffi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_vifffffi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffffi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viffffi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffffii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viffffii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffffiifffiiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{Module["dynCall_viffffiifffiiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifffi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_vifffi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifffii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vifffii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffi(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viffi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viffii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffiifffffiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{Module["dynCall_viffiifffffiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viffiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viffiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifi(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vifi"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifii(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_vifii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vifiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vifijii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_vifijii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vii(index,a1,a2){var sp=stackSave();try{Module["dynCall_vii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viid(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viid"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viidi(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viidi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viidii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viidii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viidij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viidij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viidiji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viidiji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viidji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viidji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viidjii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viidjii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viif(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viif"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiff(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viiff"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viifff"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiffffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{Module["dynCall_viiffffffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiffffffffiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{Module["dynCall_viiffffffffiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viifffffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viiffffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifffffi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viifffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiffffi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiffffi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifffi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viifffi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiffi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiffi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiffii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiffii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifi(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viifi"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viifii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viifiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viifiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viii(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiidi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiidi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiidij(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiidij"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiidji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiidji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiidjii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiidjii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiif(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viiif"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiffffffff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{Module["dynCall_viiiffffffff"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiifffi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiifffi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiffi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiffi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiffii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiffii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiifi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiifi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiififfi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiififfi"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiififi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiififi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiifii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiifii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiifiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiifiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiifiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viiifiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiii(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiidi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiidi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiidii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiidii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiidij(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiidij"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiidji(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiidji"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiif(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiiif"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiffffffff(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{Module["dynCall_viiiiffffffff"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiffffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viiiiffffii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiifi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiifi"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiifii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiifii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiifiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiifiiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{Module["dynCall_viiiifiiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiif(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiiif"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiffffi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viiiiiffffi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiffi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiiiffi"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viiiiiffii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiifi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiiifi"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiif(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiiiif"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiifi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiiiifi"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiifi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viiiiiiifi"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{Module["dynCall_viiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiifii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiifii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiijiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viiiijiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiijji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viiiijji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiij(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiij"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiijji(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiijji"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viij(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viijii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viijiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijiijiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{Module["dynCall_viijiijiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijij(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viijij"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijijii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viijijii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijijiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viijijiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijijj(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viijijj"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijijji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viijijji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijj(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viijj"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viijji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijjii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viijjii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijjiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viijjiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijjji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_viijjji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vij(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vij"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viji(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_vijii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vijiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijiji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_vijiji"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijijji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_vijijji"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vijji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijjii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_vijjii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vijjji(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_vijjji"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vj(index,a1,a2){var sp=stackSave();try{Module["dynCall_vj"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vji(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vji"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjii(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_vjii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_vjiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_vjiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_vjiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{Module["dynCall_vjiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_vjiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vjji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_vjji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}Module.asmGlobalArg={};Module.asmLibraryArg={"abort":abort,"assert":assert,"enlargeMemory":enlargeMemory,"getTotalMemory":getTotalMemory,"abortOnCannotGrowMemory":abortOnCannotGrowMemory,"invoke_d":invoke_d,"invoke_dddi":invoke_dddi,"invoke_ddi":invoke_ddi,"invoke_dfi":invoke_dfi,"invoke_di":invoke_di,"invoke_did":invoke_did,"invoke_didd":invoke_didd,"invoke_diddi":invoke_diddi,"invoke_didi":invoke_didi,"invoke_didii":invoke_didii,"invoke_dii":invoke_dii,"invoke_diidi":invoke_diidi,"invoke_diii":invoke_diii,"invoke_diiii":invoke_diiii,"invoke_diij":invoke_diij,"invoke_diiji":invoke_diiji,"invoke_diji":invoke_diji,"invoke_dji":invoke_dji,"invoke_f":invoke_f,"invoke_fdi":invoke_fdi,"invoke_ff":invoke_ff,"invoke_fff":invoke_fff,"invoke_fffffi":invoke_fffffi,"invoke_ffffi":invoke_ffffi,"invoke_fffi":invoke_fffi,"invoke_fffifffi":invoke_fffifffi,"invoke_ffi":invoke_ffi,"invoke_fi":invoke_fi,"invoke_fidi":invoke_fidi,"invoke_fif":invoke_fif,"invoke_fiff":invoke_fiff,"invoke_fiffi":invoke_fiffi,"invoke_fifi":invoke_fifi,"invoke_fifii":invoke_fifii,"invoke_fii":invoke_fii,"invoke_fiid":invoke_fiid,"invoke_fiifi":invoke_fiifi,"invoke_fiifii":invoke_fiifii,"invoke_fiii":invoke_fiii,"invoke_fiiii":invoke_fiiii,"invoke_fiiiif":invoke_fiiiif,"invoke_fiiiii":invoke_fiiiii,"invoke_fiiiiii":invoke_fiiiiii,"invoke_fiiiiiifiifif":invoke_fiiiiiifiifif,"invoke_fiiiiiifiiiif":invoke_fiiiiiifiiiif,"invoke_fiiiiiii":invoke_fiiiiiii,"invoke_fji":invoke_fji,"invoke_i":invoke_i,"invoke_iddi":invoke_iddi,"invoke_idi":invoke_idi,"invoke_idii":invoke_idii,"invoke_idiii":invoke_idiii,"invoke_idiiii":invoke_idiiii,"invoke_idiiiii":invoke_idiiiii,"invoke_ifffi":invoke_ifffi,"invoke_iffi":invoke_iffi,"invoke_ifi":invoke_ifi,"invoke_ifiii":invoke_ifiii,"invoke_ifiiii":invoke_ifiiii,"invoke_ii":invoke_ii,"invoke_iiddi":invoke_iiddi,"invoke_iiddiii":invoke_iiddiii,"invoke_iidi":invoke_iidi,"invoke_iidii":invoke_iidii,"invoke_iidiii":invoke_iidiii,"invoke_iif":invoke_iif,"invoke_iifff":invoke_iifff,"invoke_iifffi":invoke_iifffi,"invoke_iiffi":invoke_iiffi,"invoke_iiffiii":invoke_iiffiii,"invoke_iifi":invoke_iifi,"invoke_iifii":invoke_iifii,"invoke_iifiii":invoke_iifiii,"invoke_iifiiiijii":invoke_iifiiiijii,"invoke_iii":invoke_iii,"invoke_iiid":invoke_iiid,"invoke_iiidd":invoke_iiidd,"invoke_iiidi":invoke_iiidi,"invoke_iiidii":invoke_iiidii,"invoke_iiidiii":invoke_iiidiii,"invoke_iiidiiii":invoke_iiidiiii,"invoke_iiidijiii":invoke_iiidijiii,"invoke_iiidjiiii":invoke_iiidjiiii,"invoke_iiif":invoke_iiif,"invoke_iiiff":invoke_iiiff,"invoke_iiifff":invoke_iiifff,"invoke_iiiffffffffiii":invoke_iiiffffffffiii,"invoke_iiifi":invoke_iiifi,"invoke_iiifii":invoke_iiifii,"invoke_iiifiii":invoke_iiifiii,"invoke_iiifiiii":invoke_iiifiiii,"invoke_iiii":invoke_iiii,"invoke_iiiid":invoke_iiiid,"invoke_iiiidd":invoke_iiiidd,"invoke_iiiidi":invoke_iiiidi,"invoke_iiiidii":invoke_iiiidii,"invoke_iiiif":invoke_iiiif,"invoke_iiiiff":invoke_iiiiff,"invoke_iiiifffffi":invoke_iiiifffffi,"invoke_iiiifffffii":invoke_iiiifffffii,"invoke_iiiifffiii":invoke_iiiifffiii,"invoke_iiiifi":invoke_iiiifi,"invoke_iiiifii":invoke_iiiifii,"invoke_iiiifiii":invoke_iiiifiii,"invoke_iiiifiiii":invoke_iiiifiiii,"invoke_iiiifiiiii":invoke_iiiifiiiii,"invoke_iiiii":invoke_iiiii,"invoke_iiiiidi":invoke_iiiiidi,"invoke_iiiiiff":invoke_iiiiiff,"invoke_iiiiifi":invoke_iiiiifi,"invoke_iiiiifiii":invoke_iiiiifiii,"invoke_iiiiifiiiiif":invoke_iiiiifiiiiif,"invoke_iiiiii":invoke_iiiiii,"invoke_iiiiiifff":invoke_iiiiiifff,"invoke_iiiiiifffiiifiii":invoke_iiiiiifffiiifiii,"invoke_iiiiiiffiiiiiiiiiffffiii":invoke_iiiiiiffiiiiiiiiiffffiii,"invoke_iiiiiiffiiiiiiiiiffffiiii":invoke_iiiiiiffiiiiiiiiiffffiiii,"invoke_iiiiiiffiiiiiiiiiiiiiii":invoke_iiiiiiffiiiiiiiiiiiiiii,"invoke_iiiiiifi":invoke_iiiiiifi,"invoke_iiiiiifiif":invoke_iiiiiifiif,"invoke_iiiiiifiii":invoke_iiiiiifiii,"invoke_iiiiiii":invoke_iiiiiii,"invoke_iiiiiiidii":invoke_iiiiiiidii,"invoke_iiiiiiifiif":invoke_iiiiiiifiif,"invoke_iiiiiiii":invoke_iiiiiiii,"invoke_iiiiiiiii":invoke_iiiiiiiii,"invoke_iiiiiiiiii":invoke_iiiiiiiiii,"invoke_iiiiiiiiiii":invoke_iiiiiiiiiii,"invoke_iiiiiiiiiiii":invoke_iiiiiiiiiiii,"invoke_iiiiiiiiiiiii":invoke_iiiiiiiiiiiii,"invoke_iiiiiiiiiiiiii":invoke_iiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiiiiiiii,"invoke_iiiiiiiiiiiiiiiiiiiii":invoke_iiiiiiiiiiiiiiiiiiiii,"invoke_iiiiiij":invoke_iiiiiij,"invoke_iiiiiijji":invoke_iiiiiijji,"invoke_iiiiij":invoke_iiiiij,"invoke_iiiiiji":invoke_iiiiiji,"invoke_iiiiijji":invoke_iiiiijji,"invoke_iiiij":invoke_iiiij,"invoke_iiiiji":invoke_iiiiji,"invoke_iiiijii":invoke_iiiijii,"invoke_iiiijiii":invoke_iiiijiii,"invoke_iiiijj":invoke_iiiijj,"invoke_iiiijjii":invoke_iiiijjii,"invoke_iiiijjiiii":invoke_iiiijjiiii,"invoke_iiij":invoke_iiij,"invoke_iiiji":invoke_iiiji,"invoke_iiijii":invoke_iiijii,"invoke_iiijiii":invoke_iiijiii,"invoke_iiijj":invoke_iiijj,"invoke_iiijji":invoke_iiijji,"invoke_iiijjii":invoke_iiijjii,"invoke_iiijjiiii":invoke_iiijjiiii,"invoke_iij":invoke_iij,"invoke_iiji":invoke_iiji,"invoke_iijii":invoke_iijii,"invoke_iijiii":invoke_iijiii,"invoke_iijji":invoke_iijji,"invoke_iijjii":invoke_iijjii,"invoke_iijjiii":invoke_iijjiii,"invoke_iijjj":invoke_iijjj,"invoke_iijjji":invoke_iijjji,"invoke_ij":invoke_ij,"invoke_iji":invoke_iji,"invoke_ijii":invoke_ijii,"invoke_ijiii":invoke_ijiii,"invoke_ijiiii":invoke_ijiiii,"invoke_ijj":invoke_ijj,"invoke_ijji":invoke_ijji,"invoke_ijjjf":invoke_ijjjf,"invoke_ijjjfi":invoke_ijjjfi,"invoke_ijjji":invoke_ijjji,"invoke_ijjjii":invoke_ijjjii,"invoke_ijjjji":invoke_ijjjji,"invoke_ijjjjii":invoke_ijjjjii,"invoke_j":invoke_j,"invoke_jdi":invoke_jdi,"invoke_jdii":invoke_jdii,"invoke_jfi":invoke_jfi,"invoke_ji":invoke_ji,"invoke_jidi":invoke_jidi,"invoke_jidii":invoke_jidii,"invoke_jii":invoke_jii,"invoke_jiid":invoke_jiid,"invoke_jiii":invoke_jiii,"invoke_jiiii":invoke_jiiii,"invoke_jiiiii":invoke_jiiiii,"invoke_jiiiiii":invoke_jiiiiii,"invoke_jiiiiiii":invoke_jiiiiiii,"invoke_jiiiiiiiiii":invoke_jiiiiiiiiii,"invoke_jiij":invoke_jiij,"invoke_jiiji":invoke_jiiji,"invoke_jij":invoke_jij,"invoke_jiji":invoke_jiji,"invoke_jijii":invoke_jijii,"invoke_jijiii":invoke_jijiii,"invoke_jijj":invoke_jijj,"invoke_jijji":invoke_jijji,"invoke_jji":invoke_jji,"invoke_jjii":invoke_jjii,"invoke_jjji":invoke_jjji,"invoke_jjjji":invoke_jjjji,"invoke_v":invoke_v,"invoke_vd":invoke_vd,"invoke_vdiiiii":invoke_vdiiiii,"invoke_vf":invoke_vf,"invoke_vff":invoke_vff,"invoke_vffff":invoke_vffff,"invoke_vffi":invoke_vffi,"invoke_vfi":invoke_vfi,"invoke_vi":invoke_vi,"invoke_vid":invoke_vid,"invoke_vidd":invoke_vidd,"invoke_vidi":invoke_vidi,"invoke_vidii":invoke_vidii,"invoke_vidiii":invoke_vidiii,"invoke_vidiiiii":invoke_vidiiiii,"invoke_vidiji":invoke_vidiji,"invoke_vidjii":invoke_vidjii,"invoke_vif":invoke_vif,"invoke_viff":invoke_viff,"invoke_vifff":invoke_vifff,"invoke_viffff":invoke_viffff,"invoke_viffffffff":invoke_viffffffff,"invoke_viffffffffi":invoke_viffffffffi,"invoke_vifffffi":invoke_vifffffi,"invoke_viffffi":invoke_viffffi,"invoke_viffffii":invoke_viffffii,"invoke_viffffiifffiiiiif":invoke_viffffiifffiiiiif,"invoke_vifffi":invoke_vifffi,"invoke_vifffii":invoke_vifffii,"invoke_viffi":invoke_viffi,"invoke_viffii":invoke_viffii,"invoke_viffiifffffiii":invoke_viffiifffffiii,"invoke_viffiii":invoke_viffiii,"invoke_viffiiiif":invoke_viffiiiif,"invoke_vifi":invoke_vifi,"invoke_vifii":invoke_vifii,"invoke_vifiiii":invoke_vifiiii,"invoke_vifijii":invoke_vifijii,"invoke_vii":invoke_vii,"invoke_viid":invoke_viid,"invoke_viidi":invoke_viidi,"invoke_viidii":invoke_viidii,"invoke_viidij":invoke_viidij,"invoke_viidiji":invoke_viidiji,"invoke_viidji":invoke_viidji,"invoke_viidjii":invoke_viidjii,"invoke_viif":invoke_viif,"invoke_viiff":invoke_viiff,"invoke_viifff":invoke_viifff,"invoke_viiffffffffi":invoke_viiffffffffi,"invoke_viiffffffffiii":invoke_viiffffffffiii,"invoke_viifffffffi":invoke_viifffffffi,"invoke_viiffffffi":invoke_viiffffffi,"invoke_viifffffi":invoke_viifffffi,"invoke_viiffffi":invoke_viiffffi,"invoke_viifffi":invoke_viifffi,"invoke_viiffi":invoke_viiffi,"invoke_viiffii":invoke_viiffii,"invoke_viifi":invoke_viifi,"invoke_viifii":invoke_viifii,"invoke_viifiii":invoke_viifiii,"invoke_viifiiii":invoke_viifiiii,"invoke_viii":invoke_viii,"invoke_viiidi":invoke_viiidi,"invoke_viiidij":invoke_viiidij,"invoke_viiidji":invoke_viiidji,"invoke_viiidjii":invoke_viiidjii,"invoke_viiif":invoke_viiif,"invoke_viiiffffffff":invoke_viiiffffffff,"invoke_viiifffi":invoke_viiifffi,"invoke_viiiffi":invoke_viiiffi,"invoke_viiiffii":invoke_viiiffii,"invoke_viiifi":invoke_viiifi,"invoke_viiififfi":invoke_viiififfi,"invoke_viiififi":invoke_viiififi,"invoke_viiifii":invoke_viiifii,"invoke_viiifiii":invoke_viiifiii,"invoke_viiifiiiii":invoke_viiifiiiii,"invoke_viiii":invoke_viiii,"invoke_viiiidi":invoke_viiiidi,"invoke_viiiidii":invoke_viiiidii,"invoke_viiiidij":invoke_viiiidij,"invoke_viiiidji":invoke_viiiidji,"invoke_viiiif":invoke_viiiif,"invoke_viiiiffffffff":invoke_viiiiffffffff,"invoke_viiiiffffii":invoke_viiiiffffii,"invoke_viiiifi":invoke_viiiifi,"invoke_viiiifii":invoke_viiiifii,"invoke_viiiifiii":invoke_viiiifiii,"invoke_viiiifiiiiif":invoke_viiiifiiiiif,"invoke_viiiii":invoke_viiiii,"invoke_viiiiif":invoke_viiiiif,"invoke_viiiiiffffi":invoke_viiiiiffffi,"invoke_viiiiiffi":invoke_viiiiiffi,"invoke_viiiiiffii":invoke_viiiiiffii,"invoke_viiiiifi":invoke_viiiiifi,"invoke_viiiiii":invoke_viiiiii,"invoke_viiiiiif":invoke_viiiiiif,"invoke_viiiiiifi":invoke_viiiiiifi,"invoke_viiiiiii":invoke_viiiiiii,"invoke_viiiiiiifi":invoke_viiiiiiifi,"invoke_viiiiiiii":invoke_viiiiiiii,"invoke_viiiiiiiii":invoke_viiiiiiiii,"invoke_viiiiiiiiii":invoke_viiiiiiiiii,"invoke_viiiiiiiiiii":invoke_viiiiiiiiiii,"invoke_viiiiiiiiiiifii":invoke_viiiiiiiiiiifii,"invoke_viiiiiiiiiiii":invoke_viiiiiiiiiiii,"invoke_viiiiiiiiiiiii":invoke_viiiiiiiiiiiii,"invoke_viiiiiiiiiiiiii":invoke_viiiiiiiiiiiiii,"invoke_viiiiiiiiiiiiiii":invoke_viiiiiiiiiiiiiii,"invoke_viiiiiiiiiiiiiiii":invoke_viiiiiiiiiiiiiiii,"invoke_viiiiiiiiiiiiiiiii":invoke_viiiiiiiiiiiiiiiii,"invoke_viiiiiiiiiiiiiiiiii":invoke_viiiiiiiiiiiiiiiiii,"invoke_viiiiiiiiiiiiiiiiiii":invoke_viiiiiiiiiiiiiiiiiii,"invoke_viiiij":invoke_viiiij,"invoke_viiiijiiii":invoke_viiiijiiii,"invoke_viiiijji":invoke_viiiijji,"invoke_viiij":invoke_viiij,"invoke_viiiji":invoke_viiiji,"invoke_viiijji":invoke_viiijji,"invoke_viij":invoke_viij,"invoke_viiji":invoke_viiji,"invoke_viijii":invoke_viijii,"invoke_viijiii":invoke_viijiii,"invoke_viijiijiii":invoke_viijiijiii,"invoke_viijij":invoke_viijij,"invoke_viijijii":invoke_viijijii,"invoke_viijijiii":invoke_viijijiii,"invoke_viijijj":invoke_viijijj,"invoke_viijijji":invoke_viijijji,"invoke_viijj":invoke_viijj,"invoke_viijji":invoke_viijji,"invoke_viijjii":invoke_viijjii,"invoke_viijjiii":invoke_viijjiii,"invoke_viijjji":invoke_viijjji,"invoke_vij":invoke_vij,"invoke_viji":invoke_viji,"invoke_vijii":invoke_vijii,"invoke_vijiii":invoke_vijiii,"invoke_vijiji":invoke_vijiji,"invoke_vijijji":invoke_vijijji,"invoke_vijji":invoke_vijji,"invoke_vijjii":invoke_vijjii,"invoke_vijjji":invoke_vijjji,"invoke_vj":invoke_vj,"invoke_vji":invoke_vji,"invoke_vjii":invoke_vjii,"invoke_vjiii":invoke_vjiii,"invoke_vjiiii":invoke_vjiiii,"invoke_vjiiiii":invoke_vjiiiii,"invoke_vjiiiiiii":invoke_vjiiiiiii,"invoke_vjiiiiiiii":invoke_vjiiiiiiii,"invoke_vjji":invoke_vjji,"UWContextGetCapabilities":UWContextGetCapabilities,"_ContextAddRefPtr":_ContextAddRefPtr,"_ContextCreate":_ContextCreate,"_ContextCreateAudioTrack":_ContextCreateAudioTrack,"_ContextCreateAudioTrackSource":_ContextCreateAudioTrackSource,"_ContextCreateMediaStream":_ContextCreateMediaStream,"_ContextCreatePeerConnection":_ContextCreatePeerConnection,"_ContextCreatePeerConnectionWithConfig":_ContextCreatePeerConnectionWithConfig,"_ContextCreateVideoTrackSource":_ContextCreateVideoTrackSource,"_ContextDeleteDataChannel":_ContextDeleteDataChannel,"_ContextDeletePeerConnection":_ContextDeletePeerConnection,"_ContextDeleteRefPtr":_ContextDeleteRefPtr,"_ContextDestroy":_ContextDestroy,"_ContextRegisterAudioReceiveCallback":_ContextRegisterAudioReceiveCallback,"_ContextRegisterMediaStreamObserver":_ContextRegisterMediaStreamObserver,"_ContextUnregisterAudioReceiveCallback":_ContextUnregisterAudioReceiveCallback,"_ControllerPulse":_ControllerPulse,"_CreateAudioTrack":_CreateAudioTrack,"_CreateDataChannel":_CreateDataChannel,"_CreateMediaStream":_CreateMediaStream,"_CreateNativeRTCIceCandidate":_CreateNativeRTCIceCandidate,"_CreateNativeTexture":_CreateNativeTexture,"_CreatePeerConnection":_CreatePeerConnection,"_CreatePeerConnectionWithConfig":_CreatePeerConnectionWithConfig,"_CreateVideoTrack":_CreateVideoTrack,"_DataChannelClose":_DataChannelClose,"_DataChannelRegisterOnClose":_DataChannelRegisterOnClose,"_DataChannelRegisterOnMessage":_DataChannelRegisterOnMessage,"_DataChannelRegisterOnOpen":_DataChannelRegisterOnOpen,"_DataChannelRegisterOnTextMessage":_DataChannelRegisterOnTextMessage,"_DeleteIceCandidate":_DeleteIceCandidate,"_DeleteMediaStream":_DeleteMediaStream,"_DeleteReceiver":_DeleteReceiver,"_DeleteSender":_DeleteSender,"_DeleteTransceiver":_DeleteTransceiver,"_GetHardwareEncoderSupport":_GetHardwareEncoderSupport,"_IceCandidateGetCandidate":_IceCandidateGetCandidate,"_IceCandidateGetSdp":_IceCandidateGetSdp,"_IceCandidateGetSdpLineIndex":_IceCandidateGetSdpLineIndex,"_IceCandidateGetSdpMid":_IceCandidateGetSdpMid,"_InitControllersArray":_InitControllersArray,"_InitHandsArray":_InitHandsArray,"_InitViewerHitTestPoseArray":_InitViewerHitTestPoseArray,"_InitXRSharedArray":_InitXRSharedArray,"_JS_Cursor_SetImage":_JS_Cursor_SetImage,"_JS_Cursor_SetShow":_JS_Cursor_SetShow,"_JS_Eval_ClearInterval":_JS_Eval_ClearInterval,"_JS_Eval_SetInterval":_JS_Eval_SetInterval,"_JS_FileSystem_Initialize":_JS_FileSystem_Initialize,"_JS_FileSystem_Sync":_JS_FileSystem_Sync,"_JS_Log_Dump":_JS_Log_Dump,"_JS_Log_StackTrace":_JS_Log_StackTrace,"_JS_Sound_Create_Channel":_JS_Sound_Create_Channel,"_JS_Sound_GetLength":_JS_Sound_GetLength,"_JS_Sound_GetLoadState":_JS_Sound_GetLoadState,"_JS_Sound_Init":_JS_Sound_Init,"_JS_Sound_Load":_JS_Sound_Load,"_JS_Sound_Load_PCM":_JS_Sound_Load_PCM,"_JS_Sound_Play":_JS_Sound_Play,"_JS_Sound_ReleaseInstance":_JS_Sound_ReleaseInstance,"_JS_Sound_ResumeIfNeeded":_JS_Sound_ResumeIfNeeded,"_JS_Sound_Set3D":_JS_Sound_Set3D,"_JS_Sound_SetListenerOrientation":_JS_Sound_SetListenerOrientation,"_JS_Sound_SetListenerPosition":_JS_Sound_SetListenerPosition,"_JS_Sound_SetLoop":_JS_Sound_SetLoop,"_JS_Sound_SetLoopPoints":_JS_Sound_SetLoopPoints,"_JS_Sound_SetPitch":_JS_Sound_SetPitch,"_JS_Sound_SetPosition":_JS_Sound_SetPosition,"_JS_Sound_SetVolume":_JS_Sound_SetVolume,"_JS_Sound_Stop":_JS_Sound_Stop,"_JS_SystemInfo_GetBrowserName":_JS_SystemInfo_GetBrowserName,"_JS_SystemInfo_GetBrowserVersionString":_JS_SystemInfo_GetBrowserVersionString,"_JS_SystemInfo_GetCanvasClientSize":_JS_SystemInfo_GetCanvasClientSize,"_JS_SystemInfo_GetDocumentURL":_JS_SystemInfo_GetDocumentURL,"_JS_SystemInfo_GetGPUInfo":_JS_SystemInfo_GetGPUInfo,"_JS_SystemInfo_GetLanguage":_JS_SystemInfo_GetLanguage,"_JS_SystemInfo_GetMatchWebGLToCanvasSize":_JS_SystemInfo_GetMatchWebGLToCanvasSize,"_JS_SystemInfo_GetMemory":_JS_SystemInfo_GetMemory,"_JS_SystemInfo_GetOS":_JS_SystemInfo_GetOS,"_JS_SystemInfo_GetPreferredDevicePixelRatio":_JS_SystemInfo_GetPreferredDevicePixelRatio,"_JS_SystemInfo_GetScreenSize":_JS_SystemInfo_GetScreenSize,"_JS_SystemInfo_HasCursorLock":_JS_SystemInfo_HasCursorLock,"_JS_SystemInfo_HasFullscreen":_JS_SystemInfo_HasFullscreen,"_JS_SystemInfo_HasWebGL":_JS_SystemInfo_HasWebGL,"_JS_WebRequest_Abort":_JS_WebRequest_Abort,"_JS_WebRequest_Create":_JS_WebRequest_Create,"_JS_WebRequest_GetResponseHeaders":_JS_WebRequest_GetResponseHeaders,"_JS_WebRequest_Release":_JS_WebRequest_Release,"_JS_WebRequest_Send":_JS_WebRequest_Send,"_JS_WebRequest_SetProgressHandler":_JS_WebRequest_SetProgressHandler,"_JS_WebRequest_SetRequestHeader":_JS_WebRequest_SetRequestHeader,"_JS_WebRequest_SetResponseHandler":_JS_WebRequest_SetResponseHandler,"_JS_WebRequest_SetTimeout":_JS_WebRequest_SetTimeout,"_MediaStreamAddTrack":_MediaStreamAddTrack,"_MediaStreamRegisterOnAddTrack":_MediaStreamRegisterOnAddTrack,"_MediaStreamRegisterOnRemoveTrack":_MediaStreamRegisterOnRemoveTrack,"_MediaStreamTrackGetID":_MediaStreamTrackGetID,"_MediaStreamTrackGetKind":_MediaStreamTrackGetKind,"_PeerConnectionAddIceCandidate":_PeerConnectionAddIceCandidate,"_PeerConnectionClose":_PeerConnectionClose,"_PeerConnectionCreateAnswer":_PeerConnectionCreateAnswer,"_PeerConnectionGetTransceivers":_PeerConnectionGetTransceivers,"_PeerConnectionRegisterCallbackCollectStats":_PeerConnectionRegisterCallbackCollectStats,"_PeerConnectionRegisterCallbackCreateSD":_PeerConnectionRegisterCallbackCreateSD,"_PeerConnectionRegisterConnectionStateChange":_PeerConnectionRegisterConnectionStateChange,"_PeerConnectionRegisterIceConnectionChange":_PeerConnectionRegisterIceConnectionChange,"_PeerConnectionRegisterIceGatheringChange":_PeerConnectionRegisterIceGatheringChange,"_PeerConnectionRegisterOnDataChannel":_PeerConnectionRegisterOnDataChannel,"_PeerConnectionRegisterOnIceCandidate":_PeerConnectionRegisterOnIceCandidate,"_PeerConnectionRegisterOnRemoveTrack":_PeerConnectionRegisterOnRemoveTrack,"_PeerConnectionRegisterOnRenegotiationNeeded":_PeerConnectionRegisterOnRenegotiationNeeded,"_PeerConnectionRegisterOnSetSessionDescFailure":_PeerConnectionRegisterOnSetSessionDescFailure,"_PeerConnectionRegisterOnSetSessionDescSuccess":_PeerConnectionRegisterOnSetSessionDescSuccess,"_PeerConnectionRegisterOnTrack":_PeerConnectionRegisterOnTrack,"_PeerConnectionSetDescription":_PeerConnectionSetDescription,"_PeerConnectionSetDescriptionWithoutDescription":_PeerConnectionSetDescriptionWithoutDescription,"_PeerConnectionSetLocalDescription":_PeerConnectionSetLocalDescription,"_PeerConnectionSetRemoteDescription":_PeerConnectionSetRemoteDescription,"_ProcessAudio":_ProcessAudio,"_ReceiverGetTrack":_ReceiverGetTrack,"_RegisterDebugLog":_RegisterDebugLog,"_RenderLocalVideotrack":_RenderLocalVideotrack,"_SetWebXREvents":_SetWebXREvents,"_SetWebXRSettings":_SetWebXRSettings,"_ToggleAR":_ToggleAR,"_ToggleVR":_ToggleVR,"_ToggleViewerHitTest":_ToggleViewerHitTest,"_TransceiverGetReceiver":_TransceiverGetReceiver,"_TransceiverGetSender":_TransceiverGetSender,"_TransceiverStop":_TransceiverStop,"_UnityWebRTCInit":_UnityWebRTCInit,"_UpdateRendererTexture":_UpdateRendererTexture,"_WebSocketAllocate":_WebSocketAllocate,"_WebSocketClose":_WebSocketClose,"_WebSocketConnect":_WebSocketConnect,"_WebSocketFree":_WebSocketFree,"_WebSocketGetState":_WebSocketGetState,"_WebSocketSend":_WebSocketSend,"_WebSocketSendText":_WebSocketSendText,"_WebSocketSetOnClose":_WebSocketSetOnClose,"_WebSocketSetOnError":_WebSocketSetOnError,"_WebSocketSetOnMessage":_WebSocketSetOnMessage,"_WebSocketSetOnOpen":_WebSocketSetOnOpen,"__ZSt18uncaught_exceptionv":__ZSt18uncaught_exceptionv,"___atomic_compare_exchange_8":___atomic_compare_exchange_8,"___atomic_fetch_add_8":___atomic_fetch_add_8,"___buildEnvironment":___buildEnvironment,"___cxa_allocate_exception":___cxa_allocate_exception,"___cxa_begin_catch":___cxa_begin_catch,"___cxa_end_catch":___cxa_end_catch,"___cxa_find_matching_catch":___cxa_find_matching_catch,"___cxa_find_matching_catch_2":___cxa_find_matching_catch_2,"___cxa_find_matching_catch_3":___cxa_find_matching_catch_3,"___cxa_find_matching_catch_4":___cxa_find_matching_catch_4,"___cxa_free_exception":___cxa_free_exception,"___cxa_pure_virtual":___cxa_pure_virtual,"___cxa_rethrow":___cxa_rethrow,"___cxa_throw":___cxa_throw,"___gxx_personality_v0":___gxx_personality_v0,"___lock":___lock,"___map_file":___map_file,"___resumeException":___resumeException,"___setErrNo":___setErrNo,"___syscall10":___syscall10,"___syscall102":___syscall102,"___syscall122":___syscall122,"___syscall140":___syscall140,"___syscall142":___syscall142,"___syscall145":___syscall145,"___syscall146":___syscall146,"___syscall15":___syscall15,"___syscall168":___syscall168,"___syscall183":___syscall183,"___syscall192":___syscall192,"___syscall193":___syscall193,"___syscall195":___syscall195,"___syscall196":___syscall196,"___syscall197":___syscall197,"___syscall199":___syscall199,"___syscall202":___syscall202,"___syscall220":___syscall220,"___syscall221":___syscall221,"___syscall268":___syscall268,"___syscall3":___syscall3,"___syscall33":___syscall33,"___syscall38":___syscall38,"___syscall39":___syscall39,"___syscall4":___syscall4,"___syscall40":___syscall40,"___syscall42":___syscall42,"___syscall5":___syscall5,"___syscall54":___syscall54,"___syscall6":___syscall6,"___syscall63":___syscall63,"___syscall77":___syscall77,"___syscall85":___syscall85,"___syscall91":___syscall91,"___unlock":___unlock,"__addDays":__addDays,"__arraySum":__arraySum,"__emscripten_do_request_fullscreen":__emscripten_do_request_fullscreen,"__emscripten_sample_gamepad_data":__emscripten_sample_gamepad_data,"__emscripten_traverse_stack":__emscripten_traverse_stack,"__exit":__exit,"__formatString":__formatString,"__inet_ntop4_raw":__inet_ntop4_raw,"__inet_ntop6_raw":__inet_ntop6_raw,"__inet_pton4_raw":__inet_pton4_raw,"__inet_pton6_raw":__inet_pton6_raw,"__isLeapYear":__isLeapYear,"__read_sockaddr":__read_sockaddr,"__reallyNegative":__reallyNegative,"__setLetterbox":__setLetterbox,"__write_sockaddr":__write_sockaddr,"_abort":_abort,"_atexit":_atexit,"_clock":_clock,"_clock_getres":_clock_getres,"_clock_gettime":_clock_gettime,"_difftime":_difftime,"_dlclose":_dlclose,"_dlopen":_dlopen,"_dlsym":_dlsym,"_emscripten_asm_const_i":_emscripten_asm_const_i,"_emscripten_asm_const_sync_on_main_thread_i":_emscripten_asm_const_sync_on_main_thread_i,"_emscripten_cancel_main_loop":_emscripten_cancel_main_loop,"_emscripten_exit_fullscreen":_emscripten_exit_fullscreen,"_emscripten_exit_pointerlock":_emscripten_exit_pointerlock,"_emscripten_get_callstack_js":_emscripten_get_callstack_js,"_emscripten_get_canvas_element_size":_emscripten_get_canvas_element_size,"_emscripten_get_canvas_element_size_calling_thread":_emscripten_get_canvas_element_size_calling_thread,"_emscripten_get_canvas_element_size_main_thread":_emscripten_get_canvas_element_size_main_thread,"_emscripten_get_fullscreen_status":_emscripten_get_fullscreen_status,"_emscripten_get_gamepad_status":_emscripten_get_gamepad_status,"_emscripten_get_main_loop_timing":_emscripten_get_main_loop_timing,"_emscripten_get_now":_emscripten_get_now,"_emscripten_get_now_is_monotonic":_emscripten_get_now_is_monotonic,"_emscripten_get_now_res":_emscripten_get_now_res,"_emscripten_get_num_gamepads":_emscripten_get_num_gamepads,"_emscripten_has_threading_support":_emscripten_has_threading_support,"_emscripten_html5_remove_all_event_listeners":_emscripten_html5_remove_all_event_listeners,"_emscripten_is_webgl_context_lost":_emscripten_is_webgl_context_lost,"_emscripten_log":_emscripten_log,"_emscripten_log_js":_emscripten_log_js,"_emscripten_longjmp":_emscripten_longjmp,"_emscripten_memcpy_big":_emscripten_memcpy_big,"_emscripten_num_logical_cores":_emscripten_num_logical_cores,"_emscripten_request_fullscreen":_emscripten_request_fullscreen,"_emscripten_request_pointerlock":_emscripten_request_pointerlock,"_emscripten_set_blur_callback_on_thread":_emscripten_set_blur_callback_on_thread,"_emscripten_set_canvas_element_size":_emscripten_set_canvas_element_size,"_emscripten_set_dblclick_callback_on_thread":_emscripten_set_dblclick_callback_on_thread,"_emscripten_set_devicemotion_callback_on_thread":_emscripten_set_devicemotion_callback_on_thread,"_emscripten_set_deviceorientation_callback_on_thread":_emscripten_set_deviceorientation_callback_on_thread,"_emscripten_set_focus_callback_on_thread":_emscripten_set_focus_callback_on_thread,"_emscripten_set_fullscreenchange_callback_on_thread":_emscripten_set_fullscreenchange_callback_on_thread,"_emscripten_set_gamepadconnected_callback_on_thread":_emscripten_set_gamepadconnected_callback_on_thread,"_emscripten_set_gamepaddisconnected_callback_on_thread":_emscripten_set_gamepaddisconnected_callback_on_thread,"_emscripten_set_keydown_callback_on_thread":_emscripten_set_keydown_callback_on_thread,"_emscripten_set_keypress_callback_on_thread":_emscripten_set_keypress_callback_on_thread,"_emscripten_set_keyup_callback_on_thread":_emscripten_set_keyup_callback_on_thread,"_emscripten_set_main_loop":_emscripten_set_main_loop,"_emscripten_set_main_loop_timing":_emscripten_set_main_loop_timing,"_emscripten_set_mousedown_callback_on_thread":_emscripten_set_mousedown_callback_on_thread,"_emscripten_set_mousemove_callback_on_thread":_emscripten_set_mousemove_callback_on_thread,"_emscripten_set_mouseup_callback_on_thread":_emscripten_set_mouseup_callback_on_thread,"_emscripten_set_touchcancel_callback_on_thread":_emscripten_set_touchcancel_callback_on_thread,"_emscripten_set_touchend_callback_on_thread":_emscripten_set_touchend_callback_on_thread,"_emscripten_set_touchmove_callback_on_thread":_emscripten_set_touchmove_callback_on_thread,"_emscripten_set_touchstart_callback_on_thread":_emscripten_set_touchstart_callback_on_thread,"_emscripten_set_wheel_callback_on_thread":_emscripten_set_wheel_callback_on_thread,"_emscripten_webgl_create_context":_emscripten_webgl_create_context,"_emscripten_webgl_destroy_context":_emscripten_webgl_destroy_context,"_emscripten_webgl_destroy_context_calling_thread":_emscripten_webgl_destroy_context_calling_thread,"_emscripten_webgl_do_create_context":_emscripten_webgl_do_create_context,"_emscripten_webgl_do_get_current_context":_emscripten_webgl_do_get_current_context,"_emscripten_webgl_enable_extension":_emscripten_webgl_enable_extension,"_emscripten_webgl_enable_extension_calling_thread":_emscripten_webgl_enable_extension_calling_thread,"_emscripten_webgl_get_current_context":_emscripten_webgl_get_current_context,"_emscripten_webgl_init_context_attributes":_emscripten_webgl_init_context_attributes,"_emscripten_webgl_make_context_current":_emscripten_webgl_make_context_current,"_exit":_exit,"_flock":_flock,"_getaddrinfo":_getaddrinfo,"_getenv":_getenv,"_gethostbyaddr":_gethostbyaddr,"_gethostbyname":_gethostbyname,"_getnameinfo":_getnameinfo,"_getpagesize":_getpagesize,"_getpwuid":_getpwuid,"_gettimeofday":_gettimeofday,"_glActiveTexture":_glActiveTexture,"_glAttachShader":_glAttachShader,"_glBeginQuery":_glBeginQuery,"_glBeginTransformFeedback":_glBeginTransformFeedback,"_glBindAttribLocation":_glBindAttribLocation,"_glBindBuffer":_glBindBuffer,"_glBindBufferBase":_glBindBufferBase,"_glBindBufferRange":_glBindBufferRange,"_glBindFramebuffer":_glBindFramebuffer,"_glBindRenderbuffer":_glBindRenderbuffer,"_glBindSampler":_glBindSampler,"_glBindTexture":_glBindTexture,"_glBindTransformFeedback":_glBindTransformFeedback,"_glBindVertexArray":_glBindVertexArray,"_glBlendEquation":_glBlendEquation,"_glBlendEquationSeparate":_glBlendEquationSeparate,"_glBlendFuncSeparate":_glBlendFuncSeparate,"_glBlitFramebuffer":_glBlitFramebuffer,"_glBufferData":_glBufferData,"_glBufferSubData":_glBufferSubData,"_glCheckFramebufferStatus":_glCheckFramebufferStatus,"_glClear":_glClear,"_glClearBufferfi":_glClearBufferfi,"_glClearBufferfv":_glClearBufferfv,"_glClearBufferuiv":_glClearBufferuiv,"_glClearColor":_glClearColor,"_glClearDepthf":_glClearDepthf,"_glClearStencil":_glClearStencil,"_glClientWaitSync":_glClientWaitSync,"_glColorMask":_glColorMask,"_glCompileShader":_glCompileShader,"_glCompressedTexImage2D":_glCompressedTexImage2D,"_glCompressedTexImage3D":_glCompressedTexImage3D,"_glCompressedTexSubImage2D":_glCompressedTexSubImage2D,"_glCompressedTexSubImage3D":_glCompressedTexSubImage3D,"_glCopyBufferSubData":_glCopyBufferSubData,"_glCopyTexImage2D":_glCopyTexImage2D,"_glCopyTexSubImage2D":_glCopyTexSubImage2D,"_glCreateProgram":_glCreateProgram,"_glCreateShader":_glCreateShader,"_glCullFace":_glCullFace,"_glDeleteBuffers":_glDeleteBuffers,"_glDeleteFramebuffers":_glDeleteFramebuffers,"_glDeleteProgram":_glDeleteProgram,"_glDeleteQueries":_glDeleteQueries,"_glDeleteRenderbuffers":_glDeleteRenderbuffers,"_glDeleteSamplers":_glDeleteSamplers,"_glDeleteShader":_glDeleteShader,"_glDeleteSync":_glDeleteSync,"_glDeleteTextures":_glDeleteTextures,"_glDeleteTransformFeedbacks":_glDeleteTransformFeedbacks,"_glDeleteVertexArrays":_glDeleteVertexArrays,"_glDepthFunc":_glDepthFunc,"_glDepthMask":_glDepthMask,"_glDetachShader":_glDetachShader,"_glDisable":_glDisable,"_glDisableVertexAttribArray":_glDisableVertexAttribArray,"_glDrawArrays":_glDrawArrays,"_glDrawArraysInstanced":_glDrawArraysInstanced,"_glDrawBuffers":_glDrawBuffers,"_glDrawElements":_glDrawElements,"_glDrawElementsInstanced":_glDrawElementsInstanced,"_glEnable":_glEnable,"_glEnableVertexAttribArray":_glEnableVertexAttribArray,"_glEndQuery":_glEndQuery,"_glEndTransformFeedback":_glEndTransformFeedback,"_glFenceSync":_glFenceSync,"_glFinish":_glFinish,"_glFlush":_glFlush,"_glFlushMappedBufferRange":_glFlushMappedBufferRange,"_glFramebufferRenderbuffer":_glFramebufferRenderbuffer,"_glFramebufferTexture2D":_glFramebufferTexture2D,"_glFramebufferTextureLayer":_glFramebufferTextureLayer,"_glFrontFace":_glFrontFace,"_glGenBuffers":_glGenBuffers,"_glGenFramebuffers":_glGenFramebuffers,"_glGenQueries":_glGenQueries,"_glGenRenderbuffers":_glGenRenderbuffers,"_glGenSamplers":_glGenSamplers,"_glGenTextures":_glGenTextures,"_glGenTransformFeedbacks":_glGenTransformFeedbacks,"_glGenVertexArrays":_glGenVertexArrays,"_glGenerateMipmap":_glGenerateMipmap,"_glGetActiveAttrib":_glGetActiveAttrib,"_glGetActiveUniform":_glGetActiveUniform,"_glGetActiveUniformBlockName":_glGetActiveUniformBlockName,"_glGetActiveUniformBlockiv":_glGetActiveUniformBlockiv,"_glGetActiveUniformsiv":_glGetActiveUniformsiv,"_glGetAttribLocation":_glGetAttribLocation,"_glGetError":_glGetError,"_glGetFramebufferAttachmentParameteriv":_glGetFramebufferAttachmentParameteriv,"_glGetIntegeri_v":_glGetIntegeri_v,"_glGetIntegerv":_glGetIntegerv,"_glGetInternalformativ":_glGetInternalformativ,"_glGetProgramBinary":_glGetProgramBinary,"_glGetProgramInfoLog":_glGetProgramInfoLog,"_glGetProgramiv":_glGetProgramiv,"_glGetQueryObjectuiv":_glGetQueryObjectuiv,"_glGetQueryiv":_glGetQueryiv,"_glGetRenderbufferParameteriv":_glGetRenderbufferParameteriv,"_glGetShaderInfoLog":_glGetShaderInfoLog,"_glGetShaderPrecisionFormat":_glGetShaderPrecisionFormat,"_glGetShaderSource":_glGetShaderSource,"_glGetShaderiv":_glGetShaderiv,"_glGetString":_glGetString,"_glGetStringi":_glGetStringi,"_glGetTexParameteriv":_glGetTexParameteriv,"_glGetUniformBlockIndex":_glGetUniformBlockIndex,"_glGetUniformIndices":_glGetUniformIndices,"_glGetUniformLocation":_glGetUniformLocation,"_glGetUniformiv":_glGetUniformiv,"_glGetVertexAttribiv":_glGetVertexAttribiv,"_glInvalidateFramebuffer":_glInvalidateFramebuffer,"_glIsEnabled":_glIsEnabled,"_glIsVertexArray":_glIsVertexArray,"_glLinkProgram":_glLinkProgram,"_glMapBufferRange":_glMapBufferRange,"_glPixelStorei":_glPixelStorei,"_glPolygonOffset":_glPolygonOffset,"_glProgramBinary":_glProgramBinary,"_glProgramParameteri":_glProgramParameteri,"_glReadBuffer":_glReadBuffer,"_glReadPixels":_glReadPixels,"_glRenderbufferStorage":_glRenderbufferStorage,"_glRenderbufferStorageMultisample":_glRenderbufferStorageMultisample,"_glSamplerParameteri":_glSamplerParameteri,"_glScissor":_glScissor,"_glShaderSource":_glShaderSource,"_glStencilFuncSeparate":_glStencilFuncSeparate,"_glStencilMask":_glStencilMask,"_glStencilOpSeparate":_glStencilOpSeparate,"_glTexImage2D":_glTexImage2D,"_glTexImage3D":_glTexImage3D,"_glTexParameterf":_glTexParameterf,"_glTexParameteri":_glTexParameteri,"_glTexParameteriv":_glTexParameteriv,"_glTexStorage2D":_glTexStorage2D,"_glTexStorage3D":_glTexStorage3D,"_glTexSubImage2D":_glTexSubImage2D,"_glTexSubImage3D":_glTexSubImage3D,"_glTransformFeedbackVaryings":_glTransformFeedbackVaryings,"_glUniform1fv":_glUniform1fv,"_glUniform1i":_glUniform1i,"_glUniform1iv":_glUniform1iv,"_glUniform1uiv":_glUniform1uiv,"_glUniform2fv":_glUniform2fv,"_glUniform2iv":_glUniform2iv,"_glUniform2uiv":_glUniform2uiv,"_glUniform3fv":_glUniform3fv,"_glUniform3iv":_glUniform3iv,"_glUniform3uiv":_glUniform3uiv,"_glUniform4fv":_glUniform4fv,"_glUniform4iv":_glUniform4iv,"_glUniform4uiv":_glUniform4uiv,"_glUniformBlockBinding":_glUniformBlockBinding,"_glUniformMatrix3fv":_glUniformMatrix3fv,"_glUniformMatrix4fv":_glUniformMatrix4fv,"_glUnmapBuffer":_glUnmapBuffer,"_glUseProgram":_glUseProgram,"_glValidateProgram":_glValidateProgram,"_glVertexAttrib4f":_glVertexAttrib4f,"_glVertexAttrib4fv":_glVertexAttrib4fv,"_glVertexAttribIPointer":_glVertexAttribIPointer,"_glVertexAttribPointer":_glVertexAttribPointer,"_glViewport":_glViewport,"_gmtime":_gmtime,"_gmtime_r":_gmtime_r,"_inet_addr":_inet_addr,"_llvm_ceil_f32":_llvm_ceil_f32,"_llvm_ceil_f64":_llvm_ceil_f64,"_llvm_copysign_f64":_llvm_copysign_f64,"_llvm_cttz_i32":_llvm_cttz_i32,"_llvm_eh_typeid_for":_llvm_eh_typeid_for,"_llvm_exp2_f32":_llvm_exp2_f32,"_llvm_fabs_f32":_llvm_fabs_f32,"_llvm_fabs_f64":_llvm_fabs_f64,"_llvm_floor_f32":_llvm_floor_f32,"_llvm_floor_f64":_llvm_floor_f64,"_llvm_log10_f32":_llvm_log10_f32,"_llvm_log2_f32":_llvm_log2_f32,"_llvm_pow_f64":_llvm_pow_f64,"_llvm_trap":_llvm_trap,"_llvm_trunc_f32":_llvm_trunc_f32,"_localtime":_localtime,"_localtime_r":_localtime_r,"_longjmp":_longjmp,"_mktime":_mktime,"_nanosleep":_nanosleep,"_pthread_cond_destroy":_pthread_cond_destroy,"_pthread_cond_init":_pthread_cond_init,"_pthread_cond_timedwait":_pthread_cond_timedwait,"_pthread_cond_wait":_pthread_cond_wait,"_pthread_getspecific":_pthread_getspecific,"_pthread_key_create":_pthread_key_create,"_pthread_key_delete":_pthread_key_delete,"_pthread_mutex_destroy":_pthread_mutex_destroy,"_pthread_mutex_init":_pthread_mutex_init,"_pthread_mutexattr_destroy":_pthread_mutexattr_destroy,"_pthread_mutexattr_init":_pthread_mutexattr_init,"_pthread_mutexattr_setprotocol":_pthread_mutexattr_setprotocol,"_pthread_mutexattr_settype":_pthread_mutexattr_settype,"_pthread_once":_pthread_once,"_pthread_setspecific":_pthread_setspecific,"_sched_yield":_sched_yield,"_setenv":_setenv,"_sigaction":_sigaction,"_sigemptyset":_sigemptyset,"_strftime":_strftime,"_sysconf":_sysconf,"_time":_time,"_tzset":_tzset,"_unityMultiplayerStarted":_unityMultiplayerStarted,"_unityPresentationNextSlide":_unityPresentationNextSlide,"_unityPresentationPreviousSlide":_unityPresentationPreviousSlide,"_unityPresentationSendCursor":_unityPresentationSendCursor,"_unityScreenShareStarted":_unityScreenShareStarted,"_unityScreenShareWSConnected":_unityScreenShareWSConnected,"_unsetenv":_unsetenv,"_usleep":_usleep,"_utime":_utime,"clientWaitAsync":clientWaitAsync,"emscriptenWebGLComputeImageSize":emscriptenWebGLComputeImageSize,"emscriptenWebGLGet":emscriptenWebGLGet,"emscriptenWebGLGetBufferBinding":emscriptenWebGLGetBufferBinding,"emscriptenWebGLGetHeapForType":emscriptenWebGLGetHeapForType,"emscriptenWebGLGetIndexed":emscriptenWebGLGetIndexed,"emscriptenWebGLGetShiftForType":emscriptenWebGLGetShiftForType,"emscriptenWebGLGetTexPixelData":emscriptenWebGLGetTexPixelData,"emscriptenWebGLGetUniform":emscriptenWebGLGetUniform,"emscriptenWebGLGetVertexAttrib":emscriptenWebGLGetVertexAttrib,"emscriptenWebGLValidateMapBufferTarget":emscriptenWebGLValidateMapBufferTarget,"emscripten_get_canvas_element_size_js":emscripten_get_canvas_element_size_js,"emscripten_set_canvas_element_size_js":emscripten_set_canvas_element_size_js,"readPixelsAsync":readPixelsAsync,"uwcom_addManageObj":uwcom_addManageObj,"uwcom_arrayToReturnPtr":uwcom_arrayToReturnPtr,"uwcom_debugLog":uwcom_debugLog,"uwcom_errorNo":uwcom_errorNo,"uwcom_existsCheck":uwcom_existsCheck,"uwcom_fixStatEnumValue":uwcom_fixStatEnumValue,"uwcom_statsSerialize":uwcom_statsSerialize,"uwcom_strToPtr":uwcom_strToPtr,"DYNAMICTOP_PTR":DYNAMICTOP_PTR,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX};var asm=Module["asm"](Module.asmGlobalArg,Module.asmLibraryArg,buffer);Module["asm"]=asm;var _SendMessage=Module["_SendMessage"]=(function(){return Module["asm"]["_SendMessage"].apply(null,arguments)});var _SendMessageFloat=Module["_SendMessageFloat"]=(function(){return Module["asm"]["_SendMessageFloat"].apply(null,arguments)});var _SendMessageString=Module["_SendMessageString"]=(function(){return Module["asm"]["_SendMessageString"].apply(null,arguments)});var _SetFullscreen=Module["_SetFullscreen"]=(function(){return Module["asm"]["_SetFullscreen"].apply(null,arguments)});var __GLOBAL__sub_I_AIScriptingClasses_cpp=Module["__GLOBAL__sub_I_AIScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AIScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp=Module["__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp=Module["__GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AndroidJNIScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AnimationClip_cpp=Module["__GLOBAL__sub_I_AnimationClip_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AnimationClip_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AnimationScriptingClasses_cpp=Module["__GLOBAL__sub_I_AnimationScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AnimationScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AssetBundleFileSystem_cpp=Module["__GLOBAL__sub_I_AssetBundleFileSystem_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AssetBundleFileSystem_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp=Module["__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_AudioScriptingClasses_cpp=Module["__GLOBAL__sub_I_AudioScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_AudioScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_ClothScriptingClasses_cpp=Module["__GLOBAL__sub_I_ClothScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ClothScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_DirectorScriptingClasses_cpp=Module["__GLOBAL__sub_I_DirectorScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_DirectorScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp=Module["__GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_External_ProphecySDK_BlitOperations_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_External_Yoga_Yoga_0_cpp=Module["__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_External_il2cpp_builds_external_baselib_Platforms_WebGL_Source_0_cpp=Module["__GLOBAL__sub_I_External_il2cpp_builds_external_baselib_Platforms_WebGL_Source_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_External_il2cpp_builds_external_baselib_Platforms_WebGL_Source_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_GUITexture_cpp=Module["__GLOBAL__sub_I_GUITexture_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_GUITexture_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_GfxDeviceNull_cpp=Module["__GLOBAL__sub_I_GfxDeviceNull_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_GfxDeviceNull_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_GridScriptingClasses_cpp=Module["__GLOBAL__sub_I_GridScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_GridScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_IMGUIScriptingClasses_cpp=Module["__GLOBAL__sub_I_IMGUIScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_IMGUIScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_InputLegacyScriptingClasses_cpp=Module["__GLOBAL__sub_I_InputLegacyScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_InputLegacyScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_InputScriptingClasses_cpp=Module["__GLOBAL__sub_I_InputScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_InputScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_LogAssert_cpp=Module["__GLOBAL__sub_I_LogAssert_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_LogAssert_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_gc_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_gc_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_gc_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_icalls_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_icalls_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_icalls_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_metadata_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_mono_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_mono_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_mono_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_os_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_os_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_os_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_utils_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_utils_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_utils_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_vm_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_vm_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_vm_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Lump_libil2cpp_vm_utils_cpp=Module["__GLOBAL__sub_I_Lump_libil2cpp_vm_utils_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Lump_libil2cpp_vm_utils_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Mesh_cpp=Module["__GLOBAL__sub_I_Mesh_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Mesh_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Animation_0_cpp=Module["__GLOBAL__sub_I_Modules_Animation_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Animation_2_cpp=Module["__GLOBAL__sub_I_Modules_Animation_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Animation_7_cpp=Module["__GLOBAL__sub_I_Modules_Animation_7_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_7_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Animation_Constraints_0_cpp=Module["__GLOBAL__sub_I_Modules_Animation_Constraints_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Animation_Constraints_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_AssetBundle_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Audio_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_Audio_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Audio_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_Audio_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Audio_Public_3_cpp=Module["__GLOBAL__sub_I_Modules_Audio_Public_3_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_3_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_1_cpp=Module["__GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_ScriptBindings_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp=Module["__GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Audio_Public_sound_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Cloth_0_cpp=Module["__GLOBAL__sub_I_Modules_Cloth_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Cloth_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_DSPGraph_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Grid_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_Grid_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Grid_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_IMGUI_0_cpp=Module["__GLOBAL__sub_I_Modules_IMGUI_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_IMGUI_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_IMGUI_1_cpp=Module["__GLOBAL__sub_I_Modules_IMGUI_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_IMGUI_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Input_Private_0_cpp=Module["__GLOBAL__sub_I_Modules_Input_Private_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Input_Private_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_ParticleSystem_0_cpp=Module["__GLOBAL__sub_I_Modules_ParticleSystem_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_ParticleSystem_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Physics2D_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Physics_0_cpp=Module["__GLOBAL__sub_I_Modules_Physics_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Physics_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Physics_2_cpp=Module["__GLOBAL__sub_I_Modules_Physics_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Physics_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Profiler_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_Profiler_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Profiler_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Profiler_Runtime_1_cpp=Module["__GLOBAL__sub_I_Modules_Profiler_Runtime_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Profiler_Runtime_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Subsystems_0_cpp=Module["__GLOBAL__sub_I_Modules_Subsystems_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Subsystems_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Terrain_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Terrain_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Terrain_Public_2_cpp=Module["__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Terrain_Public_3_cpp=Module["__GLOBAL__sub_I_Modules_Terrain_Public_3_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_Public_3_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Terrain_VR_0_cpp=Module["__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp=Module["__GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_TextCore_Native_FontEngine_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Tilemap_0_cpp=Module["__GLOBAL__sub_I_Modules_Tilemap_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Tilemap_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_UI_0_cpp=Module["__GLOBAL__sub_I_Modules_UI_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_UI_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_UI_1_cpp=Module["__GLOBAL__sub_I_Modules_UI_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_UI_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_UI_2_cpp=Module["__GLOBAL__sub_I_Modules_UI_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_UI_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_VFX_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_VFX_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_VFX_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_VFX_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_VFX_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_VFX_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_VFX_Public_Systems_0_cpp=Module["__GLOBAL__sub_I_Modules_VFX_Public_Systems_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_VFX_Public_Systems_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_VR_0_cpp=Module["__GLOBAL__sub_I_Modules_VR_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_VR_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_VR_1_cpp=Module["__GLOBAL__sub_I_Modules_VR_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_VR_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Video_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_Video_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Video_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_Video_Public_Base_0_cpp=Module["__GLOBAL__sub_I_Modules_Video_Public_Base_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_Video_Public_Base_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Stats_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_Stats_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Stats_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Subsystems_Display_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_Subsystems_Display_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Subsystems_Display_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp=Module["__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Subsystems_Meshing_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_Subsystems_Meshing_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Subsystems_Meshing_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Modules_XR_Tracing_0_cpp=Module["__GLOBAL__sub_I_Modules_XR_Tracing_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Modules_XR_Tracing_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_NoiseModule_cpp=Module["__GLOBAL__sub_I_NoiseModule_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_NoiseModule_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_ParticleSystemGeometryJob_cpp=Module["__GLOBAL__sub_I_ParticleSystemGeometryJob_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ParticleSystemGeometryJob_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp=Module["__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Physics2DScriptingClasses_cpp=Module["__GLOBAL__sub_I_Physics2DScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Physics2DScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_PhysicsQuery_cpp=Module["__GLOBAL__sub_I_PhysicsQuery_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_PhysicsQuery_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_PhysicsScriptingClasses_cpp=Module["__GLOBAL__sub_I_PhysicsScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_PhysicsScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Source_0_cpp=Module["__GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Source_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_PlatformDependent_WebGL_External_baselib_builds_Source_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp=Module["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp=Module["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_PlatformDependent_WebGL_Source_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_PluginInterfaceVR_cpp=Module["__GLOBAL__sub_I_PluginInterfaceVR_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_PluginInterfaceVR_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_2D_Renderer_0_cpp=Module["__GLOBAL__sub_I_Runtime_2D_Renderer_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_2D_Renderer_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp=Module["__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp=Module["__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Allocator_2_cpp=Module["__GLOBAL__sub_I_Runtime_Allocator_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Allocator_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Application_0_cpp=Module["__GLOBAL__sub_I_Runtime_Application_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Application_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp=Module["__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp=Module["__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp=Module["__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp=Module["__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Burst_0_cpp=Module["__GLOBAL__sub_I_Runtime_Burst_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Burst_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_0_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_1_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_2_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_5_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_6_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_6_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_6_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_7_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_7_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_7_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_8_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_8_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_8_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp=Module["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Containers_0_cpp=Module["__GLOBAL__sub_I_Runtime_Containers_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Containers_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp=Module["__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Director_Core_1_cpp=Module["__GLOBAL__sub_I_Runtime_Director_Core_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Director_Core_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Export_Unsafe_0_cpp=Module["__GLOBAL__sub_I_Runtime_Export_Unsafe_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Export_Unsafe_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_File_0_cpp=Module["__GLOBAL__sub_I_Runtime_File_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_File_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Geometry_2_cpp=Module["__GLOBAL__sub_I_Runtime_Geometry_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Geometry_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp=Module["__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp=Module["__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp=Module["__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_GfxDevice_4_cpp=Module["__GLOBAL__sub_I_Runtime_GfxDevice_4_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_4_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_GfxDevice_5_cpp=Module["__GLOBAL__sub_I_Runtime_GfxDevice_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp=Module["__GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_opengles_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_0_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_10_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_10_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_10_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_11_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_11_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_11_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_12_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_12_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_12_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_1_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_2_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_4_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_4_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_4_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_5_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_6_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_6_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_6_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_8_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_8_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_8_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_9_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_9_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_9_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_CommandBuffer_0_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_CommandBuffer_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_CommandBuffer_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_4_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_Mesh_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp=Module["__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Input_0_cpp=Module["__GLOBAL__sub_I_Runtime_Input_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Input_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Interfaces_0_cpp=Module["__GLOBAL__sub_I_Runtime_Interfaces_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Interfaces_1_cpp=Module["__GLOBAL__sub_I_Runtime_Interfaces_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Interfaces_2_cpp=Module["__GLOBAL__sub_I_Runtime_Interfaces_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Jobs_0_cpp=Module["__GLOBAL__sub_I_Runtime_Jobs_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Jobs_1_cpp=Module["__GLOBAL__sub_I_Runtime_Jobs_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Jobs_Internal_1_cpp=Module["__GLOBAL__sub_I_Runtime_Jobs_Internal_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_Internal_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp=Module["__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Math_2_cpp=Module["__GLOBAL__sub_I_Runtime_Math_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Math_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Math_Random_0_cpp=Module["__GLOBAL__sub_I_Runtime_Math_Random_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Math_Random_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Misc_0_cpp=Module["__GLOBAL__sub_I_Runtime_Misc_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Misc_2_cpp=Module["__GLOBAL__sub_I_Runtime_Misc_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Misc_3_cpp=Module["__GLOBAL__sub_I_Runtime_Misc_3_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_3_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Misc_4_cpp=Module["__GLOBAL__sub_I_Runtime_Misc_4_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_4_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Misc_5_cpp=Module["__GLOBAL__sub_I_Runtime_Misc_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Modules_0_cpp=Module["__GLOBAL__sub_I_Runtime_Modules_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Modules_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Mono_0_cpp=Module["__GLOBAL__sub_I_Runtime_Mono_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Mono_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Mono_2_cpp=Module["__GLOBAL__sub_I_Runtime_Mono_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Mono_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp=Module["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp=Module["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp=Module["__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp=Module["__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Profiler_0_cpp=Module["__GLOBAL__sub_I_Runtime_Profiler_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Profiler_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Profiler_2_cpp=Module["__GLOBAL__sub_I_Runtime_Profiler_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Profiler_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Profiler_ExternalGPUProfiler_0_cpp=Module["__GLOBAL__sub_I_Runtime_Profiler_ExternalGPUProfiler_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Profiler_ExternalGPUProfiler_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Profiler_ScriptBindings_0_cpp=Module["__GLOBAL__sub_I_Runtime_Profiler_ScriptBindings_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Profiler_ScriptBindings_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_SceneManager_0_cpp=Module["__GLOBAL__sub_I_Runtime_SceneManager_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_SceneManager_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp=Module["__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Scripting_0_cpp=Module["__GLOBAL__sub_I_Runtime_Scripting_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Scripting_2_cpp=Module["__GLOBAL__sub_I_Runtime_Scripting_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Scripting_3_cpp=Module["__GLOBAL__sub_I_Runtime_Scripting_3_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_3_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp=Module["__GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_APIUpdating_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Serialize_1_cpp=Module["__GLOBAL__sub_I_Runtime_Serialize_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Serialize_2_cpp=Module["__GLOBAL__sub_I_Runtime_Serialize_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp=Module["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp=Module["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_0_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_1_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_2_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_4_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_4_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_4_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_5_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_GpuPrograms_0_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_GpuPrograms_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_GpuPrograms_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_2_cpp=Module["__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Transform_0_cpp=Module["__GLOBAL__sub_I_Runtime_Transform_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Transform_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Transform_1_cpp=Module["__GLOBAL__sub_I_Runtime_Transform_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Transform_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Utilities_2_cpp=Module["__GLOBAL__sub_I_Runtime_Utilities_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Utilities_5_cpp=Module["__GLOBAL__sub_I_Runtime_Utilities_5_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_5_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Utilities_6_cpp=Module["__GLOBAL__sub_I_Runtime_Utilities_6_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_6_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Utilities_7_cpp=Module["__GLOBAL__sub_I_Runtime_Utilities_7_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_7_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Utilities_9_cpp=Module["__GLOBAL__sub_I_Runtime_Utilities_9_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_9_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_Video_0_cpp=Module["__GLOBAL__sub_I_Runtime_Video_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_Video_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp=Module["__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Shader_cpp=Module["__GLOBAL__sub_I_Shader_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Shader_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Shadows_cpp=Module["__GLOBAL__sub_I_Shadows_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Shadows_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_ShapeModule_cpp=Module["__GLOBAL__sub_I_ShapeModule_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ShapeModule_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_SubsystemsScriptingClasses_cpp=Module["__GLOBAL__sub_I_SubsystemsScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_SubsystemsScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_SwInterCollision_cpp=Module["__GLOBAL__sub_I_SwInterCollision_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_SwInterCollision_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_SwSolverKernel_cpp=Module["__GLOBAL__sub_I_SwSolverKernel_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_SwSolverKernel_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_TemplateInstantiations_cpp=Module["__GLOBAL__sub_I_TemplateInstantiations_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_TemplateInstantiations_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_TerrainScriptingClasses_cpp=Module["__GLOBAL__sub_I_TerrainScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_TerrainScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_TextCoreScriptingClasses_cpp=Module["__GLOBAL__sub_I_TextCoreScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_TextCoreScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_TextRenderingScriptingClasses_cpp=Module["__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_TilemapScriptingClasses_cpp=Module["__GLOBAL__sub_I_TilemapScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_TilemapScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UIElementsNativeScriptingClasses_cpp=Module["__GLOBAL__sub_I_UIElementsNativeScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UIElementsNativeScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UIScriptingClasses_cpp=Module["__GLOBAL__sub_I_UIScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UIScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UVModule_cpp=Module["__GLOBAL__sub_I_UVModule_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UVModule_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UnityAdsSettings_cpp=Module["__GLOBAL__sub_I_UnityAdsSettings_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UnityAdsSettings_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp=Module["__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp=Module["__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_VFXScriptingClasses_cpp=Module["__GLOBAL__sub_I_VFXScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_VFXScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_VRScriptingClasses_cpp=Module["__GLOBAL__sub_I_VRScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_VRScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_VideoScriptingClasses_cpp=Module["__GLOBAL__sub_I_VideoScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_VideoScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_VideoYUV420Convert_cpp=Module["__GLOBAL__sub_I_VideoYUV420Convert_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_VideoYUV420Convert_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_VisualEffectAsset_cpp=Module["__GLOBAL__sub_I_VisualEffectAsset_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_VisualEffectAsset_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Wind_cpp=Module["__GLOBAL__sub_I_Wind_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Wind_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_XRAudio_cpp=Module["__GLOBAL__sub_I_XRAudio_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_XRAudio_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_XRPreInit_cpp=Module["__GLOBAL__sub_I_XRPreInit_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_XRPreInit_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_XRScriptingClasses_cpp=Module["__GLOBAL__sub_I_XRScriptingClasses_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_XRScriptingClasses_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_XRWindowsLocatableCamera_cpp=Module["__GLOBAL__sub_I_XRWindowsLocatableCamera_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_XRWindowsLocatableCamera_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp=Module["__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_nvcloth_src_0_cpp=Module["__GLOBAL__sub_I_nvcloth_src_0_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_nvcloth_src_0_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_nvcloth_src_1_cpp=Module["__GLOBAL__sub_I_nvcloth_src_1_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_nvcloth_src_1_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_physx_source_physxextensions_src_2_cpp=Module["__GLOBAL__sub_I_physx_source_physxextensions_src_2_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_physx_source_physxextensions_src_2_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_umbra_cpp=Module["__GLOBAL__sub_I_umbra_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_umbra_cpp"].apply(null,arguments)});var ___cxa_can_catch=Module["___cxa_can_catch"]=(function(){return Module["asm"]["___cxa_can_catch"].apply(null,arguments)});var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=(function(){return Module["asm"]["___cxa_is_pointer_type"].apply(null,arguments)});var ___cxx_global_var_init_104_1218=Module["___cxx_global_var_init_104_1218"]=(function(){return Module["asm"]["___cxx_global_var_init_104_1218"].apply(null,arguments)});var ___cxx_global_var_init_131_1219=Module["___cxx_global_var_init_131_1219"]=(function(){return Module["asm"]["___cxx_global_var_init_131_1219"].apply(null,arguments)});var ___cxx_global_var_init_18_10258=Module["___cxx_global_var_init_18_10258"]=(function(){return Module["asm"]["___cxx_global_var_init_18_10258"].apply(null,arguments)});var ___cxx_global_var_init_18_1119=Module["___cxx_global_var_init_18_1119"]=(function(){return Module["asm"]["___cxx_global_var_init_18_1119"].apply(null,arguments)});var ___cxx_global_var_init_192=Module["___cxx_global_var_init_192"]=(function(){return Module["asm"]["___cxx_global_var_init_192"].apply(null,arguments)});var ___cxx_global_var_init_19_10259=Module["___cxx_global_var_init_19_10259"]=(function(){return Module["asm"]["___cxx_global_var_init_19_10259"].apply(null,arguments)});var ___cxx_global_var_init_20_10260=Module["___cxx_global_var_init_20_10260"]=(function(){return Module["asm"]["___cxx_global_var_init_20_10260"].apply(null,arguments)});var ___cxx_global_var_init_23_16=Module["___cxx_global_var_init_23_16"]=(function(){return Module["asm"]["___cxx_global_var_init_23_16"].apply(null,arguments)});var ___cxx_global_var_init_3915=Module["___cxx_global_var_init_3915"]=(function(){return Module["asm"]["___cxx_global_var_init_3915"].apply(null,arguments)});var ___cxx_global_var_init_61=Module["___cxx_global_var_init_61"]=(function(){return Module["asm"]["___cxx_global_var_init_61"].apply(null,arguments)});var ___cxx_global_var_init_89_7069=Module["___cxx_global_var_init_89_7069"]=(function(){return Module["asm"]["___cxx_global_var_init_89_7069"].apply(null,arguments)});var ___cxx_global_var_init_9469=Module["___cxx_global_var_init_9469"]=(function(){return Module["asm"]["___cxx_global_var_init_9469"].apply(null,arguments)});var ___cxx_global_var_init_9905=Module["___cxx_global_var_init_9905"]=(function(){return Module["asm"]["___cxx_global_var_init_9905"].apply(null,arguments)});var ___cxx_global_var_init_9_9268=Module["___cxx_global_var_init_9_9268"]=(function(){return Module["asm"]["___cxx_global_var_init_9_9268"].apply(null,arguments)});var ___emscripten_environ_constructor=Module["___emscripten_environ_constructor"]=(function(){return Module["asm"]["___emscripten_environ_constructor"].apply(null,arguments)});var ___errno_location=Module["___errno_location"]=(function(){return Module["asm"]["___errno_location"].apply(null,arguments)});var __get_daylight=Module["__get_daylight"]=(function(){return Module["asm"]["__get_daylight"].apply(null,arguments)});var __get_environ=Module["__get_environ"]=(function(){return Module["asm"]["__get_environ"].apply(null,arguments)});var __get_timezone=Module["__get_timezone"]=(function(){return Module["asm"]["__get_timezone"].apply(null,arguments)});var __get_tzname=Module["__get_tzname"]=(function(){return Module["asm"]["__get_tzname"].apply(null,arguments)});var _emscripten_replace_memory=Module["_emscripten_replace_memory"]=(function(){return Module["asm"]["_emscripten_replace_memory"].apply(null,arguments)});var _free=Module["_free"]=(function(){return Module["asm"]["_free"].apply(null,arguments)});var _htonl=Module["_htonl"]=(function(){return Module["asm"]["_htonl"].apply(null,arguments)});var _htons=Module["_htons"]=(function(){return Module["asm"]["_htons"].apply(null,arguments)});var _i64Add=Module["_i64Add"]=(function(){return Module["asm"]["_i64Add"].apply(null,arguments)});var _llvm_bswap_i16=Module["_llvm_bswap_i16"]=(function(){return Module["asm"]["_llvm_bswap_i16"].apply(null,arguments)});var _llvm_bswap_i32=Module["_llvm_bswap_i32"]=(function(){return Module["asm"]["_llvm_bswap_i32"].apply(null,arguments)});var _llvm_ctlz_i64=Module["_llvm_ctlz_i64"]=(function(){return Module["asm"]["_llvm_ctlz_i64"].apply(null,arguments)});var _llvm_ctpop_i32=Module["_llvm_ctpop_i32"]=(function(){return Module["asm"]["_llvm_ctpop_i32"].apply(null,arguments)});var _llvm_maxnum_f32=Module["_llvm_maxnum_f32"]=(function(){return Module["asm"]["_llvm_maxnum_f32"].apply(null,arguments)});var _llvm_maxnum_f64=Module["_llvm_maxnum_f64"]=(function(){return Module["asm"]["_llvm_maxnum_f64"].apply(null,arguments)});var _llvm_minnum_f32=Module["_llvm_minnum_f32"]=(function(){return Module["asm"]["_llvm_minnum_f32"].apply(null,arguments)});var _llvm_round_f32=Module["_llvm_round_f32"]=(function(){return Module["asm"]["_llvm_round_f32"].apply(null,arguments)});var _main=Module["_main"]=(function(){return Module["asm"]["_main"].apply(null,arguments)});var _malloc=Module["_malloc"]=(function(){return Module["asm"]["_malloc"].apply(null,arguments)});var _memalign=Module["_memalign"]=(function(){return Module["asm"]["_memalign"].apply(null,arguments)});var _memcpy=Module["_memcpy"]=(function(){return Module["asm"]["_memcpy"].apply(null,arguments)});var _memmove=Module["_memmove"]=(function(){return Module["asm"]["_memmove"].apply(null,arguments)});var _memset=Module["_memset"]=(function(){return Module["asm"]["_memset"].apply(null,arguments)});var _ntohs=Module["_ntohs"]=(function(){return Module["asm"]["_ntohs"].apply(null,arguments)});var _pthread_cond_broadcast=Module["_pthread_cond_broadcast"]=(function(){return Module["asm"]["_pthread_cond_broadcast"].apply(null,arguments)});var _pthread_mutex_lock=Module["_pthread_mutex_lock"]=(function(){return Module["asm"]["_pthread_mutex_lock"].apply(null,arguments)});var _pthread_mutex_unlock=Module["_pthread_mutex_unlock"]=(function(){return Module["asm"]["_pthread_mutex_unlock"].apply(null,arguments)});var _realloc=Module["_realloc"]=(function(){return Module["asm"]["_realloc"].apply(null,arguments)});var _saveSetjmp=Module["_saveSetjmp"]=(function(){return Module["asm"]["_saveSetjmp"].apply(null,arguments)});var _sbrk=Module["_sbrk"]=(function(){return Module["asm"]["_sbrk"].apply(null,arguments)});var _strlen=Module["_strlen"]=(function(){return Module["asm"]["_strlen"].apply(null,arguments)});var _testSetjmp=Module["_testSetjmp"]=(function(){return Module["asm"]["_testSetjmp"].apply(null,arguments)});var establishStackSpace=Module["establishStackSpace"]=(function(){return Module["asm"]["establishStackSpace"].apply(null,arguments)});var getTempRet0=Module["getTempRet0"]=(function(){return Module["asm"]["getTempRet0"].apply(null,arguments)});var runPostSets=Module["runPostSets"]=(function(){return Module["asm"]["runPostSets"].apply(null,arguments)});var setTempRet0=Module["setTempRet0"]=(function(){return Module["asm"]["setTempRet0"].apply(null,arguments)});var setThrew=Module["setThrew"]=(function(){return Module["asm"]["setThrew"].apply(null,arguments)});var stackAlloc=Module["stackAlloc"]=(function(){return Module["asm"]["stackAlloc"].apply(null,arguments)});var stackRestore=Module["stackRestore"]=(function(){return Module["asm"]["stackRestore"].apply(null,arguments)});var stackSave=Module["stackSave"]=(function(){return Module["asm"]["stackSave"].apply(null,arguments)});var dynCall_d=Module["dynCall_d"]=(function(){return Module["asm"]["dynCall_d"].apply(null,arguments)});var dynCall_dddi=Module["dynCall_dddi"]=(function(){return Module["asm"]["dynCall_dddi"].apply(null,arguments)});var dynCall_ddi=Module["dynCall_ddi"]=(function(){return Module["asm"]["dynCall_ddi"].apply(null,arguments)});var dynCall_dfi=Module["dynCall_dfi"]=(function(){return Module["asm"]["dynCall_dfi"].apply(null,arguments)});var dynCall_di=Module["dynCall_di"]=(function(){return Module["asm"]["dynCall_di"].apply(null,arguments)});var dynCall_did=Module["dynCall_did"]=(function(){return Module["asm"]["dynCall_did"].apply(null,arguments)});var dynCall_didd=Module["dynCall_didd"]=(function(){return Module["asm"]["dynCall_didd"].apply(null,arguments)});var dynCall_diddi=Module["dynCall_diddi"]=(function(){return Module["asm"]["dynCall_diddi"].apply(null,arguments)});var dynCall_didi=Module["dynCall_didi"]=(function(){return Module["asm"]["dynCall_didi"].apply(null,arguments)});var dynCall_didii=Module["dynCall_didii"]=(function(){return Module["asm"]["dynCall_didii"].apply(null,arguments)});var dynCall_dii=Module["dynCall_dii"]=(function(){return Module["asm"]["dynCall_dii"].apply(null,arguments)});var dynCall_diidi=Module["dynCall_diidi"]=(function(){return Module["asm"]["dynCall_diidi"].apply(null,arguments)});var dynCall_diii=Module["dynCall_diii"]=(function(){return Module["asm"]["dynCall_diii"].apply(null,arguments)});var dynCall_diiii=Module["dynCall_diiii"]=(function(){return Module["asm"]["dynCall_diiii"].apply(null,arguments)});var dynCall_diij=Module["dynCall_diij"]=(function(){return Module["asm"]["dynCall_diij"].apply(null,arguments)});var dynCall_diiji=Module["dynCall_diiji"]=(function(){return Module["asm"]["dynCall_diiji"].apply(null,arguments)});var dynCall_diji=Module["dynCall_diji"]=(function(){return Module["asm"]["dynCall_diji"].apply(null,arguments)});var dynCall_dji=Module["dynCall_dji"]=(function(){return Module["asm"]["dynCall_dji"].apply(null,arguments)});var dynCall_f=Module["dynCall_f"]=(function(){return Module["asm"]["dynCall_f"].apply(null,arguments)});var dynCall_fdi=Module["dynCall_fdi"]=(function(){return Module["asm"]["dynCall_fdi"].apply(null,arguments)});var dynCall_ff=Module["dynCall_ff"]=(function(){return Module["asm"]["dynCall_ff"].apply(null,arguments)});var dynCall_fff=Module["dynCall_fff"]=(function(){return Module["asm"]["dynCall_fff"].apply(null,arguments)});var dynCall_fffffi=Module["dynCall_fffffi"]=(function(){return Module["asm"]["dynCall_fffffi"].apply(null,arguments)});var dynCall_ffffi=Module["dynCall_ffffi"]=(function(){return Module["asm"]["dynCall_ffffi"].apply(null,arguments)});var dynCall_fffi=Module["dynCall_fffi"]=(function(){return Module["asm"]["dynCall_fffi"].apply(null,arguments)});var dynCall_fffifffi=Module["dynCall_fffifffi"]=(function(){return Module["asm"]["dynCall_fffifffi"].apply(null,arguments)});var dynCall_ffi=Module["dynCall_ffi"]=(function(){return Module["asm"]["dynCall_ffi"].apply(null,arguments)});var dynCall_fi=Module["dynCall_fi"]=(function(){return Module["asm"]["dynCall_fi"].apply(null,arguments)});var dynCall_fidi=Module["dynCall_fidi"]=(function(){return Module["asm"]["dynCall_fidi"].apply(null,arguments)});var dynCall_fif=Module["dynCall_fif"]=(function(){return Module["asm"]["dynCall_fif"].apply(null,arguments)});var dynCall_fiff=Module["dynCall_fiff"]=(function(){return Module["asm"]["dynCall_fiff"].apply(null,arguments)});var dynCall_fiffi=Module["dynCall_fiffi"]=(function(){return Module["asm"]["dynCall_fiffi"].apply(null,arguments)});var dynCall_fifi=Module["dynCall_fifi"]=(function(){return Module["asm"]["dynCall_fifi"].apply(null,arguments)});var dynCall_fifii=Module["dynCall_fifii"]=(function(){return Module["asm"]["dynCall_fifii"].apply(null,arguments)});var dynCall_fii=Module["dynCall_fii"]=(function(){return Module["asm"]["dynCall_fii"].apply(null,arguments)});var dynCall_fiid=Module["dynCall_fiid"]=(function(){return Module["asm"]["dynCall_fiid"].apply(null,arguments)});var dynCall_fiifi=Module["dynCall_fiifi"]=(function(){return Module["asm"]["dynCall_fiifi"].apply(null,arguments)});var dynCall_fiifii=Module["dynCall_fiifii"]=(function(){return Module["asm"]["dynCall_fiifii"].apply(null,arguments)});var dynCall_fiii=Module["dynCall_fiii"]=(function(){return Module["asm"]["dynCall_fiii"].apply(null,arguments)});var dynCall_fiiii=Module["dynCall_fiiii"]=(function(){return Module["asm"]["dynCall_fiiii"].apply(null,arguments)});var dynCall_fiiiif=Module["dynCall_fiiiif"]=(function(){return Module["asm"]["dynCall_fiiiif"].apply(null,arguments)});var dynCall_fiiiii=Module["dynCall_fiiiii"]=(function(){return Module["asm"]["dynCall_fiiiii"].apply(null,arguments)});var dynCall_fiiiiii=Module["dynCall_fiiiiii"]=(function(){return Module["asm"]["dynCall_fiiiiii"].apply(null,arguments)});var dynCall_fiiiiiifiifif=Module["dynCall_fiiiiiifiifif"]=(function(){return Module["asm"]["dynCall_fiiiiiifiifif"].apply(null,arguments)});var dynCall_fiiiiiifiiiif=Module["dynCall_fiiiiiifiiiif"]=(function(){return Module["asm"]["dynCall_fiiiiiifiiiif"].apply(null,arguments)});var dynCall_fiiiiiii=Module["dynCall_fiiiiiii"]=(function(){return Module["asm"]["dynCall_fiiiiiii"].apply(null,arguments)});var dynCall_fji=Module["dynCall_fji"]=(function(){return Module["asm"]["dynCall_fji"].apply(null,arguments)});var dynCall_i=Module["dynCall_i"]=(function(){return Module["asm"]["dynCall_i"].apply(null,arguments)});var dynCall_iddi=Module["dynCall_iddi"]=(function(){return Module["asm"]["dynCall_iddi"].apply(null,arguments)});var dynCall_idi=Module["dynCall_idi"]=(function(){return Module["asm"]["dynCall_idi"].apply(null,arguments)});var dynCall_idii=Module["dynCall_idii"]=(function(){return Module["asm"]["dynCall_idii"].apply(null,arguments)});var dynCall_idiii=Module["dynCall_idiii"]=(function(){return Module["asm"]["dynCall_idiii"].apply(null,arguments)});var dynCall_idiiii=Module["dynCall_idiiii"]=(function(){return Module["asm"]["dynCall_idiiii"].apply(null,arguments)});var dynCall_idiiiii=Module["dynCall_idiiiii"]=(function(){return Module["asm"]["dynCall_idiiiii"].apply(null,arguments)});var dynCall_ifffi=Module["dynCall_ifffi"]=(function(){return Module["asm"]["dynCall_ifffi"].apply(null,arguments)});var dynCall_iffi=Module["dynCall_iffi"]=(function(){return Module["asm"]["dynCall_iffi"].apply(null,arguments)});var dynCall_ifi=Module["dynCall_ifi"]=(function(){return Module["asm"]["dynCall_ifi"].apply(null,arguments)});var dynCall_ifiii=Module["dynCall_ifiii"]=(function(){return Module["asm"]["dynCall_ifiii"].apply(null,arguments)});var dynCall_ifiiii=Module["dynCall_ifiiii"]=(function(){return Module["asm"]["dynCall_ifiiii"].apply(null,arguments)});var dynCall_ii=Module["dynCall_ii"]=(function(){return Module["asm"]["dynCall_ii"].apply(null,arguments)});var dynCall_iiddi=Module["dynCall_iiddi"]=(function(){return Module["asm"]["dynCall_iiddi"].apply(null,arguments)});var dynCall_iiddiii=Module["dynCall_iiddiii"]=(function(){return Module["asm"]["dynCall_iiddiii"].apply(null,arguments)});var dynCall_iidi=Module["dynCall_iidi"]=(function(){return Module["asm"]["dynCall_iidi"].apply(null,arguments)});var dynCall_iidii=Module["dynCall_iidii"]=(function(){return Module["asm"]["dynCall_iidii"].apply(null,arguments)});var dynCall_iidiii=Module["dynCall_iidiii"]=(function(){return Module["asm"]["dynCall_iidiii"].apply(null,arguments)});var dynCall_iif=Module["dynCall_iif"]=(function(){return Module["asm"]["dynCall_iif"].apply(null,arguments)});var dynCall_iifff=Module["dynCall_iifff"]=(function(){return Module["asm"]["dynCall_iifff"].apply(null,arguments)});var dynCall_iifffi=Module["dynCall_iifffi"]=(function(){return Module["asm"]["dynCall_iifffi"].apply(null,arguments)});var dynCall_iiffi=Module["dynCall_iiffi"]=(function(){return Module["asm"]["dynCall_iiffi"].apply(null,arguments)});var dynCall_iiffiii=Module["dynCall_iiffiii"]=(function(){return Module["asm"]["dynCall_iiffiii"].apply(null,arguments)});var dynCall_iifi=Module["dynCall_iifi"]=(function(){return Module["asm"]["dynCall_iifi"].apply(null,arguments)});var dynCall_iifii=Module["dynCall_iifii"]=(function(){return Module["asm"]["dynCall_iifii"].apply(null,arguments)});var dynCall_iifiii=Module["dynCall_iifiii"]=(function(){return Module["asm"]["dynCall_iifiii"].apply(null,arguments)});var dynCall_iifiiiijii=Module["dynCall_iifiiiijii"]=(function(){return Module["asm"]["dynCall_iifiiiijii"].apply(null,arguments)});var dynCall_iii=Module["dynCall_iii"]=(function(){return Module["asm"]["dynCall_iii"].apply(null,arguments)});var dynCall_iiid=Module["dynCall_iiid"]=(function(){return Module["asm"]["dynCall_iiid"].apply(null,arguments)});var dynCall_iiidd=Module["dynCall_iiidd"]=(function(){return Module["asm"]["dynCall_iiidd"].apply(null,arguments)});var dynCall_iiidi=Module["dynCall_iiidi"]=(function(){return Module["asm"]["dynCall_iiidi"].apply(null,arguments)});var dynCall_iiidii=Module["dynCall_iiidii"]=(function(){return Module["asm"]["dynCall_iiidii"].apply(null,arguments)});var dynCall_iiidiii=Module["dynCall_iiidiii"]=(function(){return Module["asm"]["dynCall_iiidiii"].apply(null,arguments)});var dynCall_iiidiiii=Module["dynCall_iiidiiii"]=(function(){return Module["asm"]["dynCall_iiidiiii"].apply(null,arguments)});var dynCall_iiidijiii=Module["dynCall_iiidijiii"]=(function(){return Module["asm"]["dynCall_iiidijiii"].apply(null,arguments)});var dynCall_iiidjiiii=Module["dynCall_iiidjiiii"]=(function(){return Module["asm"]["dynCall_iiidjiiii"].apply(null,arguments)});var dynCall_iiif=Module["dynCall_iiif"]=(function(){return Module["asm"]["dynCall_iiif"].apply(null,arguments)});var dynCall_iiiff=Module["dynCall_iiiff"]=(function(){return Module["asm"]["dynCall_iiiff"].apply(null,arguments)});var dynCall_iiifff=Module["dynCall_iiifff"]=(function(){return Module["asm"]["dynCall_iiifff"].apply(null,arguments)});var dynCall_iiiffffffffiii=Module["dynCall_iiiffffffffiii"]=(function(){return Module["asm"]["dynCall_iiiffffffffiii"].apply(null,arguments)});var dynCall_iiifi=Module["dynCall_iiifi"]=(function(){return Module["asm"]["dynCall_iiifi"].apply(null,arguments)});var dynCall_iiifii=Module["dynCall_iiifii"]=(function(){return Module["asm"]["dynCall_iiifii"].apply(null,arguments)});var dynCall_iiifiii=Module["dynCall_iiifiii"]=(function(){return Module["asm"]["dynCall_iiifiii"].apply(null,arguments)});var dynCall_iiifiiii=Module["dynCall_iiifiiii"]=(function(){return Module["asm"]["dynCall_iiifiiii"].apply(null,arguments)});var dynCall_iiii=Module["dynCall_iiii"]=(function(){return Module["asm"]["dynCall_iiii"].apply(null,arguments)});var dynCall_iiiid=Module["dynCall_iiiid"]=(function(){return Module["asm"]["dynCall_iiiid"].apply(null,arguments)});var dynCall_iiiidd=Module["dynCall_iiiidd"]=(function(){return Module["asm"]["dynCall_iiiidd"].apply(null,arguments)});var dynCall_iiiidi=Module["dynCall_iiiidi"]=(function(){return Module["asm"]["dynCall_iiiidi"].apply(null,arguments)});var dynCall_iiiidii=Module["dynCall_iiiidii"]=(function(){return Module["asm"]["dynCall_iiiidii"].apply(null,arguments)});var dynCall_iiiif=Module["dynCall_iiiif"]=(function(){return Module["asm"]["dynCall_iiiif"].apply(null,arguments)});var dynCall_iiiiff=Module["dynCall_iiiiff"]=(function(){return Module["asm"]["dynCall_iiiiff"].apply(null,arguments)});var dynCall_iiiifffffi=Module["dynCall_iiiifffffi"]=(function(){return Module["asm"]["dynCall_iiiifffffi"].apply(null,arguments)});var dynCall_iiiifffffii=Module["dynCall_iiiifffffii"]=(function(){return Module["asm"]["dynCall_iiiifffffii"].apply(null,arguments)});var dynCall_iiiifffiii=Module["dynCall_iiiifffiii"]=(function(){return Module["asm"]["dynCall_iiiifffiii"].apply(null,arguments)});var dynCall_iiiifi=Module["dynCall_iiiifi"]=(function(){return Module["asm"]["dynCall_iiiifi"].apply(null,arguments)});var dynCall_iiiifii=Module["dynCall_iiiifii"]=(function(){return Module["asm"]["dynCall_iiiifii"].apply(null,arguments)});var dynCall_iiiifiii=Module["dynCall_iiiifiii"]=(function(){return Module["asm"]["dynCall_iiiifiii"].apply(null,arguments)});var dynCall_iiiifiiii=Module["dynCall_iiiifiiii"]=(function(){return Module["asm"]["dynCall_iiiifiiii"].apply(null,arguments)});var dynCall_iiiifiiiii=Module["dynCall_iiiifiiiii"]=(function(){return Module["asm"]["dynCall_iiiifiiiii"].apply(null,arguments)});var dynCall_iiiii=Module["dynCall_iiiii"]=(function(){return Module["asm"]["dynCall_iiiii"].apply(null,arguments)});var dynCall_iiiiidi=Module["dynCall_iiiiidi"]=(function(){return Module["asm"]["dynCall_iiiiidi"].apply(null,arguments)});var dynCall_iiiiiff=Module["dynCall_iiiiiff"]=(function(){return Module["asm"]["dynCall_iiiiiff"].apply(null,arguments)});var dynCall_iiiiifi=Module["dynCall_iiiiifi"]=(function(){return Module["asm"]["dynCall_iiiiifi"].apply(null,arguments)});var dynCall_iiiiifiii=Module["dynCall_iiiiifiii"]=(function(){return Module["asm"]["dynCall_iiiiifiii"].apply(null,arguments)});var dynCall_iiiiifiiiiif=Module["dynCall_iiiiifiiiiif"]=(function(){return Module["asm"]["dynCall_iiiiifiiiiif"].apply(null,arguments)});var dynCall_iiiiii=Module["dynCall_iiiiii"]=(function(){return Module["asm"]["dynCall_iiiiii"].apply(null,arguments)});var dynCall_iiiiiifff=Module["dynCall_iiiiiifff"]=(function(){return Module["asm"]["dynCall_iiiiiifff"].apply(null,arguments)});var dynCall_iiiiiifffiiifiii=Module["dynCall_iiiiiifffiiifiii"]=(function(){return Module["asm"]["dynCall_iiiiiifffiiifiii"].apply(null,arguments)});var dynCall_iiiiiiffiiiiiiiiiffffiii=Module["dynCall_iiiiiiffiiiiiiiiiffffiii"]=(function(){return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiffffiii"].apply(null,arguments)});var dynCall_iiiiiiffiiiiiiiiiffffiiii=Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiffffiiii"].apply(null,arguments)});var dynCall_iiiiiiffiiiiiiiiiiiiiii=Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiifi=Module["dynCall_iiiiiifi"]=(function(){return Module["asm"]["dynCall_iiiiiifi"].apply(null,arguments)});var dynCall_iiiiiifiif=Module["dynCall_iiiiiifiif"]=(function(){return Module["asm"]["dynCall_iiiiiifiif"].apply(null,arguments)});var dynCall_iiiiiifiii=Module["dynCall_iiiiiifiii"]=(function(){return Module["asm"]["dynCall_iiiiiifiii"].apply(null,arguments)});var dynCall_iiiiiii=Module["dynCall_iiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiii"].apply(null,arguments)});var dynCall_iiiiiiidii=Module["dynCall_iiiiiiidii"]=(function(){return Module["asm"]["dynCall_iiiiiiidii"].apply(null,arguments)});var dynCall_iiiiiiifiif=Module["dynCall_iiiiiiifiif"]=(function(){return Module["asm"]["dynCall_iiiiiiifiif"].apply(null,arguments)});var dynCall_iiiiiiii=Module["dynCall_iiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiii=Module["dynCall_iiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiii=Module["dynCall_iiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiii=Module["dynCall_iiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiii=Module["dynCall_iiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiij=Module["dynCall_iiiiiij"]=(function(){return Module["asm"]["dynCall_iiiiiij"].apply(null,arguments)});var dynCall_iiiiiijji=Module["dynCall_iiiiiijji"]=(function(){return Module["asm"]["dynCall_iiiiiijji"].apply(null,arguments)});var dynCall_iiiiij=Module["dynCall_iiiiij"]=(function(){return Module["asm"]["dynCall_iiiiij"].apply(null,arguments)});var dynCall_iiiiiji=Module["dynCall_iiiiiji"]=(function(){return Module["asm"]["dynCall_iiiiiji"].apply(null,arguments)});var dynCall_iiiiijji=Module["dynCall_iiiiijji"]=(function(){return Module["asm"]["dynCall_iiiiijji"].apply(null,arguments)});var dynCall_iiiij=Module["dynCall_iiiij"]=(function(){return Module["asm"]["dynCall_iiiij"].apply(null,arguments)});var dynCall_iiiiji=Module["dynCall_iiiiji"]=(function(){return Module["asm"]["dynCall_iiiiji"].apply(null,arguments)});var dynCall_iiiijii=Module["dynCall_iiiijii"]=(function(){return Module["asm"]["dynCall_iiiijii"].apply(null,arguments)});var dynCall_iiiijiii=Module["dynCall_iiiijiii"]=(function(){return Module["asm"]["dynCall_iiiijiii"].apply(null,arguments)});var dynCall_iiiijj=Module["dynCall_iiiijj"]=(function(){return Module["asm"]["dynCall_iiiijj"].apply(null,arguments)});var dynCall_iiiijjii=Module["dynCall_iiiijjii"]=(function(){return Module["asm"]["dynCall_iiiijjii"].apply(null,arguments)});var dynCall_iiiijjiiii=Module["dynCall_iiiijjiiii"]=(function(){return Module["asm"]["dynCall_iiiijjiiii"].apply(null,arguments)});var dynCall_iiij=Module["dynCall_iiij"]=(function(){return Module["asm"]["dynCall_iiij"].apply(null,arguments)});var dynCall_iiiji=Module["dynCall_iiiji"]=(function(){return Module["asm"]["dynCall_iiiji"].apply(null,arguments)});var dynCall_iiijii=Module["dynCall_iiijii"]=(function(){return Module["asm"]["dynCall_iiijii"].apply(null,arguments)});var dynCall_iiijiii=Module["dynCall_iiijiii"]=(function(){return Module["asm"]["dynCall_iiijiii"].apply(null,arguments)});var dynCall_iiijj=Module["dynCall_iiijj"]=(function(){return Module["asm"]["dynCall_iiijj"].apply(null,arguments)});var dynCall_iiijji=Module["dynCall_iiijji"]=(function(){return Module["asm"]["dynCall_iiijji"].apply(null,arguments)});var dynCall_iiijjii=Module["dynCall_iiijjii"]=(function(){return Module["asm"]["dynCall_iiijjii"].apply(null,arguments)});var dynCall_iiijjiiii=Module["dynCall_iiijjiiii"]=(function(){return Module["asm"]["dynCall_iiijjiiii"].apply(null,arguments)});var dynCall_iij=Module["dynCall_iij"]=(function(){return Module["asm"]["dynCall_iij"].apply(null,arguments)});var dynCall_iiji=Module["dynCall_iiji"]=(function(){return Module["asm"]["dynCall_iiji"].apply(null,arguments)});var dynCall_iijii=Module["dynCall_iijii"]=(function(){return Module["asm"]["dynCall_iijii"].apply(null,arguments)});var dynCall_iijiii=Module["dynCall_iijiii"]=(function(){return Module["asm"]["dynCall_iijiii"].apply(null,arguments)});var dynCall_iijji=Module["dynCall_iijji"]=(function(){return Module["asm"]["dynCall_iijji"].apply(null,arguments)});var dynCall_iijjii=Module["dynCall_iijjii"]=(function(){return Module["asm"]["dynCall_iijjii"].apply(null,arguments)});var dynCall_iijjiii=Module["dynCall_iijjiii"]=(function(){return Module["asm"]["dynCall_iijjiii"].apply(null,arguments)});var dynCall_iijjj=Module["dynCall_iijjj"]=(function(){return Module["asm"]["dynCall_iijjj"].apply(null,arguments)});var dynCall_iijjji=Module["dynCall_iijjji"]=(function(){return Module["asm"]["dynCall_iijjji"].apply(null,arguments)});var dynCall_ij=Module["dynCall_ij"]=(function(){return Module["asm"]["dynCall_ij"].apply(null,arguments)});var dynCall_iji=Module["dynCall_iji"]=(function(){return Module["asm"]["dynCall_iji"].apply(null,arguments)});var dynCall_ijii=Module["dynCall_ijii"]=(function(){return Module["asm"]["dynCall_ijii"].apply(null,arguments)});var dynCall_ijiii=Module["dynCall_ijiii"]=(function(){return Module["asm"]["dynCall_ijiii"].apply(null,arguments)});var dynCall_ijiiii=Module["dynCall_ijiiii"]=(function(){return Module["asm"]["dynCall_ijiiii"].apply(null,arguments)});var dynCall_ijj=Module["dynCall_ijj"]=(function(){return Module["asm"]["dynCall_ijj"].apply(null,arguments)});var dynCall_ijji=Module["dynCall_ijji"]=(function(){return Module["asm"]["dynCall_ijji"].apply(null,arguments)});var dynCall_ijjjf=Module["dynCall_ijjjf"]=(function(){return Module["asm"]["dynCall_ijjjf"].apply(null,arguments)});var dynCall_ijjjfi=Module["dynCall_ijjjfi"]=(function(){return Module["asm"]["dynCall_ijjjfi"].apply(null,arguments)});var dynCall_ijjji=Module["dynCall_ijjji"]=(function(){return Module["asm"]["dynCall_ijjji"].apply(null,arguments)});var dynCall_ijjjii=Module["dynCall_ijjjii"]=(function(){return Module["asm"]["dynCall_ijjjii"].apply(null,arguments)});var dynCall_ijjjji=Module["dynCall_ijjjji"]=(function(){return Module["asm"]["dynCall_ijjjji"].apply(null,arguments)});var dynCall_ijjjjii=Module["dynCall_ijjjjii"]=(function(){return Module["asm"]["dynCall_ijjjjii"].apply(null,arguments)});var dynCall_j=Module["dynCall_j"]=(function(){return Module["asm"]["dynCall_j"].apply(null,arguments)});var dynCall_jdi=Module["dynCall_jdi"]=(function(){return Module["asm"]["dynCall_jdi"].apply(null,arguments)});var dynCall_jdii=Module["dynCall_jdii"]=(function(){return Module["asm"]["dynCall_jdii"].apply(null,arguments)});var dynCall_jfi=Module["dynCall_jfi"]=(function(){return Module["asm"]["dynCall_jfi"].apply(null,arguments)});var dynCall_ji=Module["dynCall_ji"]=(function(){return Module["asm"]["dynCall_ji"].apply(null,arguments)});var dynCall_jidi=Module["dynCall_jidi"]=(function(){return Module["asm"]["dynCall_jidi"].apply(null,arguments)});var dynCall_jidii=Module["dynCall_jidii"]=(function(){return Module["asm"]["dynCall_jidii"].apply(null,arguments)});var dynCall_jii=Module["dynCall_jii"]=(function(){return Module["asm"]["dynCall_jii"].apply(null,arguments)});var dynCall_jiid=Module["dynCall_jiid"]=(function(){return Module["asm"]["dynCall_jiid"].apply(null,arguments)});var dynCall_jiii=Module["dynCall_jiii"]=(function(){return Module["asm"]["dynCall_jiii"].apply(null,arguments)});var dynCall_jiiii=Module["dynCall_jiiii"]=(function(){return Module["asm"]["dynCall_jiiii"].apply(null,arguments)});var dynCall_jiiiii=Module["dynCall_jiiiii"]=(function(){return Module["asm"]["dynCall_jiiiii"].apply(null,arguments)});var dynCall_jiiiiii=Module["dynCall_jiiiiii"]=(function(){return Module["asm"]["dynCall_jiiiiii"].apply(null,arguments)});var dynCall_jiiiiiii=Module["dynCall_jiiiiiii"]=(function(){return Module["asm"]["dynCall_jiiiiiii"].apply(null,arguments)});var dynCall_jiiiiiiiiii=Module["dynCall_jiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_jiiiiiiiiii"].apply(null,arguments)});var dynCall_jiij=Module["dynCall_jiij"]=(function(){return Module["asm"]["dynCall_jiij"].apply(null,arguments)});var dynCall_jiiji=Module["dynCall_jiiji"]=(function(){return Module["asm"]["dynCall_jiiji"].apply(null,arguments)});var dynCall_jij=Module["dynCall_jij"]=(function(){return Module["asm"]["dynCall_jij"].apply(null,arguments)});var dynCall_jiji=Module["dynCall_jiji"]=(function(){return Module["asm"]["dynCall_jiji"].apply(null,arguments)});var dynCall_jijii=Module["dynCall_jijii"]=(function(){return Module["asm"]["dynCall_jijii"].apply(null,arguments)});var dynCall_jijiii=Module["dynCall_jijiii"]=(function(){return Module["asm"]["dynCall_jijiii"].apply(null,arguments)});var dynCall_jijj=Module["dynCall_jijj"]=(function(){return Module["asm"]["dynCall_jijj"].apply(null,arguments)});var dynCall_jijji=Module["dynCall_jijji"]=(function(){return Module["asm"]["dynCall_jijji"].apply(null,arguments)});var dynCall_jji=Module["dynCall_jji"]=(function(){return Module["asm"]["dynCall_jji"].apply(null,arguments)});var dynCall_jjii=Module["dynCall_jjii"]=(function(){return Module["asm"]["dynCall_jjii"].apply(null,arguments)});var dynCall_jjji=Module["dynCall_jjji"]=(function(){return Module["asm"]["dynCall_jjji"].apply(null,arguments)});var dynCall_jjjji=Module["dynCall_jjjji"]=(function(){return Module["asm"]["dynCall_jjjji"].apply(null,arguments)});var dynCall_v=Module["dynCall_v"]=(function(){return Module["asm"]["dynCall_v"].apply(null,arguments)});var dynCall_vd=Module["dynCall_vd"]=(function(){return Module["asm"]["dynCall_vd"].apply(null,arguments)});var dynCall_vdiiiii=Module["dynCall_vdiiiii"]=(function(){return Module["asm"]["dynCall_vdiiiii"].apply(null,arguments)});var dynCall_vf=Module["dynCall_vf"]=(function(){return Module["asm"]["dynCall_vf"].apply(null,arguments)});var dynCall_vff=Module["dynCall_vff"]=(function(){return Module["asm"]["dynCall_vff"].apply(null,arguments)});var dynCall_vffff=Module["dynCall_vffff"]=(function(){return Module["asm"]["dynCall_vffff"].apply(null,arguments)});var dynCall_vffi=Module["dynCall_vffi"]=(function(){return Module["asm"]["dynCall_vffi"].apply(null,arguments)});var dynCall_vfi=Module["dynCall_vfi"]=(function(){return Module["asm"]["dynCall_vfi"].apply(null,arguments)});var dynCall_vi=Module["dynCall_vi"]=(function(){return Module["asm"]["dynCall_vi"].apply(null,arguments)});var dynCall_vid=Module["dynCall_vid"]=(function(){return Module["asm"]["dynCall_vid"].apply(null,arguments)});var dynCall_vidd=Module["dynCall_vidd"]=(function(){return Module["asm"]["dynCall_vidd"].apply(null,arguments)});var dynCall_vidi=Module["dynCall_vidi"]=(function(){return Module["asm"]["dynCall_vidi"].apply(null,arguments)});var dynCall_vidii=Module["dynCall_vidii"]=(function(){return Module["asm"]["dynCall_vidii"].apply(null,arguments)});var dynCall_vidiii=Module["dynCall_vidiii"]=(function(){return Module["asm"]["dynCall_vidiii"].apply(null,arguments)});var dynCall_vidiiiii=Module["dynCall_vidiiiii"]=(function(){return Module["asm"]["dynCall_vidiiiii"].apply(null,arguments)});var dynCall_vidiji=Module["dynCall_vidiji"]=(function(){return Module["asm"]["dynCall_vidiji"].apply(null,arguments)});var dynCall_vidjii=Module["dynCall_vidjii"]=(function(){return Module["asm"]["dynCall_vidjii"].apply(null,arguments)});var dynCall_vif=Module["dynCall_vif"]=(function(){return Module["asm"]["dynCall_vif"].apply(null,arguments)});var dynCall_viff=Module["dynCall_viff"]=(function(){return Module["asm"]["dynCall_viff"].apply(null,arguments)});var dynCall_vifff=Module["dynCall_vifff"]=(function(){return Module["asm"]["dynCall_vifff"].apply(null,arguments)});var dynCall_viffff=Module["dynCall_viffff"]=(function(){return Module["asm"]["dynCall_viffff"].apply(null,arguments)});var dynCall_viffffffff=Module["dynCall_viffffffff"]=(function(){return Module["asm"]["dynCall_viffffffff"].apply(null,arguments)});var dynCall_viffffffffi=Module["dynCall_viffffffffi"]=(function(){return Module["asm"]["dynCall_viffffffffi"].apply(null,arguments)});var dynCall_vifffffi=Module["dynCall_vifffffi"]=(function(){return Module["asm"]["dynCall_vifffffi"].apply(null,arguments)});var dynCall_viffffi=Module["dynCall_viffffi"]=(function(){return Module["asm"]["dynCall_viffffi"].apply(null,arguments)});var dynCall_viffffii=Module["dynCall_viffffii"]=(function(){return Module["asm"]["dynCall_viffffii"].apply(null,arguments)});var dynCall_viffffiifffiiiiif=Module["dynCall_viffffiifffiiiiif"]=(function(){return Module["asm"]["dynCall_viffffiifffiiiiif"].apply(null,arguments)});var dynCall_vifffi=Module["dynCall_vifffi"]=(function(){return Module["asm"]["dynCall_vifffi"].apply(null,arguments)});var dynCall_vifffii=Module["dynCall_vifffii"]=(function(){return Module["asm"]["dynCall_vifffii"].apply(null,arguments)});var dynCall_viffi=Module["dynCall_viffi"]=(function(){return Module["asm"]["dynCall_viffi"].apply(null,arguments)});var dynCall_viffii=Module["dynCall_viffii"]=(function(){return Module["asm"]["dynCall_viffii"].apply(null,arguments)});var dynCall_viffiifffffiii=Module["dynCall_viffiifffffiii"]=(function(){return Module["asm"]["dynCall_viffiifffffiii"].apply(null,arguments)});var dynCall_viffiii=Module["dynCall_viffiii"]=(function(){return Module["asm"]["dynCall_viffiii"].apply(null,arguments)});var dynCall_viffiiiif=Module["dynCall_viffiiiif"]=(function(){return Module["asm"]["dynCall_viffiiiif"].apply(null,arguments)});var dynCall_vifi=Module["dynCall_vifi"]=(function(){return Module["asm"]["dynCall_vifi"].apply(null,arguments)});var dynCall_vifii=Module["dynCall_vifii"]=(function(){return Module["asm"]["dynCall_vifii"].apply(null,arguments)});var dynCall_vifiiii=Module["dynCall_vifiiii"]=(function(){return Module["asm"]["dynCall_vifiiii"].apply(null,arguments)});var dynCall_vifijii=Module["dynCall_vifijii"]=(function(){return Module["asm"]["dynCall_vifijii"].apply(null,arguments)});var dynCall_vii=Module["dynCall_vii"]=(function(){return Module["asm"]["dynCall_vii"].apply(null,arguments)});var dynCall_viid=Module["dynCall_viid"]=(function(){return Module["asm"]["dynCall_viid"].apply(null,arguments)});var dynCall_viidi=Module["dynCall_viidi"]=(function(){return Module["asm"]["dynCall_viidi"].apply(null,arguments)});var dynCall_viidii=Module["dynCall_viidii"]=(function(){return Module["asm"]["dynCall_viidii"].apply(null,arguments)});var dynCall_viidij=Module["dynCall_viidij"]=(function(){return Module["asm"]["dynCall_viidij"].apply(null,arguments)});var dynCall_viidiji=Module["dynCall_viidiji"]=(function(){return Module["asm"]["dynCall_viidiji"].apply(null,arguments)});var dynCall_viidji=Module["dynCall_viidji"]=(function(){return Module["asm"]["dynCall_viidji"].apply(null,arguments)});var dynCall_viidjii=Module["dynCall_viidjii"]=(function(){return Module["asm"]["dynCall_viidjii"].apply(null,arguments)});var dynCall_viif=Module["dynCall_viif"]=(function(){return Module["asm"]["dynCall_viif"].apply(null,arguments)});var dynCall_viiff=Module["dynCall_viiff"]=(function(){return Module["asm"]["dynCall_viiff"].apply(null,arguments)});var dynCall_viifff=Module["dynCall_viifff"]=(function(){return Module["asm"]["dynCall_viifff"].apply(null,arguments)});var dynCall_viiffffffffi=Module["dynCall_viiffffffffi"]=(function(){return Module["asm"]["dynCall_viiffffffffi"].apply(null,arguments)});var dynCall_viiffffffffiii=Module["dynCall_viiffffffffiii"]=(function(){return Module["asm"]["dynCall_viiffffffffiii"].apply(null,arguments)});var dynCall_viifffffffi=Module["dynCall_viifffffffi"]=(function(){return Module["asm"]["dynCall_viifffffffi"].apply(null,arguments)});var dynCall_viiffffffi=Module["dynCall_viiffffffi"]=(function(){return Module["asm"]["dynCall_viiffffffi"].apply(null,arguments)});var dynCall_viifffffi=Module["dynCall_viifffffi"]=(function(){return Module["asm"]["dynCall_viifffffi"].apply(null,arguments)});var dynCall_viiffffi=Module["dynCall_viiffffi"]=(function(){return Module["asm"]["dynCall_viiffffi"].apply(null,arguments)});var dynCall_viifffi=Module["dynCall_viifffi"]=(function(){return Module["asm"]["dynCall_viifffi"].apply(null,arguments)});var dynCall_viiffi=Module["dynCall_viiffi"]=(function(){return Module["asm"]["dynCall_viiffi"].apply(null,arguments)});var dynCall_viiffii=Module["dynCall_viiffii"]=(function(){return Module["asm"]["dynCall_viiffii"].apply(null,arguments)});var dynCall_viifi=Module["dynCall_viifi"]=(function(){return Module["asm"]["dynCall_viifi"].apply(null,arguments)});var dynCall_viifii=Module["dynCall_viifii"]=(function(){return Module["asm"]["dynCall_viifii"].apply(null,arguments)});var dynCall_viifiii=Module["dynCall_viifiii"]=(function(){return Module["asm"]["dynCall_viifiii"].apply(null,arguments)});var dynCall_viifiiii=Module["dynCall_viifiiii"]=(function(){return Module["asm"]["dynCall_viifiiii"].apply(null,arguments)});var dynCall_viii=Module["dynCall_viii"]=(function(){return Module["asm"]["dynCall_viii"].apply(null,arguments)});var dynCall_viiidi=Module["dynCall_viiidi"]=(function(){return Module["asm"]["dynCall_viiidi"].apply(null,arguments)});var dynCall_viiidij=Module["dynCall_viiidij"]=(function(){return Module["asm"]["dynCall_viiidij"].apply(null,arguments)});var dynCall_viiidji=Module["dynCall_viiidji"]=(function(){return Module["asm"]["dynCall_viiidji"].apply(null,arguments)});var dynCall_viiidjii=Module["dynCall_viiidjii"]=(function(){return Module["asm"]["dynCall_viiidjii"].apply(null,arguments)});var dynCall_viiif=Module["dynCall_viiif"]=(function(){return Module["asm"]["dynCall_viiif"].apply(null,arguments)});var dynCall_viiiffffffff=Module["dynCall_viiiffffffff"]=(function(){return Module["asm"]["dynCall_viiiffffffff"].apply(null,arguments)});var dynCall_viiifffi=Module["dynCall_viiifffi"]=(function(){return Module["asm"]["dynCall_viiifffi"].apply(null,arguments)});var dynCall_viiiffi=Module["dynCall_viiiffi"]=(function(){return Module["asm"]["dynCall_viiiffi"].apply(null,arguments)});var dynCall_viiiffii=Module["dynCall_viiiffii"]=(function(){return Module["asm"]["dynCall_viiiffii"].apply(null,arguments)});var dynCall_viiifi=Module["dynCall_viiifi"]=(function(){return Module["asm"]["dynCall_viiifi"].apply(null,arguments)});var dynCall_viiififfi=Module["dynCall_viiififfi"]=(function(){return Module["asm"]["dynCall_viiififfi"].apply(null,arguments)});var dynCall_viiififi=Module["dynCall_viiififi"]=(function(){return Module["asm"]["dynCall_viiififi"].apply(null,arguments)});var dynCall_viiifii=Module["dynCall_viiifii"]=(function(){return Module["asm"]["dynCall_viiifii"].apply(null,arguments)});var dynCall_viiifiii=Module["dynCall_viiifiii"]=(function(){return Module["asm"]["dynCall_viiifiii"].apply(null,arguments)});var dynCall_viiifiiiii=Module["dynCall_viiifiiiii"]=(function(){return Module["asm"]["dynCall_viiifiiiii"].apply(null,arguments)});var dynCall_viiii=Module["dynCall_viiii"]=(function(){return Module["asm"]["dynCall_viiii"].apply(null,arguments)});var dynCall_viiiidi=Module["dynCall_viiiidi"]=(function(){return Module["asm"]["dynCall_viiiidi"].apply(null,arguments)});var dynCall_viiiidii=Module["dynCall_viiiidii"]=(function(){return Module["asm"]["dynCall_viiiidii"].apply(null,arguments)});var dynCall_viiiidij=Module["dynCall_viiiidij"]=(function(){return Module["asm"]["dynCall_viiiidij"].apply(null,arguments)});var dynCall_viiiidji=Module["dynCall_viiiidji"]=(function(){return Module["asm"]["dynCall_viiiidji"].apply(null,arguments)});var dynCall_viiiif=Module["dynCall_viiiif"]=(function(){return Module["asm"]["dynCall_viiiif"].apply(null,arguments)});var dynCall_viiiiffffffff=Module["dynCall_viiiiffffffff"]=(function(){return Module["asm"]["dynCall_viiiiffffffff"].apply(null,arguments)});var dynCall_viiiiffffii=Module["dynCall_viiiiffffii"]=(function(){return Module["asm"]["dynCall_viiiiffffii"].apply(null,arguments)});var dynCall_viiiifi=Module["dynCall_viiiifi"]=(function(){return Module["asm"]["dynCall_viiiifi"].apply(null,arguments)});var dynCall_viiiifii=Module["dynCall_viiiifii"]=(function(){return Module["asm"]["dynCall_viiiifii"].apply(null,arguments)});var dynCall_viiiifiii=Module["dynCall_viiiifiii"]=(function(){return Module["asm"]["dynCall_viiiifiii"].apply(null,arguments)});var dynCall_viiiifiiiiif=Module["dynCall_viiiifiiiiif"]=(function(){return Module["asm"]["dynCall_viiiifiiiiif"].apply(null,arguments)});var dynCall_viiiii=Module["dynCall_viiiii"]=(function(){return Module["asm"]["dynCall_viiiii"].apply(null,arguments)});var dynCall_viiiiif=Module["dynCall_viiiiif"]=(function(){return Module["asm"]["dynCall_viiiiif"].apply(null,arguments)});var dynCall_viiiiiffffi=Module["dynCall_viiiiiffffi"]=(function(){return Module["asm"]["dynCall_viiiiiffffi"].apply(null,arguments)});var dynCall_viiiiiffi=Module["dynCall_viiiiiffi"]=(function(){return Module["asm"]["dynCall_viiiiiffi"].apply(null,arguments)});var dynCall_viiiiiffii=Module["dynCall_viiiiiffii"]=(function(){return Module["asm"]["dynCall_viiiiiffii"].apply(null,arguments)});var dynCall_viiiiifi=Module["dynCall_viiiiifi"]=(function(){return Module["asm"]["dynCall_viiiiifi"].apply(null,arguments)});var dynCall_viiiiii=Module["dynCall_viiiiii"]=(function(){return Module["asm"]["dynCall_viiiiii"].apply(null,arguments)});var dynCall_viiiiiif=Module["dynCall_viiiiiif"]=(function(){return Module["asm"]["dynCall_viiiiiif"].apply(null,arguments)});var dynCall_viiiiiifi=Module["dynCall_viiiiiifi"]=(function(){return Module["asm"]["dynCall_viiiiiifi"].apply(null,arguments)});var dynCall_viiiiiii=Module["dynCall_viiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiii"].apply(null,arguments)});var dynCall_viiiiiiifi=Module["dynCall_viiiiiiifi"]=(function(){return Module["asm"]["dynCall_viiiiiiifi"].apply(null,arguments)});var dynCall_viiiiiiii=Module["dynCall_viiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiii=Module["dynCall_viiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiii=Module["dynCall_viiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiii=Module["dynCall_viiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiifii=Module["dynCall_viiiiiiiiiiifii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiifii"].apply(null,arguments)});var dynCall_viiiiiiiiiiii=Module["dynCall_viiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiij=Module["dynCall_viiiij"]=(function(){return Module["asm"]["dynCall_viiiij"].apply(null,arguments)});var dynCall_viiiijiiii=Module["dynCall_viiiijiiii"]=(function(){return Module["asm"]["dynCall_viiiijiiii"].apply(null,arguments)});var dynCall_viiiijji=Module["dynCall_viiiijji"]=(function(){return Module["asm"]["dynCall_viiiijji"].apply(null,arguments)});var dynCall_viiij=Module["dynCall_viiij"]=(function(){return Module["asm"]["dynCall_viiij"].apply(null,arguments)});var dynCall_viiiji=Module["dynCall_viiiji"]=(function(){return Module["asm"]["dynCall_viiiji"].apply(null,arguments)});var dynCall_viiijji=Module["dynCall_viiijji"]=(function(){return Module["asm"]["dynCall_viiijji"].apply(null,arguments)});var dynCall_viij=Module["dynCall_viij"]=(function(){return Module["asm"]["dynCall_viij"].apply(null,arguments)});var dynCall_viiji=Module["dynCall_viiji"]=(function(){return Module["asm"]["dynCall_viiji"].apply(null,arguments)});var dynCall_viijii=Module["dynCall_viijii"]=(function(){return Module["asm"]["dynCall_viijii"].apply(null,arguments)});var dynCall_viijiii=Module["dynCall_viijiii"]=(function(){return Module["asm"]["dynCall_viijiii"].apply(null,arguments)});var dynCall_viijiijiii=Module["dynCall_viijiijiii"]=(function(){return Module["asm"]["dynCall_viijiijiii"].apply(null,arguments)});var dynCall_viijij=Module["dynCall_viijij"]=(function(){return Module["asm"]["dynCall_viijij"].apply(null,arguments)});var dynCall_viijijii=Module["dynCall_viijijii"]=(function(){return Module["asm"]["dynCall_viijijii"].apply(null,arguments)});var dynCall_viijijiii=Module["dynCall_viijijiii"]=(function(){return Module["asm"]["dynCall_viijijiii"].apply(null,arguments)});var dynCall_viijijj=Module["dynCall_viijijj"]=(function(){return Module["asm"]["dynCall_viijijj"].apply(null,arguments)});var dynCall_viijijji=Module["dynCall_viijijji"]=(function(){return Module["asm"]["dynCall_viijijji"].apply(null,arguments)});var dynCall_viijj=Module["dynCall_viijj"]=(function(){return Module["asm"]["dynCall_viijj"].apply(null,arguments)});var dynCall_viijji=Module["dynCall_viijji"]=(function(){return Module["asm"]["dynCall_viijji"].apply(null,arguments)});var dynCall_viijjii=Module["dynCall_viijjii"]=(function(){return Module["asm"]["dynCall_viijjii"].apply(null,arguments)});var dynCall_viijjiii=Module["dynCall_viijjiii"]=(function(){return Module["asm"]["dynCall_viijjiii"].apply(null,arguments)});var dynCall_viijjji=Module["dynCall_viijjji"]=(function(){return Module["asm"]["dynCall_viijjji"].apply(null,arguments)});var dynCall_vij=Module["dynCall_vij"]=(function(){return Module["asm"]["dynCall_vij"].apply(null,arguments)});var dynCall_viji=Module["dynCall_viji"]=(function(){return Module["asm"]["dynCall_viji"].apply(null,arguments)});var dynCall_vijii=Module["dynCall_vijii"]=(function(){return Module["asm"]["dynCall_vijii"].apply(null,arguments)});var dynCall_vijiii=Module["dynCall_vijiii"]=(function(){return Module["asm"]["dynCall_vijiii"].apply(null,arguments)});var dynCall_vijiji=Module["dynCall_vijiji"]=(function(){return Module["asm"]["dynCall_vijiji"].apply(null,arguments)});var dynCall_vijijji=Module["dynCall_vijijji"]=(function(){return Module["asm"]["dynCall_vijijji"].apply(null,arguments)});var dynCall_vijji=Module["dynCall_vijji"]=(function(){return Module["asm"]["dynCall_vijji"].apply(null,arguments)});var dynCall_vijjii=Module["dynCall_vijjii"]=(function(){return Module["asm"]["dynCall_vijjii"].apply(null,arguments)});var dynCall_vijjji=Module["dynCall_vijjji"]=(function(){return Module["asm"]["dynCall_vijjji"].apply(null,arguments)});var dynCall_vj=Module["dynCall_vj"]=(function(){return Module["asm"]["dynCall_vj"].apply(null,arguments)});var dynCall_vji=Module["dynCall_vji"]=(function(){return Module["asm"]["dynCall_vji"].apply(null,arguments)});var dynCall_vjii=Module["dynCall_vjii"]=(function(){return Module["asm"]["dynCall_vjii"].apply(null,arguments)});var dynCall_vjiii=Module["dynCall_vjiii"]=(function(){return Module["asm"]["dynCall_vjiii"].apply(null,arguments)});var dynCall_vjiiii=Module["dynCall_vjiiii"]=(function(){return Module["asm"]["dynCall_vjiiii"].apply(null,arguments)});var dynCall_vjiiiii=Module["dynCall_vjiiiii"]=(function(){return Module["asm"]["dynCall_vjiiiii"].apply(null,arguments)});var dynCall_vjiiiiiii=Module["dynCall_vjiiiiiii"]=(function(){return Module["asm"]["dynCall_vjiiiiiii"].apply(null,arguments)});var dynCall_vjiiiiiiii=Module["dynCall_vjiiiiiiii"]=(function(){return Module["asm"]["dynCall_vjiiiiiiii"].apply(null,arguments)});var dynCall_vjji=Module["dynCall_vjji"]=(function(){return Module["asm"]["dynCall_vjji"].apply(null,arguments)});Module["asm"]=asm;Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["stackTrace"]=stackTrace;Module["addRunDependency"]=addRunDependency;Module["removeRunDependency"]=removeRunDependency;Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};Module["callMain"]=function callMain(args){args=args||[];ensureInitRuntime();var argc=args.length+1;var argv=stackAlloc((argc+1)*4);HEAP32[argv>>2]=allocateUTF8OnStack(Module["thisProgram"]);for(var i=1;i<argc;i++){HEAP32[(argv>>2)+i]=allocateUTF8OnStack(args[i-1])}HEAP32[(argv>>2)+argc]=0;try{var ret=Module["_main"](argc,argv,0);exit(ret,true)}catch(e){if(e instanceof ExitStatus){return}else if(e=="SimulateInfiniteLoop"){Module["noExitRuntime"]=true;return}else{var toLog=e;if(e&&typeof e==="object"&&e.stack){toLog=[e,e.stack]}err("exception thrown: "+toLog);Module["quit"](1,e)}}finally{calledMain=true}};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();if(Module["_main"]&&shouldRunNow)Module["callMain"](args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=run;function exit(status,implicit){if(implicit&&Module["noExitRuntime"]&&status===0){return}if(Module["noExitRuntime"]){}else{ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(Module["onExit"])Module["onExit"](status)}Module["quit"](status,new ExitStatus(status))}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}if(what!==undefined){out(what);err(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;throw"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"]){shouldRunNow=false}Module["noExitRuntime"]=true;run()




}
