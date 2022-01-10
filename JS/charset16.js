var charSet16 = {}

"1234567890`~!@#$%^&*()-_=+\\;:'\"|,<.>/?{}[]abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\t\n\a\r "
.split("")
.map(function(w){
  charSet16[w.charCodeAt().toHex()] = w
})