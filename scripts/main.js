$_('game').main(function(){
    var engine= $_('gEngine');
    
    engine.newGame({
        playerFile : 'characters/player.json',
        dateFile : 'characters/ariane.json',
        canvas : $('dom').select('canvas')
    }).then(function(){
        engine.createLocation('home', [
            'scenes/opening.json', 
            'scenes/get_to_know.json', 
            'scenes/livingroom_sofa.json', 
            'scenes/map_home.json',
            'scripts/actions/opening.js'
        ]);
    
        engine.loadLocation('home').then(function(){
//          everything loaded ready to play load first scene
            $$.console.log('ready!!');
            engine.goToScene('opening');
        });
    });
});