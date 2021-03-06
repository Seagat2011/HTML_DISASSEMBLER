/* 

  Copyright (c) 2022, Seagat2011
  All rights reserved.

  This software is accompanied by a copy of the GNU v2 license!

  Should any portion of the following copyright and permission notice interfere
  with the spirit of the GNU v2 license, the GNU v2 license shall override and 
  apply:

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to
  deal in the Software without restriction, including without limitation the
  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
  sell copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES
  LOSS OF USE, DATA, OR PROFITS OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

  TITLE
    HTML5 HEX EDITOR + DISASSEMLBER

  AUTHOR
    Seagat2011

  DESCRIPTION
    View Edit Save files in raw format
    Chrome v96+ requires `python -m http.server 8356 --bind 127.0.10.1` (Satisfy CORS requirement)
    Proper unassembly requires the file reside in the current directory

  INPUT
    bytestream

      61 64 64 45 76 65 6e 74 4c 69 73 74 65 6e 65 72 28 22 6d 65 73 73 61 67 65
      22 2c 6d 79 46 75 6e 63 2c 22 31 36 4b 5f 63 6f 64 65 63 2e 68 74 6d 22 29
      0a 0a 66 75 6e 63 74 69 6f 6e 20 6d 79 46 75 6e 63 28 65 29 7b 0a 0a 7d

  OUTPUT
    Hexadecimal + filtered text + Disassembly

  VERSION
    Major.Minor.Bugfix.Patch
    1.0.0.0
    
  NOTES
    Intel-32/64 architecture employs LITTLE-ENDIAN machine architecture (byte words ordered from least to most-significant byte) 

*/

var __DEBUGMODE__ = false
var __decodeBYTE__ = {
    // Flags(5): MSB [ btnUTF8 btnUTF16 btnAMD64 btnX86IA32 btnX86IA64 ] LSB //
    '10000':function(v,w){ return charSet8[v] || `[0x${ v }]` }, // charSet8 //
    '01000':function(v,w){ return charSet16[v] || `[0x${ v }]` }, // charSet16 //
    '00100':function(v,w){ return (x86AMD64[v] + '\n' || charSet8[v] || `[0x${ v }]`) }, // x86AMD64 //
    '00010':function(v,w){ return (x86IA32[v] + '\n' || charSet8[v] || `[0x${ v }]`) }, // x86IA32 //
    '00001':function(v,w){ return (x86IA64[v] + '\n' || charSet8[v] || `[0x${ v }]`) }, // x86IA64 //
}

function ByteStream(ce,te,stat,srch){
    let self = this
    let decodeflag = ''
    let CSSHIGHLIGHT = 'yellow'
    let CSSDEFAULT = 'white'
    this.url = ""
    this.pages = []
    this.intEnableWorker = 0
    this.urlSave = ""
    this.byteStream = 0x00
    this.code_editor = ce
    this.text_editor = te
    this.status_window = stat
    this.onsearch = srch
    this.pageResizeFactor = (
    window.innerWidth /* 1366 */ * 
    window.innerHeight /* 768 */ ) /
    1049088 /* 1366* 768 */ ;
    this.defaultOffset = Math.ceil( 2000 /* 40 lines x 46 columns = 1840 visible bytes */ * this.pageResizeFactor ) ;
    this.byteOffset = 
    this.textOffset = 
    this.defaultOffset ;
    this.bkgWorkerLoadPage = function(idx,u){
        try {
            let decodeBYTE = __decodeBYTE__[self.decodeflag];
            let stride = self.pages[idx]
            let _code = [] ;
            let _text = [] ;
            self
                .byteStream
                .slice(stride._from,stride._to)
                .map(
                    function(w,i,me){
                      _code.push( w.toHex().asByteTag(i) )
                      return w
                    }) ;
            self
                .byteStream
                .slice(stride._from,stride._to)
                .map(
                    function(w,i,me){
                      _text.push( decodeBYTE(w.toHex(),w).asSrcTag(i) )
                      return w
                    }) ;
            self.code_editor.innerHTML = _code.join(" ")
            self.text_editor.innerHTML = _text.join("")
            if (u && self.pages.last){
                if(u != self.pages.last){
                    self.pages.last.style.background = CSSDEFAULT;
                    u.style.background = CSSHIGHLIGHT;
                    self.pages.last = u;
                } else {
                    // NOP //
                }
            } else {
                _p_0.style.background = CSSHIGHLIGHT;
                self.pages.last = _p_0;
            }
        } catch ( e ) {
            __DEBUGMODE__ && console.log( e )
        }
    }
    this.proceed = function(u){
        if(u){
            self.intEnableWorker = setInterval(self.bkgWorkerLoadPage,1)
        } else if(self.intEnableWorker){
            clearInterval( self.intEnableWorker )
        }
    }
    this.onsearch.start = function(e){
        try {
            let j = 0 ;
            let nPage = 0 ;
            let _html_ = [] ;
            let cbFlag = chkByteSearch.checked ;
            let pttn = { true: (u)=>{ return __hexToUint8__[u] }, false: (u)=>{ return u.codePointAt() } }
            let u = self.onsearch.value.split( ( cbFlag ? /\s+/ : "" ) ).map((w)=>{ return pttn[cbFlag](w) }) ;
            let lastKeyCodeMatch = [] ;
            let J = u.length ;
            J > 0 && self.byteStream.map(
            function(w,i,me){
                self.incrPAGE(i) && ++nPage ;
                if(j==J){
                   _html_.push( nPage.asTAG('page',`p_${nPage-1} onclick="__file__.bkgWorkerLoadPage(${nPage-1}, this)"`) ) ;
                    lastKeyCodeMatch = [] ;
                    j = 0 ;
                } else if (w == u[j]) {
                    let len = lastKeyCodeMatch.length || 0 
                    if(len > 0 && lastKeyCodeMatch[len-1] + 1 == i){
                        lastKeyCodeMatch.push(i)
                        j++
                    } else {
                        lastKeyCodeMatch = [i]
                        j = 1
                    }
                } else if(lastKeyCodeMatch.length > 0){
                    lastKeyCodeMatch = []
                    j = 0
                }
                return w
            }) ;
            ppanel_srch.innerHTML = _html_.join('')
        } catch(e) {
            __DEBUGMODE__ && console.log(e) 
        }
    }
    this.incrPAGE = function(i){
        return (i%self.byteOffset == 0)
    }
}

