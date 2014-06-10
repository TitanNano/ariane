$_('engine').override({
    coreLock : true,
    masterApplication : 'titannano-de',
    singleApplicationMode : false
});

$('application').new('gEngine'); //date engine
$('application').new('game'); //the actual game loader
