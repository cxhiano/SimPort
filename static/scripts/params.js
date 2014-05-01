var instr = new Instruction(
    {
        instr: 'config',
        param: 'port.maxStacks',
        value: '6',
    },

    function(ars) {

    }
);

instr = new Instruction(
    {
        instr: 'getParam',
        param: 'port.field.rows',
    },

    function(args) {
        return {
            status: Instruction.status.OK,
            value: Params.get(args.param),
        };
    }
);

Params = {
    _getAttr: function(obj, attr) {
        var ret = obj[attr];
        if (ret === undefined) {
            throw new Error('No such param');
        }
        return ret;
    },

    get: function(param) {
        var ret = window;
        param.split('.').forEach(function(attr) {
            ret = Params._getAttr(ret, attr);
        });
        return ret;
    },

    set: function(param, value) {
        var p = window,
            attrs = param.split('.'),
            l = attrs.length;
        attrs.slice(0, l - 1).forEach(function(attr) {
            p = Params._getAttr(p, attr);
        });
        p[attrs[l - 1]] = value;
    },

};