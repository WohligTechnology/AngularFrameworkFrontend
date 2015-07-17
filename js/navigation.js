var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function () {
    var navigation = [{
        name: "Home",
        classis: "active",
        link:"#/home",
        subnav: []
    }, {
        name: "About",
        active: "",
        link:"#/about",
        subnav: []
    }, {
        name: "Services",
        classis: "",
        link:"#/services",
        subnav: []
    }, {
        name: "Portfolio",
        classis: "",
        link:"#/portfolio",
        subnav: []
    }, {
        name: "Contact",
        classis: "",
        link:"#/contact",
        subnav: []
    }];

    return {
        getnav: function() {
            return navigation;
        },
        makeactive: function(menuname) {
            for(var i=0;i<navigation.length;i++) {
                if(navigation[i].name==menuname)
                {
                    navigation[i].classis="active";
                }
                else {
                    navigation[i].classis="";
                }
            }
            return menuname;
        },
        
    }
});