var add = function(bus){
    bus.save(function(error, bus) {
        if (error){
            return console.error(error);
        }
        else{
            console.log('Остановка [' + bus.name + '] добавлена.');
        }
    });
};

var addRel = function(relation){
    relation.save(function(error, relation) {
        if (error){
            return console.error(error);
        }
        else{
            console.log('Отношение [' + relation.id + '] добавлено.');
        }
    });
};

module.exports.add = add;
module.exports.addRel = addRel;
