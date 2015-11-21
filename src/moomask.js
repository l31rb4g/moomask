MooMask = new Class({
    Implements: Options,

    options: {
        'numeric': false,
        'uppercase': false,
        'mask': ''
    },

    initialize: function(element, options){
        this.element = element;
        this.setOptions(options);
        this.apply();
    },

    apply: function(){
        this.initial_value = this.element.get('value');
        this.element.addEvents({
            'keyup': function(ev){
                if (this.options.uppercase){
                    if (this.element.get('value') != this.initial_value) {
                        this.element.setStyle('text-transform', 'uppercase');
                    }
                }
                if (!this.isNeutral(ev)){
                    this.scan();
                }
            }.bind(this),
            'keydown': function(ev){
                if (this.options.numeric){
                    if (!ev.key.match(/[0-9]+/) && !this.isNeutral(ev)){
                        ev.target.set('value', ev.target.get('value').replace(/[^0-9]+/, ''));
                        ev.stop();
                    }
                }
                if (this.options.mask){
                    var v = this.element.get('value');
                    if (!this.isValid(ev.key, v.length)) {
                        if (!this.isNeutral(ev)) {
                            var m = this.options.mask.substr(this.element.get('value').length, 1);
                            if (!['A', '0'].contains(m)) {
                                if (this.element.get('value').length < this.options.mask.length) {
                                    if (this.isValid(ev.key, this.element.get('value').length + 1)) {
                                        var ch = (this.options.mask.substr(this.element.get('value').length, 1));
                                        this.element.set('value', this.element.get('value') + ch + ev.key)
                                    }
                                }
                            }

                            ev.preventDefault();
                        }
                    }
                }
            }.bind(this),
            'focus': function(){
                if (this.element.get('value') == this.initial_value) {
                    this.element.set('value', '');
                }
            }.bind(this),
            'blur': function(){
                if (this.element.get('value') == '') {
                    this.element.set('value', this.initial_value);
                }
            }.bind(this)
        });
        this.element.set('autocomplete', 'off');
    },

    isNeutral: function(ev){
        if (!ev.control && !ev.shift) {
            if (!['delete', 'backspace', 'esc', 'left', 'right', 'home', 'end'].contains(ev.key)) {
                return false;
            }
        }
        return true;
    },

    scan: function(){
        var next = this.options.mask.substr(this.element.get('value').length, 1);
        if (!['A', '0'].contains(next)){
            this.element.set('value', this.element.get('value') + next);
        }
    },

    isValid: function(char, pos){
        var m = this.options.mask.substr(pos, 1);
        if (m == 'A') {
            return char.match(/[a-zA-Z]/);
        } else if (m == '0') {
            return char.match(/[0-9]/);
        }
        return false;
    }
});


Element.prototype.moomask = function(options){
    new MooMask(this, options);
};