ByteStream.prototype = {}

ByteStream.prototype.__byteStream__ = function (putget, decodeflag){
  let self = this
  let xhr = new XMLHttpRequest()
  let url = this.url
  let async = true
  if(putget === "GET"){
    self.decodeflag = decodeflag
    xhr.overrideMimeType("application/octet-stream");
    xhr.open(putget,url,async)
    xhr.responseType = "arraybuffer"
    xhr.onprogress = function(e){
        // e //
    }
    xhr.onloadend = function(e){
        // e //
    }
    xhr.onreadystatechange = function(e){
      let banner = [
        function(){
          return "Processing file..." // 0 UNSENT
          }, 
        function(){
          return "Opening file..."    // 1 OPENED
          },
        function(){
          return "Initializing..."    // 2 HEADERS_RECEIVED
          },
        function(v){
          let status = {
            PUT:function(){
              return "Saving file..."
              },
            GET:function(){
              return "Loading file..."
              },
            default:function(w){
              let msg = {
                PUT:"SAVE",
                GET:"LOAD",
                }
              return Error("Unable to complete "+msg[v]+" operation.")
              },
          }
          return status[v]() || status.default(v)    // 3 LOADING //
          },
        function(v){
            let I = xhr.response.byteLength ;
            let J = 0 ;
            let _html_ = [] ;
            self.pages = [] ;
            self.byteStream = new Uint8Array( xhr.response ) ;
            for(let i=0; i<I; i++){
                if(i%self.byteOffset == 0){
                  _html_.push( self.pages.push({ _from:i, _to:i+self.byteOffset }).asTAG('page',`p_${J} onclick="__file__.bkgWorkerLoadPage(${J++}, this)"`) )
                }
            }
            ppanel.innerHTML = _html_.join('')
            self.bkgWorkerLoadPage( 0 ) // page 1 //
            return "Ready"  // 4 DONE //
          },
      ]
      self.status_window.innerHTML = banner [ xhr.readyState ] (putget) || Error("Error parsing bitstream - Please try again.")
    }
    xhr.send()
  }
  else
  if(putget === "POST"){
    xhr.open(putget,url,async)
    if(code00.checked){
      xhr.send(xhr._num2bytes(self.code_editor.innerText.split(/\s+/g)))
    }
    else
    if(code01.checked){
      let formData = new FormData()
      xhr.send(self.text_editor.innerText)
    }
    else
    if(code02.checked){
      xhr.send(xhr._ch2bytes(self.text_editor.innerText))
    }
  }
}

ByteStream.prototype.openDumpStream = function (w, f){
  let self = this
  try{
    if(w && w.name && ((w.name != self.url) || (self.lastFlag != f)) ){
      self.url = w.name
      self.__byteStream__('GET', f)
      self.lastFlag = f
      
    }
    else
    if(w && w.name){
      self.byteScroll_pixelTop = self.textScroll_pixelTop = 0
      self.bkgWorkerLoadPage( 0 )
    }
  } 
  catch(e){
    __DEBUGMODE__ && console.log(e)
  }
}

ByteStream.prototype.saveDumpStream = function (w){
  try{
    if(w && w.name){
      this.urlSave = w.name
      this.__byteStream__('POST')
    }
  } 
  catch(e){
    // console.log(e) //
  }
}