$_('gEngine').main(function(){
    
    var request= $('connections').functions.request;
    var ui = null;
    
    var loadImages= function(list){
        return new Promise(function(setFinish){
            var count= list.length;
            var done= 0;
            
            var check= function(){
                if(done == count)
                    setFinish();
            };
                        
            list.forEach(function(item){
                if(!gamedata.images[item]){
                    var img= new $$.Image();
                    img.onload= function(){
                        gamedata.images[item]= img;
                        done++;
                        check();
                    };
                    img.onerror= function(){
                        $$.console.log('image loading failed!');
                    };
                    img.src= item;
                }else{
                    done++;
                    check();
                }
            });
        });
    };
    
    var getDateOutfit= function(){
        return gamedata.date.outfits[gamedata.date.activeOutfit];
    };
    
    var textLabel= function(text, zLevel){
        var TextBox= $('canvas').TextBox;
        var item= new TextBox(text, 0, 0, zLevel);
        item.font= '15px/20px sans-serif';
        item.color= '#fff';
        return item;
    };
    
    var buildActionList= function(actions, sceneName){
        var Layer= $('canvas').Layer;
        var HitArea= $('canvas').HitArea;
        
        ui.actionList.hidden= true;
        ui.actionList.clear();
        actions.forEach(function(item, index){
            var label= new Layer(10, index * 20);
            label.addElement(new textLabel(item.caption, 0));
            label.elements(0).color= '#dedede';
            label.addElement(new HitArea(0, 0, 200, 20, 1));
        
            if(gamedata.actions[sceneName] && gamedata.actions[sceneName][item.action])
                label.elements(1).onclick= function(){ gamedata.actions[sceneName][item.action].apply(gamedata, [item]); };
            else
                $$.console.warn('action "'+item.action+'" for scene "'+sceneName+'" does not exist!');
            
            label.elements(1).onmouseover= function(){
                label.elements(0).color= '#fff';
                gamedata.playerSays(selectText(item.text));
            };
            label.elements(1).onmouseout= function(){
                label.elements(0).color= '#dedede';
                gamedata.playerSays('');
            };
            
            label.elements(1).cursor= 'pointer';
            ui.actionList.addElement(label);
        });
        ui.actionList.hidden= false;
    };
    
    var selectText= function(options){
        var index= Math.round(Math.random() * (options.length-1));
        return options[index];
    };
    
//  create a new Game
    this.newGame= function(options){
        return new Promise(function(setFinish){
            var Canvas= $('canvas').Canvas;
            var Image= $('canvas').Image;
            var FilledRect= $('canvas').FilledRect;
            var Layer= $('canvas').Layer;
        
//          set up the UI
            ui= {
                canvas : new Canvas(options.canvas),
                bg : new FilledRect(0, 0, options.canvas.width, options.canvas.height, '#000', 0),
                loadingLabel : textLabel('loading Data...', 2),
                scene : new Image(null, 200, 0, 1),
                actionList : new Layer(1200, 50),
                chatBox : {
                    player : textLabel(''),
                    date : textLabel(''),
                    last : textLabel('')
                }
            };
            gamedata.ui= ui;
            
            ui.canvas.maxFps= 30;
            ui.canvas.fpsOverlay= true;
//          background
            ui.canvas.addElement(ui.bg);
//          loading label
            ui.canvas.addElement(ui.loadingLabel);
            ui.loadingLabel.x= ui.canvas.width / 2 - ui.canvas.measureText(ui.loadingLabel).width / 2;
            ui.loadingLabel.y= ui.canvas.height / 2 - 10;
//          scene image
            ui.canvas.addElement(ui.scene);
            ui.scene.hidden= true;
//          actions list
            ui.canvas.addElement(ui.actionList);
//          chatbox
            var chatLayer= new Layer(0, 615, 1);
            var chatFont= '17px/20px sans-serif';
            var aling= 'center';
            ui.chatBox.player.font= chatFont;
            ui.chatBox.player.aling= aling;
            chatLayer.addElement(ui.chatBox.player);
            ui.chatBox.date.font= chatFont;
            ui.chatBox.player.aling= aling;
            chatLayer.addElement(ui.chatBox.date);
            ui.chatBox.last.font= chatFont;
            ui.chatBox.player.aling= aling;
            chatLayer.addElement(ui.chatBox.last);
            ui.chatBox.player.aling= aling;
            ui.canvas.addElement(chatLayer);
        
//          start rendering
            ui.canvas.start();            
            
//          load resources
            var done= 0;
            var count= 0;
            var ready= false;
        
            var check= function(){
                if(ready && count == done){
                    ui.loadingLabel.hidden= true;
                    setFinish();
                }
            };
        
            count++;
            request(options.playerFile).then(function(data){
                gamedata.player= JSON.parse(data);
                done++;
                check();
            }); 
        
            count++;
            request(options.dateFile).then(function(data){
                gamedata.date= JSON.parse(data);
                done++;
                check();
            });
        
            if(options.descriptionsFile){
                count++;
                request(options.descriptionsFile).then(function(data){
                    gamedata.descriptions= JSON.parse(data);
                    done++;
                    check();
                });
            }
            ready= true;
            check();
        });
    };
    
    this.createLocation= function(name, sceneFiles){
        gamedata.locations[name]= sceneFiles;
    };
    
    this.loadLocation= function(name){
        ui.loadingLabel.content= 'loading Loaction...';
        ui.loadingLabel.hidden= false;
        return new Promise(function(setFinish){
            var location= gamedata.locations[name];
            var images= [];
            var cout= location.length;
            var done= 0;
            
            var check= function(){
                done++;
                if(done == cout){
                    loadImages(images).then(function(){
                        ui.loadingLabel.hidden= true;
                        setFinish(); 
                    });
                }
            };
            
            if(gamedata.scenes.length > 0)
                gamedata.scenes= [];
            location.forEach(function(item){
                request(item).then(function(data){
                    if(item.indexOf('.json') > -1){
                        data= JSON.parse(data);
                        for(var i in data.scenes){
//                          prepare scene
                            let scene= data.scenes[i];
                        
                            if(scene.images){
                                for(var j= 0; j<scene.images.length; j++){
                                    scene.images[j]= data.images[scene.images[j]];
                                }
                            }
                        
                            if(scene.outfits){
                                for(var j in scene.outfits){
                                    scene.outfits[j]= data.images[scene.outfits[j]];
                                }
                            }
//                          add scene
                            if(!gamedata.scenes[i])
                                gamedata.scenes[i]= scene;
                            else
                                $$.console.error('scene "'+i+'" does already exist!');
                        }   
//                      add images
                        data.images.forEach(function(item){
                            if(images.indexOf(item) < 0)
                                images.push(item);
                        });
                    }else if(item.indexOf('.js') > -1){
                        data= new Function(data)();
                        for(var i in data){
                            gamedata.actions[i]= data[i];
                        }
                    }
                        check();
                });
            });
        });
    };
    
    this.goToScene= function(name){
        
//      select scene
        if(!gamedata.scenes[name]){
            $$.console.error('scene "'+name+'" does not exist!');
            return false;
        }
            
        gamedata.activeScene= gamedata.scenes[name]; 
        gamedata.sceneName= name;
        var scene= gamedata.activeScene;
        
//      init scene
        if(gamedata.actions[name] && gamedata.actions[name].__init__)
            gamedata.actions[name].__init__.apply(gamedata, [scene.actions]);

//      select scene image
        if(scene.imageSelection){
            let type= scene.imageSelection;
            if(type == 'outfit')
                ui.scene.source= gamedata.images[scene.outfits[getDateOutfit()]];
            
        }else if(scene.images.length < 2)
            ui.scene.source= gamedata.images[scene.images[0]];
        
        buildActionList(scene.actions, name);
        
        if(ui.scene.hidden)
            ui.scene.hidden= false;
    };
    
    this.playerSays= function(text){
        if(!this.playerTextLocked){
            if(text !== ''){
                var dateTextHeight= ui.canvas.measureTextHeight(ui.chatBox.date.content, 20);
                var lastTextHeight= ui.canvas.measureTextHeight(ui.chatBox.last.content, 20);
                var textHeight= ui.canvas.measureTextHeight(text, 20);
                var margin= 5;
                var space= 115;
                
                if(lastTextHeight + margin + dateTextHeight + margin + textHeight > space){
                    ui.chatBox.last.hidden= true;
                    ui.chatBox.date.y= 0;
                    ui.chatBox.player.y= dateTextHeight + margin;
                }
                if(dateTextHeight + margin + textHeight > space){
                    ui.chatBox.date.hidden= true;
                    ui.player.y= 0;
                }
                    
                ui.chatBox.player.content= gamedata.player.name + ': ' + text;
                ui.chatBox.player.x= (ui.canvas.width / 2) - (ui.canvas.measureText(ui.chatBox.player).width / 2);
                ui.chatBox.player.hidden= false;
            }else{
                ui.chatBox.player.hidden= true;
            }
        }
    };
    
    this.dateSays= function(text){
        gamedata.chatLog.push({ person : 'player', text : ui.chatBox.player.content });
        gamedata.chatLog.push({ person : 'date', text : text });
                
        var playerTextHeight= ui.canvas.measureTextHeight(ui.chatBox.player.content, 20);
        var textHeight= ui.canvas.measureTextHeight(text, 20);
        var margin= 5;
        var space= 115;
                
        if(ui.chatBox.player.content !== '' && (playerTextHeight + margin + textHeight) < space){
            ui.chatBox.last.content= ui.chatBox.player.content;
            ui.chatBox.last.x= ui.chatBox.player.x;
            ui.chatBox.last.y= 0;
            ui.chatBox.last.hidden= false;
            ui.chatBox.date.y= playerTextHeight + margin;
            ui.chatBox.player.y= playerTextHeight + margin + textHeight + margin;
        }else{
            ui.chatBox.last.hidden= true;
            ui.chatBox.date.y= 0;
            ui.chatBox.player.y= textHeight + 10;
        }
        ui.chatBox.date.content= gamedata.date.name + ': ' + text;
        ui.chatBox.date.x= (ui.canvas.width / 2) - (ui.canvas.measureText(ui.chatBox.date).width / 2);
        ui.chatBox.date.hidden= false;
        ui.chatBox.player.hidden= true;
    };
    
    this.addActions= function(){
        
    };
    
    var gamedata= {
        player : null,
        date : null,
        descriptions : null,
        friend : null,
        activeScene : null,
        sceneName : '',
        scenes : {},
        actions : {},
        locations : {},
        images : {},
        ui : null,
        chatLog: [],
        playerTextLocked : false,
        playerSays : this.playerSays,
        dateSays : this.dateSays,
        selectText : selectText,
        goToScene : this.goToScene
    };
    
    this.gamedata= gamedata;
});