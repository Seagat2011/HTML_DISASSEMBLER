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
    HEX LIVE TEXT EDITOR + DISASSEMLBER

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
    Intel-32/64 architecture supports LITTLE-ENDIAN machines (byte words numbered from least significant byte) 

*/

function ByteStream(ce,te,stat){
    var self = this
    this.url = ""
    this.intCALLBACK = 0
    this.urlSave = ""
    this.byteStream = 0x00
    this.codeStream = 0x00
    this.textStream = ""
    this.code_editor = ce
    this.text_editor = te
    this.status_window = stat
    this.ce_scrollHeight = ce.scrollHeight
    this.te_scrollHeight = te.scrollHeight
    this.scrollDirective = 1840*2 // 40 lines x 46 columns = 1840 bytes visible //
    this.byteScrollTop = 1840*2+1
    this.textScrollTop = 1840*2+1
    this.byteScroll_pixelTop = 0
    this.textScroll_pixelTop = 0
    this.callback = function(){
        var a = [
            function(){
                self.code_editor.innerHTML = self.codeStream.asByteTAGStream().join(" ")
                self.text_editor.innerHTML = self.textStream.asSrcTAGStream().join("")
                self.proceed( false )
            }
        ]
        if(self.intCALLBACK){
          a.map(function(w){
            return w()
          })
        }
    }
    this.proceed = function(u){
        if(u){
            self.intCALLBACK = setInterval(self.callback,1)
        } else if(self.intCALLBACK){
            clearInterval( self.intCALLBACK )
        }
    }
}

ByteStream.prototype = {}

ByteStream.prototype.__byteStream__ = function (putget, decodeflag){
  var self = this
  var xhr = new XMLHttpRequest()
  var url = this.url
  var async = true
  if(putget === "GET"){
    xhr.overrideMimeType("application/octet-stream");
    xhr.open(putget,url,async)
    xhr.responseType = "arraybuffer"
    xhr.onreadystatechange = function(e){
      var banner = [
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
          var status = {
            PUT:function(){
              return "Saving file..."
              },
            GET:function(){
              return "Loading file..."
              },
            default:function(w){
              var msg = {
                PUT:"LOAD",
                GET:"SAVE",
                }
              return Error("Unable to complete "+msg[v]+" operation.")
              },
          }
          return status[v]() || status.default(v)    // 3 LOADING //
          },
        function(v){ 
          self.byteStream = new Uint8Array( xhr.response )
          self.codeStream = new Array()
          self.textStream = new Array()
          var __decodeBYTE__ = {
            // Flags(5): MSB [ btnUTF8 btnUTF16 btnAMD64 btnX86IA32 btnX86IA64 ] LSB //
            '10000':function(v,w){ return charSet8[v] || `[0x${ v }]` }, // charSet8 //
            '01000':function(v,w){ return charSet16[v] || `[0x${ v }]` }, // charSet16 //
            '00100':function(v,w){ return (x86AMD64[v] + '\n' || charSet8[v] || `[0x${ v }]`) }, // x86AMD64 //
            '00010':function(v,w){ return (x86IA32[v] + '\n' || charSet8[v] || `[0x${ v }]`) }, // x86IA32 //
            '00001':function(v,w){ return (x86IA64[v] + '\n' || charSet8[v] || `[0x${ v }]`) }, // x86IA64 //
          }
          var decodeBYTE = __decodeBYTE__[decodeflag];
          self.byteStream.map(
            function(w,i){
              var v = w.toHex() // Sanitize //
              self.codeStream[i] = v
              self.textStream[i] = decodeBYTE(v,w) 
              return w
            })
          self.byteScroll_pixelTop = 0
          self.textScroll_pixelTop = 0
          self.proceed( true )
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
      var formData = new FormData()
      xhr.send(self.text_editor.innerText)
    }
    else
    if(code02.checked){
      xhr.send(xhr._ch2bytes(self.text_editor.innerText))
    }
  }
}

ByteStream.prototype.openDumpStream = function (w, f){
  var self = this
  try{
    if(w && w.name && ((w.name != self.url) || (self.lastFlag != f)) ){
      self.url = w.name
      self.__byteStream__('GET', f)
      self.lastFlag = f
      
    }
    else
    if(w && w.name){
      self.byteScroll_pixelTop = self.textScroll_pixelTop = 0
      self.proceed( true )
    }
  } 
  catch(e){
    console.log(e)
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
    console.log(e)
  }
}