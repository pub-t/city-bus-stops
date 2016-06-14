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

module.exports.add = add;
