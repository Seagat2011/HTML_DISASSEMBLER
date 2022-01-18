
var __emit__ = console.log
// Flags(5): MSB [ btnUTF8 btnUTF16 btnAMD64 btnX86IA32 btnX86IA64 ] LSB //
var __flags__ = '10000'
var __file__ = new ByteStream(byteresult, sourceresult, loadstatus)
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
        byteresult.innerText = ''
        sourceresult.innerText = ''
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
        sourceresult.scrollTop = sourceresult.scrollHeight * scrollRatio
        scrollLock = true
    } else {
        scrollLock = false
    }
  })

sourceresult.addEventListener("scroll", 
  function(e){
    if(e.target.id == 'sourceresult' && !scrollLock){
        let scrollRatio = e.target.scrollTop / sourceresult.scrollHeight ;
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

sourceresult.ondrop = 
byteresult.ondrop = function(e){
    __file__.openDumpStream( e.dataTransfer.files[0], __flags__ )
    e.preventDefault()
}

divCode00.onclick = function(e){
    code00.checked=true
    code01.checked=code02.checked=false
    byteresult.style.display=
    sourceresult.style.display='inline'
    byteresult.style.width = 
    sourceresult.style.width = '49%'
}

divCode01.onclick = function(e){
    code01.checked=true
    code00.checked=code02.checked=false
    byteresult.style.display='none'
    sourceresult.style.display='inline'
    sourceresult.style.width = '100%'
}

divCode02.onclick = function(e){
    code02.checked=true
    code00.checked=code01.checked=false
    byteresult.style.display='inline'
    sourceresult.style.display='none'
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
var highlightQUEUE = new Set()

document.onkeyup = document.onselectionchange = function(e){
    try {
        var rangetextOBJ
        if (rangetextOBJ = getSelection()){
            var __basenodeName__ = `${rangetextOBJ.baseNode.parentElement.localName}`
            var __extentnodeName__ = `${rangetextOBJ.extentNode.parentElement.localName}`
            var __baseNodeId__ = `${rangetextOBJ.baseNode.parentElement.id}`
            var __extentNodeId__ = `${rangetextOBJ.extentNode.parentElement.id}`
            if (!__extentNodeId__ || __extentNodeId__.match('^[^_]'))
                return;
            if ( __basenodeName__ != __extentnodeName__ && highlightQUEUE.size)
                flushHighlightQueue('force');
            if ( !highlightQUEUE.size ){
                Function(`
                ${__baseNodeId__}[0].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
                ${__baseNodeId__}[1].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
                `)();
                highlightQUEUE.add( __baseNodeId__ )
                !intVAL && (intVAL = setInterval(flushHighlightQueue,1))
                return
            }
            //if ( highlightQUEUE.size && !highlightQUEUE.has(__baseNodeId__) ) {
                flushHighlightQueue('force');
                Function(`
                ${__baseNodeId__}[0].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
                ${__baseNodeId__}[1].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
                `)();
                highlightQUEUE.add( __baseNodeId__ )
                try {
                    var i = __baseNodeId__.match(/\d+/)[0]*1
                    var I = __extentNodeId__.match(/\d+/)[0]*1
                    var flag = i < I ? '1' : '0' ;
                    flag += i > I ? '1' : '0' ;
                    flag += i == I ? '1' : '0' ;
                    var _set = {
                        '100': 1,
                        '010':-1,
                        '001': 0,
                    }
                    var iter = _set[ flag ] ;
                    do{
                        i += iter
                        var _id_ = `_${i}`
                        if( !highlightQUEUE.has( _id_ ) ){
                            Function(`
                            ${_id_}[0].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
                            ${_id_}[1].attributes.id.ownerElement.style['backgroundColor'] = '${HOVER}'
                            `)();
                            highlightQUEUE.add( _id_ )
                        }
                    } while (i!=I);
                } catch(err) {
                    __emit__( err )
                }
                !intVAL && (intVAL = setInterval(flushHighlightQueue,1))
            //}
            return
        }
    } catch (err) { __emit__( err ) }
}

function flushHighlightQueue(resetQueue){
    if(!getSelection() || resetQueue){
        // empty queue //
        for(var i of highlightQUEUE){
            Function(`
            ${i}[0].attributes.id.ownerElement.style['backgroundColor'] = 'white'
            ${i}[1].attributes.id.ownerElement.style['backgroundColor'] = 'white'
            `)()
        }
        highlightQUEUE = new Set()
        !resetQueue && clearInterval( intVAL )
    }
}