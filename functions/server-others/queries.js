function Q(firebase){
    this.f = firebase;
}

Q.prototype.getLast = function(cant){
    
    var list = this.f.database().ref('locaciones').limitToLast(cant);
    return list.once('value');
}

module.exports = Q;