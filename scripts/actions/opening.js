
return {
    'opening' : {
        'opening_introduce' : function(info){
            this.playerTextLocked= true;
            this.dateSays(this.selectText(info.responses));
            this.goToScene('gtn_first_stage');
            this.playerTextLocked= false;
            this.date.name= 'Ariane';
        }    
    }                      
}
