var charSet8 = {}

"1234567890`~!@#$%^&*()-_=+\\;:'\"|,<.>/?{}[]abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\t\n\s\r\a "
.split("")
.map(function(w){
  charSet8[w.charCodeAt().toHex()] = w
})