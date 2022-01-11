
// Flags(5): MSB [ btnUTF8 btnUTF16 btnAMD64 btnX86IA32 btnX86IA64 ] LSB //
var __flags__ = '10000'
var __file__ = new ByteStream(byteresult, textresult, loadstatus)
var __fn__ = ''

var __status__ = {
    "btnDump" : function(){
        __file__.openDumpStream(btnStream.files[0] || __fn__, __flags__)
        //__fn__ = btnStream.files[0] || __fn__ //
        },
    "btnSave" : function(){
        __file__.saveDumpStream(btnSaveStream.files[0])
        },
    "btnClear" : function(){
        __file__.proceed = false
        byteresult.innerText = ''
        textresult.innerText = ''
        },
}

btnDump.onclick = 
btnSave.onclick =
btnClear.onclick = function(e){
  if(__status__[e.target.id]){
    __status__[e.target.id]()
  }
}

var scrollLock = false
byteresult.addEventListener("scroll", 
  function(e){
    if(e.target.id == 'byteresult' && !scrollLock){
        let scrollRatio = e.target.scrollTop / byteresult.scrollHeight ;
        textresult.scrollTop = textresult.scrollHeight * scrollRatio
        scrollLock = true
    } else {
        scrollLock = false
    }
  })

textresult.addEventListener("scroll", 
  function(e){
    if(e.target.id == 'textresult' && !scrollLock){
        let scrollRatio = e.target.scrollTop / textresult.scrollHeight ;
        byteresult.scrollTop = byteresult.scrollHeight * scrollRatio
        scrollLock = true
    } else {
        scrollLock = false
    }
  })

btnSave:click = function(w){
  alert(this.files[0].name)
}

btnStream.addEventListener('change',() => { 
    __file__.openDumpStream( btnStream.files[0], __flags__ ) 
}, false)

textresult.ondrop = 
byteresult.ondrop = function(e){
    __file__.openDumpStream( e.dataTransfer.files[0], __flags__ )
    e.preventDefault()
}

divCode00.onclick = function(e){
    code00.checked=true
    code01.checked=code02.checked=false
    byteresult.style.display=
    textresult.style.display='inline'
    byteresult.style.width = 
    textresult.style.width = '49%'
}

divCode01.onclick = function(e){
    code01.checked=true
    code00.checked=code02.checked=false
    byteresult.style.display='none'
    textresult.style.display='inline'
    textresult.style.width = '100%'
}

divCode02.onclick = function(e){
    code02.checked=true
    code00.checked=code01.checked=false
    byteresult.style.display='inline'
    textresult.style.display='none'
    byteresult.style.width = '100%'
}

divUTF8.onclick = function(e){
    __flags__ = '10000'
    btnUTF8.checked=true
    btnUTF16.checked=btnAMD64.checked=btnX86IA32.checked=btnX86IA64.checked=false
    __status__.btnClear()
    __status__.btnDump()
}
divUTF16.onclick = function(e){
    __flags__ = '01000'
    btnUTF16.checked=true
    btnUTF8.checked=btnAMD64.checked=btnX86IA32.checked=btnX86IA64.checked=false
    __status__.btnClear()
    __status__.btnDump()
}
divAMD64.onclick = function(e){
    __flags__ = '00100'
    btnAMD64.checked=true
    btnUTF8.checked=btnUTF16.checked=btnX86IA32.checked=btnX86IA64.checked=false
    __status__.btnClear()
    __status__.btnDump()
}
divX86IA32.onclick = function(e){
    __flags__ = '00010'
    btnX86IA32.checked=true
    btnAMD64.checked=btnUTF8.checked=btnUTF16.checked=btnX86IA64.checked=false
    __status__.btnClear()
    __status__.btnDump()
}
divX86IA64.onclick = function(e){
    __flags__ = '00001'
    btnX86IA64.checked=true
    btnX86IA32.checked=btnAMD64.checked=btnUTF8.checked=btnUTF16.checked=false
    __status__.btnClear()
    __status__.btnDump()
}

var intVAL
var HOVER = 'yellow'
var highlightQUEUE = []

document.onselectionchange = function(e){
    var rangetextOBJ
    if(rangetextOBJ = getSelection()){
        var __basenodeName__ = `${rangetextOBJ.baseNode.parentElement.localName}`
        var __extentnodeName__ = `${rangetextOBJ.extentNode.parentElement.localName}`
        var __basenodeId__ = `${rangetextOBJ.baseNode.parentElement.id}`
        var __extentnodeId__ = `${rangetextOBJ.extentNode.parentElement.id}`
        if( __basenodeName__ != __extentnodeName__ && highlightQUEUE.length)
            flushHighlightQueue('force')
        if( !highlightQUEUE.length ){
            Function(`
            ${__basenodeId__}[0].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
            ${__basenodeId__}[1].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
            `)();
            highlightQUEUE.push( __basenodeId__ )
            !intVAL && (intVAL = setInterval(flushHighlightQueue,1))
            return
        }
        if( highlightQUEUE.length && highlightQUEUE[0] != __basenodeId__){
            flushHighlightQueue('force');
            Function(`
            ${__basenodeId__}[0].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
            ${__basenodeId__}[1].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
            `)();
            highlightQUEUE.push( __basenodeId__ )
        }
        Function(`
        ${__extentnodeId__}[0].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
        ${__extentnodeId__}[1].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
        `)();
        highlightQUEUE.push( __extentnodeId__ )
        !intVAL && (intVAL = setInterval(flushHighlightQueue,1))
        return
    }
}

function flushHighlightQueue(resetQueue){
    if(!getSelection() || resetQueue){
        // empty queue //
        highlightQUEUE.map(function(u,i,me){
            Function(`
            ${u}[0].attributes.id.ownerElement.style['backgroundColor'] = 'white'
            ${u}[1].attributes.id.ownerElement.style['backgroundColor'] = 'white'
            `)()
            return u
        })
        highlightQUEUE = []
        !resetQueue && clearInterval( intVAL )
    }
}