return {
    "gtn_first_stage" : {
        "compliment" : function(info){
            this.player.properties.nice++;
            this.date.mood.openness++;
            this.dateSays(this.selectText(info.responses));
            this.goToScene('gtn_second_stage', 'fade');
        },
        "hug" : function(){
            this.player.properties.sexy++;
            this.date.mood.openness++;
            this.goToScene('gtn_hug');
        },
        "say_smart" : function(info){
            this.player.properties.smart++;
            this.date.mood.openness++;
            this.dateSays(this.selectText(info.responses));
            this.goToScene('gtn_second_stage', 'fade');
        },
        "say_funny" : function(info){
            this.player.properties.funny++;
            this.date.mood.openness++;
            this.dateSays(this.selectText(info.responses));
            this.goToScene('gtn_second_stage', 'fade');
        }
    },
    "gtn_hug" : {
        "end_hug" : function(info){
            this.dateSays(this.selectText(info.responses));
            this.goToScene('gtn_second_stage');
        }
    }
};