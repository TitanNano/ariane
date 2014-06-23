return {
    "gtn_first_stage" : {
        "compliment" : function(info){
            this.player.properties.nice++;
            this.date.mood.openness++;
            this.goToScene('gtn_second_stage', 'fade');
            this.dateSays(this.selectText(info.responses));
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
            this.goToScene('gtn_second_stage', 'fade');
            this.dateSays(this.selectText(info.responses));
        }
    },
    "gtn_hug" : {
        "end_hug" : function(info){
            this.goToScene('gtn_second_stage');
            this.dateSays(this.selectText(info.responses));
        }
    },
    "gtn_second_stage" : {
        "first_kiss" : function(){
            this.goToScene('gtn_first_kiss');  
        },
        "select_poem" : function(){
            this.goToScene('gtn_select_poem', 'fade');
        }
    },
    "gtn_first_kiss" : {
        "end_kiss" : function(info){
            this.goToScene('gtn_after_first_kiss');
            this.dateSays(this.selectText(info.responses));
        }
    },
    "gtn_after_first_kiss" : {
        "response" : function(info){
            this.player.properties[info.type]++;
            this.date.mood.openness++;
            this.goToScene('gtn_after_first_kiss_2a', 'fade');
            this.dateSays(this.selectText(info.responses));
        }
    },
    "gtn_select_poem" : {
        "read" : function(info){
            this.date.mood.openness++;
            this.player.properties[info.type]++;
            this.goToScene('gtn_after_poem', 'fade');
            this.dateSays(this.selectText(info.responses));
        }
    }
};