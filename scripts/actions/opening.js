
return {
    'opening' : {
        'opening_introduce' : function(info){
            this.dateSays(this.selectText(info.responses));
            this.goToScene('gtn_first_stage', 'black');
            this.date.name= 'Ariane';
        }    
    }                      
}
