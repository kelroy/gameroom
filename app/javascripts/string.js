String.prototype.ucfirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalize = function() {
  sentence = this.split(' ');
  for(word in sentence) {
    sentence[word] = sentence[word].ucfirst();
  }
  return sentence.join(' ');
}
    
String.prototype.truncate = function(length) {
  return this.substr(0, length - 1) + (this.length > length? '...' : '');
}