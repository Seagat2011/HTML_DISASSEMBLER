
Object.prototype.toHex = function(){
  return `${ this < 16 ? '0':'' }${ this.toString( 16 ) }`
}

Object.prototype._num2bytes = function(sData) {
  return(new Uint8Array(sData.length).map(
    function(w,nIdx){
      return (w & 0xff)
    })
  )
}

Object.prototype._ch2bytes = function(sData) {
  /* send as ArrayBufferView...: */
  // this.send(ui8Data)
  /* ...or as ArrayBuffer (legacy)...:*/
  // this.send(ui8Data.buffer)
  return(new Uint8Array(sData.length).map(
    function(w,nIdx){
      return (sData.charCodeAt(nIdx) & 0xff)
    })
  )
}

Object.prototype._uint8ToHex = function(){
    `${ this < 16 ? '0':'' }${ this.toString( 16 ) }`
}

Object.prototype._hexToUint8 = function(){
    return __hexToUint8__[ this ]
}

Object.prototype.asStream = function(u){
    var self = this
    return self.map(function(v,i,me){ return v.asTAG(u,i) })
}

Object.prototype.asByteStream = function(){
    var self = this
    return self.map(function(v,i,me){ return v.asTAG('byte',i) })
}

Object.prototype.asSrcStream = function(){
    var self = this
    return self.map(function(v,i,me){ 
            if (v.match(/ /)) {
                v = '&nbsp;'
            } else if( v.match(/\t/) ) {
                v = '&nbsp;&nbsp;&nbsp;&nbsp;'
            } else if( v.match(/\n/) ) {
                v = v.replace(/\n/,'<br>')
            }
        return v.asTAG('src',i); 
        })
}

Object.prototype.asTAG = function(u,i){
    return `<${u} id=_${i}>${this}</${u}>`
}